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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/contentScript.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/node-fetch/browser.js":
/*!********************************************!*\
  !*** ./node_modules/node-fetch/browser.js ***!
  \********************************************/
/*! no static exports found */
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

/***/ "./node_modules/textarea-caret/index.js":
/*!**********************************************!*\
  !*** ./node_modules/textarea-caret/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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

if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
  module.exports = getCaretCoordinates;
} else if(isBrowser) {
  window.getCaretCoordinates = getCaretCoordinates;
}

}());


/***/ }),

/***/ "./src/contentScript.ts":
/*!******************************!*\
  !*** ./src/contentScript.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const parseTokens_1 = __webpack_require__(/*! ./parseTokens */ "./src/parseTokens.ts");
const createTokenTag_1 = __webpack_require__(/*! ./createTokenTag */ "./src/createTokenTag.ts");
const throttle_1 = __webpack_require__(/*! ./util/throttle */ "./src/util/throttle.ts");
const getParentByTagName_1 = __webpack_require__(/*! ./getParentByTagName */ "./src/getParentByTagName.ts");
const findTextInputs_1 = __webpack_require__(/*! ./util/findTextInputs */ "./src/util/findTextInputs.ts");
function listenToInput(input) {
    let knownTokens = [];
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
                const tokenTag = createTokenTag_1.default(input, token);
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
    var mutationObserver = new MutationObserver(function (evt) {
        console.log("mutation event", evt);
        console.log("input.offsetHeight", input.offsetHeight);
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
findTextInputs_1.default(listenToInput);


/***/ }),

/***/ "./src/createTokenTag.ts":
/*!*******************************!*\
  !*** ./src/createTokenTag.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const getCaretCoordinates = __webpack_require__(/*! textarea-caret */ "./node_modules/textarea-caret/index.js");
const searcher_1 = __webpack_require__(/*! ./searcher */ "./src/searcher.ts");
const TAG_CONTAINER_ID = "__tagContainer";
const TEXT_HEIGHT = 18;
let removeOpenImage = null;
function createTokenTag(textInput, token) {
    const startCoords = getCaretCoordinates(textInput, token.index);
    const endCoords = getCaretCoordinates(textInput, token.index + token.value.length + 1);
    let tagContainer = document.getElementById(TAG_CONTAINER_ID);
    if (!tagContainer) {
        tagContainer = document.createElement("div");
        tagContainer.id = TAG_CONTAINER_ID;
        document.body.appendChild(tagContainer);
    }
    const tagUi = document.createElement("div");
    let imageUi = null;
    tagUi.className = "__tokenTag";
    tagUi.setAttribute("data-token", token.value);
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
        tagUi.classList.toggle("imageNotFound", !record.imageUrl);
        if (!!record.imageUrl) {
            title = `GitMeme for "${token.value}"`;
        }
        else {
            title = `GitMeme for "${token.value}"`;
        }
        tagUi.classList.toggle("disabled", record.disabled);
        imageUi && imageUi.classList.toggle("disabled", record.disabled);
        if (record.disabled) {
            title = `GitMeme image disabled`;
        }
        if (imageUi) {
            imageUi.classList.toggle("hasMultipleImages", record.imageUrls.length > 1);
            const imageNode = imageUi.querySelector("img");
            if (imageNode.src !== record.imageUrl) {
                imageNode.src = record.imageUrl;
            }
        }
        tagUi.title = title;
    }
    function selectImage() {
        const wrapper = document.createElement("div");
        wrapper.className = "__imageSelector";
        wrapper.innerHTML = `
      <div class="__imageSelectorTitle">Choose One Image</div>
        ${record.imageUrls
            .filter((_, idx) => idx < 4)
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
                updateTagUi();
            }
            tagContainer.removeChild(wrapper);
        });
    }
    tagUi.addEventListener("click", evt => {
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
    searcher_1.default(token.value).then((urls) => {
        const url = urls.length > 0 ? urls[0] : null;
        record.imageUrl = url;
        record.imageUrls = urls;
        record.isValid = !!url;
        updateTagUi();
    });
    return record;
}
exports.default = createTokenTag;


/***/ }),

/***/ "./src/getParentByTagName.ts":
/*!***********************************!*\
  !*** ./src/getParentByTagName.ts ***!
  \***********************************/
/*! no static exports found */
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

/***/ "./src/parseTokens.ts":
/*!****************************!*\
  !*** ./src/parseTokens.ts ***!
  \****************************/
/*! no static exports found */
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
            // - after a space or a tab
            // are valid
            const index = match.index;
            let isValid = index === 0;
            if (!isValid) {
                const letterBefore = str.charAt(index - 1);
                isValid = !!charPrefixes[letterBefore];
            }
            if (isValid) {
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

/***/ "./src/searcher.ts":
/*!*************************!*\
  !*** ./src/searcher.ts ***!
  \*************************/
/*! no static exports found */
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
const fetch = __webpack_require__(/*! node-fetch */ "./node_modules/node-fetch/browser.js");
const GIPHY_API_KEY = "I5ysXzZG4OIoiMD99Tz7v6AGN9uzGWpr";
function searcher(tokenValue) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (tokenValue) {
            case "foo":
                return ["https://joinpromise.com/assets/media/Measure_Efficacy.svg"];
            case "bar":
                return ["https://payticket.io/static/images/logos/epa_logo.jpg"];
            case "shipit":
                return ["https://media.giphy.com/media/79qf1N4RJtc8o/giphy.gif"];
            default:
                try {
                    const giphyResult = yield searchGiphy(tokenValue);
                    if (giphyResult.data && giphyResult.data.length > 0) {
                        return giphyResult.data.map(imageData => imageData.images.downsized_still.url);
                    }
                }
                catch (err) {
                    console.error(err);
                }
                return [];
        }
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
                        console.error(err);
                        limit--;
                    }
                }
            }));
        }
        return giphySearches[tokenValue];
    });
}


/***/ }),

/***/ "./src/util/findTextInputs.ts":
/*!************************************!*\
  !*** ./src/util/findTextInputs.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function findTextInputs(listenToInput) {
    const ids = ["new_comment_field", "issue_body"];
    const inputsById = Array.from(document.querySelectorAll(ids.map(id => `#${id}`).join(",")));
    console.log("inputsById", inputsById);
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


/***/ }),

/***/ "./src/util/throttle.ts":
/*!******************************!*\
  !*** ./src/util/throttle.ts ***!
  \******************************/
/*! no static exports found */
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGV4dGFyZWEtY2FyZXQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRTY3JpcHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NyZWF0ZVRva2VuVGFnLnRzIiwid2VicGFjazovLy8uL3NyYy9nZXRQYXJlbnRCeVRhZ05hbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlVG9rZW5zLnRzIiwid2VicGFjazovLy8uL3NyYy9zZWFyY2hlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9maW5kVGV4dElucHV0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC90aHJvdHRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3hDYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbnRlbnRTY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb250ZW50U2NyaXB0LnRzXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHJlZjogaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG52YXIgZ2V0R2xvYmFsID0gZnVuY3Rpb24gKCkge1xuXHQvLyB0aGUgb25seSByZWxpYWJsZSBtZWFucyB0byBnZXQgdGhlIGdsb2JhbCBvYmplY3QgaXNcblx0Ly8gYEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKClgXG5cdC8vIEhvd2V2ZXIsIHRoaXMgY2F1c2VzIENTUCB2aW9sYXRpb25zIGluIENocm9tZSBhcHBzLlxuXHRpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7IHJldHVybiBzZWxmOyB9XG5cdGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gd2luZG93OyB9XG5cdGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gZ2xvYmFsOyB9XG5cdHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0Jyk7XG59XG5cbnZhciBnbG9iYWwgPSBnZXRHbG9iYWwoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZ2xvYmFsLmZldGNoO1xuXG4vLyBOZWVkZWQgZm9yIFR5cGVTY3JpcHQgYW5kIFdlYnBhY2suXG5leHBvcnRzLmRlZmF1bHQgPSBnbG9iYWwuZmV0Y2guYmluZChnbG9iYWwpO1xuXG5leHBvcnRzLkhlYWRlcnMgPSBnbG9iYWwuSGVhZGVycztcbmV4cG9ydHMuUmVxdWVzdCA9IGdsb2JhbC5SZXF1ZXN0O1xuZXhwb3J0cy5SZXNwb25zZSA9IGdsb2JhbC5SZXNwb25zZTsiLCIvKiBqc2hpbnQgYnJvd3NlcjogdHJ1ZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4vLyBXZSdsbCBjb3B5IHRoZSBwcm9wZXJ0aWVzIGJlbG93IGludG8gdGhlIG1pcnJvciBkaXYuXG4vLyBOb3RlIHRoYXQgc29tZSBicm93c2Vycywgc3VjaCBhcyBGaXJlZm94LCBkbyBub3QgY29uY2F0ZW5hdGUgcHJvcGVydGllc1xuLy8gaW50byB0aGVpciBzaG9ydGhhbmQgKGUuZy4gcGFkZGluZy10b3AsIHBhZGRpbmctYm90dG9tIGV0Yy4gLT4gcGFkZGluZyksXG4vLyBzbyB3ZSBoYXZlIHRvIGxpc3QgZXZlcnkgc2luZ2xlIHByb3BlcnR5IGV4cGxpY2l0bHkuXG52YXIgcHJvcGVydGllcyA9IFtcbiAgJ2RpcmVjdGlvbicsICAvLyBSVEwgc3VwcG9ydFxuICAnYm94U2l6aW5nJyxcbiAgJ3dpZHRoJywgIC8vIG9uIENocm9tZSBhbmQgSUUsIGV4Y2x1ZGUgdGhlIHNjcm9sbGJhciwgc28gdGhlIG1pcnJvciBkaXYgd3JhcHMgZXhhY3RseSBhcyB0aGUgdGV4dGFyZWEgZG9lc1xuICAnaGVpZ2h0JyxcbiAgJ292ZXJmbG93WCcsXG4gICdvdmVyZmxvd1knLCAgLy8gY29weSB0aGUgc2Nyb2xsYmFyIGZvciBJRVxuXG4gICdib3JkZXJUb3BXaWR0aCcsXG4gICdib3JkZXJSaWdodFdpZHRoJyxcbiAgJ2JvcmRlckJvdHRvbVdpZHRoJyxcbiAgJ2JvcmRlckxlZnRXaWR0aCcsXG4gICdib3JkZXJTdHlsZScsXG5cbiAgJ3BhZGRpbmdUb3AnLFxuICAncGFkZGluZ1JpZ2h0JyxcbiAgJ3BhZGRpbmdCb3R0b20nLFxuICAncGFkZGluZ0xlZnQnLFxuXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9mb250XG4gICdmb250U3R5bGUnLFxuICAnZm9udFZhcmlhbnQnLFxuICAnZm9udFdlaWdodCcsXG4gICdmb250U3RyZXRjaCcsXG4gICdmb250U2l6ZScsXG4gICdmb250U2l6ZUFkanVzdCcsXG4gICdsaW5lSGVpZ2h0JyxcbiAgJ2ZvbnRGYW1pbHknLFxuXG4gICd0ZXh0QWxpZ24nLFxuICAndGV4dFRyYW5zZm9ybScsXG4gICd0ZXh0SW5kZW50JyxcbiAgJ3RleHREZWNvcmF0aW9uJywgIC8vIG1pZ2h0IG5vdCBtYWtlIGEgZGlmZmVyZW5jZSwgYnV0IGJldHRlciBiZSBzYWZlXG5cbiAgJ2xldHRlclNwYWNpbmcnLFxuICAnd29yZFNwYWNpbmcnLFxuXG4gICd0YWJTaXplJyxcbiAgJ01velRhYlNpemUnXG5cbl07XG5cbnZhciBpc0Jyb3dzZXIgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpO1xudmFyIGlzRmlyZWZveCA9IChpc0Jyb3dzZXIgJiYgd2luZG93Lm1veklubmVyU2NyZWVuWCAhPSBudWxsKTtcblxuZnVuY3Rpb24gZ2V0Q2FyZXRDb29yZGluYXRlcyhlbGVtZW50LCBwb3NpdGlvbiwgb3B0aW9ucykge1xuICBpZiAoIWlzQnJvd3Nlcikge1xuICAgIHRocm93IG5ldyBFcnJvcigndGV4dGFyZWEtY2FyZXQtcG9zaXRpb24jZ2V0Q2FyZXRDb29yZGluYXRlcyBzaG91bGQgb25seSBiZSBjYWxsZWQgaW4gYSBicm93c2VyJyk7XG4gIH1cblxuICB2YXIgZGVidWcgPSBvcHRpb25zICYmIG9wdGlvbnMuZGVidWcgfHwgZmFsc2U7XG4gIGlmIChkZWJ1Zykge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2Jyk7XG4gICAgaWYgKGVsKSBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgfVxuXG4gIC8vIFRoZSBtaXJyb3IgZGl2IHdpbGwgcmVwbGljYXRlIHRoZSB0ZXh0YXJlYSdzIHN0eWxlXG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlkID0gJ2lucHV0LXRleHRhcmVhLWNhcmV0LXBvc2l0aW9uLW1pcnJvci1kaXYnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgdmFyIHN0eWxlID0gZGl2LnN0eWxlO1xuICB2YXIgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpIDogZWxlbWVudC5jdXJyZW50U3R5bGU7ICAvLyBjdXJyZW50U3R5bGUgZm9yIElFIDwgOVxuICB2YXIgaXNJbnB1dCA9IGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCc7XG5cbiAgLy8gRGVmYXVsdCB0ZXh0YXJlYSBzdHlsZXNcbiAgc3R5bGUud2hpdGVTcGFjZSA9ICdwcmUtd3JhcCc7XG4gIGlmICghaXNJbnB1dClcbiAgICBzdHlsZS53b3JkV3JhcCA9ICdicmVhay13b3JkJzsgIC8vIG9ubHkgZm9yIHRleHRhcmVhLXNcblxuICAvLyBQb3NpdGlvbiBvZmYtc2NyZWVuXG4gIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJzsgIC8vIHJlcXVpcmVkIHRvIHJldHVybiBjb29yZGluYXRlcyBwcm9wZXJseVxuICBpZiAoIWRlYnVnKVxuICAgIHN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJzsgIC8vIG5vdCAnZGlzcGxheTogbm9uZScgYmVjYXVzZSB3ZSB3YW50IHJlbmRlcmluZ1xuXG4gIC8vIFRyYW5zZmVyIHRoZSBlbGVtZW50J3MgcHJvcGVydGllcyB0byB0aGUgZGl2XG4gIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgIGlmIChpc0lucHV0ICYmIHByb3AgPT09ICdsaW5lSGVpZ2h0Jykge1xuICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciA8aW5wdXQ+cyBiZWNhdXNlIHRleHQgaXMgcmVuZGVyZWQgY2VudGVyZWQgYW5kIGxpbmUgaGVpZ2h0IG1heSBiZSAhPSBoZWlnaHRcbiAgICAgIHN0eWxlLmxpbmVIZWlnaHQgPSBjb21wdXRlZC5oZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlW3Byb3BdID0gY29tcHV0ZWRbcHJvcF07XG4gICAgfVxuICB9KTtcblxuICBpZiAoaXNGaXJlZm94KSB7XG4gICAgLy8gRmlyZWZveCBsaWVzIGFib3V0IHRoZSBvdmVyZmxvdyBwcm9wZXJ0eSBmb3IgdGV4dGFyZWFzOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD05ODQyNzVcbiAgICBpZiAoZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJzZUludChjb21wdXRlZC5oZWlnaHQpKVxuICAgICAgc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJzsgIC8vIGZvciBDaHJvbWUgdG8gbm90IHJlbmRlciBhIHNjcm9sbGJhcjsgSUUga2VlcHMgb3ZlcmZsb3dZID0gJ3Njcm9sbCdcbiAgfVxuXG4gIGRpdi50ZXh0Q29udGVudCA9IGVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKDAsIHBvc2l0aW9uKTtcbiAgLy8gVGhlIHNlY29uZCBzcGVjaWFsIGhhbmRsaW5nIGZvciBpbnB1dCB0eXBlPVwidGV4dFwiIHZzIHRleHRhcmVhOlxuICAvLyBzcGFjZXMgbmVlZCB0byBiZSByZXBsYWNlZCB3aXRoIG5vbi1icmVha2luZyBzcGFjZXMgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMzQwMjAzNS8xMjY5MDM3XG4gIGlmIChpc0lucHV0KVxuICAgIGRpdi50ZXh0Q29udGVudCA9IGRpdi50ZXh0Q29udGVudC5yZXBsYWNlKC9cXHMvZywgJ1xcdTAwYTAnKTtcblxuICB2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgLy8gV3JhcHBpbmcgbXVzdCBiZSByZXBsaWNhdGVkICpleGFjdGx5KiwgaW5jbHVkaW5nIHdoZW4gYSBsb25nIHdvcmQgZ2V0c1xuICAvLyBvbnRvIHRoZSBuZXh0IGxpbmUsIHdpdGggd2hpdGVzcGFjZSBhdCB0aGUgZW5kIG9mIHRoZSBsaW5lIGJlZm9yZSAoIzcpLlxuICAvLyBUaGUgICpvbmx5KiByZWxpYWJsZSB3YXkgdG8gZG8gdGhhdCBpcyB0byBjb3B5IHRoZSAqZW50aXJlKiByZXN0IG9mIHRoZVxuICAvLyB0ZXh0YXJlYSdzIGNvbnRlbnQgaW50byB0aGUgPHNwYW4+IGNyZWF0ZWQgYXQgdGhlIGNhcmV0IHBvc2l0aW9uLlxuICAvLyBGb3IgaW5wdXRzLCBqdXN0ICcuJyB3b3VsZCBiZSBlbm91Z2gsIGJ1dCBubyBuZWVkIHRvIGJvdGhlci5cbiAgc3Bhbi50ZXh0Q29udGVudCA9IGVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKHBvc2l0aW9uKSB8fCAnLic7ICAvLyB8fCBiZWNhdXNlIGEgY29tcGxldGVseSBlbXB0eSBmYXV4IHNwYW4gZG9lc24ndCByZW5kZXIgYXQgYWxsXG4gIGRpdi5hcHBlbmRDaGlsZChzcGFuKTtcblxuICB2YXIgY29vcmRpbmF0ZXMgPSB7XG4gICAgdG9wOiBzcGFuLm9mZnNldFRvcCArIHBhcnNlSW50KGNvbXB1dGVkWydib3JkZXJUb3BXaWR0aCddKSxcbiAgICBsZWZ0OiBzcGFuLm9mZnNldExlZnQgKyBwYXJzZUludChjb21wdXRlZFsnYm9yZGVyTGVmdFdpZHRoJ10pLFxuICAgIGhlaWdodDogcGFyc2VJbnQoY29tcHV0ZWRbJ2xpbmVIZWlnaHQnXSlcbiAgfTtcblxuICBpZiAoZGVidWcpIHtcbiAgICBzcGFuLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjYWFhJztcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRpdik7XG4gIH1cblxuICByZXR1cm4gY29vcmRpbmF0ZXM7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGdldENhcmV0Q29vcmRpbmF0ZXM7XG59IGVsc2UgaWYoaXNCcm93c2VyKSB7XG4gIHdpbmRvdy5nZXRDYXJldENvb3JkaW5hdGVzID0gZ2V0Q2FyZXRDb29yZGluYXRlcztcbn1cblxufSgpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcGFyc2VUb2tlbnNfMSA9IHJlcXVpcmUoXCIuL3BhcnNlVG9rZW5zXCIpO1xuY29uc3QgY3JlYXRlVG9rZW5UYWdfMSA9IHJlcXVpcmUoXCIuL2NyZWF0ZVRva2VuVGFnXCIpO1xuY29uc3QgdGhyb3R0bGVfMSA9IHJlcXVpcmUoXCIuL3V0aWwvdGhyb3R0bGVcIik7XG5jb25zdCBnZXRQYXJlbnRCeVRhZ05hbWVfMSA9IHJlcXVpcmUoXCIuL2dldFBhcmVudEJ5VGFnTmFtZVwiKTtcbmNvbnN0IGZpbmRUZXh0SW5wdXRzXzEgPSByZXF1aXJlKFwiLi91dGlsL2ZpbmRUZXh0SW5wdXRzXCIpO1xuZnVuY3Rpb24gbGlzdGVuVG9JbnB1dChpbnB1dCkge1xuICAgIGxldCBrbm93blRva2VucyA9IFtdO1xuICAgIGNvbnN0IHVwZGF0ZVRva2Vuc0ZvcklucHV0ID0gdGhyb3R0bGVfMS5kZWZhdWx0KCgpID0+IHtcbiAgICAgICAgbGV0IHRva2VucyA9IHBhcnNlVG9rZW5zXzEuZGVmYXVsdChpbnB1dC52YWx1ZSk7XG4gICAgICAgIGlmICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gRmlsdGVyIHRoZSB0b2tlbnMgdGhhdCB3ZSBhbHJlYWR5IGtub3cgYWJvdXRcbiAgICAgICAgICAgIGNvbnN0IHVua25vd25Ub2tlbnMgPSB0b2tlbnMuZmlsdGVyKHRva2VuID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWtub3duVG9rZW5zLnNvbWUoa25vd25Ub2tlbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoa25vd25Ub2tlbi50b2tlbi5pbmRleCA9PT0gdG9rZW4uaW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGtub3duVG9rZW4udG9rZW4udmFsdWUgPT09IHRva2VuLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdW5rbm93blRva2Vucy5mb3JFYWNoKHRva2VuID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlblRhZyA9IGNyZWF0ZVRva2VuVGFnXzEuZGVmYXVsdChpbnB1dCwgdG9rZW4pO1xuICAgICAgICAgICAgICAgIGtub3duVG9rZW5zLnB1c2godG9rZW5UYWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVtb3ZlIGFueSB0b2tlbnMgdGhhdCBhcmUgbm8gbG9uZ2VyIHZhbGlkXG4gICAgICAgIGtub3duVG9rZW5zID0ga25vd25Ub2tlbnMuZmlsdGVyKGtub3duVG9rZW4gPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RpbGxFeGlzdHMgPSB0b2tlbnMuc29tZShuZXdUb2tlbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChrbm93blRva2VuLnRva2VuLmluZGV4ID09PSBuZXdUb2tlbi5pbmRleCAmJlxuICAgICAgICAgICAgICAgICAgICBrbm93blRva2VuLnRva2VuLnZhbHVlID09PSBuZXdUb2tlbi52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghc3RpbGxFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBrbm93blRva2VuLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0aWxsRXhpc3RzO1xuICAgICAgICB9KTtcbiAgICB9LCA1MDApO1xuICAgIGxldCBmb3JtTm9kZSA9IGdldFBhcmVudEJ5VGFnTmFtZV8xLmRlZmF1bHQoaW5wdXQsIFwiZm9ybVwiKTtcbiAgICBmdW5jdGlvbiBjbGVhblVwKCkge1xuICAgICAgICBrbm93blRva2Vucy5mb3JFYWNoKGtub3duVG9rZW4gPT4ge1xuICAgICAgICAgICAga25vd25Ub2tlbi5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGtub3duVG9rZW5zID0gW107XG4gICAgICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB1cGRhdGVUb2tlbnNGb3JJbnB1dCk7XG4gICAgICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgICAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgICAgICBmb3JtTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHByb2Nlc3NQcmVTdWJtaXQsIHRydWUpO1xuICAgIH1cbiAgICAvLyBSZXBsYWNlIGFsbCB0aGUgdG9rZW5zIHdpdGggaW1hZ2UgdGFnc1xuICAgIGZ1bmN0aW9uIHByb2Nlc3NQcmVTdWJtaXQoZXZ0KSB7XG4gICAgICAgIC8vIFByb2Nlc3MgdGhlIHRva2VucyBmcm9tIHRoZSBsYXN0IHRvIHRoZSBmaXJzdCwgc28gdGhhdFxuICAgICAgICAvLyB3ZSBjYW4gbW9kaWZ5IHRoZSB0ZXh0IGNvbnRlbnRzIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICAgIC8vIGluZGV4IHBvc2l0aW9ucyBvZiB0b2tlbnMgYmVmb3JlIHdlIHByb2Nlc3MgdGhlbVxuICAgICAgICBrbm93blRva2Vucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS50b2tlbi5pbmRleCA+IGIudG9rZW4uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChiLnRva2VuLmluZGV4ID4gYS50b2tlbi5pbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAga25vd25Ub2tlbnMuZm9yRWFjaChrbm93blRva2VuID0+IHtcbiAgICAgICAgICAgIGlmIChrbm93blRva2VuLmlzVmFsaWQgJiYgIWtub3duVG9rZW4uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnN1YnN0cmluZygwLCBrbm93blRva2VuLnRva2VuLmluZGV4KSArXG4gICAgICAgICAgICAgICAgICAgICAgICBgPGltZyBzcmM9XCIke2tub3duVG9rZW4uaW1hZ2VVcmx9XCIgdGl0bGU9XCJDcmVhdGVkIGJ5IGdpdG1lLm1lIHdpdGggLyR7a25vd25Ub2tlbi50b2tlbi52YWx1ZX1cIi8+YCArXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zdWJzdHJpbmcoa25vd25Ub2tlbi50b2tlbi5pbmRleCArIGtub3duVG9rZW4udG9rZW4udmFsdWUubGVuZ3RoICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBjbGVhblVwKCk7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCB1cGRhdGVUb2tlbnNGb3JJbnB1dCk7XG4gICAgZm9ybU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBwcm9jZXNzUHJlU3VibWl0LCB0cnVlKTtcbiAgICAvLyBJbiBjYXNlIHRoZSBpbnB1dCBpcyBzaW1wbHkgcmVtb3ZlZCBmcm9tIHRoZSBET00gd2l0aG91dFxuICAgIC8vIGJlaW5nIHN1Ym1pdHRlZCwgY2xlYW4gdXAgdG9vXG4gICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibXV0YXRpb24gZXZlbnRcIiwgZXZ0KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnB1dC5vZmZzZXRIZWlnaHRcIiwgaW5wdXQub2Zmc2V0SGVpZ2h0KTtcbiAgICAgICAgaWYgKGV2dFswXS5yZW1vdmVkTm9kZXMgJiZcbiAgICAgICAgICAgIEFycmF5LmZyb20oZXZ0WzBdLnJlbW92ZWROb2RlcykuaW5kZXhPZihpbnB1dCkgPiAtMSkge1xuICAgICAgICAgICAgY2xlYW5VcCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlucHV0Lm9mZnNldEhlaWdodCA9PT0gMCkge1xuICAgICAgICAgICAgY2xlYW5VcCgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGZvcm1Ob2RlLCB7IGNoaWxkTGlzdDogdHJ1ZSB9KTtcbiAgICB1cGRhdGVUb2tlbnNGb3JJbnB1dCgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGlucHV0LFxuICAgICAgICByZW1vdmU6IGNsZWFuVXBcbiAgICB9O1xufVxuZmluZFRleHRJbnB1dHNfMS5kZWZhdWx0KGxpc3RlblRvSW5wdXQpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBnZXRDYXJldENvb3JkaW5hdGVzID0gcmVxdWlyZShcInRleHRhcmVhLWNhcmV0XCIpO1xuY29uc3Qgc2VhcmNoZXJfMSA9IHJlcXVpcmUoXCIuL3NlYXJjaGVyXCIpO1xuY29uc3QgVEFHX0NPTlRBSU5FUl9JRCA9IFwiX190YWdDb250YWluZXJcIjtcbmNvbnN0IFRFWFRfSEVJR0hUID0gMTg7XG5sZXQgcmVtb3ZlT3BlbkltYWdlID0gbnVsbDtcbmZ1bmN0aW9uIGNyZWF0ZVRva2VuVGFnKHRleHRJbnB1dCwgdG9rZW4pIHtcbiAgICBjb25zdCBzdGFydENvb3JkcyA9IGdldENhcmV0Q29vcmRpbmF0ZXModGV4dElucHV0LCB0b2tlbi5pbmRleCk7XG4gICAgY29uc3QgZW5kQ29vcmRzID0gZ2V0Q2FyZXRDb29yZGluYXRlcyh0ZXh0SW5wdXQsIHRva2VuLmluZGV4ICsgdG9rZW4udmFsdWUubGVuZ3RoICsgMSk7XG4gICAgbGV0IHRhZ0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFRBR19DT05UQUlORVJfSUQpO1xuICAgIGlmICghdGFnQ29udGFpbmVyKSB7XG4gICAgICAgIHRhZ0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRhZ0NvbnRhaW5lci5pZCA9IFRBR19DT05UQUlORVJfSUQ7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGFnQ29udGFpbmVyKTtcbiAgICB9XG4gICAgY29uc3QgdGFnVWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxldCBpbWFnZVVpID0gbnVsbDtcbiAgICB0YWdVaS5jbGFzc05hbWUgPSBcIl9fdG9rZW5UYWdcIjtcbiAgICB0YWdVaS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRva2VuXCIsIHRva2VuLnZhbHVlKTtcbiAgICB0YWdDb250YWluZXIuYXBwZW5kQ2hpbGQodGFnVWkpO1xuICAgIGZ1bmN0aW9uIHJlbW92ZUltYWdlKCkge1xuICAgICAgICBpZiAoaW1hZ2VVaSAmJiBpbWFnZVVpLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGltYWdlVWkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpbWFnZVVpKTtcbiAgICAgICAgfVxuICAgICAgICBpbWFnZVVpID0gbnVsbDtcbiAgICAgICAgaWYgKHJlbW92ZU9wZW5JbWFnZSA9PT0gcmVtb3ZlSW1hZ2UpIHtcbiAgICAgICAgICAgIHJlbW92ZU9wZW5JbWFnZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlVGFnVWkoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZGlzYWJsZUltYWdlKCkge1xuICAgICAgICByZWNvcmQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICByZW1vdmVJbWFnZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbmFibGVJbWFnZSgpIHtcbiAgICAgICAgcmVjb3JkLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlbW92ZUltYWdlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRhZ1VpKCkge1xuICAgICAgICBsZXQgdGl0bGUgPSBcIlwiO1xuICAgICAgICB0YWdVaS5jbGFzc0xpc3QudG9nZ2xlKFwiaW1hZ2VGb3VuZFwiLCAhIXJlY29yZC5pbWFnZVVybCk7XG4gICAgICAgIHRhZ1VpLmNsYXNzTGlzdC50b2dnbGUoXCJpbWFnZU5vdEZvdW5kXCIsICFyZWNvcmQuaW1hZ2VVcmwpO1xuICAgICAgICBpZiAoISFyZWNvcmQuaW1hZ2VVcmwpIHtcbiAgICAgICAgICAgIHRpdGxlID0gYEdpdE1lbWUgZm9yIFwiJHt0b2tlbi52YWx1ZX1cImA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aXRsZSA9IGBHaXRNZW1lIGZvciBcIiR7dG9rZW4udmFsdWV9XCJgO1xuICAgICAgICB9XG4gICAgICAgIHRhZ1VpLmNsYXNzTGlzdC50b2dnbGUoXCJkaXNhYmxlZFwiLCByZWNvcmQuZGlzYWJsZWQpO1xuICAgICAgICBpbWFnZVVpICYmIGltYWdlVWkuY2xhc3NMaXN0LnRvZ2dsZShcImRpc2FibGVkXCIsIHJlY29yZC5kaXNhYmxlZCk7XG4gICAgICAgIGlmIChyZWNvcmQuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRpdGxlID0gYEdpdE1lbWUgaW1hZ2UgZGlzYWJsZWRgO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbWFnZVVpKSB7XG4gICAgICAgICAgICBpbWFnZVVpLmNsYXNzTGlzdC50b2dnbGUoXCJoYXNNdWx0aXBsZUltYWdlc1wiLCByZWNvcmQuaW1hZ2VVcmxzLmxlbmd0aCA+IDEpO1xuICAgICAgICAgICAgY29uc3QgaW1hZ2VOb2RlID0gaW1hZ2VVaS5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO1xuICAgICAgICAgICAgaWYgKGltYWdlTm9kZS5zcmMgIT09IHJlY29yZC5pbWFnZVVybCkge1xuICAgICAgICAgICAgICAgIGltYWdlTm9kZS5zcmMgPSByZWNvcmQuaW1hZ2VVcmw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGFnVWkudGl0bGUgPSB0aXRsZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2VsZWN0SW1hZ2UoKSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB3cmFwcGVyLmNsYXNzTmFtZSA9IFwiX19pbWFnZVNlbGVjdG9yXCI7XG4gICAgICAgIHdyYXBwZXIuaW5uZXJIVE1MID0gYFxuICAgICAgPGRpdiBjbGFzcz1cIl9faW1hZ2VTZWxlY3RvclRpdGxlXCI+Q2hvb3NlIE9uZSBJbWFnZTwvZGl2PlxuICAgICAgICAke3JlY29yZC5pbWFnZVVybHNcbiAgICAgICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gaWR4IDwgNClcbiAgICAgICAgICAgIC5tYXAoKHVybCwgaWR4KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYDxhIGhyZWY9XCIjXCIgZGF0YS1pbmRleD1cIiR7aWR4fVwiPjxpbWcgc3JjPVwiJHt1cmx9XCIgLz48L2E+YDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpfVxuICAgIGA7XG4gICAgICAgIHRhZ0NvbnRhaW5lci5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcbiAgICAgICAgd3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBldnQudGFyZ2V0O1xuICAgICAgICAgICAgbGV0IHRhcmdldE5hbWUgPSB0YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHRhcmdldE5hbWUgPT09IFwiaW1nXCIpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICB0YXJnZXROYW1lID0gdGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXJnZXROYW1lID09PSBcImFcIikge1xuICAgICAgICAgICAgICAgIHJlY29yZC5pbWFnZVVybCA9IHJlY29yZC5pbWFnZVVybHNbdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5kZXhcIildO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVRhZ1VpKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWdDb250YWluZXIucmVtb3ZlQ2hpbGQod3JhcHBlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0YWdVaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IHtcbiAgICAgICAgLy8gSWYgYSB1cmwgZXhpc3RzLCB0aGVuIHNob3cgdGhlIGltYWdlIGluIHRodW1uYWlsIGZvcm0uXG4gICAgICAgIC8vIElmIHRoZSB1cmwgZG9lcyBub3QgZXhpc3QsIG9wZW4gYSB0eXBlYWhlYWQgdG8gZmluZCB0aGVcbiAgICAgICAgLy8gaW1hZ2UgeW91IHdhbnQgKGxhdGVyei4uLilcbiAgICAgICAgaWYgKHJlY29yZC5pbWFnZVVybCkge1xuICAgICAgICAgICAgaWYgKGltYWdlVWkpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVJbWFnZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbW92ZU9wZW5JbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVPcGVuSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW1hZ2VVaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgaW1hZ2VVaS5jbGFzc05hbWUgPSBcIl9fdG9rZW5UYWdUaHVtYm5haWxcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBpbWFnZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAgICAgICAgIGltYWdlTm9kZS5zcmMgPSByZWNvcmQuaW1hZ2VVcmw7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQnV0dG9uTm9kZS50ZXh0Q29udGVudCA9IHJlY29yZC5kaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICA/IFwiRW5hYmxlIFRhZ1wiXG4gICAgICAgICAgICAgICAgICAgIDogXCJEaXNhYmxlIFRhZ1wiO1xuICAgICAgICAgICAgICAgIGltYWdlVWkuYXBwZW5kQ2hpbGQoaW1hZ2VOb2RlKTtcbiAgICAgICAgICAgICAgICBpbWFnZVVpLmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbk5vZGUpO1xuICAgICAgICAgICAgICAgIGltYWdlTm9kZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVtb3ZlSW1hZ2UpO1xuICAgICAgICAgICAgICAgIHJlbW92ZUJ1dHRvbk5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlY29yZC5kaXNhYmxlZCA/IGVuYWJsZUltYWdlIDogZGlzYWJsZUltYWdlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaG93QWxsSW1hZ2VzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAgICAgc2hvd0FsbEltYWdlc05vZGUuY2xhc3NOYW1lID0gXCJfX3Nob3dBbGxJbWFnZXNcIjtcbiAgICAgICAgICAgICAgICBzaG93QWxsSW1hZ2VzTm9kZS50ZXh0Q29udGVudCA9IGArJHtyZWNvcmQuaW1hZ2VVcmxzLmxlbmd0aCAtIDF9YDtcbiAgICAgICAgICAgICAgICBzaG93QWxsSW1hZ2VzTm9kZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2VsZWN0SW1hZ2UpO1xuICAgICAgICAgICAgICAgIGltYWdlVWkuYXBwZW5kQ2hpbGQoc2hvd0FsbEltYWdlc05vZGUpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVRhZ1VpKCk7XG4gICAgICAgICAgICAgICAgdGFnQ29udGFpbmVyLmFwcGVuZENoaWxkKGltYWdlVWkpO1xuICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBnbG9iYWwgcmVmZXJlbmNlIHRvIGVuc3VyZSB0aGF0IG9ubHkgb25lIGltYWdlIGlzXG4gICAgICAgICAgICAgICAgLy8gb3BlbiBhdCBhIHRpbWVcbiAgICAgICAgICAgICAgICByZW1vdmVPcGVuSW1hZ2UgPSByZW1vdmVJbWFnZTtcbiAgICAgICAgICAgICAgICByZXBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBmdW5jdGlvbiByZXBvc2l0aW9uKCkge1xuICAgICAgICBjb25zdCByZWN0ID0gdGV4dElucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB0b3AgPSBURVhUX0hFSUdIVCArIHdpbmRvdy5zY3JvbGxZICsgcmVjdC50b3AgKyBzdGFydENvb3Jkcy50b3A7XG4gICAgICAgIGNvbnN0IGxlZnQgPSB3aW5kb3cuc2Nyb2xsWCArIHJlY3QubGVmdCArIHN0YXJ0Q29vcmRzLmxlZnQ7XG4gICAgICAgIHRhZ1VpLnN0eWxlLnRvcCA9IHRvcCArIFwicHhcIjtcbiAgICAgICAgdGFnVWkuc3R5bGUubGVmdCA9IGxlZnQgKyBcInB4XCI7XG4gICAgICAgIHRhZ1VpLnN0eWxlLndpZHRoID0gZW5kQ29vcmRzLmxlZnQgLSBzdGFydENvb3Jkcy5sZWZ0ICsgXCJweFwiO1xuICAgICAgICBpZiAoaW1hZ2VVaSkge1xuICAgICAgICAgICAgaW1hZ2VVaS5zdHlsZS50b3AgPSB0b3AgKyAyICsgXCJweFwiO1xuICAgICAgICAgICAgaW1hZ2VVaS5zdHlsZS5sZWZ0ID0gbGVmdCArIFwicHhcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAgIHRhZ1VpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFnVWkpO1xuICAgICAgICByZW1vdmVJbWFnZSgpO1xuICAgIH1cbiAgICByZXBvc2l0aW9uKCk7XG4gICAgY29uc3QgcmVjb3JkID0ge1xuICAgICAgICBpbnB1dDogdGV4dElucHV0LFxuICAgICAgICByZW1vdmUsXG4gICAgICAgIHJlcG9zaXRpb24sXG4gICAgICAgIHRva2VuLFxuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgaW1hZ2VVcmw6IG51bGwsXG4gICAgICAgIGltYWdlVXJsczogW10sXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgIH07XG4gICAgY29uc29sZS5sb2coXCJzZWFyY2hpbmcgZm9yIFwiLCB0b2tlbi52YWx1ZSk7XG4gICAgc2VhcmNoZXJfMS5kZWZhdWx0KHRva2VuLnZhbHVlKS50aGVuKCh1cmxzKSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHVybHMubGVuZ3RoID4gMCA/IHVybHNbMF0gOiBudWxsO1xuICAgICAgICByZWNvcmQuaW1hZ2VVcmwgPSB1cmw7XG4gICAgICAgIHJlY29yZC5pbWFnZVVybHMgPSB1cmxzO1xuICAgICAgICByZWNvcmQuaXNWYWxpZCA9ICEhdXJsO1xuICAgICAgICB1cGRhdGVUYWdVaSgpO1xuICAgIH0pO1xuICAgIHJldHVybiByZWNvcmQ7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVUb2tlblRhZztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gZ2V0UGFyZW50QnlUYWdOYW1lKG5vZGUsIHRhZ05hbWUpIHtcbiAgICBsZXQgZm91bmROb2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChmb3VuZE5vZGUgJiYgZm91bmROb2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFnTmFtZSkge1xuICAgICAgICBmb3VuZE5vZGUgPSBmb3VuZE5vZGUucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kTm9kZSB8fCBudWxsO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gZ2V0UGFyZW50QnlUYWdOYW1lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vLyBGaW5kIGFsbCB3b3JkcyBiZWdpbm5pbmcgd2l0aCBcIi9cIlxuY29uc3QgcmVnZXggPSAvKD88IVxcdylcXC9cXHcrL2c7XG5jb25zdCBjaGFyUHJlZml4ZXMgPSB7XG4gICAgXCJcXG5cIjogdHJ1ZSxcbiAgICBcIlxcdFwiOiB0cnVlLFxuICAgIFwiIFwiOiB0cnVlXG59O1xuZnVuY3Rpb24gcGFyc2VUb2tlbnMoc3RyKSB7XG4gICAgY29uc3QgcmV0ID0gW107XG4gICAgbGV0IG1hdGNoO1xuICAgIGRvIHtcbiAgICAgICAgbWF0Y2ggPSByZWdleC5leGVjKHN0cik7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBwcm9iYWJseSBkb2FibGUgaW4gcmVnZXgsIGJ1dCBzY3JldyBpdC4uLlxuICAgICAgICAgICAgLy8gRmlsdGVyIGl0IG91dCBzbyB0aGF0IG9ubHkgdG9rZW5zIHRoYXQgYXJlXG4gICAgICAgICAgICAvLyAtIGF0IHRoZSBzdGFydCBvZiBhIGxpbmVcbiAgICAgICAgICAgIC8vIC0gYWZ0ZXIgYSBzcGFjZSBvciBhIHRhYlxuICAgICAgICAgICAgLy8gYXJlIHZhbGlkXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IG1hdGNoLmluZGV4O1xuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSBpbmRleCA9PT0gMDtcbiAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxldHRlckJlZm9yZSA9IHN0ci5jaGFyQXQoaW5kZXggLSAxKTtcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gISFjaGFyUHJlZml4ZXNbbGV0dGVyQmVmb3JlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpbmRleDogbWF0Y2guaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBtYXRjaFswXS5zdWJzdHJpbmcoMSkudHJpbSgpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IHdoaWxlIChtYXRjaCk7XG4gICAgcmV0dXJuIHJldDtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IHBhcnNlVG9rZW5zO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZldGNoID0gcmVxdWlyZShcIm5vZGUtZmV0Y2hcIik7XG5jb25zdCBHSVBIWV9BUElfS0VZID0gXCJJNXlzWHpaRzRPSW9pTUQ5OVR6N3Y2QUdOOXV6R1dwclwiO1xuZnVuY3Rpb24gc2VhcmNoZXIodG9rZW5WYWx1ZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHN3aXRjaCAodG9rZW5WYWx1ZSkge1xuICAgICAgICAgICAgY2FzZSBcImZvb1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiBbXCJodHRwczovL2pvaW5wcm9taXNlLmNvbS9hc3NldHMvbWVkaWEvTWVhc3VyZV9FZmZpY2FjeS5zdmdcIl07XG4gICAgICAgICAgICBjYXNlIFwiYmFyXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcImh0dHBzOi8vcGF5dGlja2V0LmlvL3N0YXRpYy9pbWFnZXMvbG9nb3MvZXBhX2xvZ28uanBnXCJdO1xuICAgICAgICAgICAgY2FzZSBcInNoaXBpdFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBbXCJodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS83OXFmMU40Ukp0YzhvL2dpcGh5LmdpZlwiXTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2lwaHlSZXN1bHQgPSB5aWVsZCBzZWFyY2hHaXBoeSh0b2tlblZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdpcGh5UmVzdWx0LmRhdGEgJiYgZ2lwaHlSZXN1bHQuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2lwaHlSZXN1bHQuZGF0YS5tYXAoaW1hZ2VEYXRhID0+IGltYWdlRGF0YS5pbWFnZXMuZG93bnNpemVkX3N0aWxsLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gc2VhcmNoZXI7XG5jb25zdCBnaXBoeVNlYXJjaGVzID0ge307XG5mdW5jdGlvbiBzZWFyY2hHaXBoeSh0b2tlblZhbHVlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKCFnaXBoeVNlYXJjaGVzW3Rva2VuVmFsdWVdKSB7XG4gICAgICAgICAgICBnaXBoeVNlYXJjaGVzW3Rva2VuVmFsdWVdID0gbmV3IFByb21pc2UoKHJlc29sdmUsIF9yZWplY3QpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGltaXQgPSA4O1xuICAgICAgICAgICAgICAgIHdoaWxlIChsaW1pdCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHlpZWxkIGZldGNoKGBodHRwczovL2FwaS5naXBoeS5jb20vdjEvZ2lmcy9zZWFyY2g/cT0ke2VuY29kZVVSSUNvbXBvbmVudCh0b2tlblZhbHVlKX0mYXBpX2tleT0ke0dJUEhZX0FQSV9LRVl9JmxpbWl0PSR7bGltaXR9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgcmVzdWx0Lmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnaXBoeVNlYXJjaGVzW3Rva2VuVmFsdWVdO1xuICAgIH0pO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBmaW5kVGV4dElucHV0cyhsaXN0ZW5Ub0lucHV0KSB7XG4gICAgY29uc3QgaWRzID0gW1wibmV3X2NvbW1lbnRfZmllbGRcIiwgXCJpc3N1ZV9ib2R5XCJdO1xuICAgIGNvbnN0IGlucHV0c0J5SWQgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaWRzLm1hcChpZCA9PiBgIyR7aWR9YCkuam9pbihcIixcIikpKTtcbiAgICBjb25zb2xlLmxvZyhcImlucHV0c0J5SWRcIiwgaW5wdXRzQnlJZCk7XG4gICAgY29uc3QgYWxsSW5wdXRzID0gaW5wdXRzQnlJZDtcbiAgICBsZXQgbGlzdGVuZXJzID0gYWxsSW5wdXRzLm1hcChsaXN0ZW5Ub0lucHV0KTtcbiAgICAvLyBMaXN0ZW4gdG8gYW55IGxhemlseSBjcmVhdGVkIHRleHQgYXJlYXMgdG9vXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNpblwiLCAoZXZ0KSA9PiB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBldnQudGFyZ2V0O1xuICAgICAgICBjb25zdCB0YWdOYW1lID0gbm9kZS50YWdOYW1lO1xuICAgICAgICBpZiAodGFnTmFtZSAmJlxuICAgICAgICAgICAgdGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInRleHRhcmVhXCIgJiZcbiAgICAgICAgICAgICFsaXN0ZW5lcnMuc29tZShsaXN0ZW5lciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RlbmVyLmlucHV0ID09PSBub2RlO1xuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlblRvSW5wdXQobm9kZSkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdMaXN0ZW5lcnMgPSB2YWxpZGF0ZUxpc3RlbmVycyhsaXN0ZW5lcnMpO1xuICAgICAgICBpZiAobmV3TGlzdGVuZXJzLmxlbmd0aCAhPT0gbGlzdGVuZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gbmV3TGlzdGVuZXJzO1xuICAgICAgICB9XG4gICAgfSwgMjAwKTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGZpbmRUZXh0SW5wdXRzO1xuZnVuY3Rpb24gdmFsaWRhdGVMaXN0ZW5lcnMobGlzdGVuZXJzKSB7XG4gICAgY29uc3QgbmV3TGlzdGVuZXJzID0gbGlzdGVuZXJzLmZpbHRlcihsaXN0ZW5lciA9PiB7XG4gICAgICAgIC8vIEEgTm9kZSdzIG9mZnNldFBhcmVudCBpcyBudWxsIGlmIGl0IG9yIGFueSBvZiBpdHNcbiAgICAgICAgLy8gcGFyZW50IG5vZGVzIGFyZSBoaWRkZW4uICBIYW5keSFcbiAgICAgICAgaWYgKCFsaXN0ZW5lci5pbnB1dC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2xlYW5pbmcgdXBcIiwgbGlzdGVuZXIuaW5wdXQpO1xuICAgICAgICAgICAgbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ld0xpc3RlbmVycztcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKVxuICAgICAgICBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogRGF0ZS5ub3coKTtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dClcbiAgICAgICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpXG4gICAgICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCF0aW1lb3V0KVxuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gdGhyb3R0bGU7XG4iXSwic291cmNlUm9vdCI6IiJ9