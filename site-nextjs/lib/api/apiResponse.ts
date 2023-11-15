import { NextApiResponse } from "next";

const corsHeaders: { [key: string]: string } = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
  "Access-Control-Max-Age": "86400",
};

export function setCorsHeaders(res: NextApiResponse) {
  Object.keys(corsHeaders).forEach((headerName) => {
    res.setHeader(headerName, corsHeaders[headerName]);
  });
}
