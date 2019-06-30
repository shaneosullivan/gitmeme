import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

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
app.options("*", cors());
app.use(cors());

app.get("/", (_req: express.Request, resp: express.Response) => {
  resp.json({
    url: "https://joinpromise.com/assets/media/Measure_Efficacy.svg"
  });
});

app.get("/search", (req: express.Request, res: express.Response) => {
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

export const api = functions.https.onRequest(app);
