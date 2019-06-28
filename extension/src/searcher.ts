import * as fetch from "node-fetch";

const GIPHY_API_KEY = "I5ysXzZG4OIoiMD99Tz7v6AGN9uzGWpr";

export default async function searcher(tokenValue): Promise<Array<string>> {
  switch (tokenValue) {
    case "foo":
      return ["https://joinpromise.com/assets/media/Measure_Efficacy.svg"];

    case "bar":
      return ["https://payticket.io/static/images/logos/epa_logo.jpg"];

    case "shipit":
      return ["https://media.giphy.com/media/79qf1N4RJtc8o/giphy.gif"];

    default:
      try {
        const giphyResult = await searchGiphy(tokenValue);

        if (giphyResult.data && giphyResult.data.length > 0) {
          return giphyResult.data.map(
            imageData => imageData.images.downsized_still.url
          );
        }
      } catch (err) {
        console.error(err);
      }
      return [];
  }
}

const giphySearches = {};

async function searchGiphy(tokenValue) {
  if (!giphySearches[tokenValue]) {
    giphySearches[tokenValue] = new Promise(async (resolve, _reject) => {
      const result = await fetch(
        `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(
          tokenValue
        )}&api_key=${GIPHY_API_KEY}&limit=8`
      );

      const data = await result.json();
      resolve(data);
    });
  }
  return giphySearches[tokenValue];
}
