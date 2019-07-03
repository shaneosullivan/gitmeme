import parseTokens from "./parseTokens";
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

  const updateTokensForInput = throttle(() => {
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
        const tokenTag = createTokenTag(input, token);
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
  }, 500);

  let formNode = getParentByTagName(input, "form");

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
        value =
          value.substring(0, knownToken.token.index) +
          `<img src="${knownToken.imageUrl}" title="Created by gitme.me with /${
            knownToken.token.value
          }"/>` +
          value.substring(
            knownToken.token.index + knownToken.token.value.length + 1
          );

        if (
          userInfo &&
          userInfo.id &&
          userInfo.token &&
          loggedInUser &&
          loggedInUser.id === userInfo
        ) {
          fetch(`${API_ROOT_URL}/add_token_by_url`, {
            method: "POST",
            headers: {
              ...createAuthHeader(userInfo.id, userInfo.token)
            },
            body: JSON.stringify({
              image_url: knownToken.imageUrl,
              token: knownToken.token.value
            })
          });
        }
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

  input.addEventListener("keyup", updateTokensForInput);
  input.addEventListener("change", updateTokensForInput);
  input.addEventListener("focus", updateTokensForInput);
  formNode.addEventListener("submit", processPreSubmit, true);

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
