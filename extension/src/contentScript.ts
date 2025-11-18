import parseTokens from "./parseTokens";
import createTokenTag, { TokenTagType } from "./createTokenTag";
import throttle from "./util/throttle";
import getParentByTagName from "./getParentByTagName";
import findTextInputs from "./util/findTextInputs";
import { getGithubInfo, GithubInfo } from "./shared/auth/githubInfo";
import { API_ROOT_URL, FILE_SIZE_LIMIT_MB } from "./shared/consts";
import createAuthHeader from "./shared/auth/createAuthHeader";
import getLoggedInUser from "./shared/auth/getLoggedInUser";
import { sendEvent, sendPageHit } from "./shared/analytics";
import fetchApi from "./lib/fetchApi";

let userInfo = null;
let githubContext = null;

// Get the logged in user from the DOM
const loggedInUser = getLoggedInUser();

function listenToInput(input: HTMLInputElement): {
  input: HTMLElement;
  remove: Function;
} {
  let knownTokens = [] as Array<TokenTagType>;
  let toolbarButtonItem;
  let activeTag: TokenTagType = null;
  let popupIframe = null;
  let isCleanedUp = false;

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
        const unknownTokens = tokens.filter((token) => {
          return !knownTokens.some((knownToken) => {
            return (
              knownToken.token.index === token.index &&
              knownToken.token.value === token.value
            );
          });
        });
        unknownTokens.forEach((token) => {
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
      knownTokens = knownTokens.filter((knownToken) => {
        const stillExists = tokens.some((newToken) => {
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
  let previewTabButton = formNode
    ? formNode.querySelector("button.preview-tab")
    : null;

  function handleInputKeydown(evt: KeyboardEvent) {
    const isSubmitCommand =
      (navigator.platform.match("Mac") ? evt.metaKey : evt.ctrlKey) &&
      evt.key.toLowerCase() === "enter";
    if (isSubmitCommand) {
      evt.preventDefault();
      evt.stopPropagation();

      processPreSubmit();

      if (formNode) {
        formNode.submit();
        return;
      }

      const submitButton = findSubmitButtons(input).filter((btn) => {
        return !btn.disabled && btn.getAttribute("data-variant") === "primary";
      })[0];

      if (submitButton) {
        setTimeout(() => {
          submitButton.click();
        }, 500);
      }
      return;
    }
  }

  function handleInputKeyup(evt: KeyboardEvent) {
    closePopupIframe();
    updateTokensForInput();
  }

  function handleInputFocus() {
    closePopupIframe();
    updateTokensForInput();
  }

  function handleBodyClick(evt) {
    if (popupIframe) {
      closePopupIframe();
    }

    const target = evt.target as HTMLElement;

    let isButtonClick = false;
    let isPrimaryButtonClick = false;
    let isFooterClick = false;

    let currentNode: HTMLElement = target;
    while (currentNode) {
      if (!isButtonClick && currentNode.tagName === "BUTTON") {
        isButtonClick = true;

        isPrimaryButtonClick =
          currentNode.getAttribute("data-variant") === "primary";
      }
      if (
        !isFooterClick &&
        currentNode.getAttribute("data-testid") === "markdown-editor-footer"
      ) {
        isFooterClick = true;
        break;
      }
      currentNode = currentNode.parentElement;
    }

    if (isFooterClick && isPrimaryButtonClick) {
      processPreSubmit(evt);
    }
  }

  function guardEvt(listener: EventListener) {
    return function (evt: Event) {
      if (isCleanedUp) {
        console.log("Event on cleaned up listener, ignoring");
        return;
      }
      listener(evt);
    };
  }

  const listeners = [];
  function addGuardedEvt(
    node: HTMLElement | Window,
    eventName: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ) {
    const guardedListener = guardEvt(listener);
    listeners.push({ node, eventName, guardedListener, options });
    node.addEventListener(eventName, guardedListener, options);
  }

  function removeGuardedEvts() {
    listeners.forEach(({ node, eventName, guardedListener, options }) => {
      node.removeEventListener(eventName, guardedListener, options);
    });
  }

  function cleanUp() {
    knownTokens.forEach((knownToken) => {
      knownToken.remove();
    });
    knownTokens = [];

    isCleanedUp = true;
    removeGuardedEvts();

    document.body
      .querySelectorAll(".__submitButtonOverlay")
      .forEach((overlay) => {
        const parent = overlay.parentNode;
        if (parent) {
          parent.removeChild(overlay);
        }
      });

    let toolbarNode: HTMLElement = getToolbarForInput(input);
    if (toolbarNode) {
      const toolbarButton = toolbarNode.querySelector(".__toolbarButton");
      if (toolbarButton) {
        toolbarNode.removeChild(toolbarButton);
      }
    }
  }

  // Replace all the tokens with image tags
  function processPreSubmit(_evt?: Event) {
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
    knownTokens.forEach((knownToken) => {
      if (knownToken.isValid && !knownToken.disabled) {
        const tagInsert = `<a href="https://gitme.me/image?url=${encodeURIComponent(
          knownToken.imageUrl
        )}&token=${encodeURIComponent(
          knownToken.token.value
        )}" data-gitmeme-token="${encodeURIComponent(
          knownToken.token.value
        )}"><img src="${
          knownToken.imageUrl
        }" title="Created by gitme.me with /${knownToken.token.value}"
        alt="${knownToken.token.value}"/></a>`;
        value =
          value.substring(0, knownToken.token.index) +
          tagInsert +
          value.substring(
            knownToken.token.index + knownToken.token.value.length + 1
          );

        // Record the fact that each token has been used
        fetch(`${API_ROOT_URL}/add_token_by_url`, {
          method: "POST",
          headers: isLoggedIn
            ? {
                ...createAuthHeader(userInfo.id, userInfo.token),
              }
            : {},
          body: JSON.stringify({
            image_url: knownToken.imageUrl,
            token: knownToken.token.value,
            context: githubContext,
          }),
        });

        if (loggedInUser) {
          // Also store the used tokens locally, so they work even when
          // not authorized with the extension.
          const tokenStorageKey = `image:${loggedInUser.id}_${knownToken.token.value}`;
          chrome.storage.local.set({
            [tokenStorageKey]: knownToken.imageUrl,
          });
        }
      }
    });

    if (input.value !== value) {
      // Hide the text
      input.classList.add("__textareaHiddenText");
      setTimeout(() => {
        input.classList.remove("__textareaHiddenText");
      }, 5000);
    }

    // Need to use the paste function to ensure that any
    // bound listeners get triggered
    // Simply setting input.value = value; won't do that
    pasteValueIntoInput(input, value);

    // Log to Google Analytics
    if (knownTokens.length > 0) {
      const numTokens = knownTokens.length;
      const currentTokenValue = knownTokens[0].token.value;
      setTimeout(() => {
        sendEvent("action", "use_token", currentTokenValue, numTokens);
      }, 50);
    }

    closePopupIframe();

    cleanUp();
  }

  // const TOOLBAR_BUTTON_LABEL = "GM";

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
    file: File
  ): Promise<{ status: boolean; image_url: string; error?: string }> {
    if (!isLoggedIn) {
      throw new Error("Cannot add a new image unless logged in");
    }

    if (file.size / (1024 * 1024) > FILE_SIZE_LIMIT_MB) {
      return Promise.reject({
        status: false,
        error: `File is too large. Max size is ${FILE_SIZE_LIMIT_MB}MB`,
      });
    }

    return new Promise(async (resolve, _reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", tokenValue);
      formData.append("context", githubContext);

      const result = await fetchApi(
        `${API_ROOT_URL}/add_token_by_file`,
        formData,
        createAuthHeader(userInfo.id, userInfo.token)
      ).then((res) => res.json());

      resolve({
        status: result ? result.status === "success" : false,
        image_url: result ? result["image_url"] || "" : "",
      });
    });
  }

  function getToolbarForInput(input: HTMLInputElement) {
    let currentNode: HTMLElement = input;

    // Search upwards until we find a node that has a child with role="toolbar"
    let toolbarNode: HTMLElement = null;
    while (currentNode) {
      toolbarNode = currentNode.querySelector("[role='toolbar']");
      if (toolbarNode) {
        break;
      }
      currentNode = currentNode.parentElement;
    }
    return toolbarNode;
  }

  function addToolbarButton(input: HTMLInputElement) {
    // Search upwards until we find a node that has a child with role="toolbar"
    let toolbarNode: HTMLElement = getToolbarForInput(input);

    if (toolbarNode) {
      // we've already added it.
      if (toolbarNode.querySelector(".__toolbarButton")) {
        return;
      }

      const toolbarButton = document.createElement("div");
      toolbarButton.className = "d-inline-block mr-3 __toolbarButton";
      toolbarButton.title = "Gitmeme";

      toolbarButtonItem = document.createElement("button");
      toolbarButtonItem.className = "toolbar-item __toolbarButtonItem";
      toolbarButtonItem.style.backgroundImage = `url(${chrome.runtime.getURL(
        "assets/icon-48x48.png"
      )})`;
      toolbarButtonItem.style.border = "0px none";
      toolbarButtonItem.style.marginTop = "8px";

      // toolbarButtonItem.textContent = TOOLBAR_BUTTON_LABEL;

      toolbarButton.appendChild(toolbarButtonItem);

      toolbarButton.addEventListener("click", (evt: Event) => {
        evt.preventDefault();
        evt.stopPropagation();

        // Insert an iframe containing the popup
        togglePopupIframe();
      });

      toolbarNode.appendChild(toolbarButton);
    } else {
      console.log("no toolbar button for input ", input);
    }
  }

  function closePopupIframe() {
    if (popupIframe) {
      popupIframe.parentNode.removeChild(popupIframe);
      popupIframe = null;
    }
  }

  function togglePopupIframe() {
    if (popupIframe) {
      closePopupIframe();
    } else {
      popupIframe = document.createElement("iframe");
      popupIframe.className = "__popupIframe";
      toolbarButtonItem.parentNode.appendChild(popupIframe);
      popupIframe.src = chrome.runtime.getURL(
        "popup/index.html?currentUrl=" + window.location.href
      );

      sendEvent("action", "open_popup", "iframe");
    }
  }

  function handleBodyKeys(evt) {
    const { keyCode } = evt;
    // Handle the Esc key
    if (keyCode === 27) {
      closePopupIframe();
      knownTokens.forEach((token) => token.closeModal());
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

  function findSubmitButtons(
    input: HTMLInputElement
  ): Array<HTMLButtonElement> {
    const buttons: Array<HTMLButtonElement> = [];

    let currentNode: HTMLElement = input;
    while (currentNode) {
      const footerNode = currentNode.querySelector(
        "[data-testid='markdown-editor-footer']"
      );
      if (footerNode) {
        const submitButtons = Array.from(
          footerNode.querySelectorAll("button[data-variant='primary']")
        );
        submitButtons.forEach((btn) => buttons.push(btn as HTMLButtonElement));
        break;
      }
      currentNode = currentNode.parentElement;
    }
    return buttons;
  }

  function selectAllTextInInput(input: HTMLInputElement) {
    input.focus();
    input.setSelectionRange(0, input.value.length);
  }

  // Pastes a string into an input, overriding it's test completely
  function pasteValueIntoInput(input: HTMLInputElement, value: string) {
    selectAllTextInInput(input);
    document.execCommand("insertText", false, value);
  }

  function addSubmitButtonOverlays(input: HTMLInputElement) {
    const submitButtons = findSubmitButtons(input);

    // Add an overlay div on top of each submit button
    // that will process the tokens before allowing the
    // click to go through
    submitButtons.forEach((btn) => {
      const overlay = document.createElement("div");
      overlay.className = "__submitButtonOverlay";
      btn.style.position = "relative";
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.opacity = "0";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
      overlay.style.zIndex = "10";
      btn.appendChild(overlay);

      overlay.addEventListener("click", (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        console.log("Prevented click");
        processPreSubmit();

        setTimeout(() => {
          btn.click();
        }, 1000);
      });
    });
  }

  const updatePosition = throttle(() => {
    knownTokens.forEach((token) => {
      token.reposition();
    });
  }, 100);

  // Change the HTML code back into a token string for
  // when you edit a previously inserted token
  function revertTagToToken() {
    let text = input.value;
    const marker = 'data-gitmeme-token="';
    let idx = text.indexOf(marker);
    while (idx > -1) {
      // Find the <a before this
      const tagStart = text.substring(0, idx).lastIndexOf("<a ");
      const tagEnd = text.substring(idx).indexOf("</a>") + idx;
      const markerEnd =
        text.substring(idx + marker.length + 1).indexOf('"') +
        idx +
        marker.length +
        1;
      const tagOpeningEnd =
        text.substring(idx + marker.length).indexOf(">") + idx + marker.length;

      if (
        tagStart > -1 &&
        tagEnd > tagStart &&
        markerEnd > tagStart &&
        markerEnd < tagOpeningEnd &&
        tagOpeningEnd < tagEnd
      ) {
        const token = text.substring(idx + marker.length, markerEnd);
        text =
          text.substring(0, tagStart) +
          `/${token}` +
          text.substring(tagEnd + 4);
        input.value = text;
      } else {
        // something went wrong, the human has edited the code, give up
        break;
      }

      idx = text.indexOf(marker);
    }
  }

  addGuardedEvt(input, "keydown", handleInputKeydown, true);
  addGuardedEvt(input, "keyup", handleInputKeyup);
  addGuardedEvt(input, "change", updateTokensForInput);
  addGuardedEvt(input, "focus", handleInputFocus);
  addGuardedEvt(input, "mouseenter", handleMouseEnter);
  addGuardedEvt(input, "mouseout", handleMouseOut);
  addGuardedEvt(window, "resize", updatePosition);

  addGuardedEvt(document.body, "keyup", handleBodyKeys);
  if (previewTabButton) {
    addGuardedEvt(
      previewTabButton as HTMLElement,
      "click",
      processPreSubmit,
      true /* useCapture */
    );
  }
  addGuardedEvt(document.body, "click", handleBodyClick, true /* useCapture */);

  addToolbarButton(input);

  if (formNode) {
    addGuardedEvt(formNode, "submit", processPreSubmit, true /* useCapture */);
  } else {
    // If there's no form, let's add listeners directly to the
    addSubmitButtonOverlays(input);
  }

  if (formNode) {
    addToolbarButton(formNode);
    formNode.addEventListener("submit", processPreSubmit, true);
  } else {
    // If there's no form, let's add listeners directly to the
    addSubmitButtonOverlays(input);
  }

  // In case the input is simply removed from the DOM without
  // being submitted, clean up too
  var mutationObserver = new MutationObserver(function (evt) {
    if (
      evt[0].removedNodes &&
      Array.from(evt[0].removedNodes).indexOf(input) > -1
    ) {
      cleanUp();
    } else if (input.offsetHeight === 0) {
      console.log("Input hidden from DOM, cleaning up");
      cleanUp();
    }
  });

  mutationObserver.observe(input, { childList: true });

  revertTagToToken();
  updateTokensForInput();

  const ret = {
    input,
    remove: cleanUp,
  };
  return ret;
}

const metaTag = document.head.querySelector('meta[property="og:site_name"]');

// Need to support Github Enterprise too, so check that the page is in fact Github
if (
  metaTag &&
  metaTag["content"] &&
  metaTag["content"].toLowerCase().startsWith("github")
) {
  getGithubInfo().then((localUserInfo: GithubInfo) => {
    userInfo = localUserInfo;
    githubContext = localUserInfo.context;
    findTextInputs(listenToInput);
  });

  sendPageHit("inline");
}
