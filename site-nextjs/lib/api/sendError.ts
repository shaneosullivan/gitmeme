import { NextApiResponse } from "next";

export default function sendError(
  res: NextApiResponse,
  err: { status: number; body: Object }
) {
  res.status(err.status).json(err.body);
}
