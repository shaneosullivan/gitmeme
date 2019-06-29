import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
// import * as cors from "cors";

admin.initializeApp();
// const firebaseApp = admin.initializeApp();
// const firestore = firebaseApp.firestore();

const app = express();

// const corsOptions = {
//   origin: (_: any, callback: Function) => {
//     callback(null, true);
//   }
// };
// const corseWithOpt = cors(corsOptions);
// app.use(corseWithOpt);

app.get("/", (_req: express.Request, resp: express.Response) => {
  resp.json({ foo: "bar" });
});

app.get("/search", (req: express.Request, resp: express.Response) => {
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

  resp.json({ url });
});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const api = functions.https.onRequest(app);
