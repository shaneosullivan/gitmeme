export default function getLoggedInUser() {
  const avatarNode = document.querySelector("img.avatar");
  let userName: string | null = "";
  let avatarUrl: string | null = "";
  if (avatarNode) {
    userName = (avatarNode.getAttribute("alt") || "").substring(1);
    avatarUrl = avatarNode.getAttribute("src");
  }

  if (!userName) {
    // The user name is hidden in a side panel, it's not in the alt of the profile
    // picture any more, which is just bad accessibility. Boo Github devs!
    const userNameNode = document.querySelector(
      "[data-target='deferred-side-panel.panel'] .AppHeader-logo + div span.Truncate-text"
    ) as HTMLSpanElement;
    if (userNameNode) {
      userName = userNameNode.textContent
        ? userNameNode.textContent.trim()
        : null;
    }
  }

  if (userName) {
    return {
      id: userName,
      avatar: avatarUrl,
    };
  }

  return null;
}
