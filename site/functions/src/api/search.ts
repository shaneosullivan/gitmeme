import getFirestore from "../util/getFirestore";
import checkUserIsUnauthorized from "./checkUserIsUnauthorized";
import { AppRequest, AppResponse } from "./apiTypes";
import sendError from "../util/sendError";

type SearchResult = Array<{
  category: string;
  priority: number;
  url: string;
}>;

export default async function apiSearch(req: AppRequest, res: AppResponse) {
  const authError = await checkUserIsUnauthorized(req);
  if (authError) {
    sendError(res, authError);
    return;
  }
  const token = req.query["t"];
  let results: SearchResult = [];

  const userId = req._user ? req._user.uid : "";

  const promises = [getPersonalResults(userId, token), getGlobalResults(token)];

  const searchResults = await Promise.all(promises);

  searchResults.forEach(
    searchResult => (results = results.concat(searchResult))
  );
  results.sort((a, b) => {
    if (a.priority < b.priority) {
      return -1;
    }
    if (b.priority < a.priority) {
      return 1;
    }
    return 0;
  });

  res.json({ results });
}

async function getPersonalResults(
  userId: string,
  token: string
): Promise<SearchResult> {
  const docId = `${userId}_${token}`;
  const userTokenDoc = await getFirestore()
    .collection("user_tokens")
    .doc(docId)
    .get();
  if (userTokenDoc.exists) {
    const url = (userTokenDoc.data() || {}).image_url;
    return [{ url, category: "me", priority: 0 }];
  }
  return [];
}

async function getGlobalResults(token: string): Promise<SearchResult> {
  // Fetch results by most used, then by most recently used.
  const collectionSnapshot = await getFirestore()
    .collection("all_images")
    .where("token", "==", token)
    .orderBy("count", "desc")
    .orderBy("updated_at", "desc")
    .get();

  if (!collectionSnapshot.empty) {
    return collectionSnapshot.docs.map(documentSnapshot => {
      return {
        category: "global",
        priority: 1,
        url: documentSnapshot.get("image_url")
      };
    });
  }
  return [];
}
