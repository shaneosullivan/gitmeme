export default function getLoggedInUser() {
  let userName: string | null = "";
  let avatarUrl: string | null = "";

  // Check the meta tag first — it's the most reliable source for the
  // logged-in user and won't accidentally match another user's avatar.
  const userNameMetaNode = document.head.querySelector(
    'meta[name="user-login"]'
  );

  if (userNameMetaNode) {
    userName = userNameMetaNode.getAttribute("content");
  }

  if (!userName) {
    const userNameNode = document.querySelector(
      "[data-target='deferred-side-panel.panel'] .AppHeader-logo + div span.Truncate-text"
    ) as HTMLSpanElement;
    if (userNameNode) {
      userName = userNameNode.textContent
        ? userNameNode.textContent.trim()
        : null;
    }
  }

  // Try to get the avatar URL from the logged-in user's avatar image
  if (userName) {
    const avatarNode = document.querySelector(
      `img.avatar[alt="@${userName}"]`
    );
    if (avatarNode) {
      avatarUrl = avatarNode.getAttribute("src");
    }
  }

  if (userName) {
    return {
      id: userName.trim(),
      avatar: avatarUrl,
    };
  }

  return null;
}
