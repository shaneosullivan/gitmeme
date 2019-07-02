export default function createAuthHeader(userId: string, token: string) {
  return {
    Authorization: `Bearer ${userId}___${token}`,
    "Content-Type": "application/json"
  };
}
