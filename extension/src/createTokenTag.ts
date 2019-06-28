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
  imageUrls: Array<string>;
  disabled: boolean;
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

  let imageUi = null;
  tagUi.className = "__tokenTag";

  tagContainer.appendChild(tagUi);

  function removeImage() {
    if (imageUi && imageUi.parentNode) {
      imageUi.parentNode.removeChild(imageUi);
    }
    imageUi = null;
    if (removeOpenImage === removeImage) {
      removeOpenImage = null;
    }
    updateTagUi();
  }

  function disableImage() {
    record.disabled = true;
    removeImage();
  }

  function enableImage() {
    record.disabled = false;
    removeImage();
  }

  function updateTagUi() {
    let title = "";

    tagUi.classList.toggle("imageFound", !!record.imageUrl);
    tagUi.classList.toggle("imageNotFound", !!record.imageUrl);
    if (!!record.imageUrl) {
      title = `GitMeme for "${token.value}"`;
    } else {
      title = `GitMeme for "${token.value}"`;
    }

    tagUi.classList.toggle("disabled", record.disabled);
    imageUi && imageUi.classList.toggle("disabled", record.disabled);
    if (record.disabled) {
      title = `GitMeme image disabled`;
    }

    imageUi &&
      imageUi.classList.toggle(
        "hasMultipleImages",
        record.imageUrls.length > 1
      );

    tagUi.title = title;
  }

  tagUi.addEventListener("click", evt => {
    // If a url exists, then show the image in thumnail form.
    // If the url does not exist, open a typeahead to find the
    // image you want (laterz...)

    if (record.imageUrl) {
      if (imageUi) {
        removeImage();
      } else {
        if (removeOpenImage) {
          removeOpenImage();
        }
        imageUi = document.createElement("div");
        imageUi.className = "__tokenTagThumbnail";

        const imageNode = document.createElement("img");
        imageNode.src = record.imageUrl;

        const removeButtonNode = document.createElement("button");
        removeButtonNode.textContent = record.disabled
          ? "Enable Tag"
          : "Disable Tag";

        imageUi.appendChild(imageNode);
        imageUi.appendChild(removeButtonNode);

        imageNode.addEventListener("click", removeImage);
        removeButtonNode.addEventListener(
          "click",
          record.disabled ? enableImage : disableImage
        );

        const showAllImagesNode = document.createElement("button");
        showAllImagesNode.className = "__showAllImages";
        showAllImagesNode.textContent = `+${record.imageUrls.length - 1}`;
        imageUi.appendChild(showAllImagesNode);

        updateTagUi();

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
    tagUi.parentNode.removeChild(tagUi);
    removeImage();
  }

  reposition();

  const record = {
    input: textInput,
    remove,
    reposition,
    token,
    isValid: false,
    imageUrl: null,
    imageUrls: [],
    disabled: false
  };

  console.log("searching for ", token.value);
  searcher(token.value).then((urls: Array<string>) => {
    const url = urls.length > 0 ? urls[0] : null;

    record.imageUrl = url;
    record.imageUrls = urls;
    record.isValid = !!url;

    updateTagUi();
  });

  return record;
}
