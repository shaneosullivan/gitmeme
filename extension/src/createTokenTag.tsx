import * as React from "./lib/react";
import { Token } from "./parseTokens";
import * as getCaretCoordinates from "textarea-caret";
import * as ReactDOM from "./lib/react-dom";
import searcher from "./searcher";
import TokenTag from "./components/TokenTag";
import * as uuid from "uuid";

const TAG_CONTAINER_ID = "__tagContainer";
const TEXT_HEIGHT = 18;

export interface TokenTagType {
  caretIsAtToken: boolean;
  reposition: Function;
  input: Element;
  isValid: boolean;
  token: Token;
  remove: Function;
  imageUrl: string | null;
  imageUrls: Array<string>;
  disabled: boolean;
  position: {
    top: number;
    left: number;
    width: number;
  };
}

// let removeOpenImage = null;

const preferredTagUrls = {};

export default function createTokenTag(
  textInput: HTMLInputElement,
  token: Token,
  onTokenActive: (isActive: boolean, tokenTag: TokenTagType) => void,
  onAddNewImage?: (tokenValue: string, url: string) => Promise<boolean>
): TokenTagType {
  const endOfTokenIdx = token.index + token.value.length + 1;
  const startCoords = getCaretCoordinates(textInput, token.index);
  const endCoords = getCaretCoordinates(textInput, endOfTokenIdx);

  let caretIsAtToken = false;

  let tagContainer = document.getElementById(TAG_CONTAINER_ID);
  if (!tagContainer) {
    tagContainer = document.createElement("div");
    tagContainer.id = TAG_CONTAINER_ID;
    document.body.appendChild(tagContainer);
  }
  let tagWrapperId = textInput.getAttribute("data-tags-id");
  if (!tagWrapperId) {
    textInput.setAttribute("data-tags-id", (tagWrapperId = uuid()));
  }

  let tagWrapperNode = document.getElementById(tagWrapperId);
  if (!tagWrapperNode) {
    tagWrapperNode = document.createElement("div");
    tagWrapperNode.setAttribute("id", tagWrapperId);
    tagContainer.appendChild(tagWrapperNode);
  }

  const tagUi = document.createElement("div");
  tagWrapperNode.appendChild(tagUi);

  function renderTag() {
    ReactDOM.render(
      <TokenTag
        isDisabled={record.disabled}
        caretActive={record.caretIsAtToken}
        selectedImage={record.imageUrl}
        images={record.imageUrls}
        token={token}
        position={record.position}
        modalIsOpen={record.modalIsOpen}
        onSelectImage={(url: string) => {
          record.imageUrl = url;
          preferredTagUrls[token.value] = url;
          renderTag();
        }}
        onToggleDisabled={() => {
          record.disabled = !record.disabled;
          if (record.disabled) {
            record.modalIsOpen = false;
          }
          renderTag();
        }}
        onToggleModal={() => {
          record.modalIsOpen = !record.modalIsOpen;
          renderTag();
        }}
        onAddNewImage={
          onAddNewImage
            ? async (url: string): Promise<boolean> => {
                // If the onAddNewImage function is null, set this to null too
                const addSucceeded = await onAddNewImage(token.value, url);

                if (addSucceeded) {
                  record.imageUrl = url;
                  record.imageUrls.unshift(url);
                  record.isValid = true;

                  renderTag();
                }

                return addSucceeded;
              }
            : null
        }
      />,
      tagUi
    );
  }

  function checkCaretPosition() {
    const caretPosition = textInput.selectionStart;
    const nextCaretIsAtToken =
      caretPosition >= token.index &&
      caretPosition <= token.index + token.value.length + 1;

    if (nextCaretIsAtToken !== caretIsAtToken) {
      setTimeout(() => {
        onTokenActive(nextCaretIsAtToken, record);
      });
    }

    record.caretIsAtToken = caretIsAtToken = nextCaretIsAtToken;

    renderTag();
  }

  function reposition() {
    const rect = textInput.getBoundingClientRect();
    const top = TEXT_HEIGHT + window.scrollY + rect.top + startCoords.top;
    const left = window.scrollX + rect.left + startCoords.left;

    record.position = {
      top,
      left,
      width: endCoords.left - startCoords.left
    };

    renderTag();
  }

  function remove() {
    ReactDOM.unmountComponentAtNode(tagUi);
    tagUi.parentNode.removeChild(tagUi);
    textInput.removeEventListener("keyup", checkCaretPosition);
    textInput.removeEventListener("keydown", handleInputKey, true);
    textInput.removeEventListener("click", handleInputClick);
  }

  function handleInputKey(evt) {
    if (evt.keyCode === 40) {
      if (record.caretIsAtToken) {
        if (!record.modalIsOpen) {
          // Down arrow
          evt.preventDefault();
          evt.stopPropagation();
          record.modalIsOpen = true;
          renderTag();
          return false;
        }
      }
    }
    if (record.modalIsOpen) {
      record.modalIsOpen = false;
      renderTag();
    }
    return true;
  }

  function handleInputClick(evt) {
    if (record.modalIsOpen) {
      record.modalIsOpen = false;
      renderTag();
    }
    checkCaretPosition();
  }

  const existingPreferredImageUrl = preferredTagUrls[token.value] || null;

  const record = {
    caretIsAtToken: false,
    modalIsOpen: false,
    input: textInput,
    remove,
    reposition,
    token,
    isValid: existingPreferredImageUrl ? true : false,
    imageUrl: existingPreferredImageUrl,
    imageUrls: [],
    disabled: false,
    position: { top: 0, left: 0, width: 0 }
  };

  reposition();
  checkCaretPosition();
  textInput.addEventListener("keyup", checkCaretPosition);
  textInput.addEventListener("keydown", handleInputKey, true);
  textInput.addEventListener("click", handleInputClick);

  renderTag();

  searcher(token.value).then((urls: Array<string>) => {
    const url = urls.length > 0 ? urls[0] : null;

    record.imageUrl = record.imageUrl || url;
    record.imageUrls = urls;
    record.isValid = !!url;

    renderTag();
  });

  return record;
}
