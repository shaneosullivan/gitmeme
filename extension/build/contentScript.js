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
        if (record.imageUrl) {
            tagUi.classList.add("imageFound");
            title = `GitMeme for "${token.value}"`;
        }
        else {
            tagUi.classList.remove("imageNotFound");
            title = `GitMeme for "${token.value}"`;
        }
        if (record.disabled) {
            tagUi.classList.add("disabled");
            title = `GitMeme image disabled`;
        }
        else {
            tagUi.classList.remove("disabled");
        }
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
        disabled: false
    };
    searcher_1.default(token.value).then((url) => {
        record.imageUrl = url;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RleHRhcmVhLWNhcmV0L2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jb250ZW50U2NyaXB0LnRzIiwid2VicGFjazovLy8uL3NyYy9jcmVhdGVUb2tlblRhZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2V0UGFyZW50QnlUYWdOYW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZVRva2Vucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VhcmNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvZmluZFRleHRJbnB1dHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvdGhyb3R0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBOztBQUVBOztBQUVBO0FBQ0E7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Ozs7O0FDeEJhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBLDhFQUE4RSxHQUFHO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOzs7Ozs7Ozs7Ozs7O0FDeENhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29udGVudFNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvbnRlbnRTY3JpcHQudHNcIik7XG4iLCIvKiBqc2hpbnQgYnJvd3NlcjogdHJ1ZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4vLyBXZSdsbCBjb3B5IHRoZSBwcm9wZXJ0aWVzIGJlbG93IGludG8gdGhlIG1pcnJvciBkaXYuXG4vLyBOb3RlIHRoYXQgc29tZSBicm93c2Vycywgc3VjaCBhcyBGaXJlZm94LCBkbyBub3QgY29uY2F0ZW5hdGUgcHJvcGVydGllc1xuLy8gaW50byB0aGVpciBzaG9ydGhhbmQgKGUuZy4gcGFkZGluZy10b3AsIHBhZGRpbmctYm90dG9tIGV0Yy4gLT4gcGFkZGluZyksXG4vLyBzbyB3ZSBoYXZlIHRvIGxpc3QgZXZlcnkgc2luZ2xlIHByb3BlcnR5IGV4cGxpY2l0bHkuXG52YXIgcHJvcGVydGllcyA9IFtcbiAgJ2RpcmVjdGlvbicsICAvLyBSVEwgc3VwcG9ydFxuICAnYm94U2l6aW5nJyxcbiAgJ3dpZHRoJywgIC8vIG9uIENocm9tZSBhbmQgSUUsIGV4Y2x1ZGUgdGhlIHNjcm9sbGJhciwgc28gdGhlIG1pcnJvciBkaXYgd3JhcHMgZXhhY3RseSBhcyB0aGUgdGV4dGFyZWEgZG9lc1xuICAnaGVpZ2h0JyxcbiAgJ292ZXJmbG93WCcsXG4gICdvdmVyZmxvd1knLCAgLy8gY29weSB0aGUgc2Nyb2xsYmFyIGZvciBJRVxuXG4gICdib3JkZXJUb3BXaWR0aCcsXG4gICdib3JkZXJSaWdodFdpZHRoJyxcbiAgJ2JvcmRlckJvdHRvbVdpZHRoJyxcbiAgJ2JvcmRlckxlZnRXaWR0aCcsXG4gICdib3JkZXJTdHlsZScsXG5cbiAgJ3BhZGRpbmdUb3AnLFxuICAncGFkZGluZ1JpZ2h0JyxcbiAgJ3BhZGRpbmdCb3R0b20nLFxuICAncGFkZGluZ0xlZnQnLFxuXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9mb250XG4gICdmb250U3R5bGUnLFxuICAnZm9udFZhcmlhbnQnLFxuICAnZm9udFdlaWdodCcsXG4gICdmb250U3RyZXRjaCcsXG4gICdmb250U2l6ZScsXG4gICdmb250U2l6ZUFkanVzdCcsXG4gICdsaW5lSGVpZ2h0JyxcbiAgJ2ZvbnRGYW1pbHknLFxuXG4gICd0ZXh0QWxpZ24nLFxuICAndGV4dFRyYW5zZm9ybScsXG4gICd0ZXh0SW5kZW50JyxcbiAgJ3RleHREZWNvcmF0aW9uJywgIC8vIG1pZ2h0IG5vdCBtYWtlIGEgZGlmZmVyZW5jZSwgYnV0IGJldHRlciBiZSBzYWZlXG5cbiAgJ2xldHRlclNwYWNpbmcnLFxuICAnd29yZFNwYWNpbmcnLFxuXG4gICd0YWJTaXplJyxcbiAgJ01velRhYlNpemUnXG5cbl07XG5cbnZhciBpc0Jyb3dzZXIgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpO1xudmFyIGlzRmlyZWZveCA9IChpc0Jyb3dzZXIgJiYgd2luZG93Lm1veklubmVyU2NyZWVuWCAhPSBudWxsKTtcblxuZnVuY3Rpb24gZ2V0Q2FyZXRDb29yZGluYXRlcyhlbGVtZW50LCBwb3NpdGlvbiwgb3B0aW9ucykge1xuICBpZiAoIWlzQnJvd3Nlcikge1xuICAgIHRocm93IG5ldyBFcnJvcigndGV4dGFyZWEtY2FyZXQtcG9zaXRpb24jZ2V0Q2FyZXRDb29yZGluYXRlcyBzaG91bGQgb25seSBiZSBjYWxsZWQgaW4gYSBicm93c2VyJyk7XG4gIH1cblxuICB2YXIgZGVidWcgPSBvcHRpb25zICYmIG9wdGlvbnMuZGVidWcgfHwgZmFsc2U7XG4gIGlmIChkZWJ1Zykge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2Jyk7XG4gICAgaWYgKGVsKSBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgfVxuXG4gIC8vIFRoZSBtaXJyb3IgZGl2IHdpbGwgcmVwbGljYXRlIHRoZSB0ZXh0YXJlYSdzIHN0eWxlXG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlkID0gJ2lucHV0LXRleHRhcmVhLWNhcmV0LXBvc2l0aW9uLW1pcnJvci1kaXYnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgdmFyIHN0eWxlID0gZGl2LnN0eWxlO1xuICB2YXIgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpIDogZWxlbWVudC5jdXJyZW50U3R5bGU7ICAvLyBjdXJyZW50U3R5bGUgZm9yIElFIDwgOVxuICB2YXIgaXNJbnB1dCA9IGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCc7XG5cbiAgLy8gRGVmYXVsdCB0ZXh0YXJlYSBzdHlsZXNcbiAgc3R5bGUud2hpdGVTcGFjZSA9ICdwcmUtd3JhcCc7XG4gIGlmICghaXNJbnB1dClcbiAgICBzdHlsZS53b3JkV3JhcCA9ICdicmVhay13b3JkJzsgIC8vIG9ubHkgZm9yIHRleHRhcmVhLXNcblxuICAvLyBQb3NpdGlvbiBvZmYtc2NyZWVuXG4gIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJzsgIC8vIHJlcXVpcmVkIHRvIHJldHVybiBjb29yZGluYXRlcyBwcm9wZXJseVxuICBpZiAoIWRlYnVnKVxuICAgIHN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJzsgIC8vIG5vdCAnZGlzcGxheTogbm9uZScgYmVjYXVzZSB3ZSB3YW50IHJlbmRlcmluZ1xuXG4gIC8vIFRyYW5zZmVyIHRoZSBlbGVtZW50J3MgcHJvcGVydGllcyB0byB0aGUgZGl2XG4gIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgIGlmIChpc0lucHV0ICYmIHByb3AgPT09ICdsaW5lSGVpZ2h0Jykge1xuICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciA8aW5wdXQ+cyBiZWNhdXNlIHRleHQgaXMgcmVuZGVyZWQgY2VudGVyZWQgYW5kIGxpbmUgaGVpZ2h0IG1heSBiZSAhPSBoZWlnaHRcbiAgICAgIHN0eWxlLmxpbmVIZWlnaHQgPSBjb21wdXRlZC5oZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlW3Byb3BdID0gY29tcHV0ZWRbcHJvcF07XG4gICAgfVxuICB9KTtcblxuICBpZiAoaXNGaXJlZm94KSB7XG4gICAgLy8gRmlyZWZveCBsaWVzIGFib3V0IHRoZSBvdmVyZmxvdyBwcm9wZXJ0eSBmb3IgdGV4dGFyZWFzOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD05ODQyNzVcbiAgICBpZiAoZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJzZUludChjb21wdXRlZC5oZWlnaHQpKVxuICAgICAgc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJzsgIC8vIGZvciBDaHJvbWUgdG8gbm90IHJlbmRlciBhIHNjcm9sbGJhcjsgSUUga2VlcHMgb3ZlcmZsb3dZID0gJ3Njcm9sbCdcbiAgfVxuXG4gIGRpdi50ZXh0Q29udGVudCA9IGVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKDAsIHBvc2l0aW9uKTtcbiAgLy8gVGhlIHNlY29uZCBzcGVjaWFsIGhhbmRsaW5nIGZvciBpbnB1dCB0eXBlPVwidGV4dFwiIHZzIHRleHRhcmVhOlxuICAvLyBzcGFjZXMgbmVlZCB0byBiZSByZXBsYWNlZCB3aXRoIG5vbi1icmVha2luZyBzcGFjZXMgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMzQwMjAzNS8xMjY5MDM3XG4gIGlmIChpc0lucHV0KVxuICAgIGRpdi50ZXh0Q29udGVudCA9IGRpdi50ZXh0Q29udGVudC5yZXBsYWNlKC9cXHMvZywgJ1xcdTAwYTAnKTtcblxuICB2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgLy8gV3JhcHBpbmcgbXVzdCBiZSByZXBsaWNhdGVkICpleGFjdGx5KiwgaW5jbHVkaW5nIHdoZW4gYSBsb25nIHdvcmQgZ2V0c1xuICAvLyBvbnRvIHRoZSBuZXh0IGxpbmUsIHdpdGggd2hpdGVzcGFjZSBhdCB0aGUgZW5kIG9mIHRoZSBsaW5lIGJlZm9yZSAoIzcpLlxuICAvLyBUaGUgICpvbmx5KiByZWxpYWJsZSB3YXkgdG8gZG8gdGhhdCBpcyB0byBjb3B5IHRoZSAqZW50aXJlKiByZXN0IG9mIHRoZVxuICAvLyB0ZXh0YXJlYSdzIGNvbnRlbnQgaW50byB0aGUgPHNwYW4+IGNyZWF0ZWQgYXQgdGhlIGNhcmV0IHBvc2l0aW9uLlxuICAvLyBGb3IgaW5wdXRzLCBqdXN0ICcuJyB3b3VsZCBiZSBlbm91Z2gsIGJ1dCBubyBuZWVkIHRvIGJvdGhlci5cbiAgc3Bhbi50ZXh0Q29udGVudCA9IGVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKHBvc2l0aW9uKSB8fCAnLic7ICAvLyB8fCBiZWNhdXNlIGEgY29tcGxldGVseSBlbXB0eSBmYXV4IHNwYW4gZG9lc24ndCByZW5kZXIgYXQgYWxsXG4gIGRpdi5hcHBlbmRDaGlsZChzcGFuKTtcblxuICB2YXIgY29vcmRpbmF0ZXMgPSB7XG4gICAgdG9wOiBzcGFuLm9mZnNldFRvcCArIHBhcnNlSW50KGNvbXB1dGVkWydib3JkZXJUb3BXaWR0aCddKSxcbiAgICBsZWZ0OiBzcGFuLm9mZnNldExlZnQgKyBwYXJzZUludChjb21wdXRlZFsnYm9yZGVyTGVmdFdpZHRoJ10pLFxuICAgIGhlaWdodDogcGFyc2VJbnQoY29tcHV0ZWRbJ2xpbmVIZWlnaHQnXSlcbiAgfTtcblxuICBpZiAoZGVidWcpIHtcbiAgICBzcGFuLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjYWFhJztcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRpdik7XG4gIH1cblxuICByZXR1cm4gY29vcmRpbmF0ZXM7XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGdldENhcmV0Q29vcmRpbmF0ZXM7XG59IGVsc2UgaWYoaXNCcm93c2VyKSB7XG4gIHdpbmRvdy5nZXRDYXJldENvb3JkaW5hdGVzID0gZ2V0Q2FyZXRDb29yZGluYXRlcztcbn1cblxufSgpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcGFyc2VUb2tlbnNfMSA9IHJlcXVpcmUoXCIuL3BhcnNlVG9rZW5zXCIpO1xuY29uc3QgY3JlYXRlVG9rZW5UYWdfMSA9IHJlcXVpcmUoXCIuL2NyZWF0ZVRva2VuVGFnXCIpO1xuY29uc3QgdGhyb3R0bGVfMSA9IHJlcXVpcmUoXCIuL3V0aWwvdGhyb3R0bGVcIik7XG5jb25zdCBnZXRQYXJlbnRCeVRhZ05hbWVfMSA9IHJlcXVpcmUoXCIuL2dldFBhcmVudEJ5VGFnTmFtZVwiKTtcbmNvbnN0IGZpbmRUZXh0SW5wdXRzXzEgPSByZXF1aXJlKFwiLi91dGlsL2ZpbmRUZXh0SW5wdXRzXCIpO1xuZnVuY3Rpb24gbGlzdGVuVG9JbnB1dChpbnB1dCkge1xuICAgIGxldCBrbm93blRva2VucyA9IFtdO1xuICAgIGNvbnN0IHVwZGF0ZVRva2Vuc0ZvcklucHV0ID0gdGhyb3R0bGVfMS5kZWZhdWx0KCgpID0+IHtcbiAgICAgICAgbGV0IHRva2VucyA9IHBhcnNlVG9rZW5zXzEuZGVmYXVsdChpbnB1dC52YWx1ZSk7XG4gICAgICAgIGlmICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gRmlsdGVyIHRoZSB0b2tlbnMgdGhhdCB3ZSBhbHJlYWR5IGtub3cgYWJvdXRcbiAgICAgICAgICAgIGNvbnN0IHVua25vd25Ub2tlbnMgPSB0b2tlbnMuZmlsdGVyKHRva2VuID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWtub3duVG9rZW5zLnNvbWUoa25vd25Ub2tlbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoa25vd25Ub2tlbi50b2tlbi5pbmRleCA9PT0gdG9rZW4uaW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGtub3duVG9rZW4udG9rZW4udmFsdWUgPT09IHRva2VuLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdW5rbm93blRva2Vucy5mb3JFYWNoKHRva2VuID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlblRhZyA9IGNyZWF0ZVRva2VuVGFnXzEuZGVmYXVsdChpbnB1dCwgdG9rZW4pO1xuICAgICAgICAgICAgICAgIGtub3duVG9rZW5zLnB1c2godG9rZW5UYWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVtb3ZlIGFueSB0b2tlbnMgdGhhdCBhcmUgbm8gbG9uZ2VyIHZhbGlkXG4gICAgICAgIGtub3duVG9rZW5zID0ga25vd25Ub2tlbnMuZmlsdGVyKGtub3duVG9rZW4gPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RpbGxFeGlzdHMgPSB0b2tlbnMuc29tZShuZXdUb2tlbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChrbm93blRva2VuLnRva2VuLmluZGV4ID09PSBuZXdUb2tlbi5pbmRleCAmJlxuICAgICAgICAgICAgICAgICAgICBrbm93blRva2VuLnRva2VuLnZhbHVlID09PSBuZXdUb2tlbi52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghc3RpbGxFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBrbm93blRva2VuLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0aWxsRXhpc3RzO1xuICAgICAgICB9KTtcbiAgICB9LCAyMDApO1xuICAgIGxldCBmb3JtTm9kZSA9IGdldFBhcmVudEJ5VGFnTmFtZV8xLmRlZmF1bHQoaW5wdXQsIFwiZm9ybVwiKTtcbiAgICBmdW5jdGlvbiBjbGVhblVwKCkge1xuICAgICAgICBrbm93blRva2Vucy5mb3JFYWNoKGtub3duVG9rZW4gPT4ge1xuICAgICAgICAgICAga25vd25Ub2tlbi5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGtub3duVG9rZW5zID0gW107XG4gICAgICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB1cGRhdGVUb2tlbnNGb3JJbnB1dCk7XG4gICAgICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgICAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgICAgICBmb3JtTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIHByb2Nlc3NQcmVTdWJtaXQsIHRydWUpO1xuICAgIH1cbiAgICAvLyBSZXBsYWNlIGFsbCB0aGUgdG9rZW5zIHdpdGggaW1hZ2UgdGFnc1xuICAgIGZ1bmN0aW9uIHByb2Nlc3NQcmVTdWJtaXQoZXZ0KSB7XG4gICAgICAgIC8vIFByb2Nlc3MgdGhlIHRva2VucyBmcm9tIHRoZSBsYXN0IHRvIHRoZSBmaXJzdCwgc28gdGhhdFxuICAgICAgICAvLyB3ZSBjYW4gbW9kaWZ5IHRoZSB0ZXh0IGNvbnRlbnRzIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICAgIC8vIGluZGV4IHBvc2l0aW9ucyBvZiB0b2tlbnMgYmVmb3JlIHdlIHByb2Nlc3MgdGhlbVxuICAgICAgICBrbm93blRva2Vucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS50b2tlbi5pbmRleCA+IGIudG9rZW4uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChiLnRva2VuLmluZGV4ID4gYS50b2tlbi5pbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAga25vd25Ub2tlbnMuZm9yRWFjaChrbm93blRva2VuID0+IHtcbiAgICAgICAgICAgIGlmIChrbm93blRva2VuLmlzVmFsaWQgJiYgIWtub3duVG9rZW4uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnN1YnN0cmluZygwLCBrbm93blRva2VuLnRva2VuLmluZGV4KSArXG4gICAgICAgICAgICAgICAgICAgICAgICBgPGltZyBzcmM9XCIke2tub3duVG9rZW4uaW1hZ2VVcmx9XCIgdGl0bGU9XCJDcmVhdGVkIGJ5IGdpdG1lLm1lIHdpdGggLyR7a25vd25Ub2tlbi50b2tlbi52YWx1ZX1cIi8+YCArXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zdWJzdHJpbmcoa25vd25Ub2tlbi50b2tlbi5pbmRleCArIGtub3duVG9rZW4udG9rZW4udmFsdWUubGVuZ3RoICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBjbGVhblVwKCk7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdXBkYXRlVG9rZW5zRm9ySW5wdXQpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCB1cGRhdGVUb2tlbnNGb3JJbnB1dCk7XG4gICAgZm9ybU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBwcm9jZXNzUHJlU3VibWl0LCB0cnVlKTtcbiAgICAvLyBJbiBjYXNlIHRoZSBpbnB1dCBpcyBzaW1wbHkgcmVtb3ZlZCBmcm9tIHRoZSBET00gd2l0aG91dFxuICAgIC8vIGJlaW5nIHN1Ym1pdHRlZCwgY2xlYW4gdXAgdG9vXG4gICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibXV0YXRpb24gZXZlbnRcIiwgZXZ0KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnB1dC5vZmZzZXRIZWlnaHRcIiwgaW5wdXQub2Zmc2V0SGVpZ2h0KTtcbiAgICAgICAgaWYgKGV2dFswXS5yZW1vdmVkTm9kZXMgJiZcbiAgICAgICAgICAgIEFycmF5LmZyb20oZXZ0WzBdLnJlbW92ZWROb2RlcykuaW5kZXhPZihpbnB1dCkgPiAtMSkge1xuICAgICAgICAgICAgY2xlYW5VcCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlucHV0Lm9mZnNldEhlaWdodCA9PT0gMCkge1xuICAgICAgICAgICAgY2xlYW5VcCgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGZvcm1Ob2RlLCB7IGNoaWxkTGlzdDogdHJ1ZSB9KTtcbiAgICB1cGRhdGVUb2tlbnNGb3JJbnB1dCgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGlucHV0LFxuICAgICAgICByZW1vdmU6IGNsZWFuVXBcbiAgICB9O1xufVxuZmluZFRleHRJbnB1dHNfMS5kZWZhdWx0KGxpc3RlblRvSW5wdXQpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBnZXRDYXJldENvb3JkaW5hdGVzID0gcmVxdWlyZShcInRleHRhcmVhLWNhcmV0XCIpO1xuY29uc3Qgc2VhcmNoZXJfMSA9IHJlcXVpcmUoXCIuL3NlYXJjaGVyXCIpO1xuY29uc3QgVEFHX0NPTlRBSU5FUl9JRCA9IFwiX190YWdDb250YWluZXJcIjtcbmNvbnN0IFRFWFRfSEVJR0hUID0gMTg7XG5sZXQgcmVtb3ZlT3BlbkltYWdlID0gbnVsbDtcbmZ1bmN0aW9uIGNyZWF0ZVRva2VuVGFnKHRleHRJbnB1dCwgdG9rZW4pIHtcbiAgICBjb25zdCBzdGFydENvb3JkcyA9IGdldENhcmV0Q29vcmRpbmF0ZXModGV4dElucHV0LCB0b2tlbi5pbmRleCk7XG4gICAgY29uc3QgZW5kQ29vcmRzID0gZ2V0Q2FyZXRDb29yZGluYXRlcyh0ZXh0SW5wdXQsIHRva2VuLmluZGV4ICsgdG9rZW4udmFsdWUubGVuZ3RoICsgMSk7XG4gICAgbGV0IHRhZ0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFRBR19DT05UQUlORVJfSUQpO1xuICAgIGlmICghdGFnQ29udGFpbmVyKSB7XG4gICAgICAgIHRhZ0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRhZ0NvbnRhaW5lci5pZCA9IFRBR19DT05UQUlORVJfSUQ7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGFnQ29udGFpbmVyKTtcbiAgICB9XG4gICAgY29uc3QgdGFnVWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGxldCBpbWFnZVVpID0gbnVsbDtcbiAgICB0YWdVaS5jbGFzc05hbWUgPSBcIl9fdG9rZW5UYWdcIjtcbiAgICB0YWdDb250YWluZXIuYXBwZW5kQ2hpbGQodGFnVWkpO1xuICAgIGZ1bmN0aW9uIHJlbW92ZUltYWdlKCkge1xuICAgICAgICBpZiAoaW1hZ2VVaSAmJiBpbWFnZVVpLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGltYWdlVWkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpbWFnZVVpKTtcbiAgICAgICAgfVxuICAgICAgICBpbWFnZVVpID0gbnVsbDtcbiAgICAgICAgaWYgKHJlbW92ZU9wZW5JbWFnZSA9PT0gcmVtb3ZlSW1hZ2UpIHtcbiAgICAgICAgICAgIHJlbW92ZU9wZW5JbWFnZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlVGFnVWkoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZGlzYWJsZUltYWdlKCkge1xuICAgICAgICByZWNvcmQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICByZW1vdmVJbWFnZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbmFibGVJbWFnZSgpIHtcbiAgICAgICAgcmVjb3JkLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJlbW92ZUltYWdlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRhZ1VpKCkge1xuICAgICAgICBsZXQgdGl0bGUgPSBcIlwiO1xuICAgICAgICBpZiAocmVjb3JkLmltYWdlVXJsKSB7XG4gICAgICAgICAgICB0YWdVaS5jbGFzc0xpc3QuYWRkKFwiaW1hZ2VGb3VuZFwiKTtcbiAgICAgICAgICAgIHRpdGxlID0gYEdpdE1lbWUgZm9yIFwiJHt0b2tlbi52YWx1ZX1cImA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0YWdVaS5jbGFzc0xpc3QucmVtb3ZlKFwiaW1hZ2VOb3RGb3VuZFwiKTtcbiAgICAgICAgICAgIHRpdGxlID0gYEdpdE1lbWUgZm9yIFwiJHt0b2tlbi52YWx1ZX1cImA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlY29yZC5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGFnVWkuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgdGl0bGUgPSBgR2l0TWVtZSBpbWFnZSBkaXNhYmxlZGA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0YWdVaS5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGFnVWkudGl0bGUgPSB0aXRsZTtcbiAgICB9XG4gICAgdGFnVWkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2dCA9PiB7XG4gICAgICAgIC8vIElmIGEgdXJsIGV4aXN0cywgdGhlbiBzaG93IHRoZSBpbWFnZSBpbiB0aHVtbmFpbCBmb3JtLlxuICAgICAgICAvLyBJZiB0aGUgdXJsIGRvZXMgbm90IGV4aXN0LCBvcGVuIGEgdHlwZWFoZWFkIHRvIGZpbmQgdGhlXG4gICAgICAgIC8vIGltYWdlIHlvdSB3YW50IChsYXRlcnouLi4pXG4gICAgICAgIGlmIChyZWNvcmQuaW1hZ2VVcmwpIHtcbiAgICAgICAgICAgIGlmIChpbWFnZVVpKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlSW1hZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZW1vdmVPcGVuSW1hZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlT3BlbkltYWdlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGltYWdlVWkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGltYWdlVWkuY2xhc3NOYW1lID0gXCJfX3Rva2VuVGFnVGh1bWJuYWlsXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2VOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgICAgICBpbWFnZU5vZGUuc3JjID0gcmVjb3JkLmltYWdlVXJsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgIHJlbW92ZUJ1dHRvbk5vZGUudGV4dENvbnRlbnQgPSByZWNvcmQuZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgPyBcIkVuYWJsZSBUYWdcIlxuICAgICAgICAgICAgICAgICAgICA6IFwiRGlzYWJsZSBUYWdcIjtcbiAgICAgICAgICAgICAgICBpbWFnZVVpLmFwcGVuZENoaWxkKGltYWdlTm9kZSk7XG4gICAgICAgICAgICAgICAgaW1hZ2VVaS5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b25Ob2RlKTtcbiAgICAgICAgICAgICAgICBpbWFnZU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92ZUltYWdlKTtcbiAgICAgICAgICAgICAgICByZW1vdmVCdXR0b25Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZWNvcmQuZGlzYWJsZWQgPyBlbmFibGVJbWFnZSA6IGRpc2FibGVJbWFnZSk7XG4gICAgICAgICAgICAgICAgdGFnQ29udGFpbmVyLmFwcGVuZENoaWxkKGltYWdlVWkpO1xuICAgICAgICAgICAgICAgIHJlbW92ZU9wZW5JbWFnZSA9IHJlbW92ZUltYWdlO1xuICAgICAgICAgICAgICAgIHJlcG9zaXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGZ1bmN0aW9uIHJlcG9zaXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSB0ZXh0SW5wdXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHRvcCA9IFRFWFRfSEVJR0hUICsgd2luZG93LnNjcm9sbFkgKyByZWN0LnRvcCArIHN0YXJ0Q29vcmRzLnRvcDtcbiAgICAgICAgY29uc3QgbGVmdCA9IHdpbmRvdy5zY3JvbGxYICsgcmVjdC5sZWZ0ICsgc3RhcnRDb29yZHMubGVmdDtcbiAgICAgICAgdGFnVWkuc3R5bGUudG9wID0gdG9wICsgXCJweFwiO1xuICAgICAgICB0YWdVaS5zdHlsZS5sZWZ0ID0gbGVmdCArIFwicHhcIjtcbiAgICAgICAgdGFnVWkuc3R5bGUud2lkdGggPSBlbmRDb29yZHMubGVmdCAtIHN0YXJ0Q29vcmRzLmxlZnQgKyBcInB4XCI7XG4gICAgICAgIGlmIChpbWFnZVVpKSB7XG4gICAgICAgICAgICBpbWFnZVVpLnN0eWxlLnRvcCA9IHRvcCArIDIgKyBcInB4XCI7XG4gICAgICAgICAgICBpbWFnZVVpLnN0eWxlLmxlZnQgPSBsZWZ0ICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgdGFnVWkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWdVaSk7XG4gICAgICAgIHJlbW92ZUltYWdlKCk7XG4gICAgfVxuICAgIHJlcG9zaXRpb24oKTtcbiAgICBjb25zdCByZWNvcmQgPSB7XG4gICAgICAgIGlucHV0OiB0ZXh0SW5wdXQsXG4gICAgICAgIHJlbW92ZSxcbiAgICAgICAgcmVwb3NpdGlvbixcbiAgICAgICAgdG9rZW4sXG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBpbWFnZVVybDogbnVsbCxcbiAgICAgICAgZGlzYWJsZWQ6IGZhbHNlXG4gICAgfTtcbiAgICBzZWFyY2hlcl8xLmRlZmF1bHQodG9rZW4udmFsdWUpLnRoZW4oKHVybCkgPT4ge1xuICAgICAgICByZWNvcmQuaW1hZ2VVcmwgPSB1cmw7XG4gICAgICAgIHJlY29yZC5pc1ZhbGlkID0gISF1cmw7XG4gICAgICAgIHVwZGF0ZVRhZ1VpKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlY29yZDtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZVRva2VuVGFnO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBnZXRQYXJlbnRCeVRhZ05hbWUobm9kZSwgdGFnTmFtZSkge1xuICAgIGxldCBmb3VuZE5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKGZvdW5kTm9kZSAmJiBmb3VuZE5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWdOYW1lKSB7XG4gICAgICAgIGZvdW5kTm9kZSA9IGZvdW5kTm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gZm91bmROb2RlIHx8IG51bGw7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBnZXRQYXJlbnRCeVRhZ05hbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8vIEZpbmQgYWxsIHdvcmRzIGJlZ2lubmluZyB3aXRoIFwiL1wiXG5jb25zdCByZWdleCA9IC8oPzwhXFx3KVxcL1xcdysvZztcbmNvbnN0IGNoYXJQcmVmaXhlcyA9IHtcbiAgICBcIlxcblwiOiB0cnVlLFxuICAgIFwiXFx0XCI6IHRydWUsXG4gICAgXCIgXCI6IHRydWVcbn07XG5mdW5jdGlvbiBwYXJzZVRva2VucyhzdHIpIHtcbiAgICBjb25zdCByZXQgPSBbXTtcbiAgICBsZXQgbWF0Y2g7XG4gICAgZG8ge1xuICAgICAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIHByb2JhYmx5IGRvYWJsZSBpbiByZWdleCwgYnV0IHNjcmV3IGl0Li4uXG4gICAgICAgICAgICAvLyBGaWx0ZXIgaXQgb3V0IHNvIHRoYXQgb25seSB0b2tlbnMgdGhhdCBhcmVcbiAgICAgICAgICAgIC8vIC0gYXQgdGhlIHN0YXJ0IG9mIGEgbGluZVxuICAgICAgICAgICAgLy8gLSBhZnRlciBhIHNwYWNlIG9yIGEgdGFiXG4gICAgICAgICAgICAvLyBhcmUgdmFsaWRcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbWF0Y2guaW5kZXg7XG4gICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGluZGV4ID09PSAwO1xuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGV0dGVyQmVmb3JlID0gc3RyLmNoYXJBdChpbmRleCAtIDEpO1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSAhIWNoYXJQcmVmaXhlc1tsZXR0ZXJCZWZvcmVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBtYXRjaC5pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG1hdGNoWzBdLnN1YnN0cmluZygxKS50cmltKClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gd2hpbGUgKG1hdGNoKTtcbiAgICByZXR1cm4gcmV0O1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gcGFyc2VUb2tlbnM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gc2VhcmNoZXIodG9rZW4pIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAgICAgICBjYXNlIFwiZm9vXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiaHR0cHM6Ly9qb2lucHJvbWlzZS5jb20vYXNzZXRzL21lZGlhL01lYXN1cmVfRWZmaWNhY3kuc3ZnXCI7XG4gICAgICAgICAgICBjYXNlIFwiYmFyXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiaHR0cHM6Ly9wYXl0aWNrZXQuaW8vc3RhdGljL2ltYWdlcy9sb2dvcy9lcGFfbG9nby5qcGdcIjtcbiAgICAgICAgICAgIGNhc2UgXCJzaGlwaXRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJodHRwczovL21lZGlhLmdpcGh5LmNvbS9tZWRpYS83OXFmMU40Ukp0YzhvL2dpcGh5LmdpZlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gc2VhcmNoZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGZpbmRUZXh0SW5wdXRzKGxpc3RlblRvSW5wdXQpIHtcbiAgICBjb25zdCBpZHMgPSBbXCJuZXdfY29tbWVudF9maWVsZFwiLCBcImlzc3VlX2JvZHlcIl07XG4gICAgY29uc3QgaW5wdXRzQnlJZCA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChpZHMubWFwKGlkID0+IGAjJHtpZH1gKS5qb2luKFwiLFwiKSkpO1xuICAgIGNvbnNvbGUubG9nKFwiaW5wdXRzQnlJZFwiLCBpbnB1dHNCeUlkKTtcbiAgICBjb25zdCBhbGxJbnB1dHMgPSBpbnB1dHNCeUlkO1xuICAgIGxldCBsaXN0ZW5lcnMgPSBhbGxJbnB1dHMubWFwKGxpc3RlblRvSW5wdXQpO1xuICAgIC8vIExpc3RlbiB0byBhbnkgbGF6aWx5IGNyZWF0ZWQgdGV4dCBhcmVhcyB0b29cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c2luXCIsIChldnQpID0+IHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGV2dC50YXJnZXQ7XG4gICAgICAgIGNvbnN0IHRhZ05hbWUgPSBub2RlLnRhZ05hbWU7XG4gICAgICAgIGlmICh0YWdOYW1lICYmXG4gICAgICAgICAgICB0YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwidGV4dGFyZWFcIiAmJlxuICAgICAgICAgICAgIWxpc3RlbmVycy5zb21lKGxpc3RlbmVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdGVuZXIuaW5wdXQgPT09IG5vZGU7XG4gICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuVG9JbnB1dChub2RlKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0xpc3RlbmVycyA9IHZhbGlkYXRlTGlzdGVuZXJzKGxpc3RlbmVycyk7XG4gICAgICAgIGlmIChuZXdMaXN0ZW5lcnMubGVuZ3RoICE9PSBsaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBuZXdMaXN0ZW5lcnM7XG4gICAgICAgIH1cbiAgICB9LCAyMDApO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gZmluZFRleHRJbnB1dHM7XG5mdW5jdGlvbiB2YWxpZGF0ZUxpc3RlbmVycyhsaXN0ZW5lcnMpIHtcbiAgICBjb25zdCBuZXdMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZmlsdGVyKGxpc3RlbmVyID0+IHtcbiAgICAgICAgLy8gQSBOb2RlJ3Mgb2Zmc2V0UGFyZW50IGlzIG51bGwgaWYgaXQgb3IgYW55IG9mIGl0c1xuICAgICAgICAvLyBwYXJlbnQgbm9kZXMgYXJlIGhpZGRlbi4gIEhhbmR5IVxuICAgICAgICBpZiAoIWxpc3RlbmVyLmlucHV0Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbGVhbmluZyB1cFwiLCBsaXN0ZW5lci5pbnB1dCk7XG4gICAgICAgICAgICBsaXN0ZW5lci5yZW1vdmUoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3TGlzdGVuZXJzO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBpZiAoIW9wdGlvbnMpXG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBEYXRlLm5vdygpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KVxuICAgICAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSlcbiAgICAgICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXQpXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSB0aHJvdHRsZTtcbiJdLCJzb3VyY2VSb290IjoiIn0=