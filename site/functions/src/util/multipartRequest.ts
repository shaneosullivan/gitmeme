import * as express from "express";
// @ts-ignore
import * as devNull from "dev-null";

// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.
import * as Busboy from "busboy";
import { getStorage } from "./getFirestore";
import getMimeType from "./getMimeType";

interface Result {
  files: { [key: string]: any };
  fields: { [key: string]: any };
}
// type Callback = (result: Result) => Promise<void>;

export default async function multipartRequest(
  req: express.Request,
  user: string | null,
  canUploadFile: boolean
): Promise<Result> {
  return new Promise((resolveFinal, rejectFinal) => {
    const ret: Result = {
      files: {},
      fields: {}
    };

    function finalResolve() {
      resolveFinal(ret);
    }

    if (req.method !== "POST") {
      // Return a "method not allowed" error
      finalResolve();
      return;
    }
    const busboy = new Busboy({ headers: req.headers });

    // This object will accumulate all the fields, keyed by their name
    const fields = ret.fields;

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = ret.files;

    // This code will process each non-file field in the form.
    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    const fileWrites: Array<Promise<any>> = [];
    let wasRejected = false;

    // This code will process each file uploaded.
    busboy.on("file", (fieldname, file, filename) => {
      if (!canUploadFile) {
        if (!wasRejected) {
          wasRejected = true;
          rejectFinal();
        }
        file.pipe(devNull());

        return;
      }
      // If the field input is empty, the filename variable will be empty
      if (filename) {
        const storage = getStorage();
        const bucket = storage.bucket();

        const filePath = "uploads/" + Date.now() + "_" + filename;

        const fileRef = bucket.file(filePath);
        const mimeType = getMimeType(filename);

        const writeStream = fileRef.createWriteStream({
          metadata: {
            contentType: mimeType
          },
          resumable: false
        });

        // const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        // File was processed by Busboy; wait for it to be written to disk.
        const promise = new Promise((resolve, reject) => {
          file.on("end", async () => {
            writeStream.end();
            await fileRef.makePublic();
            const metadata = await fileRef.getMetadata();
            const fileInfo = metadata[0];

            const publicUrl = fileInfo.mediaLink;
            uploads[fieldname] = publicUrl;

            await fileRef.setMetadata({
              customMetadata: {
                creator: user
              }
            });

            resolve();
          });
          // writeStream.on("finish", () => {});
          writeStream.on("error", err => {
            console.error("writeStream error", err);
            reject(err);
          });
        });
        fileWrites.push(promise);
      } else {
        // If there is no file uploaded, just an empty file object, pipe it
        // to dev/null so the request will complete with Busboy
        file.pipe(devNull());
      }
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on("finish", async () => {
      if (fileWrites.length > 0) {
        await Promise.all(fileWrites).then(finalResolve);
      } else {
        finalResolve();
      }
    });

    busboy.end((req as any)["rawBody"]);
  });
}
