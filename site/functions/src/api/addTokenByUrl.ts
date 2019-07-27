import { AppRequest, AppResponse } from "./apiTypes";

import checkUserIsUnauthorized from "./checkUserIsUnauthorized";

import sendError from "../util/sendError";

import getFirestore from "../util/getFirestore";
import { saveFileFromUrl } from "../storage/saveFileFromUrl";
import multipartRequest from "../util/multipartRequest";

export default async function apiAddTokenByUrl(
  req: AppRequest,
  res: AppResponse
) {
  console.log("in apiAddTokenByUrl and files:", (req as any)["files"]);
  const authError = await checkUserIsUnauthorized(req);

  const userId = req._user ? req._user.uid : "";
  const formInfo = await multipartRequest(req, userId, !authError);

  const body = formInfo.fields;

  let imageUrl = body.image_url;
  const token = body.token;
  const context = body.context;
  const imageFile = body.image_file;

  if (!token || (!imageUrl && !imageFile)) {
    sendError(res, {
      status: 400,
      body: {
        error: `Both the 'token' and either the 'image_url' or 'image_file' parameters are required, got token "${token}" and image_url "${imageUrl}"`
      }
    });
    return;
  }

  const now = new Date();
  let existingImageDocSnapshot: FirebaseFirestore.QueryDocumentSnapshot | null = null;

  if (!imageFile) {
    const allImagesCollection = getFirestore().collection("all_images");
    let existingGlobalImageDocCollectionSnapshot = await allImagesCollection
      .where("image_url_original", "==", imageUrl)
      .get();

    if (existingGlobalImageDocCollectionSnapshot.empty) {
      existingGlobalImageDocCollectionSnapshot = await allImagesCollection
        .where("image_url", "==", imageUrl)
        .get();
    }
    existingImageDocSnapshot = !existingGlobalImageDocCollectionSnapshot.empty
      ? existingGlobalImageDocCollectionSnapshot.docs[0]
      : null;
  }

  let localUrl: string;
  let storagePath: string;
  if (!existingImageDocSnapshot) {
    if (imageFile) {
      // If the user uploaded an image, it's already in storage
      localUrl = imageFile;
      imageUrl = imageFile;
    } else if (imageUrl.indexOf("giphy.com/") > 0) {
      // If it's a Giphy.com url, don't save it to storage
      localUrl = imageUrl;
    } else {
      // If we haven't already uploaded this image, then upload it to storage
      try {
        const {
          url: newLocalUrl,
          storagePath: newStoragePath
        } = await saveFileFromUrl(
          imageUrl,
          token,
          req["_user"] ? req["_user"].uid : ""
        );
        localUrl = newLocalUrl;
        storagePath = newStoragePath;
      } catch (err) {
        console.error("Failed to download image and store it", imageUrl, err);
        sendError(res, {
          status: 415,
          body: {
            error: "Invalid url is not an image: " + imageUrl
          }
        });
        return;
      }
    }

    await storeGlobalImage(true);
  } else {
    localUrl = existingImageDocSnapshot.get("image_url");
    await storeGlobalImage(false);
  }

  const promises: Array<Promise<void>> = [];

  if (!authError) {
    async function storeForUser() {
      const docId = `${userId}_${token}`;

      const existingDoc = await getFirestore()
        .collection("user_tokens")
        .doc(docId)
        .get();

      if (existingDoc.exists) {
        await existingDoc.ref.update({
          count: existingDoc.get("count") + 1,
          image_url: localUrl,
          updated_at: new Date()
        });
      } else {
        await existingDoc.ref.set({
          user: getFirestore()
            .collection("users")
            .doc(userId),
          count: 1,
          group: null,
          token,
          image_url: localUrl,
          updated_at: now,
          created_at: now
        });
      }
    }

    // If the user is logged in, store the message in their
    // private data
    promises.push(storeForUser());
  }

  function getImageId(url: string) {
    return url.split("/").join("_");
  }

  async function storeGlobalToken() {
    const collection = getFirestore().collection("all_tokens");
    const existingDoc = await collection.doc(token).get();

    if (existingDoc.exists) {
      await existingDoc.ref.update({
        count: existingDoc.get("count") + 1,
        image_url: localUrl,
        updated_at: now
      });
    } else {
      await existingDoc.ref.set({
        image_url: localUrl,
        count: 1,
        token,
        updated_at: now,
        created_at: now
      });
    }
  }

  async function storeGlobalImage(createNew: boolean) {
    const collection = getFirestore().collection("all_images");

    if (!createNew) {
      const existingDoc = existingImageDocSnapshot;
      existingDoc &&
        (await existingDoc.ref.update({
          count: existingDoc.get("count") + 1,
          image_url_original: imageUrl,
          token,
          updated_at: now
        }));
    } else {
      const docRef = collection.doc(getImageId(localUrl));
      await docRef.set({
        image_url: localUrl,
        image_url_original: imageUrl,
        storage_path: storagePath || null,
        count: 1,
        token,
        updated_at: now,
        created_at: now,
        uploaded_by: userId
      });
    }
  }

  async function storeContextToken() {
    const collection = getFirestore().collection("context_tokens");
    const docId = `${context}_${token}`;
    const existingDoc = await collection.doc(docId).get();

    if (existingDoc.exists) {
      await existingDoc.ref.update({
        count: existingDoc.get("count") + 1,
        image_url: localUrl,
        updated_at: now
      });
    } else {
      await existingDoc.ref.set({
        image_url_original: imageUrl,
        image_url: localUrl,
        context,
        count: 1,
        token,
        updated_at: now,
        created_at: now
      });
    }
  }

  async function storeContextImage() {
    const collection = getFirestore().collection("context_images");
    const collectionSnapshot = await collection
      .where("image_url_original", "==", imageUrl)
      .where("token", "==", token)
      .where("context", "==", context)
      .get();

    if (!collectionSnapshot.empty) {
      // There should only be one doc
      const existingDoc = collectionSnapshot.docs[0];
      await existingDoc.ref.update({
        count: existingDoc.get("count") + 1,
        updated_at: now
      });
    } else {
      await collection.doc().set({
        image_url_original: imageUrl,
        image_url: localUrl,
        context,
        count: 1,
        token,
        created_at: now,
        updated_at: now
      });
    }
  }

  promises.push(storeGlobalToken());

  if (context) {
    promises.push(storeContextToken());
    promises.push(storeContextImage());
  }

  await Promise.all(promises);

  res.json({ status: "success", image_url: localUrl });
}
