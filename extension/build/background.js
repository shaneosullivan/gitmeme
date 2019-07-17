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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GITHUB_CLIENT_ID = "9b9e17e168e82438cfb6";
exports.API_ROOT_URL = "https://us-central1-git-meme-prod.cloudfunctions.net/api";
// DO NOT CHECK IN
// function getFakeUrl() {
//   console.error("Do not check this in");
//   return "http://localhost:5000/git-meme-prod/us-central1/api";
// }
// export const API_ROOT_URL = getFakeUrl();


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
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const getToken_1 = __webpack_require__(9);
chrome.runtime.onMessage.addListener((message, _sender, callback) => {
    if (message.data === "login") {
        getToken_1.default(true, err => {
            callback(!err);
        });
    }
    else {
        return false;
    }
    return true;
});


/***/ }),
/* 9 */
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
const consts_1 = __webpack_require__(1);
const githubInfo_1 = __webpack_require__(2);
function getToken(interactive, callback) {
    githubInfo_1.getGithubInfo().then((info) => __awaiter(this, void 0, void 0, function* () {
        if (true) {
            chrome.identity.launchWebAuthFlow(options, function (redirectUri2) {
                if (chrome.runtime.lastError) {
                    callback(new Error(chrome.runtime.lastError));
                    return;
                }
                // Upon success the response is appended to redirectUri, e.g.
                // https://{app_id}.chromiumapp.org/provider_cb#access_token={value}
                //     &refresh_token={value}
                const matches = redirectUri2.match(redirectRe);
                if (matches && matches.length > 1) {
                    handleProviderResponse(parseRedirectFragment(matches[1]));
                }
                else {
                    callback(new Error("Invalid redirect URI"));
                }
            });
        }
    }));
    const localRedirectUri = chrome.identity.getRedirectURL("provider_cb");
    const redirectUri = "https://us-central1-git-meme-prod.cloudfunctions.net/oauth";
    const redirectRe = new RegExp(localRedirectUri + "[#?](.*)");
    const options = {
        interactive: interactive,
        url: "https://github.com/login/oauth/authorize" +
            "?client_id=" +
            consts_1.GITHUB_CLIENT_ID +
            "&redirect_uri=" +
            encodeURIComponent(redirectUri)
    };
    function parseRedirectFragment(fragment) {
        const pairs = fragment.split(/&/);
        const values = {};
        pairs.forEach(function (pair) {
            const nameVal = pair.split(/=/);
            values[nameVal[0]] = nameVal[1];
        });
        return values;
    }
    function handleProviderResponse(values) {
        return __awaiter(this, void 0, void 0, function* () {
            if (values.hasOwnProperty("access_token")) {
                yield setAccessToken(values.access_token, values.user_id, values.avatar);
                // If response does not have an access_token, it might have the code,
                // which can be used in exchange for token.
            }
            else {
                callback(new Error("Neither access_token nor code avialable."));
            }
        });
    }
    function setAccessToken(token, userId, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            // access_token = token;
            yield githubInfo_1.setGithubToken(token);
            yield githubInfo_1.setGithubUserId(userId, avatar);
            callback(null, { token, id: userId, avatar });
        });
    }
}
exports.default = getToken;


/***/ })
/******/ ]);