import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import handleOauthRedirect from "./handleOauthRedirect";
import serviceAccount from "./auth/service_account";

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key
  })
});
const firestore = firebaseApp.firestore();

const app = express();

interface AppRequest extends express.Request {
  _user?: {
    uid: string;
    token: string;
    avatar: string;
  };
}

interface TopTokenItem {
  count: number;
  image_url: string;
  token: string;
}

// Allow cross origin requests
app.options("*", cors());
app.use(cors());

const checkUserIsUnauthorized = async (req: AppRequest) => {
  // Validate the user
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return {
      status: 403,
      body: { error: "No credentials sent!" }
    };
  }

  if (authHeader.indexOf("Bearer ") === 0) {
    const authHeaderContents = (Array.isArray(authHeader)
      ? authHeader[0]
      : authHeader
    ).substring(authHeader.indexOf(" "));

    const parts = authHeaderContents.split("___");

    const userId = parts[0].trim();
    const authToken = parts[1].trim();

    if (userId && authToken) {
      const userDoc = await firestore
        .collection("users")
        .doc(userId)
        .get();

      if (userDoc.exists) {
        const data = userDoc.data();

        if (data && data.auth_token === authToken) {
          (req as any)["_user"] = data;
          console.log("User successfully authenticated");

          return null;
        } else {
          console.log(
            `tokens do not match, ${data ? data.token : null} !== ${authToken}`
          );
        }
      } else {
        console.log("userDoc does not exist");
      }
    }
  }
  console.log("User failed authentication");
  // Not authorized
  return {
    status: 40,
    body: { error: "User not authorized" }
  };
};

function sendError(
  res: express.Response,
  err: { status: number; body: Object }
) {
  res.status(err.status).json(err.body);
}

// app.get("/", (_req: express.Request, resp: express.Response) => {
//   resp.json({
//     url: "https://joinpromise.com/assets/media/Measure_Efficacy.svg"
//   });
// });

app.get("/search", async (req: AppRequest, res: express.Response) => {
  const authError = await checkUserIsUnauthorized(req);
  if (authError) {
    sendError(res, authError);
    return;
  }
  const token = req.query["t"];

  const userId = req._user ? req._user.uid : "";
  const docId = `${userId}_${token}`;

  const userTokenDoc = await firestore
    .collection("user_tokens")
    .doc(docId)
    .get();

  let url = null;
  if (userTokenDoc.exists) {
    url = (userTokenDoc.data() || {}).image_url;
  }

  res.json({ url });
});

app.post(
  "/add_token_by_url",
  async (req: AppRequest, res: express.Response) => {
    const authError = await checkUserIsUnauthorized(req);
    const body = JSON.parse(req.body);

    const imageUrl = body.image_url;
    const token = body.token;

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

        const existingDoc = await firestore
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
            user: firestore.collection("users").doc(userId),
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

    async function storeGlobalToken() {
      const collection = firestore.collection("all_tokens");
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
      const collection = firestore.collection("all_images");
      const imageId = imageUrl.split("/").join("_");
      const existingDoc = await collection.doc(imageId).get();

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

    promises.push(storeGlobalToken());
    promises.push(storeGlobalImage());

    await Promise.all(promises);

    res.json({ status: "success" });
  }
);

app.get("/top_tokens", async (req: AppRequest, res: express.Response) => {
  const authError = await checkUserIsUnauthorized(req);

  const results = {
    user: [] as Array<TopTokenItem>,
    global: [] as Array<TopTokenItem>
  };
  const promises = [];

  function serialize(doc: FirebaseFirestore.DocumentSnapshot): TopTokenItem {
    const data = doc.data() || {};
    return {
      token: data.token,
      image_url: data.image_url,
      count: data.count
    };
  }

  if (!authError) {
    async function getUserTopTokens() {
      const userId = req._user ? req._user.uid : "";
      const userDocRef = firestore.collection("users").doc(userId);

      const userTokenDocs = await firestore
        .collection("user_tokens")
        .where("user", "==", userDocRef)
        .limit(5)
        .orderBy("count", "desc")
        .get();
      results.user = userTokenDocs.docs.map(serialize);
    }
    promises.push(getUserTopTokens());
  }

  async function getGlobalTopTokens() {
    const globalTokenDocs = await firestore
      .collection("all_tokens")
      .limit(5)
      .orderBy("count", "desc")
      .get();
    results.global = globalTokenDocs.docs.map(serialize);
  }

  promises.push(getGlobalTopTokens());

  await Promise.all(promises);

  res.json(results);
});

export const api = functions.https.onRequest(app);

export const oauth = functions.https.onRequest(async (req, res) => {
  await handleOauthRedirect(req, res, firestore);
});
