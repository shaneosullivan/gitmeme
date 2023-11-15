export const GITHUB_CLIENT_ID = "9b9e17e168e82438cfb6";

function getFakeUrl() {
  console.error("Do not check this in");
  return "http://localhost:3005/api";
}

// DO NOT MODIFY THIS LINE. IT IS SET BY THE /site-nextjs/scripts/setupDev.ts file
const IS_RUNNING_LOCAL = false;

export const API_ROOT_URL = IS_RUNNING_LOCAL
  ? getFakeUrl()
  : "https://gitme.me/api";

export const FILE_SIZE_LIMIT_MB = 1;
