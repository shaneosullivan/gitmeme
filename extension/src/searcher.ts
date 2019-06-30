import * as fetch from "node-fetch";

const GIPHY_API_KEY = "I5ysXzZG4OIoiMD99Tz7v6AGN9uzGWpr";

export default async function searcher(tokenValue): Promise<Array<string>> {
  if (!tokenValue) {
    return null;
  }

  return new Promise(async (resolve, _reject) => {
    let results = [];
    let gitmemeComplete = false;
    let giphyResult = null;

    const gitmemeUrl = `https://us-central1-git-meme-prod.cloudfunctions.net/api/search?t=${encodeURIComponent(
      tokenValue
    )}`;

    fetch(gitmemeUrl)
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        // Read the response as json.
        return response.json();
      })
      .then(function(data) {
        // Do stuff with the JSON
        console.log("gitmeme value for ", tokenValue, data);
        gitmemeComplete = true;
        if (data && data.url) {
          // The first party images are put in the first position
          results.unshift(data.url);
          resolve(results);
        } else if (giphyResult) {
          resolve(results);
        }
      })
      .catch(function(error) {
        console.log("Looks like there was a problem: \n", error);
      });

    try {
      giphyResult = await searchGiphy(tokenValue);

      if (giphyResult.data && giphyResult.data.length > 0) {
        console.log("giphyResult for ", tokenValue, giphyResult.data[0]);
        giphyResult.data
          .map(imageData => imageData.images.downsized_medium.url)
          .forEach(url => {
            results.push(url);
          });

        // If the Gitmeme request has completed but didn't find anything,
        // then resolve the Promise.
        // If the Gitmeme request has not completed, wait for it
        // If the Gitmeme request has completed and found something,
        //   then it will have alread resolved
        if (gitmemeComplete && results.length === giphyResult.data.length) {
          resolve(results);
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
          console.log("giphy result", result);
          const data = await result.json();
          resolve(data);
          break;
        } catch (err) {
          console.error(err);
          limit--;
        }
      }
    });
  }
  return giphySearches[tokenValue];
}
