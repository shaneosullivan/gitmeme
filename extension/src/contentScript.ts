import parseTokens, { Token } from "./parseTokens";
import * as getCaretCoordinates from "textarea-caret";

console.log("I am here!");
function findTextInputs() {
  const ids = ["new_comment_field"];

  const inputsById = document.querySelectorAll(
    ids.map(id => `#${id}`).join(",")
  );
  console.log("inputs", inputsById);

  inputsById.forEach(listenToInput);
}

function listenToInput(input) {
  let knownTokens = [] as Array<Token>;
  input.addEventListener("keyup", evt => {
    let tokens = parseTokens(evt.target.value);

    if (tokens.length > 0) {
      // Filter the tokens that we already know about
      tokens = tokens.filter(token => {
        return !knownTokens.some(knownToken => {
          return (
            knownToken.index === token.index && knownToken.value === token.value
          );
        });
      });

      // Just do the first for now
      const coords = getCaretCoordinates(input, tokens[0].index);
      console.log("coords", coords);
    }
  });
}

findTextInputs();
