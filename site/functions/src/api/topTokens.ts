import { AppRequest, AppResponse } from "./apiTypes";

import checkUserIsUnauthorized from "./checkUserIsUnauthorized";

import getFirestore from "../util/getFirestore";

interface TopTokenItem {
  count: number;
  image_url: string;
  token: string;
}

export default async function apiTopTokens(req: AppRequest, res: AppResponse) {
  const authError = await checkUserIsUnauthorized(req);
  console.log("top_tokens got authError", JSON.stringify(authError));

  const maxToReturn = parseInt(req.query.count || "5", 10);

  if (isNaN(maxToReturn)) {
    res.sendStatus(400);
    res.send({ error: `Invalid "count" parameter ${req.query.count}` });
    return;
  }

  const results = {
    user: [] as Array<TopTokenItem>,
    global: [] as Array<TopTokenItem>
  };
  const promises = [];

  function serialize(doc: FirebaseFirestore.DocumentSnapshot): TopTokenItem {
    const data = doc.data() || {};
    return {
      token: data.token,
      image_url: data.image_url,
      count: data.count
    };
  }

  if (!authError) {
    async function getUserTopTokens() {
      const userId = req._user ? req._user.uid : "";
      const userDocRef = getFirestore()
        .collection("users")
        .doc(userId);

      const userTokenDocs = await getFirestore()
        .collection("user_tokens")
        .where("user", "==", userDocRef)
        .limit(maxToReturn)
        .orderBy("count", "desc")
        .get();
      results.user = userTokenDocs.docs.map(serialize);
    }
    promises.push(getUserTopTokens());
  }

  async function getGlobalTopTokens() {
    const globalTokenDocs = await getFirestore()
      .collection("all_tokens")
      .limit(maxToReturn)
      .orderBy("count", "desc")
      .get();
    results.global = globalTokenDocs.docs.map(serialize);
  }

  promises.push(getGlobalTopTokens());

  await Promise.all(promises);

  res.json(results);
}
