import parseTokens from "./parseTokens";
import createTokenTag, { TokenTagType } from "./createTokenTag";
import throttle from "./util/throttle";
import getParentByTagName from "./getParentByTagName";
import findTextInputs from "./util/findTextInputs";
import { getGithubInfo } from "./shared/auth/githubInfo";
import { API_ROOT_URL } from "./shared/consts";
import createAuthHeader from "./shared/auth/createAuthHeader";
import getLoggedInUser from "./shared/auth/getLoggedInUser";

let userInfo;

// Get the logged in user from the DOM
const loggedInUser = getLoggedInUser();

function listenToInput(
  input: HTMLInputElement
): {
  input: HTMLElement;
  remove: Function;
} {
  console.log("listenToInput", input);
  let knownTokens = [] as Array<TokenTagType>;
  let toolbarButtonItem;
  let activeTag: TokenTagType = null;
  let popupIframe = null;

  const isLoggedIn =
    userInfo &&
    userInfo.id &&
    userInfo.token &&
    loggedInUser &&
    loggedInUser.id === userInfo.id;

  const updateTokensForInput = throttle(
    () => {
      let tokens = parseTokens(input.value);

      if (tokens.length > 0) {
        // Filter the tokens that we already know about
        const unknownTokens = tokens.filter(token => {
          return !knownTokens.some(knownToken => {
            return (
              knownToken.token.index === token.index &&
              knownToken.token.value === token.value
            );
          });
        });
        unknownTokens.forEach(token => {
          try {
            const tokenTag = createTokenTag(
              input,
              token,
              onTokenActive,
              isLoggedIn ? onAddNewImage : null
            );
            knownTokens.push(tokenTag);
          } catch (err) {
            console.error(err);
          }
        });
      }
      // Remove any tokens that are no longer valid
      knownTokens = knownTokens.filter(knownToken => {
        const stillExists = tokens.some(newToken => {
          return (
            knownToken.token.index === newToken.index &&
            knownToken.token.value === newToken.value
          );
        });
        if (!stillExists) {
          knownToken.remove();
        }
        return stillExists;
      });
    },
    250,
    { leading: false }
  );

  let formNode = getParentByTagName(input, "form") as HTMLFormElement;

  function cleanUp() {
    knownTokens.forEach(knownToken => {
      knownToken.remove();
    });
    knownTokens = [];

    input.removeEventListener("keyup", updateTokensForInput);
    input.removeEventListener("change", updateTokensForInput);
    input.removeEventListener("focus", updateTokensForInput);
    input.removeEventListener("mouseenter", handleMouseEnter);
    input.removeEventListener("mouseout", handleMouseOut);
    window.removeEventListener("resize", updatePosition);
    formNode.removeEventListener("submit", processPreSubmit, true);
    document.body.removeEventListener("keyup", handleBodyKeys);
  }

  // Replace all the tokens with image tags
  function processPreSubmit(_evt: Event) {
    // Process the tokens from the last to the first, so that
    // we can modify the text contents without changing the
    // index positions of tokens before we process them
    knownTokens.sort((a, b) => {
      if (a.token.index > b.token.index) {
        return -1;
      } else if (b.token.index > a.token.index) {
        return 1;
      }
      return 0;
    });

    let value = input.value;
    knownTokens.forEach(knownToken => {
      if (knownToken.isValid && !knownToken.disabled) {
        const tagInsert = `<a href="https://gitme.me/image?url=${encodeURIComponent(
          knownToken.imageUrl
        )}"><img src="${
          knownToken.imageUrl
        }" title="Created by gitme.me with /${knownToken.token.value}"/></a>`;
        value =
          value.substring(0, knownToken.token.index) +
          tagInsert +
          value.substring(
            knownToken.token.index + knownToken.token.value.length + 1
          );

        fetch(`${API_ROOT_URL}/add_token_by_url`, {
          method: "POST",
          headers: isLoggedIn
            ? {
                ...createAuthHeader(userInfo.id, userInfo.token)
              }
            : {},
          body: JSON.stringify({
            image_url: knownToken.imageUrl,
            token: knownToken.token.value
          })
        });

        if (loggedInUser) {
          // Also store the used tokens locally, so they work even when
          // not authorized with the extension.
          const tokenStorageKey = `image:${loggedInUser.id}_${
            knownToken.token.value
          }`;
          chrome.storage.local.set({
            [tokenStorageKey]: knownToken.imageUrl
          });
        }
      }
    });

    input.value = value;

    cleanUp();
  }

  const TOOLBAR_BUTTON_LABEL = "GM";

  function onTokenActive(isActive: boolean, tokenTag: TokenTagType) {
    if (toolbarButtonItem) {
      if (!isActive && activeTag !== tokenTag) {
        // Prevent a race condition where the cursor moves
        // from one tag to another
        return;
      }
      toolbarButtonItem.classList.toggle("__active", isActive);
    }
    activeTag = tokenTag;
  }

  async function onAddNewImage(
    tokenValue: string,
    url: string
  ): Promise<boolean> {
    if (!isLoggedIn) {
      throw new Error("Cannot add a new image unless logged in");
    }
    const result = await fetch(`${API_ROOT_URL}/add_token_by_url`, {
      method: "POST",
      headers: {
        ...createAuthHeader(userInfo.id, userInfo.token)
      },
      body: JSON.stringify({
        image_url: url,
        token: tokenValue
      })
    });
    return result.status === 200;
  }

  function addToolbarButton(form: HTMLFormElement) {
    const toolbarNode = form.querySelector("markdown-toolbar");
    if (toolbarNode) {
      if (toolbarNode.querySelector(".__toolbarButton")) {
        console.log("already have a toolbar item for form ", form);
        return;
      }

      const toolbarButton = document.createElement("div");
      toolbarButton.className = "d-inline-block mr-3 __toolbarButton";

      toolbarButtonItem = document.createElement("button");
      toolbarButtonItem.className = "toolbar-item __toolbarButtonItem";
      toolbarButtonItem.textContent = TOOLBAR_BUTTON_LABEL;

      toolbarButton.appendChild(toolbarButtonItem);

      toolbarButton.addEventListener("click", (evt: Event) => {
        evt.preventDefault();
        evt.stopPropagation();

        // Insert an iframe containing the popup
        togglePopupIframe();
      });

      toolbarNode.appendChild(toolbarButton);
    } else {
      console.log("no toolbar button on form ", form);
    }
  }

  function togglePopupIframe() {
    if (popupIframe) {
      popupIframe.parentNode.removeChild(popupIframe);
      popupIframe = null;
    } else {
      popupIframe = document.createElement("iframe");
      popupIframe.className = "__popupIframe";
      toolbarButtonItem.parentNode.appendChild(popupIframe);
      popupIframe.src = chrome.runtime.getURL("popup/index.html");
    }
  }

  function handleBodyKeys(evt) {
    const { keyCode } = evt;
    // Handle the Esc key
    if (keyCode === 27) {
      if (popupIframe) {
        togglePopupIframe();
      }
      knownTokens.forEach(token => token.closeModal());
    }
  }

  function getTagWrapper() {
    const tagWrapperId = input.getAttribute("data-tags-id");
    if (!tagWrapperId) {
      return null;
    }
    return document.getElementById(tagWrapperId);
  }

  function handleMouseEnter(_evt) {
    let node;
    if ((node = getTagWrapper())) {
      node.classList.add("__tokenWrapperActive");
    }
  }

  function handleMouseOut(_evt) {
    let node;
    if ((node = getTagWrapper())) {
      node.classList.remove("__tokenWrapperActive");
    }
  }

  const updatePosition = throttle(() => {
    knownTokens.forEach(token => {
      token.reposition();
    });
  }, 100);

  input.addEventListener("keyup", updateTokensForInput);
  input.addEventListener("change", updateTokensForInput);
  input.addEventListener("focus", updateTokensForInput);
  input.addEventListener("mouseenter", handleMouseEnter);
  input.addEventListener("mouseout", handleMouseOut);
  window.addEventListener("resize", updatePosition);
  formNode.addEventListener("submit", processPreSubmit, true);
  document.body.addEventListener("keyup", handleBodyKeys);

  addToolbarButton(formNode);

  // In case the input is simply removed from the DOM without
  // being submitted, clean up too
  var mutationObserver = new MutationObserver(function(evt) {
    if (
      evt[0].removedNodes &&
      Array.from(evt[0].removedNodes).indexOf(input) > -1
    ) {
      cleanUp();
    } else if (input.offsetHeight === 0) {
      cleanUp();
    }
  });

  mutationObserver.observe(formNode, { childList: true });

  updateTokensForInput();

  const ret = {
    input,
    remove: cleanUp
  };
  console.log("listenToInput returning ", ret);
  return ret;
}

getGithubInfo().then(
  (localUserInfo: {
    token: string | null;
    id: string | null;
    avatar: string | null;
  }) => {
    userInfo = localUserInfo;
    findTextInputs(listenToInput);
  }
);
