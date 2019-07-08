import { AppResponse } from "../api/apiTypes";

export default function sendError(
  res: AppResponse,
  err: { status: number; body: Object }
) {
  res.status(err.status).json(err.body);
}
