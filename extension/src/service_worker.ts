import { getTokenHeadless } from "./shared/auth/getToken";
import { GithubInfo } from "./shared/auth/githubInfo";

chrome.runtime.onMessage.addListener(
  (
    message: { data: string; githubInfo: GithubInfo },
    _sender,
    callback: Function
  ) => {
    if (message.data === "login") {
      if (!message.githubInfo) {
        console.error(
          "Github Info must be sent to the service worker to log in"
        );
        callback(false);
      } else {
        getTokenHeadless(
          true,
          (err) => {
            callback(!err);
          },
          message.githubInfo
        );
      }
    } else {
      return false;
    }
    return true;
  }
);
