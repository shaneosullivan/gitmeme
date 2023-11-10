import { setCorsHeaders } from "@/lib/api/apiResponse";
import checkUserIsUnauthorized from "../../lib/api/checkUserIsUnauthorized";
import getFirestore from "../../lib/api/getFirestore";
import { getStringValue } from "../../lib/util/getStringValue";
import { NextApiRequest, NextApiResponse } from "next";

type SearchResult = Array<{
  category: string;
  priority: number;
  last_used_at: string;
  url: string;
}>;

export default async function searchApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("search api called");

  const { error: authError, user } = await checkUserIsUnauthorized(req);

  const token = getStringValue(req.query["t"]);
  let results: SearchResult = [];

  const userId = user ? user.uid : "";
  const context = getStringValue(req.query["context"]);

  // Always get the global results
  const promises = [getGlobalResults(token)];

  if (context) {
    promises.push(getContextResults(context, token));
  }

  if (!authError) {
    // If the user is logged in, get their personal results.
    promises.unshift(getPersonalResults(userId, token));
  }

  const searchResults = await Promise.all(promises);

  searchResults.forEach(
    (searchResult) =>
      (results = results.concat(
        searchResult.map((result) => {
          result.last_used_at = serializeDate(result.last_used_at);
          return result;
        })
      ))
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

  // Filter the results for images with the same url
  const seen: { [key: string]: boolean } = {};
  results = results.filter((result) => {
    const url = result.url;
    if (seen[url]) {
      return false;
    }
    seen[url] = true;
    return true;
  });

  setCorsHeaders(res);

  res.status(200);
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
    const lastUsedAt =
      userTokenDoc.get("updated_at") || new Date().toISOString();
    return [{ url, category: "me", priority: 0, last_used_at: lastUsedAt }];
  }
  return [];
}

async function getContextResults(
  context: string,
  token: string
): Promise<SearchResult> {
  const collectionSnapshot = await getFirestore()
    .collection("context_images")
    .where("context", "==", context)
    .where("token", "==", token)
    .get();

  if (!collectionSnapshot.empty) {
    return collectionSnapshot.docs.map((documentSnapshot) => {
      return {
        category: "context",
        last_used_at:
          documentSnapshot.get("updated_at") || new Date().toISOString(),
        priority: 1,
        url: documentSnapshot.get("image_url"),
      };
    });
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
    return collectionSnapshot.docs.map((documentSnapshot) => {
      return {
        category: "global",
        last_used_at:
          documentSnapshot.get("updated_at") || new Date().toISOString(),
        priority: 2,
        url: documentSnapshot.get("image_url"),
      };
    });
  }
  return [];
}

function serializeDate(date: any): string {
  if (date instanceof String) {
    return date as string;
  }
  if (typeof date.toDate === "function") {
    return date.toDate().toISOString();
  }
  return date.toISOString();
}
