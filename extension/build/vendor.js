(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor"],{

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

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/scheduler/cjs/scheduler.development.js":
/*!*************************************************************!*\
  !*** ./node_modules/scheduler/cjs/scheduler.development.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/** @license React v0.13.6
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enableSchedulerDebugging = false;

/* eslint-disable no-var */

// TODO: Use symbols?
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
var maxSigned31BitInt = 1073741823;

// Times out immediately
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY = maxSigned31BitInt;

// Callbacks are stored as a circular, doubly linked list.
var firstCallbackNode = null;

var currentDidTimeout = false;
// Pausing the scheduler is useful for debugging.
var isSchedulerPaused = false;

var currentPriorityLevel = NormalPriority;
var currentEventStartTime = -1;
var currentExpirationTime = -1;

// This is set when a callback is being executed, to prevent re-entrancy.
var isExecutingCallback = false;

var isHostCallbackScheduled = false;

var hasNativePerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';

function ensureHostCallbackIsScheduled() {
  if (isExecutingCallback) {
    // Don't schedule work yet; wait until the next time we yield.
    return;
  }
  // Schedule the host callback using the earliest expiration in the list.
  var expirationTime = firstCallbackNode.expirationTime;
  if (!isHostCallbackScheduled) {
    isHostCallbackScheduled = true;
  } else {
    // Cancel the existing host callback.
    cancelHostCallback();
  }
  requestHostCallback(flushWork, expirationTime);
}

function flushFirstCallback() {
  var flushedNode = firstCallbackNode;

  // Remove the node from the list before calling the callback. That way the
  // list is in a consistent state even if the callback throws.
  var next = firstCallbackNode.next;
  if (firstCallbackNode === next) {
    // This is the last callback in the list.
    firstCallbackNode = null;
    next = null;
  } else {
    var lastCallbackNode = firstCallbackNode.previous;
    firstCallbackNode = lastCallbackNode.next = next;
    next.previous = lastCallbackNode;
  }

  flushedNode.next = flushedNode.previous = null;

  // Now it's safe to call the callback.
  var callback = flushedNode.callback;
  var expirationTime = flushedNode.expirationTime;
  var priorityLevel = flushedNode.priorityLevel;
  var previousPriorityLevel = currentPriorityLevel;
  var previousExpirationTime = currentExpirationTime;
  currentPriorityLevel = priorityLevel;
  currentExpirationTime = expirationTime;
  var continuationCallback;
  try {
    continuationCallback = callback();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
    currentExpirationTime = previousExpirationTime;
  }

  // A callback may return a continuation. The continuation should be scheduled
  // with the same priority and expiration as the just-finished callback.
  if (typeof continuationCallback === 'function') {
    var continuationNode = {
      callback: continuationCallback,
      priorityLevel: priorityLevel,
      expirationTime: expirationTime,
      next: null,
      previous: null
    };

    // Insert the new callback into the list, sorted by its expiration. This is
    // almost the same as the code in `scheduleCallback`, except the callback
    // is inserted into the list *before* callbacks of equal expiration instead
    // of after.
    if (firstCallbackNode === null) {
      // This is the first callback in the list.
      firstCallbackNode = continuationNode.next = continuationNode.previous = continuationNode;
    } else {
      var nextAfterContinuation = null;
      var node = firstCallbackNode;
      do {
        if (node.expirationTime >= expirationTime) {
          // This callback expires at or after the continuation. We will insert
          // the continuation *before* this callback.
          nextAfterContinuation = node;
          break;
        }
        node = node.next;
      } while (node !== firstCallbackNode);

      if (nextAfterContinuation === null) {
        // No equal or lower priority callback was found, which means the new
        // callback is the lowest priority callback in the list.
        nextAfterContinuation = firstCallbackNode;
      } else if (nextAfterContinuation === firstCallbackNode) {
        // The new callback is the highest priority callback in the list.
        firstCallbackNode = continuationNode;
        ensureHostCallbackIsScheduled();
      }

      var previous = nextAfterContinuation.previous;
      previous.next = nextAfterContinuation.previous = continuationNode;
      continuationNode.next = nextAfterContinuation;
      continuationNode.previous = previous;
    }
  }
}

function flushImmediateWork() {
  if (
  // Confirm we've exited the outer most event handler
  currentEventStartTime === -1 && firstCallbackNode !== null && firstCallbackNode.priorityLevel === ImmediatePriority) {
    isExecutingCallback = true;
    try {
      do {
        flushFirstCallback();
      } while (
      // Keep flushing until there are no more immediate callbacks
      firstCallbackNode !== null && firstCallbackNode.priorityLevel === ImmediatePriority);
    } finally {
      isExecutingCallback = false;
      if (firstCallbackNode !== null) {
        // There's still work remaining. Request another callback.
        ensureHostCallbackIsScheduled();
      } else {
        isHostCallbackScheduled = false;
      }
    }
  }
}

function flushWork(didTimeout) {
  // Exit right away if we're currently paused

  if (enableSchedulerDebugging && isSchedulerPaused) {
    return;
  }

  isExecutingCallback = true;
  var previousDidTimeout = currentDidTimeout;
  currentDidTimeout = didTimeout;
  try {
    if (didTimeout) {
      // Flush all the expired callbacks without yielding.
      while (firstCallbackNode !== null && !(enableSchedulerDebugging && isSchedulerPaused)) {
        // TODO Wrap in feature flag
        // Read the current time. Flush all the callbacks that expire at or
        // earlier than that time. Then read the current time again and repeat.
        // This optimizes for as few performance.now calls as possible.
        var currentTime = exports.unstable_now();
        if (firstCallbackNode.expirationTime <= currentTime) {
          do {
            flushFirstCallback();
          } while (firstCallbackNode !== null && firstCallbackNode.expirationTime <= currentTime && !(enableSchedulerDebugging && isSchedulerPaused));
          continue;
        }
        break;
      }
    } else {
      // Keep flushing callbacks until we run out of time in the frame.
      if (firstCallbackNode !== null) {
        do {
          if (enableSchedulerDebugging && isSchedulerPaused) {
            break;
          }
          flushFirstCallback();
        } while (firstCallbackNode !== null && !shouldYieldToHost());
      }
    }
  } finally {
    isExecutingCallback = false;
    currentDidTimeout = previousDidTimeout;
    if (firstCallbackNode !== null) {
      // There's still work remaining. Request another callback.
      ensureHostCallbackIsScheduled();
    } else {
      isHostCallbackScheduled = false;
    }
    // Before exiting, flush all the immediate work that was scheduled.
    flushImmediateWork();
  }
}

function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  var previousEventStartTime = currentEventStartTime;
  currentPriorityLevel = priorityLevel;
  currentEventStartTime = exports.unstable_now();

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
    currentEventStartTime = previousEventStartTime;

    // Before exiting, flush all the immediate work that was scheduled.
    flushImmediateWork();
  }
}

function unstable_next(eventHandler) {
  var priorityLevel = void 0;
  switch (currentPriorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
      // Shift down to normal priority
      priorityLevel = NormalPriority;
      break;
    default:
      // Anything lower than normal priority should remain at the current level.
      priorityLevel = currentPriorityLevel;
      break;
  }

  var previousPriorityLevel = currentPriorityLevel;
  var previousEventStartTime = currentEventStartTime;
  currentPriorityLevel = priorityLevel;
  currentEventStartTime = exports.unstable_now();

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
    currentEventStartTime = previousEventStartTime;

    // Before exiting, flush all the immediate work that was scheduled.
    flushImmediateWork();
  }
}

function unstable_wrapCallback(callback) {
  var parentPriorityLevel = currentPriorityLevel;
  return function () {
    // This is a fork of runWithPriority, inlined for performance.
    var previousPriorityLevel = currentPriorityLevel;
    var previousEventStartTime = currentEventStartTime;
    currentPriorityLevel = parentPriorityLevel;
    currentEventStartTime = exports.unstable_now();

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
      currentEventStartTime = previousEventStartTime;
      flushImmediateWork();
    }
  };
}

function unstable_scheduleCallback(callback, deprecated_options) {
  var startTime = currentEventStartTime !== -1 ? currentEventStartTime : exports.unstable_now();

  var expirationTime;
  if (typeof deprecated_options === 'object' && deprecated_options !== null && typeof deprecated_options.timeout === 'number') {
    // FIXME: Remove this branch once we lift expiration times out of React.
    expirationTime = startTime + deprecated_options.timeout;
  } else {
    switch (currentPriorityLevel) {
      case ImmediatePriority:
        expirationTime = startTime + IMMEDIATE_PRIORITY_TIMEOUT;
        break;
      case UserBlockingPriority:
        expirationTime = startTime + USER_BLOCKING_PRIORITY;
        break;
      case IdlePriority:
        expirationTime = startTime + IDLE_PRIORITY;
        break;
      case LowPriority:
        expirationTime = startTime + LOW_PRIORITY_TIMEOUT;
        break;
      case NormalPriority:
      default:
        expirationTime = startTime + NORMAL_PRIORITY_TIMEOUT;
    }
  }

  var newNode = {
    callback: callback,
    priorityLevel: currentPriorityLevel,
    expirationTime: expirationTime,
    next: null,
    previous: null
  };

  // Insert the new callback into the list, ordered first by expiration, then
  // by insertion. So the new callback is inserted any other callback with
  // equal expiration.
  if (firstCallbackNode === null) {
    // This is the first callback in the list.
    firstCallbackNode = newNode.next = newNode.previous = newNode;
    ensureHostCallbackIsScheduled();
  } else {
    var next = null;
    var node = firstCallbackNode;
    do {
      if (node.expirationTime > expirationTime) {
        // The new callback expires before this one.
        next = node;
        break;
      }
      node = node.next;
    } while (node !== firstCallbackNode);

    if (next === null) {
      // No callback with a later expiration was found, which means the new
      // callback has the latest expiration in the list.
      next = firstCallbackNode;
    } else if (next === firstCallbackNode) {
      // The new callback has the earliest expiration in the entire list.
      firstCallbackNode = newNode;
      ensureHostCallbackIsScheduled();
    }

    var previous = next.previous;
    previous.next = next.previous = newNode;
    newNode.next = next;
    newNode.previous = previous;
  }

  return newNode;
}

function unstable_pauseExecution() {
  isSchedulerPaused = true;
}

function unstable_continueExecution() {
  isSchedulerPaused = false;
  if (firstCallbackNode !== null) {
    ensureHostCallbackIsScheduled();
  }
}

function unstable_getFirstCallbackNode() {
  return firstCallbackNode;
}

function unstable_cancelCallback(callbackNode) {
  var next = callbackNode.next;
  if (next === null) {
    // Already cancelled.
    return;
  }

  if (next === callbackNode) {
    // This is the only scheduled callback. Clear the list.
    firstCallbackNode = null;
  } else {
    // Remove the callback from its position in the list.
    if (callbackNode === firstCallbackNode) {
      firstCallbackNode = next;
    }
    var previous = callbackNode.previous;
    previous.next = next;
    next.previous = previous;
  }

  callbackNode.next = callbackNode.previous = null;
}

function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}

function unstable_shouldYield() {
  return !currentDidTimeout && (firstCallbackNode !== null && firstCallbackNode.expirationTime < currentExpirationTime || shouldYieldToHost());
}

// The remaining code is essentially a polyfill for requestIdleCallback. It
// works by scheduling a requestAnimationFrame, storing the time for the start
// of the frame, then scheduling a postMessage which gets scheduled after paint.
// Within the postMessage handler do as much work as possible until time + frame
// rate. By separating the idle call into a separate event tick we ensure that
// layout, paint and other browser work is counted against the available time.
// The frame rate is dynamically adjusted.

// We capture a local reference to any global, in case it gets polyfilled after
// this module is initially evaluated. We want to be using a
// consistent implementation.
var localDate = Date;

// This initialization code may run even on server environments if a component
// just imports ReactDOM (e.g. for findDOMNode). Some environments might not
// have setTimeout or clearTimeout. However, we always expect them to be defined
// on the client. https://github.com/facebook/react/pull/13088
var localSetTimeout = typeof setTimeout === 'function' ? setTimeout : undefined;
var localClearTimeout = typeof clearTimeout === 'function' ? clearTimeout : undefined;

// We don't expect either of these to necessarily be defined, but we will error
// later if they are missing on the client.
var localRequestAnimationFrame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : undefined;
var localCancelAnimationFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : undefined;

// requestAnimationFrame does not run when the tab is in the background. If
// we're backgrounded we prefer for that work to happen so that the page
// continues to load in the background. So we also schedule a 'setTimeout' as
// a fallback.
// TODO: Need a better heuristic for backgrounded work.
var ANIMATION_FRAME_TIMEOUT = 100;
var rAFID;
var rAFTimeoutID;
var requestAnimationFrameWithTimeout = function (callback) {
  // schedule rAF and also a setTimeout
  rAFID = localRequestAnimationFrame(function (timestamp) {
    // cancel the setTimeout
    localClearTimeout(rAFTimeoutID);
    callback(timestamp);
  });
  rAFTimeoutID = localSetTimeout(function () {
    // cancel the requestAnimationFrame
    localCancelAnimationFrame(rAFID);
    callback(exports.unstable_now());
  }, ANIMATION_FRAME_TIMEOUT);
};

if (hasNativePerformanceNow) {
  var Performance = performance;
  exports.unstable_now = function () {
    return Performance.now();
  };
} else {
  exports.unstable_now = function () {
    return localDate.now();
  };
}

var requestHostCallback;
var cancelHostCallback;
var shouldYieldToHost;

var globalValue = null;
if (typeof window !== 'undefined') {
  globalValue = window;
} else if (typeof global !== 'undefined') {
  globalValue = global;
}

if (globalValue && globalValue._schedMock) {
  // Dynamic injection, only for testing purposes.
  var globalImpl = globalValue._schedMock;
  requestHostCallback = globalImpl[0];
  cancelHostCallback = globalImpl[1];
  shouldYieldToHost = globalImpl[2];
  exports.unstable_now = globalImpl[3];
} else if (
// If Scheduler runs in a non-DOM environment, it falls back to a naive
// implementation using setTimeout.
typeof window === 'undefined' ||
// Check if MessageChannel is supported, too.
typeof MessageChannel !== 'function') {
  // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
  // fallback to a naive implementation.
  var _callback = null;
  var _flushCallback = function (didTimeout) {
    if (_callback !== null) {
      try {
        _callback(didTimeout);
      } finally {
        _callback = null;
      }
    }
  };
  requestHostCallback = function (cb, ms) {
    if (_callback !== null) {
      // Protect against re-entrancy.
      setTimeout(requestHostCallback, 0, cb);
    } else {
      _callback = cb;
      setTimeout(_flushCallback, 0, false);
    }
  };
  cancelHostCallback = function () {
    _callback = null;
  };
  shouldYieldToHost = function () {
    return false;
  };
} else {
  if (typeof console !== 'undefined') {
    // TODO: Remove fb.me link
    if (typeof localRequestAnimationFrame !== 'function') {
      console.error("This browser doesn't support requestAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
    }
    if (typeof localCancelAnimationFrame !== 'function') {
      console.error("This browser doesn't support cancelAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
    }
  }

  var scheduledHostCallback = null;
  var isMessageEventScheduled = false;
  var timeoutTime = -1;

  var isAnimationFrameScheduled = false;

  var isFlushingHostCallback = false;

  var frameDeadline = 0;
  // We start out assuming that we run at 30fps but then the heuristic tracking
  // will adjust this value to a faster fps if we get more frequent animation
  // frames.
  var previousFrameTime = 33;
  var activeFrameTime = 33;

  shouldYieldToHost = function () {
    return frameDeadline <= exports.unstable_now();
  };

  // We use the postMessage trick to defer idle work until after the repaint.
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = function (event) {
    isMessageEventScheduled = false;

    var prevScheduledCallback = scheduledHostCallback;
    var prevTimeoutTime = timeoutTime;
    scheduledHostCallback = null;
    timeoutTime = -1;

    var currentTime = exports.unstable_now();

    var didTimeout = false;
    if (frameDeadline - currentTime <= 0) {
      // There's no time left in this idle period. Check if the callback has
      // a timeout and whether it's been exceeded.
      if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
        // Exceeded the timeout. Invoke the callback even though there's no
        // time left.
        didTimeout = true;
      } else {
        // No timeout.
        if (!isAnimationFrameScheduled) {
          // Schedule another animation callback so we retry later.
          isAnimationFrameScheduled = true;
          requestAnimationFrameWithTimeout(animationTick);
        }
        // Exit without invoking the callback.
        scheduledHostCallback = prevScheduledCallback;
        timeoutTime = prevTimeoutTime;
        return;
      }
    }

    if (prevScheduledCallback !== null) {
      isFlushingHostCallback = true;
      try {
        prevScheduledCallback(didTimeout);
      } finally {
        isFlushingHostCallback = false;
      }
    }
  };

  var animationTick = function (rafTime) {
    if (scheduledHostCallback !== null) {
      // Eagerly schedule the next animation callback at the beginning of the
      // frame. If the scheduler queue is not empty at the end of the frame, it
      // will continue flushing inside that callback. If the queue *is* empty,
      // then it will exit immediately. Posting the callback at the start of the
      // frame ensures it's fired within the earliest possible frame. If we
      // waited until the end of the frame to post the callback, we risk the
      // browser skipping a frame and not firing the callback until the frame
      // after that.
      requestAnimationFrameWithTimeout(animationTick);
    } else {
      // No pending work. Exit.
      isAnimationFrameScheduled = false;
      return;
    }

    var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
    if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
      if (nextFrameTime < 8) {
        // Defensive coding. We don't support higher frame rates than 120hz.
        // If the calculated frame time gets lower than 8, it is probably a bug.
        nextFrameTime = 8;
      }
      // If one frame goes long, then the next one can be short to catch up.
      // If two frames are short in a row, then that's an indication that we
      // actually have a higher frame rate than what we're currently optimizing.
      // We adjust our heuristic dynamically accordingly. For example, if we're
      // running on 120hz display or 90hz VR display.
      // Take the max of the two in case one of them was an anomaly due to
      // missed frame deadlines.
      activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
    } else {
      previousFrameTime = nextFrameTime;
    }
    frameDeadline = rafTime + activeFrameTime;
    if (!isMessageEventScheduled) {
      isMessageEventScheduled = true;
      port.postMessage(undefined);
    }
  };

  requestHostCallback = function (callback, absoluteTimeout) {
    scheduledHostCallback = callback;
    timeoutTime = absoluteTimeout;
    if (isFlushingHostCallback || absoluteTimeout < 0) {
      // Don't wait for the next frame. Continue working ASAP, in a new event.
      port.postMessage(undefined);
    } else if (!isAnimationFrameScheduled) {
      // If rAF didn't already schedule one, we need to schedule a frame.
      // TODO: If this rAF doesn't materialize because the browser throttles, we
      // might want to still have setTimeout trigger rIC as a backup to ensure
      // that we keep performing work.
      isAnimationFrameScheduled = true;
      requestAnimationFrameWithTimeout(animationTick);
    }
  };

  cancelHostCallback = function () {
    scheduledHostCallback = null;
    isMessageEventScheduled = false;
    timeoutTime = -1;
  };
}

exports.unstable_ImmediatePriority = ImmediatePriority;
exports.unstable_UserBlockingPriority = UserBlockingPriority;
exports.unstable_NormalPriority = NormalPriority;
exports.unstable_IdlePriority = IdlePriority;
exports.unstable_LowPriority = LowPriority;
exports.unstable_runWithPriority = unstable_runWithPriority;
exports.unstable_next = unstable_next;
exports.unstable_scheduleCallback = unstable_scheduleCallback;
exports.unstable_cancelCallback = unstable_cancelCallback;
exports.unstable_wrapCallback = unstable_wrapCallback;
exports.unstable_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
exports.unstable_shouldYield = unstable_shouldYield;
exports.unstable_continueExecution = unstable_continueExecution;
exports.unstable_pauseExecution = unstable_pauseExecution;
exports.unstable_getFirstCallbackNode = unstable_getFirstCallbackNode;
  })();
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/scheduler/index.js":
/*!*****************************************!*\
  !*** ./node_modules/scheduler/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/scheduler.development.js */ "./node_modules/scheduler/cjs/scheduler.development.js");
}


/***/ }),

/***/ "./node_modules/textarea-caret/index.js":
/*!**********************************************!*\
  !*** ./node_modules/textarea-caret/index.js ***!
  \**********************************************/
/*! no static exports found */
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

/***/ "./node_modules/uuid/index.js":
/*!************************************!*\
  !*** ./node_modules/uuid/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(/*! ./v1 */ "./node_modules/uuid/v1.js");
var v4 = __webpack_require__(/*! ./v4 */ "./node_modules/uuid/v4.js");

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),

/***/ "./node_modules/uuid/v1.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v1.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zY2hlZHVsZXIvY2pzL3NjaGVkdWxlci5kZXZlbG9wbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2NoZWR1bGVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90ZXh0YXJlYS1jYXJldC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdXVpZC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3V1aWQvbGliL3JuZy1icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy91dWlkL3YxLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy91dWlkL3Y0LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsYUFBYTtBQUNoRCxxQ0FBcUMsZUFBZTtBQUNwRCxxQ0FBcUMsZUFBZTtBQUNwRDtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DOzs7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLHNCQUFzQjtBQUN0Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0Isb0JBQW9CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7Ozs7QUFJYixJQUFJLElBQXFDO0FBQ3pDO0FBQ0E7O0FBRUEsOENBQThDLGNBQWM7O0FBRTVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7Ozs7QUMxckJhOztBQUViLElBQUksS0FBcUMsRUFBRSxFQUUxQztBQUNELG1CQUFtQixtQkFBTyxDQUFDLDZGQUFnQztBQUMzRDs7Ozs7Ozs7Ozs7O0FDTkE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUdBQW1HO0FBQ25HOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQzs7QUFFbEM7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQSxnQ0FBZ0M7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsOEJBQThCLDBDQUEwQztBQUN4RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBLElBQUksS0FBNEI7QUFDaEM7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7Ozs7QUN6SUQsU0FBUyxtQkFBTyxDQUFDLHVDQUFNO0FBQ3ZCLFNBQVMsbUJBQU8sQ0FBQyx1Q0FBTTs7QUFFdkI7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUNBQWlDOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLFFBQVE7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDakNBLFVBQVUsbUJBQU8sQ0FBQyx5REFBVztBQUM3QixrQkFBa0IsbUJBQU8sQ0FBQyxpRUFBbUI7O0FBRTdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUM7QUFDbkM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUM1R0EsVUFBVSxtQkFBTyxDQUFDLHlEQUFXO0FBQzdCLGtCQUFrQixtQkFBTyxDQUFDLGlFQUFtQjs7QUFFN0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQzVCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUMiLCJmaWxlIjoidmVuZG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHJlZjogaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG52YXIgZ2V0R2xvYmFsID0gZnVuY3Rpb24gKCkge1xuXHQvLyB0aGUgb25seSByZWxpYWJsZSBtZWFucyB0byBnZXQgdGhlIGdsb2JhbCBvYmplY3QgaXNcblx0Ly8gYEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKClgXG5cdC8vIEhvd2V2ZXIsIHRoaXMgY2F1c2VzIENTUCB2aW9sYXRpb25zIGluIENocm9tZSBhcHBzLlxuXHRpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7IHJldHVybiBzZWxmOyB9XG5cdGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gd2luZG93OyB9XG5cdGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gZ2xvYmFsOyB9XG5cdHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0Jyk7XG59XG5cbnZhciBnbG9iYWwgPSBnZXRHbG9iYWwoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZ2xvYmFsLmZldGNoO1xuXG4vLyBOZWVkZWQgZm9yIFR5cGVTY3JpcHQgYW5kIFdlYnBhY2suXG5leHBvcnRzLmRlZmF1bHQgPSBnbG9iYWwuZmV0Y2guYmluZChnbG9iYWwpO1xuXG5leHBvcnRzLkhlYWRlcnMgPSBnbG9iYWwuSGVhZGVycztcbmV4cG9ydHMuUmVxdWVzdCA9IGdsb2JhbC5SZXF1ZXN0O1xuZXhwb3J0cy5SZXNwb25zZSA9IGdsb2JhbC5SZXNwb25zZTsiLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYwLjEzLjZcbiAqIHNjaGVkdWxlci5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nID0gZmFsc2U7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuXG4vLyBUT0RPOiBVc2Ugc3ltYm9scz9cbnZhciBJbW1lZGlhdGVQcmlvcml0eSA9IDE7XG52YXIgVXNlckJsb2NraW5nUHJpb3JpdHkgPSAyO1xudmFyIE5vcm1hbFByaW9yaXR5ID0gMztcbnZhciBMb3dQcmlvcml0eSA9IDQ7XG52YXIgSWRsZVByaW9yaXR5ID0gNTtcblxuLy8gTWF4IDMxIGJpdCBpbnRlZ2VyLiBUaGUgbWF4IGludGVnZXIgc2l6ZSBpbiBWOCBmb3IgMzItYml0IHN5c3RlbXMuXG4vLyBNYXRoLnBvdygyLCAzMCkgLSAxXG4vLyAwYjExMTExMTExMTExMTExMTExMTExMTExMTExMTExMVxudmFyIG1heFNpZ25lZDMxQml0SW50ID0gMTA3Mzc0MTgyMztcblxuLy8gVGltZXMgb3V0IGltbWVkaWF0ZWx5XG52YXIgSU1NRURJQVRFX1BSSU9SSVRZX1RJTUVPVVQgPSAtMTtcbi8vIEV2ZW50dWFsbHkgdGltZXMgb3V0XG52YXIgVVNFUl9CTE9DS0lOR19QUklPUklUWSA9IDI1MDtcbnZhciBOT1JNQUxfUFJJT1JJVFlfVElNRU9VVCA9IDUwMDA7XG52YXIgTE9XX1BSSU9SSVRZX1RJTUVPVVQgPSAxMDAwMDtcbi8vIE5ldmVyIHRpbWVzIG91dFxudmFyIElETEVfUFJJT1JJVFkgPSBtYXhTaWduZWQzMUJpdEludDtcblxuLy8gQ2FsbGJhY2tzIGFyZSBzdG9yZWQgYXMgYSBjaXJjdWxhciwgZG91Ymx5IGxpbmtlZCBsaXN0LlxudmFyIGZpcnN0Q2FsbGJhY2tOb2RlID0gbnVsbDtcblxudmFyIGN1cnJlbnREaWRUaW1lb3V0ID0gZmFsc2U7XG4vLyBQYXVzaW5nIHRoZSBzY2hlZHVsZXIgaXMgdXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG52YXIgaXNTY2hlZHVsZXJQYXVzZWQgPSBmYWxzZTtcblxudmFyIGN1cnJlbnRQcmlvcml0eUxldmVsID0gTm9ybWFsUHJpb3JpdHk7XG52YXIgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gLTE7XG52YXIgY3VycmVudEV4cGlyYXRpb25UaW1lID0gLTE7XG5cbi8vIFRoaXMgaXMgc2V0IHdoZW4gYSBjYWxsYmFjayBpcyBiZWluZyBleGVjdXRlZCwgdG8gcHJldmVudCByZS1lbnRyYW5jeS5cbnZhciBpc0V4ZWN1dGluZ0NhbGxiYWNrID0gZmFsc2U7XG5cbnZhciBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IGZhbHNlO1xuXG52YXIgaGFzTmF0aXZlUGVyZm9ybWFuY2VOb3cgPSB0eXBlb2YgcGVyZm9ybWFuY2UgPT09ICdvYmplY3QnICYmIHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09ICdmdW5jdGlvbic7XG5cbmZ1bmN0aW9uIGVuc3VyZUhvc3RDYWxsYmFja0lzU2NoZWR1bGVkKCkge1xuICBpZiAoaXNFeGVjdXRpbmdDYWxsYmFjaykge1xuICAgIC8vIERvbid0IHNjaGVkdWxlIHdvcmsgeWV0OyB3YWl0IHVudGlsIHRoZSBuZXh0IHRpbWUgd2UgeWllbGQuXG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIFNjaGVkdWxlIHRoZSBob3N0IGNhbGxiYWNrIHVzaW5nIHRoZSBlYXJsaWVzdCBleHBpcmF0aW9uIGluIHRoZSBsaXN0LlxuICB2YXIgZXhwaXJhdGlvblRpbWUgPSBmaXJzdENhbGxiYWNrTm9kZS5leHBpcmF0aW9uVGltZTtcbiAgaWYgKCFpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCkge1xuICAgIGlzSG9zdENhbGxiYWNrU2NoZWR1bGVkID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBDYW5jZWwgdGhlIGV4aXN0aW5nIGhvc3QgY2FsbGJhY2suXG4gICAgY2FuY2VsSG9zdENhbGxiYWNrKCk7XG4gIH1cbiAgcmVxdWVzdEhvc3RDYWxsYmFjayhmbHVzaFdvcmssIGV4cGlyYXRpb25UaW1lKTtcbn1cblxuZnVuY3Rpb24gZmx1c2hGaXJzdENhbGxiYWNrKCkge1xuICB2YXIgZmx1c2hlZE5vZGUgPSBmaXJzdENhbGxiYWNrTm9kZTtcblxuICAvLyBSZW1vdmUgdGhlIG5vZGUgZnJvbSB0aGUgbGlzdCBiZWZvcmUgY2FsbGluZyB0aGUgY2FsbGJhY2suIFRoYXQgd2F5IHRoZVxuICAvLyBsaXN0IGlzIGluIGEgY29uc2lzdGVudCBzdGF0ZSBldmVuIGlmIHRoZSBjYWxsYmFjayB0aHJvd3MuXG4gIHZhciBuZXh0ID0gZmlyc3RDYWxsYmFja05vZGUubmV4dDtcbiAgaWYgKGZpcnN0Q2FsbGJhY2tOb2RlID09PSBuZXh0KSB7XG4gICAgLy8gVGhpcyBpcyB0aGUgbGFzdCBjYWxsYmFjayBpbiB0aGUgbGlzdC5cbiAgICBmaXJzdENhbGxiYWNrTm9kZSA9IG51bGw7XG4gICAgbmV4dCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxhc3RDYWxsYmFja05vZGUgPSBmaXJzdENhbGxiYWNrTm9kZS5wcmV2aW91cztcbiAgICBmaXJzdENhbGxiYWNrTm9kZSA9IGxhc3RDYWxsYmFja05vZGUubmV4dCA9IG5leHQ7XG4gICAgbmV4dC5wcmV2aW91cyA9IGxhc3RDYWxsYmFja05vZGU7XG4gIH1cblxuICBmbHVzaGVkTm9kZS5uZXh0ID0gZmx1c2hlZE5vZGUucHJldmlvdXMgPSBudWxsO1xuXG4gIC8vIE5vdyBpdCdzIHNhZmUgdG8gY2FsbCB0aGUgY2FsbGJhY2suXG4gIHZhciBjYWxsYmFjayA9IGZsdXNoZWROb2RlLmNhbGxiYWNrO1xuICB2YXIgZXhwaXJhdGlvblRpbWUgPSBmbHVzaGVkTm9kZS5leHBpcmF0aW9uVGltZTtcbiAgdmFyIHByaW9yaXR5TGV2ZWwgPSBmbHVzaGVkTm9kZS5wcmlvcml0eUxldmVsO1xuICB2YXIgcHJldmlvdXNQcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG4gIHZhciBwcmV2aW91c0V4cGlyYXRpb25UaW1lID0gY3VycmVudEV4cGlyYXRpb25UaW1lO1xuICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByaW9yaXR5TGV2ZWw7XG4gIGN1cnJlbnRFeHBpcmF0aW9uVGltZSA9IGV4cGlyYXRpb25UaW1lO1xuICB2YXIgY29udGludWF0aW9uQ2FsbGJhY2s7XG4gIHRyeSB7XG4gICAgY29udGludWF0aW9uQ2FsbGJhY2sgPSBjYWxsYmFjaygpO1xuICB9IGZpbmFsbHkge1xuICAgIGN1cnJlbnRQcmlvcml0eUxldmVsID0gcHJldmlvdXNQcmlvcml0eUxldmVsO1xuICAgIGN1cnJlbnRFeHBpcmF0aW9uVGltZSA9IHByZXZpb3VzRXhwaXJhdGlvblRpbWU7XG4gIH1cblxuICAvLyBBIGNhbGxiYWNrIG1heSByZXR1cm4gYSBjb250aW51YXRpb24uIFRoZSBjb250aW51YXRpb24gc2hvdWxkIGJlIHNjaGVkdWxlZFxuICAvLyB3aXRoIHRoZSBzYW1lIHByaW9yaXR5IGFuZCBleHBpcmF0aW9uIGFzIHRoZSBqdXN0LWZpbmlzaGVkIGNhbGxiYWNrLlxuICBpZiAodHlwZW9mIGNvbnRpbnVhdGlvbkNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIGNvbnRpbnVhdGlvbk5vZGUgPSB7XG4gICAgICBjYWxsYmFjazogY29udGludWF0aW9uQ2FsbGJhY2ssXG4gICAgICBwcmlvcml0eUxldmVsOiBwcmlvcml0eUxldmVsLFxuICAgICAgZXhwaXJhdGlvblRpbWU6IGV4cGlyYXRpb25UaW1lLFxuICAgICAgbmV4dDogbnVsbCxcbiAgICAgIHByZXZpb3VzOiBudWxsXG4gICAgfTtcblxuICAgIC8vIEluc2VydCB0aGUgbmV3IGNhbGxiYWNrIGludG8gdGhlIGxpc3QsIHNvcnRlZCBieSBpdHMgZXhwaXJhdGlvbi4gVGhpcyBpc1xuICAgIC8vIGFsbW9zdCB0aGUgc2FtZSBhcyB0aGUgY29kZSBpbiBgc2NoZWR1bGVDYWxsYmFja2AsIGV4Y2VwdCB0aGUgY2FsbGJhY2tcbiAgICAvLyBpcyBpbnNlcnRlZCBpbnRvIHRoZSBsaXN0ICpiZWZvcmUqIGNhbGxiYWNrcyBvZiBlcXVhbCBleHBpcmF0aW9uIGluc3RlYWRcbiAgICAvLyBvZiBhZnRlci5cbiAgICBpZiAoZmlyc3RDYWxsYmFja05vZGUgPT09IG51bGwpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IGNhbGxiYWNrIGluIHRoZSBsaXN0LlxuICAgICAgZmlyc3RDYWxsYmFja05vZGUgPSBjb250aW51YXRpb25Ob2RlLm5leHQgPSBjb250aW51YXRpb25Ob2RlLnByZXZpb3VzID0gY29udGludWF0aW9uTm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5leHRBZnRlckNvbnRpbnVhdGlvbiA9IG51bGw7XG4gICAgICB2YXIgbm9kZSA9IGZpcnN0Q2FsbGJhY2tOb2RlO1xuICAgICAgZG8ge1xuICAgICAgICBpZiAobm9kZS5leHBpcmF0aW9uVGltZSA+PSBleHBpcmF0aW9uVGltZSkge1xuICAgICAgICAgIC8vIFRoaXMgY2FsbGJhY2sgZXhwaXJlcyBhdCBvciBhZnRlciB0aGUgY29udGludWF0aW9uLiBXZSB3aWxsIGluc2VydFxuICAgICAgICAgIC8vIHRoZSBjb250aW51YXRpb24gKmJlZm9yZSogdGhpcyBjYWxsYmFjay5cbiAgICAgICAgICBuZXh0QWZ0ZXJDb250aW51YXRpb24gPSBub2RlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICB9IHdoaWxlIChub2RlICE9PSBmaXJzdENhbGxiYWNrTm9kZSk7XG5cbiAgICAgIGlmIChuZXh0QWZ0ZXJDb250aW51YXRpb24gPT09IG51bGwpIHtcbiAgICAgICAgLy8gTm8gZXF1YWwgb3IgbG93ZXIgcHJpb3JpdHkgY2FsbGJhY2sgd2FzIGZvdW5kLCB3aGljaCBtZWFucyB0aGUgbmV3XG4gICAgICAgIC8vIGNhbGxiYWNrIGlzIHRoZSBsb3dlc3QgcHJpb3JpdHkgY2FsbGJhY2sgaW4gdGhlIGxpc3QuXG4gICAgICAgIG5leHRBZnRlckNvbnRpbnVhdGlvbiA9IGZpcnN0Q2FsbGJhY2tOb2RlO1xuICAgICAgfSBlbHNlIGlmIChuZXh0QWZ0ZXJDb250aW51YXRpb24gPT09IGZpcnN0Q2FsbGJhY2tOb2RlKSB7XG4gICAgICAgIC8vIFRoZSBuZXcgY2FsbGJhY2sgaXMgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgY2FsbGJhY2sgaW4gdGhlIGxpc3QuXG4gICAgICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gY29udGludWF0aW9uTm9kZTtcbiAgICAgICAgZW5zdXJlSG9zdENhbGxiYWNrSXNTY2hlZHVsZWQoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByZXZpb3VzID0gbmV4dEFmdGVyQ29udGludWF0aW9uLnByZXZpb3VzO1xuICAgICAgcHJldmlvdXMubmV4dCA9IG5leHRBZnRlckNvbnRpbnVhdGlvbi5wcmV2aW91cyA9IGNvbnRpbnVhdGlvbk5vZGU7XG4gICAgICBjb250aW51YXRpb25Ob2RlLm5leHQgPSBuZXh0QWZ0ZXJDb250aW51YXRpb247XG4gICAgICBjb250aW51YXRpb25Ob2RlLnByZXZpb3VzID0gcHJldmlvdXM7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsdXNoSW1tZWRpYXRlV29yaygpIHtcbiAgaWYgKFxuICAvLyBDb25maXJtIHdlJ3ZlIGV4aXRlZCB0aGUgb3V0ZXIgbW9zdCBldmVudCBoYW5kbGVyXG4gIGN1cnJlbnRFdmVudFN0YXJ0VGltZSA9PT0gLTEgJiYgZmlyc3RDYWxsYmFja05vZGUgIT09IG51bGwgJiYgZmlyc3RDYWxsYmFja05vZGUucHJpb3JpdHlMZXZlbCA9PT0gSW1tZWRpYXRlUHJpb3JpdHkpIHtcbiAgICBpc0V4ZWN1dGluZ0NhbGxiYWNrID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgZG8ge1xuICAgICAgICBmbHVzaEZpcnN0Q2FsbGJhY2soKTtcbiAgICAgIH0gd2hpbGUgKFxuICAgICAgLy8gS2VlcCBmbHVzaGluZyB1bnRpbCB0aGVyZSBhcmUgbm8gbW9yZSBpbW1lZGlhdGUgY2FsbGJhY2tzXG4gICAgICBmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCAmJiBmaXJzdENhbGxiYWNrTm9kZS5wcmlvcml0eUxldmVsID09PSBJbW1lZGlhdGVQcmlvcml0eSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlzRXhlY3V0aW5nQ2FsbGJhY2sgPSBmYWxzZTtcbiAgICAgIGlmIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAvLyBUaGVyZSdzIHN0aWxsIHdvcmsgcmVtYWluaW5nLiBSZXF1ZXN0IGFub3RoZXIgY2FsbGJhY2suXG4gICAgICAgIGVuc3VyZUhvc3RDYWxsYmFja0lzU2NoZWR1bGVkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc0hvc3RDYWxsYmFja1NjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmbHVzaFdvcmsoZGlkVGltZW91dCkge1xuICAvLyBFeGl0IHJpZ2h0IGF3YXkgaWYgd2UncmUgY3VycmVudGx5IHBhdXNlZFxuXG4gIGlmIChlbmFibGVTY2hlZHVsZXJEZWJ1Z2dpbmcgJiYgaXNTY2hlZHVsZXJQYXVzZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpc0V4ZWN1dGluZ0NhbGxiYWNrID0gdHJ1ZTtcbiAgdmFyIHByZXZpb3VzRGlkVGltZW91dCA9IGN1cnJlbnREaWRUaW1lb3V0O1xuICBjdXJyZW50RGlkVGltZW91dCA9IGRpZFRpbWVvdXQ7XG4gIHRyeSB7XG4gICAgaWYgKGRpZFRpbWVvdXQpIHtcbiAgICAgIC8vIEZsdXNoIGFsbCB0aGUgZXhwaXJlZCBjYWxsYmFja3Mgd2l0aG91dCB5aWVsZGluZy5cbiAgICAgIHdoaWxlIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCAmJiAhKGVuYWJsZVNjaGVkdWxlckRlYnVnZ2luZyAmJiBpc1NjaGVkdWxlclBhdXNlZCkpIHtcbiAgICAgICAgLy8gVE9ETyBXcmFwIGluIGZlYXR1cmUgZmxhZ1xuICAgICAgICAvLyBSZWFkIHRoZSBjdXJyZW50IHRpbWUuIEZsdXNoIGFsbCB0aGUgY2FsbGJhY2tzIHRoYXQgZXhwaXJlIGF0IG9yXG4gICAgICAgIC8vIGVhcmxpZXIgdGhhbiB0aGF0IHRpbWUuIFRoZW4gcmVhZCB0aGUgY3VycmVudCB0aW1lIGFnYWluIGFuZCByZXBlYXQuXG4gICAgICAgIC8vIFRoaXMgb3B0aW1pemVzIGZvciBhcyBmZXcgcGVyZm9ybWFuY2Uubm93IGNhbGxzIGFzIHBvc3NpYmxlLlxuICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBleHBvcnRzLnVuc3RhYmxlX25vdygpO1xuICAgICAgICBpZiAoZmlyc3RDYWxsYmFja05vZGUuZXhwaXJhdGlvblRpbWUgPD0gY3VycmVudFRpbWUpIHtcbiAgICAgICAgICBkbyB7XG4gICAgICAgICAgICBmbHVzaEZpcnN0Q2FsbGJhY2soKTtcbiAgICAgICAgICB9IHdoaWxlIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCAmJiBmaXJzdENhbGxiYWNrTm9kZS5leHBpcmF0aW9uVGltZSA8PSBjdXJyZW50VGltZSAmJiAhKGVuYWJsZVNjaGVkdWxlckRlYnVnZ2luZyAmJiBpc1NjaGVkdWxlclBhdXNlZCkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBLZWVwIGZsdXNoaW5nIGNhbGxiYWNrcyB1bnRpbCB3ZSBydW4gb3V0IG9mIHRpbWUgaW4gdGhlIGZyYW1lLlxuICAgICAgaWYgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsKSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpZiAoZW5hYmxlU2NoZWR1bGVyRGVidWdnaW5nICYmIGlzU2NoZWR1bGVyUGF1c2VkKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgZmx1c2hGaXJzdENhbGxiYWNrKCk7XG4gICAgICAgIH0gd2hpbGUgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsICYmICFzaG91bGRZaWVsZFRvSG9zdCgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgaXNFeGVjdXRpbmdDYWxsYmFjayA9IGZhbHNlO1xuICAgIGN1cnJlbnREaWRUaW1lb3V0ID0gcHJldmlvdXNEaWRUaW1lb3V0O1xuICAgIGlmIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCkge1xuICAgICAgLy8gVGhlcmUncyBzdGlsbCB3b3JrIHJlbWFpbmluZy4gUmVxdWVzdCBhbm90aGVyIGNhbGxiYWNrLlxuICAgICAgZW5zdXJlSG9zdENhbGxiYWNrSXNTY2hlZHVsZWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXNIb3N0Q2FsbGJhY2tTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gQmVmb3JlIGV4aXRpbmcsIGZsdXNoIGFsbCB0aGUgaW1tZWRpYXRlIHdvcmsgdGhhdCB3YXMgc2NoZWR1bGVkLlxuICAgIGZsdXNoSW1tZWRpYXRlV29yaygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3J1bldpdGhQcmlvcml0eShwcmlvcml0eUxldmVsLCBldmVudEhhbmRsZXIpIHtcbiAgc3dpdGNoIChwcmlvcml0eUxldmVsKSB7XG4gICAgY2FzZSBJbW1lZGlhdGVQcmlvcml0eTpcbiAgICBjYXNlIFVzZXJCbG9ja2luZ1ByaW9yaXR5OlxuICAgIGNhc2UgTm9ybWFsUHJpb3JpdHk6XG4gICAgY2FzZSBMb3dQcmlvcml0eTpcbiAgICBjYXNlIElkbGVQcmlvcml0eTpcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBwcmlvcml0eUxldmVsID0gTm9ybWFsUHJpb3JpdHk7XG4gIH1cblxuICB2YXIgcHJldmlvdXNQcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG4gIHZhciBwcmV2aW91c0V2ZW50U3RhcnRUaW1lID0gY3VycmVudEV2ZW50U3RhcnRUaW1lO1xuICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByaW9yaXR5TGV2ZWw7XG4gIGN1cnJlbnRFdmVudFN0YXJ0VGltZSA9IGV4cG9ydHMudW5zdGFibGVfbm93KCk7XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZXZlbnRIYW5kbGVyKCk7XG4gIH0gZmluYWxseSB7XG4gICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmV2aW91c1ByaW9yaXR5TGV2ZWw7XG4gICAgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gcHJldmlvdXNFdmVudFN0YXJ0VGltZTtcblxuICAgIC8vIEJlZm9yZSBleGl0aW5nLCBmbHVzaCBhbGwgdGhlIGltbWVkaWF0ZSB3b3JrIHRoYXQgd2FzIHNjaGVkdWxlZC5cbiAgICBmbHVzaEltbWVkaWF0ZVdvcmsoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9uZXh0KGV2ZW50SGFuZGxlcikge1xuICB2YXIgcHJpb3JpdHlMZXZlbCA9IHZvaWQgMDtcbiAgc3dpdGNoIChjdXJyZW50UHJpb3JpdHlMZXZlbCkge1xuICAgIGNhc2UgSW1tZWRpYXRlUHJpb3JpdHk6XG4gICAgY2FzZSBVc2VyQmxvY2tpbmdQcmlvcml0eTpcbiAgICBjYXNlIE5vcm1hbFByaW9yaXR5OlxuICAgICAgLy8gU2hpZnQgZG93biB0byBub3JtYWwgcHJpb3JpdHlcbiAgICAgIHByaW9yaXR5TGV2ZWwgPSBOb3JtYWxQcmlvcml0eTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBBbnl0aGluZyBsb3dlciB0aGFuIG5vcm1hbCBwcmlvcml0eSBzaG91bGQgcmVtYWluIGF0IHRoZSBjdXJyZW50IGxldmVsLlxuICAgICAgcHJpb3JpdHlMZXZlbCA9IGN1cnJlbnRQcmlvcml0eUxldmVsO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgcHJldmlvdXNQcmlvcml0eUxldmVsID0gY3VycmVudFByaW9yaXR5TGV2ZWw7XG4gIHZhciBwcmV2aW91c0V2ZW50U3RhcnRUaW1lID0gY3VycmVudEV2ZW50U3RhcnRUaW1lO1xuICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHByaW9yaXR5TGV2ZWw7XG4gIGN1cnJlbnRFdmVudFN0YXJ0VGltZSA9IGV4cG9ydHMudW5zdGFibGVfbm93KCk7XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZXZlbnRIYW5kbGVyKCk7XG4gIH0gZmluYWxseSB7XG4gICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmV2aW91c1ByaW9yaXR5TGV2ZWw7XG4gICAgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gcHJldmlvdXNFdmVudFN0YXJ0VGltZTtcblxuICAgIC8vIEJlZm9yZSBleGl0aW5nLCBmbHVzaCBhbGwgdGhlIGltbWVkaWF0ZSB3b3JrIHRoYXQgd2FzIHNjaGVkdWxlZC5cbiAgICBmbHVzaEltbWVkaWF0ZVdvcmsoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV93cmFwQ2FsbGJhY2soY2FsbGJhY2spIHtcbiAgdmFyIHBhcmVudFByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUaGlzIGlzIGEgZm9yayBvZiBydW5XaXRoUHJpb3JpdHksIGlubGluZWQgZm9yIHBlcmZvcm1hbmNlLlxuICAgIHZhciBwcmV2aW91c1ByaW9yaXR5TGV2ZWwgPSBjdXJyZW50UHJpb3JpdHlMZXZlbDtcbiAgICB2YXIgcHJldmlvdXNFdmVudFN0YXJ0VGltZSA9IGN1cnJlbnRFdmVudFN0YXJ0VGltZTtcbiAgICBjdXJyZW50UHJpb3JpdHlMZXZlbCA9IHBhcmVudFByaW9yaXR5TGV2ZWw7XG4gICAgY3VycmVudEV2ZW50U3RhcnRUaW1lID0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgY3VycmVudFByaW9yaXR5TGV2ZWwgPSBwcmV2aW91c1ByaW9yaXR5TGV2ZWw7XG4gICAgICBjdXJyZW50RXZlbnRTdGFydFRpbWUgPSBwcmV2aW91c0V2ZW50U3RhcnRUaW1lO1xuICAgICAgZmx1c2hJbW1lZGlhdGVXb3JrKCk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrKGNhbGxiYWNrLCBkZXByZWNhdGVkX29wdGlvbnMpIHtcbiAgdmFyIHN0YXJ0VGltZSA9IGN1cnJlbnRFdmVudFN0YXJ0VGltZSAhPT0gLTEgPyBjdXJyZW50RXZlbnRTdGFydFRpbWUgOiBleHBvcnRzLnVuc3RhYmxlX25vdygpO1xuXG4gIHZhciBleHBpcmF0aW9uVGltZTtcbiAgaWYgKHR5cGVvZiBkZXByZWNhdGVkX29wdGlvbnMgPT09ICdvYmplY3QnICYmIGRlcHJlY2F0ZWRfb3B0aW9ucyAhPT0gbnVsbCAmJiB0eXBlb2YgZGVwcmVjYXRlZF9vcHRpb25zLnRpbWVvdXQgPT09ICdudW1iZXInKSB7XG4gICAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIGJyYW5jaCBvbmNlIHdlIGxpZnQgZXhwaXJhdGlvbiB0aW1lcyBvdXQgb2YgUmVhY3QuXG4gICAgZXhwaXJhdGlvblRpbWUgPSBzdGFydFRpbWUgKyBkZXByZWNhdGVkX29wdGlvbnMudGltZW91dDtcbiAgfSBlbHNlIHtcbiAgICBzd2l0Y2ggKGN1cnJlbnRQcmlvcml0eUxldmVsKSB7XG4gICAgICBjYXNlIEltbWVkaWF0ZVByaW9yaXR5OlxuICAgICAgICBleHBpcmF0aW9uVGltZSA9IHN0YXJ0VGltZSArIElNTUVESUFURV9QUklPUklUWV9USU1FT1VUO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVXNlckJsb2NraW5nUHJpb3JpdHk6XG4gICAgICAgIGV4cGlyYXRpb25UaW1lID0gc3RhcnRUaW1lICsgVVNFUl9CTE9DS0lOR19QUklPUklUWTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIElkbGVQcmlvcml0eTpcbiAgICAgICAgZXhwaXJhdGlvblRpbWUgPSBzdGFydFRpbWUgKyBJRExFX1BSSU9SSVRZO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG93UHJpb3JpdHk6XG4gICAgICAgIGV4cGlyYXRpb25UaW1lID0gc3RhcnRUaW1lICsgTE9XX1BSSU9SSVRZX1RJTUVPVVQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBOb3JtYWxQcmlvcml0eTpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGV4cGlyYXRpb25UaW1lID0gc3RhcnRUaW1lICsgTk9STUFMX1BSSU9SSVRZX1RJTUVPVVQ7XG4gICAgfVxuICB9XG5cbiAgdmFyIG5ld05vZGUgPSB7XG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIHByaW9yaXR5TGV2ZWw6IGN1cnJlbnRQcmlvcml0eUxldmVsLFxuICAgIGV4cGlyYXRpb25UaW1lOiBleHBpcmF0aW9uVGltZSxcbiAgICBuZXh0OiBudWxsLFxuICAgIHByZXZpb3VzOiBudWxsXG4gIH07XG5cbiAgLy8gSW5zZXJ0IHRoZSBuZXcgY2FsbGJhY2sgaW50byB0aGUgbGlzdCwgb3JkZXJlZCBmaXJzdCBieSBleHBpcmF0aW9uLCB0aGVuXG4gIC8vIGJ5IGluc2VydGlvbi4gU28gdGhlIG5ldyBjYWxsYmFjayBpcyBpbnNlcnRlZCBhbnkgb3RoZXIgY2FsbGJhY2sgd2l0aFxuICAvLyBlcXVhbCBleHBpcmF0aW9uLlxuICBpZiAoZmlyc3RDYWxsYmFja05vZGUgPT09IG51bGwpIHtcbiAgICAvLyBUaGlzIGlzIHRoZSBmaXJzdCBjYWxsYmFjayBpbiB0aGUgbGlzdC5cbiAgICBmaXJzdENhbGxiYWNrTm9kZSA9IG5ld05vZGUubmV4dCA9IG5ld05vZGUucHJldmlvdXMgPSBuZXdOb2RlO1xuICAgIGVuc3VyZUhvc3RDYWxsYmFja0lzU2NoZWR1bGVkKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG5leHQgPSBudWxsO1xuICAgIHZhciBub2RlID0gZmlyc3RDYWxsYmFja05vZGU7XG4gICAgZG8ge1xuICAgICAgaWYgKG5vZGUuZXhwaXJhdGlvblRpbWUgPiBleHBpcmF0aW9uVGltZSkge1xuICAgICAgICAvLyBUaGUgbmV3IGNhbGxiYWNrIGV4cGlyZXMgYmVmb3JlIHRoaXMgb25lLlxuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH0gd2hpbGUgKG5vZGUgIT09IGZpcnN0Q2FsbGJhY2tOb2RlKTtcblxuICAgIGlmIChuZXh0ID09PSBudWxsKSB7XG4gICAgICAvLyBObyBjYWxsYmFjayB3aXRoIGEgbGF0ZXIgZXhwaXJhdGlvbiB3YXMgZm91bmQsIHdoaWNoIG1lYW5zIHRoZSBuZXdcbiAgICAgIC8vIGNhbGxiYWNrIGhhcyB0aGUgbGF0ZXN0IGV4cGlyYXRpb24gaW4gdGhlIGxpc3QuXG4gICAgICBuZXh0ID0gZmlyc3RDYWxsYmFja05vZGU7XG4gICAgfSBlbHNlIGlmIChuZXh0ID09PSBmaXJzdENhbGxiYWNrTm9kZSkge1xuICAgICAgLy8gVGhlIG5ldyBjYWxsYmFjayBoYXMgdGhlIGVhcmxpZXN0IGV4cGlyYXRpb24gaW4gdGhlIGVudGlyZSBsaXN0LlxuICAgICAgZmlyc3RDYWxsYmFja05vZGUgPSBuZXdOb2RlO1xuICAgICAgZW5zdXJlSG9zdENhbGxiYWNrSXNTY2hlZHVsZWQoKTtcbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXMgPSBuZXh0LnByZXZpb3VzO1xuICAgIHByZXZpb3VzLm5leHQgPSBuZXh0LnByZXZpb3VzID0gbmV3Tm9kZTtcbiAgICBuZXdOb2RlLm5leHQgPSBuZXh0O1xuICAgIG5ld05vZGUucHJldmlvdXMgPSBwcmV2aW91cztcbiAgfVxuXG4gIHJldHVybiBuZXdOb2RlO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbigpIHtcbiAgaXNTY2hlZHVsZXJQYXVzZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9jb250aW51ZUV4ZWN1dGlvbigpIHtcbiAgaXNTY2hlZHVsZXJQYXVzZWQgPSBmYWxzZTtcbiAgaWYgKGZpcnN0Q2FsbGJhY2tOb2RlICE9PSBudWxsKSB7XG4gICAgZW5zdXJlSG9zdENhbGxiYWNrSXNTY2hlZHVsZWQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9nZXRGaXJzdENhbGxiYWNrTm9kZSgpIHtcbiAgcmV0dXJuIGZpcnN0Q2FsbGJhY2tOb2RlO1xufVxuXG5mdW5jdGlvbiB1bnN0YWJsZV9jYW5jZWxDYWxsYmFjayhjYWxsYmFja05vZGUpIHtcbiAgdmFyIG5leHQgPSBjYWxsYmFja05vZGUubmV4dDtcbiAgaWYgKG5leHQgPT09IG51bGwpIHtcbiAgICAvLyBBbHJlYWR5IGNhbmNlbGxlZC5cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAobmV4dCA9PT0gY2FsbGJhY2tOb2RlKSB7XG4gICAgLy8gVGhpcyBpcyB0aGUgb25seSBzY2hlZHVsZWQgY2FsbGJhY2suIENsZWFyIHRoZSBsaXN0LlxuICAgIGZpcnN0Q2FsbGJhY2tOb2RlID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICAvLyBSZW1vdmUgdGhlIGNhbGxiYWNrIGZyb20gaXRzIHBvc2l0aW9uIGluIHRoZSBsaXN0LlxuICAgIGlmIChjYWxsYmFja05vZGUgPT09IGZpcnN0Q2FsbGJhY2tOb2RlKSB7XG4gICAgICBmaXJzdENhbGxiYWNrTm9kZSA9IG5leHQ7XG4gICAgfVxuICAgIHZhciBwcmV2aW91cyA9IGNhbGxiYWNrTm9kZS5wcmV2aW91cztcbiAgICBwcmV2aW91cy5uZXh0ID0gbmV4dDtcbiAgICBuZXh0LnByZXZpb3VzID0gcHJldmlvdXM7XG4gIH1cblxuICBjYWxsYmFja05vZGUubmV4dCA9IGNhbGxiYWNrTm9kZS5wcmV2aW91cyA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsKCkge1xuICByZXR1cm4gY3VycmVudFByaW9yaXR5TGV2ZWw7XG59XG5cbmZ1bmN0aW9uIHVuc3RhYmxlX3Nob3VsZFlpZWxkKCkge1xuICByZXR1cm4gIWN1cnJlbnREaWRUaW1lb3V0ICYmIChmaXJzdENhbGxiYWNrTm9kZSAhPT0gbnVsbCAmJiBmaXJzdENhbGxiYWNrTm9kZS5leHBpcmF0aW9uVGltZSA8IGN1cnJlbnRFeHBpcmF0aW9uVGltZSB8fCBzaG91bGRZaWVsZFRvSG9zdCgpKTtcbn1cblxuLy8gVGhlIHJlbWFpbmluZyBjb2RlIGlzIGVzc2VudGlhbGx5IGEgcG9seWZpbGwgZm9yIHJlcXVlc3RJZGxlQ2FsbGJhY2suIEl0XG4vLyB3b3JrcyBieSBzY2hlZHVsaW5nIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBzdG9yaW5nIHRoZSB0aW1lIGZvciB0aGUgc3RhcnRcbi8vIG9mIHRoZSBmcmFtZSwgdGhlbiBzY2hlZHVsaW5nIGEgcG9zdE1lc3NhZ2Ugd2hpY2ggZ2V0cyBzY2hlZHVsZWQgYWZ0ZXIgcGFpbnQuXG4vLyBXaXRoaW4gdGhlIHBvc3RNZXNzYWdlIGhhbmRsZXIgZG8gYXMgbXVjaCB3b3JrIGFzIHBvc3NpYmxlIHVudGlsIHRpbWUgKyBmcmFtZVxuLy8gcmF0ZS4gQnkgc2VwYXJhdGluZyB0aGUgaWRsZSBjYWxsIGludG8gYSBzZXBhcmF0ZSBldmVudCB0aWNrIHdlIGVuc3VyZSB0aGF0XG4vLyBsYXlvdXQsIHBhaW50IGFuZCBvdGhlciBicm93c2VyIHdvcmsgaXMgY291bnRlZCBhZ2FpbnN0IHRoZSBhdmFpbGFibGUgdGltZS5cbi8vIFRoZSBmcmFtZSByYXRlIGlzIGR5bmFtaWNhbGx5IGFkanVzdGVkLlxuXG4vLyBXZSBjYXB0dXJlIGEgbG9jYWwgcmVmZXJlbmNlIHRvIGFueSBnbG9iYWwsIGluIGNhc2UgaXQgZ2V0cyBwb2x5ZmlsbGVkIGFmdGVyXG4vLyB0aGlzIG1vZHVsZSBpcyBpbml0aWFsbHkgZXZhbHVhdGVkLiBXZSB3YW50IHRvIGJlIHVzaW5nIGFcbi8vIGNvbnNpc3RlbnQgaW1wbGVtZW50YXRpb24uXG52YXIgbG9jYWxEYXRlID0gRGF0ZTtcblxuLy8gVGhpcyBpbml0aWFsaXphdGlvbiBjb2RlIG1heSBydW4gZXZlbiBvbiBzZXJ2ZXIgZW52aXJvbm1lbnRzIGlmIGEgY29tcG9uZW50XG4vLyBqdXN0IGltcG9ydHMgUmVhY3RET00gKGUuZy4gZm9yIGZpbmRET01Ob2RlKS4gU29tZSBlbnZpcm9ubWVudHMgbWlnaHQgbm90XG4vLyBoYXZlIHNldFRpbWVvdXQgb3IgY2xlYXJUaW1lb3V0LiBIb3dldmVyLCB3ZSBhbHdheXMgZXhwZWN0IHRoZW0gdG8gYmUgZGVmaW5lZFxuLy8gb24gdGhlIGNsaWVudC4gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L3B1bGwvMTMwODhcbnZhciBsb2NhbFNldFRpbWVvdXQgPSB0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJyA/IHNldFRpbWVvdXQgOiB1bmRlZmluZWQ7XG52YXIgbG9jYWxDbGVhclRpbWVvdXQgPSB0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nID8gY2xlYXJUaW1lb3V0IDogdW5kZWZpbmVkO1xuXG4vLyBXZSBkb24ndCBleHBlY3QgZWl0aGVyIG9mIHRoZXNlIHRvIG5lY2Vzc2FyaWx5IGJlIGRlZmluZWQsIGJ1dCB3ZSB3aWxsIGVycm9yXG4vLyBsYXRlciBpZiB0aGV5IGFyZSBtaXNzaW5nIG9uIHRoZSBjbGllbnQuXG52YXIgbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nID8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIDogdW5kZWZpbmVkO1xudmFyIGxvY2FsQ2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB0eXBlb2YgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicgPyBjYW5jZWxBbmltYXRpb25GcmFtZSA6IHVuZGVmaW5lZDtcblxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGRvZXMgbm90IHJ1biB3aGVuIHRoZSB0YWIgaXMgaW4gdGhlIGJhY2tncm91bmQuIElmXG4vLyB3ZSdyZSBiYWNrZ3JvdW5kZWQgd2UgcHJlZmVyIGZvciB0aGF0IHdvcmsgdG8gaGFwcGVuIHNvIHRoYXQgdGhlIHBhZ2Vcbi8vIGNvbnRpbnVlcyB0byBsb2FkIGluIHRoZSBiYWNrZ3JvdW5kLiBTbyB3ZSBhbHNvIHNjaGVkdWxlIGEgJ3NldFRpbWVvdXQnIGFzXG4vLyBhIGZhbGxiYWNrLlxuLy8gVE9ETzogTmVlZCBhIGJldHRlciBoZXVyaXN0aWMgZm9yIGJhY2tncm91bmRlZCB3b3JrLlxudmFyIEFOSU1BVElPTl9GUkFNRV9USU1FT1VUID0gMTAwO1xudmFyIHJBRklEO1xudmFyIHJBRlRpbWVvdXRJRDtcbnZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWVXaXRoVGltZW91dCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAvLyBzY2hlZHVsZSByQUYgYW5kIGFsc28gYSBzZXRUaW1lb3V0XG4gIHJBRklEID0gbG9jYWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuICAgIC8vIGNhbmNlbCB0aGUgc2V0VGltZW91dFxuICAgIGxvY2FsQ2xlYXJUaW1lb3V0KHJBRlRpbWVvdXRJRCk7XG4gICAgY2FsbGJhY2sodGltZXN0YW1wKTtcbiAgfSk7XG4gIHJBRlRpbWVvdXRJRCA9IGxvY2FsU2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgLy8gY2FuY2VsIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICBsb2NhbENhbmNlbEFuaW1hdGlvbkZyYW1lKHJBRklEKTtcbiAgICBjYWxsYmFjayhleHBvcnRzLnVuc3RhYmxlX25vdygpKTtcbiAgfSwgQU5JTUFUSU9OX0ZSQU1FX1RJTUVPVVQpO1xufTtcblxuaWYgKGhhc05hdGl2ZVBlcmZvcm1hbmNlTm93KSB7XG4gIHZhciBQZXJmb3JtYW5jZSA9IHBlcmZvcm1hbmNlO1xuICBleHBvcnRzLnVuc3RhYmxlX25vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUGVyZm9ybWFuY2Uubm93KCk7XG4gIH07XG59IGVsc2Uge1xuICBleHBvcnRzLnVuc3RhYmxlX25vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbG9jYWxEYXRlLm5vdygpO1xuICB9O1xufVxuXG52YXIgcmVxdWVzdEhvc3RDYWxsYmFjaztcbnZhciBjYW5jZWxIb3N0Q2FsbGJhY2s7XG52YXIgc2hvdWxkWWllbGRUb0hvc3Q7XG5cbnZhciBnbG9iYWxWYWx1ZSA9IG51bGw7XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgZ2xvYmFsVmFsdWUgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gIGdsb2JhbFZhbHVlID0gZ2xvYmFsO1xufVxuXG5pZiAoZ2xvYmFsVmFsdWUgJiYgZ2xvYmFsVmFsdWUuX3NjaGVkTW9jaykge1xuICAvLyBEeW5hbWljIGluamVjdGlvbiwgb25seSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cbiAgdmFyIGdsb2JhbEltcGwgPSBnbG9iYWxWYWx1ZS5fc2NoZWRNb2NrO1xuICByZXF1ZXN0SG9zdENhbGxiYWNrID0gZ2xvYmFsSW1wbFswXTtcbiAgY2FuY2VsSG9zdENhbGxiYWNrID0gZ2xvYmFsSW1wbFsxXTtcbiAgc2hvdWxkWWllbGRUb0hvc3QgPSBnbG9iYWxJbXBsWzJdO1xuICBleHBvcnRzLnVuc3RhYmxlX25vdyA9IGdsb2JhbEltcGxbM107XG59IGVsc2UgaWYgKFxuLy8gSWYgU2NoZWR1bGVyIHJ1bnMgaW4gYSBub24tRE9NIGVudmlyb25tZW50LCBpdCBmYWxscyBiYWNrIHRvIGEgbmFpdmVcbi8vIGltcGxlbWVudGF0aW9uIHVzaW5nIHNldFRpbWVvdXQuXG50eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fFxuLy8gQ2hlY2sgaWYgTWVzc2FnZUNoYW5uZWwgaXMgc3VwcG9ydGVkLCB0b28uXG50eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICdmdW5jdGlvbicpIHtcbiAgLy8gSWYgdGhpcyBhY2NpZGVudGFsbHkgZ2V0cyBpbXBvcnRlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50LCBlLmcuIEphdmFTY3JpcHRDb3JlLFxuICAvLyBmYWxsYmFjayB0byBhIG5haXZlIGltcGxlbWVudGF0aW9uLlxuICB2YXIgX2NhbGxiYWNrID0gbnVsbDtcbiAgdmFyIF9mbHVzaENhbGxiYWNrID0gZnVuY3Rpb24gKGRpZFRpbWVvdXQpIHtcbiAgICBpZiAoX2NhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBfY2FsbGJhY2soZGlkVGltZW91dCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfY2FsbGJhY2sgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgcmVxdWVzdEhvc3RDYWxsYmFjayA9IGZ1bmN0aW9uIChjYiwgbXMpIHtcbiAgICBpZiAoX2NhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAvLyBQcm90ZWN0IGFnYWluc3QgcmUtZW50cmFuY3kuXG4gICAgICBzZXRUaW1lb3V0KHJlcXVlc3RIb3N0Q2FsbGJhY2ssIDAsIGNiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2NhbGxiYWNrID0gY2I7XG4gICAgICBzZXRUaW1lb3V0KF9mbHVzaENhbGxiYWNrLCAwLCBmYWxzZSk7XG4gICAgfVxuICB9O1xuICBjYW5jZWxIb3N0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2NhbGxiYWNrID0gbnVsbDtcbiAgfTtcbiAgc2hvdWxkWWllbGRUb0hvc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSBlbHNlIHtcbiAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIFRPRE86IFJlbW92ZSBmYi5tZSBsaW5rXG4gICAgaWYgKHR5cGVvZiBsb2NhbFJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS5lcnJvcihcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLiBcIiArICdNYWtlIHN1cmUgdGhhdCB5b3UgbG9hZCBhICcgKyAncG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vZmIubWUvcmVhY3QtcG9seWZpbGxzJyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbG9jYWxDYW5jZWxBbmltYXRpb25GcmFtZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS5lcnJvcihcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgY2FuY2VsQW5pbWF0aW9uRnJhbWUuIFwiICsgJ01ha2Ugc3VyZSB0aGF0IHlvdSBsb2FkIGEgJyArICdwb2x5ZmlsbCBpbiBvbGRlciBicm93c2Vycy4gaHR0cHM6Ly9mYi5tZS9yZWFjdC1wb2x5ZmlsbHMnKTtcbiAgICB9XG4gIH1cblxuICB2YXIgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gbnVsbDtcbiAgdmFyIGlzTWVzc2FnZUV2ZW50U2NoZWR1bGVkID0gZmFsc2U7XG4gIHZhciB0aW1lb3V0VGltZSA9IC0xO1xuXG4gIHZhciBpc0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgdmFyIGlzRmx1c2hpbmdIb3N0Q2FsbGJhY2sgPSBmYWxzZTtcblxuICB2YXIgZnJhbWVEZWFkbGluZSA9IDA7XG4gIC8vIFdlIHN0YXJ0IG91dCBhc3N1bWluZyB0aGF0IHdlIHJ1biBhdCAzMGZwcyBidXQgdGhlbiB0aGUgaGV1cmlzdGljIHRyYWNraW5nXG4gIC8vIHdpbGwgYWRqdXN0IHRoaXMgdmFsdWUgdG8gYSBmYXN0ZXIgZnBzIGlmIHdlIGdldCBtb3JlIGZyZXF1ZW50IGFuaW1hdGlvblxuICAvLyBmcmFtZXMuXG4gIHZhciBwcmV2aW91c0ZyYW1lVGltZSA9IDMzO1xuICB2YXIgYWN0aXZlRnJhbWVUaW1lID0gMzM7XG5cbiAgc2hvdWxkWWllbGRUb0hvc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZyYW1lRGVhZGxpbmUgPD0gZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcbiAgfTtcblxuICAvLyBXZSB1c2UgdGhlIHBvc3RNZXNzYWdlIHRyaWNrIHRvIGRlZmVyIGlkbGUgd29yayB1bnRpbCBhZnRlciB0aGUgcmVwYWludC5cbiAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgdmFyIHBvcnQgPSBjaGFubmVsLnBvcnQyO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlzTWVzc2FnZUV2ZW50U2NoZWR1bGVkID0gZmFsc2U7XG5cbiAgICB2YXIgcHJldlNjaGVkdWxlZENhbGxiYWNrID0gc2NoZWR1bGVkSG9zdENhbGxiYWNrO1xuICAgIHZhciBwcmV2VGltZW91dFRpbWUgPSB0aW1lb3V0VGltZTtcbiAgICBzY2hlZHVsZWRIb3N0Q2FsbGJhY2sgPSBudWxsO1xuICAgIHRpbWVvdXRUaW1lID0gLTE7XG5cbiAgICB2YXIgY3VycmVudFRpbWUgPSBleHBvcnRzLnVuc3RhYmxlX25vdygpO1xuXG4gICAgdmFyIGRpZFRpbWVvdXQgPSBmYWxzZTtcbiAgICBpZiAoZnJhbWVEZWFkbGluZSAtIGN1cnJlbnRUaW1lIDw9IDApIHtcbiAgICAgIC8vIFRoZXJlJ3Mgbm8gdGltZSBsZWZ0IGluIHRoaXMgaWRsZSBwZXJpb2QuIENoZWNrIGlmIHRoZSBjYWxsYmFjayBoYXNcbiAgICAgIC8vIGEgdGltZW91dCBhbmQgd2hldGhlciBpdCdzIGJlZW4gZXhjZWVkZWQuXG4gICAgICBpZiAocHJldlRpbWVvdXRUaW1lICE9PSAtMSAmJiBwcmV2VGltZW91dFRpbWUgPD0gY3VycmVudFRpbWUpIHtcbiAgICAgICAgLy8gRXhjZWVkZWQgdGhlIHRpbWVvdXQuIEludm9rZSB0aGUgY2FsbGJhY2sgZXZlbiB0aG91Z2ggdGhlcmUncyBub1xuICAgICAgICAvLyB0aW1lIGxlZnQuXG4gICAgICAgIGRpZFRpbWVvdXQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm8gdGltZW91dC5cbiAgICAgICAgaWYgKCFpc0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVkKSB7XG4gICAgICAgICAgLy8gU2NoZWR1bGUgYW5vdGhlciBhbmltYXRpb24gY2FsbGJhY2sgc28gd2UgcmV0cnkgbGF0ZXIuXG4gICAgICAgICAgaXNBbmltYXRpb25GcmFtZVNjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lV2l0aFRpbWVvdXQoYW5pbWF0aW9uVGljayk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXhpdCB3aXRob3V0IGludm9raW5nIHRoZSBjYWxsYmFjay5cbiAgICAgICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gcHJldlNjaGVkdWxlZENhbGxiYWNrO1xuICAgICAgICB0aW1lb3V0VGltZSA9IHByZXZUaW1lb3V0VGltZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcmV2U2NoZWR1bGVkQ2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgIGlzRmx1c2hpbmdIb3N0Q2FsbGJhY2sgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcHJldlNjaGVkdWxlZENhbGxiYWNrKGRpZFRpbWVvdXQpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaXNGbHVzaGluZ0hvc3RDYWxsYmFjayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgYW5pbWF0aW9uVGljayA9IGZ1bmN0aW9uIChyYWZUaW1lKSB7XG4gICAgaWYgKHNjaGVkdWxlZEhvc3RDYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgLy8gRWFnZXJseSBzY2hlZHVsZSB0aGUgbmV4dCBhbmltYXRpb24gY2FsbGJhY2sgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGVcbiAgICAgIC8vIGZyYW1lLiBJZiB0aGUgc2NoZWR1bGVyIHF1ZXVlIGlzIG5vdCBlbXB0eSBhdCB0aGUgZW5kIG9mIHRoZSBmcmFtZSwgaXRcbiAgICAgIC8vIHdpbGwgY29udGludWUgZmx1c2hpbmcgaW5zaWRlIHRoYXQgY2FsbGJhY2suIElmIHRoZSBxdWV1ZSAqaXMqIGVtcHR5LFxuICAgICAgLy8gdGhlbiBpdCB3aWxsIGV4aXQgaW1tZWRpYXRlbHkuIFBvc3RpbmcgdGhlIGNhbGxiYWNrIGF0IHRoZSBzdGFydCBvZiB0aGVcbiAgICAgIC8vIGZyYW1lIGVuc3VyZXMgaXQncyBmaXJlZCB3aXRoaW4gdGhlIGVhcmxpZXN0IHBvc3NpYmxlIGZyYW1lLiBJZiB3ZVxuICAgICAgLy8gd2FpdGVkIHVudGlsIHRoZSBlbmQgb2YgdGhlIGZyYW1lIHRvIHBvc3QgdGhlIGNhbGxiYWNrLCB3ZSByaXNrIHRoZVxuICAgICAgLy8gYnJvd3NlciBza2lwcGluZyBhIGZyYW1lIGFuZCBub3QgZmlyaW5nIHRoZSBjYWxsYmFjayB1bnRpbCB0aGUgZnJhbWVcbiAgICAgIC8vIGFmdGVyIHRoYXQuXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWVXaXRoVGltZW91dChhbmltYXRpb25UaWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gcGVuZGluZyB3b3JrLiBFeGl0LlxuICAgICAgaXNBbmltYXRpb25GcmFtZVNjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0RnJhbWVUaW1lID0gcmFmVGltZSAtIGZyYW1lRGVhZGxpbmUgKyBhY3RpdmVGcmFtZVRpbWU7XG4gICAgaWYgKG5leHRGcmFtZVRpbWUgPCBhY3RpdmVGcmFtZVRpbWUgJiYgcHJldmlvdXNGcmFtZVRpbWUgPCBhY3RpdmVGcmFtZVRpbWUpIHtcbiAgICAgIGlmIChuZXh0RnJhbWVUaW1lIDwgOCkge1xuICAgICAgICAvLyBEZWZlbnNpdmUgY29kaW5nLiBXZSBkb24ndCBzdXBwb3J0IGhpZ2hlciBmcmFtZSByYXRlcyB0aGFuIDEyMGh6LlxuICAgICAgICAvLyBJZiB0aGUgY2FsY3VsYXRlZCBmcmFtZSB0aW1lIGdldHMgbG93ZXIgdGhhbiA4LCBpdCBpcyBwcm9iYWJseSBhIGJ1Zy5cbiAgICAgICAgbmV4dEZyYW1lVGltZSA9IDg7XG4gICAgICB9XG4gICAgICAvLyBJZiBvbmUgZnJhbWUgZ29lcyBsb25nLCB0aGVuIHRoZSBuZXh0IG9uZSBjYW4gYmUgc2hvcnQgdG8gY2F0Y2ggdXAuXG4gICAgICAvLyBJZiB0d28gZnJhbWVzIGFyZSBzaG9ydCBpbiBhIHJvdywgdGhlbiB0aGF0J3MgYW4gaW5kaWNhdGlvbiB0aGF0IHdlXG4gICAgICAvLyBhY3R1YWxseSBoYXZlIGEgaGlnaGVyIGZyYW1lIHJhdGUgdGhhbiB3aGF0IHdlJ3JlIGN1cnJlbnRseSBvcHRpbWl6aW5nLlxuICAgICAgLy8gV2UgYWRqdXN0IG91ciBoZXVyaXN0aWMgZHluYW1pY2FsbHkgYWNjb3JkaW5nbHkuIEZvciBleGFtcGxlLCBpZiB3ZSdyZVxuICAgICAgLy8gcnVubmluZyBvbiAxMjBoeiBkaXNwbGF5IG9yIDkwaHogVlIgZGlzcGxheS5cbiAgICAgIC8vIFRha2UgdGhlIG1heCBvZiB0aGUgdHdvIGluIGNhc2Ugb25lIG9mIHRoZW0gd2FzIGFuIGFub21hbHkgZHVlIHRvXG4gICAgICAvLyBtaXNzZWQgZnJhbWUgZGVhZGxpbmVzLlxuICAgICAgYWN0aXZlRnJhbWVUaW1lID0gbmV4dEZyYW1lVGltZSA8IHByZXZpb3VzRnJhbWVUaW1lID8gcHJldmlvdXNGcmFtZVRpbWUgOiBuZXh0RnJhbWVUaW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmV2aW91c0ZyYW1lVGltZSA9IG5leHRGcmFtZVRpbWU7XG4gICAgfVxuICAgIGZyYW1lRGVhZGxpbmUgPSByYWZUaW1lICsgYWN0aXZlRnJhbWVUaW1lO1xuICAgIGlmICghaXNNZXNzYWdlRXZlbnRTY2hlZHVsZWQpIHtcbiAgICAgIGlzTWVzc2FnZUV2ZW50U2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgIHBvcnQucG9zdE1lc3NhZ2UodW5kZWZpbmVkKTtcbiAgICB9XG4gIH07XG5cbiAgcmVxdWVzdEhvc3RDYWxsYmFjayA9IGZ1bmN0aW9uIChjYWxsYmFjaywgYWJzb2x1dGVUaW1lb3V0KSB7XG4gICAgc2NoZWR1bGVkSG9zdENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgdGltZW91dFRpbWUgPSBhYnNvbHV0ZVRpbWVvdXQ7XG4gICAgaWYgKGlzRmx1c2hpbmdIb3N0Q2FsbGJhY2sgfHwgYWJzb2x1dGVUaW1lb3V0IDwgMCkge1xuICAgICAgLy8gRG9uJ3Qgd2FpdCBmb3IgdGhlIG5leHQgZnJhbWUuIENvbnRpbnVlIHdvcmtpbmcgQVNBUCwgaW4gYSBuZXcgZXZlbnQuXG4gICAgICBwb3J0LnBvc3RNZXNzYWdlKHVuZGVmaW5lZCk7XG4gICAgfSBlbHNlIGlmICghaXNBbmltYXRpb25GcmFtZVNjaGVkdWxlZCkge1xuICAgICAgLy8gSWYgckFGIGRpZG4ndCBhbHJlYWR5IHNjaGVkdWxlIG9uZSwgd2UgbmVlZCB0byBzY2hlZHVsZSBhIGZyYW1lLlxuICAgICAgLy8gVE9ETzogSWYgdGhpcyByQUYgZG9lc24ndCBtYXRlcmlhbGl6ZSBiZWNhdXNlIHRoZSBicm93c2VyIHRocm90dGxlcywgd2VcbiAgICAgIC8vIG1pZ2h0IHdhbnQgdG8gc3RpbGwgaGF2ZSBzZXRUaW1lb3V0IHRyaWdnZXIgcklDIGFzIGEgYmFja3VwIHRvIGVuc3VyZVxuICAgICAgLy8gdGhhdCB3ZSBrZWVwIHBlcmZvcm1pbmcgd29yay5cbiAgICAgIGlzQW5pbWF0aW9uRnJhbWVTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lV2l0aFRpbWVvdXQoYW5pbWF0aW9uVGljayk7XG4gICAgfVxuICB9O1xuXG4gIGNhbmNlbEhvc3RDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICBzY2hlZHVsZWRIb3N0Q2FsbGJhY2sgPSBudWxsO1xuICAgIGlzTWVzc2FnZUV2ZW50U2NoZWR1bGVkID0gZmFsc2U7XG4gICAgdGltZW91dFRpbWUgPSAtMTtcbiAgfTtcbn1cblxuZXhwb3J0cy51bnN0YWJsZV9JbW1lZGlhdGVQcmlvcml0eSA9IEltbWVkaWF0ZVByaW9yaXR5O1xuZXhwb3J0cy51bnN0YWJsZV9Vc2VyQmxvY2tpbmdQcmlvcml0eSA9IFVzZXJCbG9ja2luZ1ByaW9yaXR5O1xuZXhwb3J0cy51bnN0YWJsZV9Ob3JtYWxQcmlvcml0eSA9IE5vcm1hbFByaW9yaXR5O1xuZXhwb3J0cy51bnN0YWJsZV9JZGxlUHJpb3JpdHkgPSBJZGxlUHJpb3JpdHk7XG5leHBvcnRzLnVuc3RhYmxlX0xvd1ByaW9yaXR5ID0gTG93UHJpb3JpdHk7XG5leHBvcnRzLnVuc3RhYmxlX3J1bldpdGhQcmlvcml0eSA9IHVuc3RhYmxlX3J1bldpdGhQcmlvcml0eTtcbmV4cG9ydHMudW5zdGFibGVfbmV4dCA9IHVuc3RhYmxlX25leHQ7XG5leHBvcnRzLnVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2sgPSB1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrO1xuZXhwb3J0cy51bnN0YWJsZV9jYW5jZWxDYWxsYmFjayA9IHVuc3RhYmxlX2NhbmNlbENhbGxiYWNrO1xuZXhwb3J0cy51bnN0YWJsZV93cmFwQ2FsbGJhY2sgPSB1bnN0YWJsZV93cmFwQ2FsbGJhY2s7XG5leHBvcnRzLnVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsID0gdW5zdGFibGVfZ2V0Q3VycmVudFByaW9yaXR5TGV2ZWw7XG5leHBvcnRzLnVuc3RhYmxlX3Nob3VsZFlpZWxkID0gdW5zdGFibGVfc2hvdWxkWWllbGQ7XG5leHBvcnRzLnVuc3RhYmxlX2NvbnRpbnVlRXhlY3V0aW9uID0gdW5zdGFibGVfY29udGludWVFeGVjdXRpb247XG5leHBvcnRzLnVuc3RhYmxlX3BhdXNlRXhlY3V0aW9uID0gdW5zdGFibGVfcGF1c2VFeGVjdXRpb247XG5leHBvcnRzLnVuc3RhYmxlX2dldEZpcnN0Q2FsbGJhY2tOb2RlID0gdW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGU7XG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3NjaGVkdWxlci5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiLyoganNoaW50IGJyb3dzZXI6IHRydWUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuLy8gV2UnbGwgY29weSB0aGUgcHJvcGVydGllcyBiZWxvdyBpbnRvIHRoZSBtaXJyb3IgZGl2LlxuLy8gTm90ZSB0aGF0IHNvbWUgYnJvd3NlcnMsIHN1Y2ggYXMgRmlyZWZveCwgZG8gbm90IGNvbmNhdGVuYXRlIHByb3BlcnRpZXNcbi8vIGludG8gdGhlaXIgc2hvcnRoYW5kIChlLmcuIHBhZGRpbmctdG9wLCBwYWRkaW5nLWJvdHRvbSBldGMuIC0+IHBhZGRpbmcpLFxuLy8gc28gd2UgaGF2ZSB0byBsaXN0IGV2ZXJ5IHNpbmdsZSBwcm9wZXJ0eSBleHBsaWNpdGx5LlxudmFyIHByb3BlcnRpZXMgPSBbXG4gICdkaXJlY3Rpb24nLCAgLy8gUlRMIHN1cHBvcnRcbiAgJ2JveFNpemluZycsXG4gICd3aWR0aCcsICAvLyBvbiBDaHJvbWUgYW5kIElFLCBleGNsdWRlIHRoZSBzY3JvbGxiYXIsIHNvIHRoZSBtaXJyb3IgZGl2IHdyYXBzIGV4YWN0bHkgYXMgdGhlIHRleHRhcmVhIGRvZXNcbiAgJ2hlaWdodCcsXG4gICdvdmVyZmxvd1gnLFxuICAnb3ZlcmZsb3dZJywgIC8vIGNvcHkgdGhlIHNjcm9sbGJhciBmb3IgSUVcblxuICAnYm9yZGVyVG9wV2lkdGgnLFxuICAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdib3JkZXJMZWZ0V2lkdGgnLFxuICAnYm9yZGVyU3R5bGUnLFxuXG4gICdwYWRkaW5nVG9wJyxcbiAgJ3BhZGRpbmdSaWdodCcsXG4gICdwYWRkaW5nQm90dG9tJyxcbiAgJ3BhZGRpbmdMZWZ0JyxcblxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvZm9udFxuICAnZm9udFN0eWxlJyxcbiAgJ2ZvbnRWYXJpYW50JyxcbiAgJ2ZvbnRXZWlnaHQnLFxuICAnZm9udFN0cmV0Y2gnLFxuICAnZm9udFNpemUnLFxuICAnZm9udFNpemVBZGp1c3QnLFxuICAnbGluZUhlaWdodCcsXG4gICdmb250RmFtaWx5JyxcblxuICAndGV4dEFsaWduJyxcbiAgJ3RleHRUcmFuc2Zvcm0nLFxuICAndGV4dEluZGVudCcsXG4gICd0ZXh0RGVjb3JhdGlvbicsICAvLyBtaWdodCBub3QgbWFrZSBhIGRpZmZlcmVuY2UsIGJ1dCBiZXR0ZXIgYmUgc2FmZVxuXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ3dvcmRTcGFjaW5nJyxcblxuICAndGFiU2l6ZScsXG4gICdNb3pUYWJTaXplJ1xuXG5dO1xuXG52YXIgaXNCcm93c2VyID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKTtcbnZhciBpc0ZpcmVmb3ggPSAoaXNCcm93c2VyICYmIHdpbmRvdy5tb3pJbm5lclNjcmVlblggIT0gbnVsbCk7XG5cbmZ1bmN0aW9uIGdldENhcmV0Q29vcmRpbmF0ZXMoZWxlbWVudCwgcG9zaXRpb24sIG9wdGlvbnMpIHtcbiAgaWYgKCFpc0Jyb3dzZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RleHRhcmVhLWNhcmV0LXBvc2l0aW9uI2dldENhcmV0Q29vcmRpbmF0ZXMgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIGEgYnJvd3NlcicpO1xuICB9XG5cbiAgdmFyIGRlYnVnID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlYnVnIHx8IGZhbHNlO1xuICBpZiAoZGVidWcpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXQtdGV4dGFyZWEtY2FyZXQtcG9zaXRpb24tbWlycm9yLWRpdicpO1xuICAgIGlmIChlbCkgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gIH1cblxuICAvLyBUaGUgbWlycm9yIGRpdiB3aWxsIHJlcGxpY2F0ZSB0aGUgdGV4dGFyZWEncyBzdHlsZVxuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5pZCA9ICdpbnB1dC10ZXh0YXJlYS1jYXJldC1wb3NpdGlvbi1taXJyb3ItZGl2JztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuXG4gIHZhciBzdHlsZSA9IGRpdi5zdHlsZTtcbiAgdmFyIGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSA6IGVsZW1lbnQuY3VycmVudFN0eWxlOyAgLy8gY3VycmVudFN0eWxlIGZvciBJRSA8IDlcbiAgdmFyIGlzSW5wdXQgPSBlbGVtZW50Lm5vZGVOYW1lID09PSAnSU5QVVQnO1xuXG4gIC8vIERlZmF1bHQgdGV4dGFyZWEgc3R5bGVzXG4gIHN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnO1xuICBpZiAoIWlzSW5wdXQpXG4gICAgc3R5bGUud29yZFdyYXAgPSAnYnJlYWstd29yZCc7ICAvLyBvbmx5IGZvciB0ZXh0YXJlYS1zXG5cbiAgLy8gUG9zaXRpb24gb2ZmLXNjcmVlblxuICBzdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7ICAvLyByZXF1aXJlZCB0byByZXR1cm4gY29vcmRpbmF0ZXMgcHJvcGVybHlcbiAgaWYgKCFkZWJ1ZylcbiAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7ICAvLyBub3QgJ2Rpc3BsYXk6IG5vbmUnIGJlY2F1c2Ugd2Ugd2FudCByZW5kZXJpbmdcblxuICAvLyBUcmFuc2ZlciB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMgdG8gdGhlIGRpdlxuICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICBpZiAoaXNJbnB1dCAmJiBwcm9wID09PSAnbGluZUhlaWdodCcpIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgPGlucHV0PnMgYmVjYXVzZSB0ZXh0IGlzIHJlbmRlcmVkIGNlbnRlcmVkIGFuZCBsaW5lIGhlaWdodCBtYXkgYmUgIT0gaGVpZ2h0XG4gICAgICBzdHlsZS5saW5lSGVpZ2h0ID0gY29tcHV0ZWQuaGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZVtwcm9wXSA9IGNvbXB1dGVkW3Byb3BdO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGlzRmlyZWZveCkge1xuICAgIC8vIEZpcmVmb3ggbGllcyBhYm91dCB0aGUgb3ZlcmZsb3cgcHJvcGVydHkgZm9yIHRleHRhcmVhczogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9OTg0Mjc1XG4gICAgaWYgKGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gcGFyc2VJbnQoY29tcHV0ZWQuaGVpZ2h0KSlcbiAgICAgIHN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7ICAvLyBmb3IgQ2hyb21lIHRvIG5vdCByZW5kZXIgYSBzY3JvbGxiYXI7IElFIGtlZXBzIG92ZXJmbG93WSA9ICdzY3JvbGwnXG4gIH1cblxuICBkaXYudGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZygwLCBwb3NpdGlvbik7XG4gIC8vIFRoZSBzZWNvbmQgc3BlY2lhbCBoYW5kbGluZyBmb3IgaW5wdXQgdHlwZT1cInRleHRcIiB2cyB0ZXh0YXJlYTpcbiAgLy8gc3BhY2VzIG5lZWQgdG8gYmUgcmVwbGFjZWQgd2l0aCBub24tYnJlYWtpbmcgc3BhY2VzIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTM0MDIwMzUvMTI2OTAzN1xuICBpZiAoaXNJbnB1dClcbiAgICBkaXYudGV4dENvbnRlbnQgPSBkaXYudGV4dENvbnRlbnQucmVwbGFjZSgvXFxzL2csICdcXHUwMGEwJyk7XG5cbiAgdmFyIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIC8vIFdyYXBwaW5nIG11c3QgYmUgcmVwbGljYXRlZCAqZXhhY3RseSosIGluY2x1ZGluZyB3aGVuIGEgbG9uZyB3b3JkIGdldHNcbiAgLy8gb250byB0aGUgbmV4dCBsaW5lLCB3aXRoIHdoaXRlc3BhY2UgYXQgdGhlIGVuZCBvZiB0aGUgbGluZSBiZWZvcmUgKCM3KS5cbiAgLy8gVGhlICAqb25seSogcmVsaWFibGUgd2F5IHRvIGRvIHRoYXQgaXMgdG8gY29weSB0aGUgKmVudGlyZSogcmVzdCBvZiB0aGVcbiAgLy8gdGV4dGFyZWEncyBjb250ZW50IGludG8gdGhlIDxzcGFuPiBjcmVhdGVkIGF0IHRoZSBjYXJldCBwb3NpdGlvbi5cbiAgLy8gRm9yIGlucHV0cywganVzdCAnLicgd291bGQgYmUgZW5vdWdoLCBidXQgbm8gbmVlZCB0byBib3RoZXIuXG4gIHNwYW4udGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZyhwb3NpdGlvbikgfHwgJy4nOyAgLy8gfHwgYmVjYXVzZSBhIGNvbXBsZXRlbHkgZW1wdHkgZmF1eCBzcGFuIGRvZXNuJ3QgcmVuZGVyIGF0IGFsbFxuICBkaXYuYXBwZW5kQ2hpbGQoc3Bhbik7XG5cbiAgdmFyIGNvb3JkaW5hdGVzID0ge1xuICAgIHRvcDogc3Bhbi5vZmZzZXRUb3AgKyBwYXJzZUludChjb21wdXRlZFsnYm9yZGVyVG9wV2lkdGgnXSksXG4gICAgbGVmdDogc3Bhbi5vZmZzZXRMZWZ0ICsgcGFyc2VJbnQoY29tcHV0ZWRbJ2JvcmRlckxlZnRXaWR0aCddKSxcbiAgICBoZWlnaHQ6IHBhcnNlSW50KGNvbXB1dGVkWydsaW5lSGVpZ2h0J10pXG4gIH07XG5cbiAgaWYgKGRlYnVnKSB7XG4gICAgc3Bhbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2FhYSc7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuICB9XG5cbiAgcmV0dXJuIGNvb3JkaW5hdGVzO1xufVxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBnZXRDYXJldENvb3JkaW5hdGVzO1xufSBlbHNlIGlmKGlzQnJvd3Nlcikge1xuICB3aW5kb3cuZ2V0Q2FyZXRDb29yZGluYXRlcyA9IGdldENhcmV0Q29vcmRpbmF0ZXM7XG59XG5cbn0oKSk7XG4iLCJ2YXIgdjEgPSByZXF1aXJlKCcuL3YxJyk7XG52YXIgdjQgPSByZXF1aXJlKCcuL3Y0Jyk7XG5cbnZhciB1dWlkID0gdjQ7XG51dWlkLnYxID0gdjE7XG51dWlkLnY0ID0gdjQ7XG5cbm1vZHVsZS5leHBvcnRzID0gdXVpZDtcbiIsIi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xudmFyIGJ5dGVUb0hleCA9IFtdO1xuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXhbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xufVxuXG5mdW5jdGlvbiBieXRlc1RvVXVpZChidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IG9mZnNldCB8fCAwO1xuICB2YXIgYnRoID0gYnl0ZVRvSGV4O1xuICAvLyBqb2luIHVzZWQgdG8gZml4IG1lbW9yeSBpc3N1ZSBjYXVzZWQgYnkgY29uY2F0ZW5hdGlvbjogaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzE3NSNjNFxuICByZXR1cm4gKFtidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCBcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dXSkuam9pbignJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnl0ZXNUb1V1aWQ7XG4iLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxuXG4vLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG9cbi8vIGltcGxlbWVudGF0aW9uLiBBbHNvLCBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gb24gSUUxMS5cbnZhciBnZXRSYW5kb21WYWx1ZXMgPSAodHlwZW9mKGNyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mKG1zQ3J5cHRvKSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93Lm1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKSk7XG5cbmlmIChnZXRSYW5kb21WYWx1ZXMpIHtcbiAgLy8gV0hBVFdHIGNyeXB0byBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG4gIHZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG4gICAgcmV0dXJuIHJuZHM4O1xuICB9O1xufSBlbHNlIHtcbiAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAvL1xuICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAvLyBxdWFsaXR5LlxuICB2YXIgcm5kcyA9IG5ldyBBcnJheSgxNik7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXRoUk5HKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBybmRzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgIH1cblxuICAgIHJldHVybiBybmRzO1xuICB9O1xufVxuIiwidmFyIHJuZyA9IHJlcXVpcmUoJy4vbGliL3JuZycpO1xudmFyIGJ5dGVzVG9VdWlkID0gcmVxdWlyZSgnLi9saWIvYnl0ZXNUb1V1aWQnKTtcblxuLy8gKipgdjEoKWAgLSBHZW5lcmF0ZSB0aW1lLWJhc2VkIFVVSUQqKlxuLy9cbi8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9MaW9zSy9VVUlELmpzXG4vLyBhbmQgaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L3V1aWQuaHRtbFxuXG52YXIgX25vZGVJZDtcbnZhciBfY2xvY2tzZXE7XG5cbi8vIFByZXZpb3VzIHV1aWQgY3JlYXRpb24gdGltZVxudmFyIF9sYXN0TVNlY3MgPSAwO1xudmFyIF9sYXN0TlNlY3MgPSAwO1xuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG5mdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgdmFyIGIgPSBidWYgfHwgW107XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIHZhciBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7XG5cbiAgLy8gbm9kZSBhbmQgY2xvY2tzZXEgbmVlZCB0byBiZSBpbml0aWFsaXplZCB0byByYW5kb20gdmFsdWVzIGlmIHRoZXkncmUgbm90XG4gIC8vIHNwZWNpZmllZC4gIFdlIGRvIHRoaXMgbGF6aWx5IHRvIG1pbmltaXplIGlzc3VlcyByZWxhdGVkIHRvIGluc3VmZmljaWVudFxuICAvLyBzeXN0ZW0gZW50cm9weS4gIFNlZSAjMTg5XG4gIGlmIChub2RlID09IG51bGwgfHwgY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgIHZhciBzZWVkQnl0ZXMgPSBybmcoKTtcbiAgICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgICAvLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbiAgICAgIG5vZGUgPSBfbm9kZUlkID0gW1xuICAgICAgICBzZWVkQnl0ZXNbMF0gfCAweDAxLFxuICAgICAgICBzZWVkQnl0ZXNbMV0sIHNlZWRCeXRlc1syXSwgc2VlZEJ5dGVzWzNdLCBzZWVkQnl0ZXNbNF0sIHNlZWRCeXRlc1s1XVxuICAgICAgXTtcbiAgICB9XG4gICAgaWYgKGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gICAgICBjbG9ja3NlcSA9IF9jbG9ja3NlcSA9IChzZWVkQnl0ZXNbNl0gPDwgOCB8IHNlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG4gICAgfVxuICB9XG5cbiAgLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG4gIHZhciBtc2VjcyA9IG9wdGlvbnMubXNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubXNlY3MgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAvLyBQZXIgNC4yLjEuMiwgdXNlIGNvdW50IG9mIHV1aWQncyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjdXJyZW50IGNsb2NrXG4gIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG4gIHZhciBuc2VjcyA9IG9wdGlvbnMubnNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubnNlY3MgOiBfbGFzdE5TZWNzICsgMTtcblxuICAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG4gIHZhciBkdCA9IChtc2VjcyAtIF9sYXN0TVNlY3MpICsgKG5zZWNzIC0gX2xhc3ROU2VjcykvMTAwMDA7XG5cbiAgLy8gUGVyIDQuMi4xLjIsIEJ1bXAgY2xvY2tzZXEgb24gY2xvY2sgcmVncmVzc2lvblxuICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT09IHVuZGVmaW5lZCkge1xuICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICB9XG5cbiAgLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgLy8gdGltZSBpbnRlcnZhbFxuICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG5zZWNzID0gMDtcbiAgfVxuXG4gIC8vIFBlciA0LjIuMS4yIFRocm93IGVycm9yIGlmIHRvbyBtYW55IHV1aWRzIGFyZSByZXF1ZXN0ZWRcbiAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1dWlkLnYxKCk6IENhblxcJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjJyk7XG4gIH1cblxuICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgX2Nsb2Nrc2VxID0gY2xvY2tzZXE7XG5cbiAgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG4gIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwO1xuXG4gIC8vIGB0aW1lX2xvd2BcbiAgdmFyIHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gMTYgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsICYgMHhmZjtcblxuICAvLyBgdGltZV9taWRgXG4gIHZhciB0bWggPSAobXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwKSAmIDB4ZmZmZmZmZjtcbiAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdG1oICYgMHhmZjtcblxuICAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMTYgJiAweGZmO1xuXG4gIC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7XG5cbiAgLy8gYGNsb2NrX3NlcV9sb3dgXG4gIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjtcblxuICAvLyBgbm9kZWBcbiAgZm9yICh2YXIgbiA9IDA7IG4gPCA2OyArK24pIHtcbiAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gIH1cblxuICByZXR1cm4gYnVmID8gYnVmIDogYnl0ZXNUb1V1aWQoYik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdjE7XG4iLCJ2YXIgcm5nID0gcmVxdWlyZSgnLi9saWIvcm5nJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgYnVmID0gb3B0aW9ucyA9PT0gJ2JpbmFyeScgPyBuZXcgQXJyYXkoMTYpIDogbnVsbDtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG5cbiAgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gIHJuZHNbOF0gPSAocm5kc1s4XSAmIDB4M2YpIHwgMHg4MDtcblxuICAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcbiAgaWYgKGJ1Zikge1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCAxNjsgKytpaSkge1xuICAgICAgYnVmW2kgKyBpaV0gPSBybmRzW2lpXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmIHx8IGJ5dGVzVG9VdWlkKHJuZHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHY0O1xuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==