import { AppRequest, AppResponse } from "./apiTypes";

import checkUserIsUnauthorized from "./checkUserIsUnauthorized";

import sendError from "../util/sendError";

import getFirestore from "../util/getFirestore";

export default async function apiAddTokenByUrl(
  req: AppRequest,
  res: AppResponse
) {
  const authError = await checkUserIsUnauthorized(req);

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const imageUrl = body.image_url;
  const token = body.token;
  const context = body.context;

  if (!token || !imageUrl) {
    sendError(res, {
      status: 400,
      body: {
        error: `Both the 'token' and the 'image_url' parameters are required, got token "${token}" and image_url "${imageUrl}"`
      }
    });
    return;
  }

  const now = new Date();

  const promises: Array<Promise<void>> = [];

  if (!authError) {
    const userId = req._user ? req._user.uid : "";

    async function storeForUser() {
      const docId = `${userId}_${token}`;

      const existingDoc = await getFirestore()
        .collection("user_tokens")
        .doc(docId)
        .get();

      if (existingDoc.exists) {
        await existingDoc.ref.update({
          count: existingDoc.get("count") + 1,
          image_url: imageUrl,
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
          image_url: imageUrl,
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
        image_url: imageUrl,
        updated_at: now
      });
    } else {
      await existingDoc.ref.set({
        image_url: imageUrl,
        count: 1,
        token,
        updated_at: now,
        created_at: now
      });
    }
  }

  async function storeGlobalImage() {
    const collection = getFirestore().collection("all_images");
    const existingDoc = await collection.doc(getImageId(imageUrl)).get();

    if (existingDoc.exists) {
      await existingDoc.ref.update({
        count: existingDoc.get("count") + 1,
        token,
        updated_at: now
      });
    } else {
      await existingDoc.ref.set({
        image_url: imageUrl,
        count: 1,
        token,
        updated_at: now,
        created_at: now
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
        image_url: imageUrl,
        updated_at: now
      });
    } else {
      await existingDoc.ref.set({
        image_url: imageUrl,
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
      .where("image_url", "==", imageUrl)
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
        image_url: imageUrl,
        context,
        count: 1,
        token,
        created_at: now,
        updated_at: now
      });
    }
  }

  promises.push(storeGlobalToken());
  promises.push(storeGlobalImage());

  if (context) {
    promises.push(storeContextToken());
    promises.push(storeContextImage());
  }

  await Promise.all(promises);

  res.json({ status: "success" });
}
