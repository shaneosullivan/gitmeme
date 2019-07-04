import * as fetch from "node-fetch";
import { API_ROOT_URL } from "./shared/consts";
import createAuthHeader from "./shared/auth/createAuthHeader";
import { getGithubInfo } from "./shared/auth/githubInfo";

const GIPHY_API_KEY = "I5ysXzZG4OIoiMD99Tz7v6AGN9uzGWpr";

export default async function searcher(tokenValue): Promise<Array<string>> {
  if (!tokenValue) {
    return null;
  }

  function filterToRemoveIdenticalImages(arr) {
    const seen = {};
    return arr.filter(url => {
      if (seen[url]) {
        return false;
      }
      seen[url] = true;
      return true;
    });
  }

  return new Promise(async (resolve, _reject) => {
    let results = [];
    let gitmemeComplete = false;
    let localComplete = false;
    let giphyResult = null;

    let isResolved = false;
    function doResolve() {
      if (isResolved) {
        return;
      }
      isResolved = true;
      resolve(filterToRemoveIdenticalImages(results));
    }

    const userInfo = await getGithubInfo();

    if (userInfo && userInfo.id) {
      const tokenStorageKey = `image:${userInfo.id}_${tokenValue}`;
      chrome.storage.local.get([tokenStorageKey], (localResults: any) => {
        localComplete = true;
        if (localResults[tokenStorageKey]) {
          results.unshift(localResults[tokenStorageKey]);
          doResolve();
        }
      });
    } else {
      localComplete = true;
    }

    // Only search our API if the user has logged in with us
    if (userInfo && userInfo.id && userInfo.token) {
      const gitmemeUrl = `${API_ROOT_URL}/search?t=${encodeURIComponent(
        tokenValue
      )}`;

      fetch(gitmemeUrl, {
        headers: {
          ...createAuthHeader(userInfo.id, userInfo.token)
        }
      })
        .then(function(response) {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          // Read the response as json.
          return response.json();
        })
        .then(function(data) {
          // Do stuff with the JSON
          gitmemeComplete = true;
          if (data && data.url) {
            // The first party images are put in the first position
            results.unshift(data.url);
            doResolve();
          } else if (giphyResult) {
            doResolve();
          }
        })
        .catch(function(error) {
          console.log("Looks like there was a problem: \n", error);
        });
    } else {
      gitmemeComplete = true;
    }

    try {
      giphyResult = await searchGiphy(tokenValue);

      if (giphyResult.data && giphyResult.data.length > 0) {
        giphyResult.data
          .map(imageData => imageData.images.downsized_medium.url)
          .forEach(url => {
            results.push(url);
          });

        // If the Gitmeme request has completed but didn't find anything,
        // then resolve the Promise.
        // If the Gitmeme request has not completed, wait for it
        // If the Gitmeme request has completed and found something,
        //   then it will have already resolved
        if (
          gitmemeComplete &&
          localComplete &&
          results.length === giphyResult.data.length
        ) {
          doResolve();
        }
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  });
}

const giphySearches = {};

async function searchGiphy(tokenValue) {
  if (!giphySearches[tokenValue]) {
    giphySearches[tokenValue] = new Promise(async (resolve, _reject) => {
      let limit = 8;

      while (limit > 2) {
        try {
          const result = await fetch(
            `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(
              tokenValue
            )}&api_key=${GIPHY_API_KEY}&limit=${limit}`
          );
          const data = await result.json();
          resolve(data);
          break;
        } catch (err) {
          limit--;
        }
      }
    });
  }
  return giphySearches[tokenValue];
}
