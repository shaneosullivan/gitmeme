import fetch from "node-fetch";

export default async function searcher(token): Promise<string | null> {
  if (!token) {
    return null;
  }
  const result = await fetch(
    `https://us-central1-git-meme-prod.cloudfunctions.net/api/search?t=${encodeURIComponent(
      token
    )}`
  ).then(res => {
    return res.text();
  });

  console.log("got result ", result);

  return result.url;
}
