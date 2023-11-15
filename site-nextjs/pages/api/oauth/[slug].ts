import { GITHUB_CLIENT_SECRET } from "../../../lib/generated/secrets";
import getFirestore from "../../../lib/api/getFirestore";
import { getStringValue } from "../../../lib/util/getStringValue";
import { Firestore } from "@google-cloud/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const GITHUB_CLIENT_ID = "9b9e17e168e82438cfb6";

const EXTENSION_ID = "bjpibkoafohcjghgpbiinhfoobmbijcc";

const thisRedirectUri = "https://gitme.me/api/oauth";

export default async function oauthApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const firestore = getFirestore();

  console.log("Oauth called with query ", req.query);
  console.log("oauth got req.query.slug", req.query.slug);

  let extensionId = EXTENSION_ID;

  if (req.query.slug) {
    // The getTokenHeadless function adds the extension ID to the path.
    extensionId = getStringValue(req.query.slug);
    console.log("changed extension id to ", extensionId);
  }

  const accessToken = getStringValue(req.query.access_token);
  const code = getStringValue(req.query.code);

  if (accessToken) {
    console.log(
      "Oauth got an access token ",
      accessToken,
      " creating/updating user"
    );
    const userInfo = await createOrUpdateUser(firestore, accessToken);

    redirectWithToken(
      res,
      accessToken,
      userInfo.uid,
      userInfo.avatar,
      extensionId
    );
  } else if (code) {
    console.log(
      "Oauth got an access code ",
      code,
      " exchanging code for token"
    );
    const token = await exchangeCodeForToken(code);
    console.log("Exchanged code for the token: ", token);

    if (token) {
      const userInfo = await createOrUpdateUser(firestore, token);

      redirectWithToken(res, token, userInfo.uid, userInfo.avatar, extensionId);
      return;
    }
  }

  console.error("Oauth was not successful after receiving query", req.query);

  // No idea what's going on here, just do a simple redirect
  const idx = (req.url || "").indexOf("?");
  const queryString = (req.url || "").substring(idx + 1);
  res.redirect(
    `https://${EXTENSION_ID}.chromiumapp.org/provider_cb?` + queryString
  );
}

async function createOrUpdateUser(firestore: Firestore, token: string) {
  console.log("should create a user with token ", token);

  const result = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
    },
  }).then((resp) => {
    return resp.json();
  });

  const userId = (result.login || "").toLowerCase();
  const avatar = result.avatar_url || "";

  const docRef = firestore.collection("users").doc(userId);

  const existingDoc = await docRef.get();
  if (existingDoc.exists) {
    const updateData = {
      avatar,
      auth_tokens: (existingDoc.get("auth_tokens") || []).concat([token]),
    };
    console.log("updating a user with ", updateData);

    await docRef.update(updateData);
  } else {
    const data = {
      uid: userId,
      avatar,
      auth_tokens: [token],
    };
    console.log("creating a user with ", data);
    await docRef.set(data);
  }
  return (await docRef.get()).data() || {};
}

function redirectWithToken(
  res: NextApiResponse,
  token: string,
  userId: string,
  avatar: string,
  extensionId: string
) {
  let nextRedirectUrl = `https://${extensionId}.chromiumapp.org/provider_cb?access_token=${token}&user_id=${userId}&avatar=${avatar}`;

  console.log(
    "Doing redirectWithToken, using token ",
    token,
    " userId",
    userId,
    "avatar",
    avatar,
    " to ",
    nextRedirectUrl
  );

  res.redirect(nextRedirectUrl);
}

async function exchangeCodeForToken(code: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const url =
      "https://github.com/login/oauth/access_token?" +
      "client_id=" +
      GITHUB_CLIENT_ID +
      "&client_secret=" +
      GITHUB_CLIENT_SECRET +
      "&redirect_uri=" +
      encodeURIComponent(thisRedirectUri) +
      "&code=" +
      code;

    let result;
    try {
      result = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }).then((data: any) => data.json());
    } catch (err) {
      console.log("fetch got error", err);
      reject(err);
      return;
    }

    console.log("Got swapping result ", result);
    if (result.access_token) {
      resolve(result.access_token);
    } else {
      reject(
        new Error("Did not receive access token in " + JSON.stringify(result))
      );
    }
  });
}
