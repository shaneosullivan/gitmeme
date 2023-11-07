import * as express from "express";
// import fetch from "node-fetch";
import { firestore as firestoreType } from "firebase-admin";

const GITHUB_CLIENT_ID = "9b9e17e168e82438cfb6";
const GITHUB_CLIENT_SECRET = "e8044d451e532da217fd3045bb5817bd8d40e5e1";

const EXTENSION_ID = "bjpibkoafohcjghgpbiinhfoobmbijcc";

const thisRedirectUri =
  "https://us-central1-git-meme-prod.cloudfunctions.net/oauth";

export default async function handleOauthRedirect(
  req: express.Request,
  res: express.Response,
  firestore: firestoreType.Firestore
) {
  console.log("Oauth called with query ", req.query);

  let extensionId = EXTENSION_ID;
  if (req.path && req.path.length > 1) {
    extensionId = req.path.substring(1);
  }

  if (req.query.access_token) {
    console.log(
      "Oauth got an access token ",
      req.query.access_token,
      " creating/updating user"
    );
    const userInfo = await createOrUpdateUser(
      firestore,
      req.query.access_token
    );

    redirectWithToken(
      res,
      req.query.access_token,
      userInfo.uid,
      userInfo.avatar,
      extensionId
    );
  } else if (req.query.code) {
    console.log(
      "Oauth got an access code ",
      req.query.code,
      " exchanging code for token"
    );
    const token = await exchangeCodeForToken(req.query.code);
    console.log("Exchanged code for the token: ", token);

    if (token) {
      const userInfo = await createOrUpdateUser(firestore, token);

      redirectWithToken(res, token, userInfo.uid, userInfo.avatar, extensionId);
      return;
    }
  }

  console.error("Oauth was not successful after receiving query", req.query);

  // No idea what's going on here, just do a simple redirect
  const idx = req.originalUrl.indexOf("?");
  const queryString = req.originalUrl.substring(idx + 1);
  res.redirect(
    `https://${EXTENSION_ID}.chromiumapp.org/provider_cb?` + queryString
  );
}

async function createOrUpdateUser(
  firestore: firestoreType.Firestore,
  token: string
) {
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
  res: express.Response,
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
