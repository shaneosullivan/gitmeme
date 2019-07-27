import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import handleOauthRedirect from "./handleOauthRedirect";
import getFirestore from "./util/getFirestore";
import apiSearch from "./api/search";
import apiAddTokenByUrl from "./api/addTokenByUrl";
import apiTopTokens from "./api/topTokens";
import filesUploadMiddleware from "./util/filesUploadMiddleware";
import createFileUploadUrl from "./api/createFileUploadUrl";

const app = express();

// Allow cross origin requests
app.options("*", cors());
app.use(cors());

// app.get("/", (_req: express.Request, resp: express.Response) => {
//   resp.json({
//     url: "https://joinpromise.com/assets/media/Measure_Efficacy.svg"
//   });
// });

app.get("/search", apiSearch);

app.post("/add_token_by_url", filesUploadMiddleware, apiAddTokenByUrl);

app.get("/top_tokens", apiTopTokens);

app.post("/create_file_upload_url", createFileUploadUrl);

export const api = functions.https.onRequest(app);

export const oauth = functions.https.onRequest(async (req, res) => {
  await handleOauthRedirect(req, res, getFirestore());
});
