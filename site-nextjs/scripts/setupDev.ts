// This script sets up the dev environment, modifying some files to make development
// possible.  Use the /scripts/cleanupDev.ts script to undo these

import fs from "fs";

// Modify the /extension/manifest.json file allow reading from the localhost API
{
  const url = "http://localhost:3005/*";
  const filePath = `${__dirname}/../../extension/manifest.json`;

  let contents = fs.readFileSync(filePath).toString();

  if (contents.indexOf(url) < 0) {
    contents = contents.replace(`"matches": [`, `"matches": ["${url}",`);
    fs.writeFileSync(filePath, contents);
  }
}

// Modify the contents of the /shared/consts.ts file to make the extension
// read from localhost
{
  const filePath = `${__dirname}/../../shared/consts.ts`;
  let contents = fs.readFileSync(filePath).toString();
  const needle = "const IS_RUNNING_LOCAL =";

  if (contents.indexOf(`${needle} false`) > -1) {
    contents = contents.replace(`${needle} false`, `${needle} true`);
    fs.writeFileSync(filePath, contents);
  }
}
