import getToken from "./shared/auth/getToken";
import 'webext-dynamic-content-scripts';
import addDomainPermissionToggle from 'webext-domain-permission-toggle';


// addDomainPermissionToggle();


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

// Give the browserAction a reason to exist other than "Enable RGH on this domain"
chrome.browserAction.onClicked.addListener(() => {
        void browser.tabs.create({
                    url: 'https://github.com'
        });
});


console.log('abcdefg');
