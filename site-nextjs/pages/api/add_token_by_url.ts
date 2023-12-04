import checkUserIsUnauthorized from "../../lib/api/checkUserIsUnauthorized";
import getFirestore from "../../lib/api/getFirestore";
import { runCorsMiddleware } from "../../lib/api/runCorsMiddleware";
import sendError from "../../lib/api/sendError";
import { NextApiRequest, NextApiResponse } from "next";

// This API records the usage of any given token.
// It records it in a counter for all tokens globally
// It records it in a counter for the current user, if they are logged in
// It records it in a counter for the current repository.
export default async function addTokenByUrlApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runCorsMiddleware(req, res);

  if ((req.method || "").toUpperCase() !== "POST") {
    res.status(405); // Invalid method
    res.end();
    return;
  }

  const { error: authError, user } = await checkUserIsUnauthorized(req);

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const imageUrl = body.image_url;
  const token = body.token;
  const context = body.context;

  if (!token || !imageUrl) {
    sendError(res, {
      status: 400,
      body: {
        error: `Both the 'token' and the 'image_url' parameters are required, got token "${token}" and image_url "${imageUrl}"`,
      },
    });
    return;
  }

  const now = new Date();
  const userId = user ? user.uid : "";

  const allImagesCollection = getFirestore().collection("all_images");
  let existingGlobalImageDocCollectionSnapshot = await allImagesCollection
    .where("image_url_original", "==", imageUrl)
    .get();

  if (existingGlobalImageDocCollectionSnapshot.empty) {
    existingGlobalImageDocCollectionSnapshot = await allImagesCollection
      .where("image_url", "==", imageUrl)
      .get();
  }

  let localUrl: string;
  let storagePath: string;
  if (existingGlobalImageDocCollectionSnapshot.empty) {
    localUrl = imageUrl;

    await storeGlobalImage(true);
  } else {
    localUrl =
      existingGlobalImageDocCollectionSnapshot.docs[0].get("image_url");
    await storeGlobalImage(false);
  }

  const promises: Array<Promise<void>> = [];

  if (!authError) {
    const storeForUser = async () => {
      const docId = `${userId}_${token}`;

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
        updated_at: now,
      });
    } else {
      await existingDoc.ref.set({
        image_url: localUrl,
        count: 1,
        token,
        updated_at: now,
        created_at: now,
      });
    }
  }

  async function storeGlobalImage(createNew: boolean) {
    const collection = getFirestore().collection("all_images");

    if (!createNew) {
      const existingDoc = existingGlobalImageDocCollectionSnapshot.docs[0];

      await existingDoc.ref.update({
        count: existingDoc.get("count") + 1,
        image_url_original: imageUrl,
        token,
        updated_at: now,
      });
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
        uploaded_by: userId,
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
        updated_at: now,
      });
    } else {
      await existingDoc.ref.set({
        image_url_original: imageUrl,
        image_url: localUrl,
        context,
        count: 1,
        token,
        updated_at: now,
        created_at: now,
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
        updated_at: now,
      });
    } else {
      await collection.doc().set({
        image_url_original: imageUrl,
        image_url: localUrl,
        context,
        count: 1,
        token,
        created_at: now,
        updated_at: now,
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
