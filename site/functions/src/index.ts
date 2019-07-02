import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
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

// Allow cross origin requests
app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());

app.use(async (req: AppRequest, res: express.Response, next: Function) => {
  // Validate the user
  const authHeader = req.headers["authorization"];
  console.log("authorizing for route", req.originalUrl);

  if (!authHeader) {
    res.status(403).json({ error: "No credentials sent!" });
    return;
  }

  if (authHeader.indexOf("Bearer ") === 0) {
    const authHeaderContents = (Array.isArray(authHeader)
      ? authHeader[0]
      : authHeader
    ).substring(authHeader.indexOf(" "));

    const parts = authHeaderContents.split("___");

    const userId = parts[0].trim();
    const authToken = parts[1].trim();

    console.log(
      "Got authHeaderContents",
      authHeaderContents,
      " userId ",
      userId,
      " token ",
      authToken
    );

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

          next();
          return;
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
  res.status(401).send("User not authorized"); // Not authorized
});

app.get("/", (_req: express.Request, resp: express.Response) => {
  resp.json({
    url: "https://joinpromise.com/assets/media/Measure_Efficacy.svg"
  });
});

app.get("/search", async (req: AppRequest, res: express.Response) => {
  console.log("Search called with ", req.query);
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
    const imageUrl = req.body.image_url;
    const token = req.body.token;

    const userId = req._user ? req._user.uid : "";
    const docId = `${userId}_${token}`;

    await firestore
      .collection("user_tokens")
      .doc(docId)
      .set({
        user: firestore.collection("users").doc(userId),
        group: null,
        token,
        image_url: imageUrl,
        created_at: new Date()
      });

    res.json({ status: "success" });
  }
);

export const api = functions.https.onRequest(app);

export const oauth = functions.https.onRequest(async (req, res) => {
  await handleOauthRedirect(req, res, firestore);
});
