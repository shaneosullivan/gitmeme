import { GITHUB_CLIENT_ID } from "../consts";
import { getGithubInfo, setGithubUserId, setGithubToken } from "./githubInfo";

declare const chrome: any;

export default function getToken(interactive: boolean, callback: Function) {
  console.log("getToken");

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

  getGithubInfo().then(async info => {
    console.log("got github info ", info);
    if (!info.token || !info.id || !info.avatar) {
      console.log("calling launchWebAuthFlow with options", options);
      chrome.identity.launchWebAuthFlow(options, function(
        redirectUri2: string
      ) {
        console.log("launchWebAuthFlow callback with redirect ", redirectUri2);
        if (chrome.runtime.lastError) {
          console.error("launchWebAuthFlow error", chrome.runtime.lastError);
          callback(new Error(chrome.runtime.lastError));
          return;
        }

        // Upon success the response is appended to redirectUri, e.g.
        // https://{app_id}.chromiumapp.org/provider_cb#access_token={value}
        //     &refresh_token={value}
        const matches = redirectUri2.match(redirectRe);

        console.log("matches = ", matches);
        if (matches && matches.length > 1) {
          console.log("calling handleProviderResponse");
          handleProviderResponse(parseRedirectFragment(matches[1]));
        } else {
          callback(new Error("Invalid redirect URI"));
        }
      });
    }
  });

  function parseRedirectFragment(fragment: string) {
    const pairs = fragment.split(/&/);
    const values: { [key: string]: string } = {};

    pairs.forEach(function(pair) {
      const nameVal = pair.split(/=/);
      values[nameVal[0]] = nameVal[1];
    });

    console.log("parseRedirectFragment got values", values);

    return values;
  }

  async function handleProviderResponse(values: { [key: string]: string }) {
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

    await setGithubToken(token);
    await setGithubUserId(userId, avatar);
    callback(null, { token, id: userId, avatar });
  }
}
