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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 69);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isDate = __webpack_require__(15);

var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var DEFAULT_ADDITIONAL_DIGITS = 2;

var parseTokenDateTimeDelimeter = /[T ]/;
var parseTokenPlainTime = /:/;

// year tokens
var parseTokenYY = /^(\d{2})$/;
var parseTokensYYY = [/^([+-]\d{2})$/, // 0 additional digits
/^([+-]\d{3})$/, // 1 additional digit
/^([+-]\d{4})$/ // 2 additional digits
];

var parseTokenYYYY = /^(\d{4})/;
var parseTokensYYYYY = [/^([+-]\d{4})/, // 0 additional digits
/^([+-]\d{5})/, // 1 additional digit
/^([+-]\d{6})/ // 2 additional digits
];

// date tokens
var parseTokenMM = /^-(\d{2})$/;
var parseTokenDDD = /^-?(\d{3})$/;
var parseTokenMMDD = /^-?(\d{2})-?(\d{2})$/;
var parseTokenWww = /^-?W(\d{2})$/;
var parseTokenWwwD = /^-?W(\d{2})-?(\d{1})$/;

// time tokens
var parseTokenHH = /^(\d{2}([.,]\d*)?)$/;
var parseTokenHHMM = /^(\d{2}):?(\d{2}([.,]\d*)?)$/;
var parseTokenHHMMSS = /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/;

// timezone tokens
var parseTokenTimezone = /([Z+-].*)$/;
var parseTokenTimezoneZ = /^(Z)$/;
var parseTokenTimezoneHH = /^([+-])(\d{2})$/;
var parseTokenTimezoneHHMM = /^([+-])(\d{2}):?(\d{2})$/;

/**
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If an argument is a string, the function tries to parse it.
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If all above fails, the function passes the given argument to Date constructor.
 *
 * @param {Date|String|Number} argument - the value to convert
 * @param {Object} [options] - the object with options
 * @param {0 | 1 | 2} [options.additionalDigits=2] - the additional number of digits in the extended year format
 * @returns {Date} the parsed date in the local time zone
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * var result = parse('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Parse string '+02014101',
 * // if the additional number of digits in the extended year format is 1:
 * var result = parse('+02014101', {additionalDigits: 1})
 * //=> Fri Apr 11 2014 00:00:00
 */
function parse(argument, dirtyOptions) {
  if (isDate(argument)) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument !== 'string') {
    return new Date(argument);
  }

  var options = dirtyOptions || {};
  var additionalDigits = options.additionalDigits;
  if (additionalDigits == null) {
    additionalDigits = DEFAULT_ADDITIONAL_DIGITS;
  } else {
    additionalDigits = Number(additionalDigits);
  }

  var dateStrings = splitDateString(argument);

  var parseYearResult = parseYear(dateStrings.date, additionalDigits);
  var year = parseYearResult.year;
  var restDateString = parseYearResult.restDateString;

  var date = parseDate(restDateString, year);

  if (date) {
    var timestamp = date.getTime();
    var time = 0;
    var offset;

    if (dateStrings.time) {
      time = parseTime(dateStrings.time);
    }

    if (dateStrings.timezone) {
      offset = parseTimezone(dateStrings.timezone);
    } else {
      // get offset accurate to hour in timezones that change offset
      offset = new Date(timestamp + time).getTimezoneOffset();
      offset = new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE).getTimezoneOffset();
    }

    return new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE);
  } else {
    return new Date(argument);
  }
}

function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(parseTokenDateTimeDelimeter);
  var timeString;

  if (parseTokenPlainTime.test(array[0])) {
    dateStrings.date = null;
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
  }

  if (timeString) {
    var token = parseTokenTimezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], '');
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings;
}

function parseYear(dateString, additionalDigits) {
  var parseTokenYYY = parseTokensYYY[additionalDigits];
  var parseTokenYYYYY = parseTokensYYYYY[additionalDigits];

  var token;

  // YYYY or ±YYYYY
  token = parseTokenYYYY.exec(dateString) || parseTokenYYYYY.exec(dateString);
  if (token) {
    var yearString = token[1];
    return {
      year: parseInt(yearString, 10),
      restDateString: dateString.slice(yearString.length)
    };
  }

  // YY or ±YYY
  token = parseTokenYY.exec(dateString) || parseTokenYYY.exec(dateString);
  if (token) {
    var centuryString = token[1];
    return {
      year: parseInt(centuryString, 10) * 100,
      restDateString: dateString.slice(centuryString.length)
    };
  }

  // Invalid ISO-formatted year
  return {
    year: null
  };
}

function parseDate(dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) {
    return null;
  }

  var token;
  var date;
  var month;
  var week;

  // YYYY
  if (dateString.length === 0) {
    date = new Date(0);
    date.setUTCFullYear(year);
    return date;
  }

  // YYYY-MM
  token = parseTokenMM.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;
    date.setUTCFullYear(year, month);
    return date;
  }

  // YYYY-DDD or YYYYDDD
  token = parseTokenDDD.exec(dateString);
  if (token) {
    date = new Date(0);
    var dayOfYear = parseInt(token[1], 10);
    date.setUTCFullYear(year, 0, dayOfYear);
    return date;
  }

  // YYYY-MM-DD or YYYYMMDD
  token = parseTokenMMDD.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;
    var day = parseInt(token[2], 10);
    date.setUTCFullYear(year, month, day);
    return date;
  }

  // YYYY-Www or YYYYWww
  token = parseTokenWww.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;
    return dayOfISOYear(year, week);
  }

  // YYYY-Www-D or YYYYWwwD
  token = parseTokenWwwD.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;
    var dayOfWeek = parseInt(token[2], 10) - 1;
    return dayOfISOYear(year, week, dayOfWeek);
  }

  // Invalid ISO-formatted date
  return null;
}

function parseTime(timeString) {
  var token;
  var hours;
  var minutes;

  // hh
  token = parseTokenHH.exec(timeString);
  if (token) {
    hours = parseFloat(token[1].replace(',', '.'));
    return hours % 24 * MILLISECONDS_IN_HOUR;
  }

  // hh:mm or hhmm
  token = parseTokenHHMM.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseFloat(token[2].replace(',', '.'));
    return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
  }

  // hh:mm:ss or hhmmss
  token = parseTokenHHMMSS.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseInt(token[2], 10);
    var seconds = parseFloat(token[3].replace(',', '.'));
    return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * 1000;
  }

  // Invalid ISO-formatted time
  return null;
}

function parseTimezone(timezoneString) {
  var token;
  var absoluteOffset;

  // Z
  token = parseTokenTimezoneZ.exec(timezoneString);
  if (token) {
    return 0;
  }

  // ±hh
  token = parseTokenTimezoneHH.exec(timezoneString);
  if (token) {
    absoluteOffset = parseInt(token[2], 10) * 60;
    return token[1] === '+' ? -absoluteOffset : absoluteOffset;
  }

  // ±hh:mm or ±hhmm
  token = parseTokenTimezoneHHMM.exec(timezoneString);
  if (token) {
    absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10);
    return token[1] === '+' ? -absoluteOffset : absoluteOffset;
  }

  return 0;
}

function dayOfISOYear(isoYear, week, day) {
  week = week || 0;
  day = day || 0;
  var date = new Date(0);
  date.setUTCFullYear(isoYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

module.exports = parse;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = _Common2.default.flux.Dispatcher;
var OboModel = _Common2.default.models.OboModel;


var getFlatList = function getFlatList(item) {
	var list = [];
	var model = OboModel.models[item.id];
	if (model && model.get('type') === 'ObojoboDraft.Sections.Assessment') {
		item.flags.assessment = true;
	}
	if (item.type !== 'hidden') {
		list.push(item);
	}

	if (item.showChildren) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(item.children)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var child = _step.value;

				list = list.concat(getFlatList(child));
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}

	return list;
};

var NavUtil = {
	rebuildMenu: function rebuildMenu(model) {
		return Dispatcher.trigger('nav:rebuildMenu', {
			value: {
				model: model
			}
		});
	},
	gotoPath: function gotoPath(path) {
		return Dispatcher.trigger('nav:gotoPath', {
			value: {
				path: path
			}
		});
	},


	// gotoCurrentPathname: () ->
	// 	window.location.pathname

	setFlag: function setFlag(id, flagName, flagValue) {
		return Dispatcher.trigger('nav:setFlag', {
			value: {
				id: id,
				flagName: flagName,
				flagValue: flagValue
			}
		});
	},
	goPrev: function goPrev() {
		return Dispatcher.trigger('nav:prev');
	},
	goNext: function goNext() {
		return Dispatcher.trigger('nav:next');
	},
	goto: function goto(id) {
		return Dispatcher.trigger('nav:goto', {
			value: {
				id: id
			}
		});
	},
	lock: function lock() {
		return Dispatcher.trigger('nav:lock');
	},
	unlock: function unlock() {
		return Dispatcher.trigger('nav:unlock');
	},
	close: function close() {
		return Dispatcher.trigger('nav:close');
	},
	open: function open() {
		return Dispatcher.trigger('nav:open');
	},
	toggle: function toggle() {
		return Dispatcher.trigger('nav:toggle');
	},
	openExternalLink: function openExternalLink(url) {
		return Dispatcher.trigger('nav:openExternalLink', {
			value: {
				url: url
			}
		});
	},
	showChildren: function showChildren(id) {
		return Dispatcher.trigger('nav:showChildren', {
			value: {
				id: id
			}
		});
	},
	hideChildren: function hideChildren(id) {
		return Dispatcher.trigger('nav:hideChildren', {
			value: {
				id: id
			}
		});
	},
	getNavTarget: function getNavTarget(state) {
		return state.itemsById[state.navTargetId];
	},
	getNavTargetModel: function getNavTargetModel(state) {
		var navTarget = NavUtil.getNavTarget(state);
		if (!navTarget) {
			return null;
		}

		return OboModel.models[navTarget.id];
	},
	getFirst: function getFirst(state) {
		var list = NavUtil.getOrderedList(state);

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = Array.from(list)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var item = _step2.value;

				if (item.type === 'link') {
					return item;
				}
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		return null;
	},
	getPrev: function getPrev(state) {
		// state.items[NavUtil.getPrevIndex(state)]
		var list = NavUtil.getOrderedList(state);
		var navTarget = NavUtil.getNavTarget(state);
		var index = list.indexOf(navTarget);

		if (index === -1) {
			return null;
		}

		index--;
		while (index >= 0) {
			var item = list[index];
			if (item.type === 'link') {
				return item;
			}

			index--;
		}

		return null;
	},
	getNext: function getNext(state) {
		// state.items[NavUtil.getPrevIndex(state)]
		var list = NavUtil.getOrderedList(state);
		var navTarget = NavUtil.getNavTarget(state);
		var index = list.indexOf(navTarget);

		if (index === -1) {
			return null;
		}

		index++;
		var len = list.length;
		while (index < len) {
			var item = list[index];
			if (item.type === 'link') {
				return item;
			}

			index++;
		}

		return null;
	},
	getPrevModel: function getPrevModel(state) {
		var prevItem = NavUtil.getPrev(state);
		if (!prevItem) {
			return null;
		}

		return OboModel.models[prevItem.id];
	},
	getNextModel: function getNextModel(state) {
		var nextItem = NavUtil.getNext(state);
		if (!nextItem) {
			return null;
		}

		return OboModel.models[nextItem.id];
	},
	getNavItemForModel: function getNavItemForModel(state, model) {
		var item = state.itemsById[model.get('id')];
		if (!item) {
			return null;
		}

		return item;
	},
	getNavLabelForModel: function getNavLabelForModel(state, model) {
		var item = NavUtil.getNavItemForModel(state, model);
		if (!item) {
			return null;
		}

		return item.label;
	},
	canNavigate: function canNavigate(state) {
		return !state.locked;
	},
	getOrderedList: function getOrderedList(state) {
		return getFlatList(state.items);
	},
	setContext: function setContext(context) {
		return Dispatcher.trigger('nav:setContext', {
			value: {
				context: context
			}
		});
	}
};

exports.default = NavUtil;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var processJsonResults = function processJsonResults(res) {
	return Promise.resolve(res.json()).then(function (json) {
		if (json.status === 'error') console.log(json.value);
		return json;
	});
};

var APIUtil = {
	get: function get(endpoint) {
		return fetch(endpoint, {
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json' //@TODO - Do I need this?
			} });
	},
	post: function post(endpoint, body) {
		if (body == null) {
			body = {};
		}
		return fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(body),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});
	},
	postEvent: function postEvent(lo, action, eventVersion, payload) {
		return APIUtil.post('/api/events', {
			event: {
				action: action,
				draft_id: lo.get('draftId'),
				actor_time: new Date().toISOString(),
				event_version: eventVersion,
				payload: payload
			}
		}).then(processJsonResults)
		// TODO: Send Caliper event to client host.
		.then(function (res) {
			if (res && res.status === 'ok' && res.value) {
				parent.postMessage(res.value, '*');
			}

			return res;
		});
	},
	saveState: function saveState(lo, state) {
		return APIUtil.postEvent(lo, 'saveState', state);
	},
	getDraft: function getDraft(id) {
		return fetch('/api/drafts/' + id).then(processJsonResults);
	},
	getAttempts: function getAttempts(lo) {
		return APIUtil.get('/api/drafts/' + lo.get('draftId') + '/attempts').then(processJsonResults);
	},
	requestStart: function requestStart(visitId, draftId) {
		return APIUtil.post('/api/visits/start', {
			visitId: visitId,
			draftId: draftId
		}).then(processJsonResults);
	},
	startAttempt: function startAttempt(lo, assessment) {
		return APIUtil.post('/api/assessments/attempt/start', {
			draftId: lo.get('draftId'),
			assessmentId: assessment.get('id')
		}).then(processJsonResults);
	},
	endAttempt: function endAttempt(attempt) {
		return APIUtil.post('/api/assessments/attempt/' + attempt.attemptId + '/end').then(processJsonResults);
	},
	resendLTIAssessmentScore: function resendLTIAssessmentScore(lo, assessment) {
		return APIUtil.post('/api/lti/sendAssessmentScore', {
			draftId: lo.get('draftId'),
			assessmentId: assessment.get('id')
		}).then(processJsonResults);
	},
	clearPreviewScores: function clearPreviewScores(draftId) {
		return APIUtil.post('/api/assessments/clear-preview-scores', { draftId: draftId }).then(processJsonResults);
	}
};

exports.default = APIUtil;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var getDisplayFriendlyScore = function getDisplayFriendlyScore(n) {
	if (n === null) return '--';
	return Math.round(n).toString();
};

exports.default = getDisplayFriendlyScore;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _questionUtil = __webpack_require__(7);

var _questionUtil2 = _interopRequireDefault(_questionUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = _Common2.default.flux.Dispatcher;


var AssessmentUtil = {
	getAssessmentForModel: function getAssessmentForModel(state, model) {
		var assessmentModel = void 0;
		if (model.get('type') === 'ObojoboDraft.Sections.Assessment') {
			assessmentModel = model;
		} else {
			assessmentModel = model.getParentOfType('ObojoboDraft.Sections.Assessment');
		}

		if (!assessmentModel) {
			return null;
		}

		var assessment = state.assessments[assessmentModel.get('id')];
		if (!assessment) {
			return null;
		}

		return assessment;
	},
	getLastAttemptForModel: function getLastAttemptForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return null;
		}

		if (assessment.attempts.length === 0) {
			return 0;
		}

		return assessment.attempts[assessment.attempts.length - 1];
	},
	getHighestAttemptsForModelByAssessmentScore: function getHighestAttemptsForModelByAssessmentScore(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return [];
		}

		return assessment.highestAssessmentScoreAttempts;
	},
	getHighestAttemptsForModelByAttemptScore: function getHighestAttemptsForModelByAttemptScore(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return [];
		}

		return assessment.highestAttemptScoreAttempts;
	},
	getAssessmentScoreForModel: function getAssessmentScoreForModel(state, model) {
		var attempts = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(state, model);
		if (attempts.length === 0) {
			return null;
		}

		return attempts[0].assessmentScore;
	},
	getLastAttemptScoresForModel: function getLastAttemptScoresForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return null;
		}

		if (assessment.attempts.length === 0) {
			return [];
		}

		return assessment.attempts[assessment.attempts.length - 1].questionScores;
	},
	getCurrentAttemptForModel: function getCurrentAttemptForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return null;
		}

		return assessment.current;
	},
	getAllAttempts: function getAllAttempts(state, model) {
		return this.getAssessmentForModel(state, model).attempts;
	},
	getAttemptsRemaining: function getAttemptsRemaining(state, model) {
		return Math.max(model.modelState.attempts - this.getNumberOfAttemptsCompletedForModel(state, model), 0);
	},
	hasAttemptsRemaining: function hasAttemptsRemaining(state, model) {
		return model.modelState.attempts - this.getNumberOfAttemptsCompletedForModel(state, model) > 0;
	},
	getLTIStateForModel: function getLTIStateForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return null;
		}

		return {
			state: assessment.lti,
			networkState: assessment.ltiNetworkState,
			errorCount: assessment.ltiErrorCount
		};
	},
	isLTIScoreNeedingToBeResynced: function isLTIScoreNeedingToBeResynced(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);

		if (!assessment || !assessment.lti || !assessment.lti.gradebookStatus) {
			return false;
		}

		switch (assessment.lti.gradebookStatus) {
			case 'ok_no_outcome_service':
			case 'ok_gradebook_matches_assessment_score':
			case 'ok_null_score_not_sent':
				return false;

			default:
				return true;
		}
	},
	getResponseCount: function getResponseCount(questionModels, questionState, context) {
		var count = function count(acc, questionModel) {
			if (_questionUtil2.default.getResponse(questionState, questionModel, context)) {
				return acc + 1;
			}
		};

		return questionModels.reduce(count, 0);
	},
	isCurrentAttemptComplete: function isCurrentAttemptComplete(assessmentState, questionState, model, context) {
		// exit if there is no current attempt
		if (!AssessmentUtil.getCurrentAttemptForModel(assessmentState, model)) {
			return null;
		}

		var models = model.children.at(1).children.models;
		var responseCount = this.getResponseCount(models, questionState, context);

		// is complete if the number of answered questions is
		// equal to the total number of questions
		return responseCount === models.length;
	},
	isInAssessment: function isInAssessment(state) {
		if (!state) return false;

		for (var assessmentName in state.assessments) {
			if (state.assessments[assessmentName].current !== null) {
				return true;
			}
		}

		return false;
	},
	getNumberOfAttemptsCompletedForModel: function getNumberOfAttemptsCompletedForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment || assessment.attempts.length === 0) {
			return 0;
		}

		return assessment.attempts.length;
	},
	getNumCorrect: function getNumCorrect(questionScores) {
		var count100s = function count100s(acc, qs) {
			return acc + (parseInt(qs.score, 10) === 100 ? 1 : 0);
		};
		return questionScores.reduce(count100s, 0);
	},
	findHighestAttempts: function findHighestAttempts(attempts, scoreProperty) {
		if (attempts.length === 0) return [];

		var attemptsByScore = {};
		var highestScore = -1;

		attempts.forEach(function (attempt) {
			var score = attempt[scoreProperty] === null ? -1 : attempt[scoreProperty];

			if (score > highestScore) {
				highestScore = score;
			}

			if (!attemptsByScore[score]) {
				attemptsByScore[score] = [];
			}

			attemptsByScore[score].push(attempt);
		});

		return attemptsByScore[highestScore];
	},
	startAttempt: function startAttempt(model) {
		return Dispatcher.trigger('assessment:startAttempt', {
			value: {
				id: model.get('id')
			}
		});
	},
	endAttempt: function endAttempt(model, context) {
		return Dispatcher.trigger('assessment:endAttempt', {
			value: {
				id: model.get('id'),
				context: context
			}
		});
	},
	resendLTIScore: function resendLTIScore(model) {
		return Dispatcher.trigger('assessment:resendLTIScore', {
			value: {
				id: model.get('id')
			}
		});
	}
};

exports.default = AssessmentUtil;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = _Common2.default.flux.Dispatcher;
var OboModel = _Common2.default.models.OboModel;


var QuestionUtil = {
	setResponse: function setResponse(id, response, targetId, context, assessmentId, attemptId) {
		return Dispatcher.trigger('question:setResponse', {
			value: {
				id: id,
				response: response,
				targetId: targetId,
				context: context,
				assessmentId: assessmentId,
				attemptId: attemptId
			}
		});
	},
	clearResponse: function clearResponse(id, context) {
		return Dispatcher.trigger('question:clearResponse', {
			value: {
				id: id,
				context: context
			}
		});
	},
	setData: function setData(id, key, value) {
		return Dispatcher.trigger('question:setData', {
			value: {
				key: id + ':' + key,
				value: value
			}
		});
	},
	clearData: function clearData(id, key) {
		return Dispatcher.trigger('question:clearData', {
			value: {
				key: id + ':' + key
			}
		});
	},
	showExplanation: function showExplanation(id) {
		return Dispatcher.trigger('question:showExplanation', {
			value: { id: id }
		});
	},
	hideExplanation: function hideExplanation(id, actor) {
		return Dispatcher.trigger('question:hideExplanation', {
			value: { id: id, actor: actor }
		});
	},
	viewQuestion: function viewQuestion(id) {
		return Dispatcher.trigger('question:view', {
			value: {
				id: id
			}
		});
	},
	hideQuestion: function hideQuestion(id) {
		return Dispatcher.trigger('question:hide', {
			value: {
				id: id
			}
		});
	},
	checkAnswer: function checkAnswer(id) {
		return Dispatcher.trigger('question:checkAnswer', {
			value: {
				id: id
			}
		});
	},
	retryQuestion: function retryQuestion(id, context) {
		return Dispatcher.trigger('question:retry', {
			value: {
				id: id,
				context: context
			}
		});
	},
	getViewState: function getViewState(state, model) {
		var modelId = model.get('id');

		if (state.viewing === modelId) {
			return 'active';
		}
		if (state.viewedQuestions[modelId]) {
			return 'viewed';
		}
		return 'hidden';
	},
	getResponse: function getResponse(state, model, context) {
		if (!state.responses[context]) return null;
		return state.responses[context][model.get('id')] || null;
	},
	getData: function getData(state, model, key) {
		return state.data[model.get('id') + ':' + key] || false;
	},
	isShowingExplanation: function isShowingExplanation(state, model) {
		return state.data[model.get('id') + ':showingExplanation'] || false;
	},
	getScoreForModel: function getScoreForModel(state, model, context) {
		var scoreItem = void 0;
		if (state.scores[context] != null) {
			scoreItem = state.scores[context][model.get('id')];
		}

		return scoreItem == null || scoreItem.score == null ? null : scoreItem.score;
	},
	setScore: function setScore(itemId, score, context) {
		return Dispatcher.trigger('question:scoreSet', {
			value: {
				itemId: itemId,
				score: score,
				context: context
			}
		});
	},
	clearScore: function clearScore(itemId, context) {
		return Dispatcher.trigger('question:scoreClear', {
			value: {
				itemId: itemId,
				context: context
			}
		});
	}
};

exports.default = QuestionUtil;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var startOfWeek = __webpack_require__(39);

/**
 * @category ISO Week Helpers
 * @summary Return the start of an ISO week for the given date.
 *
 * @description
 * Return the start of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of an ISO week
 *
 * @example
 * // The start of an ISO week for 2 September 2014 11:55:00:
 * var result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfISOWeek(dirtyDate) {
  return startOfWeek(dirtyDate, { weekStartsOn: 1 });
}

module.exports = startOfISOWeek;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _navUtil = __webpack_require__(2);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _apiUtil = __webpack_require__(4);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _Common2.default.flux.Store;
var Dispatcher = _Common2.default.flux.Dispatcher;
var OboModel = _Common2.default.models.OboModel;
var FocusUtil = _Common2.default.util.FocusUtil;

var NavStore = function (_Store) {
	_inherits(NavStore, _Store);

	function NavStore() {
		_classCallCheck(this, NavStore);

		var item = void 0;
		var oldNavTargetId = void 0;

		var _this = _possibleConstructorReturn(this, (NavStore.__proto__ || Object.getPrototypeOf(NavStore)).call(this, 'navstore'));

		Dispatcher.on({
			'nav:setContext': function navSetContext(payload) {
				_this.state.context = payload.value.context;
				return _this.triggerChange();
			},
			'nav:rebuildMenu': function navRebuildMenu(payload) {
				_this.buildMenu(payload.value.model);
				_this.triggerChange();
			},
			'nav:gotoPath': function navGotoPath(payload) {
				oldNavTargetId = _this.state.navTargetId;
				if (_this.gotoItem(_this.state.itemsByPath[payload.value.path])) {
					_apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:gotoPath', '1.0.0', {
						from: oldNavTargetId,
						to: _this.state.itemsByPath[payload.value.path].id
					});
				}
			},
			'nav:setFlag': function navSetFlag(payload) {
				var navItem = _this.state.itemsById[payload.value.id];
				navItem.flags[payload.value.flagName] = payload.value.flagValue;
				_this.triggerChange();
			},
			'nav:prev': function navPrev() {
				oldNavTargetId = _this.state.navTargetId;
				var prev = _navUtil2.default.getPrev(_this.state);
				if (_this.gotoItem(prev)) {
					_apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:prev', '1.0.0', {
						from: oldNavTargetId,
						to: prev.id
					});
				}
			},
			'nav:next': function navNext() {
				oldNavTargetId = _this.state.navTargetId;
				var next = _navUtil2.default.getNext(_this.state);
				if (_this.gotoItem(next)) {
					_apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:next', '1.0.0', {
						from: oldNavTargetId,
						to: next.id
					});
				}
			},
			'nav:goto': function navGoto(payload) {
				oldNavTargetId = _this.state.navTargetId;
				if (_this.gotoItem(_this.state.itemsById[payload.value.id])) {
					_apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:goto', '1.0.0', {
						from: oldNavTargetId,
						to: _this.state.itemsById[payload.value.id].id
					});
				}
			},
			'nav:lock': function navLock() {
				_apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:lock', '1.0.0');
				_this.setAndTrigger({ locked: true });
			},
			'nav:unlock': function navUnlock() {
				_apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:unlock', '1.0.0');
				_this.setAndTrigger({ locked: false });
			},
			'nav:close': function navClose() {
				_apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:close', '1.0.0');
				_this.setAndTrigger({ open: false });
			},
			'nav:open': function navOpen() {
				_apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:open', '1.0.0');
				_this.setAndTrigger({ open: true });
			},
			'nav:toggle': function navToggle() {
				var updatedState = { open: !_this.state.open };
				_apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:toggle', '1.0.0', updatedState);
				_this.setAndTrigger(updatedState);
			},
			'nav:openExternalLink': function navOpenExternalLink(payload) {
				window.open(payload.value.url);
				_this.triggerChange();
			},
			'nav:showChildren': function navShowChildren(payload) {
				item = _this.state.itemsById[payload.value.id];
				item.showChildren = true;
				_this.triggerChange();
			},
			'nav:hideChildren': function navHideChildren(payload) {
				item = _this.state.itemsById[payload.value.id];
				item.showChildren = false;
				_this.triggerChange();
			},
			'question:scoreSet': function questionScoreSet(payload) {
				var navItem = _this.state.itemsById[payload.value.id];
				if (navItem) {
					_navUtil2.default.setFlag(payload.value.id, 'correct', payload.value.score === 100);
				}
			}
		}, _this);
		return _this;
	}

	_createClass(NavStore, [{
		key: 'init',
		value: function init(model, startingId, startingPath, visitId) {
			var viewState = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

			this.state = {
				items: {},
				itemsById: {},
				itemsByPath: {},
				itemsByFullPath: {},
				navTargetHistory: [],
				navTargetId: null,
				locked: viewState['nav:isLocked'] != null ? viewState['nav:isLocked'].value : false,
				open: viewState['nav:isOpen'] != null ? viewState['nav:isOpen'].value : true,
				context: 'practice',
				visitId: visitId
			};

			this.buildMenu(model);
			_navUtil2.default.gotoPath(startingPath);

			if (startingId != null) {
				_navUtil2.default.goto(startingId);
			} else {
				var first = _navUtil2.default.getFirst(this.state);

				if (first && first.id) _navUtil2.default.goto(first.id);
			}
		}
	}, {
		key: 'buildMenu',
		value: function buildMenu(model) {
			this.state.itemsById = {};
			this.state.itemsByPath = {};
			this.state.itemsByFullPath = {};
			this.state.items = this.generateNav(model);
		}
	}, {
		key: 'gotoItem',
		value: function gotoItem(navItem) {
			if (!navItem) {
				return false;
			}

			if (this.state.navTargetId != null) {
				if (this.state.navTargetId === navItem.id) {
					return;
				}

				var navTargetModel = _navUtil2.default.getNavTargetModel(this.state);
				if (navTargetModel && navTargetModel.processTrigger) {
					navTargetModel.processTrigger('onNavExit');
				}
				this.state.navTargetHistory.push(this.state.navTargetId);
				this.state.itemsById[this.state.navTargetId].showChildren = false;
			}

			if (navItem.showChildrenOnNavigation) {
				navItem.showChildren = true;
			}

			FocusUtil.unfocus();
			window.history.pushState({}, document.title, navItem.fullFlatPath);
			this.state.navTargetId = navItem.id;
			_navUtil2.default.getNavTargetModel(this.state).processTrigger('onNavEnter');
			this.triggerChange();
			return true;
		}
	}, {
		key: 'generateNav',
		value: function generateNav(model, indent) {
			if (!model) return {};

			if (indent == null) {
				indent = '';
			}
			var item = _Common2.default.Store.getItemForType(model.get('type'));

			var navItem = null;
			if (item.getNavItem != null) {
				navItem = item.getNavItem(model);
			}

			if (navItem == null) {
				navItem = {};
			}

			navItem = Object.assign({
				type: 'hidden',
				label: '',
				path: '',
				showChildren: true,
				showChildrenOnNavigation: true
			}, navItem);

			navItem.flags = [];
			navItem.children = [];
			navItem.id = model.get('id');
			navItem.fullPath = [].concat(navItem.path).filter(function (item) {
				return item !== '';
			});
			navItem.flags = {
				visited: false,
				complete: false,
				correct: false
			};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(model.children.models)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var child = _step.value;

					var childNavItem = this.generateNav(child, indent + '_');
					navItem.children.push(childNavItem);
					childNavItem.fullPath = navItem.fullPath.concat(childNavItem.fullPath).filter(function (item) {
						return item !== '';
					});

					// flatPath = ['view', model.getRoot().get('_id'), childNavItem.fullPath.join('/')].join('/')
					var flatPath = childNavItem.fullPath.join('/');
					childNavItem.flatPath = flatPath;
					childNavItem.fullFlatPath = ['/view', model.getRoot().get('draftId'), 'visit', this.state.visitId, flatPath].join('/');
					this.state.itemsByPath[flatPath] = childNavItem;
					this.state.itemsByFullPath[childNavItem.fullFlatPath] = childNavItem;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this.state.itemsById[model.get('id')] = navItem;

			return navItem;
		}
	}]);

	return NavStore;
}(Store);

var navStore = new NavStore();
window.__ns = navStore;
exports.default = navStore;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _apiUtil = __webpack_require__(4);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

var _questionUtil = __webpack_require__(7);

var _questionUtil2 = _interopRequireDefault(_questionUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _Common2.default.flux.Store;
var Dispatcher = _Common2.default.flux.Dispatcher;
var OboModel = _Common2.default.models.OboModel;
var FocusUtil = _Common2.default.util.FocusUtil;
var UUID = _Common2.default.util.UUID;

var QuestionStore = function (_Store) {
	_inherits(QuestionStore, _Store);

	function QuestionStore() {
		_classCallCheck(this, QuestionStore);

		var id = void 0;
		var model = void 0;

		var _this = _possibleConstructorReturn(this, (QuestionStore.__proto__ || Object.getPrototypeOf(QuestionStore)).call(this, 'questionStore'));

		Dispatcher.on({
			'question:setResponse': function questionSetResponse(payload) {
				var id = payload.value.id;
				var context = payload.value.context;
				var model = OboModel.models[id];
				if (!_this.state.responses[context]) _this.state.responses[context] = {};
				_this.state.responses[context][id] = payload.value.response;
				_this.triggerChange();

				_apiUtil2.default.postEvent(model.getRoot(), 'question:setResponse', '2.1.0', {
					questionId: id,
					response: payload.value.response,
					targetId: payload.value.targetId,
					context: context,
					assessmentId: payload.value.assessmentId,
					attemptId: payload.value.attemptId
				});
			},

			'question:clearResponse': function questionClearResponse(payload) {
				if (_this.state.responses[payload.value.context]) {
					delete _this.state.responses[payload.value.context][payload.value.id];
					_this.triggerChange();
				}
			},

			'assessment:endAttempt': function assessmentEndAttempt(payload) {
				if (_this.state.responses[payload.value.context]) {
					delete _this.state.responses[payload.value.context][payload.value.id];
					_this.triggerChange();
				}
			},

			'question:setData': function questionSetData(payload) {
				_this.state.data[payload.value.key] = payload.value.value;
				_this.triggerChange();
			},

			'question:showExplanation': function questionShowExplanation(payload) {
				var root = OboModel.models[payload.value.id].getRoot();

				_apiUtil2.default.postEvent(root, 'question:showExplanation', '1.0.0', {
					questionId: payload.value.id
				});

				_questionUtil2.default.setData(payload.value.id, 'showingExplanation', true);
			},

			'question:hideExplanation': function questionHideExplanation(payload) {
				var root = OboModel.models[payload.value.id].getRoot();

				_apiUtil2.default.postEvent(root, 'question:hideExplanation', '1.1.0', {
					questionId: payload.value.id,
					actor: payload.value.actor
				});

				_questionUtil2.default.clearData(payload.value.id, 'showingExplanation');
			},

			'question:clearData': function questionClearData(payload) {
				delete _this.state.data[payload.value.key];
				_this.triggerChange();
			},

			'question:hide': function questionHide(payload) {
				_apiUtil2.default.postEvent(OboModel.models[payload.value.id].getRoot(), 'question:hide', '1.0.0', {
					questionId: payload.value.id
				});

				delete _this.state.viewedQuestions[payload.value.id];

				if (_this.state.viewing === payload.value.id) {
					_this.state.viewing = null;
				}

				_this.triggerChange();
			},

			'question:view': function questionView(payload) {
				var root = OboModel.models[payload.value.id].getRoot();

				_apiUtil2.default.postEvent(root, 'question:view', '1.0.0', {
					questionId: payload.value.id
				});

				_this.state.viewedQuestions[payload.value.id] = true;
				_this.state.viewing = payload.value.id;

				_this.triggerChange();
			},

			'question:checkAnswer': function questionCheckAnswer(payload) {
				var questionId = payload.value.id;
				var questionModel = OboModel.models[questionId];
				var root = questionModel.getRoot();

				_apiUtil2.default.postEvent(root, 'question:checkAnswer', '1.0.0', {
					questionId: payload.value.id
				});
			},

			'question:retry': function questionRetry(payload) {
				var questionId = payload.value.id;
				var questionModel = OboModel.models[questionId];
				var root = questionModel.getRoot();

				_this.clearResponses(questionId, payload.value.context);

				_apiUtil2.default.postEvent(root, 'question:retry', '1.0.0', {
					questionId: questionId
				});

				if (_questionUtil2.default.isShowingExplanation(_this.state, questionModel)) {
					_questionUtil2.default.hideExplanation(questionId, 'viewerClient');
				}

				_questionUtil2.default.clearScore(questionId, payload.value.context);
			},

			'question:scoreSet': function questionScoreSet(payload) {
				var scoreId = UUID();

				if (!_this.state.scores[payload.value.context]) _this.state.scores[payload.value.context] = {};

				_this.state.scores[payload.value.context][payload.value.itemId] = {
					id: scoreId,
					score: payload.value.score,
					itemId: payload.value.itemId
				};

				if (payload.value.score === 100) {
					FocusUtil.unfocus();
				}

				_this.triggerChange();

				model = OboModel.models[payload.value.itemId];
				_apiUtil2.default.postEvent(model.getRoot(), 'question:scoreSet', '1.0.0', {
					id: scoreId,
					itemId: payload.value.itemId,
					score: payload.value.score,
					context: payload.value.context
				});
			},

			'question:scoreClear': function questionScoreClear(payload) {
				var scoreItem = _this.state.scores[payload.value.context][payload.value.itemId];

				model = OboModel.models[scoreItem.itemId];

				delete _this.state.scores[payload.value.context][payload.value.itemId];
				_this.triggerChange();

				_apiUtil2.default.postEvent(model.getRoot(), 'question:scoreClear', '1.0.0', scoreItem);
			}
		});
		return _this;
	}

	_createClass(QuestionStore, [{
		key: 'clearResponses',
		value: function clearResponses(questionId, context) {
			delete this.state.responses[context][questionId];
		}
	}, {
		key: 'init',
		value: function init() {
			this.state = {
				viewing: null,
				viewedQuestions: {},
				scores: {},
				responses: {},
				data: {}
			};
		}
	}, {
		key: 'getState',
		value: function getState() {
			return this.state;
		}
	}, {
		key: 'setState',
		value: function setState(newState) {
			this.state = newState;
		}
	}]);

	return QuestionStore;
}(Store);

var questionStore = new QuestionStore();
exports.default = questionStore;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(1);
var startOfISOWeek = __webpack_require__(8);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the ISO week-numbering year of the given date.
 *
 * @description
 * Get the ISO week-numbering year of the given date,
 * which always starts 3 days before the year's first Thursday.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the ISO week-numbering year
 *
 * @example
 * // Which ISO-week numbering year is 2 January 2005?
 * var result = getISOYear(new Date(2005, 0, 2))
 * //=> 2004
 */
function getISOYear(dirtyDate) {
  var date = parse(dirtyDate);
  var year = date.getFullYear();

  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);

  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

module.exports = getISOYear;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @category Common Helpers
 * @summary Is the given argument an instance of Date?
 *
 * @description
 * Is the given argument an instance of Date?
 *
 * @param {*} argument - the argument to check
 * @returns {Boolean} the given argument is an instance of Date
 *
 * @example
 * // Is 'mayonnaise' a Date?
 * var result = isDate('mayonnaise')
 * //=> false
 */
function isDate(argument) {
  return argument instanceof Date;
}

module.exports = isDate;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(9);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// used to apply ' is-label' or ' is-not-label' styles
var isOrNot = function isOrNot(flag, label) {
  return ' is-' + (flag ? '' : 'not-') + label;
};
exports.default = isOrNot;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
__webpack_require__(63);

var GREAT_JOB_YOU_ROCK_EMOJI = '😎';

var scoreReportView = function scoreReportView(props) {
	return React.createElement(
		'div',
		{ className: 'obojobo-draft--sections--assessment--components--score-report' },
		React.createElement(
			'div',
			{ className: 'text-items' },
			props.report.textItems.map(getItemEl)
		),
		props.report.scoreChangeDescription === null ? null : React.createElement(
			'span',
			{ className: 'score-change-description' },
			props.report.scoreChangeDescription
		)
	);
};

var getAmountEl = function getAmountEl(value) {
	var isTotalOf100 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	if (value === 'Did Not Pass') {
		return React.createElement(
			'span',
			{ className: 'amount is-null' },
			'Did Not Pass'
		);
	}

	if (isTotalOf100) {
		return React.createElement(
			'div',
			{ className: 'amount is-number' },
			value,
			'%',
			React.createElement(
				'span',
				{ className: 'great-job-you-rock' },
				GREAT_JOB_YOU_ROCK_EMOJI
			)
		);
	}

	return React.createElement(
		'span',
		{ className: 'amount is-number' },
		value,
		'%'
	);
};

var getItemEl = function getItemEl(item, index) {
	switch (item.type) {
		case 'text':
			return React.createElement(
				'div',
				{ key: index, className: 'text' },
				item.text
			);

		case 'divider':
			return React.createElement('hr', { key: index, className: 'divider' });

		case 'extra-credit':
			return React.createElement(
				'div',
				{ key: index, className: 'extra-credit' },
				React.createElement(
					'span',
					{ className: 'label' },
					React.createElement(
						'span',
						null,
						'Extra-credit'
					),
					' - ',
					item.text
				),
				getAmountEl('+' + item.value)
			);

		case 'penalty':
			return React.createElement(
				'div',
				{ key: index, className: 'penalty' },
				React.createElement(
					'span',
					{ className: 'label' },
					React.createElement(
						'span',
						null,
						'Penalty'
					),
					' - ',
					item.text
				),
				getAmountEl('-' + item.value)
			);

		case 'value':
		case 'total':
			return React.createElement(
				'div',
				{ key: index, className: item.type },
				React.createElement(
					'div',
					{ className: 'label' },
					item.text
				),
				getAmountEl(item.value, item.type === 'total' && item.value === '100')
			);
	}
};

exports.default = scoreReportView;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assessmentUtil = __webpack_require__(6);

var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil);

var _getScoreComparisionData = __webpack_require__(55);

var _getScoreComparisionData2 = _interopRequireDefault(_getScoreComparisionData);

var _getReportDetailsForAttempt = __webpack_require__(52);

var _getReportDetailsForAttempt2 = _interopRequireDefault(_getReportDetailsForAttempt);

var _getReportDisplayValuesForAttempt = __webpack_require__(53);

var _getReportDisplayValuesForAttempt2 = _interopRequireDefault(_getReportDisplayValuesForAttempt);

var _getScoreChangeDescription = __webpack_require__(54);

var _getScoreChangeDescription2 = _interopRequireDefault(_getScoreChangeDescription);

var _getTextItems = __webpack_require__(58);

var _getTextItems2 = _interopRequireDefault(_getTextItems);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AssessmentScoreReporter = function () {
	function AssessmentScoreReporter(_ref) {
		var assessmentRubric = _ref.assessmentRubric,
		    allAttempts = _ref.allAttempts,
		    totalNumberOfAttemptsAllowed = _ref.totalNumberOfAttemptsAllowed;

		_classCallCheck(this, AssessmentScoreReporter);

		this.assessmentRubric = assessmentRubric;
		this.totalNumberOfAttemptsAllowed = totalNumberOfAttemptsAllowed;
		this.allAttempts = allAttempts;
	}

	_createClass(AssessmentScoreReporter, [{
		key: 'getReportFor',
		value: function getReportFor(attemptNumberToGenerateReportFor) {
			if (attemptNumberToGenerateReportFor === 0) {
				throw new Error('attemptNumberToGenerateReportFor parameter is not zero-indexed - Use "1" for first attempt');
			}

			var assessScoreInfoToReport = this.allAttempts[attemptNumberToGenerateReportFor - 1].assessmentScoreDetails;

			return {
				textItems: (0, _getTextItems2.default)((0, _getReportDetailsForAttempt2.default)(this.assessmentRubric, assessScoreInfoToReport), (0, _getReportDisplayValuesForAttempt2.default)(assessScoreInfoToReport, this.totalNumberOfAttemptsAllowed)),
				scoreChangeDescription: (0, _getScoreChangeDescription2.default)((0, _getScoreComparisionData2.default)(this.allAttempts, attemptNumberToGenerateReportFor))
			};
		}
	}]);

	return AssessmentScoreReporter;
}();

exports.default = AssessmentScoreReporter;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var TYPE_ATTEMPT_WITHOUT_MODS_REWARDED = 'attempt-without-mods-rewarded';
var TYPE_ATTEMPT_WITH_MODS_REWARDED = 'attempt-with-mods-rewarded';
var TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITHOUT_MODS_REWARDED = 'passfail-passed-given-attempt-score-without-mods-rewarded';
var TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITH_MODS_REWARDED = 'passfail-passed-given-attempt-score-with-mods-rewarded';
var TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_LESS_THAN_100 = 'passfail-passed-given-score-and-attempt-score-less-than-100';
var TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_NO_MODS_REWARDED = 'passfail-passed-given-score-and-attempt-score-is-100-and-no-mods-rewarded';
var TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_MODS_REWARDED = 'passfail-passed-given-score-and-attempt-score-is-100-and-mods-rewarded';
var TYPE_PASSFAIL_FAILED_GIVEN_ATTEMPT_SCORE = 'passfail-failed-given-attempt-score';
var TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE = 'passfail-failed-given-no-score';
var TYPE_PASSFAIL_FAILED_GIVEN_SCORE = 'passfail-failed-given-score';
var TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE = 'passfail-unable-to-pass-given-no-score';
var TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE = 'passfail-unable-to-pass-given-highest-attempt-score';
var TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE = 'passfail-unable-to-pass-given-score';
var ERROR_UNKNOWN_DISPLAY_TYPE = 'error-unknown-display-type';

exports.TYPE_ATTEMPT_WITHOUT_MODS_REWARDED = TYPE_ATTEMPT_WITHOUT_MODS_REWARDED;
exports.TYPE_ATTEMPT_WITH_MODS_REWARDED = TYPE_ATTEMPT_WITH_MODS_REWARDED;
exports.TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITHOUT_MODS_REWARDED = TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITHOUT_MODS_REWARDED;
exports.TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITH_MODS_REWARDED = TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITH_MODS_REWARDED;
exports.TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_LESS_THAN_100 = TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_LESS_THAN_100;
exports.TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_NO_MODS_REWARDED = TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_NO_MODS_REWARDED;
exports.TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_MODS_REWARDED = TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_MODS_REWARDED;
exports.TYPE_PASSFAIL_FAILED_GIVEN_ATTEMPT_SCORE = TYPE_PASSFAIL_FAILED_GIVEN_ATTEMPT_SCORE;
exports.TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE = TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE;
exports.TYPE_PASSFAIL_FAILED_GIVEN_SCORE = TYPE_PASSFAIL_FAILED_GIVEN_SCORE;
exports.TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE = TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE;
exports.TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE = TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE;
exports.TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE = TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE;
exports.ERROR_UNKNOWN_DISPLAY_TYPE = ERROR_UNKNOWN_DISPLAY_TYPE;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(65);

var _isornot = __webpack_require__(17);

var _isornot2 = _interopRequireDefault(_isornot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Logo = function Logo(props) {
	return React.createElement(
		'div',
		{ className: 'viewer--components--logo' + (0, _isornot2.default)(props.inverted, 'inverted') },
		'Obojobo'
	);
};

exports.default = Logo;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _assessmentUtil = __webpack_require__(6);

var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil);

var _questionUtil = __webpack_require__(7);

var _questionUtil2 = _interopRequireDefault(_questionUtil);

var _apiUtil = __webpack_require__(4);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

var _navUtil = __webpack_require__(2);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _navStore = __webpack_require__(12);

var _navStore2 = _interopRequireDefault(_navStore);

var _ltiNetworkStates = __webpack_require__(23);

var _ltiNetworkStates2 = _interopRequireDefault(_ltiNetworkStates);

var _questionStore = __webpack_require__(13);

var _questionStore2 = _interopRequireDefault(_questionStore);

var _assessmentScoreReporter = __webpack_require__(19);

var _assessmentScoreReporter2 = _interopRequireDefault(_assessmentScoreReporter);

var _assessmentScoreReportView = __webpack_require__(18);

var _assessmentScoreReportView2 = _interopRequireDefault(_assessmentScoreReportView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _Common2.default.flux.Store;
var Dispatcher = _Common2.default.flux.Dispatcher;
var OboModel = _Common2.default.models.OboModel;
var ErrorUtil = _Common2.default.util.ErrorUtil;
var _Common$components$mo = _Common2.default.components.modal,
    SimpleDialog = _Common$components$mo.SimpleDialog,
    Dialog = _Common$components$mo.Dialog;
var ModalUtil = _Common2.default.util.ModalUtil;


var getNewAssessmentObject = function getNewAssessmentObject(assessmentId) {
	return {
		id: assessmentId,
		current: null,
		currentResponses: [],
		attempts: [],
		highestAssessmentScoreAttempts: [],
		highestAttemptScoreAttempts: [],
		lti: null,
		ltiNetworkState: _ltiNetworkStates2.default.IDLE,
		ltiErrorCount: 0,
		isShowingAttemptHistory: false
	};
};

var AssessmentStore = function (_Store) {
	_inherits(AssessmentStore, _Store);

	function AssessmentStore() {
		_classCallCheck(this, AssessmentStore);

		var assessment = void 0,
		    id = void 0,
		    model = void 0;

		var _this = _possibleConstructorReturn(this, (AssessmentStore.__proto__ || Object.getPrototypeOf(AssessmentStore)).call(this, 'assessmentstore'));

		Dispatcher.on('assessment:startAttempt', function (payload) {
			_this.tryStartAttempt(payload.value.id);
		});

		Dispatcher.on('assessment:endAttempt', function (payload) {
			_this.tryEndAttempt(payload.value.id, payload.value.context);
		});

		Dispatcher.on('assessment:resendLTIScore', function (payload) {
			_this.tryResendLTIScore(payload.value.id);
		});

		Dispatcher.on('question:setResponse', function (payload) {
			_this.trySetResponse(payload.value.id, payload.value.response, payload.value.targetId);
		});

		Dispatcher.on('viewer:closeAttempted', function (shouldPrompt) {
			if (_assessmentUtil2.default.isInAssessment(_this.state)) {
				shouldPrompt();
			}
		});
		return _this;
	}

	_createClass(AssessmentStore, [{
		key: 'init',
		value: function init(attemptsByAssessment) {
			this.state = {
				assessments: {}

				// necessary?
			};if (!attemptsByAssessment) return;
			this.updateAttempts(attemptsByAssessment);
		}
	}, {
		key: 'updateAttempts',
		value: function updateAttempts(attemptsByAssessment) {
			var unfinishedAttempt = null;
			var nonExistantQuestions = [];
			var assessments = this.state.assessments;
			var assessment = void 0;

			attemptsByAssessment.forEach(function (assessmentItem) {
				var assessId = assessmentItem.assessmentId;
				var attempts = assessmentItem.attempts;

				if (!assessments[assessId]) {
					assessments[assessId] = getNewAssessmentObject(assessId);
				} else {
					assessments[assessId].attempts = [];
				}

				assessments[assessId].lti = assessmentItem.ltiState;
				assessments[assessId].highestAttemptScoreAttempts = _assessmentUtil2.default.findHighestAttempts(attempts, 'assessmentScore');
				assessments[assessId].highestAssessmentScoreAttempts = _assessmentUtil2.default.findHighestAttempts(attempts, 'attemptScore');

				attempts.forEach(function (attempt) {
					assessment = assessments[attempt.assessmentId];

					if (!attempt.isFinished) {
						unfinishedAttempt = attempt;
					} else {
						assessment.attempts.push(attempt);
					}

					attempt.state.questions.forEach(function (question) {
						OboModel.create(question);
					});
				});
			});

			for (var _assessment in assessments) {
				assessments[_assessment].attempts.forEach(function (attempt) {
					var scoreObject = {};
					attempt.questionScores.forEach(function (score) {
						scoreObject[score.id] = score;
					});
					var stateToUpdate = {
						scores: scoreObject,
						responses: attempt.responses
					};
					_questionStore2.default.updateStateByContext(stateToUpdate, 'assessmentReview:' + attempt.attemptId);
				});
			}

			if (unfinishedAttempt) {
				return ModalUtil.show(React.createElement(
					SimpleDialog,
					{
						ok: true,
						title: 'Resume Attempt',
						onConfirm: this.onResumeAttemptConfirm.bind(this, unfinishedAttempt)
					},
					React.createElement(
						'p',
						null,
						'It looks like you were in the middle of an attempt. We\'ll resume you where you left off.'
					)
				), true);
			}
		}
	}, {
		key: 'onResumeAttemptConfirm',
		value: function onResumeAttemptConfirm(unfinishedAttempt) {
			ModalUtil.hide();

			this.startAttempt(unfinishedAttempt);
			this.triggerChange();
		}
	}, {
		key: 'tryStartAttempt',
		value: function tryStartAttempt(id) {
			var _this2 = this;

			var model = OboModel.models[id];

			return _apiUtil2.default.startAttempt(model.getRoot(), model, {}).then(function (res) {
				if (res.status === 'error') {
					switch (res.value.message.toLowerCase()) {
						case 'attempt limit reached':
							ErrorUtil.show('No attempts left', 'You have attempted this assessment the maximum number of times available.');
							break;

						default:
							ErrorUtil.errorResponse(res);
					}
				} else {
					_this2.startAttempt(res.value);
				}

				_this2.triggerChange();
			}).catch(function (e) {
				console.error(e);
			});
		}
	}, {
		key: 'startAttempt',
		value: function startAttempt(startAttemptResp) {
			var id = startAttemptResp.assessmentId;
			var model = OboModel.models[id];

			model.children.at(1).children.reset();
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(startAttemptResp.state.questions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var child = _step.value;

					var c = OboModel.create(child);
					model.children.at(1).children.add(c);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			if (!this.state.assessments[id]) {
				this.state.assessments[id] = getNewAssessmentObject(id);
			}

			this.state.assessments[id].current = startAttemptResp;

			_navUtil2.default.setContext('assessment:' + startAttemptResp.assessmentId + ':' + startAttemptResp.attemptId);
			_navUtil2.default.rebuildMenu(model.getRoot());
			_navUtil2.default.goto(id);

			model.processTrigger('onStartAttempt');
			Dispatcher.trigger('assessment:attemptStarted', id);
		}
	}, {
		key: 'tryEndAttempt',
		value: function tryEndAttempt(id, context) {
			var _this3 = this;

			var model = OboModel.models[id];
			var assessment = this.state.assessments[id];
			return _apiUtil2.default.endAttempt(assessment.current).then(function (res) {
				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res);
				}
				_this3.endAttempt(res.value, context);
				return _this3.triggerChange();
			}).catch(function (e) {
				console.error(e);
			});
		}
	}, {
		key: 'endAttempt',
		value: function endAttempt(endAttemptResp, context) {
			var assessId = endAttemptResp.assessmentId;
			var assessment = this.state.assessments[assessId];
			var model = OboModel.models[assessId];

			assessment.current.state.questions.forEach(function (question) {
				return _questionUtil2.default.hideQuestion(question.id);
			});
			assessment.currentResponses.forEach(function (questionId) {
				return _questionUtil2.default.clearResponse(questionId, context);
			});

			assessment.current = null;

			this.updateAttempts([endAttemptResp]);

			model.processTrigger('onEndAttempt');

			Dispatcher.trigger('assessment:attemptEnded', assessId);

			var attempt = _assessmentUtil2.default.getLastAttemptForModel(this.state, model);
			var reporter = new _assessmentScoreReporter2.default({
				assessmentRubric: model.modelState.rubric.toObject(),
				totalNumberOfAttemptsAllowed: model.modelState.attempts,
				allAttempts: assessment.attempts
			});

			var assessmentLabel = _navUtil2.default.getNavLabelForModel(_navStore2.default.getState(), model);
			ModalUtil.show(React.createElement(
				Dialog,
				{
					modalClassName: 'obojobo-draft--sections--assessment--results-modal',
					centered: true,
					buttons: [{
						value: 'Show ' + assessmentLabel + ' Overview',
						onClick: ModalUtil.hide,
						default: true
					}],
					title: 'Attempt ' + attempt.attemptNumber + ' Results',
					width: '35rem'
				},
				React.createElement(_assessmentScoreReportView2.default, { report: reporter.getReportFor(attempt.attemptNumber) })
			));
		}
	}, {
		key: 'tryResendLTIScore',
		value: function tryResendLTIScore(assessmentId) {
			var _this4 = this;

			var assessmentModel = OboModel.models[assessmentId];
			var assessment = _assessmentUtil2.default.getAssessmentForModel(this.state, assessmentModel);

			assessment.ltiNetworkState = _ltiNetworkStates2.default.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE;
			this.triggerChange();

			return _apiUtil2.default.resendLTIAssessmentScore(assessmentModel.getRoot(), assessmentModel).then(function (res) {
				assessment.ltiNetworkState = _ltiNetworkStates2.default.IDLE;

				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res);
				}

				_this4.updateLTIScore(_assessmentUtil2.default.getAssessmentForModel(_this4.state, assessmentModel), res.value);
				return _this4.triggerChange();
			}).catch(function (e) {
				console.error(e);
			});
		}
	}, {
		key: 'updateLTIScore',
		value: function updateLTIScore(assessment, updateLTIScoreResp) {
			assessment.lti = updateLTIScoreResp;

			var assessmentModel = OboModel.models[assessment.id];
			if (_assessmentUtil2.default.isLTIScoreNeedingToBeResynced(this.state, assessmentModel)) {
				assessment.ltiErrorCount++;
			} else {
				assessment.ltiErrorCount = 0;
			}
			// Dispatcher.trigger('assessment:ltiScore')
		}
	}, {
		key: 'trySetResponse',
		value: function trySetResponse(questionId, response, targetId) {
			var model = OboModel.models[questionId];
			var assessment = _assessmentUtil2.default.getAssessmentForModel(this.state, model);

			if (!assessment || !assessment.currentResponses) {
				// Resolve false if not an error but couldn't do anything because not in an attempt
				return Promise.resolve(false);
			}

			assessment.currentResponses.push(questionId);
			this.triggerChange();
		}
	}, {
		key: 'getState',
		value: function getState() {
			return this.state;
		}
	}, {
		key: 'setState',
		value: function setState(newState) {
			return this.state = newState;
		}
	}]);

	return AssessmentStore;
}(Store);

var assessmentStore = new AssessmentStore();
exports.default = assessmentStore;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	IDLE: 'idle',
	AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE: 'awaitingSendAssessmentScoreResponse'
	//AWAITING_READ_RESULT_RESPONSE: 'awaitingReadResultResponse'
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (url) {
	if (!url) return null;

	var hostname = (0, _urlParse2.default)(url, {}).hostname;

	if (hostname === '' || !hostname) return 'the external system';
	return hostname;
};

var _urlParse = __webpack_require__(49);

var _urlParse2 = _interopRequireDefault(_urlParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function (self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isDataView = function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    };

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ',' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(62);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Viewer = _index2.default;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var startOfDay = __webpack_require__(37);

var MILLISECONDS_IN_MINUTE = 60000;
var MILLISECONDS_IN_DAY = 86400000;

/**
 * @category Day Helpers
 * @summary Get the number of calendar days between the given dates.
 *
 * @description
 * Get the number of calendar days between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar days
 *
 * @example
 * // How many calendar days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * var result = differenceInCalendarDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 366
 */
function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
  var startOfDayLeft = startOfDay(dirtyDateLeft);
  var startOfDayRight = startOfDay(dirtyDateRight);

  var timestampLeft = startOfDayLeft.getTime() - startOfDayLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
  var timestampRight = startOfDayRight.getTime() - startOfDayRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a day is not constant
  // (e.g. it's different in the day of the daylight saving time clock shift)
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);
}

module.exports = differenceInCalendarDays;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getDayOfYear = __webpack_require__(30);
var getISOWeek = __webpack_require__(31);
var getISOYear = __webpack_require__(14);
var parse = __webpack_require__(1);
var isValid = __webpack_require__(32);
var enLocale = __webpack_require__(36);

/**
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format.
 *
 * Accepted tokens:
 * | Unit                    | Token | Result examples                  |
 * |-------------------------|-------|----------------------------------|
 * | Month                   | M     | 1, 2, ..., 12                    |
 * |                         | Mo    | 1st, 2nd, ..., 12th              |
 * |                         | MM    | 01, 02, ..., 12                  |
 * |                         | MMM   | Jan, Feb, ..., Dec               |
 * |                         | MMMM  | January, February, ..., December |
 * | Quarter                 | Q     | 1, 2, 3, 4                       |
 * |                         | Qo    | 1st, 2nd, 3rd, 4th               |
 * | Day of month            | D     | 1, 2, ..., 31                    |
 * |                         | Do    | 1st, 2nd, ..., 31st              |
 * |                         | DD    | 01, 02, ..., 31                  |
 * | Day of year             | DDD   | 1, 2, ..., 366                   |
 * |                         | DDDo  | 1st, 2nd, ..., 366th             |
 * |                         | DDDD  | 001, 002, ..., 366               |
 * | Day of week             | d     | 0, 1, ..., 6                     |
 * |                         | do    | 0th, 1st, ..., 6th               |
 * |                         | dd    | Su, Mo, ..., Sa                  |
 * |                         | ddd   | Sun, Mon, ..., Sat               |
 * |                         | dddd  | Sunday, Monday, ..., Saturday    |
 * | Day of ISO week         | E     | 1, 2, ..., 7                     |
 * | ISO week                | W     | 1, 2, ..., 53                    |
 * |                         | Wo    | 1st, 2nd, ..., 53rd              |
 * |                         | WW    | 01, 02, ..., 53                  |
 * | Year                    | YY    | 00, 01, ..., 99                  |
 * |                         | YYYY  | 1900, 1901, ..., 2099            |
 * | ISO week-numbering year | GG    | 00, 01, ..., 99                  |
 * |                         | GGGG  | 1900, 1901, ..., 2099            |
 * | AM/PM                   | A     | AM, PM                           |
 * |                         | a     | am, pm                           |
 * |                         | aa    | a.m., p.m.                       |
 * | Hour                    | H     | 0, 1, ... 23                     |
 * |                         | HH    | 00, 01, ... 23                   |
 * |                         | h     | 1, 2, ..., 12                    |
 * |                         | hh    | 01, 02, ..., 12                  |
 * | Minute                  | m     | 0, 1, ..., 59                    |
 * |                         | mm    | 00, 01, ..., 59                  |
 * | Second                  | s     | 0, 1, ..., 59                    |
 * |                         | ss    | 00, 01, ..., 59                  |
 * | 1/10 of second          | S     | 0, 1, ..., 9                     |
 * | 1/100 of second         | SS    | 00, 01, ..., 99                  |
 * | Millisecond             | SSS   | 000, 001, ..., 999               |
 * | Timezone                | Z     | -01:00, +00:00, ... +12:00       |
 * |                         | ZZ    | -0100, +0000, ..., +1200         |
 * | Seconds timestamp       | X     | 512969520                        |
 * | Milliseconds timestamp  | x     | 512969520900                     |
 *
 * The characters wrapped in square brackets are escaped.
 *
 * The result may vary by locale.
 *
 * @param {Date|String|Number} date - the original date
 * @param {String} [format='YYYY-MM-DDTHH:mm:ss.SSSZ'] - the string of tokens
 * @param {Object} [options] - the object with options
 * @param {Object} [options.locale=enLocale] - the locale object
 * @returns {String} the formatted date string
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * var result = format(
 *   new Date(2014, 1, 11),
 *   'MM/DD/YYYY'
 * )
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * var eoLocale = require('date-fns/locale/eo')
 * var result = format(
 *   new Date(2014, 6, 2),
 *   'Do [de] MMMM YYYY',
 *   {locale: eoLocale}
 * )
 * //=> '2-a de julio 2014'
 */
function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
  var formatStr = dirtyFormatStr ? String(dirtyFormatStr) : 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  var options = dirtyOptions || {};

  var locale = options.locale;
  var localeFormatters = enLocale.format.formatters;
  var formattingTokensRegExp = enLocale.format.formattingTokensRegExp;
  if (locale && locale.format && locale.format.formatters) {
    localeFormatters = locale.format.formatters;

    if (locale.format.formattingTokensRegExp) {
      formattingTokensRegExp = locale.format.formattingTokensRegExp;
    }
  }

  var date = parse(dirtyDate);

  if (!isValid(date)) {
    return 'Invalid Date';
  }

  var formatFn = buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp);

  return formatFn(date);
}

var formatters = {
  // Month: 1, 2, ..., 12
  'M': function M(date) {
    return date.getMonth() + 1;
  },

  // Month: 01, 02, ..., 12
  'MM': function MM(date) {
    return addLeadingZeros(date.getMonth() + 1, 2);
  },

  // Quarter: 1, 2, 3, 4
  'Q': function Q(date) {
    return Math.ceil((date.getMonth() + 1) / 3);
  },

  // Day of month: 1, 2, ..., 31
  'D': function D(date) {
    return date.getDate();
  },

  // Day of month: 01, 02, ..., 31
  'DD': function DD(date) {
    return addLeadingZeros(date.getDate(), 2);
  },

  // Day of year: 1, 2, ..., 366
  'DDD': function DDD(date) {
    return getDayOfYear(date);
  },

  // Day of year: 001, 002, ..., 366
  'DDDD': function DDDD(date) {
    return addLeadingZeros(getDayOfYear(date), 3);
  },

  // Day of week: 0, 1, ..., 6
  'd': function d(date) {
    return date.getDay();
  },

  // Day of ISO week: 1, 2, ..., 7
  'E': function E(date) {
    return date.getDay() || 7;
  },

  // ISO week: 1, 2, ..., 53
  'W': function W(date) {
    return getISOWeek(date);
  },

  // ISO week: 01, 02, ..., 53
  'WW': function WW(date) {
    return addLeadingZeros(getISOWeek(date), 2);
  },

  // Year: 00, 01, ..., 99
  'YY': function YY(date) {
    return addLeadingZeros(date.getFullYear(), 4).substr(2);
  },

  // Year: 1900, 1901, ..., 2099
  'YYYY': function YYYY(date) {
    return addLeadingZeros(date.getFullYear(), 4);
  },

  // ISO week-numbering year: 00, 01, ..., 99
  'GG': function GG(date) {
    return String(getISOYear(date)).substr(2);
  },

  // ISO week-numbering year: 1900, 1901, ..., 2099
  'GGGG': function GGGG(date) {
    return getISOYear(date);
  },

  // Hour: 0, 1, ... 23
  'H': function H(date) {
    return date.getHours();
  },

  // Hour: 00, 01, ..., 23
  'HH': function HH(date) {
    return addLeadingZeros(date.getHours(), 2);
  },

  // Hour: 1, 2, ..., 12
  'h': function h(date) {
    var hours = date.getHours();
    if (hours === 0) {
      return 12;
    } else if (hours > 12) {
      return hours % 12;
    } else {
      return hours;
    }
  },

  // Hour: 01, 02, ..., 12
  'hh': function hh(date) {
    return addLeadingZeros(formatters['h'](date), 2);
  },

  // Minute: 0, 1, ..., 59
  'm': function m(date) {
    return date.getMinutes();
  },

  // Minute: 00, 01, ..., 59
  'mm': function mm(date) {
    return addLeadingZeros(date.getMinutes(), 2);
  },

  // Second: 0, 1, ..., 59
  's': function s(date) {
    return date.getSeconds();
  },

  // Second: 00, 01, ..., 59
  'ss': function ss(date) {
    return addLeadingZeros(date.getSeconds(), 2);
  },

  // 1/10 of second: 0, 1, ..., 9
  'S': function S(date) {
    return Math.floor(date.getMilliseconds() / 100);
  },

  // 1/100 of second: 00, 01, ..., 99
  'SS': function SS(date) {
    return addLeadingZeros(Math.floor(date.getMilliseconds() / 10), 2);
  },

  // Millisecond: 000, 001, ..., 999
  'SSS': function SSS(date) {
    return addLeadingZeros(date.getMilliseconds(), 3);
  },

  // Timezone: -01:00, +00:00, ... +12:00
  'Z': function Z(date) {
    return formatTimezone(date.getTimezoneOffset(), ':');
  },

  // Timezone: -0100, +0000, ... +1200
  'ZZ': function ZZ(date) {
    return formatTimezone(date.getTimezoneOffset());
  },

  // Seconds timestamp: 512969520
  'X': function X(date) {
    return Math.floor(date.getTime() / 1000);
  },

  // Milliseconds timestamp: 512969520900
  'x': function x(date) {
    return date.getTime();
  }
};

function buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp) {
  var array = formatStr.match(formattingTokensRegExp);
  var length = array.length;

  var i;
  var formatter;
  for (i = 0; i < length; i++) {
    formatter = localeFormatters[array[i]] || formatters[array[i]];
    if (formatter) {
      array[i] = formatter;
    } else {
      array[i] = removeFormattingTokens(array[i]);
    }
  }

  return function (date) {
    var output = '';
    for (var i = 0; i < length; i++) {
      if (array[i] instanceof Function) {
        output += array[i](date, formatters);
      } else {
        output += array[i];
      }
    }
    return output;
  };
}

function removeFormattingTokens(input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|]$/g, '');
  }
  return input.replace(/\\/g, '');
}

function formatTimezone(offset, delimeter) {
  delimeter = delimeter || '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  return sign + addLeadingZeros(hours, 2) + delimeter + addLeadingZeros(minutes, 2);
}

function addLeadingZeros(number, targetLength) {
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}

module.exports = format;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(1);
var startOfYear = __webpack_require__(40);
var differenceInCalendarDays = __webpack_require__(28);

/**
 * @category Day Helpers
 * @summary Get the day of the year of the given date.
 *
 * @description
 * Get the day of the year of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the day of year
 *
 * @example
 * // Which day of the year is 2 July 2014?
 * var result = getDayOfYear(new Date(2014, 6, 2))
 * //=> 183
 */
function getDayOfYear(dirtyDate) {
  var date = parse(dirtyDate);
  var diff = differenceInCalendarDays(date, startOfYear(date));
  var dayOfYear = diff + 1;
  return dayOfYear;
}

module.exports = getDayOfYear;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(1);
var startOfISOWeek = __webpack_require__(8);
var startOfISOYear = __webpack_require__(38);

var MILLISECONDS_IN_WEEK = 604800000;

/**
 * @category ISO Week Helpers
 * @summary Get the ISO week of the given date.
 *
 * @description
 * Get the ISO week of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the ISO week
 *
 * @example
 * // Which week of the ISO-week numbering year is 2 January 2005?
 * var result = getISOWeek(new Date(2005, 0, 2))
 * //=> 53
 */
function getISOWeek(dirtyDate) {
  var date = parse(dirtyDate);
  var diff = startOfISOWeek(date).getTime() - startOfISOYear(date).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

module.exports = getISOWeek;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isDate = __webpack_require__(15);

/**
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @param {Date} date - the date to check
 * @returns {Boolean} the date is valid
 * @throws {TypeError} argument must be an instance of Date
 *
 * @example
 * // For the valid date:
 * var result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the invalid date:
 * var result = isValid(new Date(''))
 * //=> false
 */
function isValid(dirtyDate) {
  if (isDate(dirtyDate)) {
    return !isNaN(dirtyDate);
  } else {
    throw new TypeError(toString.call(dirtyDate) + ' is not an instance of Date');
  }
}

module.exports = isValid;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var commonFormatterKeys = ['M', 'MM', 'Q', 'D', 'DD', 'DDD', 'DDDD', 'd', 'E', 'W', 'WW', 'YY', 'YYYY', 'GG', 'GGGG', 'H', 'HH', 'h', 'hh', 'm', 'mm', 's', 'ss', 'S', 'SS', 'SSS', 'Z', 'ZZ', 'X', 'x'];

function buildFormattingTokensRegExp(formatters) {
  var formatterKeys = [];
  for (var key in formatters) {
    if (formatters.hasOwnProperty(key)) {
      formatterKeys.push(key);
    }
  }

  var formattingTokens = commonFormatterKeys.concat(formatterKeys).sort().reverse();
  var formattingTokensRegExp = new RegExp('(\\[[^\\[]*\\])|(\\\\)?' + '(' + formattingTokens.join('|') + '|.)', 'g');

  return formattingTokensRegExp;
}

module.exports = buildFormattingTokensRegExp;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function buildDistanceInWordsLocale() {
  var distanceInWordsLocale = {
    lessThanXSeconds: {
      one: 'less than a second',
      other: 'less than {{count}} seconds'
    },

    xSeconds: {
      one: '1 second',
      other: '{{count}} seconds'
    },

    halfAMinute: 'half a minute',

    lessThanXMinutes: {
      one: 'less than a minute',
      other: 'less than {{count}} minutes'
    },

    xMinutes: {
      one: '1 minute',
      other: '{{count}} minutes'
    },

    aboutXHours: {
      one: 'about 1 hour',
      other: 'about {{count}} hours'
    },

    xHours: {
      one: '1 hour',
      other: '{{count}} hours'
    },

    xDays: {
      one: '1 day',
      other: '{{count}} days'
    },

    aboutXMonths: {
      one: 'about 1 month',
      other: 'about {{count}} months'
    },

    xMonths: {
      one: '1 month',
      other: '{{count}} months'
    },

    aboutXYears: {
      one: 'about 1 year',
      other: 'about {{count}} years'
    },

    xYears: {
      one: '1 year',
      other: '{{count}} years'
    },

    overXYears: {
      one: 'over 1 year',
      other: 'over {{count}} years'
    },

    almostXYears: {
      one: 'almost 1 year',
      other: 'almost {{count}} years'
    }
  };

  function localize(token, count, options) {
    options = options || {};

    var result;
    if (typeof distanceInWordsLocale[token] === 'string') {
      result = distanceInWordsLocale[token];
    } else if (count === 1) {
      result = distanceInWordsLocale[token].one;
    } else {
      result = distanceInWordsLocale[token].other.replace('{{count}}', count);
    }

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return 'in ' + result;
      } else {
        return result + ' ago';
      }
    }

    return result;
  }

  return {
    localize: localize
  };
}

module.exports = buildDistanceInWordsLocale;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var buildFormattingTokensRegExp = __webpack_require__(33);

function buildFormatLocale() {
  // Note: in English, the names of days of the week and months are capitalized.
  // If you are making a new locale based on this one, check if the same is true for the language you're working on.
  // Generally, formatted dates should look like they are in the middle of a sentence,
  // e.g. in Spanish language the weekdays and months should be in the lowercase.
  var months3char = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var weekdays2char = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var weekdays3char = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var meridiemUppercase = ['AM', 'PM'];
  var meridiemLowercase = ['am', 'pm'];
  var meridiemFull = ['a.m.', 'p.m.'];

  var formatters = {
    // Month: Jan, Feb, ..., Dec
    'MMM': function MMM(date) {
      return months3char[date.getMonth()];
    },

    // Month: January, February, ..., December
    'MMMM': function MMMM(date) {
      return monthsFull[date.getMonth()];
    },

    // Day of week: Su, Mo, ..., Sa
    'dd': function dd(date) {
      return weekdays2char[date.getDay()];
    },

    // Day of week: Sun, Mon, ..., Sat
    'ddd': function ddd(date) {
      return weekdays3char[date.getDay()];
    },

    // Day of week: Sunday, Monday, ..., Saturday
    'dddd': function dddd(date) {
      return weekdaysFull[date.getDay()];
    },

    // AM, PM
    'A': function A(date) {
      return date.getHours() / 12 >= 1 ? meridiemUppercase[1] : meridiemUppercase[0];
    },

    // am, pm
    'a': function a(date) {
      return date.getHours() / 12 >= 1 ? meridiemLowercase[1] : meridiemLowercase[0];
    },

    // a.m., p.m.
    'aa': function aa(date) {
      return date.getHours() / 12 >= 1 ? meridiemFull[1] : meridiemFull[0];
    }

    // Generate ordinal version of formatters: M -> Mo, D -> Do, etc.
  };var ordinalFormatters = ['M', 'D', 'DDD', 'd', 'Q', 'W'];
  ordinalFormatters.forEach(function (formatterToken) {
    formatters[formatterToken + 'o'] = function (date, formatters) {
      return ordinal(formatters[formatterToken](date));
    };
  });

  return {
    formatters: formatters,
    formattingTokensRegExp: buildFormattingTokensRegExp(formatters)
  };
}

function ordinal(number) {
  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st';
      case 2:
        return number + 'nd';
      case 3:
        return number + 'rd';
    }
  }
  return number + 'th';
}

module.exports = buildFormatLocale;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var buildDistanceInWordsLocale = __webpack_require__(34);
var buildFormatLocale = __webpack_require__(35);

/**
 * @category Locales
 * @summary English locale.
 */
module.exports = {
  distanceInWords: buildDistanceInWordsLocale(),
  format: buildFormatLocale()
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(1);

/**
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a day
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * var result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */
function startOfDay(dirtyDate) {
  var date = parse(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfDay;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getISOYear = __webpack_require__(14);
var startOfISOWeek = __webpack_require__(8);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the start of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the start of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of an ISO year
 *
 * @example
 * // The start of an ISO week-numbering year for 2 July 2005:
 * var result = startOfISOYear(new Date(2005, 6, 2))
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfISOYear(dirtyDate) {
  var year = getISOYear(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuary);
  return date;
}

module.exports = startOfISOYear;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(1);

/**
 * @category Week Helpers
 * @summary Return the start of a week for the given date.
 *
 * @description
 * Return the start of a week for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @param {Object} [options] - the object with options
 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Date} the start of a week
 *
 * @example
 * // The start of a week for 2 September 2014 11:55:00:
 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfWeek(dirtyDate, dirtyOptions) {
  var weekStartsOn = dirtyOptions ? Number(dirtyOptions.weekStartsOn) || 0 : 0;

  var date = parse(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfWeek;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(1);

/**
 * @category Year Helpers
 * @summary Return the start of a year for the given date.
 *
 * @description
 * Return the start of a year for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a year
 *
 * @example
 * // The start of a year for 2 September 2014 11:55:00:
 * var result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Jan 01 2014 00:00:00
 */
function startOfYear(dirtyDate) {
  var cleanDate = parse(dirtyDate);
  var date = new Date(0);
  date.setFullYear(cleanDate.getFullYear(), 0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfYear;

/***/ }),
/* 41 */
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
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
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
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
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
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (process.env.NODE_ENV !== 'production') {
  var invariant = __webpack_require__(10);
  var warning = __webpack_require__(16);
  var ReactPropTypesSecret = __webpack_require__(11);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, _typeof(typeSpecs[typeSpecName]));
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error === 'undefined' ? 'undefined' : _typeof(error));
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(9);
var invariant = __webpack_require__(10);
var ReactPropTypesSecret = __webpack_require__(11);

module.exports = function () {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var emptyFunction = __webpack_require__(9);
var invariant = __webpack_require__(10);
var warning = __webpack_require__(16);
var assign = __webpack_require__(41);

var ReactPropTypesSecret = __webpack_require__(11);
var checkPropTypes = __webpack_require__(42);

module.exports = function (isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (!manualPropTypeCallCache[cacheKey] &&
          // Avoid spamming the console because they are often not actionable except for lib authors
          manualPropTypeWarningCount < 3) {
            warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(false, 'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received %s at index %s.', getPostfixForTypeWarning(checker), i);
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue);
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

  var isValidElement = function isValidElement(object) {
    return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(44)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(43)();
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g,
      result = {},
      part;

  while (part = parser.exec(query)) {
    var key = decode(part[1]),
        value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    if (key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(25);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(45);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _format = __webpack_require__(29);

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
} /**
   * React Idle Timer
   *
   * @author  Randy Lebeau
   * @class   IdleTimer
   *
   */

var IdleTimer = function (_Component) {
  _inherits(IdleTimer, _Component);

  function IdleTimer() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, IdleTimer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(IdleTimer)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
      idle: false,
      oldDate: +new Date(),
      lastActive: +new Date(),
      remaining: null,
      pageX: null,
      pageY: null
    }, _this.tId = null, _this._handleEvent = function (e) {

      // Already idle, ignore events
      if (_this.state.remaining) return;

      // Mousemove event
      if (e.type === 'mousemove') {
        // if coord are same, it didn't move
        if (e.pageX === _this.state.pageX && e.pageY === _this.state.pageY) return;
        // if coord don't exist how could it move
        if (typeof e.pageX === 'undefined' && typeof e.pageY === 'undefined') return;
        // under 200 ms is hard to do, and you would have to stop, as continuous activity will bypass this
        var elapsed = _this.getElapsedTime();
        if (elapsed < 200) return;
      }

      // clear any existing timeout
      clearTimeout(_this.tId

      // if the idle timer is enabled, flip
      );if (_this.state.idle) {
        _this._toggleIdleState(e);
      }

      _this.setState({
        lastActive: +new Date(), // store when user was last active
        pageX: e.pageX, // update mouse coord
        pageY: e.pageY
      });

      _this.tId = setTimeout(_this._toggleIdleState.bind(_this), _this.props.timeout // set a new timeout

      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(IdleTimer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.props.events.forEach(function (e) {
        return _this2.props.element.addEventListener(e, _this2._handleEvent);
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.startOnLoad) {
        this.reset();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      // Clear timeout to prevent delayed state changes
      clearTimeout(this.tId);
      // Unbind all events
      this.props.events.forEach(function (e) {
        return _this3.props.element.removeEventListener(e, _this3._handleEvent);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children ? this.props.children : null;
    }

    /////////////////////
    // Private Methods //
    /////////////////////

    /**
     * Toggles the idle state and calls the proper action
     *
     * @return {void}
     *
     */

  }, {
    key: '_toggleIdleState',
    value: function _toggleIdleState() {
      // Set the state
      this.setState({
        idle: !this.state.idle
      });

      // Fire the appropriate action
      if (!this.state.idle) this.props.activeAction();else this.props.idleAction();
    }

    /**
     * Event handler for supported event types
     *
     * @param  {Object} e event object
     * @return {void}
     *
     */

  }, {
    key: 'reset',

    ////////////////
    // Public API //
    ////////////////

    /**
     * Restore initial settings and restart timer
     *
     * @return {Void}
     *
     */

    value: function reset() {
      // reset timers
      clearTimeout(this.tId);

      // reset settings
      this.setState({
        idle: false,
        oldDate: +new Date(),
        lastActive: this.state.oldDate,
        remaining: null
      });

      // Set timeout
      this.tId = setTimeout(this._toggleIdleState.bind(this), this.props.timeout);
    }

    /**
     * Store remaining time and stop timer.
     * You can pause from idle or active state.
     *
     * @return {Void}
     *
     */

  }, {
    key: 'pause',
    value: function pause() {
      // this is already paused
      if (this.state.remaining !== null) {
        return;
      }

      console.log('pausing');

      // clear any existing timeout
      clearTimeout(this.tId

      // define how much is left on the timer
      );this.setState({
        remaining: this.getRemainingTime()
      });
    }

    /**
     * Resumes a stopped timer
     *
     * @return {Void}
     *
     */

  }, {
    key: 'resume',
    value: function resume() {
      // this isn't paused yet
      if (this.state.remaining === null) {
        return;
      }

      // start timer and clear remaining
      if (!this.state.idle) {
        this.setState({
          remaining: null
        });
        // Set a new timeout
        this.tId = setTimeout(this._toggleIdleState.bind(this), this.state.remaining);
      }
    }

    /**
     * Time remaining before idle
     *
     * @return {Number} Milliseconds remaining
     *
     */

  }, {
    key: 'getRemainingTime',
    value: function getRemainingTime() {
      // If idle there is no time remaining
      if (this.state.idle) {
        return 0;
      }

      // If its paused just return that
      if (this.state.remaining !== null) {
        return this.state.remaining;
      }

      // Determine remaining, if negative idle didn't finish flipping, just return 0
      var remaining = this.props.timeout - (+new Date() - this.state.lastActive);
      if (remaining < 0) {
        remaining = 0;
      }

      // If this is paused return that number, else return current remaining
      return remaining;
    }

    /**
     * How much time has elapsed
     *
     * @return {Timestamp}
     *
     */

  }, {
    key: 'getElapsedTime',
    value: function getElapsedTime() {
      return +new Date() - this.state.oldDate;
    }

    /**
     * Last time the user was active
     *
     * @return {Timestamp}
     *
     */

  }, {
    key: 'getLastActiveTime',
    value: function getLastActiveTime() {
      if (this.props.format) {
        return (0, _format2.default)(this.state.lastActive, this.props.format);
      }
      return this.state.lastActive;
    }

    /**
     * Is the user idle
     *
     * @return {Boolean}
     *
     */

  }, {
    key: 'isIdle',
    value: function isIdle() {
      return this.state.idle;
    }
  }]);

  return IdleTimer;
}(_react.Component);

IdleTimer.propTypes = {
  timeout: _propTypes2.default.number, // Activity timeout
  events: _propTypes2.default.arrayOf(_propTypes2.default.string), // Activity events to bind
  idleAction: _propTypes2.default.func, // Action to call when user becomes inactive
  activeAction: _propTypes2.default.func, // Action to call when user becomes active
  element: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]), // Element ref to watch activty on
  format: _propTypes2.default.string,
  startOnLoad: _propTypes2.default.bool
};
IdleTimer.defaultProps = {
  timeout: 1000 * 60 * 20, // 20 minutes
  events: ['mousemove', 'keydown', 'wheel', 'DOMMouseScroll', 'mouseWheel', 'mousedown', 'touchstart', 'touchmove', 'MSPointerDown', 'MSPointerMove'],
  idleAction: function idleAction() {},
  activeAction: function activeAction() {},
  element: (typeof window === 'undefined' ? 'undefined' : typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? document : {},
  startOnLoad: true
};
exports.default = IdleTimer;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */

module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
      return port !== 80;

    case 'https':
    case 'wss':
      return port !== 443;

    case 'ftp':
      return port !== 21;

    case 'gopher':
      return port !== 70;

    case 'file':
      return false;
  }

  return port !== 0;
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var required = __webpack_require__(48),
    qs = __webpack_require__(46),
    protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,
    slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [['#', 'hash'], // Extract from the back.
['?', 'query'], // Extract from the back.
['/', 'pathname'], // Extract from the back.
['@', 'auth', 1], // Extract from the front.
[NaN, 'host', undefined, 1, 1], // Set left over value.
[/:(\d+)$/, 'port', undefined, 1], // RegExp the back.
[NaN, 'hostname', undefined, 1, 1] // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
function lolcation(loc) {
  loc = loc || global.location || {};

  var finaldestination = {},
      type = typeof loc === 'undefined' ? 'undefined' : _typeof(loc),
      key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) {
      delete finaldestination[key];
    }
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
      i = path.length,
      last = path[i - 1],
      unshift = false,
      up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative,
      extracted,
      parse,
      instruction,
      index,
      key,
      instructions = rules.slice(),
      type = typeof location === 'undefined' ? 'undefined' : _typeof(location),
      url = this,
      i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if (index = parse.exec(address)) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : '');

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname + ':' + value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':' + url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query,
      url = this,
      protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':' + url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === _typeof(url.query) ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?' + query : query;

  if (url.hash) result += url.hash;

  return result;
}

URL.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;

module.exports = URL;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50)))

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _displayTypes = __webpack_require__(20);

var getDisplayType = function getDisplayType(_ref) {
	var rubricType = _ref.rubricType,
	    mods = _ref.mods,
	    status = _ref.status,
	    statusResult = _ref.statusResult,
	    isAttemptScore100 = _ref.isAttemptScore100;

	var passed = status === 'passed';
	var failed = status === 'failed';
	var unableToPass = status === 'unableToPass';
	var isAttemptRubric = rubricType === 'attempt';
	var isPassFailRubric = rubricType === 'pass-fail';
	var isRewardedMods = mods.length > 0;
	var isResultNumeric = Number.isFinite(parseFloat(statusResult));
	var isResultNoScore = statusResult === 'no-score';
	var isResultAttemptScore = statusResult === '$attempt_score';
	var isResultHighestAttemptScore = statusResult === '$highest_attempt_score';

	var items = [];

	if (isAttemptRubric && passed && isResultAttemptScore && !isRewardedMods) {
		return _displayTypes.TYPE_ATTEMPT_WITHOUT_MODS_REWARDED;
	}
	if (isAttemptRubric && passed && isResultAttemptScore && isRewardedMods) {
		return _displayTypes.TYPE_ATTEMPT_WITH_MODS_REWARDED;
	}
	if (isPassFailRubric && passed && isResultAttemptScore && !isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITHOUT_MODS_REWARDED;
	}
	if (isPassFailRubric && passed && isResultAttemptScore && isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITH_MODS_REWARDED;
	}
	if (isPassFailRubric && passed && isResultNumeric && !isAttemptScore100) {
		return _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_LESS_THAN_100;
	}
	if (isPassFailRubric && passed && isResultNumeric && isAttemptScore100 && !isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_NO_MODS_REWARDED;
	}
	if (isPassFailRubric && passed && isResultNumeric && isAttemptScore100 && isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_MODS_REWARDED;
	}
	if (isPassFailRubric && failed && isResultAttemptScore && !isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_FAILED_GIVEN_ATTEMPT_SCORE;
	}
	if (isPassFailRubric && failed && isResultNoScore && !isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE;
	}
	if (isPassFailRubric && failed && isResultNumeric && !isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_FAILED_GIVEN_SCORE;
	}
	if (isPassFailRubric && unableToPass && isResultNoScore && !isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE;
	}
	if (isPassFailRubric && unableToPass && isResultHighestAttemptScore && !isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE;
	}
	if (isPassFailRubric && unableToPass && isResultNumeric && !isRewardedMods) {
		return _displayTypes.TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE;
	}

	return _displayTypes.ERROR_UNKNOWN_DISPLAY_TYPE;
};

exports.default = getDisplayType;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getDisplayFriendlyScore = __webpack_require__(5);

var _getDisplayFriendlyScore2 = _interopRequireDefault(_getDisplayFriendlyScore);

var _getStatusResult = __webpack_require__(56);

var _getStatusResult2 = _interopRequireDefault(_getStatusResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getReportDetailsForAttempt = function getReportDetailsForAttempt(assessmentRubric, scoreInfo) {
	var statusResult = (0, _getStatusResult2.default)(assessmentRubric, scoreInfo.status);

	return {
		rubricType: assessmentRubric.type,
		mods: scoreInfo.rewardedMods.map(function (modIndex) {
			return assessmentRubric.mods[modIndex];
		}),
		status: scoreInfo.status,
		statusResult: statusResult,
		passingAttemptScore: typeof assessmentRubric.passingAttemptScore !== 'undefined' ? assessmentRubric.passingAttemptScore : 100,
		isAttemptScore100: scoreInfo.attemptScore === 100,
		isAssessScoreOver100: scoreInfo.status === 'passed' && scoreInfo.assessmentScore !== null && scoreInfo.assessmentScore + scoreInfo.rewardTotal > 100
	};
};

exports.default = getReportDetailsForAttempt;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getDisplayFriendlyScore = __webpack_require__(5);

var _getDisplayFriendlyScore2 = _interopRequireDefault(_getDisplayFriendlyScore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getReportDetailsForAttempt = function getReportDetailsForAttempt(scoreInfo, totalNumberOfAttemptsAllowed) {
	return {
		attemptNum: '' + scoreInfo.attemptNumber,
		attemptScore: (0, _getDisplayFriendlyScore2.default)(scoreInfo.attemptScore),
		assessScore: scoreInfo.assessmentModdedScore === null ? 'Did Not Pass' : (0, _getDisplayFriendlyScore2.default)(scoreInfo.assessmentModdedScore),
		totalNumberOfAttemptsAllowed: '' + totalNumberOfAttemptsAllowed
	};
};

exports.default = getReportDetailsForAttempt;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var getScoreChangeDescription = function getScoreChangeDescription(_ref) {
	var prevHighestInfo = _ref.prevHighestInfo,
	    newInfo = _ref.newInfo;

	if (prevHighestInfo === null || newInfo === null) return null;

	var prevHighestScore = prevHighestInfo.assessmentModdedScore;
	var newScore = newInfo.assessmentModdedScore;

	if (newScore === null && prevHighestScore === null) {
		return 'This did not change your recorded score';
	}

	if (prevHighestScore === null) {
		return '\u2714 Your recorded score was updated to ' + Math.round(newScore) + '%';
	}

	if (newScore > prevHighestScore) {
		return '\u2714 Your recorded score was updated from ' + Math.round(prevHighestScore) + '% to ' + Math.round(newScore) + '%';
	}

	if (newScore === prevHighestScore) {
		return 'This maintains your recorded score of ' + Math.round(prevHighestScore) + '%';
	}

	// Else newScore === null && prevHighestScore !== null
	return 'This did not change your recorded score of ' + Math.round(prevHighestScore) + '%';
};

exports.default = getScoreChangeDescription;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assessmentUtil = __webpack_require__(6);

var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getScoreComparisionData = function getScoreComparisionData(allAttempts, attemptNumberToGenerateReportFor) {
	if (allAttempts.length === 0) {
		return {
			prevHighestInfo: null,
			newInfo: null
		};
	}

	var prevAttempts = allAttempts.slice(0, attemptNumberToGenerateReportFor - 1);
	var highestAttempts = _assessmentUtil2.default.findHighestAttempts(prevAttempts, 'assessmentScore');
	var prevHighestAttempt = highestAttempts.length === 0 ? null : highestAttempts[0];

	return {
		prevHighestInfo: prevHighestAttempt ? prevHighestAttempt.assessmentScoreDetails : null,
		newInfo: allAttempts[attemptNumberToGenerateReportFor - 1].assessmentScoreDetails
	};
};

exports.default = getScoreComparisionData;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var getStatusResult = function getStatusResult(rubric, status) {
	switch (status) {
		case 'passed':
			return typeof rubric.passedResult !== 'undefined' ? rubric.passedResult : 100;
		case 'failed':
			return typeof rubric.failedResult !== 'undefined' ? rubric.failedResult : 0;
		case 'unableToPass':
			return typeof rubric.unableToPassResult !== 'undefined' ? rubric.unableToPassResult : 0;
	}

	throw new Error('Unknown status: ' + status);
};

exports.default = getStatusResult;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getDisplayFriendlyScore = __webpack_require__(5);

var _getDisplayFriendlyScore2 = _interopRequireDefault(_getDisplayFriendlyScore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var whitespaceRegex = /\s/g;

var getModText = function getModText(attemptCondition, totalNumberOfAttemptsAllowed) {
	attemptCondition = ('' + attemptCondition).replace(whitespaceRegex, '').replace('$last_attempt', '' + totalNumberOfAttemptsAllowed);

	var range = [];
	if (attemptCondition.indexOf(',') === -1) {
		range.push(parseInt(attemptCondition, 10));
	} else {
		var tokens = attemptCondition.split(',');
		range.push(parseInt(tokens[0].substr(1), 10));
		range.push(parseInt(tokens[1].substr(0, tokens[1].length - 1), 10));

		if (tokens[0].charAt(0) === '(') range[0]++;
		if (tokens[1].charAt(tokens[1].length - 1) === ')') range[1]--;

		if (range[0] === range[1]) range.splice(1, 1);
	}

	if (range.length === 1) {
		if (range[0] === 1) return 'Passed on first attempt';
		if (range[0] === totalNumberOfAttemptsAllowed) return 'Passed on last attempt';
		return 'Passed on attempt\xA0' + range[0];
	}

	return 'Passed on attempts ' + range[0] + ' to ' + range[1];
};

var getTextItemsForMods = function getTextItemsForMods(mods, totalNumberOfAttemptsAllowed) {
	return mods.map(function (mod) {
		return {
			type: parseInt(mod.reward) >= 0 ? 'extra-credit' : 'penalty',
			text: getModText(mod.attemptCondition, totalNumberOfAttemptsAllowed),
			value: (0, _getDisplayFriendlyScore2.default)(Math.abs(mod.reward))
		};
	});
};

exports.default = getTextItemsForMods;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getDisplayFriendlyScore = __webpack_require__(5);

var _getDisplayFriendlyScore2 = _interopRequireDefault(_getDisplayFriendlyScore);

var _getTextItemsForMods = __webpack_require__(57);

var _getTextItemsForMods2 = _interopRequireDefault(_getTextItemsForMods);

var _getDisplayType = __webpack_require__(51);

var _getDisplayType2 = _interopRequireDefault(_getDisplayType);

var _displayTypes = __webpack_require__(20);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPassingRange = function getPassingRange(passingNumber) {
	if (passingNumber === '100') return '100%';
	return (0, _getDisplayFriendlyScore2.default)(passingNumber) + '% or higher';
};

var getTextItems = function getTextItems(_ref, _ref2) {
	var rubricType = _ref.rubricType,
	    mods = _ref.mods,
	    status = _ref.status,
	    statusResult = _ref.statusResult,
	    passingAttemptScore = _ref.passingAttemptScore,
	    isAttemptScore100 = _ref.isAttemptScore100,
	    isAssessScoreOver100 = _ref.isAssessScoreOver100;
	var attemptNum = _ref2.attemptNum,
	    attemptScore = _ref2.attemptScore,
	    assessScore = _ref2.assessScore,
	    totalNumberOfAttemptsAllowed = _ref2.totalNumberOfAttemptsAllowed;

	var items = [];

	switch ((0, _getDisplayType2.default)({
		rubricType: rubricType,
		mods: mods,
		status: status,
		statusResult: statusResult,
		isAttemptScore100: isAttemptScore100
	})) {
		case _displayTypes.TYPE_ATTEMPT_WITHOUT_MODS_REWARDED:
		case _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITHOUT_MODS_REWARDED:
		case _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_NO_MODS_REWARDED:
		case _displayTypes.ERROR_UNKNOWN_DISPLAY_TYPE:
			// Shouldn't get here but we still want to show their score
			items.push({
				type: 'total',
				text: 'Score',
				value: assessScore
			});
			break;

		case _displayTypes.TYPE_ATTEMPT_WITH_MODS_REWARDED:
		case _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITH_MODS_REWARDED:
			items.push({
				type: 'value',
				text: 'Attempt Score',
				value: attemptScore
			});
			break;

		case _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_LESS_THAN_100:
			items.push({
				type: 'value',
				text: 'Attempt Score (Passed)',
				value: attemptScore
			}, {
				type: 'divider'
			}, {
				type: 'value',
				text: 'Score adjusted for passing',
				value: (0, _getDisplayFriendlyScore2.default)(statusResult)
			});
			break;

		case _displayTypes.TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_MODS_REWARDED:
			items.push({
				type: 'value',
				text: 'Attempt Score (Passed)',
				value: attemptScore
			});
			break;

		case _displayTypes.TYPE_PASSFAIL_FAILED_GIVEN_ATTEMPT_SCORE:
		case _displayTypes.TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE:
			items.push({
				type: 'value',
				text: 'Attempt Score',
				value: attemptScore
			}, {
				type: 'divider'
			}, {
				type: 'text',
				text: 'You need ' + getPassingRange(passingAttemptScore) + ' to pass'
			});
			break;

		case _displayTypes.TYPE_PASSFAIL_FAILED_GIVEN_SCORE:
			items.push({
				type: 'value',
				text: 'Attempt Score',
				value: attemptScore
			}, {
				type: 'divider'
			}, {
				type: 'value',
				text: 'Score adjusted for not passing (less than ' + (0, _getDisplayFriendlyScore2.default)(passingAttemptScore) + '%)',
				value: (0, _getDisplayFriendlyScore2.default)(statusResult)
			});
			break;

		case _displayTypes.TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE:
			items.push({
				type: 'value',
				text: 'Attempt Score',
				value: attemptScore
			}, {
				type: 'divider'
			}, {
				type: 'text',
				text: 'You needed ' + getPassingRange(passingAttemptScore) + ' to pass'
			});
			break;

		case _displayTypes.TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE:
			items.push({
				type: 'value',
				text: 'Attempt Score',
				value: attemptScore
			}, {
				type: 'divider'
			}, {
				type: 'text',
				text: 'You did not achieve a passing ' + getPassingRange(passingAttemptScore) + ' score within the number of attempts available. Your highest attempt score will be used instead.'
			}, {
				type: 'divider'
			}, {
				type: 'value',
				text: 'Highest attempt score (Attempt\xA0' + attemptNum + ')',
				value: assessScore
			});
			break;

		case _displayTypes.TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE:
			items.push({
				type: 'value',
				text: 'Attempt Score',
				value: attemptScore
			}, {
				type: 'divider'
			}, {
				type: 'text',
				text: 'You did not achieve a passing ' + getPassingRange(passingAttemptScore) + ' score within the number of attempts available.'
			}, {
				type: 'value',
				text: 'Score for not achieving a passing attempt',
				value: (0, _getDisplayFriendlyScore2.default)(statusResult)
			});
			break;
	}

	items = items.concat((0, _getTextItemsForMods2.default)(mods, totalNumberOfAttemptsAllowed));

	if (items.length > 1) {
		items.push({
			type: 'divider'
		}, {
			type: 'total',
			text: 'Total Score' + (isAssessScoreOver100 ? ' (Max 100%)' : ''),
			// value: assessScore === null ? 'Did Not Pass' : assessScore
			value: assessScore
		});
	}

	return items;
};

exports.default = getTextItems;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(64);

var _navUtil = __webpack_require__(2);

var _navUtil2 = _interopRequireDefault(_navUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InlineNavButton = function (_React$Component) {
	_inherits(InlineNavButton, _React$Component);

	function InlineNavButton() {
		_classCallCheck(this, InlineNavButton);

		return _possibleConstructorReturn(this, (InlineNavButton.__proto__ || Object.getPrototypeOf(InlineNavButton)).apply(this, arguments));
	}

	_createClass(InlineNavButton, [{
		key: 'onClick',
		value: function onClick() {
			if (this.props.disabled) {
				return;
			}

			switch (this.props.type) {
				case 'prev':
					return _navUtil2.default.goPrev();

				case 'next':
					return _navUtil2.default.goNext();
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{
					className: 'viewer--components--inline-nav-button is-' + this.props.type + (this.props.disabled ? ' is-not-enabled' : ' is-enabled'),
					onClick: this.onClick.bind(this)
				},
				this.props.title
			);
		}
	}]);

	return InlineNavButton;
}(React.Component);

exports.default = InlineNavButton;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(66);

var _navUtil = __webpack_require__(2);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _logo = __webpack_require__(21);

var _logo2 = _interopRequireDefault(_logo);

var _isornot = __webpack_require__(17);

var _isornot2 = _interopRequireDefault(_isornot);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OboModel = _Common2.default.models.OboModel;
var StyleableText = _Common2.default.text.StyleableText;
var StyleableTextComponent = _Common2.default.text.StyleableTextComponent;

var Nav = function (_React$Component) {
	_inherits(Nav, _React$Component);

	function Nav() {
		_classCallCheck(this, Nav);

		return _possibleConstructorReturn(this, (Nav.__proto__ || Object.getPrototypeOf(Nav)).apply(this, arguments));
	}

	_createClass(Nav, [{
		key: 'onClick',
		value: function onClick(item) {
			switch (item.type) {
				case 'link':
					if (!_navUtil2.default.canNavigate(this.props.navState)) return;
					_navUtil2.default.gotoPath(item.fullPath);
					break;

				case 'sub-link':
					var el = OboModel.models[item.id].getDomEl();
					el.scrollIntoView({ behavior: 'smooth', block: 'start' });
					break;
			}
		}
	}, {
		key: 'renderLabel',
		value: function renderLabel(label) {
			if (label instanceof StyleableText) {
				return React.createElement(StyleableTextComponent, { text: label });
			}

			return React.createElement(
				'a',
				null,
				label
			);
		}
	}, {
		key: 'renderLink',
		value: function renderLink(index, isSelected, list, lockEl) {
			var item = list[index];
			var isFirstInList = !list[index - 1];
			var isLastInList = !list[index + 1];

			var className = 'link' + (0, _isornot2.default)(isSelected, 'selected') + (0, _isornot2.default)(item.flags.visited, 'visited') + (0, _isornot2.default)(item.flags.complete, 'complete') + (0, _isornot2.default)(item.flags.correct, 'correct') + (0, _isornot2.default)(item.flags.assessment, 'assessment') + (0, _isornot2.default)(isFirstInList, 'first-in-list') + (0, _isornot2.default)(isLastInList, 'last-in-list');

			return React.createElement(
				'li',
				{ key: index, onClick: this.onClick.bind(this, item), className: className },
				this.renderLabel(item.label),
				lockEl
			);
		}
	}, {
		key: 'renderSubLink',
		value: function renderSubLink(index, isSelected, list, lockEl) {
			var item = list[index];
			var isLastInList = !list[index + 1];

			var className = 'sub-link' + (0, _isornot2.default)(isSelected, 'selected') + (0, _isornot2.default)(item.flags.correct, 'correct') + (0, _isornot2.default)(isLastInList, 'last-in-list');

			return React.createElement(
				'li',
				{ key: index, onClick: this.onClick.bind(this, item), className: className },
				this.renderLabel(item.label),
				lockEl
			);
		}
	}, {
		key: 'renderHeading',
		value: function renderHeading(index, item) {
			return React.createElement(
				'li',
				{ key: index, className: 'heading is-not-selected' },
				this.renderLabel(item.label)
			);
		}

		// renderSep(index) {
		// 	return (
		// 		<li key={index} className="seperator">
		// 			<hr />
		// 		</li>
		// 	)
		// }

	}, {
		key: 'getLockEl',
		value: function getLockEl(isLocked) {
			if (isLocked) {
				return React.createElement('div', { className: 'lock-icon' });
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var navState = this.props.navState;
			var lockEl = this.getLockEl(navState.locked);

			var list = _navUtil2.default.getOrderedList(navState);

			var className = 'viewer--components--nav' + (0, _isornot2.default)(navState.locked, 'locked') + (0, _isornot2.default)(navState.open, 'open') + (0, _isornot2.default)(!navState.disabled, 'enabled');

			return React.createElement(
				'div',
				{ className: className },
				React.createElement(
					'button',
					{ className: 'toggle-button', onClick: _navUtil2.default.toggle },
					'Toggle Navigation Menu'
				),
				React.createElement(
					'ul',
					null,
					list.map(function (item, index) {
						switch (item.type) {
							case 'heading':
								return _this2.renderHeading(index, item);

							case 'link':
								return _this2.renderLink(index, navState.navTargetId === item.id, list, lockEl);

							case 'sub-link':
								return _this2.renderSubLink(index, navState.navTargetIndex === index, list, lockEl);

							// case 'seperator':
							// 	return this.renderSep(index)
						}
					})
				),
				React.createElement(_logo2.default, null)
			);
		}
	}]);

	return Nav;
}(React.Component);

exports.default = Nav;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(68);

__webpack_require__(67);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _react = __webpack_require__(25);

var _react2 = _interopRequireDefault(_react);

var _reactIdleTimer = __webpack_require__(47);

var _reactIdleTimer2 = _interopRequireDefault(_reactIdleTimer);

var _inlineNavButton = __webpack_require__(59);

var _inlineNavButton2 = _interopRequireDefault(_inlineNavButton);

var _navUtil = __webpack_require__(2);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _apiUtil = __webpack_require__(4);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

var _logo = __webpack_require__(21);

var _logo2 = _interopRequireDefault(_logo);

var _questionStore = __webpack_require__(13);

var _questionStore2 = _interopRequireDefault(_questionStore);

var _assessmentStore = __webpack_require__(22);

var _assessmentStore2 = _interopRequireDefault(_assessmentStore);

var _navStore = __webpack_require__(12);

var _navStore2 = _interopRequireDefault(_navStore);

var _nav = __webpack_require__(60);

var _nav2 = _interopRequireDefault(_nav);

var _getLtiOutcomeServiceHostname = __webpack_require__(24);

var _getLtiOutcomeServiceHostname2 = _interopRequireDefault(_getLtiOutcomeServiceHostname);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IDLE_TIMEOUT_DURATION_MS = 600000; // 10 minutes

var Legacy = _Common2.default.models.Legacy;
var DOMUtil = _Common2.default.page.DOMUtil;
var Screen = _Common2.default.page.Screen;
var OboModel = _Common2.default.models.OboModel;
var Dispatcher = _Common2.default.flux.Dispatcher;
var ModalContainer = _Common2.default.components.ModalContainer;
var SimpleDialog = _Common2.default.components.modal.SimpleDialog;
var ModalUtil = _Common2.default.util.ModalUtil;
var FocusBlocker = _Common2.default.components.FocusBlocker;
var ModalStore = _Common2.default.stores.ModalStore;
var FocusStore = _Common2.default.stores.FocusStore;
var FocusUtil = _Common2.default.util.FocusUtil;

// Dispatcher.on 'all', (eventName, payload) -> console.log 'EVENT TRIGGERED', eventName

Dispatcher.on('viewer:alert', function (payload) {
	return ModalUtil.show(_react2.default.createElement(
		SimpleDialog,
		{ ok: true, title: payload.value.title },
		payload.value.message
	));
});

var ViewerApp = function (_React$Component) {
	_inherits(ViewerApp, _React$Component);

	// === REACT LIFECYCLE METHODS ===

	function ViewerApp(props) {
		_classCallCheck(this, ViewerApp);

		var _this = _possibleConstructorReturn(this, (ViewerApp.__proto__ || Object.getPrototypeOf(ViewerApp)).call(this, props));

		Dispatcher.on('viewer:scrollTo', function (payload) {
			return ReactDOM.findDOMNode(_this.refs.container).scrollTop = payload.value;
		});

		Dispatcher.on('viewer:scrollToTop', _this.scrollToTop.bind(_this));
		Dispatcher.on('getTextForVariable', _this.getTextForVariable.bind(_this));

		var state = {
			model: null,
			navState: null,
			questionState: null,
			assessmentState: null,
			modalState: null,
			focusState: null,
			navTargetId: null,
			loading: true,
			requestStatus: 'unknown',
			isPreviewing: false,
			lti: {
				outcomeServiceHostname: null
			}
		};
		_this.onNavStoreChange = function () {
			return _this.setState({ navState: _navStore2.default.getState() });
		};
		_this.onQuestionStoreChange = function () {
			return _this.setState({ questionState: _questionStore2.default.getState() });
		};
		_this.onAssessmentStoreChange = function () {
			return _this.setState({ assessmentState: _assessmentStore2.default.getState() });
		};
		_this.onModalStoreChange = function () {
			return _this.setState({ modalState: ModalStore.getState() });
		};
		_this.onFocusStoreChange = function () {
			return _this.setState({ focusState: FocusStore.getState() });
		};

		_this.onIdle = _this.onIdle.bind(_this);
		_this.onReturnFromIdle = _this.onReturnFromIdle.bind(_this);
		_this.onBeforeWindowClose = _this.onBeforeWindowClose.bind(_this);
		_this.onWindowClose = _this.onWindowClose.bind(_this);
		_this.onVisibilityChange = _this.onVisibilityChange.bind(_this);

		_this.state = state;
		return _this;
	}

	_createClass(ViewerApp, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			document.addEventListener('visibilitychange', this.onVisibilityChange);

			var visitIdFromApi = void 0;
			var attemptHistory = void 0;
			var viewState = void 0;
			var isPreviewing = void 0;
			var outcomeServiceURL = 'the external system';

			var urlTokens = document.location.pathname.split('/');
			var visitIdFromUrl = urlTokens[4] ? urlTokens[4] : null;
			var draftIdFromUrl = urlTokens[2] ? urlTokens[2] : null;

			Dispatcher.trigger('viewer:loading');

			_apiUtil2.default.requestStart(visitIdFromUrl, draftIdFromUrl).then(function (visit) {
				_questionStore2.default.init();
				ModalStore.init();
				FocusStore.init();

				if (visit.status !== 'ok') throw 'Invalid Visit Id';

				visitIdFromApi = visit.value.visitId;
				viewState = visit.value.viewState;
				attemptHistory = visit.value.extensions[':ObojoboDraft.Sections.Assessment:attemptHistory'];
				isPreviewing = visit.value.isPreviewing;
				outcomeServiceURL = visit.value.lti.lisOutcomeServiceUrl;

				return _apiUtil2.default.getDraft(draftIdFromUrl);
			}).then(function (_ref) {
				var draftModel = _ref.value;

				_this2.state.model = OboModel.create(draftModel);

				_navStore2.default.init(_this2.state.model, _this2.state.model.modelState.start, window.location.pathname, visitIdFromApi, viewState);
				_assessmentStore2.default.init(attemptHistory);

				_this2.state.navState = _navStore2.default.getState();
				_this2.state.questionState = _questionStore2.default.getState();
				_this2.state.assessmentState = _assessmentStore2.default.getState();
				_this2.state.modalState = ModalStore.getState();
				_this2.state.focusState = FocusStore.getState();
				_this2.state.lti.outcomeServiceHostname = (0, _getLtiOutcomeServiceHostname2.default)(outcomeServiceURL);

				window.onbeforeunload = _this2.onBeforeWindowClose;
				window.onunload = _this2.onWindowClose;

				_this2.setState({ loading: false, requestStatus: 'ok', isPreviewing: isPreviewing }, function () {
					Dispatcher.trigger('viewer:loaded', true);
				});
			}).catch(function (err) {
				console.log(err);
				_this2.setState({ loading: false, requestStatus: 'invalid' }, function () {
					return Dispatcher.trigger('viewer:loaded', false);
				});
			});
		}
	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			// === SET UP DATA STORES ===
			_navStore2.default.onChange(this.onNavStoreChange);
			_questionStore2.default.onChange(this.onQuestionStoreChange);
			_assessmentStore2.default.onChange(this.onAssessmentStoreChange);
			ModalStore.onChange(this.onModalStoreChange);
			FocusStore.onChange(this.onFocusStoreChange);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_navStore2.default.offChange(this.onNavStoreChange);
			_questionStore2.default.offChange(this.onQuestionStoreChange);
			_assessmentStore2.default.offChange(this.onAssessmentStoreChange);
			ModalStore.offChange(this.onModalStoreChange);
			FocusStore.offChange(this.onFocusStoreChange);

			document.removeEventListener('visibilitychange', this.onVisibilityChange);
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			return !nextState.loading;
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate(nextProps, nextState) {
			if (this.state.requestStatus === 'ok') {
				var navTargetId = this.state.navTargetId;
				var nextNavTargetId = this.state.navState.navTargetId;

				if (navTargetId !== nextNavTargetId) {
					this.needsScroll = true;
					return this.setState({ navTargetId: nextNavTargetId });
				}
			}

			if (this.state.loading === true && nextState.loading === false) {
				this.needsRemoveLoadingElement = true;
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			if (this.state.requestStatus === 'ok') {
				if (this.lastCanNavigate !== _navUtil2.default.canNavigate(this.state.navState)) {
					this.needsScroll = true;
				}
				this.lastCanNavigate = _navUtil2.default.canNavigate(this.state.navState);
				if (this.needsScroll != null) {
					this.scrollToTop();

					delete this.needsScroll;
				}
			}

			if (this.needsRemoveLoadingElement === true) {
				var loadingEl = document.getElementById('viewer-app-loading');
				if (loadingEl && loadingEl.parentElement) {
					document.getElementById('viewer-app').classList.add('is-loaded');
					loadingEl.parentElement.removeChild(loadingEl);

					delete this.needsRemoveLoadingElement;
				}
			}
		}
	}, {
		key: 'onVisibilityChange',
		value: function onVisibilityChange() {
			var _this3 = this;

			if (document.hidden) {
				_apiUtil2.default.postEvent(this.state.model, 'viewer:leave', '1.0.0', {}).then(function (res) {
					_this3.leaveEvent = res.value;
				});
			} else {
				_apiUtil2.default.postEvent(this.state.model, 'viewer:return', '1.0.0', {
					relatedEventId: this.leaveEvent.id
				});
				delete this.leaveEvent;
			}
		}
	}, {
		key: 'getTextForVariable',
		value: function getTextForVariable(event, variable, textModel) {
			return event.text = _Common2.default.Store.getTextForVariable(variable, textModel, this.state);
		}
	}, {
		key: 'scrollToTop',
		value: function scrollToTop() {
			var el = ReactDOM.findDOMNode(this.refs.prev);
			var container = ReactDOM.findDOMNode(this.refs.container);

			if (!container) return;

			if (el) {
				return container.scrollTop = ReactDOM.findDOMNode(el).getBoundingClientRect().height;
			}

			return container.scrollTop = 0;
		}

		// === NON REACT LIFECYCLE METHODS ===

	}, {
		key: 'onMouseDown',
		value: function onMouseDown(event) {
			if (this.state.focusState.focussedId == null) {
				return;
			}
			if (!DOMUtil.findParentComponentIds(event.target).has(this.state.focusState.focussedId)) {
				return FocusUtil.unfocus();
			}
		}
	}, {
		key: 'onScroll',
		value: function onScroll(event) {
			if (this.state.focusState.focussedId == null) {
				return;
			}

			var component = FocusUtil.getFocussedComponent(this.state.focusState);
			if (component == null) {
				return;
			}

			var el = component.getDomEl();
			if (!el) {
				return;
			}

			if (!Screen.isElementVisible(el)) {
				return FocusUtil.unfocus();
			}
		}
	}, {
		key: 'onIdle',
		value: function onIdle() {
			var _this4 = this;

			this.lastActiveEpoch = new Date(this.refs.idleTimer.getLastActiveTime());

			_apiUtil2.default.postEvent(this.state.model, 'viewer:inactive', '2.0.0', {
				lastActiveTime: this.lastActiveEpoch,
				inactiveDuration: IDLE_TIMEOUT_DURATION_MS
			}).then(function (res) {
				_this4.inactiveEvent = res.value;
			});
		}
	}, {
		key: 'onReturnFromIdle',
		value: function onReturnFromIdle() {
			_apiUtil2.default.postEvent(this.state.model, 'viewer:returnFromInactive', '2.0.0', {
				lastActiveTime: this.lastActiveEpoch,
				inactiveDuration: Date.now() - this.lastActiveEpoch,
				relatedEventId: this.inactiveEvent.id
			});

			delete this.lastActiveEpoch;
			delete this.inactiveEvent;
		}
	}, {
		key: 'onBeforeWindowClose',
		value: function onBeforeWindowClose() {
			var closePrevented = false;
			// calling this function will prevent the window from closing
			var preventClose = function preventClose() {
				closePrevented = true;
			};

			Dispatcher.trigger('viewer:closeAttempted', preventClose);

			if (closePrevented) {
				return true; // Returning true will cause browser to ask user to confirm leaving page
			}

			return undefined; // Returning undefined will allow browser to close normally
		}
	}, {
		key: 'onWindowClose',
		value: function onWindowClose() {
			_apiUtil2.default.postEvent(this.state.model, 'viewer:close', '1.0.0', {});
		}
	}, {
		key: 'clearPreviewScores',
		value: function clearPreviewScores() {
			_apiUtil2.default.clearPreviewScores(this.state.model.get('draftId')).then(function (res) {
				if (res.status === 'error' || res.error) {
					return ModalUtil.show(_react2.default.createElement(
						SimpleDialog,
						{ ok: true, width: '15em' },
						res.value && res.value.message ? 'There was an error resetting assessments and questions: ' + res.value.message + '.' : 'There was an error resetting assessments and questions'
					));
				}

				_assessmentStore2.default.init();
				_questionStore2.default.init();

				_assessmentStore2.default.triggerChange();
				_questionStore2.default.triggerChange();

				return ModalUtil.show(_react2.default.createElement(
					SimpleDialog,
					{ ok: true, width: '15em' },
					'Assessment attempts and all question responses have been reset.'
				));
			});
		}
	}, {
		key: 'unlockNavigation',
		value: function unlockNavigation() {
			return _navUtil2.default.unlock();
		}
	}, {
		key: 'render',
		value: function render() {
			if (this.state.loading == true) return null;

			if (this.state.requestStatus === 'invalid') {
				return _react2.default.createElement(
					'div',
					{ className: 'viewer--viewer-app--visit-error' },
					'There was a problem starting your visit. Please return to ' + (this.state.lti.outcomeServiceHostname ? this.state.lti.outcomeServiceHostname : 'the external system') + ' and relaunch this module.'
				); //`There was a problem starting your visit. Please return to ${outcomeServiceURL} and relaunch this module.`
			}

			var nextEl = void 0,
			    nextModel = void 0,
			    prevEl = void 0;
			window.__lo = this.state.model;
			window.__s = this.state;

			var ModuleComponent = this.state.model.getComponentClass();

			var navTargetModel = _navUtil2.default.getNavTargetModel(this.state.navState);
			var navTargetTitle = '?';
			if (navTargetModel != null) {
				navTargetTitle = navTargetModel.title;
			}

			var prevModel = nextModel = null;
			if (_navUtil2.default.canNavigate(this.state.navState)) {
				prevModel = _navUtil2.default.getPrevModel(this.state.navState);
				if (prevModel) {
					var navText = typeof prevModel.title !== 'undefined' && prevModel.title !== null ? 'Back: ' + prevModel.title : 'Back';
					prevEl = _react2.default.createElement(_inlineNavButton2.default, { ref: 'prev', type: 'prev', title: '' + navText });
				} else {
					prevEl = _react2.default.createElement(_inlineNavButton2.default, {
						ref: 'prev',
						type: 'prev',
						title: 'Start of ' + this.state.model.title,
						disabled: true
					});
				}

				nextModel = _navUtil2.default.getNextModel(this.state.navState);
				if (nextModel) {
					var _navText = typeof nextModel.title !== 'undefined' && nextModel.title !== null ? 'Next: ' + nextModel.title : 'Next';
					nextEl = _react2.default.createElement(_inlineNavButton2.default, { ref: 'next', type: 'next', title: '' + _navText });
				} else {
					nextEl = _react2.default.createElement(_inlineNavButton2.default, {
						ref: 'next',
						type: 'next',
						title: 'End of ' + this.state.model.title,
						disabled: true
					});
				}
			}

			var modalItem = ModalUtil.getCurrentModal(this.state.modalState);
			var hideViewer = modalItem && modalItem.hideViewer;

			var classNames = ['viewer--viewer-app', 'is-loaded', this.state.isPreviewing ? 'is-previewing' : 'is-not-previewing', this.state.navState.locked ? 'is-locked-nav' : 'is-unlocked-nav', this.state.navState.open ? 'is-open-nav' : 'is-closed-nav', this.state.navState.disabled ? 'is-disabled-nav' : 'is-enabled-nav', 'is-focus-state-' + this.state.focusState.viewState].join(' ');

			return _react2.default.createElement(
				_reactIdleTimer2.default,
				{
					ref: 'idleTimer',
					element: window,
					timeout: IDLE_TIMEOUT_DURATION_MS,
					idleAction: this.onIdle,
					activeAction: this.onReturnFromIdle
				},
				_react2.default.createElement(
					'div',
					{
						ref: 'container',
						onMouseDown: this.onMouseDown.bind(this),
						onScroll: this.onScroll.bind(this),
						className: classNames
					},
					hideViewer ? null : _react2.default.createElement(
						'header',
						null,
						_react2.default.createElement(
							'div',
							{ className: 'pad' },
							_react2.default.createElement(
								'span',
								{ className: 'module-title' },
								this.state.model.title
							),
							_react2.default.createElement(
								'span',
								{ className: 'location' },
								navTargetTitle
							),
							_react2.default.createElement(_logo2.default, null)
						)
					),
					hideViewer ? null : _react2.default.createElement(_nav2.default, { navState: this.state.navState }),
					hideViewer ? null : prevEl,
					hideViewer ? null : _react2.default.createElement(ModuleComponent, { model: this.state.model, moduleData: this.state }),
					hideViewer ? null : nextEl,
					this.state.isPreviewing ? _react2.default.createElement(
						'div',
						{ className: 'preview-banner' },
						_react2.default.createElement(
							'span',
							null,
							'You are previewing this module'
						),
						_react2.default.createElement(
							'div',
							{ className: 'controls' },
							_react2.default.createElement(
								'span',
								null,
								'Preview options:'
							),
							_react2.default.createElement(
								'button',
								{
									onClick: this.unlockNavigation.bind(this),
									disabled: !this.state.navState.locked
								},
								'Unlock navigation'
							),
							_react2.default.createElement(
								'button',
								{
									className: 'button-clear-scores',
									onClick: this.clearPreviewScores.bind(this)
								},
								'Reset assessments & questions'
							)
						),
						_react2.default.createElement('div', { className: 'border' })
					) : null,
					_react2.default.createElement(FocusBlocker, { moduleData: this.state }),
					modalItem && modalItem.component ? _react2.default.createElement(
						ModalContainer,
						null,
						modalItem.component
					) : null
				)
			);
		}
	}]);

	return ViewerApp;
}(_react2.default.Component);

exports.default = ViewerApp;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _viewerApp = __webpack_require__(61);

var _viewerApp2 = _interopRequireDefault(_viewerApp);

var _assessmentStore = __webpack_require__(22);

var _assessmentStore2 = _interopRequireDefault(_assessmentStore);

var _ltiNetworkStates = __webpack_require__(23);

var _ltiNetworkStates2 = _interopRequireDefault(_ltiNetworkStates);

var _navStore = __webpack_require__(12);

var _navStore2 = _interopRequireDefault(_navStore);

var _questionStore = __webpack_require__(13);

var _questionStore2 = _interopRequireDefault(_questionStore);

var _assessmentUtil = __webpack_require__(6);

var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil);

var _navUtil = __webpack_require__(2);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _apiUtil = __webpack_require__(4);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

var _questionUtil = __webpack_require__(7);

var _questionUtil2 = _interopRequireDefault(_questionUtil);

var _getLtiOutcomeServiceHostname = __webpack_require__(24);

var _getLtiOutcomeServiceHostname2 = _interopRequireDefault(_getLtiOutcomeServiceHostname);

var _assessmentScoreReporter = __webpack_require__(19);

var _assessmentScoreReporter2 = _interopRequireDefault(_assessmentScoreReporter);

var _assessmentScoreReportView = __webpack_require__(18);

var _assessmentScoreReportView2 = _interopRequireDefault(_assessmentScoreReportView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {
		ViewerApp: _viewerApp2.default
	},

	stores: {
		AssessmentStore: _assessmentStore2.default,
		assessmentStore: {
			LTINetworkStates: _ltiNetworkStates2.default
		},
		NavStore: _navStore2.default,
		QuestionStore: _questionStore2.default
	},

	util: {
		AssessmentUtil: _assessmentUtil2.default,
		NavUtil: _navUtil2.default,
		APIUtil: _apiUtil2.default,
		QuestionUtil: _questionUtil2.default,
		getLTIOutcomeServiceHostname: _getLtiOutcomeServiceHostname2.default
	},

	assessment: {
		AssessmentScoreReporter: _assessmentScoreReporter2.default,
		AssessmentScoreReportView: _assessmentScoreReportView2.default
	}
};

/***/ }),
/* 63 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 64 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 65 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 66 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 67 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 68 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26);
module.exports = __webpack_require__(27);


/***/ })
/******/ ]);