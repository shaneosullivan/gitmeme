import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import handleOauthRedirect from "./handleOauthRedirect";

const firebaseApp = admin.initializeApp();
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
  console.log("authHeader", authHeader);

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

    const userId = parts[0];
    const token = parts[1];

    console.log(
      "Got authHeaderContents",
      authHeaderContents,
      " userId ",
      userId,
      " token ",
      token
    );

    if (userId && token) {
      const userDoc = await firestore
        .collection("users")
        .doc(userId)
        .get();

      if (userDoc.exists) {
        const data = userDoc.data();

        if (data && data.token === token) {
          (req as any)["_user"] = data;
          console.log("User successfully authenticated");

          next();
          return;
        }
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

app.get("/search", (req: AppRequest, res: express.Response) => {
  console.log("Search called with ", req.query);
  const searchTerm = req.query["t"];

  let url = null;
  switch (searchTerm) {
    case "foo":
      url = "https://joinpromise.com/assets/media/Measure_Efficacy.svg";
      break;

    case "bar":
      url = "https://payticket.io/static/images/logos/epa_logo.jpg";
      break;

    case "shipit":
      url = "https://media.giphy.com/media/79qf1N4RJtc8o/giphy.gif";
      break;
    default:
  }

  res.json({ url });
});

app.post("add_token_by_url", (req: AppRequest, res: express.Response) => {
  const imageUrl = req.body.image_url;
  const token = req.body.token;

  console.log(
    "got add_token_by_url post with body",
    req.body,
    "imageUrl",
    imageUrl,
    "token",
    token
  );
});

export const api = functions.https.onRequest(app);

export const oauth = functions.https.onRequest(async (req, res) => {
  await handleOauthRedirect(req, res, firestore);
});
