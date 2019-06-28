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
    }, 200);
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
        console.log("processPreSubmit");
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
            if (knownToken.isValid) {
                value =
                    value.substring(0, knownToken.token.index) +
                        `<img src="${knownToken.imageUrl}"/>` +
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
            }
            else {
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
    searcher_1.default(token.value).then((url) => {
        record.imageUrl = imageUrl = url;
        record.isValid = !!url;
        if (url) {
            tagUi.className += " imageFound";
            tagUi.title = `GitMeme for "${token.value}"`;
        }
        else {
            tagUi.className += " imageNotFound";
            tagUi.title = `GitMeme: No image found for "${token.value}"`;
        }
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
function searcher(token) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (token) {
            case "foo":
                return "https://joinpromise.com/assets/media/Measure_Efficacy.svg";
            case "bar":
                return "https://payticket.io/static/images/logos/epa_logo.jpg";
            case "shipit":
                return "https://media.giphy.com/media/79qf1N4RJtc8o/giphy.gif";
            default:
                return null;
        }
    });
}
exports.default = searcher;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RleHRhcmVhLWNhcmV0L2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jb250ZW50U2NyaXB0LnRzIiwid2VicGFjazovLy8uL3NyYy9jcmVhdGVUb2tlblRhZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2V0UGFyZW50QnlUYWdOYW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZVRva2Vucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VhcmNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvZmluZFRleHRJbnB1dHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvdGhyb3R0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBOztBQUVBOztBQUVBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3hDYTtBQUNiLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbnRlbnRTY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb250ZW50U2NyaXB0LnRzXCIpO1xuIiwiLyoganNoaW50IGJyb3dzZXI6IHRydWUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuLy8gV2UnbGwgY29weSB0aGUgcHJvcGVydGllcyBiZWxvdyBpbnRvIHRoZSBtaXJyb3IgZGl2LlxuLy8gTm90ZSB0aGF0IHNvbWUgYnJvd3NlcnMsIHN1Y2ggYXMgRmlyZWZveCwgZG8gbm90IGNvbmNhdGVuYXRlIHByb3BlcnRpZXNcbi8vIGludG8gdGhlaXIgc2hvcnRoYW5kIChlLmcuIHBhZGRpbmctdG9wLCBwYWRkaW5nLWJvdHRvbSBldGMuIC0+IHBhZGRpbmcpLFxuLy8gc28gd2UgaGF2ZSB0byBsaXN0IGV2ZXJ5IHNpbmdsZSBwcm9wZXJ0eSBleHBsaWNpdGx5LlxudmFyIHByb3BlcnRpZXMgPSBbXG4gICdkaXJlY3Rpb24nLCAgLy8gUlRMIHN1cHBvcnRcbiAgJ2JveFNpemluZycsXG4gICd3aWR0aCcsICAvLyBvbiBDaHJvbWUgYW5kIElFLCBleGNsdWRlIHRoZSBzY3JvbGxiYXIsIHNvIHRoZSBtaXJyb3IgZGl2IHdyYXBzIGV4YWN0bHkgYXMgdGhlIHRleHRhcmVhIGRvZXNcbiAgJ2hlaWdodCcsXG4gICdvdmVyZmxvd1gnLFxuICAnb3ZlcmZsb3dZJywgIC8vIGNvcHkgdGhlIHNjcm9sbGJhciBmb3IgSUVcblxuICAnYm9yZGVyVG9wV2lkdGgnLFxuICAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdib3JkZXJMZWZ0V2lkdGgnLFxuICAnYm9yZGVyU3R5bGUnLFxuXG4gICdwYWRkaW5nVG9wJyxcbiAgJ3BhZGRpbmdSaWdodCcsXG4gICdwYWRkaW5nQm90dG9tJyxcbiAgJ3BhZGRpbmdMZWZ0JyxcblxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvZm9udFxuICAnZm9udFN0eWxlJyxcbiAgJ2ZvbnRWYXJpYW50JyxcbiAgJ2ZvbnRXZWlnaHQnLFxuICAnZm9udFN0cmV0Y2gnLFxuICAnZm9udFNpemUnLFxuICAnZm9udFNpemVBZGp1c3QnLFxuICAnbGluZUhlaWdodCcsXG4gICdmb250RmFtaWx5JyxcblxuICAndGV4dEFsaWduJyxcbiAgJ3RleHRUcmFuc2Zvcm0nLFxuICAndGV4dEluZGVudCcsXG4gICd0ZXh0RGVjb3JhdGlvbicsICAvLyBtaWdodCBub3QgbWFrZSBhIGRpZmZlcmVuY2UsIGJ1dCBiZXR0ZXIgYmUgc2FmZVxuXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ3dvcmRTcGFjaW5nJyxcblxuICAndGFiU2l6ZScsXG4gICdNb3pUYWJTaXplJ1xuXG5dO1xuXG52YXIgaXNCcm93c2VyID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKTtcbnZhciBpc0ZpcmVmb3ggPSAoaXNCcm93c2VyICYmIHdpbmRvdy5tb3pJbm5lclNjcmVlblggIT0gbnVsbCk7XG5cbmZ1bmN0aW9uIGdldENhcmV0Q29vcmRpbmF0ZXMoZWxlbWVudCwgcG9zaXRpb24sIG9wdGlvbnMpIHtcbiAgaWYgKCFpc0Jyb3dzZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RleHRhcmVhLWNhcmV0LXBvc2l0aW9uI2dldENhcmV0Q29vcmRpbmF0ZXMgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIGEgYnJvd3NlcicpO1xuICB9XG5cbiAgdmFyIGRlYnVnID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlYnVnIHx8IGZhbHNlO1xuICBpZiAoZGVidWcpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXQtdGV4dGFyZWEtY2FyZXQtcG9zaXRpb24tbWlycm9yLWRpdicpO1xuICAgIGlmIChlbCkgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gIH1cblxuICAvLyBUaGUgbWlycm9yIGRpdiB3aWxsIHJlcGxpY2F0ZSB0aGUgdGV4dGFyZWEncyBzdHlsZVxuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pZCA9ICdpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2JztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuXG4gIHZhciBzdHlsZSA9IGRpdi5zdHlsZTtcbiAgdmFyIGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSA6IGVsZW1lbnQuY3VycmVudFN0eWxlOyAgLy8gY3VycmVudFN0eWxlIGZvciBJRSA8IDlcbiAgdmFyIGlzSW5wdXQgPSBlbGVtZW50Lm5vZGVOYW1lID09PSAnSU5QVVQnO1xuXG4gIC8vIERlZmF1bHQgdGV4dGFyZWEgc3R5bGVzXG4gIHN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnO1xuICBpZiAoIWlzSW5wdXQpXG4gICAgc3R5bGUud29yZFdyYXAgPSAnYnJlYWstd29yZCc7ICAvLyBvbmx5IGZvciB0ZXh0YXJlYS1zXG5cbiAgLy8gUG9zaXRpb24gb2ZmLXNjcmVlblxuICBzdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7ICAvLyByZXF1aXJlZCB0byByZXR1cm4gY29vcmRpbmF0ZXMgcHJvcGVybHlcbiAgaWYgKCFkZWJ1ZylcbiAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7ICAvLyBub3QgJ2Rpc3BsYXk6IG5vbmUnIGJlY2F1c2Ugd2Ugd2FudCByZW5kZXJpbmdcblxuICAvLyBUcmFuc2ZlciB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMgdG8gdGhlIGRpdlxuICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICBpZiAoaXNJbnB1dCAmJiBwcm9wID09PSAnbGluZUhlaWdodCcpIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgPGlucHV0PnMgYmVjYXVzZSB0ZXh0IGlzIHJlbmRlcmVkIGNlbnRlcmVkIGFuZCBsaW5lIGhlaWdodCBtYXkgYmUgIT0gaGVpZ2h0XG4gICAgICBzdHlsZS5saW5lSGVpZ2h0ID0gY29tcHV0ZWQuaGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZVtwcm9wXSA9IGNvbXB1dGVkW3Byb3BdO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGlzRmlyZWZveCkge1xuICAgIC8vIEZpcmVmb3ggbGllcyBhYm91dCB0aGUgb3ZlcmZsb3cgcHJvcGVydHkgZm9yIHRleHRhcmVhczogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9OTg0Mjc1XG4gICAgaWYgKGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gcGFyc2VJbnQoY29tcHV0ZWQuaGVpZ2h0KSlcbiAgICAgIHN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7ICAvLyBmb3IgQ2hyb21lIHRvIG5vdCByZW5kZXIgYSBzY3JvbGxiYXI7IElFIGtlZXBzIG92ZXJmbG93WSA9ICdzY3JvbGwnXG4gIH1cblxuICBkaXYudGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZygwLCBwb3NpdGlvbik7XG4gIC8vIFRoZSBzZWNvbmQgc3BlY2lhbCBoYW5kbGluZyBmb3IgaW5wdXQgdHlwZT1cInRleHRcIiB2cyB0ZXh0YXJlYTpcbiAgLy8gc3BhY2VzIG5lZWQgdG8gYmUgcmVwbGFjZWQgd2l0aCBub24tYnJlYWtpbmcgc3BhY2VzIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTM0MDIwMzUvMTI2OTAzN1xuICBpZiAoaXNJbnB1dClcbiAgICBkaXYudGV4dENvbnRlbnQgPSBkaXYudGV4dENvbnRlbnQucmVwbGFjZSgvXFxzL2csICdcXHUwMGEwJyk7XG5cbiAgdmFyIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIC8vIFdyYXBwaW5nIG11c3QgYmUgcmVwbGljYXRlZCAqZXhhY3RseSosIGluY2x1ZGluZyB3aGVuIGEgbG9uZyB3b3JkIGdldHNcbiAgLy8gb250byB0aGUgbmV4dCBsaW5lLCB3aXRoIHdoaXRlc3BhY2UgYXQgdGhlIGVuZCBvZiB0aGUgbGluZSBiZWZvcmUgKCM3KS5cbiAgLy8gVGhlICAqb25seSogcmVsaWFibGUgd2F5IHRvIGRvIHRoYXQgaXMgdG8gY29weSB0aGUgKmVudGlyZSogcmVzdCBvZiB0aGVcbiAgLy8gdGV4dGFyZWEncyBjb250ZW50IGludG8gdGhlIDxzcGFuPiBjcmVhdGVkIGF0IHRoZSBjYXJldCBwb3NpdGlvbi5cbiAgLy8gRm9yIGlucHV0cywganVzdCAnLicgd291bGQgYmUgZW5vdWdoLCBidXQgbm8gbmVlZCB0byBib3RoZXIuXG4gIHNwYW4udGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZyhwb3NpdGlvbikgfHwgJy4nOyAgLy8gfHwgYmVjYXVzZSBhIGNvbXBsZXRlbHkgZW1wdHkgZmF1eCBzcGFuIGRvZXNuJ3QgcmVuZGVyIGF0IGFsbFxuICBkaXYuYXBwZW5kQ2hpbGQoc3Bhbik7XG5cbiAgdmFyIGNvb3JkaW5hdGVzID0ge1xuICAgIHRvcDogc3Bhbi5vZmZzZXRUb3AgKyBwYXJzZUludChjb21wdXRlZFsnYm9yZGVyVG9wV2lkdGgnXSksXG4gICAgbGVmdDogc3Bhbi5vZmZzZXRMZWZ0ICsgcGFyc2VJbnQoY29tcHV0ZWRbJ2JvcmRlckxlZnRXaWR0aCddKSxcbiAgICBoZWlnaHQ6IHBhcnNlSW50KGNvbXB1dGVkWydsaW5lSGVpZ2h0J10pXG4gIH07XG5cbiAgaWYgKGRlYnVnKSB7XG4gICAgc3Bhbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2FhYSc7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuICB9XG5cbiAgcmV0dXJuIGNvb3JkaW5hdGVzO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBnZXRDYXJldENvb3JkaW5hdGVzO1xufSBlbHNlIGlmKGlzQnJvd3Nlcikge1xuICB3aW5kb3cuZ2V0Q2FyZXRDb29yZGluYXRlcyA9IGdldENhcmV0Q29vcmRpbmF0ZXM7XG59XG5cbn0oKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHBhcnNlVG9rZW5zXzEgPSByZXF1aXJlKFwiLi9wYXJzZVRva2Vuc1wiKTtcbmNvbnN0IGNyZWF0ZVRva2VuVGFnXzEgPSByZXF1aXJlKFwiLi9jcmVhdGVUb2tlblRhZ1wiKTtcbmNvbnN0IHRocm90dGxlXzEgPSByZXF1aXJlKFwiLi91dGlsL3Rocm90dGxlXCIpO1xuY29uc3QgZ2V0UGFyZW50QnlUYWdOYW1lXzEgPSByZXF1aXJlKFwiLi9nZXRQYXJlbnRCeVRhZ05hbWVcIik7XG5jb25zdCBmaW5kVGV4dElucHV0c18xID0gcmVxdWlyZShcIi4vdXRpbC9maW5kVGV4dElucHV0c1wiKTtcbmZ1bmN0aW9uIGxpc3RlblRvSW5wdXQoaW5wdXQpIHtcbiAgICBsZXQga25vd25Ub2tlbnMgPSBbXTtcbiAgICBjb25zdCB1cGRhdGVUb2tlbnNGb3JJbnB1dCA9IHRocm90dGxlXzEuZGVmYXVsdCgoKSA9PiB7XG4gICAgICAgIGxldCB0b2tlbnMgPSBwYXJzZVRva2Vuc18xLmRlZmF1bHQoaW5wdXQudmFsdWUpO1xuICAgICAgICBpZiAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIEZpbHRlciB0aGUgdG9rZW5zIHRoYXQgd2UgYWxyZWFkeSBrbm93IGFib3V0XG4gICAgICAgICAgICBjb25zdCB1bmtub3duVG9rZW5zID0gdG9rZW5zLmZpbHRlcih0b2tlbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFrbm93blRva2Vucy5zb21lKGtub3duVG9rZW4gPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGtub3duVG9rZW4udG9rZW4uaW5kZXggPT09IHRva2VuLmluZGV4ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBrbm93blRva2VuLnRva2VuLnZhbHVlID09PSB0b2tlbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHVua25vd25Ub2tlbnMuZm9yRWFjaCh0b2tlbiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW5UYWcgPSBjcmVhdGVUb2tlblRhZ18xLmRlZmF1bHQoaW5wdXQsIHRva2VuKTtcbiAgICAgICAgICAgICAgICBrbm93blRva2Vucy5wdXNoKHRva2VuVGFnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgdG9rZW5zIHRoYXQgYXJlIG5vIGxvbmdlciB2YWxpZFxuICAgICAgICBrbm93blRva2VucyA9IGtub3duVG9rZW5zLmZpbHRlcihrbm93blRva2VuID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0aWxsRXhpc3RzID0gdG9rZW5zLnNvbWUobmV3VG9rZW4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoa25vd25Ub2tlbi50b2tlbi5pbmRleCA9PT0gbmV3VG9rZW4uaW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAga25vd25Ub2tlbi50b2tlbi52YWx1ZSA9PT0gbmV3VG9rZW4udmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIXN0aWxsRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAga25vd25Ub2tlbi5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGlsbEV4aXN0cztcbiAgICAgICAgfSk7XG4gICAgfSwgMjAwKTtcbiAgICBsZXQgZm9ybU5vZGUgPSBnZXRQYXJlbnRCeVRhZ05hbWVfMS5kZWZhdWx0KGlucHV0LCBcImZvcm1cIik7XG4gICAgZnVuY3Rpb24gY2xlYW5VcCgpIHtcbiAgICAgICAga25vd25Ub2tlbnMuZm9yRWFjaChrbm93blRva2VuID0+IHtcbiAgICAgICAgICAgIGtub3duVG9rZW4ucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBrbm93blRva2VucyA9IFtdO1xuICAgICAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgICAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHVwZGF0ZVRva2Vuc0ZvcklucHV0KTtcbiAgICAgICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIHVwZGF0ZVRva2Vuc0ZvcklucHV0KTtcbiAgICAgICAgZm9ybU5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBwcm9jZXNzUHJlU3VibWl0LCB0cnVlKTtcbiAgICB9XG4gICAgLy8gUmVwbGFjZSBhbGwgdGhlIHRva2VucyB3aXRoIGltYWdlIHRhZ3NcbiAgICBmdW5jdGlvbiBwcm9jZXNzUHJlU3VibWl0KGV2dCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInByb2Nlc3NQcmVTdWJtaXRcIik7XG4gICAgICAgIC8vIFByb2Nlc3MgdGhlIHRva2VucyBmcm9tIHRoZSBsYXN0IHRvIHRoZSBmaXJzdCwgc28gdGhhdFxuICAgICAgICAvLyB3ZSBjYW4gbW9kaWZ5IHRoZSB0ZXh0IGNvbnRlbnRzIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICAgIC8vIGluZGV4IHBvc2l0aW9ucyBvZiB0b2tlbnMgYmVmb3JlIHdlIHByb2Nlc3MgdGhlbVxuICAgICAgICBrbm93blRva2Vucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS50b2tlbi5pbmRleCA+IGIudG9rZW4uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChiLnRva2VuLmluZGV4ID4gYS50b2tlbi5pbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAga25vd25Ub2tlbnMuZm9yRWFjaChrbm93blRva2VuID0+IHtcbiAgICAgICAgICAgIGlmIChrbm93blRva2VuLmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnN1YnN0cmluZygwLCBrbm93blRva2VuLnRva2VuLmluZGV4KSArXG4gICAgICAgICAgICAgICAgICAgICAgICBgPGltZyBzcmM9XCIke2tub3duVG9rZW4uaW1hZ2VVcmx9XCIvPmAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc3Vic3RyaW5nKGtub3duVG9rZW4udG9rZW4uaW5kZXggKyBrbm93blRva2VuLnRva2VuLnZhbHVlLmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgY2xlYW5VcCgpO1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHVwZGF0ZVRva2Vuc0ZvcklucHV0KTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHVwZGF0ZVRva2Vuc0ZvcklucHV0KTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgIGZvcm1Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgcHJvY2Vzc1ByZVN1Ym1pdCwgdHJ1ZSk7XG4gICAgLy8gSW4gY2FzZSB0aGUgaW5wdXQgaXMgc2ltcGx5IHJlbW92ZWQgZnJvbSB0aGUgRE9NIHdpdGhvdXRcbiAgICAvLyBiZWluZyBzdWJtaXR0ZWQsIGNsZWFuIHVwIHRvb1xuICAgIHZhciBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm11dGF0aW9uIGV2ZW50XCIsIGV2dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5wdXQub2Zmc2V0SGVpZ2h0XCIsIGlucHV0Lm9mZnNldEhlaWdodCk7XG4gICAgICAgIGlmIChldnRbMF0ucmVtb3ZlZE5vZGVzICYmXG4gICAgICAgICAgICBBcnJheS5mcm9tKGV2dFswXS5yZW1vdmVkTm9kZXMpLmluZGV4T2YoaW5wdXQpID4gLTEpIHtcbiAgICAgICAgICAgIGNsZWFuVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbnB1dC5vZmZzZXRIZWlnaHQgPT09IDApIHtcbiAgICAgICAgICAgIGNsZWFuVXAoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShmb3JtTm9kZSwgeyBjaGlsZExpc3Q6IHRydWUgfSk7XG4gICAgdXBkYXRlVG9rZW5zRm9ySW5wdXQoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBpbnB1dCxcbiAgICAgICAgcmVtb3ZlOiBjbGVhblVwXG4gICAgfTtcbn1cbmZpbmRUZXh0SW5wdXRzXzEuZGVmYXVsdChsaXN0ZW5Ub0lucHV0KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZ2V0Q2FyZXRDb29yZGluYXRlcyA9IHJlcXVpcmUoXCJ0ZXh0YXJlYS1jYXJldFwiKTtcbmNvbnN0IHNlYXJjaGVyXzEgPSByZXF1aXJlKFwiLi9zZWFyY2hlclwiKTtcbmNvbnN0IFRBR19DT05UQUlORVJfSUQgPSBcIl9fdGFnQ29udGFpbmVyXCI7XG5jb25zdCBURVhUX0hFSUdIVCA9IDE4O1xubGV0IHJlbW92ZU9wZW5JbWFnZSA9IG51bGw7XG5mdW5jdGlvbiBjcmVhdGVUb2tlblRhZyh0ZXh0SW5wdXQsIHRva2VuKSB7XG4gICAgY29uc3Qgc3RhcnRDb29yZHMgPSBnZXRDYXJldENvb3JkaW5hdGVzKHRleHRJbnB1dCwgdG9rZW4uaW5kZXgpO1xuICAgIGNvbnN0IGVuZENvb3JkcyA9IGdldENhcmV0Q29vcmRpbmF0ZXModGV4dElucHV0LCB0b2tlbi5pbmRleCArIHRva2VuLnZhbHVlLmxlbmd0aCArIDEpO1xuICAgIGxldCB0YWdDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChUQUdfQ09OVEFJTkVSX0lEKTtcbiAgICBpZiAoIXRhZ0NvbnRhaW5lcikge1xuICAgICAgICB0YWdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0YWdDb250YWluZXIuaWQgPSBUQUdfQ09OVEFJTkVSX0lEO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRhZ0NvbnRhaW5lcik7XG4gICAgfVxuICAgIGNvbnN0IHRhZ1VpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsZXQgaW1hZ2VVcmwgPSBudWxsO1xuICAgIGxldCBpbWFnZVVpID0gbnVsbDtcbiAgICB0YWdVaS5jbGFzc05hbWUgPSBcIl9fdG9rZW5UYWdcIjtcbiAgICB0YWdDb250YWluZXIuYXBwZW5kQ2hpbGQodGFnVWkpO1xuICAgIGZ1bmN0aW9uIHJlbW92ZUltYWdlKCkge1xuICAgICAgICB0YWdDb250YWluZXIucmVtb3ZlQ2hpbGQoaW1hZ2VVaSk7XG4gICAgICAgIGltYWdlVWkgPSBudWxsO1xuICAgICAgICBpZiAocmVtb3ZlT3BlbkltYWdlID09PSByZW1vdmVJbWFnZSkge1xuICAgICAgICAgICAgcmVtb3ZlT3BlbkltYWdlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0YWdVaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IHtcbiAgICAgICAgLy8gSWYgYSB1cmwgZXhpc3RzLCB0aGVuIHNob3cgdGhlIGltYWdlIGluIHRodW1uYWlsIGZvcm0uXG4gICAgICAgIC8vIElmIHRoZSB1cmwgZG9lcyBub3QgZXhpc3QsIG9wZW4gYSB0eXBlYWhlYWQgdG8gZmluZCB0aGVcbiAgICAgICAgLy8gaW1hZ2UgeW91IHdhbnQgKGxhdGVyei4uLilcbiAgICAgICAgaWYgKGltYWdlVXJsKSB7XG4gICAgICAgICAgICBpZiAoaW1hZ2VVaSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUltYWdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocmVtb3ZlT3BlbkltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU9wZW5JbWFnZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbWFnZVVpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgICAgICBpbWFnZVVpLmNsYXNzTmFtZSA9IFwiX190b2tlblRhZ1RodW1ibmFpbFwiO1xuICAgICAgICAgICAgICAgIGltYWdlVWkuc3JjID0gaW1hZ2VVcmw7XG4gICAgICAgICAgICAgICAgaW1hZ2VVaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVtb3ZlSW1hZ2UpO1xuICAgICAgICAgICAgICAgIHRhZ0NvbnRhaW5lci5hcHBlbmRDaGlsZChpbWFnZVVpKTtcbiAgICAgICAgICAgICAgICByZW1vdmVPcGVuSW1hZ2UgPSByZW1vdmVJbWFnZTtcbiAgICAgICAgICAgICAgICByZXBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBmdW5jdGlvbiByZXBvc2l0aW9uKCkge1xuICAgICAgICBjb25zdCByZWN0ID0gdGV4dElucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB0b3AgPSBURVhUX0hFSUdIVCArIHdpbmRvdy5zY3JvbGxZICsgcmVjdC50b3AgKyBzdGFydENvb3Jkcy50b3A7XG4gICAgICAgIGNvbnN0IGxlZnQgPSB3aW5kb3cuc2Nyb2xsWCArIHJlY3QubGVmdCArIHN0YXJ0Q29vcmRzLmxlZnQ7XG4gICAgICAgIHRhZ1VpLnN0eWxlLnRvcCA9IHRvcCArIFwicHhcIjtcbiAgICAgICAgdGFnVWkuc3R5bGUubGVmdCA9IGxlZnQgKyBcInB4XCI7XG4gICAgICAgIHRhZ1VpLnN0eWxlLndpZHRoID0gZW5kQ29vcmRzLmxlZnQgLSBzdGFydENvb3Jkcy5sZWZ0ICsgXCJweFwiO1xuICAgICAgICBpZiAoaW1hZ2VVaSkge1xuICAgICAgICAgICAgaW1hZ2VVaS5zdHlsZS50b3AgPSB0b3AgKyAyICsgXCJweFwiO1xuICAgICAgICAgICAgaW1hZ2VVaS5zdHlsZS5sZWZ0ID0gbGVmdCArIFwicHhcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVtb3ZlIGZvciBcIiwgdG9rZW4udmFsdWUsIHRhZ1VpKTtcbiAgICAgICAgdGFnVWkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWdVaSk7XG4gICAgICAgIGlmIChpbWFnZVVpKSB7XG4gICAgICAgICAgICBpbWFnZVVpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaW1hZ2VVaSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVwb3NpdGlvbigpO1xuICAgIGNvbnN0IHJlY29yZCA9IHtcbiAgICAgICAgaW5wdXQ6IHRleHRJbnB1dCxcbiAgICAgICAgcmVtb3ZlLFxuICAgICAgICByZXBvc2l0aW9uLFxuICAgICAgICB0b2tlbixcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIGltYWdlVXJsOiBudWxsXG4gICAgfTtcbiAgICBzZWFyY2hlcl8xLmRlZmF1bHQodG9rZW4udmFsdWUpLnRoZW4oKHVybCkgPT4ge1xuICAgICAgICByZWNvcmQuaW1hZ2VVcmwgPSBpbWFnZVVybCA9IHVybDtcbiAgICAgICAgcmVjb3JkLmlzVmFsaWQgPSAhIXVybDtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgdGFnVWkuY2xhc3NOYW1lICs9IFwiIGltYWdlRm91bmRcIjtcbiAgICAgICAgICAgIHRhZ1VpLnRpdGxlID0gYEdpdE1lbWUgZm9yIFwiJHt0b2tlbi52YWx1ZX1cImA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0YWdVaS5jbGFzc05hbWUgKz0gXCIgaW1hZ2VOb3RGb3VuZFwiO1xuICAgICAgICAgICAgdGFnVWkudGl0bGUgPSBgR2l0TWVtZTogTm8gaW1hZ2UgZm91bmQgZm9yIFwiJHt0b2tlbi52YWx1ZX1cImA7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVjb3JkO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlVG9rZW5UYWc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGdldFBhcmVudEJ5VGFnTmFtZShub2RlLCB0YWdOYW1lKSB7XG4gICAgbGV0IGZvdW5kTm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcbiAgICB3aGlsZSAoZm91bmROb2RlICYmIGZvdW5kTm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhZ05hbWUpIHtcbiAgICAgICAgZm91bmROb2RlID0gZm91bmROb2RlLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBmb3VuZE5vZGUgfHwgbnVsbDtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGdldFBhcmVudEJ5VGFnTmFtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLy8gRmluZCBhbGwgd29yZHMgYmVnaW5uaW5nIHdpdGggXCIvXCJcbmNvbnN0IHJlZ2V4ID0gLyg/PCFcXHcpXFwvXFx3Ky9nO1xuY29uc3QgY2hhclByZWZpeGVzID0ge1xuICAgIFwiXFxuXCI6IHRydWUsXG4gICAgXCJcXHRcIjogdHJ1ZSxcbiAgICBcIiBcIjogdHJ1ZVxufTtcbmZ1bmN0aW9uIHBhcnNlVG9rZW5zKHN0cikge1xuICAgIGNvbnN0IHJldCA9IFtdO1xuICAgIGxldCBtYXRjaDtcbiAgICBkbyB7XG4gICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhzdHIpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgZG9hYmxlIGluIHJlZ2V4LCBidXQgc2NyZXcgaXQuLi5cbiAgICAgICAgICAgIC8vIEZpbHRlciBpdCBvdXQgc28gdGhhdCBvbmx5IHRva2VucyB0aGF0IGFyZVxuICAgICAgICAgICAgLy8gLSBhdCB0aGUgc3RhcnQgb2YgYSBsaW5lXG4gICAgICAgICAgICAvLyAtIGFmdGVyIGEgc3BhY2Ugb3IgYSB0YWJcbiAgICAgICAgICAgIC8vIGFyZSB2YWxpZFxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBtYXRjaC5pbmRleDtcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gaW5kZXggPT09IDA7XG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsZXR0ZXJCZWZvcmUgPSBzdHIuY2hhckF0KGluZGV4IC0gMSk7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9ICEhY2hhclByZWZpeGVzW2xldHRlckJlZm9yZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IG1hdGNoLmluZGV4LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbWF0Y2hbMF0uc3Vic3RyaW5nKDEpLnRyaW0oKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSB3aGlsZSAobWF0Y2gpO1xuICAgIHJldHVybiByZXQ7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBwYXJzZVRva2VucztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBzZWFyY2hlcih0b2tlbikge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgICAgIGNhc2UgXCJmb29cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJodHRwczovL2pvaW5wcm9taXNlLmNvbS9hc3NldHMvbWVkaWEvTWVhc3VyZV9FZmZpY2FjeS5zdmdcIjtcbiAgICAgICAgICAgIGNhc2UgXCJiYXJcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJodHRwczovL3BheXRpY2tldC5pby9zdGF0aWMvaW1hZ2VzL2xvZ29zL2VwYV9sb2dvLmpwZ1wiO1xuICAgICAgICAgICAgY2FzZSBcInNoaXBpdFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBcImh0dHBzOi8vbWVkaWEuZ2lwaHkuY29tL21lZGlhLzc5cWYxTjRSSnRjOG8vZ2lwaHkuZ2lmXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBzZWFyY2hlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gZmluZFRleHRJbnB1dHMobGlzdGVuVG9JbnB1dCkge1xuICAgIGNvbnN0IGlkcyA9IFtcIm5ld19jb21tZW50X2ZpZWxkXCIsIFwiaXNzdWVfYm9keVwiXTtcbiAgICBjb25zdCBpbnB1dHNCeUlkID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGlkcy5tYXAoaWQgPT4gYCMke2lkfWApLmpvaW4oXCIsXCIpKSk7XG4gICAgY29uc29sZS5sb2coXCJpbnB1dHNCeUlkXCIsIGlucHV0c0J5SWQpO1xuICAgIGNvbnN0IGFsbElucHV0cyA9IGlucHV0c0J5SWQ7XG4gICAgbGV0IGxpc3RlbmVycyA9IGFsbElucHV0cy5tYXAobGlzdGVuVG9JbnB1dCk7XG4gICAgLy8gTGlzdGVuIHRvIGFueSBsYXppbHkgY3JlYXRlZCB0ZXh0IGFyZWFzIHRvb1xuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzaW5cIiwgKGV2dCkgPT4ge1xuICAgICAgICBjb25zdCBub2RlID0gZXZ0LnRhcmdldDtcbiAgICAgICAgY29uc3QgdGFnTmFtZSA9IG5vZGUudGFnTmFtZTtcbiAgICAgICAgaWYgKHRhZ05hbWUgJiZcbiAgICAgICAgICAgIHRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0ZXh0YXJlYVwiICYmXG4gICAgICAgICAgICAhbGlzdGVuZXJzLnNvbWUobGlzdGVuZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lci5pbnB1dCA9PT0gbm9kZTtcbiAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5Ub0lucHV0KG5vZGUpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgbmV3TGlzdGVuZXJzID0gdmFsaWRhdGVMaXN0ZW5lcnMobGlzdGVuZXJzKTtcbiAgICAgICAgaWYgKG5ld0xpc3RlbmVycy5sZW5ndGggIT09IGxpc3RlbmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IG5ld0xpc3RlbmVycztcbiAgICAgICAgfVxuICAgIH0sIDIwMCk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBmaW5kVGV4dElucHV0cztcbmZ1bmN0aW9uIHZhbGlkYXRlTGlzdGVuZXJzKGxpc3RlbmVycykge1xuICAgIGNvbnN0IG5ld0xpc3RlbmVycyA9IGxpc3RlbmVycy5maWx0ZXIobGlzdGVuZXIgPT4ge1xuICAgICAgICAvLyBBIE5vZGUncyBvZmZzZXRQYXJlbnQgaXMgbnVsbCBpZiBpdCBvciBhbnkgb2YgaXRzXG4gICAgICAgIC8vIHBhcmVudCBub2RlcyBhcmUgaGlkZGVuLiAgSGFuZHkhXG4gICAgICAgIGlmICghbGlzdGVuZXIuaW5wdXQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNsZWFuaW5nIHVwXCIsIGxpc3RlbmVyLmlucHV0KTtcbiAgICAgICAgICAgIGxpc3RlbmVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHJldHVybiBuZXdMaXN0ZW5lcnM7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucylcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IERhdGUubm93KCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpXG4gICAgICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKVxuICAgICAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghdGltZW91dClcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IHRocm90dGxlO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==