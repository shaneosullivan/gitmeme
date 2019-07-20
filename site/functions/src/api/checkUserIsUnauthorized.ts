import getFirestore from "../util/getFirestore";
import { AppRequest } from "./apiTypes";

const checkUserIsUnauthorized = async (req: AppRequest) => {
  // Validate the user
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return {
      status: 403,
      body: { error: "No credentials sent!" }
    };
  }

  if (authHeader.indexOf("Bearer ") === 0) {
    const authHeaderContents = (Array.isArray(authHeader)
      ? authHeader[0]
      : authHeader
    ).substring(authHeader.indexOf(" "));

    const parts = authHeaderContents.split("___");

    const userId = parts[0].trim();
    const authToken = parts[1].trim();

    if (userId && authToken) {
      const userDoc = await getFirestore()
        .collection("users")
        .doc(userId)
        .get();

      if (userDoc.exists) {
        const data = userDoc.data();

        if (
          data &&
          data.auth_tokens &&
          data.auth_tokens.some(
            (existingToken: string) => existingToken === authToken
          )
        ) {
          (req as any)["_user"] = data;
          console.log("User successfully authenticated");

          return null;
        } else {
          console.log(
            `tokens do not match, ${
              data ? data.auth_token : null
            } !== ${authToken}`
          );
        }
      } else {
        console.log("userDoc does not exist");
      }
    }
  }
  console.log("User failed authentication");
  // Not authorized
  return {
    status: 401,
    body: { error: "User not authorized" }
  };
};

export default checkUserIsUnauthorized;
