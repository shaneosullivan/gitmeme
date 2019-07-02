export default function getLoggedInUser() {
  const avatarNode = document.querySelector("summary img.avatar");
  if (avatarNode) {
    const userName = (avatarNode.getAttribute("alt") || "").substring(1);
    const avatar = avatarNode.getAttribute("src");
    return {
      id: userName,
      avatar
    };
  }

  return null;
}
