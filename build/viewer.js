/******/ ;(function(modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/ var installedModules = {} // The require function
	/******/
	/******/ /******/ function __webpack_require__(moduleId) {
		/******/
		/******/ // Check if module is in cache
		/******/ if (installedModules[moduleId]) {
			/******/ return installedModules[moduleId].exports
			/******/
		} // Create a new module (and put it into the cache)
		/******/ /******/ var module = (installedModules[moduleId] = {
			/******/ i: moduleId,
			/******/ l: false,
			/******/ exports: {}
			/******/
		}) // Execute the module function
		/******/
		/******/ /******/ modules[moduleId].call(
			module.exports,
			module,
			module.exports,
			__webpack_require__
		) // Flag the module as loaded
		/******/
		/******/ /******/ module.l = true // Return the exports of the module
		/******/
		/******/ /******/ return module.exports
		/******/
	} // expose the modules object (__webpack_modules__)
	/******/
	/******/
	/******/ /******/ __webpack_require__.m = modules // expose the module cache
	/******/
	/******/ /******/ __webpack_require__.c = installedModules // identity function for calling harmony imports with the correct context
	/******/
	/******/ /******/ __webpack_require__.i = function(value) {
		return value
	} // define getter function for harmony exports
	/******/
	/******/ /******/ __webpack_require__.d = function(exports, name, getter) {
		/******/ if (!__webpack_require__.o(exports, name)) {
			/******/ Object.defineProperty(exports, name, {
				/******/ configurable: false,
				/******/ enumerable: true,
				/******/ get: getter
				/******/
			})
			/******/
		}
		/******/
	} // getDefaultExport function for compatibility with non-harmony modules
	/******/
	/******/ /******/ __webpack_require__.n = function(module) {
		/******/ var getter =
			module && module.__esModule
				? /******/ function getDefault() {
						return module['default']
					}
				: /******/ function getModuleExports() {
						return module
					}
		/******/ __webpack_require__.d(getter, 'a', getter)
		/******/ return getter
		/******/
	} // Object.prototype.hasOwnProperty.call
	/******/
	/******/ /******/ __webpack_require__.o = function(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property)
	} // __webpack_public_path__
	/******/
	/******/ /******/ __webpack_require__.p = 'build/' // Load entry module and return exports
	/******/
	/******/ /******/ return __webpack_require__((__webpack_require__.s = 54))
	/******/
})(
	/************************************************************************/
	/******/ [
		/* 0 */
		/***/ function(module, exports) {
			module.exports = Common

			/***/
		},
		/* 1 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var isDate = __webpack_require__(13)

			var MILLISECONDS_IN_HOUR = 3600000
			var MILLISECONDS_IN_MINUTE = 60000
			var DEFAULT_ADDITIONAL_DIGITS = 2

			var parseTokenDateTimeDelimeter = /[T ]/
			var parseTokenPlainTime = /:/

			// year tokens
			var parseTokenYY = /^(\d{2})$/
			var parseTokensYYY = [
				/^([+-]\d{2})$/, // 0 additional digits
				/^([+-]\d{3})$/, // 1 additional digit
				/^([+-]\d{4})$/ // 2 additional digits
			]

			var parseTokenYYYY = /^(\d{4})/
			var parseTokensYYYYY = [
				/^([+-]\d{4})/, // 0 additional digits
				/^([+-]\d{5})/, // 1 additional digit
				/^([+-]\d{6})/ // 2 additional digits
			]

			// date tokens
			var parseTokenMM = /^-(\d{2})$/
			var parseTokenDDD = /^-?(\d{3})$/
			var parseTokenMMDD = /^-?(\d{2})-?(\d{2})$/
			var parseTokenWww = /^-?W(\d{2})$/
			var parseTokenWwwD = /^-?W(\d{2})-?(\d{1})$/

			// time tokens
			var parseTokenHH = /^(\d{2}([.,]\d*)?)$/
			var parseTokenHHMM = /^(\d{2}):?(\d{2}([.,]\d*)?)$/
			var parseTokenHHMMSS = /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/

			// timezone tokens
			var parseTokenTimezone = /([Z+-].*)$/
			var parseTokenTimezoneZ = /^(Z)$/
			var parseTokenTimezoneHH = /^([+-])(\d{2})$/
			var parseTokenTimezoneHHMM = /^([+-])(\d{2}):?(\d{2})$/

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
					return new Date(argument.getTime())
				} else if (typeof argument !== 'string') {
					return new Date(argument)
				}

				var options = dirtyOptions || {}
				var additionalDigits = options.additionalDigits
				if (additionalDigits == null) {
					additionalDigits = DEFAULT_ADDITIONAL_DIGITS
				} else {
					additionalDigits = Number(additionalDigits)
				}

				var dateStrings = splitDateString(argument)

				var parseYearResult = parseYear(dateStrings.date, additionalDigits)
				var year = parseYearResult.year
				var restDateString = parseYearResult.restDateString

				var date = parseDate(restDateString, year)

				if (date) {
					var timestamp = date.getTime()
					var time = 0
					var offset

					if (dateStrings.time) {
						time = parseTime(dateStrings.time)
					}

					if (dateStrings.timezone) {
						offset = parseTimezone(dateStrings.timezone)
					} else {
						// get offset accurate to hour in timezones that change offset
						offset = new Date(timestamp + time).getTimezoneOffset()
						offset = new Date(
							timestamp + time + offset * MILLISECONDS_IN_MINUTE
						).getTimezoneOffset()
					}

					return new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE)
				} else {
					return new Date(argument)
				}
			}

			function splitDateString(dateString) {
				var dateStrings = {}
				var array = dateString.split(parseTokenDateTimeDelimeter)
				var timeString

				if (parseTokenPlainTime.test(array[0])) {
					dateStrings.date = null
					timeString = array[0]
				} else {
					dateStrings.date = array[0]
					timeString = array[1]
				}

				if (timeString) {
					var token = parseTokenTimezone.exec(timeString)
					if (token) {
						dateStrings.time = timeString.replace(token[1], '')
						dateStrings.timezone = token[1]
					} else {
						dateStrings.time = timeString
					}
				}

				return dateStrings
			}

			function parseYear(dateString, additionalDigits) {
				var parseTokenYYY = parseTokensYYY[additionalDigits]
				var parseTokenYYYYY = parseTokensYYYYY[additionalDigits]

				var token

				// YYYY or ±YYYYY
				token = parseTokenYYYY.exec(dateString) || parseTokenYYYYY.exec(dateString)
				if (token) {
					var yearString = token[1]
					return {
						year: parseInt(yearString, 10),
						restDateString: dateString.slice(yearString.length)
					}
				}

				// YY or ±YYY
				token = parseTokenYY.exec(dateString) || parseTokenYYY.exec(dateString)
				if (token) {
					var centuryString = token[1]
					return {
						year: parseInt(centuryString, 10) * 100,
						restDateString: dateString.slice(centuryString.length)
					}
				}

				// Invalid ISO-formatted year
				return {
					year: null
				}
			}

			function parseDate(dateString, year) {
				// Invalid ISO-formatted year
				if (year === null) {
					return null
				}

				var token
				var date
				var month
				var week

				// YYYY
				if (dateString.length === 0) {
					date = new Date(0)
					date.setUTCFullYear(year)
					return date
				}

				// YYYY-MM
				token = parseTokenMM.exec(dateString)
				if (token) {
					date = new Date(0)
					month = parseInt(token[1], 10) - 1
					date.setUTCFullYear(year, month)
					return date
				}

				// YYYY-DDD or YYYYDDD
				token = parseTokenDDD.exec(dateString)
				if (token) {
					date = new Date(0)
					var dayOfYear = parseInt(token[1], 10)
					date.setUTCFullYear(year, 0, dayOfYear)
					return date
				}

				// YYYY-MM-DD or YYYYMMDD
				token = parseTokenMMDD.exec(dateString)
				if (token) {
					date = new Date(0)
					month = parseInt(token[1], 10) - 1
					var day = parseInt(token[2], 10)
					date.setUTCFullYear(year, month, day)
					return date
				}

				// YYYY-Www or YYYYWww
				token = parseTokenWww.exec(dateString)
				if (token) {
					week = parseInt(token[1], 10) - 1
					return dayOfISOYear(year, week)
				}

				// YYYY-Www-D or YYYYWwwD
				token = parseTokenWwwD.exec(dateString)
				if (token) {
					week = parseInt(token[1], 10) - 1
					var dayOfWeek = parseInt(token[2], 10) - 1
					return dayOfISOYear(year, week, dayOfWeek)
				}

				// Invalid ISO-formatted date
				return null
			}

			function parseTime(timeString) {
				var token
				var hours
				var minutes

				// hh
				token = parseTokenHH.exec(timeString)
				if (token) {
					hours = parseFloat(token[1].replace(',', '.'))
					return hours % 24 * MILLISECONDS_IN_HOUR
				}

				// hh:mm or hhmm
				token = parseTokenHHMM.exec(timeString)
				if (token) {
					hours = parseInt(token[1], 10)
					minutes = parseFloat(token[2].replace(',', '.'))
					return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE
				}

				// hh:mm:ss or hhmmss
				token = parseTokenHHMMSS.exec(timeString)
				if (token) {
					hours = parseInt(token[1], 10)
					minutes = parseInt(token[2], 10)
					var seconds = parseFloat(token[3].replace(',', '.'))
					return (
						hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * 1000
					)
				}

				// Invalid ISO-formatted time
				return null
			}

			function parseTimezone(timezoneString) {
				var token
				var absoluteOffset

				// Z
				token = parseTokenTimezoneZ.exec(timezoneString)
				if (token) {
					return 0
				}

				// ±hh
				token = parseTokenTimezoneHH.exec(timezoneString)
				if (token) {
					absoluteOffset = parseInt(token[2], 10) * 60
					return token[1] === '+' ? -absoluteOffset : absoluteOffset
				}

				// ±hh:mm or ±hhmm
				token = parseTokenTimezoneHHMM.exec(timezoneString)
				if (token) {
					absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10)
					return token[1] === '+' ? -absoluteOffset : absoluteOffset
				}

				return 0
			}

			function dayOfISOYear(isoYear, week, day) {
				week = week || 0
				day = day || 0
				var date = new Date(0)
				date.setUTCFullYear(isoYear, 0, 4)
				var fourthOfJanuaryDay = date.getUTCDay() || 7
				var diff = week * 7 + day + 1 - fourthOfJanuaryDay
				date.setUTCDate(date.getUTCDate() + diff)
				return date
			}

			module.exports = parse

			/***/
		},
		/* 2 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var Dispatcher = _Common2.default.flux.Dispatcher
			var OboModel = _Common2.default.models.OboModel

			var getFlatList = function getFlatList(item) {
				var list = []
				if (item.type !== 'hidden') {
					list.push(item)
				}

				if (item.showChildren) {
					var _iteratorNormalCompletion = true
					var _didIteratorError = false
					var _iteratorError = undefined

					try {
						for (
							var _iterator = Array.from(item.children)[Symbol.iterator](), _step;
							!(_iteratorNormalCompletion = (_step = _iterator.next()).done);
							_iteratorNormalCompletion = true
						) {
							var child = _step.value

							list = list.concat(getFlatList(child))
						}
					} catch (err) {
						_didIteratorError = true
						_iteratorError = err
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return()
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError
							}
						}
					}
				}

				return list
			}

			var NavUtil = {
				rebuildMenu: function rebuildMenu(model) {
					return Dispatcher.trigger('nav:rebuildMenu', {
						value: {
							model: model
						}
					})
				},
				gotoPath: function gotoPath(path) {
					return Dispatcher.trigger('nav:gotoPath', {
						value: {
							path: path
						}
					})
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
					})
				},
				goPrev: function goPrev() {
					return Dispatcher.trigger('nav:prev')
				},
				goNext: function goNext() {
					return Dispatcher.trigger('nav:next')
				},
				goto: function goto(id) {
					return Dispatcher.trigger('nav:goto', {
						value: {
							id: id
						}
					})
				},
				lock: function lock() {
					return Dispatcher.trigger('nav:lock')
				},
				unlock: function unlock() {
					return Dispatcher.trigger('nav:unlock')
				},
				close: function close() {
					return Dispatcher.trigger('nav:close')
				},
				open: function open() {
					return Dispatcher.trigger('nav:open')
				},
				toggle: function toggle() {
					return Dispatcher.trigger('nav:toggle')
				},
				openExternalLink: function openExternalLink(url) {
					return Dispatcher.trigger('nav:openExternalLink', {
						value: {
							url: url
						}
					})
				},
				showChildren: function showChildren(id) {
					return Dispatcher.trigger('nav:showChildren', {
						value: {
							id: id
						}
					})
				},
				hideChildren: function hideChildren(id) {
					return Dispatcher.trigger('nav:hideChildren', {
						value: {
							id: id
						}
					})
				},

				// getNavItemForModel: (state, model) ->
				// 	state.itemsById[model.get('id')]

				getNavTarget: function getNavTarget(state) {
					return state.itemsById[state.navTargetId]
				},
				getNavTargetModel: function getNavTargetModel(state) {
					var navTarget = NavUtil.getNavTarget(state)
					if (!navTarget) {
						return null
					}

					return OboModel.models[navTarget.id]
				},
				getFirst: function getFirst(state) {
					var list = NavUtil.getOrderedList(state)

					var _iteratorNormalCompletion2 = true
					var _didIteratorError2 = false
					var _iteratorError2 = undefined

					try {
						for (
							var _iterator2 = Array.from(list)[Symbol.iterator](), _step2;
							!(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
							_iteratorNormalCompletion2 = true
						) {
							var item = _step2.value

							if (item.type === 'link') {
								return item
							}
						}
					} catch (err) {
						_didIteratorError2 = true
						_iteratorError2 = err
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return()
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2
							}
						}
					}

					return null
				},
				getPrev: function getPrev(state) {
					// state.items[NavUtil.getPrevIndex(state)]
					var list = NavUtil.getOrderedList(state)
					var navTarget = NavUtil.getNavTarget(state)
					var index = list.indexOf(navTarget)

					if (index === -1) {
						return null
					}

					index--
					while (index >= 0) {
						var item = list[index]
						if (item.type === 'link') {
							return item
						}

						index--
					}

					return null
				},
				getNext: function getNext(state) {
					// state.items[NavUtil.getPrevIndex(state)]
					var list = NavUtil.getOrderedList(state)
					var navTarget = NavUtil.getNavTarget(state)
					var index = list.indexOf(navTarget)

					if (index === -1) {
						return null
					}

					index++
					var len = list.length
					while (index < len) {
						var item = list[index]
						if (item.type === 'link') {
							return item
						}

						index++
					}

					return null
				},
				getPrevModel: function getPrevModel(state) {
					var prevItem = NavUtil.getPrev(state)
					if (!prevItem) {
						return null
					}

					return OboModel.models[prevItem.id]
				},
				getNextModel: function getNextModel(state) {
					var nextItem = NavUtil.getNext(state)
					if (!nextItem) {
						return null
					}

					return OboModel.models[nextItem.id]
				},
				canNavigate: function canNavigate(state) {
					return !state.locked
				},
				getOrderedList: function getOrderedList(state) {
					return getFlatList(state.items)
				}
			}

			exports.default = NavUtil

			/***/
		},
		/* 3 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})
			var createParsedJsonPromise = function createParsedJsonPromise(promise) {
				return new Promise(function(resolve, reject) {
					return promise
						.then(function(res) {
							return res.json()
						})
						.then(function(json) {
							if (json.status === 'error') console.log(json.value)
							return resolve(json)
						})
						.catch(function(error) {
							return reject(error)
						})
				})
			}

			var APIUtil = {
				get: function get(endpoint) {
					return fetch(endpoint, {
						method: 'GET',
						credentials: 'include',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						} //@TODO - Do I need this?
					})
				},
				post: function post(endpoint, body) {
					if (body == null) {
						body = {}
					}
					return fetch(endpoint, {
						method: 'POST',
						credentials: 'include',
						body: JSON.stringify(body),
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						}
					})
				},
				postEvent: function postEvent(lo, action, eventVersion, payload) {
					return createParsedJsonPromise(
						APIUtil.post('/api/events', {
							event: {
								action: action,
								draft_id: lo.get('draftId'),
								actor_time: new Date().toISOString(),
								event_version: eventVersion,
								payload: payload
							}
						})
						// TODO: Send Caliper event to client host.
					).then(function(res) {
						if (res && res.status === 'ok' && res.value) {
							parent.postMessage(res.value, '*')
						}

						return res
					})
				},
				saveState: function saveState(lo, state) {
					return APIUtil.postEvent(lo, 'saveState', state)
				},
				getDraft: function getDraft(id) {
					return createParsedJsonPromise(fetch('/api/drafts/' + id))
				},
				getAttempts: function getAttempts(lo) {
					return createParsedJsonPromise(
						APIUtil.get('/api/drafts/' + lo.get('draftId') + '/attempts')
					)
				},
				requestStart: function requestStart(visitId, draftId) {
					return createParsedJsonPromise(
						APIUtil.post('/api/visits/start', {
							visitId: visitId,
							draftId: draftId
						})
					)
				},
				startAttempt: function startAttempt(lo, assessment, questions) {
					return createParsedJsonPromise(
						APIUtil.post('/api/assessments/attempt/start', {
							draftId: lo.get('draftId'),
							assessmentId: assessment.get('id'),
							actor: 4,
							questions: '@TODO'
						})
					)
				},
				endAttempt: function endAttempt(attempt) {
					return createParsedJsonPromise(
						APIUtil.post('/api/assessments/attempt/' + attempt.attemptId + '/end')
					)
				}
			}

			// recordQuestionResponse: (attempt, question, response) ->
			// 	console.clear()
			// 	console.log arguments
			// 	createParsedJsonPromise APIUtil.post "/api/assessments/attempt/#{attempt.id}/question/#{question.get('id')}", {
			// 		response: response
			// 	}

			exports.default = APIUtil

			/***/
		},
		/* 4 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			// shim for using process in browser
			var process = (module.exports = {})

			// cached from whatever global is present so that test runners that stub it
			// don't break things.  But we need to wrap it in a try catch in case it is
			// wrapped in strict mode code which doesn't define any globals.  It's inside a
			// function because try/catches deoptimize in certain engines.

			var cachedSetTimeout
			var cachedClearTimeout

			function defaultSetTimout() {
				throw new Error('setTimeout has not been defined')
			}
			function defaultClearTimeout() {
				throw new Error('clearTimeout has not been defined')
			}
			;(function() {
				try {
					if (typeof setTimeout === 'function') {
						cachedSetTimeout = setTimeout
					} else {
						cachedSetTimeout = defaultSetTimout
					}
				} catch (e) {
					cachedSetTimeout = defaultSetTimout
				}
				try {
					if (typeof clearTimeout === 'function') {
						cachedClearTimeout = clearTimeout
					} else {
						cachedClearTimeout = defaultClearTimeout
					}
				} catch (e) {
					cachedClearTimeout = defaultClearTimeout
				}
			})()
			function runTimeout(fun) {
				if (cachedSetTimeout === setTimeout) {
					//normal enviroments in sane situations
					return setTimeout(fun, 0)
				}
				// if setTimeout wasn't available but was latter defined
				if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
					cachedSetTimeout = setTimeout
					return setTimeout(fun, 0)
				}
				try {
					// when when somebody has screwed with setTimeout but no I.E. maddness
					return cachedSetTimeout(fun, 0)
				} catch (e) {
					try {
						// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
						return cachedSetTimeout.call(null, fun, 0)
					} catch (e) {
						// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
						return cachedSetTimeout.call(this, fun, 0)
					}
				}
			}
			function runClearTimeout(marker) {
				if (cachedClearTimeout === clearTimeout) {
					//normal enviroments in sane situations
					return clearTimeout(marker)
				}
				// if clearTimeout wasn't available but was latter defined
				if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
					cachedClearTimeout = clearTimeout
					return clearTimeout(marker)
				}
				try {
					// when when somebody has screwed with setTimeout but no I.E. maddness
					return cachedClearTimeout(marker)
				} catch (e) {
					try {
						// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
						return cachedClearTimeout.call(null, marker)
					} catch (e) {
						// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
						// Some versions of I.E. have different rules for clearTimeout vs setTimeout
						return cachedClearTimeout.call(this, marker)
					}
				}
			}
			var queue = []
			var draining = false
			var currentQueue
			var queueIndex = -1

			function cleanUpNextTick() {
				if (!draining || !currentQueue) {
					return
				}
				draining = false
				if (currentQueue.length) {
					queue = currentQueue.concat(queue)
				} else {
					queueIndex = -1
				}
				if (queue.length) {
					drainQueue()
				}
			}

			function drainQueue() {
				if (draining) {
					return
				}
				var timeout = runTimeout(cleanUpNextTick)
				draining = true

				var len = queue.length
				while (len) {
					currentQueue = queue
					queue = []
					while (++queueIndex < len) {
						if (currentQueue) {
							currentQueue[queueIndex].run()
						}
					}
					queueIndex = -1
					len = queue.length
				}
				currentQueue = null
				draining = false
				runClearTimeout(timeout)
			}

			process.nextTick = function(fun) {
				var args = new Array(arguments.length - 1)
				if (arguments.length > 1) {
					for (var i = 1; i < arguments.length; i++) {
						args[i - 1] = arguments[i]
					}
				}
				queue.push(new Item(fun, args))
				if (queue.length === 1 && !draining) {
					runTimeout(drainQueue)
				}
			}

			// v8 likes predictible objects
			function Item(fun, array) {
				this.fun = fun
				this.array = array
			}
			Item.prototype.run = function() {
				this.fun.apply(null, this.array)
			}
			process.title = 'browser'
			process.browser = true
			process.env = {}
			process.argv = []
			process.version = '' // empty string to avoid regexp issues
			process.versions = {}

			function noop() {}

			process.on = noop
			process.addListener = noop
			process.once = noop
			process.off = noop
			process.removeListener = noop
			process.removeAllListeners = noop
			process.emit = noop
			process.prependListener = noop
			process.prependOnceListener = noop

			process.listeners = function(name) {
				return []
			}

			process.binding = function(name) {
				throw new Error('process.binding is not supported')
			}

			process.cwd = function() {
				return '/'
			}
			process.chdir = function(dir) {
				throw new Error('process.chdir is not supported')
			}
			process.umask = function() {
				return 0
			}

			/***/
		},
		/* 5 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var Dispatcher = _Common2.default.flux.Dispatcher
			var OboModel = _Common2.default.models.OboModel

			var QuestionUtil = {
				setResponse: function setResponse(id, response, targetId) {
					return Dispatcher.trigger('question:setResponse', {
						value: {
							id: id,
							response: response,
							targetId: targetId
						}
					})
				},
				clearResponse: function clearResponse(id) {
					return Dispatcher.trigger('question:clearResponse', {
						value: {
							id: id
						}
					})
				},
				setData: function setData(id, key, value) {
					return Dispatcher.trigger('question:setData', {
						value: {
							key: id + ':' + key,
							value: value
						}
					})
				},
				clearData: function clearData(id, key) {
					return Dispatcher.trigger('question:clearData', {
						value: {
							key: id + ':' + key
						}
					})
				},
				showExplanation: function showExplanation(id) {
					return Dispatcher.trigger('question:showExplanation', {
						value: { id: id }
					})
				},
				hideExplanation: function hideExplanation(id, asSystem) {
					return Dispatcher.trigger('question:hideExplanation', {
						value: { id: id }
					})
				},
				viewQuestion: function viewQuestion(id) {
					return Dispatcher.trigger('question:view', {
						value: {
							id: id
						}
					})
				},
				hideQuestion: function hideQuestion(id) {
					return Dispatcher.trigger('question:hide', {
						value: {
							id: id
						}
					})
				},
				checkAnswer: function checkAnswer(id) {
					return Dispatcher.trigger('question:checkAnswer', {
						value: {
							id: id
						}
					})
				},
				retryQuestion: function retryQuestion(id) {
					return Dispatcher.trigger('question:retry', {
						value: {
							id: id
						}
					})
				},
				getViewState: function getViewState(state, model) {
					var modelId = model.get('id')

					if (state.viewing === modelId) {
						return 'active'
					}
					if (state.viewedQuestions[modelId]) {
						return 'viewed'
					}
					return 'hidden'
				},
				getResponse: function getResponse(state, model) {
					return state.responses[model.get('id')] || null
				},
				getData: function getData(state, model, key) {
					return state.data[model.get('id') + ':' + key] || false
				},
				isShowingExplanation: function isShowingExplanation(state, model) {
					return state.data[model.get('id') + ':showingExplanation'] || false
				}
			}

			exports.default = QuestionUtil

			/***/
		},
		/* 6 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var startOfWeek = __webpack_require__(34)

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
				return startOfWeek(dirtyDate, { weekStartsOn: 1 })
			}

			module.exports = startOfISOWeek

			/***/
		},
		/* 7 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

			function makeEmptyFunction(arg) {
				return function() {
					return arg
				}
			}

			/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
			var emptyFunction = function emptyFunction() {}

			emptyFunction.thatReturns = makeEmptyFunction
			emptyFunction.thatReturnsFalse = makeEmptyFunction(false)
			emptyFunction.thatReturnsTrue = makeEmptyFunction(true)
			emptyFunction.thatReturnsNull = makeEmptyFunction(null)
			emptyFunction.thatReturnsThis = function() {
				return this
			}
			emptyFunction.thatReturnsArgument = function(arg) {
				return arg
			}

			module.exports = emptyFunction

			/***/
		},
		/* 8 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'
			/* WEBPACK VAR INJECTION */ ;(function(process) {
				/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
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

				var validateFormat = function validateFormat(format) {}

				if (process.env.NODE_ENV !== 'production') {
					validateFormat = function validateFormat(format) {
						if (format === undefined) {
							throw new Error('invariant requires an error message argument')
						}
					}
				}

				function invariant(condition, format, a, b, c, d, e, f) {
					validateFormat(format)

					if (!condition) {
						var error
						if (format === undefined) {
							error = new Error(
								'Minified exception occurred; use the non-minified dev environment ' +
									'for the full error message and additional helpful warnings.'
							)
						} else {
							var args = [a, b, c, d, e, f]
							var argIndex = 0
							error = new Error(
								format.replace(/%s/g, function() {
									return args[argIndex++]
								})
							)
							error.name = 'Invariant Violation'
						}

						error.framesToPop = 1 // we don't care about invariant's own frame
						throw error
					}
				}

				module.exports = invariant
				/* WEBPACK VAR INJECTION */
			}.call(exports, __webpack_require__(4)))

			/***/
		},
		/* 9 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'
			/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

			var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'

			module.exports = ReactPropTypesSecret

			/***/
		},
		/* 10 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _navUtil = __webpack_require__(2)

			var _navUtil2 = _interopRequireDefault(_navUtil)

			var _apiUtil = __webpack_require__(3)

			var _apiUtil2 = _interopRequireDefault(_apiUtil)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var Store = _Common2.default.flux.Store
			var Dispatcher = _Common2.default.flux.Dispatcher
			var OboModel = _Common2.default.models.OboModel

			var NavStore = (function(_Store) {
				_inherits(NavStore, _Store)

				function NavStore() {
					_classCallCheck(this, NavStore)

					var item = void 0,
						oldNavTargetId = void 0

					var _this = _possibleConstructorReturn(
						this,
						(NavStore.__proto__ || Object.getPrototypeOf(NavStore)).call(this, 'navstore')
					)

					Dispatcher.on(
						{
							'nav:rebuildMenu': function navRebuildMenu(payload) {
								_this.buildMenu(payload.value.model)
								return _this.triggerChange()
							},
							'nav:gotoPath': function navGotoPath(payload) {
								oldNavTargetId = _this.state.navTargetId
								if (_this.gotoItem(_this.state.itemsByPath[payload.value.path])) {
									return _apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:gotoPath', '1.0.0', {
										from: oldNavTargetId,
										to: _this.state.itemsByPath[payload.value.path].id
									})
								}
							},
							'nav:setFlag': function navSetFlag(payload) {
								var navItem = this.state.itemsById[payload.value.id]
								navItem.flags[payload.value.flagName] = payload.value.flagValue

								return this.triggerChange()
							},

							'nav:prev': function navPrev(payload) {
								oldNavTargetId = _this.state.navTargetId
								var prev = _navUtil2.default.getPrev(_this.state)
								if (_this.gotoItem(prev)) {
									return _apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:prev', '1.0.0', {
										from: oldNavTargetId,
										to: prev.id
									})
								}
							},
							'nav:next': function navNext(payload) {
								oldNavTargetId = _this.state.navTargetId
								var next = _navUtil2.default.getNext(_this.state)
								if (_this.gotoItem(next)) {
									return _apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:next', '1.0.0', {
										from: oldNavTargetId,
										to: next.id
									})
								}
							},
							'nav:goto': function navGoto(payload) {
								oldNavTargetId = _this.state.navTargetId
								if (_this.gotoItem(_this.state.itemsById[payload.value.id])) {
									return _apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:goto', '1.0.0', {
										from: oldNavTargetId,
										to: _this.state.itemsById[payload.value.id].id
									})
								}
							},
							'nav:lock': function navLock(payload) {
								return _this.setAndTrigger({ locked: true })
							},
							'nav:unlock': function navUnlock(payload) {
								return _this.setAndTrigger({ locked: false })
							},
							'nav:close': function navClose(payload) {
								return _this.setAndTrigger({ open: false })
							},
							'nav:open': function navOpen(payload) {
								return _this.setAndTrigger({ open: true })
							},
							'nav:toggle': function navToggle(payload) {
								return _this.setAndTrigger({ open: !_this.state.open })
							},
							'nav:openExternalLink': function navOpenExternalLink(payload) {
								window.open(payload.value.url)
								return _this.triggerChange()
							},
							'nav:showChildren': function navShowChildren(payload) {
								item = _this.state.itemsById[payload.value.id]
								item.showChildren = true
								return _this.triggerChange()
							},
							'nav:hideChildren': function navHideChildren(payload) {
								item = _this.state.itemsById[payload.value.id]
								item.showChildren = false
								return _this.triggerChange()
							},
							'score:set': function scoreSet(payload) {
								var navItem = _this.state.itemsById[payload.value.id]
								if (!navItem) {
									return
								}

								return _navUtil2.default.setFlag(
									payload.value.id,
									'correct',
									payload.value.score === 100
								)
							}
						},
						_this
					)
					return _this
				}

				_createClass(NavStore, [
					{
						key: 'init',
						value: function init(model, startingId, startingPath, visitId) {
							this.state = {
								items: {},
								itemsById: {},
								itemsByPath: {},
								itemsByFullPath: {},
								navTargetHistory: [],
								navTargetId: null,
								locked: false,
								open: true,
								visitId: visitId
							}

							this.buildMenu(model)
							// console.clear()
							// console.log @state.items
							// debugger
							_navUtil2.default.gotoPath(startingPath)

							if (startingId != null) {
								return _navUtil2.default.goto(startingId)
							} else {
								var first = _navUtil2.default.getFirst(this.state)

								if (first && first.id) _navUtil2.default.goto(first.id)
							}
						}
					},
					{
						key: 'buildMenu',
						value: function buildMenu(model) {
							this.state.itemsById = {}
							this.state.itemsByPath = {}
							this.state.itemsByFullPath = {}
							this.state.items = this.generateNav(model)
						}
					},
					{
						key: 'gotoItem',
						value: function gotoItem(navItem) {
							if (!navItem) {
								return false
							}

							if (this.state.navTargetId != null) {
								if (this.state.navTargetId === navItem.id) {
									return
								}

								var navTargetModel = __guard__(
									_navUtil2.default.getNavTargetModel(this.state),
									function(x) {
										return x.processTrigger('onNavExit')
									}
								)
								this.state.navTargetHistory.push(this.state.navTargetId)
								this.state.itemsById[this.state.navTargetId].showChildren = false
							}

							if (navItem.showChildrenOnNavigation) {
								navItem.showChildren = true
							}
							window.history.pushState({}, document.title, navItem.fullFlatPath)
							this.state.navTargetId = navItem.id
							_navUtil2.default.getNavTargetModel(this.state).processTrigger('onNavEnter')
							this.triggerChange()
							return true
						}
					},
					{
						key: 'generateNav',
						value: function generateNav(model, indent) {
							if (!model) return {}

							if (indent == null) {
								indent = ''
							}
							var item = _Common2.default.Store.getItemForType(model.get('type'))

							var navItem = null
							if (item.getNavItem != null) {
								navItem = item.getNavItem(model)
							}

							if (navItem == null) {
								navItem = {}
							}

							navItem = Object.assign(
								{
									type: 'hidden',
									label: '',
									path: '',
									showChildren: true,
									showChildrenOnNavigation: true
								},
								navItem
							)

							navItem.flags = []
							navItem.children = []
							navItem.id = model.get('id')
							navItem.fullPath = [].concat(navItem.path).filter(function(item) {
								return item !== ''
							})
							navItem.flags = {
								visited: false,
								complete: false,
								correct: false
							}

							var _iteratorNormalCompletion = true
							var _didIteratorError = false
							var _iteratorError = undefined

							try {
								for (
									var _iterator = Array.from(model.children.models)[Symbol.iterator](), _step;
									!(_iteratorNormalCompletion = (_step = _iterator.next()).done);
									_iteratorNormalCompletion = true
								) {
									var child = _step.value

									var childNavItem = this.generateNav(child, indent + '_')
									navItem.children.push(childNavItem)
									childNavItem.fullPath = navItem.fullPath
										.concat(childNavItem.fullPath)
										.filter(function(item) {
											return item !== ''
										})

									// flatPath = ['view', model.getRoot().get('_id'), childNavItem.fullPath.join('/')].join('/')
									var flatPath = childNavItem.fullPath.join('/')
									childNavItem.flatPath = flatPath
									childNavItem.fullFlatPath = [
										'/view',
										model.getRoot().get('draftId'),
										'visit',
										this.state.visitId,
										flatPath
									].join('/')
									this.state.itemsByPath[flatPath] = childNavItem
									this.state.itemsByFullPath[childNavItem.fullFlatPath] = childNavItem
								}
							} catch (err) {
								_didIteratorError = true
								_iteratorError = err
							} finally {
								try {
									if (!_iteratorNormalCompletion && _iterator.return) {
										_iterator.return()
									}
								} finally {
									if (_didIteratorError) {
										throw _iteratorError
									}
								}
							}

							this.state.itemsById[model.get('id')] = navItem

							return navItem
						}
					},
					{
						key: '_clearFlags',
						value: function _clearFlags() {
							return Array.from(this.state.items).map(function(item) {
								return (item.flags.complete = false)
							})
						}
					}
				])

				return NavStore
			})(Store)

			var navStore = new NavStore()
			window.__ns = navStore
			exports.default = navStore

			function __guard__(value, transform) {
				return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
			}

			/***/
		},
		/* 11 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var Dispatcher = _Common2.default.flux.Dispatcher

			var ScoreUtil = {
				getScoreForModel: function getScoreForModel(state, model) {
					var scoreItem = state.scores[model.get('id')]
					if (typeof scoreItem === 'undefined' || scoreItem === null) {
						return null
					}

					return scoreItem.score
				},
				setScore: function setScore(itemId, score) {
					return Dispatcher.trigger('score:set', {
						value: {
							itemId: itemId,
							score: score
						}
					})
				},
				clearScore: function clearScore(itemId) {
					return Dispatcher.trigger('score:clear', {
						value: {
							itemId: itemId
						}
					})
				}
			}

			exports.default = ScoreUtil

			/***/
		},
		/* 12 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var parse = __webpack_require__(1)
			var startOfISOWeek = __webpack_require__(6)

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
				var date = parse(dirtyDate)
				var year = date.getFullYear()

				var fourthOfJanuaryOfNextYear = new Date(0)
				fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4)
				fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0)
				var startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear)

				var fourthOfJanuaryOfThisYear = new Date(0)
				fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4)
				fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0)
				var startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear)

				if (date.getTime() >= startOfNextYear.getTime()) {
					return year + 1
				} else if (date.getTime() >= startOfThisYear.getTime()) {
					return year
				} else {
					return year - 1
				}
			}

			module.exports = getISOYear

			/***/
		},
		/* 13 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

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
				return argument instanceof Date
			}

			module.exports = isDate

			/***/
		},
		/* 14 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'
			/* WEBPACK VAR INJECTION */ ;(function(process) {
				/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

				var emptyFunction = __webpack_require__(7)

				/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

				var warning = emptyFunction

				if (process.env.NODE_ENV !== 'production') {
					;(function() {
						var printWarning = function printWarning(format) {
							for (
								var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1;
								_key < _len;
								_key++
							) {
								args[_key - 1] = arguments[_key]
							}

							var argIndex = 0
							var message =
								'Warning: ' +
								format.replace(/%s/g, function() {
									return args[argIndex++]
								})
							if (typeof console !== 'undefined') {
								console.error(message)
							}
							try {
								// --- Welcome to debugging React ---
								// This error was thrown as a convenience so that you can use this stack
								// to find the callsite that caused this warning to fire.
								throw new Error(message)
							} catch (x) {}
						}

						warning = function warning(condition, format) {
							if (format === undefined) {
								throw new Error(
									'`warning(condition, format, ...args)` requires a warning ' + 'message argument'
								)
							}

							if (format.indexOf('Failed Composite propType: ') === 0) {
								return // Ignore CompositeComponent proptype check.
							}

							if (!condition) {
								for (
									var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2;
									_key2 < _len2;
									_key2++
								) {
									args[_key2 - 2] = arguments[_key2]
								}

								printWarning.apply(undefined, [format].concat(args))
							}
						}
					})()
				}

				module.exports = warning
				/* WEBPACK VAR INJECTION */
			}.call(exports, __webpack_require__(4)))

			/***/
		},
		/* 15 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			__webpack_require__(46)

			var _navUtil = __webpack_require__(2)

			var _navUtil2 = _interopRequireDefault(_navUtil)

			var _obojoboLogo = __webpack_require__(53)

			var _obojoboLogo2 = _interopRequireDefault(_obojoboLogo)

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var getBackgroundImage = _Common2.default.util.getBackgroundImage

			var Logo = (function(_React$Component) {
				_inherits(Logo, _React$Component)

				function Logo() {
					_classCallCheck(this, Logo)

					return _possibleConstructorReturn(
						this,
						(Logo.__proto__ || Object.getPrototypeOf(Logo)).apply(this, arguments)
					)
				}

				_createClass(Logo, [
					{
						key: 'render',
						value: function render() {
							var bg = getBackgroundImage(_obojoboLogo2.default)

							return React.createElement(
								'div',
								{
									className:
										'viewer--components--logo' +
										(this.props.inverted ? ' is-inverted' : ' is-not-inverted'),
									style: {
										backgroundImage: bg
									}
								},
								'Obojobo'
							)
						}
					}
				])

				return Logo
			})(React.Component)

			exports.default = Logo

			/***/
		},
		/* 16 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _assessmentUtil = __webpack_require__(19)

			var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil)

			var _scoreUtil = __webpack_require__(11)

			var _scoreUtil2 = _interopRequireDefault(_scoreUtil)

			var _questionUtil = __webpack_require__(5)

			var _questionUtil2 = _interopRequireDefault(_questionUtil)

			var _apiUtil = __webpack_require__(3)

			var _apiUtil2 = _interopRequireDefault(_apiUtil)

			var _navUtil = __webpack_require__(2)

			var _navUtil2 = _interopRequireDefault(_navUtil)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var Store = _Common2.default.flux.Store
			var Dispatcher = _Common2.default.flux.Dispatcher
			var OboModel = _Common2.default.models.OboModel
			var ErrorUtil = _Common2.default.util.ErrorUtil
			var SimpleDialog = _Common2.default.components.modal.SimpleDialog
			var ModalUtil = _Common2.default.util.ModalUtil

			var getNewAssessmentObject = function getNewAssessmentObject(assessmentId) {
				return {
					id: assessmentId,
					current: null,
					currentResponses: [],
					attempts: []
				}
			}

			var AssessmentStore = (function(_Store) {
				_inherits(AssessmentStore, _Store)

				function AssessmentStore() {
					_classCallCheck(this, AssessmentStore)

					var assessment = void 0,
						id = void 0,
						model = void 0

					var _this = _possibleConstructorReturn(
						this,
						(AssessmentStore.__proto__ || Object.getPrototypeOf(AssessmentStore))
							.call(this, 'assessmentstore')
					)

					Dispatcher.on('assessment:startAttempt', function(payload) {
						_this.tryStartAttempt(payload.value.id)
					})

					Dispatcher.on('assessment:endAttempt', function(payload) {
						_this.tryEndAttempt(payload.value.id)
					})

					Dispatcher.on('question:setResponse', function(payload) {
						_this.trySetResponse(payload.value.id, payload.value.response, payload.value.targetId)
					})
					return _this
				}

				_createClass(AssessmentStore, [
					{
						key: 'init',
						value: function init(history) {
							var question = void 0
							if (history == null) {
								history = []
							}
							this.state = {
								assessments: {}
							}

							history.sort(function(a, b) {
								return new Date(a.startTime).getTime() > new Date(b.startTime).getTime()
							})

							var unfinishedAttempt = null
							var nonExistantQuestions = []

							var _iteratorNormalCompletion = true
							var _didIteratorError = false
							var _iteratorError = undefined

							try {
								for (
									var _iterator = Array.from(history)[Symbol.iterator](), _step;
									!(_iteratorNormalCompletion = (_step = _iterator.next()).done);
									_iteratorNormalCompletion = true
								) {
									var attempt = _step.value

									if (!this.state.assessments[attempt.assessmentId]) {
										this.state.assessments[attempt.assessmentId] = getNewAssessmentObject(
											attempt.assessmentId
										)
									}

									if (!attempt.endTime) {
										// @state.assessments[attempt.assessmentId].current = attempt
										unfinishedAttempt = attempt
									} else {
										this.state.assessments[attempt.assessmentId].attempts.push(attempt)
									}

									var _iteratorNormalCompletion3 = true
									var _didIteratorError3 = false
									var _iteratorError3 = undefined

									try {
										for (
											var _iterator3 = Array.from(attempt.state.questions)[Symbol.iterator](),
												_step3;
											!(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
											_iteratorNormalCompletion3 = true
										) {
											question = _step3.value

											if (!OboModel.models[question.id]) {
												nonExistantQuestions.push(question)
											}
										}
									} catch (err) {
										_didIteratorError3 = true
										_iteratorError3 = err
									} finally {
										try {
											if (!_iteratorNormalCompletion3 && _iterator3.return) {
												_iterator3.return()
											}
										} finally {
											if (_didIteratorError3) {
												throw _iteratorError3
											}
										}
									}
								}
							} catch (err) {
								_didIteratorError = true
								_iteratorError = err
							} finally {
								try {
									if (!_iteratorNormalCompletion && _iterator.return) {
										_iterator.return()
									}
								} finally {
									if (_didIteratorError) {
										throw _iteratorError
									}
								}
							}

							var _iteratorNormalCompletion2 = true
							var _didIteratorError2 = false
							var _iteratorError2 = undefined

							try {
								for (
									var _iterator2 = Array.from(nonExistantQuestions)[Symbol.iterator](), _step2;
									!(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
									_iteratorNormalCompletion2 = true
								) {
									question = _step2.value

									OboModel.create(question)
								}
							} catch (err) {
								_didIteratorError2 = true
								_iteratorError2 = err
							} finally {
								try {
									if (!_iteratorNormalCompletion2 && _iterator2.return) {
										_iterator2.return()
									}
								} finally {
									if (_didIteratorError2) {
										throw _iteratorError2
									}
								}
							}

							if (unfinishedAttempt) {
								return ModalUtil.show(
									React.createElement(
										SimpleDialog,
										{
											ok: true,
											title: 'Resume Attempt',
											onConfirm: this.onResumeAttemptConfirm.bind(this, unfinishedAttempt)
										},
										React.createElement(
											'p',
											null,
											"It looks like you were in the middle of an attempt. We'll resume you where you left off."
										)
									)
								)
							}
						}
					},
					{
						key: 'onResumeAttemptConfirm',
						value: function onResumeAttemptConfirm(unfinishedAttempt) {
							ModalUtil.hide()

							this.startAttempt(unfinishedAttempt)
							this.triggerChange()
						}
					},
					{
						key: 'tryStartAttempt',
						value: function tryStartAttempt(id) {
							var _this2 = this

							var model = OboModel.models[id]

							return _apiUtil2.default
								.startAttempt(model.getRoot(), model, {})
								.then(function(res) {
									if (res.status === 'error') {
										switch (res.value.message.toLowerCase()) {
											case 'attempt limit reached':
												ErrorUtil.show(
													'No attempts left',
													'You have attempted this assessment the maximum number of times available.'
												)
												break

											default:
												ErrorUtil.errorResponse(res)
										}
									} else {
										_this2.startAttempt(res.value)
									}

									_this2.triggerChange()
								})
								.catch(function(e) {
									console.error(e)
								})
						}
					},
					{
						key: 'startAttempt',
						value: function startAttempt(startAttemptResp) {
							var id = startAttemptResp.assessmentId
							var model = OboModel.models[id]

							model.children.at(1).children.reset()
							var _iteratorNormalCompletion4 = true
							var _didIteratorError4 = false
							var _iteratorError4 = undefined

							try {
								for (
									var _iterator4 = Array.from(startAttemptResp.state.questions)[Symbol.iterator](),
										_step4;
									!(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done);
									_iteratorNormalCompletion4 = true
								) {
									var child = _step4.value

									var c = OboModel.create(child)
									model.children.at(1).children.add(c)
								}
							} catch (err) {
								_didIteratorError4 = true
								_iteratorError4 = err
							} finally {
								try {
									if (!_iteratorNormalCompletion4 && _iterator4.return) {
										_iterator4.return()
									}
								} finally {
									if (_didIteratorError4) {
										throw _iteratorError4
									}
								}
							}

							if (!this.state.assessments[id]) {
								this.state.assessments[id] = getNewAssessmentObject(id)
							}

							this.state.assessments[id].current = startAttemptResp

							_navUtil2.default.rebuildMenu(model.getRoot())
							_navUtil2.default.goto(id)

							model.processTrigger('onStartAttempt')
							Dispatcher.trigger('assessment:attemptStarted', id)
						}
					},
					{
						key: 'tryEndAttempt',
						value: function tryEndAttempt(id) {
							var _this3 = this

							var model = OboModel.models[id]
							var assessment = this.state.assessments[id]

							return _apiUtil2.default
								.endAttempt(assessment.current)
								.then(function(res) {
									if (res.status === 'error') {
										return ErrorUtil.errorResponse(res)
									}

									_this3.endAttempt(res.value)
									return _this3.triggerChange()
								})
								.catch(function(e) {
									console.error(e)
								})
						}
					},
					{
						key: 'endAttempt',
						value: function endAttempt(endAttemptResp) {
							var id = endAttemptResp.assessmentId
							var assessment = this.state.assessments[id]
							var model = OboModel.models[id]

							assessment.current.state.questions.forEach(function(question) {
								return _questionUtil2.default.hideQuestion(question.id)
							})
							assessment.currentResponses.forEach(function(questionId) {
								return _questionUtil2.default.clearResponse(questionId)
							})
							assessment.attempts.push(endAttemptResp)
							assessment.current = null

							model.processTrigger('onEndAttempt')
							Dispatcher.trigger('assessment:attemptEnded', id)
						}
					},
					{
						key: 'trySetResponse',
						value: function trySetResponse(questionId, response, targetId) {
							var _this4 = this

							var model = OboModel.models[questionId]
							var assessment = _assessmentUtil2.default.getAssessmentForModel(this.state, model)

							if (!assessment || !assessment.currentResponses) {
								// Resolve false if not an error but couldn't do anything because not in an attempt
								return Promise.resolve(false)
							}

							assessment.currentResponses.push(questionId)

							return _apiUtil2.default
								.postEvent(model.getRoot(), 'assessment:setResponse', '2.0.0', {
									assessmentId: assessment.id,
									attemptId: assessment.current.attemptId,
									questionId: questionId,
									response: response,
									targetId: targetId
								})
								.then(function(res) {
									if (res.status === 'error') {
										return ErrorUtil.errorResponse(res)
									}
									_this4.triggerChange()
								})
						}
					},
					{
						key: 'getState',
						value: function getState() {
							return this.state
						}
					},
					{
						key: 'setState',
						value: function setState(newState) {
							return (this.state = newState)
						}
					}
				])

				return AssessmentStore
			})(Store)

			var assessmentStore = new AssessmentStore()
			exports.default = assessmentStore

			/***/
		},
		/* 17 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _apiUtil = __webpack_require__(3)

			var _apiUtil2 = _interopRequireDefault(_apiUtil)

			var _questionUtil = __webpack_require__(5)

			var _questionUtil2 = _interopRequireDefault(_questionUtil)

			var _scoreUtil = __webpack_require__(11)

			var _scoreUtil2 = _interopRequireDefault(_scoreUtil)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var Store = _Common2.default.flux.Store
			var Dispatcher = _Common2.default.flux.Dispatcher
			var OboModel = _Common2.default.models.OboModel

			var QuestionStore = (function(_Store) {
				_inherits(QuestionStore, _Store)

				function QuestionStore() {
					_classCallCheck(this, QuestionStore)

					var id = void 0

					var _this = _possibleConstructorReturn(
						this,
						(QuestionStore.__proto__ || Object.getPrototypeOf(QuestionStore))
							.call(this, 'questionStore')
					)

					Dispatcher.on({
						'question:setResponse': function questionSetResponse(payload) {
							var id = payload.value.id
							var model = OboModel.models[id]

							_this.state.responses[id] = payload.value.response
							_this.triggerChange()

							_apiUtil2.default.postEvent(model.getRoot(), 'question:setResponse', '2.0.0', {
								questionId: id,
								response: payload.value.response,
								targetId: payload.value.targetId
							})
						},

						'question:clearResponse': function questionClearResponse(payload) {
							delete _this.state.responses[payload.value.id]
							return _this.triggerChange()
						},

						'question:setData': function questionSetData(payload) {
							_this.state.data[payload.value.key] = payload.value.value
							return _this.triggerChange()
						},

						'question:showExplanation': function questionShowExplanation(payload) {
							var root = OboModel.models[payload.value.id].getRoot()

							_apiUtil2.default.postEvent(root, 'question:showExplanation', '1.0.0', {
								questionId: payload.value.id
							})

							_questionUtil2.default.setData(payload.value.id, 'showingExplanation', true)
						},

						'question:hideExplanation': function questionHideExplanation(payload) {
							var root = OboModel.models[payload.value.id].getRoot()

							_apiUtil2.default.postEvent(root, 'question:hideExplanation', '1.0.0', {
								questionId: payload.value.id
							})

							_questionUtil2.default.clearData(payload.value.id, 'showingExplanation')
						},

						'question:clearData': function questionClearData(payload) {
							delete _this.state.data[payload.value.key]
							return _this.triggerChange()
						},

						'question:hide': function questionHide(payload) {
							_apiUtil2.default.postEvent(
								OboModel.models[payload.value.id].getRoot(),
								'question:hide',
								'1.0.0',
								{
									questionId: payload.value.id
								}
							)

							delete _this.state.viewedQuestions[payload.value.id]

							if (_this.state.viewing === payload.value.id) {
								_this.state.viewing = null
							}

							return _this.triggerChange()
						},

						'question:view': function questionView(payload) {
							var root = OboModel.models[payload.value.id].getRoot()

							_apiUtil2.default.postEvent(root, 'question:view', '1.0.0', {
								questionId: payload.value.id
							})

							_this.state.viewedQuestions[payload.value.id] = true
							_this.state.viewing = payload.value.id

							return _this.triggerChange()
						},

						'question:checkAnswer': function questionCheckAnswer(payload) {
							var questionId = payload.value.id
							var questionModel = OboModel.models[questionId]
							var root = questionModel.getRoot()

							_apiUtil2.default.postEvent(root, 'question:checkAnswer', '1.0.0', {
								questionId: payload.value.id
							})
						},

						'question:retry': function questionRetry(payload) {
							var questionId = payload.value.id
							var questionModel = OboModel.models[questionId]
							var root = questionModel.getRoot()

							_this.clearResponses(questionId)

							_apiUtil2.default.postEvent(root, 'question:retry', '1.0.0', {
								questionId: payload.value.id
							})

							if (_questionUtil2.default.isShowingExplanation(_this.state, questionModel)) {
								_questionUtil2.default.hideExplanation(questionId, true)
							}

							_scoreUtil2.default.clearScore(questionId) // should trigger change
						}
					})
					return _this
				}

				_createClass(QuestionStore, [
					{
						key: 'clearResponses',
						value: function clearResponses(questionId) {
							delete this.state.responses[questionId]
						}
					},
					{
						key: 'init',
						value: function init() {
							return (this.state = {
								viewing: null,
								viewedQuestions: {},
								responses: {},
								data: {}
							})
						}
					},
					{
						key: 'getState',
						value: function getState() {
							return this.state
						}
					},
					{
						key: 'setState',
						value: function setState(newState) {
							return (this.state = newState)
						}
					}
				])

				return QuestionStore
			})(Store)

			var questionStore = new QuestionStore()
			exports.default = questionStore

			/***/
		},
		/* 18 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _apiUtil = __webpack_require__(3)

			var _apiUtil2 = _interopRequireDefault(_apiUtil)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var Store = _Common2.default.flux.Store
			var Dispatcher = _Common2.default.flux.Dispatcher
			var _Common$util = _Common2.default.util,
				UUID = _Common$util.UUID,
				FocusUtil = _Common$util.FocusUtil
			var OboModel = _Common2.default.models.OboModel

			var ScoreStore = (function(_Store) {
				_inherits(ScoreStore, _Store)

				function ScoreStore() {
					_classCallCheck(this, ScoreStore)

					var model = void 0

					var _this = _possibleConstructorReturn(
						this,
						(ScoreStore.__proto__ || Object.getPrototypeOf(ScoreStore)).call(this, 'scoreStore')
					)

					Dispatcher.on({
						'score:set': function scoreSet(payload) {
							var scoreId = UUID()

							_this.state.scores[payload.value.itemId] = {
								id: scoreId,
								score: payload.value.score,
								itemId: payload.value.itemId
							}

							if (payload.value.score === 100) {
								FocusUtil.unfocus()
							}

							_this.triggerChange()

							model = OboModel.models[payload.value.itemId]
							return _apiUtil2.default.postEvent(model.getRoot(), 'score:set', '2.0.0', {
								id: scoreId,
								itemId: payload.value.itemId,
								score: payload.value.score
							})
						},

						'score:clear': function scoreClear(payload) {
							var scoreItem = _this.state.scores[payload.value.itemId]

							model = OboModel.models[scoreItem.itemId]

							delete _this.state.scores[payload.value.itemId]
							_this.triggerChange()

							return _apiUtil2.default.postEvent(model.getRoot(), 'score:clear', '2.0.0', scoreItem)
						}
					})
					return _this
				}

				_createClass(ScoreStore, [
					{
						key: 'init',
						value: function init() {
							return (this.state = {
								scores: {}
							})
						}
					},
					{
						key: 'getState',
						value: function getState() {
							return this.state
						}
					},
					{
						key: 'setState',
						value: function setState(newState) {
							return (this.state = newState)
						}
					}
				])

				return ScoreStore
			})(Store)

			var scoreStore = new ScoreStore()
			exports.default = scoreStore

			/***/
		},
		/* 19 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _questionUtil = __webpack_require__(5)

			var _questionUtil2 = _interopRequireDefault(_questionUtil)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var Dispatcher = _Common2.default.flux.Dispatcher

			var AssessmentUtil = {
				getAssessmentForModel: function getAssessmentForModel(state, model) {
					var assessmentModel = void 0
					if (model.get('type') === 'ObojoboDraft.Sections.Assessment') {
						assessmentModel = model
					} else {
						assessmentModel = model.getParentOfType('ObojoboDraft.Sections.Assessment')
					}

					if (!assessmentModel) {
						return null
					}

					var assessment = state.assessments[assessmentModel.get('id')]
					if (!assessment) {
						return null
					}

					return assessment
				},
				getLastAttemptScoreForModel: function getLastAttemptScoreForModel(state, model) {
					var assessment = AssessmentUtil.getAssessmentForModel(state, model)
					if (!assessment) {
						return null
					}

					if (assessment.attempts.length === 0) {
						return 0
					}

					return assessment.attempts[assessment.attempts.length - 1].result.attemptScore
				},
				getHighestAttemptScoreForModel: function getHighestAttemptScoreForModel(state, model) {
					var assessment = AssessmentUtil.getAssessmentForModel(state, model)
					if (!assessment) {
						return null
					}

					return assessment.attempts
						.map(function(attempt) {
							return attempt.result.attemptScore
						})
						.reduce(function(a, b) {
							return Math.max(a, b)
						}, 0)
				},
				getLastAttemptScoresForModel: function getLastAttemptScoresForModel(state, model) {
					var assessment = AssessmentUtil.getAssessmentForModel(state, model)
					if (!assessment) {
						return null
					}

					if (assessment.attempts.length === 0) {
						return []
					}

					return assessment.attempts[assessment.attempts.length - 1].result.scores
				},
				getCurrentAttemptForModel: function getCurrentAttemptForModel(state, model) {
					var assessment = AssessmentUtil.getAssessmentForModel(state, model)
					if (!assessment) {
						return null
					}

					return assessment.current
				},

				// getLastAttemptForModel(state, model) {
				// 	let assessment = AssessmentUtil.getAssessmentForModel(state, model);
				// 	if (!assessment || (assessment.attempts.length === 0)) { return null; }

				// 	return assessment.attempts[assessment.attempts.length - 1];
				// },

				// isCurrentAttemptComplete(assessmentState, questionState, model) {
				// 	console.log(
				// 		'@TODO: Function not working, responses stored by responseId, not by questionId. Do not use this method.'
				// 	)
				// 	let current = AssessmentUtil.getCurrentAttemptForModel(assessmentState, model)
				// 	if (!current) {
				// 		return null
				// 	}

				// 	let models = model.children.at(1).children.models

				// 	return (
				// 		models.filter(function(questionModel) {
				// 			let resp = QuestionUtil.getResponse(questionState, questionModel)
				// 			return resp && resp.set === true
				// 		}).length === models.length
				// 	)
				// },

				getNumberOfAttemptsCompletedForModel: function getNumberOfAttemptsCompletedForModel(
					state,
					model
				) {
					var assessment = AssessmentUtil.getAssessmentForModel(state, model)
					if (!assessment || assessment.attempts.length === 0) {
						return 0
					}

					return assessment.attempts.length
				},
				startAttempt: function startAttempt(model) {
					return Dispatcher.trigger('assessment:startAttempt', {
						value: {
							id: model.get('id')
						}
					})
				},
				endAttempt: function endAttempt(model) {
					return Dispatcher.trigger('assessment:endAttempt', {
						value: {
							id: model.get('id')
						}
					})
				}
			}

			exports.default = AssessmentUtil

			/***/
		},
		/* 20 */
		/***/ function(module, exports) {
			module.exports = React

			/***/
		},
		/* 21 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			;(function(self) {
				'use strict'

				if (self.fetch) {
					return
				}

				var support = {
					searchParams: 'URLSearchParams' in self,
					iterable: 'Symbol' in self && 'iterator' in Symbol,
					blob:
						'FileReader' in self &&
						'Blob' in self &&
						(function() {
							try {
								new Blob()
								return true
							} catch (e) {
								return false
							}
						})(),
					formData: 'FormData' in self,
					arrayBuffer: 'ArrayBuffer' in self
				}

				if (support.arrayBuffer) {
					var viewClasses = [
						'[object Int8Array]',
						'[object Uint8Array]',
						'[object Uint8ClampedArray]',
						'[object Int16Array]',
						'[object Uint16Array]',
						'[object Int32Array]',
						'[object Uint32Array]',
						'[object Float32Array]',
						'[object Float64Array]'
					]

					var isDataView = function isDataView(obj) {
						return obj && DataView.prototype.isPrototypeOf(obj)
					}

					var isArrayBufferView =
						ArrayBuffer.isView ||
						function(obj) {
							return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
						}
				}

				function normalizeName(name) {
					if (typeof name !== 'string') {
						name = String(name)
					}
					if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
						throw new TypeError('Invalid character in header field name')
					}
					return name.toLowerCase()
				}

				function normalizeValue(value) {
					if (typeof value !== 'string') {
						value = String(value)
					}
					return value
				}

				// Build a destructive iterator for the value list
				function iteratorFor(items) {
					var iterator = {
						next: function next() {
							var value = items.shift()
							return { done: value === undefined, value: value }
						}
					}

					if (support.iterable) {
						iterator[Symbol.iterator] = function() {
							return iterator
						}
					}

					return iterator
				}

				function Headers(headers) {
					this.map = {}

					if (headers instanceof Headers) {
						headers.forEach(function(value, name) {
							this.append(name, value)
						}, this)
					} else if (Array.isArray(headers)) {
						headers.forEach(function(header) {
							this.append(header[0], header[1])
						}, this)
					} else if (headers) {
						Object.getOwnPropertyNames(headers).forEach(function(name) {
							this.append(name, headers[name])
						}, this)
					}
				}

				Headers.prototype.append = function(name, value) {
					name = normalizeName(name)
					value = normalizeValue(value)
					var oldValue = this.map[name]
					this.map[name] = oldValue ? oldValue + ',' + value : value
				}

				Headers.prototype['delete'] = function(name) {
					delete this.map[normalizeName(name)]
				}

				Headers.prototype.get = function(name) {
					name = normalizeName(name)
					return this.has(name) ? this.map[name] : null
				}

				Headers.prototype.has = function(name) {
					return this.map.hasOwnProperty(normalizeName(name))
				}

				Headers.prototype.set = function(name, value) {
					this.map[normalizeName(name)] = normalizeValue(value)
				}

				Headers.prototype.forEach = function(callback, thisArg) {
					for (var name in this.map) {
						if (this.map.hasOwnProperty(name)) {
							callback.call(thisArg, this.map[name], name, this)
						}
					}
				}

				Headers.prototype.keys = function() {
					var items = []
					this.forEach(function(value, name) {
						items.push(name)
					})
					return iteratorFor(items)
				}

				Headers.prototype.values = function() {
					var items = []
					this.forEach(function(value) {
						items.push(value)
					})
					return iteratorFor(items)
				}

				Headers.prototype.entries = function() {
					var items = []
					this.forEach(function(value, name) {
						items.push([name, value])
					})
					return iteratorFor(items)
				}

				if (support.iterable) {
					Headers.prototype[Symbol.iterator] = Headers.prototype.entries
				}

				function consumed(body) {
					if (body.bodyUsed) {
						return Promise.reject(new TypeError('Already read'))
					}
					body.bodyUsed = true
				}

				function fileReaderReady(reader) {
					return new Promise(function(resolve, reject) {
						reader.onload = function() {
							resolve(reader.result)
						}
						reader.onerror = function() {
							reject(reader.error)
						}
					})
				}

				function readBlobAsArrayBuffer(blob) {
					var reader = new FileReader()
					var promise = fileReaderReady(reader)
					reader.readAsArrayBuffer(blob)
					return promise
				}

				function readBlobAsText(blob) {
					var reader = new FileReader()
					var promise = fileReaderReady(reader)
					reader.readAsText(blob)
					return promise
				}

				function readArrayBufferAsText(buf) {
					var view = new Uint8Array(buf)
					var chars = new Array(view.length)

					for (var i = 0; i < view.length; i++) {
						chars[i] = String.fromCharCode(view[i])
					}
					return chars.join('')
				}

				function bufferClone(buf) {
					if (buf.slice) {
						return buf.slice(0)
					} else {
						var view = new Uint8Array(buf.byteLength)
						view.set(new Uint8Array(buf))
						return view.buffer
					}
				}

				function Body() {
					this.bodyUsed = false

					this._initBody = function(body) {
						this._bodyInit = body
						if (!body) {
							this._bodyText = ''
						} else if (typeof body === 'string') {
							this._bodyText = body
						} else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
							this._bodyBlob = body
						} else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
							this._bodyFormData = body
						} else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
							this._bodyText = body.toString()
						} else if (support.arrayBuffer && support.blob && isDataView(body)) {
							this._bodyArrayBuffer = bufferClone(body.buffer)
							// IE 10-11 can't handle a DataView body.
							this._bodyInit = new Blob([this._bodyArrayBuffer])
						} else if (
							support.arrayBuffer &&
							(ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))
						) {
							this._bodyArrayBuffer = bufferClone(body)
						} else {
							throw new Error('unsupported BodyInit type')
						}

						if (!this.headers.get('content-type')) {
							if (typeof body === 'string') {
								this.headers.set('content-type', 'text/plain;charset=UTF-8')
							} else if (this._bodyBlob && this._bodyBlob.type) {
								this.headers.set('content-type', this._bodyBlob.type)
							} else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
								this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
							}
						}
					}

					if (support.blob) {
						this.blob = function() {
							var rejected = consumed(this)
							if (rejected) {
								return rejected
							}

							if (this._bodyBlob) {
								return Promise.resolve(this._bodyBlob)
							} else if (this._bodyArrayBuffer) {
								return Promise.resolve(new Blob([this._bodyArrayBuffer]))
							} else if (this._bodyFormData) {
								throw new Error('could not read FormData body as blob')
							} else {
								return Promise.resolve(new Blob([this._bodyText]))
							}
						}

						this.arrayBuffer = function() {
							if (this._bodyArrayBuffer) {
								return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
							} else {
								return this.blob().then(readBlobAsArrayBuffer)
							}
						}
					}

					this.text = function() {
						var rejected = consumed(this)
						if (rejected) {
							return rejected
						}

						if (this._bodyBlob) {
							return readBlobAsText(this._bodyBlob)
						} else if (this._bodyArrayBuffer) {
							return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
						} else if (this._bodyFormData) {
							throw new Error('could not read FormData body as text')
						} else {
							return Promise.resolve(this._bodyText)
						}
					}

					if (support.formData) {
						this.formData = function() {
							return this.text().then(decode)
						}
					}

					this.json = function() {
						return this.text().then(JSON.parse)
					}

					return this
				}

				// HTTP methods whose capitalization should be normalized
				var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

				function normalizeMethod(method) {
					var upcased = method.toUpperCase()
					return methods.indexOf(upcased) > -1 ? upcased : method
				}

				function Request(input, options) {
					options = options || {}
					var body = options.body

					if (input instanceof Request) {
						if (input.bodyUsed) {
							throw new TypeError('Already read')
						}
						this.url = input.url
						this.credentials = input.credentials
						if (!options.headers) {
							this.headers = new Headers(input.headers)
						}
						this.method = input.method
						this.mode = input.mode
						if (!body && input._bodyInit != null) {
							body = input._bodyInit
							input.bodyUsed = true
						}
					} else {
						this.url = String(input)
					}

					this.credentials = options.credentials || this.credentials || 'omit'
					if (options.headers || !this.headers) {
						this.headers = new Headers(options.headers)
					}
					this.method = normalizeMethod(options.method || this.method || 'GET')
					this.mode = options.mode || this.mode || null
					this.referrer = null

					if ((this.method === 'GET' || this.method === 'HEAD') && body) {
						throw new TypeError('Body not allowed for GET or HEAD requests')
					}
					this._initBody(body)
				}

				Request.prototype.clone = function() {
					return new Request(this, { body: this._bodyInit })
				}

				function decode(body) {
					var form = new FormData()
					body.trim().split('&').forEach(function(bytes) {
						if (bytes) {
							var split = bytes.split('=')
							var name = split.shift().replace(/\+/g, ' ')
							var value = split.join('=').replace(/\+/g, ' ')
							form.append(decodeURIComponent(name), decodeURIComponent(value))
						}
					})
					return form
				}

				function parseHeaders(rawHeaders) {
					var headers = new Headers()
					rawHeaders.split(/\r?\n/).forEach(function(line) {
						var parts = line.split(':')
						var key = parts.shift().trim()
						if (key) {
							var value = parts.join(':').trim()
							headers.append(key, value)
						}
					})
					return headers
				}

				Body.call(Request.prototype)

				function Response(bodyInit, options) {
					if (!options) {
						options = {}
					}

					this.type = 'default'
					this.status = 'status' in options ? options.status : 200
					this.ok = this.status >= 200 && this.status < 300
					this.statusText = 'statusText' in options ? options.statusText : 'OK'
					this.headers = new Headers(options.headers)
					this.url = options.url || ''
					this._initBody(bodyInit)
				}

				Body.call(Response.prototype)

				Response.prototype.clone = function() {
					return new Response(this._bodyInit, {
						status: this.status,
						statusText: this.statusText,
						headers: new Headers(this.headers),
						url: this.url
					})
				}

				Response.error = function() {
					var response = new Response(null, { status: 0, statusText: '' })
					response.type = 'error'
					return response
				}

				var redirectStatuses = [301, 302, 303, 307, 308]

				Response.redirect = function(url, status) {
					if (redirectStatuses.indexOf(status) === -1) {
						throw new RangeError('Invalid status code')
					}

					return new Response(null, { status: status, headers: { location: url } })
				}

				self.Headers = Headers
				self.Request = Request
				self.Response = Response

				self.fetch = function(input, init) {
					return new Promise(function(resolve, reject) {
						var request = new Request(input, init)
						var xhr = new XMLHttpRequest()

						xhr.onload = function() {
							var options = {
								status: xhr.status,
								statusText: xhr.statusText,
								headers: parseHeaders(xhr.getAllResponseHeaders() || '')
							}
							options.url =
								'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
							var body = 'response' in xhr ? xhr.response : xhr.responseText
							resolve(new Response(body, options))
						}

						xhr.onerror = function() {
							reject(new TypeError('Network request failed'))
						}

						xhr.ontimeout = function() {
							reject(new TypeError('Network request failed'))
						}

						xhr.open(request.method, request.url, true)

						if (request.credentials === 'include') {
							xhr.withCredentials = true
						}

						if ('responseType' in xhr && support.blob) {
							xhr.responseType = 'blob'
						}

						request.headers.forEach(function(value, name) {
							xhr.setRequestHeader(name, value)
						})

						xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
					})
				}
				self.fetch.polyfill = true
			})(typeof self !== 'undefined' ? self : undefined)

			/***/
		},
		/* 22 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var _index = __webpack_require__(44)

			var _index2 = _interopRequireDefault(_index)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			window.Viewer = _index2.default

			/***/
		},
		/* 23 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var startOfDay = __webpack_require__(32)

			var MILLISECONDS_IN_MINUTE = 60000
			var MILLISECONDS_IN_DAY = 86400000

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
				var startOfDayLeft = startOfDay(dirtyDateLeft)
				var startOfDayRight = startOfDay(dirtyDateRight)

				var timestampLeft =
					startOfDayLeft.getTime() - startOfDayLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE
				var timestampRight =
					startOfDayRight.getTime() - startOfDayRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE

				// Round the number of days to the nearest integer
				// because the number of milliseconds in a day is not constant
				// (e.g. it's different in the day of the daylight saving time clock shift)
				return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY)
			}

			module.exports = differenceInCalendarDays

			/***/
		},
		/* 24 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var getDayOfYear = __webpack_require__(25)
			var getISOWeek = __webpack_require__(26)
			var getISOYear = __webpack_require__(12)
			var parse = __webpack_require__(1)
			var isValid = __webpack_require__(27)
			var enLocale = __webpack_require__(31)

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
				var formatStr = dirtyFormatStr ? String(dirtyFormatStr) : 'YYYY-MM-DDTHH:mm:ss.SSSZ'
				var options = dirtyOptions || {}

				var locale = options.locale
				var localeFormatters = enLocale.format.formatters
				var formattingTokensRegExp = enLocale.format.formattingTokensRegExp
				if (locale && locale.format && locale.format.formatters) {
					localeFormatters = locale.format.formatters

					if (locale.format.formattingTokensRegExp) {
						formattingTokensRegExp = locale.format.formattingTokensRegExp
					}
				}

				var date = parse(dirtyDate)

				if (!isValid(date)) {
					return 'Invalid Date'
				}

				var formatFn = buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp)

				return formatFn(date)
			}

			var formatters = {
				// Month: 1, 2, ..., 12
				M: function M(date) {
					return date.getMonth() + 1
				},

				// Month: 01, 02, ..., 12
				MM: function MM(date) {
					return addLeadingZeros(date.getMonth() + 1, 2)
				},

				// Quarter: 1, 2, 3, 4
				Q: function Q(date) {
					return Math.ceil((date.getMonth() + 1) / 3)
				},

				// Day of month: 1, 2, ..., 31
				D: function D(date) {
					return date.getDate()
				},

				// Day of month: 01, 02, ..., 31
				DD: function DD(date) {
					return addLeadingZeros(date.getDate(), 2)
				},

				// Day of year: 1, 2, ..., 366
				DDD: function DDD(date) {
					return getDayOfYear(date)
				},

				// Day of year: 001, 002, ..., 366
				DDDD: function DDDD(date) {
					return addLeadingZeros(getDayOfYear(date), 3)
				},

				// Day of week: 0, 1, ..., 6
				d: function d(date) {
					return date.getDay()
				},

				// Day of ISO week: 1, 2, ..., 7
				E: function E(date) {
					return date.getDay() || 7
				},

				// ISO week: 1, 2, ..., 53
				W: function W(date) {
					return getISOWeek(date)
				},

				// ISO week: 01, 02, ..., 53
				WW: function WW(date) {
					return addLeadingZeros(getISOWeek(date), 2)
				},

				// Year: 00, 01, ..., 99
				YY: function YY(date) {
					return addLeadingZeros(date.getFullYear(), 4).substr(2)
				},

				// Year: 1900, 1901, ..., 2099
				YYYY: function YYYY(date) {
					return addLeadingZeros(date.getFullYear(), 4)
				},

				// ISO week-numbering year: 00, 01, ..., 99
				GG: function GG(date) {
					return String(getISOYear(date)).substr(2)
				},

				// ISO week-numbering year: 1900, 1901, ..., 2099
				GGGG: function GGGG(date) {
					return getISOYear(date)
				},

				// Hour: 0, 1, ... 23
				H: function H(date) {
					return date.getHours()
				},

				// Hour: 00, 01, ..., 23
				HH: function HH(date) {
					return addLeadingZeros(date.getHours(), 2)
				},

				// Hour: 1, 2, ..., 12
				h: function h(date) {
					var hours = date.getHours()
					if (hours === 0) {
						return 12
					} else if (hours > 12) {
						return hours % 12
					} else {
						return hours
					}
				},

				// Hour: 01, 02, ..., 12
				hh: function hh(date) {
					return addLeadingZeros(formatters['h'](date), 2)
				},

				// Minute: 0, 1, ..., 59
				m: function m(date) {
					return date.getMinutes()
				},

				// Minute: 00, 01, ..., 59
				mm: function mm(date) {
					return addLeadingZeros(date.getMinutes(), 2)
				},

				// Second: 0, 1, ..., 59
				s: function s(date) {
					return date.getSeconds()
				},

				// Second: 00, 01, ..., 59
				ss: function ss(date) {
					return addLeadingZeros(date.getSeconds(), 2)
				},

				// 1/10 of second: 0, 1, ..., 9
				S: function S(date) {
					return Math.floor(date.getMilliseconds() / 100)
				},

				// 1/100 of second: 00, 01, ..., 99
				SS: function SS(date) {
					return addLeadingZeros(Math.floor(date.getMilliseconds() / 10), 2)
				},

				// Millisecond: 000, 001, ..., 999
				SSS: function SSS(date) {
					return addLeadingZeros(date.getMilliseconds(), 3)
				},

				// Timezone: -01:00, +00:00, ... +12:00
				Z: function Z(date) {
					return formatTimezone(date.getTimezoneOffset(), ':')
				},

				// Timezone: -0100, +0000, ... +1200
				ZZ: function ZZ(date) {
					return formatTimezone(date.getTimezoneOffset())
				},

				// Seconds timestamp: 512969520
				X: function X(date) {
					return Math.floor(date.getTime() / 1000)
				},

				// Milliseconds timestamp: 512969520900
				x: function x(date) {
					return date.getTime()
				}
			}

			function buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp) {
				var array = formatStr.match(formattingTokensRegExp)
				var length = array.length

				var i
				var formatter
				for (i = 0; i < length; i++) {
					formatter = localeFormatters[array[i]] || formatters[array[i]]
					if (formatter) {
						array[i] = formatter
					} else {
						array[i] = removeFormattingTokens(array[i])
					}
				}

				return function(date) {
					var output = ''
					for (var i = 0; i < length; i++) {
						if (array[i] instanceof Function) {
							output += array[i](date, formatters)
						} else {
							output += array[i]
						}
					}
					return output
				}
			}

			function removeFormattingTokens(input) {
				if (input.match(/\[[\s\S]/)) {
					return input.replace(/^\[|]$/g, '')
				}
				return input.replace(/\\/g, '')
			}

			function formatTimezone(offset, delimeter) {
				delimeter = delimeter || ''
				var sign = offset > 0 ? '-' : '+'
				var absOffset = Math.abs(offset)
				var hours = Math.floor(absOffset / 60)
				var minutes = absOffset % 60
				return sign + addLeadingZeros(hours, 2) + delimeter + addLeadingZeros(minutes, 2)
			}

			function addLeadingZeros(number, targetLength) {
				var output = Math.abs(number).toString()
				while (output.length < targetLength) {
					output = '0' + output
				}
				return output
			}

			module.exports = format

			/***/
		},
		/* 25 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var parse = __webpack_require__(1)
			var startOfYear = __webpack_require__(35)
			var differenceInCalendarDays = __webpack_require__(23)

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
				var date = parse(dirtyDate)
				var diff = differenceInCalendarDays(date, startOfYear(date))
				var dayOfYear = diff + 1
				return dayOfYear
			}

			module.exports = getDayOfYear

			/***/
		},
		/* 26 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var parse = __webpack_require__(1)
			var startOfISOWeek = __webpack_require__(6)
			var startOfISOYear = __webpack_require__(33)

			var MILLISECONDS_IN_WEEK = 604800000

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
				var date = parse(dirtyDate)
				var diff = startOfISOWeek(date).getTime() - startOfISOYear(date).getTime()

				// Round the number of days to the nearest integer
				// because the number of milliseconds in a week is not constant
				// (e.g. it's different in the week of the daylight saving time clock shift)
				return Math.round(diff / MILLISECONDS_IN_WEEK) + 1
			}

			module.exports = getISOWeek

			/***/
		},
		/* 27 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var isDate = __webpack_require__(13)

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
					return !isNaN(dirtyDate)
				} else {
					throw new TypeError(toString.call(dirtyDate) + ' is not an instance of Date')
				}
			}

			module.exports = isValid

			/***/
		},
		/* 28 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var commonFormatterKeys = [
				'M',
				'MM',
				'Q',
				'D',
				'DD',
				'DDD',
				'DDDD',
				'd',
				'E',
				'W',
				'WW',
				'YY',
				'YYYY',
				'GG',
				'GGGG',
				'H',
				'HH',
				'h',
				'hh',
				'm',
				'mm',
				's',
				'ss',
				'S',
				'SS',
				'SSS',
				'Z',
				'ZZ',
				'X',
				'x'
			]

			function buildFormattingTokensRegExp(formatters) {
				var formatterKeys = []
				for (var key in formatters) {
					if (formatters.hasOwnProperty(key)) {
						formatterKeys.push(key)
					}
				}

				var formattingTokens = commonFormatterKeys.concat(formatterKeys).sort().reverse()
				var formattingTokensRegExp = new RegExp(
					'(\\[[^\\[]*\\])|(\\\\)?' + '(' + formattingTokens.join('|') + '|.)',
					'g'
				)

				return formattingTokensRegExp
			}

			module.exports = buildFormattingTokensRegExp

			/***/
		},
		/* 29 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

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
				}

				function localize(token, count, options) {
					options = options || {}

					var result
					if (typeof distanceInWordsLocale[token] === 'string') {
						result = distanceInWordsLocale[token]
					} else if (count === 1) {
						result = distanceInWordsLocale[token].one
					} else {
						result = distanceInWordsLocale[token].other.replace('{{count}}', count)
					}

					if (options.addSuffix) {
						if (options.comparison > 0) {
							return 'in ' + result
						} else {
							return result + ' ago'
						}
					}

					return result
				}

				return {
					localize: localize
				}
			}

			module.exports = buildDistanceInWordsLocale

			/***/
		},
		/* 30 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var buildFormattingTokensRegExp = __webpack_require__(28)

			function buildFormatLocale() {
				// Note: in English, the names of days of the week and months are capitalized.
				// If you are making a new locale based on this one, check if the same is true for the language you're working on.
				// Generally, formatted dates should look like they are in the middle of a sentence,
				// e.g. in Spanish language the weekdays and months should be in the lowercase.
				var months3char = [
					'Jan',
					'Feb',
					'Mar',
					'Apr',
					'May',
					'Jun',
					'Jul',
					'Aug',
					'Sep',
					'Oct',
					'Nov',
					'Dec'
				]
				var monthsFull = [
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December'
				]
				var weekdays2char = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
				var weekdays3char = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
				var weekdaysFull = [
					'Sunday',
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday'
				]
				var meridiemUppercase = ['AM', 'PM']
				var meridiemLowercase = ['am', 'pm']
				var meridiemFull = ['a.m.', 'p.m.']

				var formatters = {
					// Month: Jan, Feb, ..., Dec
					MMM: function MMM(date) {
						return months3char[date.getMonth()]
					},

					// Month: January, February, ..., December
					MMMM: function MMMM(date) {
						return monthsFull[date.getMonth()]
					},

					// Day of week: Su, Mo, ..., Sa
					dd: function dd(date) {
						return weekdays2char[date.getDay()]
					},

					// Day of week: Sun, Mon, ..., Sat
					ddd: function ddd(date) {
						return weekdays3char[date.getDay()]
					},

					// Day of week: Sunday, Monday, ..., Saturday
					dddd: function dddd(date) {
						return weekdaysFull[date.getDay()]
					},

					// AM, PM
					A: function A(date) {
						return date.getHours() / 12 >= 1 ? meridiemUppercase[1] : meridiemUppercase[0]
					},

					// am, pm
					a: function a(date) {
						return date.getHours() / 12 >= 1 ? meridiemLowercase[1] : meridiemLowercase[0]
					},

					// a.m., p.m.
					aa: function aa(date) {
						return date.getHours() / 12 >= 1 ? meridiemFull[1] : meridiemFull[0]
					}
				}

				// Generate ordinal version of formatters: M -> Mo, D -> Do, etc.
				var ordinalFormatters = ['M', 'D', 'DDD', 'd', 'Q', 'W']
				ordinalFormatters.forEach(function(formatterToken) {
					formatters[formatterToken + 'o'] = function(date, formatters) {
						return ordinal(formatters[formatterToken](date))
					}
				})

				return {
					formatters: formatters,
					formattingTokensRegExp: buildFormattingTokensRegExp(formatters)
				}
			}

			function ordinal(number) {
				var rem100 = number % 100
				if (rem100 > 20 || rem100 < 10) {
					switch (rem100 % 10) {
						case 1:
							return number + 'st'
						case 2:
							return number + 'nd'
						case 3:
							return number + 'rd'
					}
				}
				return number + 'th'
			}

			module.exports = buildFormatLocale

			/***/
		},
		/* 31 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var buildDistanceInWordsLocale = __webpack_require__(29)
			var buildFormatLocale = __webpack_require__(30)

			/**
 * @category Locales
 * @summary English locale.
 */
			module.exports = {
				distanceInWords: buildDistanceInWordsLocale(),
				format: buildFormatLocale()
			}

			/***/
		},
		/* 32 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var parse = __webpack_require__(1)

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
				var date = parse(dirtyDate)
				date.setHours(0, 0, 0, 0)
				return date
			}

			module.exports = startOfDay

			/***/
		},
		/* 33 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var getISOYear = __webpack_require__(12)
			var startOfISOWeek = __webpack_require__(6)

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
				var year = getISOYear(dirtyDate)
				var fourthOfJanuary = new Date(0)
				fourthOfJanuary.setFullYear(year, 0, 4)
				fourthOfJanuary.setHours(0, 0, 0, 0)
				var date = startOfISOWeek(fourthOfJanuary)
				return date
			}

			module.exports = startOfISOYear

			/***/
		},
		/* 34 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var parse = __webpack_require__(1)

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
				var weekStartsOn = dirtyOptions ? Number(dirtyOptions.weekStartsOn) || 0 : 0

				var date = parse(dirtyDate)
				var day = date.getDay()
				var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn

				date.setDate(date.getDate() - diff)
				date.setHours(0, 0, 0, 0)
				return date
			}

			module.exports = startOfWeek

			/***/
		},
		/* 35 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var parse = __webpack_require__(1)

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
				var cleanDate = parse(dirtyDate)
				var date = new Date(0)
				date.setFullYear(cleanDate.getFullYear(), 0, 1)
				date.setHours(0, 0, 0, 0)
				return date
			}

			module.exports = startOfYear

			/***/
		},
		/* 36 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'
			/* WEBPACK VAR INJECTION */ ;(function(process) {
				/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

				var _typeof =
					typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
						? function(obj) {
								return typeof obj
							}
						: function(obj) {
								return obj &&
								typeof Symbol === 'function' &&
								obj.constructor === Symbol &&
								obj !== Symbol.prototype
									? 'symbol'
									: typeof obj
							}

				if (process.env.NODE_ENV !== 'production') {
					var invariant = __webpack_require__(8)
					var warning = __webpack_require__(14)
					var ReactPropTypesSecret = __webpack_require__(9)
					var loggedTypeFailures = {}
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
								var error
								// Prop type validation may throw. In case they do, we don't want to
								// fail the render phase where it didn't fail before. So we log it.
								// After these have been cleaned up, we'll let them throw.
								try {
									// This is intentionally an invariant that gets caught. It's the same
									// behavior as without this statement except with a better message.
									invariant(
										typeof typeSpecs[typeSpecName] === 'function',
										'%s: %s type `%s` is invalid; it must be a function, usually from ' +
											'React.PropTypes.',
										componentName || 'React class',
										location,
										typeSpecName
									)
									error = typeSpecs[typeSpecName](
										values,
										typeSpecName,
										componentName,
										location,
										null,
										ReactPropTypesSecret
									)
								} catch (ex) {
									error = ex
								}
								warning(
									!error || error instanceof Error,
									'%s: type specification of %s `%s` is invalid; the type checker ' +
										'function must return `null` or an `Error` but returned a %s. ' +
										'You may have forgotten to pass an argument to the type checker ' +
										'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
										'shape all require an argument).',
									componentName || 'React class',
									location,
									typeSpecName,
									typeof error === 'undefined' ? 'undefined' : _typeof(error)
								)
								if (error instanceof Error && !(error.message in loggedTypeFailures)) {
									// Only monitor this failure once because there tends to be a lot of the
									// same error.
									loggedTypeFailures[error.message] = true

									var stack = getStack ? getStack() : ''

									warning(
										false,
										'Failed %s type: %s%s',
										location,
										error.message,
										stack != null ? stack : ''
									)
								}
							}
						}
					}
				}

				module.exports = checkPropTypes
				/* WEBPACK VAR INJECTION */
			}.call(exports, __webpack_require__(4)))

			/***/
		},
		/* 37 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'
			/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

			var emptyFunction = __webpack_require__(7)
			var invariant = __webpack_require__(8)
			var ReactPropTypesSecret = __webpack_require__(9)

			module.exports = function() {
				function shim(props, propName, componentName, location, propFullName, secret) {
					if (secret === ReactPropTypesSecret) {
						// It is still safe when called from React.
						return
					}
					invariant(
						false,
						'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
							'Use PropTypes.checkPropTypes() to call them. ' +
							'Read more at http://fb.me/use-check-prop-types'
					)
				}
				shim.isRequired = shim
				function getShim() {
					return shim
				}
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
					shape: getShim
				}

				ReactPropTypes.checkPropTypes = emptyFunction
				ReactPropTypes.PropTypes = ReactPropTypes

				return ReactPropTypes
			}

			/***/
		},
		/* 38 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'
			/* WEBPACK VAR INJECTION */ ;(function(process) {
				/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

				var _typeof =
					typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
						? function(obj) {
								return typeof obj
							}
						: function(obj) {
								return obj &&
								typeof Symbol === 'function' &&
								obj.constructor === Symbol &&
								obj !== Symbol.prototype
									? 'symbol'
									: typeof obj
							}

				var emptyFunction = __webpack_require__(7)
				var invariant = __webpack_require__(8)
				var warning = __webpack_require__(14)

				var ReactPropTypesSecret = __webpack_require__(9)
				var checkPropTypes = __webpack_require__(36)

				module.exports = function(isValidElement, throwOnDirectAccess) {
					/* global Symbol */
					var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator
					var FAUX_ITERATOR_SYMBOL = '@@iterator' // Before Symbol spec.

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
						var iteratorFn =
							maybeIterable &&
							((ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) ||
								maybeIterable[FAUX_ITERATOR_SYMBOL])
						if (typeof iteratorFn === 'function') {
							return iteratorFn
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

					var ANONYMOUS = '<<anonymous>>'

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
						shape: createShapeTypeChecker
					}

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
							return x !== 0 || 1 / x === 1 / y
						} else {
							// Step 6.a: NaN == NaN
							return x !== x && y !== y
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
						this.message = message
						this.stack = ''
					}
					// Make `instanceof Error` still work for returned errors.
					PropTypeError.prototype = Error.prototype

					function createChainableTypeChecker(validate) {
						if (process.env.NODE_ENV !== 'production') {
							var manualPropTypeCallCache = {}
							var manualPropTypeWarningCount = 0
						}
						function checkType(
							isRequired,
							props,
							propName,
							componentName,
							location,
							propFullName,
							secret
						) {
							componentName = componentName || ANONYMOUS
							propFullName = propFullName || propName

							if (secret !== ReactPropTypesSecret) {
								if (throwOnDirectAccess) {
									// New behavior only for users of `prop-types` package
									invariant(
										false,
										'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
											'Use `PropTypes.checkPropTypes()` to call them. ' +
											'Read more at http://fb.me/use-check-prop-types'
									)
								} else if (
									process.env.NODE_ENV !== 'production' &&
									typeof console !== 'undefined'
								) {
									// Old behavior for people using React.PropTypes
									var cacheKey = componentName + ':' + propName
									if (
										!manualPropTypeCallCache[cacheKey] &&
										// Avoid spamming the console because they are often not actionable except for lib authors
										manualPropTypeWarningCount < 3
									) {
										warning(
											false,
											'You are manually calling a React.PropTypes validation ' +
												'function for the `%s` prop on `%s`. This is deprecated ' +
												'and will throw in the standalone `prop-types` package. ' +
												'You may be seeing this warning due to a third-party PropTypes ' +
												'library. See https://fb.me/react-warning-dont-call-proptypes ' +
												'for details.',
											propFullName,
											componentName
										)
										manualPropTypeCallCache[cacheKey] = true
										manualPropTypeWarningCount++
									}
								}
							}
							if (props[propName] == null) {
								if (isRequired) {
									if (props[propName] === null) {
										return new PropTypeError(
											'The ' +
												location +
												' `' +
												propFullName +
												'` is marked as required ' +
												('in `' + componentName + '`, but its value is `null`.')
										)
									}
									return new PropTypeError(
										'The ' +
											location +
											' `' +
											propFullName +
											'` is marked as required in ' +
											('`' + componentName + '`, but its value is `undefined`.')
									)
								}
								return null
							} else {
								return validate(props, propName, componentName, location, propFullName)
							}
						}

						var chainedCheckType = checkType.bind(null, false)
						chainedCheckType.isRequired = checkType.bind(null, true)

						return chainedCheckType
					}

					function createPrimitiveTypeChecker(expectedType) {
						function validate(props, propName, componentName, location, propFullName, secret) {
							var propValue = props[propName]
							var propType = getPropType(propValue)
							if (propType !== expectedType) {
								// `propValue` being instance of, say, date/regexp, pass the 'object'
								// check, but we can offer a more precise error message here rather than
								// 'of type `object`'.
								var preciseType = getPreciseType(propValue)

								return new PropTypeError(
									'Invalid ' +
										location +
										' `' +
										propFullName +
										'` of type ' +
										('`' + preciseType + '` supplied to `' + componentName + '`, expected ') +
										('`' + expectedType + '`.')
								)
							}
							return null
						}
						return createChainableTypeChecker(validate)
					}

					function createAnyTypeChecker() {
						return createChainableTypeChecker(emptyFunction.thatReturnsNull)
					}

					function createArrayOfTypeChecker(typeChecker) {
						function validate(props, propName, componentName, location, propFullName) {
							if (typeof typeChecker !== 'function') {
								return new PropTypeError(
									'Property `' +
										propFullName +
										'` of component `' +
										componentName +
										'` has invalid PropType notation inside arrayOf.'
								)
							}
							var propValue = props[propName]
							if (!Array.isArray(propValue)) {
								var propType = getPropType(propValue)
								return new PropTypeError(
									'Invalid ' +
										location +
										' `' +
										propFullName +
										'` of type ' +
										('`' + propType + '` supplied to `' + componentName + '`, expected an array.')
								)
							}
							for (var i = 0; i < propValue.length; i++) {
								var error = typeChecker(
									propValue,
									i,
									componentName,
									location,
									propFullName + '[' + i + ']',
									ReactPropTypesSecret
								)
								if (error instanceof Error) {
									return error
								}
							}
							return null
						}
						return createChainableTypeChecker(validate)
					}

					function createElementTypeChecker() {
						function validate(props, propName, componentName, location, propFullName) {
							var propValue = props[propName]
							if (!isValidElement(propValue)) {
								var propType = getPropType(propValue)
								return new PropTypeError(
									'Invalid ' +
										location +
										' `' +
										propFullName +
										'` of type ' +
										('`' +
											propType +
											'` supplied to `' +
											componentName +
											'`, expected a single ReactElement.')
								)
							}
							return null
						}
						return createChainableTypeChecker(validate)
					}

					function createInstanceTypeChecker(expectedClass) {
						function validate(props, propName, componentName, location, propFullName) {
							if (!(props[propName] instanceof expectedClass)) {
								var expectedClassName = expectedClass.name || ANONYMOUS
								var actualClassName = getClassName(props[propName])
								return new PropTypeError(
									'Invalid ' +
										location +
										' `' +
										propFullName +
										'` of type ' +
										('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') +
										('instance of `' + expectedClassName + '`.')
								)
							}
							return null
						}
						return createChainableTypeChecker(validate)
					}

					function createEnumTypeChecker(expectedValues) {
						if (!Array.isArray(expectedValues)) {
							process.env.NODE_ENV !== 'production'
								? warning(
										false,
										'Invalid argument supplied to oneOf, expected an instance of array.'
									)
								: void 0
							return emptyFunction.thatReturnsNull
						}

						function validate(props, propName, componentName, location, propFullName) {
							var propValue = props[propName]
							for (var i = 0; i < expectedValues.length; i++) {
								if (is(propValue, expectedValues[i])) {
									return null
								}
							}

							var valuesString = JSON.stringify(expectedValues)
							return new PropTypeError(
								'Invalid ' +
									location +
									' `' +
									propFullName +
									'` of value `' +
									propValue +
									'` ' +
									('supplied to `' + componentName + '`, expected one of ' + valuesString + '.')
							)
						}
						return createChainableTypeChecker(validate)
					}

					function createObjectOfTypeChecker(typeChecker) {
						function validate(props, propName, componentName, location, propFullName) {
							if (typeof typeChecker !== 'function') {
								return new PropTypeError(
									'Property `' +
										propFullName +
										'` of component `' +
										componentName +
										'` has invalid PropType notation inside objectOf.'
								)
							}
							var propValue = props[propName]
							var propType = getPropType(propValue)
							if (propType !== 'object') {
								return new PropTypeError(
									'Invalid ' +
										location +
										' `' +
										propFullName +
										'` of type ' +
										('`' + propType + '` supplied to `' + componentName + '`, expected an object.')
								)
							}
							for (var key in propValue) {
								if (propValue.hasOwnProperty(key)) {
									var error = typeChecker(
										propValue,
										key,
										componentName,
										location,
										propFullName + '.' + key,
										ReactPropTypesSecret
									)
									if (error instanceof Error) {
										return error
									}
								}
							}
							return null
						}
						return createChainableTypeChecker(validate)
					}

					function createUnionTypeChecker(arrayOfTypeCheckers) {
						if (!Array.isArray(arrayOfTypeCheckers)) {
							process.env.NODE_ENV !== 'production'
								? warning(
										false,
										'Invalid argument supplied to oneOfType, expected an instance of array.'
									)
								: void 0
							return emptyFunction.thatReturnsNull
						}

						for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
							var checker = arrayOfTypeCheckers[i]
							if (typeof checker !== 'function') {
								warning(
									false,
									'Invalid argument supplid to oneOfType. Expected an array of check functions, but ' +
										'received %s at index %s.',
									getPostfixForTypeWarning(checker),
									i
								)
								return emptyFunction.thatReturnsNull
							}
						}

						function validate(props, propName, componentName, location, propFullName) {
							for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
								var checker = arrayOfTypeCheckers[i]
								if (
									checker(
										props,
										propName,
										componentName,
										location,
										propFullName,
										ReactPropTypesSecret
									) == null
								) {
									return null
								}
							}

							return new PropTypeError(
								'Invalid ' +
									location +
									' `' +
									propFullName +
									'` supplied to ' +
									('`' + componentName + '`.')
							)
						}
						return createChainableTypeChecker(validate)
					}

					function createNodeChecker() {
						function validate(props, propName, componentName, location, propFullName) {
							if (!isNode(props[propName])) {
								return new PropTypeError(
									'Invalid ' +
										location +
										' `' +
										propFullName +
										'` supplied to ' +
										('`' + componentName + '`, expected a ReactNode.')
								)
							}
							return null
						}
						return createChainableTypeChecker(validate)
					}

					function createShapeTypeChecker(shapeTypes) {
						function validate(props, propName, componentName, location, propFullName) {
							var propValue = props[propName]
							var propType = getPropType(propValue)
							if (propType !== 'object') {
								return new PropTypeError(
									'Invalid ' +
										location +
										' `' +
										propFullName +
										'` of type `' +
										propType +
										'` ' +
										('supplied to `' + componentName + '`, expected `object`.')
								)
							}
							for (var key in shapeTypes) {
								var checker = shapeTypes[key]
								if (!checker) {
									continue
								}
								var error = checker(
									propValue,
									key,
									componentName,
									location,
									propFullName + '.' + key,
									ReactPropTypesSecret
								)
								if (error) {
									return error
								}
							}
							return null
						}
						return createChainableTypeChecker(validate)
					}

					function isNode(propValue) {
						switch (typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) {
							case 'number':
							case 'string':
							case 'undefined':
								return true
							case 'boolean':
								return !propValue
							case 'object':
								if (Array.isArray(propValue)) {
									return propValue.every(isNode)
								}
								if (propValue === null || isValidElement(propValue)) {
									return true
								}

								var iteratorFn = getIteratorFn(propValue)
								if (iteratorFn) {
									var iterator = iteratorFn.call(propValue)
									var step
									if (iteratorFn !== propValue.entries) {
										while (!(step = iterator.next()).done) {
											if (!isNode(step.value)) {
												return false
											}
										}
									} else {
										// Iterator will provide entry [k,v] tuples rather than values.
										while (!(step = iterator.next()).done) {
											var entry = step.value
											if (entry) {
												if (!isNode(entry[1])) {
													return false
												}
											}
										}
									}
								} else {
									return false
								}

								return true
							default:
								return false
						}
					}

					function isSymbol(propType, propValue) {
						// Native Symbol.
						if (propType === 'symbol') {
							return true
						}

						// 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
						if (propValue['@@toStringTag'] === 'Symbol') {
							return true
						}

						// Fallback for non-spec compliant Symbols which are polyfilled.
						if (typeof Symbol === 'function' && propValue instanceof Symbol) {
							return true
						}

						return false
					}

					// Equivalent of `typeof` but with special handling for array and regexp.
					function getPropType(propValue) {
						var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)
						if (Array.isArray(propValue)) {
							return 'array'
						}
						if (propValue instanceof RegExp) {
							// Old webkits (at least until Android 4.0) return 'function' rather than
							// 'object' for typeof a RegExp. We'll normalize this here so that /bla/
							// passes PropTypes.object.
							return 'object'
						}
						if (isSymbol(propType, propValue)) {
							return 'symbol'
						}
						return propType
					}

					// This handles more types than `getPropType`. Only used for error messages.
					// See `createPrimitiveTypeChecker`.
					function getPreciseType(propValue) {
						if (typeof propValue === 'undefined' || propValue === null) {
							return '' + propValue
						}
						var propType = getPropType(propValue)
						if (propType === 'object') {
							if (propValue instanceof Date) {
								return 'date'
							} else if (propValue instanceof RegExp) {
								return 'regexp'
							}
						}
						return propType
					}

					// Returns a string that is postfixed to a warning about an invalid type.
					// For example, "undefined" or "of type array"
					function getPostfixForTypeWarning(value) {
						var type = getPreciseType(value)
						switch (type) {
							case 'array':
							case 'object':
								return 'an ' + type
							case 'boolean':
							case 'date':
							case 'regexp':
								return 'a ' + type
							default:
								return type
						}
					}

					// Returns class name of the object, if any.
					function getClassName(propValue) {
						if (!propValue.constructor || !propValue.constructor.name) {
							return ANONYMOUS
						}
						return propValue.constructor.name
					}

					ReactPropTypes.checkPropTypes = checkPropTypes
					ReactPropTypes.PropTypes = ReactPropTypes

					return ReactPropTypes
				}
				/* WEBPACK VAR INJECTION */
			}.call(exports, __webpack_require__(4)))

			/***/
		},
		/* 39 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'
			/* WEBPACK VAR INJECTION */ ;(function(process) {
				var _typeof =
					typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
						? function(obj) {
								return typeof obj
							}
						: function(obj) {
								return obj &&
								typeof Symbol === 'function' &&
								obj.constructor === Symbol &&
								obj !== Symbol.prototype
									? 'symbol'
									: typeof obj
							}

				/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

				if (process.env.NODE_ENV !== 'production') {
					var REACT_ELEMENT_TYPE =
						(typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) || 0xeac7

					var isValidElement = function isValidElement(object) {
						return (
							(typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' &&
							object !== null &&
							object.$$typeof === REACT_ELEMENT_TYPE
						)
					}

					// By explicitly using `prop-types` you are opting into new development behavior.
					// http://fb.me/prop-types-in-prod
					var throwOnDirectAccess = true
					module.exports = __webpack_require__(38)(isValidElement, throwOnDirectAccess)
				} else {
					// By explicitly using `prop-types` you are opting into new production behavior.
					// http://fb.me/prop-types-in-prod
					module.exports = __webpack_require__(37)()
				}
				/* WEBPACK VAR INJECTION */
			}.call(exports, __webpack_require__(4)))

			/***/
		},
		/* 40 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			var _typeof2 =
				typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
					? function(obj) {
							return typeof obj
						}
					: function(obj) {
							return obj &&
							typeof Symbol === 'function' &&
							obj.constructor === Symbol &&
							obj !== Symbol.prototype
								? 'symbol'
								: typeof obj
						}

			var _typeof =
				typeof Symbol === 'function' && _typeof2(Symbol.iterator) === 'symbol'
					? function(obj) {
							return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj)
						}
					: function(obj) {
							return obj &&
							typeof Symbol === 'function' &&
							obj.constructor === Symbol &&
							obj !== Symbol.prototype
								? 'symbol'
								: typeof obj === 'undefined' ? 'undefined' : _typeof2(obj)
						}

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _react = __webpack_require__(20)

			var _react2 = _interopRequireDefault(_react)

			var _propTypes = __webpack_require__(39)

			var _propTypes2 = _interopRequireDefault(_propTypes)

			var _format = __webpack_require__(24)

			var _format2 = _interopRequireDefault(_format)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call &&
				((typeof call === 'undefined' ? 'undefined' : _typeof2(call)) === 'object' ||
					typeof call === 'function')
					? call
					: self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' +
							(typeof superClass === 'undefined' ? 'undefined' : _typeof2(superClass))
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			} /**
   * React Idle Timer
   *
   * @author  Randy Lebeau
   * @class   IdleTimer
   *
   */

			var IdleTimer = (function(_Component) {
				_inherits(IdleTimer, _Component)

				function IdleTimer() {
					var _Object$getPrototypeO

					var _temp, _this, _ret

					_classCallCheck(this, IdleTimer)

					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key]
					}

					return (_ret = (
						(_temp = (
							(_this = _possibleConstructorReturn(
								this,
								(_Object$getPrototypeO = Object.getPrototypeOf(IdleTimer)).call.apply(
									_Object$getPrototypeO,
									[this].concat(args)
								)
							)),
							_this
						)),
						(_this.state = {
							idle: false,
							oldDate: +new Date(),
							lastActive: +new Date(),
							remaining: null,
							tId: null,
							pageX: null,
							pageY: null
						}),
						(_this._toggleIdleState = function() {
							// Set the state
							_this.setState({
								idle: !_this.state.idle
							})

							// Fire the appropriate action
							if (!_this.state.idle) _this.props.activeAction()
							else _this.props.idleAction()
						}),
						(_this._handleEvent = function(e) {
							// Already idle, ignore events
							if (_this.state.remaining) return

							// Mousemove event
							if (e.type === 'mousemove') {
								// if coord are same, it didn't move
								if (e.pageX === _this.state.pageX && e.pageY === _this.state.pageY) return
								// if coord don't exist how could it move
								if (typeof e.pageX === 'undefined' && typeof e.pageY === 'undefined') return
								// under 200 ms is hard to do, and you would have to stop, as continuous activity will bypass this
								var elapsed = +new Date() - _this.state.oldDate
								if (elapsed < 200) return
							}

							// clear any existing timeout
							clearTimeout(
								_this.state.tId

								// if the idle timer is enabled, flip
							)
							if (_this.state.idle) _this._toggleIdleState(e)

							_this.setState({
								lastActive: +new Date(), // store when user was last active
								pageX: e.pageX, // update mouse coord
								pageY: e.pageY,
								tId: setTimeout(
									_this._toggleIdleState,
									_this.props.timeout // set a new timeout
								)
							})
						}),
						(_this.reset = function() {
							// reset timers
							clearTimeout(_this.state.tId)

							// reset settings
							_this.setState({
								idle: false,
								oldDate: +new Date(),
								lastActive: _this.state.oldDate,
								remaining: null,
								tId: setTimeout(_this._toggleIdleState, _this.props.timeout)
							})
						}),
						(_this.pause = function() {
							// this is already paused
							if (_this.state.remaining !== null) return

							// clear any existing timeout
							clearTimeout(
								_this.state.tId

								// define how much is left on the timer
							)
							_this.setState({
								remaining: _this.props.timeout - (+new Date() - _this.state.oldDate)
							})
						}),
						(_this.resume = function() {
							// this isn't paused yet
							if (_this.state.remaining === null) return

							// start timer and clear remaining
							if (!_this.state.idle) {
								_this.setState({
									tId: setTimeout(_this._toggleIdleState, _this.state.remaining),
									remaining: null
								})
							}
						}),
						(_this.getRemainingTime = function() {
							// If idle there is no time remaining
							if (_this.state.idle) return 0

							// If its paused just return that
							if (_this.state.remaining != null) return _this.state.remaining

							// Determine remaining, if negative idle didn't finish flipping, just return 0
							var remaining = _this.props.timeout - (+new Date() - _this.state.lastActive)
							if (remaining < 0) remaining = 0

							// If this is paused return that number, else return current remaining
							return remaining
						}),
						(_this.getElapsedTime = function() {
							return +new Date() - _this.state.oldDate
						}),
						(_this.getLastActiveTime = function() {
							if (_this.props.format)
								return (0, _format2.default)(_this.state.lastActive, _this.props.format)
							return _this.state.lastActive
						}),
						(_this.isIdle = function() {
							return _this.state.idle
						}),
						_temp
					)), _possibleConstructorReturn(_this, _ret)
				}

				_createClass(IdleTimer, [
					{
						key: 'componentWillMount',
						value: function componentWillMount() {
							var _this2 = this

							this.props.events.forEach(function(e) {
								return _this2.props.element.addEventListener(e, _this2._handleEvent)
							})
						}
					},
					{
						key: 'componentDidMount',
						value: function componentDidMount() {
							if (this.props.startOnLoad) this.reset()
						}
					},
					{
						key: 'componentWillUnmount',
						value: function componentWillUnmount() {
							var _this3 = this

							// Clear timeout to prevent delayed state changes
							clearTimeout(this.state.tId)
							// Unbind all events
							this.props.events.forEach(function(e) {
								return _this3.props.element.removeEventListener(e, _this3._handleEvent)
							})
						}
					},
					{
						key: 'render',
						value: function render() {
							return this.props.children ? this.props.children : null
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

						/**
     * Event handler for supported event types
     *
     * @param  {Object} e event object
     * @return {void}
     *
     */

						////////////////
						// Public API //
						////////////////

						/**
     * Restore initial settings and restart timer
     *
     * @return {Void}
     *
     */

						/**
     * Store remaining time and stop timer.
     * You can pause from idle or active state.
     *
     * @return {Void}
     *
     */

						/**
     * Resumes a stopped timer
     *
     * @return {Void}
     *
     */

						/**
     * Time remaining before idle
     *
     * @return {Number} Milliseconds remaining
     *
     */

						/**
     * How much time has elapsed
     *
     * @return {Timestamp}
     *
     */

						/**
     * Last time the user was active
     *
     * @return {Timestamp}
     *
     */

						/**
     * Is the user idle
     *
     * @return {Boolean}
     *
     */
					}
				])

				return IdleTimer
			})(_react.Component)

			IdleTimer.propTypes = {
				timeout: _propTypes2.default.number, // Activity timeout
				events: _propTypes2.default.arrayOf(_propTypes2.default.string), // Activity events to bind
				idleAction: _propTypes2.default.func, // Action to call when user becomes inactive
				activeAction: _propTypes2.default.func, // Action to call when user becomes active
				element: _propTypes2.default.oneOfType([
					_propTypes2.default.object,
					_propTypes2.default.string
				]), // Element ref to watch activty on
				format: _propTypes2.default.string,
				startOnLoad: _propTypes2.default.bool
			}
			IdleTimer.defaultProps = {
				timeout: 1000 * 60 * 20, // 20 minutes
				events: [
					'mousemove',
					'keydown',
					'wheel',
					'DOMMouseScroll',
					'mouseWheel',
					'mousedown',
					'touchstart',
					'touchmove',
					'MSPointerDown',
					'MSPointerMove'
				],
				idleAction: function idleAction() {},
				activeAction: function activeAction() {},
				element:
					(typeof window === 'undefined'
						? 'undefined'
						: typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object'
						? document
						: {},
				startOnLoad: true
			}
			exports.default = IdleTimer

			/***/
		},
		/* 41 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			__webpack_require__(45)

			var _navUtil = __webpack_require__(2)

			var _navUtil2 = _interopRequireDefault(_navUtil)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var InlineNavButton = (function(_React$Component) {
				_inherits(InlineNavButton, _React$Component)

				function InlineNavButton() {
					_classCallCheck(this, InlineNavButton)

					return _possibleConstructorReturn(
						this,
						(InlineNavButton.__proto__ || Object.getPrototypeOf(InlineNavButton))
							.apply(this, arguments)
					)
				}

				_createClass(InlineNavButton, [
					{
						key: 'onClick',
						value: function onClick() {
							if (this.props.disabled) {
								return
							}

							switch (this.props.type) {
								case 'prev':
									return _navUtil2.default.goPrev()

								case 'next':
									return _navUtil2.default.goNext()
							}
						}
					},
					{
						key: 'render',
						value: function render() {
							return React.createElement(
								'div',
								{
									className:
										'viewer--components--inline-nav-button is-' +
										this.props.type +
										(this.props.disabled ? ' is-disabled' : ' is-enabled'),
									onClick: this.onClick.bind(this)
								},
								this.props.title
							)
						}
					}
				])

				return InlineNavButton
			})(React.Component)

			exports.default = InlineNavButton

			/***/
		},
		/* 42 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			__webpack_require__(47)

			var _navStore = __webpack_require__(10)

			var _navStore2 = _interopRequireDefault(_navStore)

			var _navUtil = __webpack_require__(2)

			var _navUtil2 = _interopRequireDefault(_navUtil)

			var _logo = __webpack_require__(15)

			var _logo2 = _interopRequireDefault(_logo)

			var _hamburger = __webpack_require__(51)

			var _hamburger2 = _interopRequireDefault(_hamburger)

			var _arrow = __webpack_require__(50)

			var _arrow2 = _interopRequireDefault(_arrow)

			var _lockIcon = __webpack_require__(52)

			var _lockIcon2 = _interopRequireDefault(_lockIcon)

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var getBackgroundImage = _Common2.default.util.getBackgroundImage
			var OboModel = _Common2.default.models.OboModel
			var StyleableText = _Common2.default.text.StyleableText
			var StyleableTextComponent = _Common2.default.text.StyleableTextComponent

			var Nav = (function(_React$Component) {
				_inherits(Nav, _React$Component)

				function Nav(props) {
					_classCallCheck(this, Nav)

					var _this = _possibleConstructorReturn(
						this,
						(Nav.__proto__ || Object.getPrototypeOf(Nav)).call(this, props)
					)

					_this.state = {
						hover: false
					}
					return _this
				}

				_createClass(Nav, [
					{
						key: 'onClick',
						value: function onClick(item) {
							if (item.type === 'link') {
								if (!_navUtil2.default.canNavigate(this.props.navState)) return
								return _navUtil2.default.gotoPath(item.fullPath)
							} else if (item.type === 'sub-link') {
								var el = OboModel.models[item.id].getDomEl()
								return el.scrollIntoView({ behavior: 'smooth' })
							}
						}
					},
					{
						key: 'hideNav',
						value: function hideNav() {
							return _navUtil2.default.toggle()
						}
					},
					{
						key: 'onMouseOver',
						value: function onMouseOver() {
							return this.setState({ hover: true })
						}
					},
					{
						key: 'onMouseOut',
						value: function onMouseOut() {
							return this.setState({ hover: false })
						}
					},
					{
						key: 'renderLabel',
						value: function renderLabel(label) {
							if (label instanceof StyleableText) {
								return React.createElement(StyleableTextComponent, { text: label })
							} else {
								return React.createElement('a', null, label)
							}
						}
					},
					{
						key: 'render',
						value: function render() {
							var _this2 = this

							var bg = void 0,
								lockEl = void 0
							if (this.props.navState.open || this.state.hover) {
								bg = getBackgroundImage(_arrow2.default)
							} else {
								bg = getBackgroundImage(_hamburger2.default)
							}

							if (this.props.navState.locked) {
								lockEl = React.createElement(
									'div',
									{ className: 'lock-icon' },
									React.createElement('img', { src: _lockIcon2.default })
								)
							} else {
								lockEl = null
							}

							var list = _navUtil2.default.getOrderedList(this.props.navState)

							return React.createElement(
								'div',
								{
									className:
										'viewer--components--nav' +
										(this.props.navState.locked ? ' is-locked' : ' is-unlocked') +
										(this.props.navState.open ? ' is-open' : ' is-closed') +
										(this.props.navState.disabled ? ' is-disabled' : ' is-enabled')
								},
								React.createElement(
									'button',
									{
										className: 'toggle-button',
										onClick: this.hideNav.bind(this),
										onMouseOver: this.onMouseOver.bind(this),
										onMouseOut: this.onMouseOut.bind(this),
										style: {
											backgroundImage: bg,
											transform:
												!this.props.navState.open && this.state.hover ? 'rotate(180deg)' : '',
											filter: this.props.navState.open ? 'invert(100%)' : 'invert(0%)'
										}
									},
									'Toggle Navigation Menu'
								),
								React.createElement(
									'ul',
									null,
									list.map(function(item, index) {
										switch (item.type) {
											case 'heading':
												var isSelected = false
												return React.createElement(
													'li',
													{
														key: index,
														className: 'heading' + (isSelected ? ' is-selected' : ' is-not-select')
													},
													_this2.renderLabel(item.label)
												)
												break

											case 'link':
												var isSelected = _this2.props.navState.navTargetId === item.id
												//var isPrevVisited = this.props.navState.navTargetHistory.indexOf(item.id) > -1
												return React.createElement(
													'li',
													{
														key: index,
														onClick: _this2.onClick.bind(_this2, item),
														className:
															'link' +
															(isSelected ? ' is-selected' : ' is-not-select') +
															(item.flags.visited ? ' is-visited' : ' is-not-visited') +
															(item.flags.complete ? ' is-complete' : ' is-not-complete') +
															(item.flags.correct ? ' is-correct' : ' is-not-correct')
													},
													_this2.renderLabel(item.label),
													lockEl
												)
												break

											case 'sub-link':
												var isSelected = _this2.props.navState.navTargetIndex === index

												return React.createElement(
													'li',
													{
														key: index,
														onClick: _this2.onClick.bind(_this2, item),
														className:
															'sub-link' +
															(isSelected ? ' is-selected' : ' is-not-select') +
															(item.flags.correct ? ' is-correct' : ' is-not-correct')
													},
													_this2.renderLabel(item.label),
													lockEl
												)
												break

											case 'seperator':
												return React.createElement(
													'li',
													{ key: index, className: 'seperator' },
													React.createElement('hr', null)
												)
												break
										}
									})
								),
								React.createElement(_logo2.default, { inverted: true })
							)
						}
					}
				])

				return Nav
			})(React.Component)

			exports.default = Nav

			/***/
		},
		/* 43 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			__webpack_require__(49)

			__webpack_require__(48)

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _react = __webpack_require__(20)

			var _react2 = _interopRequireDefault(_react)

			var _reactIdleTimer = __webpack_require__(40)

			var _reactIdleTimer2 = _interopRequireDefault(_reactIdleTimer)

			var _inlineNavButton = __webpack_require__(41)

			var _inlineNavButton2 = _interopRequireDefault(_inlineNavButton)

			var _navUtil = __webpack_require__(2)

			var _navUtil2 = _interopRequireDefault(_navUtil)

			var _apiUtil = __webpack_require__(3)

			var _apiUtil2 = _interopRequireDefault(_apiUtil)

			var _logo = __webpack_require__(15)

			var _logo2 = _interopRequireDefault(_logo)

			var _scoreStore = __webpack_require__(18)

			var _scoreStore2 = _interopRequireDefault(_scoreStore)

			var _questionStore = __webpack_require__(17)

			var _questionStore2 = _interopRequireDefault(_questionStore)

			var _assessmentStore = __webpack_require__(16)

			var _assessmentStore2 = _interopRequireDefault(_assessmentStore)

			var _navStore = __webpack_require__(10)

			var _navStore2 = _interopRequireDefault(_navStore)

			var _nav = __webpack_require__(42)

			var _nav2 = _interopRequireDefault(_nav)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var IDLE_TIMEOUT_DURATION_MS = 600000 // 10 minutes

			var Legacy = _Common2.default.models.Legacy
			var DOMUtil = _Common2.default.page.DOMUtil
			var Screen = _Common2.default.page.Screen
			var OboModel = _Common2.default.models.OboModel
			var Dispatcher = _Common2.default.flux.Dispatcher
			var ModalContainer = _Common2.default.components.ModalContainer
			var SimpleDialog = _Common2.default.components.modal.SimpleDialog
			var ModalUtil = _Common2.default.util.ModalUtil
			var FocusBlocker = _Common2.default.components.FocusBlocker
			var ModalStore = _Common2.default.stores.ModalStore
			var FocusStore = _Common2.default.stores.FocusStore
			var FocusUtil = _Common2.default.util.FocusUtil

			// Dispatcher.on 'all', (eventName, payload) -> console.log 'EVENT TRIGGERED', eventName

			Dispatcher.on('viewer:alert', function(payload) {
				return ModalUtil.show(
					_react2.default.createElement(
						SimpleDialog,
						{ ok: true, title: payload.value.title },
						payload.value.message
					)
				)
			})

			var ViewerApp = (function(_React$Component) {
				_inherits(ViewerApp, _React$Component)

				// === REACT LIFECYCLE METHODS ===

				function ViewerApp(props) {
					_classCallCheck(this, ViewerApp)

					var _this = _possibleConstructorReturn(
						this,
						(ViewerApp.__proto__ || Object.getPrototypeOf(ViewerApp)).call(this, props)
					)

					_Common2.default.Store.loadDependency(
						'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css'
					)

					Dispatcher.on('viewer:scrollTo', function(payload) {
						return (ReactDOM.findDOMNode(_this.refs.container).scrollTop = payload.value)
					})

					Dispatcher.on('viewer:scrollToTop', _this.scrollToTop.bind(_this))
					Dispatcher.on('getTextForVariable', _this.getTextForVariable.bind(_this))

					var state = {
						model: null,
						navState: null,
						scoreState: null,
						questionState: null,
						assessmentState: null,
						modalState: null,
						focusState: null,
						navTargetId: null,
						loading: true,
						requestStatus: 'unknown',
						isPreviewing: false
					}

					_this.onNavStoreChange = function() {
						return _this.setState({ navState: _navStore2.default.getState() })
					}
					_this.onScoreStoreChange = function() {
						return _this.setState({ scoreState: _scoreStore2.default.getState() })
					}
					_this.onQuestionStoreChange = function() {
						return _this.setState({ questionState: _questionStore2.default.getState() })
					}
					_this.onAssessmentStoreChange = function() {
						return _this.setState({ assessmentState: _assessmentStore2.default.getState() })
					}
					_this.onModalStoreChange = function() {
						return _this.setState({ modalState: ModalStore.getState() })
					}
					_this.onFocusStoreChange = function() {
						return _this.setState({ focusState: FocusStore.getState() })
					}

					_this.onIdle = _this.onIdle.bind(_this)
					_this.onReturnFromIdle = _this.onReturnFromIdle.bind(_this)
					_this.onWindowClose = _this.onWindowClose.bind(_this)
					_this.onVisibilityChange = _this.onVisibilityChange.bind(_this)

					_this.state = state
					return _this
				}

				_createClass(ViewerApp, [
					{
						key: 'componentDidMount',
						value: function componentDidMount() {
							var _this2 = this

							document.addEventListener('visibilitychange', this.onVisibilityChange)

							var visitIdFromApi = void 0
							var attemptHistory = void 0
							var isPreviewing = void 0

							var urlTokens = document.location.pathname.split('/')
							var visitIdFromUrl = urlTokens[4] ? urlTokens[4] : null
							var draftIdFromUrl = urlTokens[2] ? urlTokens[2] : null

							Dispatcher.trigger('viewer:loading')

							_apiUtil2.default
								.requestStart(visitIdFromUrl, draftIdFromUrl)
								.then(function(visit) {
									if (visit.status !== 'ok') throw 'Invalid Visit Id'
									visitIdFromApi = visit.value.visitId
									attemptHistory = visit.value.attemptHistory
									isPreviewing = visit.value.isPreviewing
									return _apiUtil2.default.getDraft(draftIdFromUrl)
								})
								.then(function(_ref) {
									var draftModel = _ref.value

									_this2.state.model = OboModel.create(draftModel)

									_scoreStore2.default.init()
									_questionStore2.default.init()
									ModalStore.init()
									FocusStore.init()
									_navStore2.default.init(
										_this2.state.model,
										_this2.state.model.modelState.start,
										window.location.pathname,
										visitIdFromApi
									)
									_assessmentStore2.default.init(attemptHistory)

									_this2.state.navState = _navStore2.default.getState()
									_this2.state.scoreState = _scoreStore2.default.getState()
									_this2.state.questionState = _questionStore2.default.getState()
									_this2.state.assessmentState = _assessmentStore2.default.getState()
									_this2.state.modalState = ModalStore.getState()
									_this2.state.focusState = FocusStore.getState()

									window.onbeforeunload = _this2.onWindowClose
									_this2.setState(
										{ loading: false, requestStatus: 'ok', isPreviewing: isPreviewing },
										function() {
											Dispatcher.trigger('viewer:loaded', true)
										}
									)
								})
								.catch(function(err) {
									console.log(err)
									_this2.setState({ loading: false, requestStatus: 'invalid' }, function() {
										return Dispatcher.trigger('viewer:loaded', false)
									})
								})
						}
					},
					{
						key: 'componentWillMount',
						value: function componentWillMount() {
							// === SET UP DATA STORES ===
							_navStore2.default.onChange(this.onNavStoreChange)
							_scoreStore2.default.onChange(this.onScoreStoreChange)
							_questionStore2.default.onChange(this.onQuestionStoreChange)
							_assessmentStore2.default.onChange(this.onAssessmentStoreChange)
							ModalStore.onChange(this.onModalStoreChange)
							FocusStore.onChange(this.onFocusStoreChange)
						}
					},
					{
						key: 'componentWillUnmount',
						value: function componentWillUnmount() {
							_navStore2.default.offChange(this.onNavStoreChange)
							_scoreStore2.default.offChange(this.onScoreStoreChange)
							_questionStore2.default.offChange(this.onQuestionStoreChange)
							_assessmentStore2.default.offChange(this.onAssessmentStoreChange)
							ModalStore.offChange(this.onModalStoreChange)
							FocusStore.offChange(this.onFocusStoreChange)

							document.removeEventListener('visibilitychange', this.onVisibilityChange)
						}
					},
					{
						key: 'shouldComponentUpdate',
						value: function shouldComponentUpdate(nextProps, nextState) {
							return !nextState.loading
						}
					},
					{
						key: 'componentWillUpdate',
						value: function componentWillUpdate(nextProps, nextState) {
							if (this.state.requestStatus === 'ok') {
								var navTargetId = this.state.navTargetId
								var nextNavTargetId = this.state.navState.navTargetId

								if (navTargetId !== nextNavTargetId) {
									this.needsScroll = true
									return this.setState({ navTargetId: nextNavTargetId })
								}
							}
						}
					},
					{
						key: 'componentDidUpdate',
						value: function componentDidUpdate() {
							if (this.state.requestStatus === 'ok') {
								if (this.lastCanNavigate !== _navUtil2.default.canNavigate(this.state.navState)) {
									this.needsScroll = true
								}
								this.lastCanNavigate = _navUtil2.default.canNavigate(this.state.navState)
								if (this.needsScroll != null) {
									this.scrollToTop()

									return delete this.needsScroll
								}
							}
						}
					},
					{
						key: 'onVisibilityChange',
						value: function onVisibilityChange(event) {
							var _this3 = this

							if (document.hidden) {
								_apiUtil2.default
									.postEvent(this.state.model, 'viewer:leave', '1.0.0', {})
									.then(function(res) {
										_this3.leaveEvent = res.value
									})
							} else {
								_apiUtil2.default.postEvent(this.state.model, 'viewer:return', '1.0.0', {
									relatedEventId: this.leaveEvent.id
								})
								delete this.leaveEvent
							}
						}
					},
					{
						key: 'getTextForVariable',
						value: function getTextForVariable(event, variable, textModel) {
							return (event.text = _Common2.default.Store.getTextForVariable(
								variable,
								textModel,
								this.state
							))
						}
					},
					{
						key: 'scrollToTop',
						value: function scrollToTop() {
							var el = ReactDOM.findDOMNode(this.refs.prev)
							var container = ReactDOM.findDOMNode(this.refs.container)

							if (!container) return

							if (el) {
								return (container.scrollTop = ReactDOM.findDOMNode(
									el
								).getBoundingClientRect().height)
							} else {
								return (container.scrollTop = 0)
							}
						}

						// === NON REACT LIFECYCLE METHODS ===
					},
					{
						key: 'update',
						value: function update(json) {
							try {
								var o = void 0
								return (o = JSON.parse(json))
							} catch (e) {
								alert('Error parsing JSON')
								this.setState({ model: this.state.model })
								return
							}
						}
					},
					{
						key: 'onBack',
						value: function onBack() {
							return _navUtil2.default.goPrev()
						}
					},
					{
						key: 'onNext',
						value: function onNext() {
							return _navUtil2.default.goNext()
						}
					},
					{
						key: 'onMouseDown',
						value: function onMouseDown(event) {
							if (this.state.focusState.focussedId == null) {
								return
							}
							if (
								!DOMUtil.findParentComponentIds(event.target).has(this.state.focusState.focussedId)
							) {
								return FocusUtil.unfocus()
							}
						}
					},
					{
						key: 'onScroll',
						value: function onScroll(event) {
							if (this.state.focusState.focussedId == null) {
								return
							}

							var component = FocusUtil.getFocussedComponent(this.state.focusState)
							if (component == null) {
								return
							}

							var el = component.getDomEl()
							if (!el) {
								return
							}

							if (!Screen.isElementVisible(el)) {
								return FocusUtil.unfocus()
							}
						}
					},
					{
						key: 'onIdle',
						value: function onIdle() {
							var _this4 = this

							this.lastActiveEpoch = this.refs.idleTimer.getLastActiveTime()

							_apiUtil2.default
								.postEvent(this.state.model, 'viewer:inactive', '1.0.0', {
									lastActiveTime: this.lastActiveEpoch,
									inactiveDuration: IDLE_TIMEOUT_DURATION_MS
								})
								.then(function(res) {
									_this4.inactiveEvent = res.value
								})
						}
					},
					{
						key: 'onReturnFromIdle',
						value: function onReturnFromIdle() {
							_apiUtil2.default.postEvent(this.state.model, 'viewer:returnFromInactive', '1.0.0', {
								lastActiveTime: this.lastActiveEpoch,
								inactiveDuration: Date.now() - this.lastActiveEpoch,
								relatedEventId: this.inactiveEvent.id
							})

							delete this.lastActiveEpoch
							delete this.inactiveEvent
						}
					},
					{
						key: 'onWindowClose',
						value: function onWindowClose(e) {
							_apiUtil2.default.postEvent(this.state.model, 'viewer:close', '1.0.0', {})
						}
					},
					{
						key: 'resetAssessments',
						value: function resetAssessments() {
							_assessmentStore2.default.init()
							_questionStore2.default.init()
							_scoreStore2.default.init()

							_assessmentStore2.default.triggerChange()
							_questionStore2.default.triggerChange()
							_scoreStore2.default.triggerChange()

							return ModalUtil.show(
								_react2.default.createElement(
									SimpleDialog,
									{ ok: true, width: '15em' },
									'Assessment attempts and all question responses have been reset.'
								)
							)
						}
					},
					{
						key: 'unlockNavigation',
						value: function unlockNavigation() {
							return _navUtil2.default.unlock()
						}
					},
					{
						key: 'render',
						value: function render() {
							// @TODO loading component
							if (this.state.loading == true) {
								return _react2.default.createElement(
									'div',
									{ className: 'is-loading' },
									'...Loading'
								)
							}

							if (this.state.requestStatus === 'invalid')
								return _react2.default.createElement('div', null, 'Invalid')

							var nextEl = void 0,
								nextModel = void 0,
								prevEl = void 0
							window.__lo = this.state.model
							window.__s = this.state

							var ModuleComponent = this.state.model.getComponentClass()

							var navTargetModel = _navUtil2.default.getNavTargetModel(this.state.navState)
							var navTargetTitle = '?'
							if (navTargetModel != null) {
								navTargetTitle = navTargetModel.title
							}

							var prevModel = (nextModel = null)
							if (_navUtil2.default.canNavigate(this.state.navState)) {
								prevModel = _navUtil2.default.getPrevModel(this.state.navState)
								if (prevModel) {
									prevEl = _react2.default.createElement(_inlineNavButton2.default, {
										ref: 'prev',
										type: 'prev',
										title: 'Back: ' + prevModel.title
									})
								} else {
									prevEl = _react2.default.createElement(_inlineNavButton2.default, {
										ref: 'prev',
										type: 'prev',
										title: 'Start of ' + this.state.model.title,
										disabled: true
									})
								}

								nextModel = _navUtil2.default.getNextModel(this.state.navState)
								if (nextModel) {
									nextEl = _react2.default.createElement(_inlineNavButton2.default, {
										ref: 'next',
										type: 'next',
										title: 'Next: ' + nextModel.title
									})
								} else {
									nextEl = _react2.default.createElement(_inlineNavButton2.default, {
										ref: 'next',
										type: 'next',
										title: 'End of ' + this.state.model.title,
										disabled: true
									})
								}
							}

							var modal = ModalUtil.getCurrentModal(this.state.modalState)

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
										className:
											'viewer--viewer-app' +
											(this.state.isPreviewing ? ' is-previewing' : ' is-not-previewing') +
											(this.state.navState.locked ? ' is-locked-nav' : ' is-unlocked-nav') +
											(this.state.navState.open ? ' is-open-nav' : ' is-closed-nav') +
											(this.state.navState.disabled ? ' is-disabled-nav' : ' is-enabled-nav') +
											' is-focus-state-' +
											this.state.focusState.viewState
									},
									_react2.default.createElement(
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
									_react2.default.createElement(_nav2.default, { navState: this.state.navState }),
									prevEl,
									_react2.default.createElement(ModuleComponent, {
										model: this.state.model,
										moduleData: this.state
									}),
									nextEl,
									this.state.isPreviewing
										? _react2.default.createElement(
												'div',
												{ className: 'preview-banner' },
												_react2.default.createElement(
													'span',
													null,
													'You are previewing this object - Assessments will not be counted'
												),
												_react2.default.createElement(
													'div',
													{ className: 'controls' },
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
														{ onClick: this.resetAssessments.bind(this) },
														'Reset assessments & questions'
													)
												)
											)
										: null,
									_react2.default.createElement(FocusBlocker, { moduleData: this.state }),
									modal ? _react2.default.createElement(ModalContainer, null, modal) : null
								)
							)
						}
					}
				])

				return ViewerApp
			})(_react2.default.Component)

			exports.default = ViewerApp

			/***/
		},
		/* 44 */
		/***/ function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _viewerApp = __webpack_require__(43)

			var _viewerApp2 = _interopRequireDefault(_viewerApp)

			var _scoreStore = __webpack_require__(18)

			var _scoreStore2 = _interopRequireDefault(_scoreStore)

			var _assessmentStore = __webpack_require__(16)

			var _assessmentStore2 = _interopRequireDefault(_assessmentStore)

			var _navStore = __webpack_require__(10)

			var _navStore2 = _interopRequireDefault(_navStore)

			var _questionStore = __webpack_require__(17)

			var _questionStore2 = _interopRequireDefault(_questionStore)

			var _assessmentUtil = __webpack_require__(19)

			var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil)

			var _navUtil = __webpack_require__(2)

			var _navUtil2 = _interopRequireDefault(_navUtil)

			var _scoreUtil = __webpack_require__(11)

			var _scoreUtil2 = _interopRequireDefault(_scoreUtil)

			var _apiUtil = __webpack_require__(3)

			var _apiUtil2 = _interopRequireDefault(_apiUtil)

			var _questionUtil = __webpack_require__(5)

			var _questionUtil2 = _interopRequireDefault(_questionUtil)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			exports.default = {
				components: {
					ViewerApp: _viewerApp2.default
				},

				stores: {
					ScoreStore: _scoreStore2.default,
					AssessmentStore: _assessmentStore2.default,
					NavStore: _navStore2.default,
					QuestionStore: _questionStore2.default
				},

				util: {
					AssessmentUtil: _assessmentUtil2.default,
					NavUtil: _navUtil2.default,
					ScoreUtil: _scoreUtil2.default,
					APIUtil: _apiUtil2.default,
					QuestionUtil: _questionUtil2.default
				}
			}

			/***/
		},
		/* 45 */
		/***/ function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},
		/* 46 */
		/***/ function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},
		/* 47 */
		/***/ function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},
		/* 48 */
		/***/ function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},
		/* 49 */
		/***/ function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},
		/* 50 */
		/***/ function(module, exports) {
			module.exports =
				"data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='-290 387 30 20' style='enable-background:new -290 387 30 20;' xml:space='preserve'%3E %3Cpath d='M-272.5,405.4l-12.1-7.4c-0.6-0.4-0.6-1.7,0-2.1l12.1-7.4c0.5-0.3,1,0.3,1,1.1v14.7C-271.4,405.2-272,405.7-272.5,405.4z' fill='rgba(0, 0, 0, .2)' transform='translate(2, 0)'/%3E %3C/svg%3E"

			/***/
		},
		/* 51 */
		/***/ function(module, exports) {
			module.exports =
				"data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E %3Cline x1='0' y1='10' x2='100' y2='10' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3Cline x1='0' y1='50' x2='100' y2='50' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3Cline x1='0' y1='90' x2='100' y2='90' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3C/svg%3E"

			/***/
		},
		/* 52 */
		/***/ function(module, exports) {
			module.exports =
				"data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E %3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 10 16' style='enable-background:new 0 0 10 16;' xml:space='preserve'%3E %3Cpath fill='white' id='XMLID_6_' d='M9.1,6H8.5V3.5C8.5,1.5,6.9,0,5,0C3.1,0,1.6,1.5,1.6,3.5l0,2.5H0.9C0.4,6,0,6.4,0,6.9v8.2 C0,15.6,0.4,16,0.9,16h8.2c0.5,0,0.9-0.4,0.9-0.9V6.9C10,6.4,9.6,6,9.1,6z M3.3,3.4c0-0.9,0.8-1.6,1.7-1.6c0.9,0,1.7,0.8,1.7,1.7V6 H3.3V3.4z'/%3E %3C/svg%3E"

			/***/
		},
		/* 53 */
		/***/ function(module, exports) {
			module.exports =
				"data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 15.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E %3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='253px' height='64.577px' viewBox='0 0 253 64.577' enable-background='new 0 0 253 64.577' xml:space='preserve' fill='black'%3E %3Cpath d='M18.399,53.629c-0.01,0-0.021,0-0.031,0C7.023,53.396,0,43.151,0,33.793c0-10.79,8.426-19.905,18.399-19.905 c11.006,0,18.399,10.292,18.399,19.905c0,10.719-8.239,19.617-18.367,19.835C18.421,53.629,18.41,53.629,18.399,53.629z M18.399,18.257c-8.393,0-14.031,8.033-14.031,15.536c0.295,7.574,5.625,15.468,14.031,15.468c8.393,0,14.031-7.998,14.031-15.468 C32.43,25.372,26.005,18.257,18.399,18.257z'/%3E %3Cpath d='M58.15,53.629c-6.02,0-13.502-3.57-16.154-10.394c-0.287-0.733-0.603-1.542-0.603-3.281l0-38.454 c0-0.398,0.158-0.779,0.439-1.061S42.495,0,42.893,0h1.369c0.829,0,1.5,0.671,1.5,1.5v18.495c3.827-4.056,8.188-6.106,13.004-6.106 c11.111,0,17.989,10.332,17.989,19.905C76.444,44.75,68.099,53.629,58.15,53.629z M45.761,27.446v12.437 c0,4.652,7.208,9.378,12.389,9.378c8.516,0,14.236-7.998,14.236-15.468c0-7.472-5.208-15.536-13.621-15.536 C51.235,18.257,47.065,24.927,45.761,27.446z'/%3E %3Cpath d='M99.064,53.629c-0.01,0-0.021,0-0.031,0c-11.346-0.233-18.369-10.478-18.369-19.835 c0-10.79,8.426-19.905,18.399-19.905c11.005,0,18.398,10.292,18.398,19.905c0,10.719-8.239,19.617-18.366,19.835 C99.086,53.629,99.075,53.629,99.064,53.629z M99.064,18.257c-8.393,0-14.031,8.033-14.031,15.536 c0.294,7.574,5.624,15.468,14.031,15.468c8.393,0,14.031-7.998,14.031-15.468C113.096,25.372,106.67,18.257,99.064,18.257z'/%3E %3Cpath d='M153.252,53.629c-0.01,0-0.021,0-0.031,0c-11.346-0.233-18.369-10.478-18.369-19.835 c0-10.79,8.426-19.905,18.399-19.905c11.006,0,18.399,10.292,18.399,19.905c0,10.719-8.239,19.617-18.367,19.835 C153.273,53.629,153.263,53.629,153.252,53.629z M153.252,18.257c-8.393,0-14.031,8.033-14.031,15.536 c0.294,7.574,5.624,15.468,14.031,15.468c8.393,0,14.031-7.998,14.031-15.468C167.283,25.372,160.858,18.257,153.252,18.257z'/%3E %3Cpath d='M234.601,53.629c-0.01,0-0.021,0-0.031,0c-11.345-0.233-18.367-10.478-18.367-19.835 c0-10.79,8.426-19.905,18.398-19.905c11.006,0,18.399,10.292,18.399,19.905c0,10.719-8.239,19.617-18.367,19.835 C234.622,53.629,234.611,53.629,234.601,53.629z M234.601,18.257c-8.393,0-14.03,8.033-14.03,15.536 c0.294,7.574,5.624,15.468,14.03,15.468c8.394,0,14.031-7.998,14.031-15.468C248.632,25.372,242.206,18.257,234.601,18.257z'/%3E %3Cpath d='M193.62,53.629c-6.021,0-13.503-3.57-16.155-10.394l-0.098-0.239c-0.254-0.607-0.603-1.438-0.603-3.042 c0.002-15.911,0.098-38.237,0.099-38.461c0.003-0.826,0.674-1.494,1.5-1.494h1.368c0.829,0,1.5,0.671,1.5,1.5v18.495 c3.827-4.055,8.188-6.106,13.005-6.106c11.111,0,17.988,10.332,17.988,19.904C211.915,44.75,203.569,53.629,193.62,53.629z M181.231,27.446v12.437c0,4.652,7.208,9.378,12.389,9.378c8.515,0,14.235-7.998,14.235-15.468c0-7.472-5.207-15.536-13.619-15.536 C186.705,18.257,182.535,24.927,181.231,27.446z'/%3E %3Cpath d='M118.017,64.577c-0.013,0-0.026,0-0.039,0c-2.437-0.063-5.533-0.434-7.865-2.765 c-0.308-0.308-0.467-0.734-0.436-1.167c0.031-0.434,0.249-0.833,0.597-1.094l1.096-0.821c0.566-0.425,1.353-0.396,1.887,0.072 c1.083,0.947,2.617,1.408,4.691,1.408c2.913,0,6.3-2.752,6.3-6.3V16.073c0-0.829,0.671-1.5,1.5-1.5h1.368c0.829,0,1.5,0.671,1.5,1.5 v37.835C128.616,60.195,123.03,64.577,118.017,64.577z M127.116,8.268h-1.368c-0.829,0-1.5-0.671-1.5-1.5V2.389 c0-0.829,0.671-1.5,1.5-1.5h1.368c0.829,0,1.5,0.671,1.5,1.5v4.379C128.616,7.597,127.945,8.268,127.116,8.268z'/%3E %3C/svg%3E"

			/***/
		},
		/* 54 */
		/***/ function(module, exports, __webpack_require__) {
			__webpack_require__(21)
			module.exports = __webpack_require__(22)

			/***/
		}
		/******/
	]
)
