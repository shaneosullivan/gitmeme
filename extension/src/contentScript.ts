import parseTokens, { Token } from "./parseTokens";
import createTokenTag, { TokenTag } from "./createTokenTag";
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
  let knownTokens = [] as Array<TokenTag>;
  let toolbarButtonItem;
  let activeTag: TokenTag = null;

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
          const tokenTag = createTokenTag(input, token, onTokenActive);
          knownTokens.push(tokenTag);
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
    500,
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
    formNode.removeEventListener("submit", processPreSubmit, true);
  }

  // Replace all the tokens with image tags
  function processPreSubmit(evt: Event) {
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

        const isLoggedIn =
          userInfo &&
          userInfo.id &&
          userInfo.token &&
          loggedInUser &&
          loggedInUser.id === userInfo.id;

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

  function onTokenActive(isActive: boolean, tokenTag: TokenTag) {
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

        if (activeTag) {
          console.log("activeTag is ", activeTag);
        }
      });

      toolbarNode.appendChild(toolbarButton);
    } else {
      console.log("no toolbar button on form ", form);
    }
  }

  input.addEventListener("keyup", updateTokensForInput);
  input.addEventListener("change", updateTokensForInput);
  input.addEventListener("focus", updateTokensForInput);
  formNode.addEventListener("submit", processPreSubmit, true);

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

  return {
    input,
    remove: cleanUp
  };
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
