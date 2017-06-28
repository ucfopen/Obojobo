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
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
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


	// getNavItemForModel: (state, model) ->
	// 	state.itemsById[model.get('id')]

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
	canNavigate: function canNavigate(state) {
		return !state.locked;
	},
	getOrderedList: function getOrderedList(state) {
		return getFlatList(state.items);
	}
};

exports.default = NavUtil;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var createParsedJsonPromise = function createParsedJsonPromise(promise) {
	var jsonPromise = new Promise(function (resolve, reject) {
		return promise.then(function (res) {
			return res.json();
		}).then(function (json) {
			//@TODO - Only do on dev???
			if (json.status === 'error') {
				console.error(json.value);
			}
			return resolve(json);
		}).catch(function (error) {
			return reject(error);
		});
	});

	return jsonPromise;
};

var APIUtil = {
	get: function get(endpoint) {
		return fetch(endpoint, {
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			} //@TODO - Do I need this?
		});
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
	postEvent: function postEvent(lo, eventAction, eventPayload) {
		return createParsedJsonPromise(APIUtil.post('/api/events', {
			event: {
				action: eventAction,
				draft_id: lo.get('_id'),
				// draft_rev: lo.get('_rev')
				actor_time: new Date().toISOString(),
				payload: eventPayload
			}
		}));
	},
	saveState: function saveState(lo, state) {
		return APIUtil.postEvent(lo, 'saveState', state);
	},
	fetchDraft: function fetchDraft(id) {
		return createParsedJsonPromise(fetch('/api/drafts/' + id));
	},
	getAttempts: function getAttempts(lo) {
		return createParsedJsonPromise(APIUtil.get('/api/drafts/' + lo.get('_id') + '/attempts'));
	},
	startAttempt: function startAttempt(lo, assessment, questions) {
		return createParsedJsonPromise(APIUtil.post('/api/assessments/attempt/start', {
			draftId: lo.get('_id'),
			assessmentId: assessment.get('id'),
			actor: 4,
			questions: '@TODO'
		}));
	},
	endAttempt: function endAttempt(attempt) {
		return createParsedJsonPromise(APIUtil.post('/api/assessments/attempt/' + attempt.attemptId + '/end'));
	}
};

// recordQuestionResponse: (attempt, question, response) ->
// 	console.clear()
// 	console.log arguments
// 	createParsedJsonPromise APIUtil.post "/api/assessments/attempt/#{attempt.id}/question/#{question.get('id')}", {
// 		response: response
// 	}

exports.default = APIUtil;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _navUtil = __webpack_require__(1);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _apiUtil = __webpack_require__(2);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _Common2.default.flux.Store;
var Dispatcher = _Common2.default.flux.Dispatcher;
var OboModel = _Common2.default.models.OboModel;

var NavStore = function (_Store) {
	_inherits(NavStore, _Store);

	function NavStore() {
		_classCallCheck(this, NavStore);

		var item = void 0,
		    oldNavTargetId = void 0;

		var _this = _possibleConstructorReturn(this, (NavStore.__proto__ || Object.getPrototypeOf(NavStore)).call(this, 'navstore'));

		Dispatcher.on({
			'nav:rebuildMenu': function navRebuildMenu(payload) {
				_this.buildMenu(payload.value.model);
				return _this.triggerChange();
			},
			'nav:gotoPath': function navGotoPath(payload) {
				oldNavTargetId = _this.state.navTargetId;
				if (_this.gotoItem(_this.state.itemsByPath[payload.value.path])) {
					return _apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:gotoPath', {
						from: oldNavTargetId,
						to: _this.state.itemsByPath[payload.value.path].id
					});
				}
			},
			'nav:setFlag': function navSetFlag(payload) {
				var navItem = this.state.itemsById[payload.value.id];
				navItem.flags[payload.value.flagName] = payload.value.flagValue;

				return this.triggerChange();
			},

			'nav:prev': function navPrev(payload) {
				oldNavTargetId = _this.state.navTargetId;
				var prev = _navUtil2.default.getPrev(_this.state);
				if (_this.gotoItem(prev)) {
					return _apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:prev', {
						from: oldNavTargetId,
						to: prev.id
					});
				}
			},
			'nav:next': function navNext(payload) {
				oldNavTargetId = _this.state.navTargetId;
				var next = _navUtil2.default.getNext(_this.state);
				if (_this.gotoItem(next)) {
					return _apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:next', {
						from: oldNavTargetId,
						to: next.id
					});
				}
			},
			'nav:goto': function navGoto(payload) {
				oldNavTargetId = _this.state.navTargetId;
				if (_this.gotoItem(_this.state.itemsById[payload.value.id])) {
					return _apiUtil2.default.postEvent(OboModel.getRoot(), 'nav:goto', {
						from: oldNavTargetId,
						to: _this.state.itemsById[payload.value.id].id
					});
				}
			},
			'nav:lock': function navLock(payload) {
				return _this.setAndTrigger({ locked: true });
			},
			'nav:unlock': function navUnlock(payload) {
				return _this.setAndTrigger({ locked: false });
			},
			'nav:close': function navClose(payload) {
				return _this.setAndTrigger({ open: false });
			},
			'nav:open': function navOpen(payload) {
				return _this.setAndTrigger({ open: true });
			},
			'nav:toggle': function navToggle(payload) {
				return _this.setAndTrigger({ open: !_this.state.open });
			},
			'nav:openExternalLink': function navOpenExternalLink(payload) {
				window.open(payload.value.url);
				return _this.triggerChange();
			},
			'nav:showChildren': function navShowChildren(payload) {
				item = _this.state.itemsById[payload.value.id];
				item.showChildren = true;
				return _this.triggerChange();
			},
			'nav:hideChildren': function navHideChildren(payload) {
				item = _this.state.itemsById[payload.value.id];
				item.showChildren = false;
				return _this.triggerChange();
			},
			'score:set': function scoreSet(payload) {
				var navItem = _this.state.itemsById[payload.value.id];
				if (!navItem) {
					return;
				}

				return _navUtil2.default.setFlag(payload.value.id, 'correct', payload.value.score === 100);
			}
		}, _this);
		return _this;
	}

	_createClass(NavStore, [{
		key: 'init',
		value: function init(model, startingId, startingPath) {
			this.state = {
				items: {},
				itemsById: {},
				itemsByPath: {},
				itemsByFullPath: {},
				navTargetHistory: [],
				navTargetId: null,
				locked: false,
				open: true
			};

			this.buildMenu(model);
			// console.clear()
			// console.log @state.items
			// debugger
			_navUtil2.default.gotoPath(startingPath);

			if (startingId != null) {
				return _navUtil2.default.goto(startingId);
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

				var navTargetModel = __guard__(_navUtil2.default.getNavTargetModel(this.state), function (x) {
					return x.processTrigger('onNavExit');
				});
				this.state.navTargetHistory.push(this.state.navTargetId);
				this.state.itemsById[this.state.navTargetId].showChildren = false;
			}

			if (navItem.showChildrenOnNavigation) {
				navItem.showChildren = true;
			}
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
					childNavItem.fullFlatPath = ['/view', model.getRoot().get('_id'), flatPath].join('/');
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
	}, {
		key: '_clearFlags',
		value: function _clearFlags() {
			return Array.from(this.state.items).map(function (item) {
				return item.flags.complete = false;
			});
		}
	}]);

	return NavStore;
}(Store);

var navStore = new NavStore();
window.__ns = navStore;
exports.default = navStore;


function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 4 */
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
	recordResponse: function recordResponse(id, response) {
		return Dispatcher.trigger('question:recordResponse', {
			value: {
				id: id,
				response: response
			}
		});
	},
	resetResponse: function resetResponse(id) {
		return Dispatcher.trigger('question:resetResponse', {
			value: {
				id: id
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
	getResponse: function getResponse(state, model) {
		return state.responses[model.get('id')];
	},
	hasResponse: function hasResponse(state, model) {
		return typeof state.responses[model.get('id')] !== 'undefined';
	},
	getData: function getData(state, model, key) {
		return state.data[model.get('id') + ':' + key];
	}
};

exports.default = QuestionUtil;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(18);

var _navUtil = __webpack_require__(1);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _obojoboLogo = __webpack_require__(25);

var _obojoboLogo2 = _interopRequireDefault(_obojoboLogo);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getBackgroundImage = _Common2.default.util.getBackgroundImage;

var Logo = function (_React$Component) {
	_inherits(Logo, _React$Component);

	function Logo() {
		_classCallCheck(this, Logo);

		return _possibleConstructorReturn(this, (Logo.__proto__ || Object.getPrototypeOf(Logo)).apply(this, arguments));
	}

	_createClass(Logo, [{
		key: 'render',
		value: function render() {
			var bg = getBackgroundImage(_obojoboLogo2.default);

			return React.createElement(
				'div',
				{
					className: 'viewer--components--logo' + (this.props.inverted ? ' is-inverted' : ' is-not-inverted'),
					style: {
						backgroundImage: bg
					}
				},
				'Obojobo'
			);
		}
	}]);

	return Logo;
}(React.Component);

exports.default = Logo;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _assessmentUtil = __webpack_require__(9);

var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil);

var _scoreUtil = __webpack_require__(10);

var _scoreUtil2 = _interopRequireDefault(_scoreUtil);

var _questionUtil = __webpack_require__(4);

var _questionUtil2 = _interopRequireDefault(_questionUtil);

var _apiUtil = __webpack_require__(2);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

var _navUtil = __webpack_require__(1);

var _navUtil2 = _interopRequireDefault(_navUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _Common2.default.flux.Store;
var Dispatcher = _Common2.default.flux.Dispatcher;
var OboModel = _Common2.default.models.OboModel;
var ErrorUtil = _Common2.default.util.ErrorUtil;
var SimpleDialog = _Common2.default.components.modal.SimpleDialog;
var ModalUtil = _Common2.default.util.ModalUtil;


var getNewAssessmentObject = function getNewAssessmentObject() {
	return {
		current: null,
		currentResponses: [],
		attempts: []
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
			_this.tryEndAttempt(payload.value.id);
		});

		Dispatcher.on('question:recordResponse', function (payload) {
			_this.tryRecordResponse(payload.value.id, payload.value.response);
		});
		return _this;
	}

	_createClass(AssessmentStore, [{
		key: 'init',
		value: function init(history) {
			var question = void 0;
			if (history == null) {
				history = [];
			}
			this.state = {
				assessments: {}
			};

			history.sort(function (a, b) {
				return new Date(a.startTime).getTime() > new Date(b.startTime).getTime();
			});

			var unfinishedAttempt = null;
			var nonExistantQuestions = [];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(history)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var attempt = _step.value;

					if (!this.state.assessments[attempt.assessmentId]) {
						this.state.assessments[attempt.assessmentId] = getNewAssessmentObject();
					}

					if (!attempt.endTime) {
						// @state.assessments[attempt.assessmentId].current = attempt
						unfinishedAttempt = attempt;
					} else {
						this.state.assessments[attempt.assessmentId].attempts.push(attempt);
					}

					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = Array.from(attempt.state.questions)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							question = _step3.value;

							if (!OboModel.models[question.id]) {
								nonExistantQuestions.push(question);
							}
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}
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

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Array.from(nonExistantQuestions)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					question = _step2.value;

					OboModel.create(question);
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
				));
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
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Array.from(startAttemptResp.state.questions)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var child = _step4.value;

					var c = OboModel.create(child);
					model.children.at(1).children.add(c);
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			if (!this.state.assessments[id]) {
				this.state.assessments[id] = getNewAssessmentObject();
			}

			this.state.assessments[id].current = startAttemptResp;

			_navUtil2.default.rebuildMenu(model.getRoot());
			_navUtil2.default.goto(id);

			model.processTrigger('onStartAttempt');
			Dispatcher.trigger('assessment:attemptStarted', id);
		}
	}, {
		key: 'tryEndAttempt',
		value: function tryEndAttempt(id) {
			var _this3 = this;

			var model = OboModel.models[id];
			var assessment = this.state.assessments[id];

			return _apiUtil2.default.endAttempt(assessment.current).then(function (res) {
				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res);
				}

				_this3.endAttempt(res.value);
				return _this3.triggerChange();
			}).catch(function (e) {
				console.error(e);
			});
		}
	}, {
		key: 'endAttempt',
		value: function endAttempt(endAttemptResp) {
			var id = endAttemptResp.assessmentId;
			var assessment = this.state.assessments[id];
			var model = OboModel.models[id];

			assessment.current.state.questions.forEach(function (question) {
				return _questionUtil2.default.hideQuestion(question.id);
			});
			assessment.currentResponses.forEach(function (responderId) {
				return _questionUtil2.default.resetResponse(responderId);
			});
			assessment.attempts.push(endAttemptResp);
			assessment.current = null;

			model.processTrigger('onEndAttempt');
			Dispatcher.trigger('assessment:attemptEnded', id);
		}
	}, {
		key: 'tryRecordResponse',
		value: function tryRecordResponse(id, response) {
			var _this4 = this;

			var model = OboModel.models[id];
			var assessment = _assessmentUtil2.default.getAssessmentForModel(this.state, model);

			if (!assessment) return;

			if (assessment.currentResponses) {
				assessment.currentResponses.push(id);
			}

			if (!assessment.currentResponses) return;

			var questionModel = model.getParentOfType('ObojoboDraft.Chunks.Question');

			return _apiUtil2.default.postEvent(model.getRoot(), 'assessment:recordResponse', {
				attemptId: assessment.current.attemptId,
				questionId: questionModel.get('id'),
				responderId: id,
				response: response
			}).then(function (res) {
				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res);
				}
				_this4.triggerChange();
			});
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _apiUtil = __webpack_require__(2);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _Common2.default.flux.Store;
var Dispatcher = _Common2.default.flux.Dispatcher;
var OboModel = _Common2.default.models.OboModel;

var QuestionStore = function (_Store) {
	_inherits(QuestionStore, _Store);

	function QuestionStore() {
		_classCallCheck(this, QuestionStore);

		var id = void 0;

		var _this = _possibleConstructorReturn(this, (QuestionStore.__proto__ || Object.getPrototypeOf(QuestionStore)).call(this, 'questionStore'));

		Dispatcher.on({
			'question:recordResponse': function questionRecordResponse(payload) {
				;id = payload.value.id;

				var model = OboModel.models[id];

				_this.state.responses[id] = payload.value.response;
				_this.triggerChange();

				var questionModel = model.getParentOfType('ObojoboDraft.Chunks.Question');
				return _apiUtil2.default.postEvent(questionModel.getRoot(), 'question:recordResponse', {
					questionId: questionModel.get('id'),
					responderId: id,
					response: payload.value.response
				});
			},

			'question:resetResponse': function questionResetResponse(payload) {
				delete _this.state.responses[payload.value.id];
				return _this.triggerChange();
			},

			'question:setData': function questionSetData(payload) {
				_this.state.data[payload.value.key] = payload.value.value;
				return _this.triggerChange();
			},

			'question:clearData': function questionClearData(payload) {
				delete _this.state.data[payload.value.key];
				return _this.triggerChange();
			},

			'question:hide': function questionHide(payload) {
				_apiUtil2.default.postEvent(OboModel.models[payload.value.id].getRoot(), 'question:hide', {
					questionId: payload.value.id
				});

				delete _this.state.viewedQuestions[payload.value.id];

				if (_this.state.viewing === payload.value.id) {
					_this.state.viewing = null;
				}

				return _this.triggerChange();
			},

			'question:view': function questionView(payload) {
				_apiUtil2.default.postEvent(OboModel.models[payload.value.id].getRoot(), 'question:view', {
					questionId: payload.value.id
				});

				_this.state.viewedQuestions[payload.value.id] = true;
				_this.state.viewing = payload.value.id;

				return _this.triggerChange();
			}
		});
		return _this;
	}

	_createClass(QuestionStore, [{
		key: 'init',
		value: function init() {
			return this.state = {
				viewing: null,
				viewedQuestions: {},
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
			return this.state = newState;
		}
	}]);

	return QuestionStore;
}(Store);

var questionStore = new QuestionStore();
exports.default = questionStore;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _apiUtil = __webpack_require__(2);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _Common2.default.flux.Store;
var Dispatcher = _Common2.default.flux.Dispatcher;
var FocusUtil = _Common2.default.util.FocusUtil;
var OboModel = _Common2.default.models.OboModel;

var ScoreStore = function (_Store) {
	_inherits(ScoreStore, _Store);

	function ScoreStore() {
		_classCallCheck(this, ScoreStore);

		var model = void 0;

		var _this = _possibleConstructorReturn(this, (ScoreStore.__proto__ || Object.getPrototypeOf(ScoreStore)).call(this, 'scoreStore'));

		Dispatcher.on({
			'score:set': function scoreSet(payload) {
				_this.state.scores[payload.value.id] = payload.value.score;

				if (payload.value.score === 100) {
					FocusUtil.unfocus();
				}

				_this.triggerChange();

				model = OboModel.models[payload.value.id];
				return _apiUtil2.default.postEvent(model.getRoot(), 'score:set', {
					id: payload.value.id,
					score: payload.value.score
				});
			},

			'score:clear': function scoreClear(payload) {
				delete _this.state.scores[payload.value.id];
				_this.triggerChange();

				model = OboModel.models[payload.value.id];
				return _apiUtil2.default.postEvent(model.getRoot(), 'score:clear', {
					id: payload.value.id
				});
			}
		});
		return _this;
	}

	_createClass(ScoreStore, [{
		key: 'init',
		value: function init() {
			return this.state = {
				scores: {}
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
			return this.state = newState;
		}
	}]);

	return ScoreStore;
}(Store);

var scoreStore = new ScoreStore();
exports.default = scoreStore;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _questionUtil = __webpack_require__(4);

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
	getLastAttemptScoreForModel: function getLastAttemptScoreForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return null;
		}

		if (assessment.attempts.length === 0) {
			return 0;
		}

		return assessment.attempts[assessment.attempts.length - 1].result.attemptScore;
	},
	getHighestAttemptScoreForModel: function getHighestAttemptScoreForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return null;
		}

		return assessment.attempts.map(function (attempt) {
			return attempt.result.attemptScore;
		}).reduce(function (a, b) {
			return Math.max(a, b);
		}, 0);
	},
	getLastAttemptScoresForModel: function getLastAttemptScoresForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return null;
		}

		if (assessment.attempts.length === 0) {
			return [];
		}

		return assessment.attempts[assessment.attempts.length - 1].result.scores;
	},
	getCurrentAttemptForModel: function getCurrentAttemptForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment) {
			return null;
		}

		return assessment.current;
	},


	// getLastAttemptForModel(state, model) {
	// 	let assessment = AssessmentUtil.getAssessmentForModel(state, model);
	// 	if (!assessment || (assessment.attempts.length === 0)) { return null; }

	// 	return assessment.attempts[assessment.attempts.length - 1];
	// },

	isCurrentAttemptComplete: function isCurrentAttemptComplete(assessmentState, questionState, model) {
		console.log('@TODO: Function not working, responses stored by responseId, not by questionId. Do not use this method.');
		var current = AssessmentUtil.getCurrentAttemptForModel(assessmentState, model);
		if (!current) {
			return null;
		}

		var models = model.children.at(1).children.models;

		return models.filter(function (questionModel) {
			var resp = _questionUtil2.default.getResponse(questionState, questionModel);
			return resp && resp.set === true;
		}).length === models.length;
	},
	getNumberOfAttemptsCompletedForModel: function getNumberOfAttemptsCompletedForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment || assessment.attempts.length === 0) {
			return 0;
		}

		return assessment.attempts.length;
	},
	startAttempt: function startAttempt(model) {
		return Dispatcher.trigger('assessment:startAttempt', {
			value: {
				id: model.get('id')
			}
		});
	},
	endAttempt: function endAttempt(model) {
		return Dispatcher.trigger('assessment:endAttempt', {
			value: {
				id: model.get('id')
			}
		});
	}
};

exports.default = AssessmentUtil;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = _Common2.default.flux.Dispatcher;


var ScoreUtil = {
	getScoreForModel: function getScoreForModel(state, model) {
		var score = state.scores[model.get('id')];
		if (typeof score === 'undefined' || score === null) {
			return null;
		}

		return score;
	},
	setScore: function setScore(id, score) {
		return Dispatcher.trigger('score:set', {
			value: {
				id: id,
				score: score
			}
		});
	},
	clearScore: function clearScore(id) {
		return Dispatcher.trigger('score:clear', {
			value: {
				id: id
			}
		});
	}
};

exports.default = ScoreUtil;

/***/ }),
/* 11 */
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
    rawHeaders.split(/\r?\n/).forEach(function (line) {
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
    this.status = 'status' in options ? options.status : 200;
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(16);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Viewer = _index2.default;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(17);

var _navUtil = __webpack_require__(1);

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
					className: 'viewer--components--inline-nav-button is-' + this.props.type + (this.props.disabled ? ' is-disabled' : ' is-enabled'),
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(19);

var _navStore = __webpack_require__(3);

var _navStore2 = _interopRequireDefault(_navStore);

var _navUtil = __webpack_require__(1);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _logo = __webpack_require__(5);

var _logo2 = _interopRequireDefault(_logo);

var _hamburger = __webpack_require__(23);

var _hamburger2 = _interopRequireDefault(_hamburger);

var _arrow = __webpack_require__(22);

var _arrow2 = _interopRequireDefault(_arrow);

var _lockIcon = __webpack_require__(24);

var _lockIcon2 = _interopRequireDefault(_lockIcon);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getBackgroundImage = _Common2.default.util.getBackgroundImage;
var OboModel = _Common2.default.models.OboModel;
var StyleableText = _Common2.default.text.StyleableText;
var StyleableTextComponent = _Common2.default.text.StyleableTextComponent;

var Nav = function (_React$Component) {
	_inherits(Nav, _React$Component);

	function Nav(props) {
		_classCallCheck(this, Nav);

		var _this = _possibleConstructorReturn(this, (Nav.__proto__ || Object.getPrototypeOf(Nav)).call(this, props));

		_this.state = {
			hover: false
		};
		return _this;
	}

	_createClass(Nav, [{
		key: 'onClick',
		value: function onClick(item) {
			if (item.type === 'link') {
				if (!_navUtil2.default.canNavigate(this.props.navState)) return;
				return _navUtil2.default.gotoPath(item.fullPath);
			} else if (item.type === 'sub-link') {
				var el = OboModel.models[item.id].getDomEl();
				return el.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}, {
		key: 'hideNav',
		value: function hideNav() {
			return _navUtil2.default.toggle();
		}
	}, {
		key: 'onMouseOver',
		value: function onMouseOver() {
			return this.setState({ hover: true });
		}
	}, {
		key: 'onMouseOut',
		value: function onMouseOut() {
			return this.setState({ hover: false });
		}
	}, {
		key: 'renderLabel',
		value: function renderLabel(label) {
			if (label instanceof StyleableText) {
				return React.createElement(StyleableTextComponent, { text: label });
			} else {
				return React.createElement(
					'a',
					null,
					label
				);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var bg = void 0,
			    lockEl = void 0;
			if (this.props.navState.open || this.state.hover) {
				bg = getBackgroundImage(_arrow2.default);
			} else {
				bg = getBackgroundImage(_hamburger2.default);
			}

			if (this.props.navState.locked) {
				lockEl = React.createElement(
					'div',
					{ className: 'lock-icon' },
					React.createElement('img', { src: _lockIcon2.default })
				);
			} else {
				lockEl = null;
			}

			var list = _navUtil2.default.getOrderedList(this.props.navState);

			return React.createElement(
				'div',
				{
					className: 'viewer--components--nav' + (this.props.navState.locked ? ' is-locked' : ' is-unlocked') + (this.props.navState.open ? ' is-open' : ' is-closed') + (this.props.navState.disabled ? ' is-disabled' : ' is-enabled')
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
							transform: !this.props.navState.open && this.state.hover ? 'rotate(180deg)' : '',
							filter: this.props.navState.open ? 'invert(100%)' : 'invert(0%)'
						}
					},
					'Toggle Navigation Menu'
				),
				React.createElement(
					'ul',
					null,
					list.map(function (item, index) {
						switch (item.type) {
							case 'heading':
								var isSelected = false;
								return React.createElement(
									'li',
									{
										key: index,
										className: 'heading' + (isSelected ? ' is-selected' : ' is-not-select')
									},
									_this2.renderLabel(item.label)
								);
								break;

							case 'link':
								var isSelected = _this2.props.navState.navTargetId === item.id;
								//var isPrevVisited = this.props.navState.navTargetHistory.indexOf(item.id) > -1
								return React.createElement(
									'li',
									{
										key: index,
										onClick: _this2.onClick.bind(_this2, item),
										className: 'link' + (isSelected ? ' is-selected' : ' is-not-select') + (item.flags.visited ? ' is-visited' : ' is-not-visited') + (item.flags.complete ? ' is-complete' : ' is-not-complete') + (item.flags.correct ? ' is-correct' : ' is-not-correct')
									},
									_this2.renderLabel(item.label),
									lockEl
								);
								break;

							case 'sub-link':
								var isSelected = _this2.props.navState.navTargetIndex === index;

								return React.createElement(
									'li',
									{
										key: index,
										onClick: _this2.onClick.bind(_this2, item),
										className: 'sub-link' + (isSelected ? ' is-selected' : ' is-not-select') + (item.flags.correct ? ' is-correct' : ' is-not-correct')
									},
									_this2.renderLabel(item.label),
									lockEl
								);
								break;

							case 'seperator':
								return React.createElement(
									'li',
									{ key: index, className: 'seperator' },
									React.createElement('hr', null)
								);
								break;
						}
					})
				),
				React.createElement(_logo2.default, { inverted: true })
			);
		}
	}]);

	return Nav;
}(React.Component);

exports.default = Nav;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(21);

__webpack_require__(20);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _react = __webpack_require__(26);

var _react2 = _interopRequireDefault(_react);

var _inlineNavButton = __webpack_require__(13);

var _inlineNavButton2 = _interopRequireDefault(_inlineNavButton);

var _navUtil = __webpack_require__(1);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _logo = __webpack_require__(5);

var _logo2 = _interopRequireDefault(_logo);

var _scoreStore = __webpack_require__(8);

var _scoreStore2 = _interopRequireDefault(_scoreStore);

var _questionStore = __webpack_require__(7);

var _questionStore2 = _interopRequireDefault(_questionStore);

var _assessmentStore = __webpack_require__(6);

var _assessmentStore2 = _interopRequireDefault(_assessmentStore);

var _navStore = __webpack_require__(3);

var _navStore2 = _interopRequireDefault(_navStore);

var _nav = __webpack_require__(14);

var _nav2 = _interopRequireDefault(_nav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //@TODO


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
var OboGlobals = _Common2.default.util.OboGlobals;

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

		_Common2.default.Store.loadDependency('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css');

		Dispatcher.on('viewer:scrollTo', function (payload) {
			return ReactDOM.findDOMNode(_this.refs.container).scrollTop = payload.value;
		});

		Dispatcher.on('viewer:scrollToTop', _this.scrollToTop.bind(_this));
		Dispatcher.on('getTextForVariable', _this.getTextForVariable.bind(_this));

		_this.isPreviewing = OboGlobals.get('previewing');

		var state = {
			model: OboModel.create(OboGlobals.get('draft')),
			navState: null,
			scoreState: null,
			questionState: null,
			assessmentState: null,
			modalState: null,
			focusState: null,
			navTargetId: null
		};

		_scoreStore2.default.init();
		_questionStore2.default.init();
		ModalStore.init();
		FocusStore.init();

		_navStore2.default.init(state.model, state.model.modelState.start, window.location.pathname);
		_assessmentStore2.default.init(OboGlobals.get('ObojoboDraft.Sections.Assessment:attemptHistory'));

		state.navState = _navStore2.default.getState();
		state.scoreState = _scoreStore2.default.getState();
		state.questionState = _questionStore2.default.getState();
		state.assessmentState = _assessmentStore2.default.getState();
		state.modalState = ModalStore.getState();
		state.focusState = FocusStore.getState();

		_this.onNavStoreChange = function () {
			return _this.setState({ navState: _navStore2.default.getState() });
		};
		_this.onScoreStoreChange = function () {
			return _this.setState({ scoreState: _scoreStore2.default.getState() });
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

		_this.state = state;
		return _this;
	}

	_createClass(ViewerApp, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			// === SET UP DATA STORES ===
			_navStore2.default.onChange(this.onNavStoreChange);
			_scoreStore2.default.onChange(this.onScoreStoreChange);
			_questionStore2.default.onChange(this.onQuestionStoreChange);
			_assessmentStore2.default.onChange(this.onAssessmentStoreChange);
			ModalStore.onChange(this.onModalStoreChange);
			FocusStore.onChange(this.onFocusStoreChange);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_navStore2.default.offChange(this.onNavStoreChange);
			_scoreStore2.default.offChange(this.onScoreStoreChange);
			_questionStore2.default.offChange(this.onQuestionStoreChange);
			_assessmentStore2.default.offChange(this.onAssessmentStoreChange);
			ModalStore.offChange(this.onModalStoreChange);
			FocusStore.offChange(this.onFocusStoreChange);
		}

		// componentDidMount: ->
		// NavUtil.gotoPath window.location.pathname

	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate(nextProps, nextState) {
			var navTargetId = this.state.navTargetId;

			var nextNavTargetId = this.state.navState.navTargetId;

			if (navTargetId !== nextNavTargetId) {
				this.needsScroll = true;
				return this.setState({ navTargetId: nextNavTargetId });
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			// alert 'here, fixme'
			if (this.lastCanNavigate !== _navUtil2.default.canNavigate(this.state.navState)) {
				this.needsScroll = true;
			}
			this.lastCanNavigate = _navUtil2.default.canNavigate(this.state.navState);
			if (this.needsScroll != null) {
				this.scrollToTop();

				return delete this.needsScroll;
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
			} else {
				return container.scrollTop = 0;
			}
		}

		// === NON REACT LIFECYCLE METHODS ===

	}, {
		key: 'update',
		value: function update(json) {
			try {
				var o = void 0;
				return o = JSON.parse(json);
			} catch (e) {
				alert('Error parsing JSON');
				this.setState({ model: this.state.model });
				return;
			}
		}
	}, {
		key: 'onBack',
		value: function onBack() {
			return _navUtil2.default.goPrev();
		}
	}, {
		key: 'onNext',
		value: function onNext() {
			return _navUtil2.default.goNext();
		}
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
		key: 'resetAssessments',
		value: function resetAssessments() {
			_assessmentStore2.default.init();
			_questionStore2.default.init();
			_scoreStore2.default.init();

			_assessmentStore2.default.triggerChange();
			_questionStore2.default.triggerChange();
			_scoreStore2.default.triggerChange();

			return ModalUtil.show(_react2.default.createElement(
				SimpleDialog,
				{ ok: true, width: '15em' },
				'Assessment attempts and all question responses have been reset.'
			));
		}
	}, {
		key: 'unlockNavigation',
		value: function unlockNavigation() {
			return _navUtil2.default.unlock();
		}
	}, {
		key: 'render',
		value: function render() {
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
					prevEl = _react2.default.createElement(_inlineNavButton2.default, { ref: 'prev', type: 'prev', title: 'Back: ' + prevModel.title });
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
					nextEl = _react2.default.createElement(_inlineNavButton2.default, { ref: 'next', type: 'next', title: 'Next: ' + nextModel.title });
				} else {
					nextEl = _react2.default.createElement(_inlineNavButton2.default, {
						ref: 'next',
						type: 'next',
						title: 'End of ' + this.state.model.title,
						disabled: true
					});
				}
			}

			var modal = ModalUtil.getCurrentModal(this.state.modalState);

			return _react2.default.createElement(
				'div',
				{
					ref: 'container',
					onMouseDown: this.onMouseDown.bind(this),
					onScroll: this.onScroll.bind(this),
					className: 'viewer--viewer-app' + (this.isPreviewing ? ' is-previewing' : ' is-not-previewing') + (this.state.navState.locked ? ' is-locked-nav' : ' is-unlocked-nav') + (this.state.navState.open ? ' is-open-nav' : ' is-closed-nav') + (this.state.navState.disabled ? ' is-disabled-nav' : ' is-enabled-nav') + ' is-focus-state-' + this.state.focusState.viewState
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
				_react2.default.createElement(ModuleComponent, { model: this.state.model, moduleData: this.state }),
				nextEl,
				this.isPreviewing ? _react2.default.createElement(
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
				) : null,
				_react2.default.createElement(FocusBlocker, { moduleData: this.state }),
				modal ? _react2.default.createElement(
					ModalContainer,
					null,
					modal
				) : null
			);
		}
	}]);

	return ViewerApp;
}(_react2.default.Component);

exports.default = ViewerApp;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _viewerApp = __webpack_require__(15);

var _viewerApp2 = _interopRequireDefault(_viewerApp);

var _scoreStore = __webpack_require__(8);

var _scoreStore2 = _interopRequireDefault(_scoreStore);

var _assessmentStore = __webpack_require__(6);

var _assessmentStore2 = _interopRequireDefault(_assessmentStore);

var _navStore = __webpack_require__(3);

var _navStore2 = _interopRequireDefault(_navStore);

var _questionStore = __webpack_require__(7);

var _questionStore2 = _interopRequireDefault(_questionStore);

var _assessmentUtil = __webpack_require__(9);

var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil);

var _navUtil = __webpack_require__(1);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _scoreUtil = __webpack_require__(10);

var _scoreUtil2 = _interopRequireDefault(_scoreUtil);

var _apiUtil = __webpack_require__(2);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

var _questionUtil = __webpack_require__(4);

var _questionUtil2 = _interopRequireDefault(_questionUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 18 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 19 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 20 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='-290 387 30 20' style='enable-background:new -290 387 30 20;' xml:space='preserve'%3E %3Cpath d='M-272.5,405.4l-12.1-7.4c-0.6-0.4-0.6-1.7,0-2.1l12.1-7.4c0.5-0.3,1,0.3,1,1.1v14.7C-271.4,405.2-272,405.7-272.5,405.4z' fill='rgba(0, 0, 0, .2)' transform='translate(2, 0)'/%3E %3C/svg%3E"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E %3Cline x1='0' y1='10' x2='100' y2='10' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3Cline x1='0' y1='50' x2='100' y2='50' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3Cline x1='0' y1='90' x2='100' y2='90' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3C/svg%3E"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E %3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 10 16' style='enable-background:new 0 0 10 16;' xml:space='preserve'%3E %3Cpath fill='white' id='XMLID_6_' d='M9.1,6H8.5V3.5C8.5,1.5,6.9,0,5,0C3.1,0,1.6,1.5,1.6,3.5l0,2.5H0.9C0.4,6,0,6.4,0,6.9v8.2 C0,15.6,0.4,16,0.9,16h8.2c0.5,0,0.9-0.4,0.9-0.9V6.9C10,6.4,9.6,6,9.1,6z M3.3,3.4c0-0.9,0.8-1.6,1.7-1.6c0.9,0,1.7,0.8,1.7,1.7V6 H3.3V3.4z'/%3E %3C/svg%3E"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 15.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E %3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='253px' height='64.577px' viewBox='0 0 253 64.577' enable-background='new 0 0 253 64.577' xml:space='preserve' fill='black'%3E %3Cpath d='M18.399,53.629c-0.01,0-0.021,0-0.031,0C7.023,53.396,0,43.151,0,33.793c0-10.79,8.426-19.905,18.399-19.905 c11.006,0,18.399,10.292,18.399,19.905c0,10.719-8.239,19.617-18.367,19.835C18.421,53.629,18.41,53.629,18.399,53.629z M18.399,18.257c-8.393,0-14.031,8.033-14.031,15.536c0.295,7.574,5.625,15.468,14.031,15.468c8.393,0,14.031-7.998,14.031-15.468 C32.43,25.372,26.005,18.257,18.399,18.257z'/%3E %3Cpath d='M58.15,53.629c-6.02,0-13.502-3.57-16.154-10.394c-0.287-0.733-0.603-1.542-0.603-3.281l0-38.454 c0-0.398,0.158-0.779,0.439-1.061S42.495,0,42.893,0h1.369c0.829,0,1.5,0.671,1.5,1.5v18.495c3.827-4.056,8.188-6.106,13.004-6.106 c11.111,0,17.989,10.332,17.989,19.905C76.444,44.75,68.099,53.629,58.15,53.629z M45.761,27.446v12.437 c0,4.652,7.208,9.378,12.389,9.378c8.516,0,14.236-7.998,14.236-15.468c0-7.472-5.208-15.536-13.621-15.536 C51.235,18.257,47.065,24.927,45.761,27.446z'/%3E %3Cpath d='M99.064,53.629c-0.01,0-0.021,0-0.031,0c-11.346-0.233-18.369-10.478-18.369-19.835 c0-10.79,8.426-19.905,18.399-19.905c11.005,0,18.398,10.292,18.398,19.905c0,10.719-8.239,19.617-18.366,19.835 C99.086,53.629,99.075,53.629,99.064,53.629z M99.064,18.257c-8.393,0-14.031,8.033-14.031,15.536 c0.294,7.574,5.624,15.468,14.031,15.468c8.393,0,14.031-7.998,14.031-15.468C113.096,25.372,106.67,18.257,99.064,18.257z'/%3E %3Cpath d='M153.252,53.629c-0.01,0-0.021,0-0.031,0c-11.346-0.233-18.369-10.478-18.369-19.835 c0-10.79,8.426-19.905,18.399-19.905c11.006,0,18.399,10.292,18.399,19.905c0,10.719-8.239,19.617-18.367,19.835 C153.273,53.629,153.263,53.629,153.252,53.629z M153.252,18.257c-8.393,0-14.031,8.033-14.031,15.536 c0.294,7.574,5.624,15.468,14.031,15.468c8.393,0,14.031-7.998,14.031-15.468C167.283,25.372,160.858,18.257,153.252,18.257z'/%3E %3Cpath d='M234.601,53.629c-0.01,0-0.021,0-0.031,0c-11.345-0.233-18.367-10.478-18.367-19.835 c0-10.79,8.426-19.905,18.398-19.905c11.006,0,18.399,10.292,18.399,19.905c0,10.719-8.239,19.617-18.367,19.835 C234.622,53.629,234.611,53.629,234.601,53.629z M234.601,18.257c-8.393,0-14.03,8.033-14.03,15.536 c0.294,7.574,5.624,15.468,14.03,15.468c8.394,0,14.031-7.998,14.031-15.468C248.632,25.372,242.206,18.257,234.601,18.257z'/%3E %3Cpath d='M193.62,53.629c-6.021,0-13.503-3.57-16.155-10.394l-0.098-0.239c-0.254-0.607-0.603-1.438-0.603-3.042 c0.002-15.911,0.098-38.237,0.099-38.461c0.003-0.826,0.674-1.494,1.5-1.494h1.368c0.829,0,1.5,0.671,1.5,1.5v18.495 c3.827-4.055,8.188-6.106,13.005-6.106c11.111,0,17.988,10.332,17.988,19.904C211.915,44.75,203.569,53.629,193.62,53.629z M181.231,27.446v12.437c0,4.652,7.208,9.378,12.389,9.378c8.515,0,14.235-7.998,14.235-15.468c0-7.472-5.207-15.536-13.619-15.536 C186.705,18.257,182.535,24.927,181.231,27.446z'/%3E %3Cpath d='M118.017,64.577c-0.013,0-0.026,0-0.039,0c-2.437-0.063-5.533-0.434-7.865-2.765 c-0.308-0.308-0.467-0.734-0.436-1.167c0.031-0.434,0.249-0.833,0.597-1.094l1.096-0.821c0.566-0.425,1.353-0.396,1.887,0.072 c1.083,0.947,2.617,1.408,4.691,1.408c2.913,0,6.3-2.752,6.3-6.3V16.073c0-0.829,0.671-1.5,1.5-1.5h1.368c0.829,0,1.5,0.671,1.5,1.5 v37.835C128.616,60.195,123.03,64.577,118.017,64.577z M127.116,8.268h-1.368c-0.829,0-1.5-0.671-1.5-1.5V2.389 c0-0.829,0.671-1.5,1.5-1.5h1.368c0.829,0,1.5,0.671,1.5,1.5v4.379C128.616,7.597,127.945,8.268,127.116,8.268z'/%3E %3C/svg%3E"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(11);
module.exports = __webpack_require__(12);


/***/ })
/******/ ]);