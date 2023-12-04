import { NextRequest } from "next/server";
import getFirestore from "./getFirestore";
import { NextApiRequest } from "next";

interface AuthResult {
  error?: {
    status: number;
    body: { [key: string]: string };
  };
  user?: FirebaseFirestore.DocumentData;
}

const checkUserIsUnauthorized = async (
  req: NextApiRequest
): Promise<AuthResult> => {
  // Validate the user

  const authHeader = req.headers["authorization"];

  console.log("authHeader", authHeader);

  if (!authHeader) {
    return {
      error: {
        status: 403,
        body: { error: "No credentials sent!" },
      },
    };
  }

  if (authHeader.indexOf("Bearer ") === 0) {
    const authHeaderContents = (
      Array.isArray(authHeader) ? authHeader[0] : authHeader
    ).substring(authHeader.indexOf(" "));

    const parts = authHeaderContents.split("___");

    const userId = parts[0].trim().toLowerCase();
    const authToken = (parts[1] || "").trim();

    if (userId && authToken && authToken !== "null") {
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
          console.log("User successfully authenticated");

          return {
            user: data,
          };
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
    error: {
      status: 401,
      body: { error: "User not authorized" },
    },
  };
};

export default checkUserIsUnauthorized;
