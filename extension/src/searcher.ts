import * as fetch from "node-fetch";
import { API_ROOT_URL } from "./shared/consts";
import createAuthHeader from "./shared/auth/createAuthHeader";
import { getGithubInfo } from "./shared/auth/githubInfo";

const GIPHY_API_KEY = "I5ysXzZG4OIoiMD99Tz7v6AGN9uzGWpr";

const allResults = {};

function filterToRemoveIdenticalImages(arr) {
  const seen = {};

  // Need to filter in place so that subsequent searches
  // add to the same array.
  for (let i = 0; i < arr.length; i++) {
    const url = arr[i];
    if (seen[url]) {
      arr.splice(i, 1);
      i--;
    }
    seen[url] = true;
  }
  return arr;
}

export default async function searcher(tokenValue): Promise<Array<string>> {
  console.log("searcher", tokenValue);
  if (!tokenValue) {
    return null;
  }

  if (allResults[tokenValue]) {
    console.log("Returning cached values", allResults[tokenValue]);
    return allResults[tokenValue];
  }

  return new Promise(async (resolve, _reject) => {
    let results = [];
    let gitmemeComplete = false;
    let localComplete = false;
    let giphyResult = null;

    let isResolved = false;
    function doResolve() {
      if (isResolved) {
        filterToRemoveIdenticalImages(results);
        return;
      }
      isResolved = true;
      allResults[tokenValue] = results;
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

    // Search Gitmeme for previously used images
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
        if (data && data.results && data.results.length > 0) {
          // The first party images are put in the first position

          for (let i = data.results.length - 1; i > -1; i--) {
            results.unshift(data.results[i].url);
          }

          doResolve();
        } else if (giphyResult) {
          doResolve();
        }
      })
      .catch(function(error) {
        console.log("Looks like there was a problem: \n", error);
      });

    try {
      giphyResult = await searchGiphy(tokenValue);

      if (giphyResult.data && giphyResult.data.length > 0) {
        giphyResult.data
          .map(imageData => imageData.images.downsized_medium.url)
          .forEach((url: string) => {
            // "https://media1.giphy.com/media/pHXfAOUcHlNo6oKjZv/giphy.gif?cid=2972a2b15d1d90c568723336731fb8e4&rid=giphy.gif"
            // Remove unnecessary parts of the Giphy url, as above, since these
            // change all the time, making url deduplication impossible
            const idx = url.indexOf("?");
            if (idx > -1) {
              url = url.substring(0, idx);
            }
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
        } else {
          filterToRemoveIdenticalImages(results);
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
