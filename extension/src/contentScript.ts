import parseTokens from "./parseTokens";
import createTokenTag, { TokenTag } from "./createTokenTag";
import throttle from "./util/throttle";
import getParentByTagName from "./getParentByTagName";
import findTextInputs from "./util/findTextInputs";

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
  }, 200);

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
      }
    });

    input.value = value;

    cleanUp();
    evt.preventDefault();
  }

  input.addEventListener("keyup", updateTokensForInput);
  input.addEventListener("change", updateTokensForInput);
  input.addEventListener("focus", updateTokensForInput);
  formNode.addEventListener("submit", processPreSubmit, true);

  // In case the input is simply removed from the DOM without
  // being submitted, clean up too
  var mutationObserver = new MutationObserver(function(evt) {
    console.log("mutation event", evt);
    console.log("input.offsetHeight", input.offsetHeight);
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

findTextInputs(listenToInput);
