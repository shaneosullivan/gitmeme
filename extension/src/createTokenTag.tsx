import * as React from "./lib/react";
import { Token } from "./parseTokens";
import * as getCaretCoordinates from "textarea-caret";
import * as ReactDOM from "./lib/react-dom";
import searcher from "./searcher";
import TokenTag from "./components/TokenTag";
import * as uuid from "uuid";
// import getToken from "./shared/auth/getToken";
// import { GithubInfo } from "./shared/auth/githubInfo";
import { sendEvent } from "./shared/analytics";
import throttle from "./util/throttle";

const TAG_CONTAINER_ID = "__tagContainer";
const TEXT_HEIGHT = 18;

export interface TokenTagType {
  caretIsAtToken: boolean;
  closeModal: Function;
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
  onAddNewImage?: (
    tokenValue: string,
    url: string
  ) => Promise<{ status: boolean; image_url: string }>
): TokenTagType {
  const endOfTokenIdx = token.index + token.value.length + 1;
  const startCoords = getCaretCoordinates(textInput, token.index);
  const endCoords = getCaretCoordinates(textInput, endOfTokenIdx);
  let formIsAbsolutelyPositioned = false;

  let caretIsAtToken = false;

  // Check if a parent of the form is absolutely positions, such as
  // when reviewing a PR.  If so, but the tag into that DIV, so the
  // scrolling of the page will not make the tag fly off the top
  // of the screen.
  let customContainerNode = textInput.parentElement;
  while (
    customContainerNode &&
    !customContainerNode.classList.contains("position-absolute")
  ) {
    customContainerNode = customContainerNode.parentElement;
  }

  if (
    customContainerNode &&
    customContainerNode.classList.contains("position-absolute")
  ) {
    formIsAbsolutelyPositioned = true;
  }

  let tagContainer =
    customContainerNode || document.getElementById(TAG_CONTAINER_ID);

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
        formIsAbsolutelyPositioned={record.formIsAbsolutelyPositioned}
        selectedImage={record.imageUrl}
        images={record.imageUrls}
        token={token}
        position={record.position}
        modalIsOpen={record.modalIsOpen}
        trimTop={record.trimTop}
        trimBottom={record.trimBottom}
        onLogIn={() => {
          sendEvent("action", "login", "begin", "inline");
          chrome.runtime.sendMessage({ data: "login" }, success => {
            if (success) {
              function reload() {
                window.location.reload();
              }
              sendEvent("action", "login", "success", "inline")
                .then(reload)
                .catch(reload);
            } else {
              sendEvent("action", "login", "fail", "inline");
            }
          });
        }}
        onSelectImage={(url: string) => {
          record.imageUrl = url;
          preferredTagUrls[token.value] = url;
          record.modalIsOpen = false;
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
            ? async (
                url: string | null
              ): Promise<{ status: boolean; image_url: string }> => {
                // If the onAddNewImage function is null, set this to null too
                const { status: addSucceeded, image_url } = await onAddNewImage(
                  token.value,
                  url
                );

                if (addSucceeded) {
                  record.imageUrl = url;
                  record.imageUrls.unshift(url);
                  record.isValid = true;

                  renderTag();
                }

                return { status: addSucceeded, image_url };
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
    let top = -textInput.scrollTop,
      left;
    const rect = textInput.getBoundingClientRect();
    let hideTag = false;

    let aboveTopOfInputPx;
    let belowBottomOfInputPx;

    if (!customContainerNode) {
      // If the text input is not inside a modal, position
      // the tag relative to the window.
      top += TEXT_HEIGHT + window.scrollY + rect.top + startCoords.top;
      left = window.scrollX + rect.left + startCoords.left;

      // If the tag is above the top or below the bottom of the text input,
      // then hide it
      aboveTopOfInputPx = -(top - window.scrollY - 2 - TEXT_HEIGHT - rect.top);
      belowBottomOfInputPx = top - window.scrollY + 4 - rect.bottom;
    } else {
      // If the text input is in a modal, position the tag
      // relative to the modal position
      const containerRect = customContainerNode.getBoundingClientRect();

      top += TEXT_HEIGHT + rect.top - containerRect.top + startCoords.top;
      left = rect.left - containerRect.left + startCoords.left;

      aboveTopOfInputPx = -(
        top -
        1 -
        TEXT_HEIGHT +
        containerRect.top -
        rect.top
      );
      belowBottomOfInputPx =
        top + 5 + containerRect.top - rect.height - rect.top;
    }

    const completelyAboveTopOfInput = aboveTopOfInputPx > TEXT_HEIGHT + 4;

    const completelyBelowBottomOfInput = belowBottomOfInputPx > TEXT_HEIGHT + 4;

    if (completelyAboveTopOfInput || completelyBelowBottomOfInput) {
      hideTag = true;
      record.modalIsOpen = false;
    } else if (aboveTopOfInputPx > 0) {
      record.trimBottom = 0;
      record.trimTop = aboveTopOfInputPx;
    } else if (belowBottomOfInputPx > 0) {
      record.trimBottom = belowBottomOfInputPx;
      record.trimTop = 0;
    } else {
      record.trimBottom = 0;
      record.trimTop = 0;
    }

    if (hideTag) {
      left = 10000;
    }

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
    textInput.removeEventListener("scroll", handleScroll);
  }

  function handleInputKey(evt) {
    // Up arrow
    if (evt.keyCode === 38) {
      if (record.caretIsAtToken) {
        if (!record.modalIsOpen) {
          evt.preventDefault();
          evt.stopPropagation();
          record.modalIsOpen = true;
          renderTag();
          return false;
        }
      }
    }
    closeModal();
    return true;
  }

  function handleInputClick(_evt) {
    closeModal();
    checkCaretPosition();
  }

  function closeModal() {
    if (record.modalIsOpen) {
      record.modalIsOpen = false;
      renderTag();
    }
  }

  const handleScroll = throttle(() => {
    reposition();
  }, 25);

  const existingPreferredImageUrl = preferredTagUrls[token.value] || null;

  const record = {
    caretIsAtToken: false,
    modalIsOpen: false,
    input: textInput,
    remove,
    closeModal,
    reposition,
    token,
    isValid: existingPreferredImageUrl ? true : false,
    imageUrl: existingPreferredImageUrl,
    imageUrls: [],
    disabled: false,
    position: { top: 0, left: 0, width: 0 },
    trimTop: 0,
    trimBottom: 0,
    formIsAbsolutelyPositioned
  };

  reposition();
  checkCaretPosition();
  textInput.addEventListener("keyup", checkCaretPosition);
  textInput.addEventListener("keydown", handleInputKey, true);
  textInput.addEventListener("click", handleInputClick);
  textInput.addEventListener("scroll", handleScroll);

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
