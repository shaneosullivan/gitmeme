import * as express from "express";
import { getStorage } from "../util/getFirestore";

export default async function createFileUploadUrl(
  req: express.Request,
  res: express.Response
) {
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const fileName = body.file_name;

  const storage = getStorage();
  const bucket = storage.bucket();
  const file = bucket.file(`uploads/${Date.now()}_${fileName}`);
  const [url] = await file.getSignedUrl({
    action: "write",
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString()
  });

  res.json({
    image_url: url
  });
}
