import { getStorage } from "../util/getFirestore";
import * as https from "https";

// @ts-ignore
import * as requestImageSize from "request-image-size";
import getMimeType from "../util/getMimeType";

export async function saveFileFromUrl(
  url: string,
  fileNameSuggestion: string,
  userName: string
): Promise<{
  url: string;
  storagePath: string;
}> {
  return new Promise(async (resolve, reject) => {
    // Validate that the url actually is an image first
    try {
      await requestImageSize(url);
      console.log("it is an image!!");
    } catch (err) {
      console.error(err);
      reject("URL is not an image");
      return;
    }

    // Get file name from url.

    const periodIdx = url.lastIndexOf(".");
    const slashIdx = url.lastIndexOf("/");

    let mimeType = getMimeType(url) || "image/jpeg";

    let fileExtension = "jpg";

    if (periodIdx > slashIdx) {
      fileExtension = url.substring(periodIdx + 1).toLowerCase();
    }

    const fileName =
      fileNameSuggestion + "_" + Date.now() + "." + fileExtension;

    const storage = getStorage();

    const bucket = storage.bucket();
    const filePath = "uploads/" + fileName;

    const fileRef = bucket.file(filePath);

    console.log("Getting the file with http");
    https.get(url, response => {
      console.log("Got the http response");
      const stream = fileRef.createWriteStream({
        metadata: {
          contentType: mimeType
        },
        resumable: false
      });

      stream.on("error", err => {
        console.error("Upload error", err);
        reject(err);
      });

      stream.on("finish", async () => {
        console.log("==> Upload Finished!!");
        try {
          await fileRef.makePublic();
          const metadata = await fileRef.getMetadata();
          //   console.log("metadata is ", metadata);
          const fileInfo = metadata[0];

          await fileRef.setMetadata({
            customMetadata: {
              creator: userName
            }
          });

          const publicUrl = fileInfo.mediaLink;

          resolve({
            url: publicUrl,
            storagePath: filePath
          });
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });

      response.pipe(stream);
    });
  });
}
