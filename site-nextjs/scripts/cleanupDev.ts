// This script cleans up the dev environment, undoing the modification of some files
// to make development possible by the /scripts/setupDev.ts script

import fs from "fs";

// Modify the /extension/manifest.json file allow reading from the localhost API
{
  const url = "http://localhost:3005/*";
  const filePath = `${__dirname}/../../extension/manifest.json`;

  let contents = fs.readFileSync(filePath).toString();

  if (contents.indexOf(url) > -1) {
    contents = contents.replace(`"${url}",`, "");
    fs.writeFileSync(filePath, contents);
  }
}
