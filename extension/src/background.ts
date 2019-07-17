import getToken from "./shared/auth/getToken";

chrome.runtime.onMessage.addListener(
  (message: { data: string }, _sender, callback: Function) => {
    if (message.data === "login") {
      getToken(true, err => {
        callback(!err);
      });
    } else {
      return false;
    }
    return true;
  }
);
