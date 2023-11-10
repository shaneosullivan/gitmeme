import { NextApiRequest, NextApiResponse } from "next";

export default function shutdownDev(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== "production") {
    res.status(200);
    res.end();
    process.exit();
  }
  res.status(404);
  res.end();
}
