import getArray from "../util/getArray";

// @ts-ignore
import arrFlatten from "arr-flatten";
import fs from "fs";
import { BagOfStuff } from "../api/types";

export default async function unlinkFiles(files: BagOfStuff) {
  const fieldNames = Object.keys(files);
  const fileArrays = fieldNames.map((fieldName) => {
    return getArray(files[fieldName]);
  });

  const allFiles: Array<{ path: string }> = arrFlatten(fileArrays);

  return Promise.all(
    allFiles.map((file) => {
      return new Promise((resolve) => {
        fs.unlink(file.path, () => {
          resolve(file.path);
        });
      });
    })
  );
}
