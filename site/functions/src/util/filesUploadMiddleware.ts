import * as express from "express";
import * as Busboy from "busboy";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";

export interface FileInfo {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export default function filesUploadMiddleware(
  req: express.Request,
  res: express.Response,
  next: Function
) {
  // See https://cloud.google.com/functions/docs/writing/http#multipart_data
  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      // Cloud functions impose this restriction anyway
      fileSize: 10 * 1024 * 1024
    }
  });

  const fields: { [key: string]: any } = {};
  const files: Array<FileInfo> = [];
  const fileWrites: Array<Promise<any>> = [];
  // Note: os.tmpdir() points to an in-memory file system on GCF
  // Thus, any files in it must fit in the instance's memory.
  const tmpdir = os.tmpdir();

  busboy.on("field", (key, value) => {
    // You could do additional deserialization logic here, values will just be
    // strings
    fields[key] = value;
  });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const filepath = path.join(tmpdir, filename);
    console.log(
      `Handling file upload field ${fieldname}: ${filename} (${filepath})`
    );
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    fileWrites.push(
      new Promise((resolve, reject) => {
        file.on("end", () => writeStream.end());
        writeStream.on("finish", () => {
          fs.readFile(filepath, (err, buffer) => {
            const size = Buffer.byteLength(buffer);
            console.log(`${filename} is ${size} bytes`);
            if (err) {
              return reject(err);
            }

            files.push({
              fieldname,
              originalname: filename,
              encoding,
              mimetype,
              buffer,
              size
            });

            try {
              fs.unlinkSync(filepath);
            } catch (error) {
              return reject(error);
            }

            resolve();
          });
        });
        writeStream.on("error", reject);
      })
    );
  });

  busboy.on("finish", () => {
    Promise.all(fileWrites)
      .then(() => {
        req.body = fields;
        (req as any)["files"] = files;
        next();
      })
      .catch(_err => {
        next();
      });
  });

  busboy.end((req as any)["rawBody"]);
}
