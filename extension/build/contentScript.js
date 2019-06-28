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
        }
        else {
            title = `GitMeme for "${token.value}"`;
        }
        tagUi.classList.toggle("disabled", record.disabled);
        imageUi && imageUi.classList.toggle("disabled", record.disabled);
        if (record.disabled) {
            title = `GitMeme image disabled`;
        }
        imageUi &&
            imageUi.classList.toggle("hasMultipleImages", record.imageUrls.length > 1);
        tagUi.title = title;
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
                const result = yield fetch(`https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(tokenValue)}&api_key=${GIPHY_API_KEY}&limit=8`);
                const data = yield result.json();
                resolve(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdGV4dGFyZWEtY2FyZXQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRlbnRTY3JpcHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NyZWF0ZVRva2VuVGFnLnRzIiwid2VicGFjazovLy8uL3NyYy9nZXRQYXJlbnRCeVRhZ05hbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlVG9rZW5zLnRzIiwid2VicGFjazovLy8uL3NyYy9zZWFyY2hlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9maW5kVGV4dElucHV0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC90aHJvdHRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsYUFBYTtBQUNoRCxxQ0FBcUMsZUFBZTtBQUNwRCxxQ0FBcUMsZUFBZTtBQUNwRDtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DOzs7Ozs7Ozs7OztBQ3RCQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtR0FBbUc7QUFDbkc7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDOztBQUVsQztBQUNBLDhCQUE4QjtBQUM5QjtBQUNBLGdDQUFnQzs7QUFFaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCw4QkFBOEIsMENBQTBDO0FBQ3hFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN6SVk7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxzQkFBc0IsbUJBQU8sQ0FBQywyQ0FBZTtBQUM3Qyx5QkFBeUIsbUJBQU8sQ0FBQyxpREFBa0I7QUFDbkQsbUJBQW1CLG1CQUFPLENBQUMsK0NBQWlCO0FBQzVDLDZCQUE2QixtQkFBTyxDQUFDLHlEQUFzQjtBQUMzRCx5QkFBeUIsbUJBQU8sQ0FBQywyREFBdUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsb0JBQW9CLHFDQUFxQyx1QkFBdUI7QUFDckg7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHdDQUF3QyxrQkFBa0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsR2E7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCw0QkFBNEIsbUJBQU8sQ0FBQyw4REFBZ0I7QUFDcEQsbUJBQW1CLG1CQUFPLENBQUMscUNBQVk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFlBQVk7QUFDaEQ7QUFDQTtBQUNBLG9DQUFvQyxZQUFZO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCw0QkFBNEI7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaklhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ1RhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNwQ2E7QUFDYjtBQUNBO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLGlFQUFpRSx1QkFBdUIsRUFBRSw0QkFBNEI7QUFDcko7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RCxjQUFjLG1CQUFPLENBQUMsd0RBQVk7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRkFBcUYsK0JBQStCLFdBQVcsY0FBYztBQUM3STtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7Ozs7Ozs7Ozs7Ozs7QUNoRGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0EsOEVBQThFLEdBQUc7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN4Q2E7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb250ZW50U2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29udGVudFNjcmlwdC50c1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyByZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWdsb2JhbFxudmFyIGdldEdsb2JhbCA9IGZ1bmN0aW9uICgpIHtcblx0Ly8gdGhlIG9ubHkgcmVsaWFibGUgbWVhbnMgdG8gZ2V0IHRoZSBnbG9iYWwgb2JqZWN0IGlzXG5cdC8vIGBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpYFxuXHQvLyBIb3dldmVyLCB0aGlzIGNhdXNlcyBDU1AgdmlvbGF0aW9ucyBpbiBDaHJvbWUgYXBwcy5cblx0aWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gc2VsZjsgfVxuXHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHdpbmRvdzsgfVxuXHRpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGdsb2JhbDsgfVxuXHR0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBsb2NhdGUgZ2xvYmFsIG9iamVjdCcpO1xufVxuXG52YXIgZ2xvYmFsID0gZ2V0R2xvYmFsKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGdsb2JhbC5mZXRjaDtcblxuLy8gTmVlZGVkIGZvciBUeXBlU2NyaXB0IGFuZCBXZWJwYWNrLlxuZXhwb3J0cy5kZWZhdWx0ID0gZ2xvYmFsLmZldGNoLmJpbmQoZ2xvYmFsKTtcblxuZXhwb3J0cy5IZWFkZXJzID0gZ2xvYmFsLkhlYWRlcnM7XG5leHBvcnRzLlJlcXVlc3QgPSBnbG9iYWwuUmVxdWVzdDtcbmV4cG9ydHMuUmVzcG9uc2UgPSBnbG9iYWwuUmVzcG9uc2U7IiwiLyoganNoaW50IGJyb3dzZXI6IHRydWUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuLy8gV2UnbGwgY29weSB0aGUgcHJvcGVydGllcyBiZWxvdyBpbnRvIHRoZSBtaXJyb3IgZGl2LlxuLy8gTm90ZSB0aGF0IHNvbWUgYnJvd3NlcnMsIHN1Y2ggYXMgRmlyZWZveCwgZG8gbm90IGNvbmNhdGVuYXRlIHByb3BlcnRpZXNcbi8vIGludG8gdGhlaXIgc2hvcnRoYW5kIChlLmcuIHBhZGRpbmctdG9wLCBwYWRkaW5nLWJvdHRvbSBldGMuIC0+IHBhZGRpbmcpLFxuLy8gc28gd2UgaGF2ZSB0byBsaXN0IGV2ZXJ5IHNpbmdsZSBwcm9wZXJ0eSBleHBsaWNpdGx5LlxudmFyIHByb3BlcnRpZXMgPSBbXG4gICdkaXJlY3Rpb24nLCAgLy8gUlRMIHN1cHBvcnRcbiAgJ2JveFNpemluZycsXG4gICd3aWR0aCcsICAvLyBvbiBDaHJvbWUgYW5kIElFLCBleGNsdWRlIHRoZSBzY3JvbGxiYXIsIHNvIHRoZSBtaXJyb3IgZGl2IHdyYXBzIGV4YWN0bHkgYXMgdGhlIHRleHRhcmVhIGRvZXNcbiAgJ2hlaWdodCcsXG4gICdvdmVyZmxvd1gnLFxuICAnb3ZlcmZsb3dZJywgIC8vIGNvcHkgdGhlIHNjcm9sbGJhciBmb3IgSUVcblxuICAnYm9yZGVyVG9wV2lkdGgnLFxuICAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdib3JkZXJMZWZ0V2lkdGgnLFxuICAnYm9yZGVyU3R5bGUnLFxuXG4gICdwYWRkaW5nVG9wJyxcbiAgJ3BhZGRpbmdSaWdodCcsXG4gICdwYWRkaW5nQm90dG9tJyxcbiAgJ3BhZGRpbmdMZWZ0JyxcblxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvZm9udFxuICAnZm9udFN0eWxlJyxcbiAgJ2ZvbnRWYXJpYW50JyxcbiAgJ2ZvbnRXZWlnaHQnLFxuICAnZm9udFN0cmV0Y2gnLFxuICAnZm9udFNpemUnLFxuICAnZm9udFNpemVBZGp1c3QnLFxuICAnbGluZUhlaWdodCcsXG4gICdmb250RmFtaWx5JyxcblxuICAndGV4dEFsaWduJyxcbiAgJ3RleHRUcmFuc2Zvcm0nLFxuICAndGV4dEluZGVudCcsXG4gICd0ZXh0RGVjb3JhdGlvbicsICAvLyBtaWdodCBub3QgbWFrZSBhIGRpZmZlcmVuY2UsIGJ1dCBiZXR0ZXIgYmUgc2FmZVxuXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ3dvcmRTcGFjaW5nJyxcblxuICAndGFiU2l6ZScsXG4gICdNb3pUYWJTaXplJ1xuXG5dO1xuXG52YXIgaXNCcm93c2VyID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKTtcbnZhciBpc0ZpcmVmb3ggPSAoaXNCcm93c2VyICYmIHdpbmRvdy5tb3pJbm5lclNjcmVlblggIT0gbnVsbCk7XG5cbmZ1bmN0aW9uIGdldENhcmV0Q29vcmRpbmF0ZXMoZWxlbWVudCwgcG9zaXRpb24sIG9wdGlvbnMpIHtcbiAgaWYgKCFpc0Jyb3dzZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RleHRhcmVhLWNhcmV0LXBvc2l0aW9uI2dldENhcmV0Q29vcmRpbmF0ZXMgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIGEgYnJvd3NlcicpO1xuICB9XG5cbiAgdmFyIGRlYnVnID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlYnVnIHx8IGZhbHNlO1xuICBpZiAoZGVidWcpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXQtdGV4dGFyZWEtY2FyZXQtcG9zaXRpb24tbWlycm9yLWRpdicpO1xuICAgIGlmIChlbCkgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gIH1cblxuICAvLyBUaGUgbWlycm9yIGRpdiB3aWxsIHJlcGxpY2F0ZSB0aGUgdGV4dGFyZWEncyBzdHlsZVxuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pZCA9ICdpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2JztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuXG4gIHZhciBzdHlsZSA9IGRpdi5zdHlsZTtcbiAgdmFyIGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSA6IGVsZW1lbnQuY3VycmVudFN0eWxlOyAgLy8gY3VycmVudFN0eWxlIGZvciBJRSA8IDlcbiAgdmFyIGlzSW5wdXQgPSBlbGVtZW50Lm5vZGVOYW1lID09PSAnSU5QVVQnO1xuXG4gIC8vIERlZmF1bHQgdGV4dGFyZWEgc3R5bGVzXG4gIHN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnO1xuICBpZiAoIWlzSW5wdXQpXG4gICAgc3R5bGUud29yZFdyYXAgPSAnYnJlYWstd29yZCc7ICAvLyBvbmx5IGZvciB0ZXh0YXJlYS1zXG5cbiAgLy8gUG9zaXRpb24gb2ZmLXNjcmVlblxuICBzdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7ICAvLyByZXF1aXJlZCB0byByZXR1cm4gY29vcmRpbmF0ZXMgcHJvcGVybHlcbiAgaWYgKCFkZWJ1ZylcbiAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7ICAvLyBub3QgJ2Rpc3BsYXk6IG5vbmUnIGJlY2F1c2Ugd2Ugd2FudCByZW5kZXJpbmdcblxuICAvLyBUcmFuc2ZlciB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMgdG8gdGhlIGRpdlxuICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICBpZiAoaXNJbnB1dCAmJiBwcm9wID09PSAnbGluZUhlaWdodCcpIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgPGlucHV0PnMgYmVjYXVzZSB0ZXh0IGlzIHJlbmRlcmVkIGNlbnRlcmVkIGFuZCBsaW5lIGhlaWdodCBtYXkgYmUgIT0gaGVpZ2h0XG4gICAgICBzdHlsZS5saW5lSGVpZ2h0ID0gY29tcHV0ZWQuaGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZVtwcm9wXSA9IGNvbXB1dGVkW3Byb3BdO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGlzRmlyZWZveCkge1xuICAgIC8vIEZpcmVmb3ggbGllcyBhYm91dCB0aGUgb3ZlcmZsb3cgcHJvcGVydHkgZm9yIHRleHRhcmVhczogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9OTg0Mjc1XG4gICAgaWYgKGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gcGFyc2VJbnQoY29tcHV0ZWQuaGVpZ2h0KSlcbiAgICAgIHN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7ICAvLyBmb3IgQ2hyb21lIHRvIG5vdCByZW5kZXIgYSBzY3JvbGxiYXI7IElFIGtlZXBzIG92ZXJmbG93WSA9ICdzY3JvbGwnXG4gIH1cblxuICBkaXYudGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZygwLCBwb3NpdGlvbik7XG4gIC8vIFRoZSBzZWNvbmQgc3BlY2lhbCBoYW5kbGluZyBmb3IgaW5wdXQgdHlwZT1cInRleHRcIiB2cyB0ZXh0YXJlYTpcbiAgLy8gc3BhY2VzIG5lZWQgdG8gYmUgcmVwbGFjZWQgd2l0aCBub24tYnJlYWtpbmcgc3BhY2VzIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTM0MDIwMzUvMTI2OTAzN1xuICBpZiAoaXNJbnB1dClcbiAgICBkaXYudGV4dENvbnRlbnQgPSBkaXYudGV4dENvbnRlbnQucmVwbGFjZSgvXFxzL2csICdcXHUwMGEwJyk7XG5cbiAgdmFyIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIC8vIFdyYXBwaW5nIG11c3QgYmUgcmVwbGljYXRlZCAqZXhhY3RseSosIGluY2x1ZGluZyB3aGVuIGEgbG9uZyB3b3JkIGdldHNcbiAgLy8gb250byB0aGUgbmV4dCBsaW5lLCB3aXRoIHdoaXRlc3BhY2UgYXQgdGhlIGVuZCBvZiB0aGUgbGluZSBiZWZvcmUgKCM3KS5cbiAgLy8gVGhlICAqb25seSogcmVsaWFibGUgd2F5IHRvIGRvIHRoYXQgaXMgdG8gY29weSB0aGUgKmVudGlyZSogcmVzdCBvZiB0aGVcbiAgLy8gdGV4dGFyZWEncyBjb250ZW50IGludG8gdGhlIDxzcGFuPiBjcmVhdGVkIGF0IHRoZSBjYXJldCBwb3NpdGlvbi5cbiAgLy8gRm9yIGlucHV0cywganVzdCAnLicgd291bGQgYmUgZW5vdWdoLCBidXQgbm8gbmVlZCB0byBib3RoZXIuXG4gIHNwYW4udGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZyhwb3NpdGlvbikgfHwgJy4nOyAgLy8gfHwgYmVjYXVzZSBhIGNvbXBsZXRlbHkgZW1wdHkgZmF1eCBzcGFuIGRvZXNuJ3QgcmVuZGVyIGF0IGFsbFxuICBkaXYuYXBwZW5kQ2hpbGQoc3Bhbik7XG5cbiAgdmFyIGNvb3JkaW5hdGVzID0ge1xuICAgIHRvcDogc3Bhbi5vZmZzZXRUb3AgKyBwYXJzZUludChjb21wdXRlZFsnYm9yZGVyVG9wV2lkdGgnXSksXG4gICAgbGVmdDogc3Bhbi5vZmZzZXRMZWZ0ICsgcGFyc2VJbnQoY29tcHV0ZWRbJ2JvcmRlckxlZnRXaWR0aCddKSxcbiAgICBoZWlnaHQ6IHBhcnNlSW50KGNvbXB1dGVkWydsaW5lSGVpZ2h0J10pXG4gIH07XG5cbiAgaWYgKGRlYnVnKSB7XG4gICAgc3Bhbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2FhYSc7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuICB9XG5cbiAgcmV0dXJuIGNvb3JkaW5hdGVzO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBnZXRDYXJldENvb3JkaW5hdGVzO1xufSBlbHNlIGlmKGlzQnJvd3Nlcikge1xuICB3aW5kb3cuZ2V0Q2FyZXRDb29yZGluYXRlcyA9IGdldENhcmV0Q29vcmRpbmF0ZXM7XG59XG5cbn0oKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHBhcnNlVG9rZW5zXzEgPSByZXF1aXJlKFwiLi9wYXJzZVRva2Vuc1wiKTtcbmNvbnN0IGNyZWF0ZVRva2VuVGFnXzEgPSByZXF1aXJlKFwiLi9jcmVhdGVUb2tlblRhZ1wiKTtcbmNvbnN0IHRocm90dGxlXzEgPSByZXF1aXJlKFwiLi91dGlsL3Rocm90dGxlXCIpO1xuY29uc3QgZ2V0UGFyZW50QnlUYWdOYW1lXzEgPSByZXF1aXJlKFwiLi9nZXRQYXJlbnRCeVRhZ05hbWVcIik7XG5jb25zdCBmaW5kVGV4dElucHV0c18xID0gcmVxdWlyZShcIi4vdXRpbC9maW5kVGV4dElucHV0c1wiKTtcbmZ1bmN0aW9uIGxpc3RlblRvSW5wdXQoaW5wdXQpIHtcbiAgICBsZXQga25vd25Ub2tlbnMgPSBbXTtcbiAgICBjb25zdCB1cGRhdGVUb2tlbnNGb3JJbnB1dCA9IHRocm90dGxlXzEuZGVmYXVsdCgoKSA9PiB7XG4gICAgICAgIGxldCB0b2tlbnMgPSBwYXJzZVRva2Vuc18xLmRlZmF1bHQoaW5wdXQudmFsdWUpO1xuICAgICAgICBpZiAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIEZpbHRlciB0aGUgdG9rZW5zIHRoYXQgd2UgYWxyZWFkeSBrbm93IGFib3V0XG4gICAgICAgICAgICBjb25zdCB1bmtub3duVG9rZW5zID0gdG9rZW5zLmZpbHRlcih0b2tlbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFrbm93blRva2Vucy5zb21lKGtub3duVG9rZW4gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGtub3duVG9rZW4udG9rZW4uaW5kZXggPT09IHRva2VuLmluZGV4ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBrbm93blRva2VuLnRva2VuLnZhbHVlID09PSB0b2tlbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHVua25vd25Ub2tlbnMuZm9yRWFjaCh0b2tlbiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW5UYWcgPSBjcmVhdGVUb2tlblRhZ18xLmRlZmF1bHQoaW5wdXQsIHRva2VuKTtcbiAgICAgICAgICAgICAgICBrbm93blRva2Vucy5wdXNoKHRva2VuVGFnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgdG9rZW5zIHRoYXQgYXJlIG5vIGxvbmdlciB2YWxpZFxuICAgICAgICBrbm93blRva2VucyA9IGtub3duVG9rZW5zLmZpbHRlcihrbm93blRva2VuID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0aWxsRXhpc3RzID0gdG9rZW5zLnNvbWUobmV3VG9rZW4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoa25vd25Ub2tlbi50b2tlbi5pbmRleCA9PT0gbmV3VG9rZW4uaW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAga25vd25Ub2tlbi50b2tlbi52YWx1ZSA9PT0gbmV3VG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIXN0aWxsRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAga25vd25Ub2tlbi5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGlsbEV4aXN0cztcbiAgICAgICAgfSk7XG4gICAgfSwgNTAwKTtcbiAgICBsZXQgZm9ybU5vZGUgPSBnZXRQYXJlbnRCeVRhZ05hbWVfMS5kZWZhdWx0KGlucHV0LCBcImZvcm1cIik7XG4gICAgZnVuY3Rpb24gY2xlYW5VcCgpIHtcbiAgICAgICAga25vd25Ub2tlbnMuZm9yRWFjaChrbm93blRva2VuID0+IHtcbiAgICAgICAgICAgIGtub3duVG9rZW4ucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBrbm93blRva2VucyA9IFtdO1xuICAgICAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgICAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHVwZGF0ZVRva2Vuc0ZvcklucHV0KTtcbiAgICAgICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHVwZGF0ZVRva2Vuc0ZvcklucHV0KTtcbiAgICAgICAgZm9ybU5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBwcm9jZXNzUHJlU3VibWl0LCB0cnVlKTtcbiAgICB9XG4gICAgLy8gUmVwbGFjZSBhbGwgdGhlIHRva2VucyB3aXRoIGltYWdlIHRhZ3NcbiAgICBmdW5jdGlvbiBwcm9jZXNzUHJlU3VibWl0KGV2dCkge1xuICAgICAgICAvLyBQcm9jZXNzIHRoZSB0b2tlbnMgZnJvbSB0aGUgbGFzdCB0byB0aGUgZmlyc3QsIHNvIHRoYXRcbiAgICAgICAgLy8gd2UgY2FuIG1vZGlmeSB0aGUgdGV4dCBjb250ZW50cyB3aXRob3V0IGNoYW5naW5nIHRoZVxuICAgICAgICAvLyBpbmRleCBwb3NpdGlvbnMgb2YgdG9rZW5zIGJlZm9yZSB3ZSBwcm9jZXNzIHRoZW1cbiAgICAgICAga25vd25Ub2tlbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgaWYgKGEudG9rZW4uaW5kZXggPiBiLnRva2VuLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYi50b2tlbi5pbmRleCA+IGEudG9rZW4uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHZhbHVlID0gaW5wdXQudmFsdWU7XG4gICAgICAgIGtub3duVG9rZW5zLmZvckVhY2goa25vd25Ub2tlbiA9PiB7XG4gICAgICAgICAgICBpZiAoa25vd25Ub2tlbi5pc1ZhbGlkICYmICFrbm93blRva2VuLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zdWJzdHJpbmcoMCwga25vd25Ub2tlbi50b2tlbi5pbmRleCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYDxpbWcgc3JjPVwiJHtrbm93blRva2VuLmltYWdlVXJsfVwiIHRpdGxlPVwiQ3JlYXRlZCBieSBnaXRtZS5tZSB3aXRoIC8ke2tub3duVG9rZW4udG9rZW4udmFsdWV9XCIvPmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc3Vic3RyaW5nKGtub3duVG9rZW4udG9rZW4uaW5kZXggKyBrbm93blRva2VuLnRva2VuLnZhbHVlLmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgY2xlYW5VcCgpO1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHVwZGF0ZVRva2Vuc0ZvcklucHV0KTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHVwZGF0ZVRva2Vuc0ZvcklucHV0KTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgIGZvcm1Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgcHJvY2Vzc1ByZVN1Ym1pdCwgdHJ1ZSk7XG4gICAgLy8gSW4gY2FzZSB0aGUgaW5wdXQgaXMgc2ltcGx5IHJlbW92ZWQgZnJvbSB0aGUgRE9NIHdpdGhvdXRcbiAgICAvLyBiZWluZyBzdWJtaXR0ZWQsIGNsZWFuIHVwIHRvb1xuICAgIHZhciBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm11dGF0aW9uIGV2ZW50XCIsIGV2dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5wdXQub2Zmc2V0SGVpZ2h0XCIsIGlucHV0Lm9mZnNldEhlaWdodCk7XG4gICAgICAgIGlmIChldnRbMF0ucmVtb3ZlZE5vZGVzICYmXG4gICAgICAgICAgICBBcnJheS5mcm9tKGV2dFswXS5yZW1vdmVkTm9kZXMpLmluZGV4T2YoaW5wdXQpID4gLTEpIHtcbiAgICAgICAgICAgIGNsZWFuVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbnB1dC5vZmZzZXRIZWlnaHQgPT09IDApIHtcbiAgICAgICAgICAgIGNsZWFuVXAoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShmb3JtTm9kZSwgeyBjaGlsZExpc3Q6IHRydWUgfSk7XG4gICAgdXBkYXRlVG9rZW5zRm9ySW5wdXQoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBpbnB1dCxcbiAgICAgICAgcmVtb3ZlOiBjbGVhblVwXG4gICAgfTtcbn1cbmZpbmRUZXh0SW5wdXRzXzEuZGVmYXVsdChsaXN0ZW5Ub0lucHV0KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZ2V0Q2FyZXRDb29yZGluYXRlcyA9IHJlcXVpcmUoXCJ0ZXh0YXJlYS1jYXJldFwiKTtcbmNvbnN0IHNlYXJjaGVyXzEgPSByZXF1aXJlKFwiLi9zZWFyY2hlclwiKTtcbmNvbnN0IFRBR19DT05UQUlORVJfSUQgPSBcIl9fdGFnQ29udGFpbmVyXCI7XG5jb25zdCBURVhUX0hFSUdIVCA9IDE4O1xubGV0IHJlbW92ZU9wZW5JbWFnZSA9IG51bGw7XG5mdW5jdGlvbiBjcmVhdGVUb2tlblRhZyh0ZXh0SW5wdXQsIHRva2VuKSB7XG4gICAgY29uc3Qgc3RhcnRDb29yZHMgPSBnZXRDYXJldENvb3JkaW5hdGVzKHRleHRJbnB1dCwgdG9rZW4uaW5kZXgpO1xuICAgIGNvbnN0IGVuZENvb3JkcyA9IGdldENhcmV0Q29vcmRpbmF0ZXModGV4dElucHV0LCB0b2tlbi5pbmRleCArIHRva2VuLnZhbHVlLmxlbmd0aCArIDEpO1xuICAgIGxldCB0YWdDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChUQUdfQ09OVEFJTkVSX0lEKTtcbiAgICBpZiAoIXRhZ0NvbnRhaW5lcikge1xuICAgICAgICB0YWdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0YWdDb250YWluZXIuaWQgPSBUQUdfQ09OVEFJTkVSX0lEO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRhZ0NvbnRhaW5lcik7XG4gICAgfVxuICAgIGNvbnN0IHRhZ1VpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsZXQgaW1hZ2VVaSA9IG51bGw7XG4gICAgdGFnVWkuY2xhc3NOYW1lID0gXCJfX3Rva2VuVGFnXCI7XG4gICAgdGFnQ29udGFpbmVyLmFwcGVuZENoaWxkKHRhZ1VpKTtcbiAgICBmdW5jdGlvbiByZW1vdmVJbWFnZSgpIHtcbiAgICAgICAgaWYgKGltYWdlVWkgJiYgaW1hZ2VVaS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBpbWFnZVVpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaW1hZ2VVaSk7XG4gICAgICAgIH1cbiAgICAgICAgaW1hZ2VVaSA9IG51bGw7XG4gICAgICAgIGlmIChyZW1vdmVPcGVuSW1hZ2UgPT09IHJlbW92ZUltYWdlKSB7XG4gICAgICAgICAgICByZW1vdmVPcGVuSW1hZ2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZVRhZ1VpKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpc2FibGVJbWFnZSgpIHtcbiAgICAgICAgcmVjb3JkLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgcmVtb3ZlSW1hZ2UoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5hYmxlSW1hZ2UoKSB7XG4gICAgICAgIHJlY29yZC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICByZW1vdmVJbWFnZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVUYWdVaSgpIHtcbiAgICAgICAgbGV0IHRpdGxlID0gXCJcIjtcbiAgICAgICAgdGFnVWkuY2xhc3NMaXN0LnRvZ2dsZShcImltYWdlRm91bmRcIiwgISFyZWNvcmQuaW1hZ2VVcmwpO1xuICAgICAgICB0YWdVaS5jbGFzc0xpc3QudG9nZ2xlKFwiaW1hZ2VOb3RGb3VuZFwiLCAhIXJlY29yZC5pbWFnZVVybCk7XG4gICAgICAgIGlmICghIXJlY29yZC5pbWFnZVVybCkge1xuICAgICAgICAgICAgdGl0bGUgPSBgR2l0TWVtZSBmb3IgXCIke3Rva2VuLnZhbHVlfVwiYDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRpdGxlID0gYEdpdE1lbWUgZm9yIFwiJHt0b2tlbi52YWx1ZX1cImA7XG4gICAgICAgIH1cbiAgICAgICAgdGFnVWkuY2xhc3NMaXN0LnRvZ2dsZShcImRpc2FibGVkXCIsIHJlY29yZC5kaXNhYmxlZCk7XG4gICAgICAgIGltYWdlVWkgJiYgaW1hZ2VVaS5jbGFzc0xpc3QudG9nZ2xlKFwiZGlzYWJsZWRcIiwgcmVjb3JkLmRpc2FibGVkKTtcbiAgICAgICAgaWYgKHJlY29yZC5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGl0bGUgPSBgR2l0TWVtZSBpbWFnZSBkaXNhYmxlZGA7XG4gICAgICAgIH1cbiAgICAgICAgaW1hZ2VVaSAmJlxuICAgICAgICAgICAgaW1hZ2VVaS5jbGFzc0xpc3QudG9nZ2xlKFwiaGFzTXVsdGlwbGVJbWFnZXNcIiwgcmVjb3JkLmltYWdlVXJscy5sZW5ndGggPiAxKTtcbiAgICAgICAgdGFnVWkudGl0bGUgPSB0aXRsZTtcbiAgICB9XG4gICAgdGFnVWkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2dCA9PiB7XG4gICAgICAgIC8vIElmIGEgdXJsIGV4aXN0cywgdGhlbiBzaG93IHRoZSBpbWFnZSBpbiB0aHVtbmFpbCBmb3JtLlxuICAgICAgICAvLyBJZiB0aGUgdXJsIGRvZXMgbm90IGV4aXN0LCBvcGVuIGEgdHlwZWFoZWFkIHRvIGZpbmQgdGhlXG4gICAgICAgIC8vIGltYWdlIHlvdSB3YW50IChsYXRlcnouLi4pXG4gICAgICAgIGlmIChyZWNvcmQuaW1hZ2VVcmwpIHtcbiAgICAgICAgICAgIGlmIChpbWFnZVVpKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlSW1hZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZW1vdmVPcGVuSW1hZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlT3BlbkltYWdlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGltYWdlVWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGltYWdlVWkuY2xhc3NOYW1lID0gXCJfX3Rva2VuVGFnVGh1bWJuYWlsXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2VOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgICAgICBpbWFnZU5vZGUuc3JjID0gcmVjb3JkLmltYWdlVXJsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgIHJlbW92ZUJ1dHRvbk5vZGUudGV4dENvbnRlbnQgPSByZWNvcmQuZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgPyBcIkVuYWJsZSBUYWdcIlxuICAgICAgICAgICAgICAgICAgICA6IFwiRGlzYWJsZSBUYWdcIjtcbiAgICAgICAgICAgICAgICBpbWFnZVVpLmFwcGVuZENoaWxkKGltYWdlTm9kZSk7XG4gICAgICAgICAgICAgICAgaW1hZ2VVaS5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b25Ob2RlKTtcbiAgICAgICAgICAgICAgICBpbWFnZU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92ZUltYWdlKTtcbiAgICAgICAgICAgICAgICByZW1vdmVCdXR0b25Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZWNvcmQuZGlzYWJsZWQgPyBlbmFibGVJbWFnZSA6IGRpc2FibGVJbWFnZSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hvd0FsbEltYWdlc05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgIHNob3dBbGxJbWFnZXNOb2RlLmNsYXNzTmFtZSA9IFwiX19zaG93QWxsSW1hZ2VzXCI7XG4gICAgICAgICAgICAgICAgc2hvd0FsbEltYWdlc05vZGUudGV4dENvbnRlbnQgPSBgKyR7cmVjb3JkLmltYWdlVXJscy5sZW5ndGggLSAxfWA7XG4gICAgICAgICAgICAgICAgaW1hZ2VVaS5hcHBlbmRDaGlsZChzaG93QWxsSW1hZ2VzTm9kZSk7XG4gICAgICAgICAgICAgICAgdXBkYXRlVGFnVWkoKTtcbiAgICAgICAgICAgICAgICB0YWdDb250YWluZXIuYXBwZW5kQ2hpbGQoaW1hZ2VVaSk7XG4gICAgICAgICAgICAgICAgcmVtb3ZlT3BlbkltYWdlID0gcmVtb3ZlSW1hZ2U7XG4gICAgICAgICAgICAgICAgcmVwb3NpdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gcmVwb3NpdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmVjdCA9IHRleHRJbnB1dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgdG9wID0gVEVYVF9IRUlHSFQgKyB3aW5kb3cuc2Nyb2xsWSArIHJlY3QudG9wICsgc3RhcnRDb29yZHMudG9wO1xuICAgICAgICBjb25zdCBsZWZ0ID0gd2luZG93LnNjcm9sbFggKyByZWN0LmxlZnQgKyBzdGFydENvb3Jkcy5sZWZ0O1xuICAgICAgICB0YWdVaS5zdHlsZS50b3AgPSB0b3AgKyBcInB4XCI7XG4gICAgICAgIHRhZ1VpLnN0eWxlLmxlZnQgPSBsZWZ0ICsgXCJweFwiO1xuICAgICAgICB0YWdVaS5zdHlsZS53aWR0aCA9IGVuZENvb3Jkcy5sZWZ0IC0gc3RhcnRDb29yZHMubGVmdCArIFwicHhcIjtcbiAgICAgICAgaWYgKGltYWdlVWkpIHtcbiAgICAgICAgICAgIGltYWdlVWkuc3R5bGUudG9wID0gdG9wICsgMiArIFwicHhcIjtcbiAgICAgICAgICAgIGltYWdlVWkuc3R5bGUubGVmdCA9IGxlZnQgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICB0YWdVaS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhZ1VpKTtcbiAgICAgICAgcmVtb3ZlSW1hZ2UoKTtcbiAgICB9XG4gICAgcmVwb3NpdGlvbigpO1xuICAgIGNvbnN0IHJlY29yZCA9IHtcbiAgICAgICAgaW5wdXQ6IHRleHRJbnB1dCxcbiAgICAgICAgcmVtb3ZlLFxuICAgICAgICByZXBvc2l0aW9uLFxuICAgICAgICB0b2tlbixcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIGltYWdlVXJsOiBudWxsLFxuICAgICAgICBpbWFnZVVybHM6IFtdLFxuICAgICAgICBkaXNhYmxlZDogZmFsc2VcbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKFwic2VhcmNoaW5nIGZvciBcIiwgdG9rZW4udmFsdWUpO1xuICAgIHNlYXJjaGVyXzEuZGVmYXVsdCh0b2tlbi52YWx1ZSkudGhlbigodXJscykgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSB1cmxzLmxlbmd0aCA+IDAgPyB1cmxzWzBdIDogbnVsbDtcbiAgICAgICAgcmVjb3JkLmltYWdlVXJsID0gdXJsO1xuICAgICAgICByZWNvcmQuaW1hZ2VVcmxzID0gdXJscztcbiAgICAgICAgcmVjb3JkLmlzVmFsaWQgPSAhIXVybDtcbiAgICAgICAgdXBkYXRlVGFnVWkoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVjb3JkO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlVG9rZW5UYWc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGdldFBhcmVudEJ5VGFnTmFtZShub2RlLCB0YWdOYW1lKSB7XG4gICAgbGV0IGZvdW5kTm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcbiAgICB3aGlsZSAoZm91bmROb2RlICYmIGZvdW5kTm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ05hbWUpIHtcbiAgICAgICAgZm91bmROb2RlID0gZm91bmROb2RlLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBmb3VuZE5vZGUgfHwgbnVsbDtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGdldFBhcmVudEJ5VGFnTmFtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLy8gRmluZCBhbGwgd29yZHMgYmVnaW5uaW5nIHdpdGggXCIvXCJcbmNvbnN0IHJlZ2V4ID0gLyg/PCFcXHcpXFwvXFx3Ky9nO1xuY29uc3QgY2hhclByZWZpeGVzID0ge1xuICAgIFwiXFxuXCI6IHRydWUsXG4gICAgXCJcXHRcIjogdHJ1ZSxcbiAgICBcIiBcIjogdHJ1ZVxufTtcbmZ1bmN0aW9uIHBhcnNlVG9rZW5zKHN0cikge1xuICAgIGNvbnN0IHJldCA9IFtdO1xuICAgIGxldCBtYXRjaDtcbiAgICBkbyB7XG4gICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhzdHIpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgZG9hYmxlIGluIHJlZ2V4LCBidXQgc2NyZXcgaXQuLi5cbiAgICAgICAgICAgIC8vIEZpbHRlciBpdCBvdXQgc28gdGhhdCBvbmx5IHRva2VucyB0aGF0IGFyZVxuICAgICAgICAgICAgLy8gLSBhdCB0aGUgc3RhcnQgb2YgYSBsaW5lXG4gICAgICAgICAgICAvLyAtIGFmdGVyIGEgc3BhY2Ugb3IgYSB0YWJcbiAgICAgICAgICAgIC8vIGFyZSB2YWxpZFxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBtYXRjaC5pbmRleDtcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gaW5kZXggPT09IDA7XG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsZXR0ZXJCZWZvcmUgPSBzdHIuY2hhckF0KGluZGV4IC0gMSk7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9ICEhY2hhclByZWZpeGVzW2xldHRlckJlZm9yZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IG1hdGNoLmluZGV4LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbWF0Y2hbMF0uc3Vic3RyaW5nKDEpLnRyaW0oKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSB3aGlsZSAobWF0Y2gpO1xuICAgIHJldHVybiByZXQ7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBwYXJzZVRva2VucztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmZXRjaCA9IHJlcXVpcmUoXCJub2RlLWZldGNoXCIpO1xuY29uc3QgR0lQSFlfQVBJX0tFWSA9IFwiSTV5c1h6Wkc0T0lvaU1EOTlUejd2NkFHTjl1ekdXcHJcIjtcbmZ1bmN0aW9uIHNlYXJjaGVyKHRva2VuVmFsdWUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBzd2l0Y2ggKHRva2VuVmFsdWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJmb29cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gW1wiaHR0cHM6Ly9qb2lucHJvbWlzZS5jb20vYXNzZXRzL21lZGlhL01lYXN1cmVfRWZmaWNhY3kuc3ZnXCJdO1xuICAgICAgICAgICAgY2FzZSBcImJhclwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBbXCJodHRwczovL3BheXRpY2tldC5pby9zdGF0aWMvaW1hZ2VzL2xvZ29zL2VwYV9sb2dvLmpwZ1wiXTtcbiAgICAgICAgICAgIGNhc2UgXCJzaGlwaXRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gW1wiaHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvNzlxZjFONFJKdGM4by9naXBoeS5naWZcIl07XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdpcGh5UmVzdWx0ID0geWllbGQgc2VhcmNoR2lwaHkodG9rZW5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChnaXBoeVJlc3VsdC5kYXRhICYmIGdpcGh5UmVzdWx0LmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdpcGh5UmVzdWx0LmRhdGEubWFwKGltYWdlRGF0YSA9PiBpbWFnZURhdGEuaW1hZ2VzLmRvd25zaXplZF9zdGlsbC51cmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IHNlYXJjaGVyO1xuY29uc3QgZ2lwaHlTZWFyY2hlcyA9IHt9O1xuZnVuY3Rpb24gc2VhcmNoR2lwaHkodG9rZW5WYWx1ZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmICghZ2lwaHlTZWFyY2hlc1t0b2tlblZhbHVlXSkge1xuICAgICAgICAgICAgZ2lwaHlTZWFyY2hlc1t0b2tlblZhbHVlXSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCBfcmVqZWN0KSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geWllbGQgZmV0Y2goYGh0dHBzOi8vYXBpLmdpcGh5LmNvbS92MS9naWZzL3NlYXJjaD9xPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRva2VuVmFsdWUpfSZhcGlfa2V5PSR7R0lQSFlfQVBJX0tFWX0mbGltaXQ9OGApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCByZXN1bHQuanNvbigpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdpcGh5U2VhcmNoZXNbdG9rZW5WYWx1ZV07XG4gICAgfSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGZpbmRUZXh0SW5wdXRzKGxpc3RlblRvSW5wdXQpIHtcbiAgICBjb25zdCBpZHMgPSBbXCJuZXdfY29tbWVudF9maWVsZFwiLCBcImlzc3VlX2JvZHlcIl07XG4gICAgY29uc3QgaW5wdXRzQnlJZCA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChpZHMubWFwKGlkID0+IGAjJHtpZH1gKS5qb2luKFwiLFwiKSkpO1xuICAgIGNvbnNvbGUubG9nKFwiaW5wdXRzQnlJZFwiLCBpbnB1dHNCeUlkKTtcbiAgICBjb25zdCBhbGxJbnB1dHMgPSBpbnB1dHNCeUlkO1xuICAgIGxldCBsaXN0ZW5lcnMgPSBhbGxJbnB1dHMubWFwKGxpc3RlblRvSW5wdXQpO1xuICAgIC8vIExpc3RlbiB0byBhbnkgbGF6aWx5IGNyZWF0ZWQgdGV4dCBhcmVhcyB0b29cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c2luXCIsIChldnQpID0+IHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGV2dC50YXJnZXQ7XG4gICAgICAgIGNvbnN0IHRhZ05hbWUgPSBub2RlLnRhZ05hbWU7XG4gICAgICAgIGlmICh0YWdOYW1lICYmXG4gICAgICAgICAgICB0YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwidGV4dGFyZWFcIiAmJlxuICAgICAgICAgICAgIWxpc3RlbmVycy5zb21lKGxpc3RlbmVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdGVuZXIuaW5wdXQgPT09IG5vZGU7XG4gICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuVG9JbnB1dChub2RlKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0xpc3RlbmVycyA9IHZhbGlkYXRlTGlzdGVuZXJzKGxpc3RlbmVycyk7XG4gICAgICAgIGlmIChuZXdMaXN0ZW5lcnMubGVuZ3RoICE9PSBsaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBuZXdMaXN0ZW5lcnM7XG4gICAgICAgIH1cbiAgICB9LCAyMDApO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gZmluZFRleHRJbnB1dHM7XG5mdW5jdGlvbiB2YWxpZGF0ZUxpc3RlbmVycyhsaXN0ZW5lcnMpIHtcbiAgICBjb25zdCBuZXdMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZmlsdGVyKGxpc3RlbmVyID0+IHtcbiAgICAgICAgLy8gQSBOb2RlJ3Mgb2Zmc2V0UGFyZW50IGlzIG51bGwgaWYgaXQgb3IgYW55IG9mIGl0c1xuICAgICAgICAvLyBwYXJlbnQgbm9kZXMgYXJlIGhpZGRlbi4gIEhhbmR5IVxuICAgICAgICBpZiAoIWxpc3RlbmVyLmlucHV0Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbGVhbmluZyB1cFwiLCBsaXN0ZW5lci5pbnB1dCk7XG4gICAgICAgICAgICBsaXN0ZW5lci5yZW1vdmUoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3TGlzdGVuZXJzO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBpZiAoIW9wdGlvbnMpXG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBEYXRlLm5vdygpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KVxuICAgICAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSlcbiAgICAgICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXQpXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSB0aHJvdHRsZTtcbiJdLCJzb3VyY2VSb290IjoiIn0=