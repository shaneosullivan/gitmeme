import { Token } from "./parseTokens";
import * as getCaretCoordinates from "textarea-caret";
import searcher from "./searcher";

const TAG_CONTAINER_ID = "__tagContainer";
const TEXT_HEIGHT = 18;

export interface TokenTag {
  reposition: Function;
  input: Element;
  isValid: boolean;
  token: Token;
  remove: Function;
  imageUrl: string | null;
}

let removeOpenImage = null;

export default function createTokenTag(
  textInput: Element,
  token: Token
): TokenTag {
  const startCoords = getCaretCoordinates(textInput, token.index);
  const endCoords = getCaretCoordinates(
    textInput,
    token.index + token.value.length + 1
  );

  let tagContainer = document.getElementById(TAG_CONTAINER_ID);
  if (!tagContainer) {
    tagContainer = document.createElement("div");
    tagContainer.id = TAG_CONTAINER_ID;
    document.body.appendChild(tagContainer);
  }

  const tagUi = document.createElement("div");
  let imageUrl = null;
  let imageUi = null;
  tagUi.className = "__tokenTag";

  tagContainer.appendChild(tagUi);

  function removeImage() {
    tagContainer.removeChild(imageUi);
    imageUi = null;
    if (removeOpenImage === removeImage) {
      removeOpenImage = null;
    }
  }

  tagUi.addEventListener("click", evt => {
    // If a url exists, then show the image in thumnail form.
    // If the url does not exist, open a typeahead to find the
    // image you want (laterz...)

    if (imageUrl) {
      if (imageUi) {
        removeImage();
      } else {
        if (removeOpenImage) {
          removeOpenImage();
        }
        imageUi = document.createElement("img");
        imageUi.className = "__tokenTagThumbnail";
        imageUi.src = imageUrl;

        imageUi.addEventListener("click", removeImage);

        tagContainer.appendChild(imageUi);
        removeOpenImage = removeImage;

        reposition();
      }
    }
  });

  function reposition() {
    const rect = textInput.getBoundingClientRect();
    const top = TEXT_HEIGHT + window.scrollY + rect.top + startCoords.top;
    const left = window.scrollX + rect.left + startCoords.left;
    tagUi.style.top = top + "px";
    tagUi.style.left = left + "px";
    tagUi.style.width = endCoords.left - startCoords.left + "px";

    if (imageUi) {
      imageUi.style.top = top + 2 + "px";
      imageUi.style.left = left + "px";
    }
  }

  function remove() {
    console.log("remove for ", token.value, tagUi);
    tagUi.parentNode.removeChild(tagUi);

    if (imageUi) {
      imageUi.parentNode.removeChild(imageUi);
    }
  }

  reposition();

  const record = {
    input: textInput,
    remove,
    reposition,
    token,
    isValid: false,
    imageUrl: null
  };

  searcher(token.value).then((url: string | null) => {
    record.imageUrl = imageUrl = url;

    record.isValid = !!url;

    if (url) {
      tagUi.className += " imageFound";
      tagUi.title = `GitMeme for "${token.value}"`;
    } else {
      tagUi.className += " imageNotFound";
      tagUi.title = `GitMeme: No image found for "${token.value}"`;
    }
  });

  return record;
}
