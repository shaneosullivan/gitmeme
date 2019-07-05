/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GITHUB_CLIENT_ID = "9b9e17e168e82438cfb6";
exports.API_ROOT_URL = "https://us-central1-git-meme-prod.cloudfunctions.net/api";
// DO NOT CHECK IN
// export const API_ROOT_URL =
//   "http://localhost:5000/git-meme-prod/us-central1/api";


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function createAuthHeader(userId, token) {
    return {
        Authorization: `Bearer ${userId}___${token}`,
        "Content-Type": "application/json"
    };
}
exports.default = createAuthHeader;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getLoggedInUser_1 = __webpack_require__(3);
function getGithubInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            chrome.storage.sync.get(["github_token", "github_id", "github_avatar"], function (results) {
                if (results.github_token) {
                    resolve({
                        token: results.github_token || null,
                        id: results.github_id || null,
                        avatar: results.github_avatar || null
                    });
                }
                else {
                    const loggedInUser = getLoggedInUser_1.default();
                    resolve({
                        token: null,
                        id: loggedInUser ? loggedInUser.id : null,
                        avatar: loggedInUser ? loggedInUser.avatar : null
                    });
                }
            });
        });
    });
}
exports.getGithubInfo = getGithubInfo;
function setGithubToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            chrome.storage.sync.set({ github_token: token }, function () {
                resolve();
            });
        });
    });
}
exports.setGithubToken = setGithubToken;
function setGithubUserId(userId, avatarUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            chrome.storage.sync.set({ github_id: userId, github_avatar: avatarUrl }, function () {
                resolve();
            });
        });
    });
}
exports.setGithubUserId = setGithubUserId;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getLoggedInUser() {
    const avatarNode = document.querySelector("summary img.avatar");
    if (avatarNode) {
        const userName = (avatarNode.getAttribute("alt") || "").substring(1);
        const avatar = avatarNode.getAttribute("src");
        return {
            id: userName,
            avatar
        };
    }
    return null;
}
exports.default = getLoggedInUser;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const parseTokens_1 = __webpack_require__(5);
const createTokenTag_1 = __webpack_require__(6);
const throttle_1 = __webpack_require__(10);
const getParentByTagName_1 = __webpack_require__(11);
const findTextInputs_1 = __webpack_require__(12);
const githubInfo_1 = __webpack_require__(2);
const consts_1 = __webpack_require__(0);
const createAuthHeader_1 = __webpack_require__(1);
const getLoggedInUser_1 = __webpack_require__(3);
let userInfo;
// Get the logged in user from the DOM
const loggedInUser = getLoggedInUser_1.default();
function listenToInput(input) {
    let knownTokens = [];
    let toolbarButtonItem;
    let activeTag = null;
    const updateTokensForInput = throttle_1.default(() => {
        let tokens = parseTokens_1.default(input.value);
        if (tokens.length > 0) {
            // Filter the tokens that we already know about
            const unknownTokens = tokens.filter(token => {
                return !knownTokens.some(knownToken => {
                    return (knownToken.token.index === token.index &&
                        knownToken.token.value === token.value);
                });
            });
            unknownTokens.forEach(token => {
                const tokenTag = createTokenTag_1.default(input, token, onTokenActive);
                knownTokens.push(tokenTag);
            });
        }
        // Remove any tokens that are no longer valid
        knownTokens = knownTokens.filter(knownToken => {
            const stillExists = tokens.some(newToken => {
                return (knownToken.token.index === newToken.index &&
                    knownToken.token.value === newToken.value);
            });
            if (!stillExists) {
                knownToken.remove();
            }
            return stillExists;
        });
    }, 500);
    let formNode = getParentByTagName_1.default(input, "form");
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
    function processPreSubmit(evt) {
        // Process the tokens from the last to the first, so that
        // we can modify the text contents without changing the
        // index positions of tokens before we process them
        knownTokens.sort((a, b) => {
            if (a.token.index > b.token.index) {
                return -1;
            }
            else if (b.token.index > a.token.index) {
                return 1;
            }
            return 0;
        });
        let value = input.value;
        knownTokens.forEach(knownToken => {
            if (knownToken.isValid && !knownToken.disabled) {
                value =
                    value.substring(0, knownToken.token.index) +
                        `<img src="${knownToken.imageUrl}" title="Created by gitme.me with /${knownToken.token.value}"/>` +
                        value.substring(knownToken.token.index + knownToken.token.value.length + 1);
                const isLoggedIn = userInfo &&
                    userInfo.id &&
                    userInfo.token &&
                    loggedInUser &&
                    loggedInUser.id === userInfo.id;
                fetch(`${consts_1.API_ROOT_URL}/add_token_by_url`, {
                    method: "POST",
                    headers: isLoggedIn
                        ? Object.assign({}, createAuthHeader_1.default(userInfo.id, userInfo.token)) : {},
                    body: JSON.stringify({
                        image_url: knownToken.imageUrl,
                        token: knownToken.token.value
                    })
                });
                if (loggedInUser) {
                    // Also store the used tokens locally, so they work even when
                    // not authorized with the extension.
                    const tokenStorageKey = `image:${loggedInUser.id}_${knownToken.token.value}`;
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
    function onTokenActive(isActive, tokenTag) {
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
    function addToolbarButton(form) {
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
            toolbarButton.addEventListener("click", (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                if (activeTag) {
                    console.log("activeTag is ", activeTag);
                }
            });
            toolbarNode.appendChild(toolbarButton);
        }
        else {
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
    var mutationObserver = new MutationObserver(function (evt) {
        if (evt[0].removedNodes &&
            Array.from(evt[0].removedNodes).indexOf(input) > -1) {
            cleanUp();
        }
        else if (input.offsetHeight === 0) {
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
githubInfo_1.getGithubInfo().then((localUserInfo) => {
    userInfo = localUserInfo;
    findTextInputs_1.default(listenToInput);
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Find all words beginning with "/"
const regex = /(?<!\w)\/\w+/g;
const charPrefixes = {
    "\n": true,
    "\t": true,
    " ": true
};
function parseTokens(str) {
    const ret = [];
    let match;
    do {
        match = regex.exec(str);
        if (match) {
            // This is probably doable in regex, but screw it...
            // Filter it out so that only tokens that are
            // - at the start of a line
            // -   or after a space or a tab
            // - are at the end of a line
            // -   or are followed by a space or a tab
            // - are not inside an <img> tag
            // are valid
            const index = match.index;
            let startIsValid = index === 0;
            if (!startIsValid) {
                const letterBefore = str.charAt(index - 1);
                startIsValid = !!charPrefixes[letterBefore];
            }
            let endIsValid = index + match[0].length === str.length;
            if (!endIsValid) {
                // If not at the end of the string, check the characters after it
                const letterAfter = str.charAt(index + match[0].length);
                endIsValid = !!charPrefixes[letterAfter];
            }
            let outsideImageValid = true;
            let imgIdx = str.indexOf("<img", 0);
            while (outsideImageValid && imgIdx > -1) {
                const closingBracket = str.indexOf(">", imgIdx);
                if (closingBracket > -1) {
                    if (index > imgIdx && index < closingBracket) {
                        outsideImageValid = false;
                    }
                }
                imgIdx = str.indexOf("<img", imgIdx + 1);
            }
            if (startIsValid && endIsValid && outsideImageValid) {
                ret.push({
                    index: match.index,
                    value: match[0].substring(1).trim()
                });
            }
        }
    } while (match);
    return ret;
}
exports.default = parseTokens;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const getCaretCoordinates = __webpack_require__(7);
const searcher_1 = __webpack_require__(8);
const TAG_CONTAINER_ID = "__tagContainer";
const TEXT_HEIGHT = 18;
let removeOpenImage = null;
const preferredTagUrls = {};
function createTokenTag(textInput, token, onTokenActive) {
    const startCoords = getCaretCoordinates(textInput, token.index);
    const endCoords = getCaretCoordinates(textInput, token.index + token.value.length + 1);
    let caretIsAtToken = false;
    let tagContainer = document.getElementById(TAG_CONTAINER_ID);
    if (!tagContainer) {
        tagContainer = document.createElement("div");
        tagContainer.id = TAG_CONTAINER_ID;
        document.body.appendChild(tagContainer);
    }
    const tagUi = document.createElement("div");
    const tagUiArrow = document.createElement("div");
    tagUiArrow.className = "__tokenTagArrow";
    tagUi.appendChild(tagUiArrow);
    let imageUi = null;
    tagUi.className = "__tokenTag";
    tagUi.setAttribute("data-token", token.value);
    tagContainer.appendChild(tagUi);
    function checkCaretPosition() {
        const caretPosition = textInput.selectionStart;
        const nextCaretIsAtToken = caretPosition >= token.index &&
            caretPosition <= token.index + token.value.length + 1;
        if (nextCaretIsAtToken !== caretIsAtToken) {
            setTimeout(() => {
                onTokenActive(nextCaretIsAtToken, record);
            });
        }
        caretIsAtToken = nextCaretIsAtToken;
        tagUi.classList.toggle("__selected", caretIsAtToken);
        setTagUiTitle();
    }
    function removeImage() {
        const hasOpenImage = imageUi && imageUi.parentNode;
        if (removeOpenImage === removeImage) {
            removeOpenImage = null;
        }
        if (hasOpenImage) {
            imageUi.parentNode.removeChild(imageUi);
            imageUi = null;
            updateTagUi();
        }
        imageUi = null;
        return hasOpenImage;
    }
    function disableImage() {
        record.disabled = true;
        removeImage();
    }
    function enableImage() {
        record.disabled = false;
        removeImage();
    }
    function setTagUiTitle() {
        let title = "";
        if (record) {
            if (!!record.imageUrl) {
                const addition = caretIsAtToken
                    ? "Click or press the down arrow to see the meme image or to select others"
                    : "Click to see the meme image or to select others";
                title = `GitMeme for "${token.value}". ${addition}`;
            }
            else {
                title = `GitMeme for "${token.value}" not found`;
            }
            if (record.disabled) {
                title = `GitMeme image disabled`;
            }
        }
        tagUi.title = title;
    }
    function updateTagUi() {
        tagUi.classList.toggle("imageFound", !!record.imageUrl);
        tagUi.classList.toggle("imageNotFound", !record.imageUrl);
        tagUi.classList.toggle("disabled", record.disabled);
        imageUi && imageUi.classList.toggle("disabled", record.disabled);
        if (imageUi) {
            imageUi.classList.toggle("hasMultipleImages", record.imageUrls.length > 1);
            const imageNode = imageUi.querySelector("img");
            if (imageNode.src !== record.imageUrl) {
                imageNode.src = record.imageUrl;
            }
        }
        setTagUiTitle();
    }
    function selectImage() {
        const wrapper = document.createElement("div");
        wrapper.className = "__imageSelector";
        wrapper.innerHTML = `
      <div class="__imageSelectorTitle">Choose One Image</div>
        ${record.imageUrls
            .map((url, idx) => {
            return `<a href="#" data-index="${idx}"><img src="${url}" /></a>`;
        })
            .join("\n")}
    `;
        tagContainer.appendChild(wrapper);
        wrapper.addEventListener("click", evt => {
            let target = evt.target;
            let targetName = target.tagName.toLowerCase();
            if (targetName === "img") {
                target = target.parentElement;
                targetName = target.tagName.toLowerCase();
            }
            if (targetName === "a") {
                record.imageUrl = record.imageUrls[target.getAttribute("data-index")];
                preferredTagUrls[record.token.value] = record.imageUrl;
                updateTagUi();
            }
            tagContainer.removeChild(wrapper);
        });
    }
    function openImageUI() {
        // If a url exists, then show the image in thumnail form.
        // If the url does not exist, open a typeahead to find the
        // image you want (laterz...)
        if (record.imageUrl) {
            if (imageUi) {
                removeImage();
            }
            else {
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
                removeButtonNode.addEventListener("click", record.disabled ? enableImage : disableImage);
                const showAllImagesNode = document.createElement("button");
                showAllImagesNode.className = "__showAllImages";
                showAllImagesNode.textContent = `+${record.imageUrls.length - 1}`;
                showAllImagesNode.addEventListener("click", selectImage);
                imageUi.appendChild(showAllImagesNode);
                updateTagUi();
                tagContainer.appendChild(imageUi);
                // Store the global reference to ensure that only one image is
                // open at a time
                removeOpenImage = removeImage;
                reposition();
            }
        }
    }
    tagUi.addEventListener("click", openImageUI);
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
        textInput.removeEventListener("keyup", checkCaretPosition);
        textInput.removeEventListener("keydown", handleInputKey, true);
        textInput.removeEventListener("click", handleInputClick);
        removeImage();
    }
    function handleInputKey(evt) {
        if (evt.keyCode === 40 && caretIsAtToken) {
            if (caretIsAtToken) {
                // Down arrow
                evt.preventDefault();
                evt.stopPropagation();
                openImageUI();
                return false;
            }
        }
        else {
            removeImage();
        }
    }
    function handleInputClick(evt) {
        removeImage();
        checkCaretPosition();
    }
    const existingPreferredImageUrl = preferredTagUrls[token.value] || null;
    const record = {
        input: textInput,
        remove,
        reposition,
        token,
        isValid: existingPreferredImageUrl ? true : false,
        imageUrl: existingPreferredImageUrl,
        imageUrls: [],
        disabled: false
    };
    reposition();
    checkCaretPosition();
    textInput.addEventListener("keyup", checkCaretPosition);
    textInput.addEventListener("keydown", handleInputKey, true);
    textInput.addEventListener("click", handleInputClick);
    searcher_1.default(token.value).then((urls) => {
        const url = urls.length > 0 ? urls[0] : null;
        record.imageUrl = record.imageUrl || url;
        record.imageUrls = urls;
        record.isValid = !!url;
        updateTagUi();
    });
    return record;
}
exports.default = createTokenTag;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* jshint browser: true */

(function () {

// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
var properties = [
  'direction',  // RTL support
  'boxSizing',
  'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY',  // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',  // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'

];

var isBrowser = (typeof window !== 'undefined');
var isFirefox = (isBrowser && window.mozInnerScreenX != null);

function getCaretCoordinates(element, position, options) {
  if (!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
  }

  var debug = options && options.debug || false;
  if (debug) {
    var el = document.querySelector('#input-textarea-caret-position-mirror-div');
    if (el) el.parentNode.removeChild(el);
  }

  // The mirror div will replicate the textarea's style
  var div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  var style = div.style;
  var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
  var isInput = element.nodeName === 'INPUT';

  // Default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (!isInput)
    style.wordWrap = 'break-word';  // only for textarea-s

  // Position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  if (!debug)
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

  // Transfer the element's properties to the div
  properties.forEach(function (prop) {
    if (isInput && prop === 'lineHeight') {
      // Special case for <input>s because text is rendered centered and line height may be != height
      style.lineHeight = computed.height;
    } else {
      style[prop] = computed[prop];
    }
  });

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position);
  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (isInput)
    div.textContent = div.textContent.replace(/\s/g, '\u00a0');

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, just '.' would be enough, but no need to bother.
  span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  div.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  };

  if (debug) {
    span.style.backgroundColor = '#aaa';
  } else {
    document.body.removeChild(div);
  }

  return coordinates;
}

if ( true && typeof module.exports != 'undefined') {
  module.exports = getCaretCoordinates;
} else if(isBrowser) {
  window.getCaretCoordinates = getCaretCoordinates;
}

}());


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = __webpack_require__(9);
const consts_1 = __webpack_require__(0);
const createAuthHeader_1 = __webpack_require__(1);
const githubInfo_1 = __webpack_require__(2);
const GIPHY_API_KEY = "I5ysXzZG4OIoiMD99Tz7v6AGN9uzGWpr";
function searcher(tokenValue) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tokenValue) {
            return null;
        }
        function filterToRemoveIdenticalImages(arr) {
            const seen = {};
            return arr.filter(url => {
                if (seen[url]) {
                    return false;
                }
                seen[url] = true;
                return true;
            });
        }
        return new Promise((resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
            let results = [];
            let gitmemeComplete = false;
            let localComplete = false;
            let giphyResult = null;
            let isResolved = false;
            function doResolve() {
                if (isResolved) {
                    return;
                }
                isResolved = true;
                resolve(filterToRemoveIdenticalImages(results));
            }
            const userInfo = yield githubInfo_1.getGithubInfo();
            if (userInfo && userInfo.id) {
                const tokenStorageKey = `image:${userInfo.id}_${tokenValue}`;
                chrome.storage.local.get([tokenStorageKey], (localResults) => {
                    localComplete = true;
                    if (localResults[tokenStorageKey]) {
                        results.unshift(localResults[tokenStorageKey]);
                        doResolve();
                    }
                });
            }
            else {
                localComplete = true;
            }
            // Only search our API if the user has logged in with us
            if (userInfo && userInfo.id && userInfo.token) {
                const gitmemeUrl = `${consts_1.API_ROOT_URL}/search?t=${encodeURIComponent(tokenValue)}`;
                fetch(gitmemeUrl, {
                    headers: Object.assign({}, createAuthHeader_1.default(userInfo.id, userInfo.token))
                })
                    .then(function (response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    // Read the response as json.
                    return response.json();
                })
                    .then(function (data) {
                    // Do stuff with the JSON
                    gitmemeComplete = true;
                    if (data && data.url) {
                        // The first party images are put in the first position
                        results.unshift(data.url);
                        doResolve();
                    }
                    else if (giphyResult) {
                        doResolve();
                    }
                })
                    .catch(function (error) {
                    console.log("Looks like there was a problem: \n", error);
                });
            }
            else {
                gitmemeComplete = true;
            }
            try {
                giphyResult = yield searchGiphy(tokenValue);
                if (giphyResult.data && giphyResult.data.length > 0) {
                    giphyResult.data
                        .map(imageData => imageData.images.downsized_medium.url)
                        .forEach(url => {
                        results.push(url);
                    });
                    // If the Gitmeme request has completed but didn't find anything,
                    // then resolve the Promise.
                    // If the Gitmeme request has not completed, wait for it
                    // If the Gitmeme request has completed and found something,
                    //   then it will have already resolved
                    if (gitmemeComplete &&
                        localComplete &&
                        results.length === giphyResult.data.length) {
                        doResolve();
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
            return [];
        }));
    });
}
exports.default = searcher;
const giphySearches = {};
function searchGiphy(tokenValue) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!giphySearches[tokenValue]) {
            giphySearches[tokenValue] = new Promise((resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
                let limit = 8;
                while (limit > 2) {
                    try {
                        const result = yield fetch(`https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(tokenValue)}&api_key=${GIPHY_API_KEY}&limit=${limit}`);
                        const data = yield result.json();
                        resolve(data);
                        break;
                    }
                    catch (err) {
                        limit--;
                    }
                }
            }));
        }
        return giphySearches[tokenValue];
    });
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
exports.default = global.fetch.bind(global);

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options)
        options = {};
    var later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout)
            context = args = null;
    };
    return function () {
        var now = Date.now();
        if (!previous && options.leading === false)
            previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout)
                context = args = null;
        }
        else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}
exports.default = throttle;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getParentByTagName(node, tagName) {
    let foundNode = node.parentElement;
    while (foundNode && foundNode.tagName.toLowerCase() !== tagName) {
        foundNode = foundNode.parentElement;
    }
    return foundNode || null;
}
exports.default = getParentByTagName;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function findTextInputs(listenToInput) {
    const ids = ["new_comment_field", "issue_body"];
    const inputsById = Array.from(document.querySelectorAll(ids.map(id => `#${id}`).join(",")));
    const allInputs = inputsById;
    let listeners = allInputs.map(listenToInput);
    // Listen to any lazily created text areas too
    document.body.addEventListener("focusin", (evt) => {
        const node = evt.target;
        const tagName = node.tagName;
        if (tagName &&
            tagName.toLowerCase() === "textarea" &&
            !listeners.some(listener => {
                return listener.input === node;
            })) {
            listeners.push(listenToInput(node));
        }
    });
    setInterval(() => {
        const newListeners = validateListeners(listeners);
        if (newListeners.length !== listeners.length) {
            listeners = newListeners;
        }
    }, 200);
}
exports.default = findTextInputs;
function validateListeners(listeners) {
    const newListeners = listeners.filter(listener => {
        // A Node's offsetParent is null if it or any of its
        // parent nodes are hidden.  Handy!
        if (!listener.input.offsetParent) {
            console.log("Cleaning up", listener.input);
            listener.remove();
            return false;
        }
        return true;
    });
    return newListeners;
}


/***/ })
/******/ ]);