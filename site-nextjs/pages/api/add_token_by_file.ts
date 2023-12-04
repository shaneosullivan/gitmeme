import checkUserIsUnauthorized from "../../lib/api/checkUserIsUnauthorized";
import { NextApiRequest, NextApiResponse } from "next";
import getFirestore from "../../lib/api/getFirestore";
import sendError from "../../lib/api/sendError";
import { saveFileFromFile } from "../../lib/api/storage/saveFileFromFile";

// @ts-ignore
import formidable from "formidable-serverless";

import { BagOfStuff } from "@/lib/api/types";
import { getStringValue } from "@/lib/util/getStringValue";
import getArray from "@/lib/util/getArray";
import unlinkFiles from "@/lib/util/unlinkFiles";
import { runCorsMiddleware } from "@/lib/api/runCorsMiddleware";

export const config = {
  api: {
    bodyParser: false, // Disabling automatic parsing of the request body
  },
};

// This API accepts a file as an upload, stores it and associates it with a token string.
export default async function addTokenByFileApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runCorsMiddleware(req, res);

  if ((req.method || "").toUpperCase() !== "POST") {
    res.status(405); // Invalid method
    res.end();
    return;
  }

  /*
  // For testing....
{
    "status": "success",
    "image_url": "https://storage.googleapis.com/download/storage/v1/b/git-meme-prod.appspot.com/o/uploads%2Fawesome_1699964279700.jpg?generation=1699964280684236&alt=media"
}
  res.status(200);

  res.json({
    status: "success",
    image_url:
      "https://storage.googleapis.com/download/storage/v1/b/git-meme-prod.appspot.com/o/uploads%2Fawesome_1699964279700.jpg?generation=1699964280684236&alt=media",
  });

  return;
  */

  const { error: authError, user } = await checkUserIsUnauthorized(req);

  if (authError) {
    // No permission, must be logged in
    res.status(403);
    res.end();
    return;
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = "/tmp/";
  form.keepExtensions = true;
  form.type = "multipart";
  form.multiples = true;

  return new Promise<void>((resolve) => {
    console.log("parsing form");
    form.parse(req, async (err: any, fields: BagOfStuff, files: BagOfStuff) => {
      try {
        const token = getStringValue(fields.token);
        const context = getStringValue(fields.context);

        console.log("token", token, "err", err);

        if (err) {
          sendError(res, {
            status: 400,
            body: {
              error: `File upload failed: ${err}`,
            },
          });
          return;
        }

        if (!token) {
          sendError(res, {
            status: 400,
            body: {
              error: `The 'token' parameter is required, got token "${token}" `,
            },
          });
          return;
        }

        if (!files.file) {
          sendError(res, {
            status: 400,
            body: {
              error: `No file was uploaded`,
            },
          });
          return;
        }

        console.log("upload files ", Object.keys(files));

        const filePath = getArray(files.file)[0].path;

        console.log("got local file path", filePath);

        const userId = user ? user.uid : "";
        const now = new Date();

        let localUrl: string;
        let storagePath: string;

        try {
          // Upload the file to storage
          const { url: newLocalUrl, storagePath: newStoragePath } =
            await saveFileFromFile(filePath, token, userId);
          localUrl = newLocalUrl;
          storagePath = newStoragePath;

          console.log(
            "stored image at ",
            newLocalUrl,
            " storage path",
            newStoragePath
          );
        } catch (err) {
          console.error("Failed to upload image and store it", err);
          sendError(res, {
            status: 415,
            body: {
              error: "Failed to upload image",
            },
          });
          return;
        }

        const getImageId = function (url: string) {
          return url.split("/").join("_");
        };

        const storeGlobalImage = async function () {
          const collection = getFirestore().collection("all_images");

          const docRef = collection.doc(getImageId(localUrl));

          console.log(
            "storeGlobalImage updating global image for  ",
            token,
            " to doc ",
            docRef.id
          );

          await docRef.set({
            image_url: localUrl,
            storage_path: storagePath || null,
            count: 1,
            token,
            updated_at: now,
            created_at: now,
            uploaded_by: userId,
          });
        };

        await storeGlobalImage();

        const promises: Array<Promise<void>> = [];

        const storeForUser = async function () {
          const docId = `${userId}_${token}`;
          console.log("storeForUser docId", docId);

          const existingDoc = await getFirestore()
            .collection("user_tokens")
            .doc(docId)
            .get();

          if (existingDoc.exists) {
            await existingDoc.ref.update({
              count: existingDoc.get("count") + 1,
              image_url: localUrl,
              updated_at: new Date(),
            });
          } else {
            await existingDoc.ref.set({
              user: getFirestore().collection("users").doc(userId),
              count: 1,
              group: null,
              token,
              image_url: localUrl,
              updated_at: now,
              created_at: now,
            });
          }
        };

        if (!authError) {
          // If the user is logged in, store the message in their
          // private data
          promises.push(storeForUser());
        }

        const storeGlobalToken = async function () {
          const collection = getFirestore().collection("all_tokens");
          const existingDoc = await collection.doc(token).get();

          if (existingDoc.exists) {
            console.log(
              "storeGlobalToken updating count to ",
              existingDoc.get("count") + 1,
              " for ",
              token
            );
            await existingDoc.ref.update({
              count: existingDoc.get("count") + 1,
              image_url: localUrl,
              updated_at: now,
            });
          } else {
            console.log("storeGlobalToken adding new count for ", token);
            await existingDoc.ref.set({
              image_url: localUrl,
              count: 1,
              token,
              updated_at: now,
              created_at: now,
            });
          }
        };

        const storeContextToken = async function () {
          const collection = getFirestore().collection("context_tokens");
          const docId = `${context}_${token}`;
          const existingDoc = await collection.doc(docId).get();

          if (existingDoc.exists) {
            console.log(
              "storeContextToken updating count for context (",
              context,
              ") and token ",
              token,
              " to be ",
              existingDoc.get("count") + 1
            );

            await existingDoc.ref.update({
              count: existingDoc.get("count") + 1,
              image_url: localUrl,
              updated_at: now,
            });
          } else {
            console.log(
              "storeContextToken adding a new count for context (",
              context,
              ") and token ",
              token
            );
            await existingDoc.ref.set({
              image_url: localUrl,
              context,
              count: 1,
              token,
              updated_at: now,
              created_at: now,
            });
          }
        };

        const storeContextImage = async function () {
          const collection = getFirestore().collection("context_images");
          const collectionSnapshot = await collection
            .where("token", "==", token)
            .where("context", "==", context)
            .get();

          if (!collectionSnapshot.empty) {
            // There should only be one doc
            const existingDoc = collectionSnapshot.docs[0];

            console.log(
              "storeContextImage updating the count for context (",
              context,
              ") and token ",
              token,
              " to be ",
              existingDoc.get("count") + 1
            );

            await existingDoc.ref.update({
              count: existingDoc.get("count") + 1,
              updated_at: now,
            });
          } else {
            console.log(
              "storeContextImage adding new count for context (",
              context,
              ") and token ",
              token
            );
            await collection.doc().set({
              image_url: localUrl,
              context,
              count: 1,
              token,
              created_at: now,
              updated_at: now,
            });
          }
        };

        promises.push(storeGlobalToken());

        if (context) {
          promises.push(storeContextToken());
          promises.push(storeContextImage());
        }

        await Promise.all(promises);

        res.status(200);

        res.json({ status: "success", image_url: localUrl });

        // ======

        await unlinkFiles(files);
      } catch (err: any) {
        console.error("Error uploading a single image", err.message, err.stack);
        res.json({
          error: err.message,
        });

        await unlinkFiles(files);
      }
      res.end();
      resolve();
    });
  });
}
