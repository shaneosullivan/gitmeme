import { getStorage } from "../getFirestore";
import fs from "fs";

export async function saveFileFromFile(
  tempFilePath: string,
  fileNameSuggestion: string,
  userName: string
): Promise<{
  url: string;
  storagePath: string;
}> {
  return new Promise(async (resolve, reject) => {
    // Get file name from url.

    const periodIdx = tempFilePath.lastIndexOf(".");
    const slashIdx = tempFilePath.lastIndexOf("/");

    let mimeType = "image/jpeg";

    let fileExtension = "jpg";

    if (periodIdx > slashIdx) {
      fileExtension = tempFilePath.substring(periodIdx + 1).toLowerCase();

      switch (fileExtension) {
        case "jpg":
        case "jpeg":
          mimeType = "image/jpeg";
          break;
        case "png":
          mimeType = "image/png";
          break;
        case "gif":
          mimeType = "image/gif";
          break;
        case "webp":
          mimeType = "image/webp";
          break;
      }
    }

    console.log(
      "Downloading with mimeType",
      mimeType,
      " fileExtension",
      fileExtension
    );

    const fileName =
      fileNameSuggestion + "_" + Date.now() + "." + fileExtension;

    const storage = getStorage();

    const bucket = storage.bucket();
    const filePath = "uploads/" + fileName;

    const fileRef = bucket.file(filePath);

    const writeToBucketStream = fileRef.createWriteStream({
      metadata: {
        contentType: mimeType,
      },
      resumable: false,
    });

    writeToBucketStream.on("error", (err) => {
      console.error("Upload error", err);
      reject(err);
    });

    writeToBucketStream.on("finish", async () => {
      console.log("==> Upload Finished!!");
      try {
        await fileRef.makePublic();
        const metadata = await fileRef.getMetadata();
        //   console.log("metadata is ", metadata);
        const fileInfo = metadata[0];

        await fileRef.setMetadata({
          customMetadata: {
            creator: userName,
          },
        });

        const publicUrl = fileInfo.mediaLink;

        resolve({
          url: publicUrl,
          storagePath: filePath,
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });

    const fileInputStream = fs.createReadStream(tempFilePath);

    fileInputStream.pipe(writeToBucketStream);
  });
}
