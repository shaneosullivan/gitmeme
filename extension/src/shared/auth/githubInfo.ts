import getLoggedInUser from "./getLoggedInUser";
import getGithubContext from "./getGithubContext";

declare const chrome: any;

export interface GithubInfo {
  avatar: string | null;
  context: string | null;
  id: string | null;
  token: string | null;
}

export async function getGithubInfo(): Promise<GithubInfo> {
  return new Promise(resolve => {
    chrome.storage.sync.get(
      ["github_token", "github_id", "github_avatar"],
      function(results: any) {
        if (results.github_token) {
          resolve({
            token: results.github_token || null,
            id: results.github_id || null,
            avatar: results.github_avatar || null,
            context: getGithubContext()
          });
        } else {
          const loggedInUser = getLoggedInUser();
          resolve({
            token: null,
            id: loggedInUser ? loggedInUser.id : null,
            avatar: loggedInUser ? loggedInUser.avatar : null,
            context: getGithubContext()
          });
        }
      }
    );
  });
}

export async function setGithubToken(token: string) {
  return new Promise(resolve => {
    chrome.storage.sync.set({ github_token: token }, function() {
      resolve();
    });
  });
}

export async function setGithubUserId(userId: string, avatarUrl: string) {
  return new Promise(resolve => {
    chrome.storage.sync.set(
      { github_id: userId, github_avatar: avatarUrl },
      function() {
        resolve();
      }
    );
  });
}
