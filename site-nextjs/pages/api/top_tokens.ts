import { NextApiRequest, NextApiResponse } from "next";
import { getStringValue } from "../../lib/util/getStringValue";
import checkUserIsUnauthorized from "../../lib/api/checkUserIsUnauthorized";
import getFirestore from "@/lib/api/getFirestore";
import { setCorsHeaders } from "@/lib/api/apiResponse";
import { runCorsMiddleware } from "@/lib/api/runCorsMiddleware";

interface TopTokenItem {
  count: number;
  image_url: string;
  token: string;
}

// This API is called from the /popup React app, used to show the list of top
// tokens used
// - In the current repo
// - Overall in the world
// - By the currently authenticated user
// It is also called by the public facing https://gitme.me site to show
// the global top tokens used.
export default async function topTokensApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(res);
  await runCorsMiddleware(req, res);
  const { error: authError, user } = await checkUserIsUnauthorized(req);
  const userId = user ? user.uid : "";

  const maxToReturn = parseInt(getStringValue(req.query.count) || "5", 10);

  // The context is the Github repository from which the request is being made
  const context = getStringValue(req.query.context);

  if (isNaN(maxToReturn)) {
    res.status(400);
    res.send({ error: `Invalid "count" parameter ${req.query.count}` });
    return;
  }

  const results = {
    context: [] as Array<TopTokenItem>,
    user: [] as Array<TopTokenItem>,
    global: [] as Array<TopTokenItem>,
  };
  const promises = [];

  function serialize(doc: FirebaseFirestore.DocumentSnapshot): TopTokenItem {
    const data = doc.data() || {};
    return {
      token: data.token,
      image_url: data.image_url,
      count: data.count,
    };
  }

  async function getUserTopTokens() {
    const userDocRef = getFirestore().collection("users").doc(userId);

    const userTokenDocs = await getFirestore()
      .collection("user_tokens")
      .where("user", "==", userDocRef)
      .limit(maxToReturn)
      .orderBy("count", "desc")
      .get();

    results.user = userTokenDocs.docs.map(serialize);
  }

  async function getContextTopTokens() {
    const contextTokenDocs = await getFirestore()
      .collection("context_tokens")
      .where("context", "==", context)
      .orderBy("count", "desc")
      .limit(maxToReturn)
      .get();

    if (!contextTokenDocs.empty) {
      results.context = contextTokenDocs.docs.map(serialize);
    }
  }

  async function getGlobalTopTokens() {
    const globalTokenDocs = await getFirestore()
      .collection("all_tokens")
      .limit(maxToReturn)
      .orderBy("count", "desc")
      .get();
    results.global = globalTokenDocs.docs.map(serialize);
  }

  if (!authError && !!userId) {
    promises.push(getUserTopTokens());
  }

  if (context) {
    promises.push(getContextTopTokens());
  }

  promises.push(getGlobalTopTokens());

  await Promise.all(promises);

  res.json(results);
}
