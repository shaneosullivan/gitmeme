import { GITHUB_CLIENT_ID } from "../consts";
import { getGithubInfo, setGithubUserId, setGithubToken } from "./githubInfo";

declare const chrome: any;

export default function getToken(interactive: boolean, callback: Function) {
  console.log("getToken called");

  getGithubInfo().then(async info => {
    if (true || !info.token || !info.id || !info.avatar) {
      chrome.identity.launchWebAuthFlow(options, function(
        redirectUri2: string
      ) {
        if (chrome.runtime.lastError) {
          callback(new Error(chrome.runtime.lastError));
          return;
        }

        // Upon success the response is appended to redirectUri, e.g.
        // https://{app_id}.chromiumapp.org/provider_cb#access_token={value}
        //     &refresh_token={value}
        const matches = redirectUri2.match(redirectRe);
        if (matches && matches.length > 1) {
          handleProviderResponse(parseRedirectFragment(matches[1]));
        } else {
          callback(new Error("Invalid redirect URI"));
        }
      });
    }
  });

  const localRedirectUri = (chrome as any).identity.getRedirectURL(
    "provider_cb"
  );
  const redirectUri =
    "https://us-central1-git-meme-prod.cloudfunctions.net/oauth";
  const redirectRe = new RegExp(localRedirectUri + "[#?](.*)");

  const options = {
    interactive: interactive,
    url:
      "https://github.com/login/oauth/authorize" +
      "?client_id=" +
      GITHUB_CLIENT_ID +
      "&redirect_uri=" +
      encodeURIComponent(redirectUri)
  };

  function parseRedirectFragment(fragment: string) {
    console.log("parseRedirectFragment called with", fragment);
    const pairs = fragment.split(/&/);
    const values: { [key: string]: string } = {};

    pairs.forEach(function(pair) {
      const nameVal = pair.split(/=/);
      values[nameVal[0]] = nameVal[1];
    });

    return values;
  }

  async function handleProviderResponse(values: { [key: string]: string }) {
    console.log("handleProviderResponse", values);
    if (values.hasOwnProperty("access_token")) {
      await setAccessToken(values.access_token, values.user_id, values.avatar);
      // If response does not have an access_token, it might have the code,
      // which can be used in exchange for token.
    } else {
      callback(new Error("Neither access_token nor code avialable."));
    }
  }

  async function setAccessToken(token: string, userId: string, avatar: string) {
    // access_token = token;
    console.log(
      "Setting access_token: ",
      token,
      "user id",
      userId,
      "avatar",
      avatar
    );

    await setGithubToken(token);
    await setGithubUserId(userId, avatar);
    callback(null, { token, id: userId, avatar });
  }
}
