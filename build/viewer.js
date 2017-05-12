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
/******/ 	return __webpack_require__(__webpack_require__.s = 268);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _store = __webpack_require__(55);

var _baseSelectionHandler = __webpack_require__(17);

var _baseSelectionHandler2 = _interopRequireDefault(_baseSelectionHandler);

var _focusableChunk = __webpack_require__(172);

var _focusableChunk2 = _interopRequireDefault(_focusableChunk);

var _focusableSelectionHandler = __webpack_require__(41);

var _focusableSelectionHandler2 = _interopRequireDefault(_focusableSelectionHandler);

var _toggleSelectionHandler = __webpack_require__(173);

var _toggleSelectionHandler2 = _interopRequireDefault(_toggleSelectionHandler);

var _nonEditableChunk = __webpack_require__(174);

var _nonEditableChunk2 = _interopRequireDefault(_nonEditableChunk);

var _textChunk = __webpack_require__(175);

var _textChunk2 = _interopRequireDefault(_textChunk);

var _textGroupSelectionHandler = __webpack_require__(177);

var _textGroupSelectionHandler2 = _interopRequireDefault(_textGroupSelectionHandler);

var _textGroupEl = __webpack_require__(43);

var _textGroupEl2 = _interopRequireDefault(_textGroupEl);

var _linkify = __webpack_require__(176);

var _linkify2 = _interopRequireDefault(_linkify);

var _textGroupAdapter = __webpack_require__(42);

var _textGroupAdapter2 = _interopRequireDefault(_textGroupAdapter);

var _chunkUtil = __webpack_require__(178);

var _chunkUtil2 = _interopRequireDefault(_chunkUtil);

var _insert = __webpack_require__(180);

var _insert2 = _interopRequireDefault(_insert);

var _insertWithText = __webpack_require__(179);

var _insertWithText2 = _interopRequireDefault(_insertWithText);

var _oboComponent = __webpack_require__(188);

var _oboComponent2 = _interopRequireDefault(_oboComponent);

var _anchor = __webpack_require__(44);

var _anchor2 = _interopRequireDefault(_anchor);

var _deleteButton = __webpack_require__(24);

var _deleteButton2 = _interopRequireDefault(_deleteButton);

var _editButton = __webpack_require__(182);

var _editButton2 = _interopRequireDefault(_editButton);

var _button = __webpack_require__(45);

var _button2 = _interopRequireDefault(_button);

var _bubble = __webpack_require__(46);

var _bubble2 = _interopRequireDefault(_bubble);

var _singleInputBubble = __webpack_require__(185);

var _singleInputBubble2 = _interopRequireDefault(_singleInputBubble);

var _question = __webpack_require__(186);

var _question2 = _interopRequireDefault(_question);

var _simpleMessage = __webpack_require__(187);

var _simpleMessage2 = _interopRequireDefault(_simpleMessage);

var _modal = __webpack_require__(49);

var _modal2 = _interopRequireDefault(_modal);

var _dialog = __webpack_require__(47);

var _dialog2 = _interopRequireDefault(_dialog);

var _simpleDialog = __webpack_require__(50);

var _simpleDialog2 = _interopRequireDefault(_simpleDialog);

var _errorDialog = __webpack_require__(48);

var _errorDialog2 = _interopRequireDefault(_errorDialog);

var _textMenu = __webpack_require__(189);

var _textMenu2 = _interopRequireDefault(_textMenu);

var _modalContainer = __webpack_require__(184);

var _modalContainer2 = _interopRequireDefault(_modalContainer);

var _focusBlocker = __webpack_require__(183);

var _focusBlocker2 = _interopRequireDefault(_focusBlocker);

var _store2 = __webpack_require__(25);

var _store3 = _interopRequireDefault(_store2);

var _dispatcher = __webpack_require__(1);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _mockElement = __webpack_require__(51);

var _mockElement2 = _interopRequireDefault(_mockElement);

var _mockTextNode = __webpack_require__(52);

var _mockTextNode2 = _interopRequireDefault(_mockTextNode);

var _oboModel = __webpack_require__(6);

var _oboModel2 = _interopRequireDefault(_oboModel);

var _legacy = __webpack_require__(190);

var _legacy2 = _interopRequireDefault(_legacy);

var _api = __webpack_require__(191);

var _api2 = _interopRequireDefault(_api);

var _chunkSelection = __webpack_require__(195);

var _chunkSelection2 = _interopRequireDefault(_chunkSelection);

var _cursor = __webpack_require__(53);

var _cursor2 = _interopRequireDefault(_cursor);

var _domSelection = __webpack_require__(10);

var _domSelection2 = _interopRequireDefault(_domSelection);

var _oboSelectionRect = __webpack_require__(26);

var _oboSelectionRect2 = _interopRequireDefault(_oboSelectionRect);

var _selection = __webpack_require__(196);

var _selection2 = _interopRequireDefault(_selection);

var _virtualCursor = __webpack_require__(27);

var _virtualCursor2 = _interopRequireDefault(_virtualCursor);

var _virtualCursorData = __webpack_require__(197);

var _virtualCursorData2 = _interopRequireDefault(_virtualCursorData);

var _virtualSelection = __webpack_require__(54);

var _virtualSelection2 = _interopRequireDefault(_virtualSelection);

var _modalStore = __webpack_require__(199);

var _modalStore2 = _interopRequireDefault(_modalStore);

var _focusStore = __webpack_require__(198);

var _focusStore2 = _interopRequireDefault(_focusStore);

var _domUtil = __webpack_require__(7);

var _domUtil2 = _interopRequireDefault(_domUtil);

var _head = __webpack_require__(192);

var _head2 = _interopRequireDefault(_head);

var _keyboard = __webpack_require__(193);

var _keyboard2 = _interopRequireDefault(_keyboard);

var _screen = __webpack_require__(194);

var _screen2 = _interopRequireDefault(_screen);

var _chunkStyleList = __webpack_require__(60);

var _chunkStyleList2 = _interopRequireDefault(_chunkStyleList);

var _styleableText = __webpack_require__(12);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _styleableTextComponent = __webpack_require__(61);

var _styleableTextComponent2 = _interopRequireDefault(_styleableTextComponent);

var _styleableTextRenderer = __webpack_require__(62);

var _styleableTextRenderer2 = _interopRequireDefault(_styleableTextRenderer);

var _styleRange = __webpack_require__(18);

var _styleRange2 = _interopRequireDefault(_styleRange);

var _styleType = __webpack_require__(11);

var _styleType2 = _interopRequireDefault(_styleType);

var _textConstants = __webpack_require__(13);

var _textConstants2 = _interopRequireDefault(_textConstants);

var _textGroup = __webpack_require__(59);

var _textGroup2 = _interopRequireDefault(_textGroup);

var _textGroupCursor = __webpack_require__(56);

var _textGroupCursor2 = _interopRequireDefault(_textGroupCursor);

var _textGroupItem = __webpack_require__(57);

var _textGroupItem2 = _interopRequireDefault(_textGroupItem);

var _textGroupSelection = __webpack_require__(58);

var _textGroupSelection2 = _interopRequireDefault(_textGroupSelection);

var _textGroupUtil = __webpack_require__(28);

var _textGroupUtil2 = _interopRequireDefault(_textGroupUtil);

var _console = __webpack_require__(200);

var _console2 = _interopRequireDefault(_console);

var _getBackgroundImage = __webpack_require__(63);

var _getBackgroundImage2 = _interopRequireDefault(_getBackgroundImage);

var _htmlUtil = __webpack_require__(64);

var _htmlUtil2 = _interopRequireDefault(_htmlUtil);

var _modalUtil = __webpack_require__(65);

var _modalUtil2 = _interopRequireDefault(_modalUtil);

var _focusUtil = __webpack_require__(29);

var _focusUtil2 = _interopRequireDefault(_focusUtil);

var _errorUtil = __webpack_require__(201);

var _errorUtil2 = _interopRequireDefault(_errorUtil);

var _uuid = __webpack_require__(66);

var _uuid2 = _interopRequireDefault(_uuid);

var _oboGlobals = __webpack_require__(202);

var _oboGlobals2 = _interopRequireDefault(_oboGlobals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	Store: _store.Store,
	chunk: {
		BaseSelectionHandler: _baseSelectionHandler2.default,
		FocusableChunk: _focusableChunk2.default,
		focusableChunk: {
			FocusableSelectionHandler: _focusableSelectionHandler2.default,
			ToggleSelectionHandler: _toggleSelectionHandler2.default
		},
		NonEditableChunk: _nonEditableChunk2.default,
		TextChunk: _textChunk2.default,
		textChunk: {
			TextGroupSelectionHandler: _textGroupSelectionHandler2.default,
			TextGroupEl: _textGroupEl2.default,
			Linkify: _linkify2.default,
			TextGroupAdapter: _textGroupAdapter2.default
		},
		util: {
			ChunkUtil: _chunkUtil2.default,
			Insert: _insert2.default,
			InsertWithText: _insertWithText2.default
		}
	},

	components: {
		OboComponent: _oboComponent2.default,
		Anchor: _anchor2.default,
		DeleteButton: _deleteButton2.default,
		EditButton: _editButton2.default,
		Button: _button2.default,
		modal: {
			bubble: {
				Bubble: _bubble2.default,
				SingleInputBubble: _singleInputBubble2.default
			},
			Question: _question2.default,
			SimpleMessage: _simpleMessage2.default,
			Modal: _modal2.default,
			Dialog: _dialog2.default,
			SimpleDialog: _simpleDialog2.default,
			ErrorDialog: _errorDialog2.default
		},
		TextMenu: _textMenu2.default,
		ModalContainer: _modalContainer2.default,
		FocusBlocker: _focusBlocker2.default
	},

	flux: {
		Store: _store3.default,
		Dispatcher: _dispatcher2.default
	},

	mockDOM: {
		MockElement: _mockElement2.default,
		MockTextNode: _mockTextNode2.default
	},

	models: {
		OboModel: _oboModel2.default,
		Legacy: _legacy2.default
	},

	net: {
		API: _api2.default
	},

	selection: {
		ChunkSelection: _chunkSelection2.default,
		Cursor: _cursor2.default,
		DOMSelection: _domSelection2.default,
		OboSelectionRect: _oboSelectionRect2.default,
		Selection: _selection2.default,
		VirtualCursor: _virtualCursor2.default,
		VirtualCursorData: _virtualCursorData2.default,
		VirtualSelection: _virtualSelection2.default
	},

	stores: {
		ModalStore: _modalStore2.default,
		FocusStore: _focusStore2.default
	},

	page: {
		DOMUtil: _domUtil2.default,
		Head: _head2.default,
		Keyboard: _keyboard2.default,
		Screen: _screen2.default
	},

	text: {
		ChunkStyleList: _chunkStyleList2.default,
		StyleableText: _styleableText2.default,
		StyleableTextComponent: _styleableTextComponent2.default,
		StyleableTextRenderer: _styleableTextRenderer2.default,
		StyleRange: _styleRange2.default,
		StyleType: _styleType2.default,
		TextConstants: _textConstants2.default
	},

	textGroup: {
		TextGroup: _textGroup2.default,
		TextGroupCursor: _textGroupCursor2.default,
		TextGroupItem: _textGroupItem2.default,
		TextGroupSelection: _textGroupSelection2.default,
		TextGroupUtil: _textGroupUtil2.default
	},

	util: {
		Console: _console2.default,
		getBackgroundImage: _getBackgroundImage2.default,
		HtmlUtil: _htmlUtil2.default,
		ModalUtil: _modalUtil2.default,
		FocusUtil: _focusUtil2.default,
		ErrorUtil: _errorUtil2.default,
		UUID: _uuid2.default,
		OboGlobals: _oboGlobals2.default
	}
}; // @TODO

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
// Dispatcher = require('flux').Dispatcher
// module.exports = new Dispatcher()

var Dispatcher = {};
_.extend(Dispatcher, Backbone.Events);

var ex = Dispatcher.on;
var ex2 = Dispatcher.trigger;
Dispatcher.on = function () {
	// console.log 'ON', arguments
	return ex.apply(this, arguments);
};

Dispatcher.trigger = function () {
	// console.log 'TRIGGER', arguments
	return ex2.apply(this, arguments);
};

window.__dispatcher = Dispatcher;

exports.default = Dispatcher;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _viewerApp = __webpack_require__(219);

var _viewerApp2 = _interopRequireDefault(_viewerApp);

var _scoreStore = __webpack_require__(70);

var _scoreStore2 = _interopRequireDefault(_scoreStore);

var _assessmentStore = __webpack_require__(68);

var _assessmentStore2 = _interopRequireDefault(_assessmentStore);

var _navStore = __webpack_require__(30);

var _navStore2 = _interopRequireDefault(_navStore);

var _questionStore = __webpack_require__(69);

var _questionStore2 = _interopRequireDefault(_questionStore);

var _assessmentUtil = __webpack_require__(71);

var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil);

var _navUtil = __webpack_require__(8);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _scoreUtil = __webpack_require__(72);

var _scoreUtil2 = _interopRequireDefault(_scoreUtil);

var _apiUtil = __webpack_require__(14);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

var _questionUtil = __webpack_require__(31);

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(20),
    normalizeOpts = __webpack_require__(34),
    isCallable = __webpack_require__(90),
    contains = __webpack_require__(21),
    d;

d = module.exports = function (dscr, value /*, options*/) {
	var c, e, w, options, desc;
	if (arguments.length < 2 || typeof dscr !== 'string') {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set /*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = __webpack_require__(66);

var _uuid2 = _interopRequireDefault(_uuid);

var _dispatcher = __webpack_require__(1);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _store = __webpack_require__(55);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultAdapter = {
	construct: function construct(attrs) {
		return null;
	},
	clone: function clone(_clone) {
		return _clone;
	},
	toJSON: function toJSON(model, json) {
		return json;
	},
	toText: function toText(model) {
		return '';
	}
};

var OboModel = function (_Backbone$Model) {
	_inherits(OboModel, _Backbone$Model);

	_createClass(OboModel, [{
		key: 'defaults',
		value: function defaults() {
			return {
				id: null,
				content: {},
				metadata: {},
				index: 0,
				type: ''
			};
		}
	}]);

	function OboModel(attrs, adapter) {
		_classCallCheck(this, OboModel);

		if (adapter == null) {
			adapter = {};
		}

		var _this = _possibleConstructorReturn(this, (OboModel.__proto__ || Object.getPrototypeOf(OboModel)).call(this));

		_this.parent = null;
		_this.children = new OboModelCollection();
		_this.triggers = [];
		_this.title = null;

		_this.modelState = {
			dirty: false,
			needsUpdate: false,
			editing: false
		};

		if (attrs.id == null) {
			attrs.id = _this.createNewLocalId();
		}

		var _this = _possibleConstructorReturn(this, (OboModel.__proto__ || Object.getPrototypeOf(OboModel)).call(this, attrs));

		_this.adapter = Object.assign(Object.assign({}, DefaultAdapter), adapter);
		_this.adapter.construct(_this, attrs);

		if ((attrs.content != null ? attrs.content.triggers : undefined) != null) {
			_this.triggers = attrs.content.triggers;
		}

		if ((attrs.content != null ? attrs.content.title : undefined) != null) {
			_this.title = attrs.content.title;
		}

		_this.children.on('remove', _this.onChildRemove, _this);
		_this.children.on('add', _this.onChildAdd, _this);
		_this.children.on('reset', _this.onChildrenReset, _this);

		OboModel.models[_this.get('id')] = _this;
		return _this;
	}

	_createClass(OboModel, [{
		key: 'getRoot',
		value: function getRoot() {
			var root = this;
			while (root !== null) {
				if (root.parent) {
					root = root.parent;
				} else {
					return root;
				}
			}

			return null;
		}
	}, {
		key: 'getDraftId',
		value: function getDraftId() {
			var root = this.getRoot();
			if (root == null) {
				return null;
			}

			return root.get('_id');
		}
	}, {
		key: 'processTrigger',
		value: function processTrigger(type) {
			var _this2 = this;

			// console.log 'PROCESS TRIGGER', type, @triggers

			var index = void 0;
			var triggersToDelete = [];

			for (var trigIndex = 0; trigIndex < this.triggers.length; trigIndex++) {
				var trigger = this.triggers[trigIndex];
				if (trigger.type === type) {
					for (index = 0; index < trigger.actions.length; index++) {
						var action = trigger.actions[index];
						if (action.type === '_js') {
							eval(action.value);
						} else {
							_dispatcher2.default.trigger(action.type, action);
						}
					}

					if (trigger.run != null && trigger.run === 'once') {
						triggersToDelete.unshift(trigIndex);
					}
				}
			}

			return function () {
				var result = [];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = Array.from(triggersToDelete)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						index = _step.value;

						result.push(_this2.triggers.splice(index, 1));
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

				return result;
			}();
		}
	}, {
		key: 'onChildRemove',
		value: function onChildRemove(model, collection, options) {
			model.parent = null;
			model.markDirty();

			return delete OboModel.models[model.get('id')];
		}
	}, {
		key: 'onChildAdd',
		value: function onChildAdd(model, collection, options) {
			model.parent = this;
			return model.markDirty();
		}
	}, {
		key: 'onChildrenReset',
		value: function onChildrenReset(collection, options) {
			var _this3 = this;

			return Array.from(this.children.models).map(function (child) {
				return child.parent = _this3;
			});
		}
	}, {
		key: 'createNewLocalId',
		value: function createNewLocalId() {
			return (0, _uuid2.default)();
		}
	}, {
		key: 'assignNewId',
		value: function assignNewId() {
			delete OboModel.models[this.get('id')];

			this.set('id', this.createNewLocalId());

			return OboModel.models[this.get('id')] = this;
		}

		// should be overridden

	}, {
		key: 'clone',
		value: function clone(deep) {
			if (deep == null) {
				deep = false;
			}
			var clone = new OboModel(this.attributes, this.adapter.constructor);
			this.adapter.clone(this, clone);

			if (deep && this.hasChildren()) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = Array.from(this.children)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var child = _step2.value;

						clone.children.add(child.clone(true));
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
			}

			return clone;
		}
	}, {
		key: 'toJSON',
		value: function toJSON() {
			var json = _get(OboModel.prototype.__proto__ || Object.getPrototypeOf(OboModel.prototype), 'toJSON', this).call(this);
			this.adapter.toJSON(this, json);

			json.children = null;

			if (this.hasChildren()) {
				json.children = [];
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = Array.from(this.children.models)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var child = _step3.value;

						json.children.push(child.toJSON());
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

			return json;
		}
	}, {
		key: 'toText',
		value: function toText() {
			var text = this.adapter.toText(this);

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Array.from(this.children.models)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var child = _step4.value;

					text += '\n' + child.toText();
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

			return text;
		}
	}, {
		key: 'revert',
		value: function revert() {
			// Does this work?
			var newModel = new this.constructor();

			var index = this.get('index');
			var id = this.get('id');

			this.clear();

			for (var attrName in newModel.attributes) {
				var attr = newModel.attributes[attrName];
				this.set(attrName, attr);
			}

			this.set('index', index);
			this.set('id', id);

			this.modelState = newModel.modelState;

			return this;
		}
	}, {
		key: 'markDirty',
		value: function markDirty(markChildren) {
			if (markChildren == null) {
				markChildren = false;
			}
			this.modelState.dirty = this.modelState.needsUpdate = true;

			if (markChildren) {
				return Array.from(this.children.models).map(function (child) {
					return child.markDirty();
				});
			}
		}
	}, {
		key: 'markForUpdate',
		value: function markForUpdate(markChildren) {
			if (markChildren == null) {
				markChildren = false;
			}
			this.modelState.needsUpdate = true;

			if (markChildren) {
				return Array.from(this.children.models).map(function (child) {
					return child.markForUpdate();
				});
			}
		}
	}, {
		key: 'markUpdated',
		value: function markUpdated(markChildren) {
			if (markChildren == null) {
				markChildren = false;
			}
			this.modelState.needsUpdate = false;

			if (markChildren) {
				return Array.from(this.children.models).map(function (child) {
					return child.modelState.needsUpdate = false;
				});
			}
		}
	}, {
		key: 'getDomEl',
		value: function getDomEl() {
			// @TODO - This work?
			return document.body.querySelector('.component[data-id=\'' + this.get('id') + '\']');
		}
		// document.body.querySelector ".component[data-component-index='#{@getIndex()}']"

	}, {
		key: 'getComponentClass',
		value: function getComponentClass() {
			return _store.Store.getItemForType(this.get('type')).componentClass;
		}
	}, {
		key: 'hasChildren',
		value: function hasChildren() {
			return this.children.models.length > 0;
		}
	}, {
		key: 'isOrphan',
		value: function isOrphan() {
			return this.parent == null;
		}
	}, {
		key: 'addChildBefore',
		value: function addChildBefore(sibling) {
			if (this.isOrphan()) {
				return;
			}

			var collection = this.parent.collection;


			if (collection.contains(sibling)) {
				collection.remove(sibling);
			}

			return collection.add(sibling, { at: this.getIndex() });
		}
	}, {
		key: 'addChildAfter',
		value: function addChildAfter(sibling) {
			if (this.isOrphan()) {
				return;
			}

			var collection = this.parent.collection;


			if (collection.contains(sibling)) {
				collection.remove(sibling);
			}

			return collection.add(sibling, { at: this.getIndex() + 1 });
		}
	}, {
		key: 'moveTo',
		value: function moveTo(index) {
			if (this.getIndex() === index) {
				return;
			}

			var refChunk = this.parent.at(index);

			if (index < this.getIndex()) {
				return refChunk.addChildBefore(this);
			} else {
				return refChunk.addChildAfter(this);
			}
		}
	}, {
		key: 'moveToTop',
		value: function moveToTop() {
			return this.moveTo(0);
		}
	}, {
		key: 'moveToBottom',
		value: function moveToBottom() {
			return this.moveTo(this.parent.length - 1);
		}
	}, {
		key: 'prevSibling',
		value: function prevSibling() {
			if (this.isOrphan() || this.isFirst()) {
				return null;
			}
			return this.parent.children.at(this.getIndex() - 1);
		}
	}, {
		key: 'getIndex',
		value: function getIndex() {
			if (!this.parent) {
				return 0;
			}
			return this.parent.children.models.indexOf(this);
		}
	}, {
		key: 'nextSibling',
		value: function nextSibling() {
			if (this.isOrphan() || this.isLast()) {
				return null;
			}
			return this.parent.children.at(this.parent.children.models.indexOf(this) + 1);
		}
	}, {
		key: 'isFirst',
		value: function isFirst() {
			if (this.isOrphan()) {
				return false;
			}
			return this.getIndex() === 0;
		}
	}, {
		key: 'isLast',
		value: function isLast() {
			if (this.isOrphan()) {
				return false;
			}
			return this.getIndex() === this.parent.length - 1;
		}
	}, {
		key: 'isBefore',
		value: function isBefore(otherChunk) {
			if (this.isOrphan()) {
				return false;
			}
			return this.getIndex() < otherChunk.getIndex();
		}
	}, {
		key: 'isAfter',
		value: function isAfter(otherChunk) {
			if (this.isOrphan()) {
				return false;
			}
			return this.getIndex() > otherChunk.getIndex();
		}
	}, {
		key: 'remove',
		value: function remove() {
			if (!this.isOrphan()) {
				return this.parent.remove(this);
			}
		}
	}, {
		key: 'replaceWith',
		value: function replaceWith(newChunk) {
			if (this.isOrphan() || newChunk === this) {
				return;
			}

			this.addChildBefore(newChunk);
			return this.remove();
		}

		// getChildrenOfType: (type) ->
		// 	matching = []

		// 	for child in @children
		// 		if child.get('type') is type
		// 			matching.push child

		// 	matching

		// searchChildren: (fn) ->
		// 	for child in @children
		// 		if fn(child)
		// 			child.searchChildren fn

	}, {
		key: 'contains',
		value: function contains(child) {
			while (child !== null) {
				if (child === this) {
					return true;
				}

				child = child.parent;
			}

			return false;
		}
	}, {
		key: 'getChildContainingModel',
		value: function getChildContainingModel(model) {
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = Array.from(this.children.models)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var child = _step5.value;

					if (child.contains(model)) {
						return child;
					}
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			return null;
		}
	}, {
		key: 'getParentOfType',
		value: function getParentOfType(type) {
			var model = this.parent;
			while (model !== null) {
				if (model.get('type') === type) {
					return model;
				}
				model = model.parent;
			}

			return null;
		}
	}, {
		key: '__debug_print',
		value: function __debug_print(indent) {
			if (indent == null) {
				indent = '';
			}
			console.log(indent + this.get('type'));
			return Array.from(this.children.models).map(function (child) {
				return child.__debug_print(indent + '  ');
			});
		}
	}]);

	return OboModel;
}(Backbone.Model);

OboModel.models = {};

//@TODO @HACK:
OboModel.getRoot = function () {
	for (var id in OboModel.models) {
		return OboModel.models[id].getRoot();
	}

	return null;
};

var OboModelCollection = function (_Backbone$Collection) {
	_inherits(OboModelCollection, _Backbone$Collection);

	function OboModelCollection() {
		_classCallCheck(this, OboModelCollection);

		return _possibleConstructorReturn(this, (OboModelCollection.__proto__ || Object.getPrototypeOf(OboModelCollection)).apply(this, arguments));
	}

	return OboModelCollection;
}(Backbone.Collection);
// model: OboModel

// reset: (models) ->
// 	if(typeof models is 'object')

// OboModel.create('chunk') = default chunk
// OboModel.create('ObojoboDraft.Chunks.List') = new list
// OboModel.create({type:'ObojoboDraft.Chunks.Table', content:{}, children:[]}) = new Table with children


OboModel.create = function (typeOrNameOrJson, attrs) {
	// console.log 'OboModel.create', typeOrNameOrJson, attrs

	// try json
	if (attrs == null) {
		attrs = {};
	}
	if ((typeof typeOrNameOrJson === 'undefined' ? 'undefined' : _typeof(typeOrNameOrJson)) === 'object') {
		var oboModel = OboModel.create(typeOrNameOrJson.type, typeOrNameOrJson);

		if (oboModel != null) {
			var children = typeOrNameOrJson.children;

			if (children != null) {
				// delete typeOrNameOrJson.children

				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = Array.from(children)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var child = _step6.value;

						var c = OboModel.create(child);
						// console.log 'c be', c, oboModel.children
						oboModel.children.add(c);
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6.return) {
							_iterator6.return();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}
			}
		}

		return oboModel;
	}

	var item = _store.Store.getDefaultItemForModelType(typeOrNameOrJson);
	if (!item) {
		item = _store.Store.getItemForType(typeOrNameOrJson);
	}

	if (!item) {
		// console.log 'null', typeOrNameOrJson
		return null;
	}

	attrs.type = typeOrNameOrJson;

	// console.log 'creating', typeOrNameOrJson, attrs, item
	return new OboModel(attrs, item.adapter);
};

exports.default = OboModel;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var DOMUtil = {
	findParentWithAttr: function findParentWithAttr(node, targetAttribute, targetValue, rootParent) {
		if (targetValue == null) {
			targetValue = null;
		}
		if (rootParent == null) {
			rootParent = document.body;
		}
		while (node != null && node !== rootParent) {
			if (node.getAttribute != null) {
				var attr = node.getAttribute(targetAttribute);
				if (attr != null && (targetValue === null || attr === targetValue)) {
					return node;
				}
			}
			node = node.parentNode;
		}

		return null;
	},
	findParentAttr: function findParentAttr(node, targetAttribute) {
		node = DOMUtil.findParentWithAttr(node, targetAttribute);
		if (node == null) {
			return null;
		}

		return node.getAttribute(targetAttribute);
	},
	findParentComponentElements: function findParentComponentElements(node) {
		var componentSet = new Set();

		var cur = node;
		while (cur !== null) {
			cur = DOMUtil.findParentWithAttr(cur, 'data-obo-component');

			if (cur == null) {
				break;
			}

			if (DOMUtil.elementLikeComponent(cur)) {
				componentSet.add(cur);
			}

			cur = cur.parentElement;
		}

		return componentSet;
	},
	findParentComponentIds: function findParentComponentIds(node) {
		var ids = new Set();
		DOMUtil.findParentComponentElements(node).forEach(function (el) {
			return ids.add(el.getAttribute('data-id'));
		});

		return ids;
	},
	elementLikeComponent: function elementLikeComponent(node) {
		return node.getAttribute('data-obo-component') && node.classList.contains('component') && node.getAttribute('data-id') != null && node.getAttribute('data-type') != null;
	},
	getFirstTextNodeOfElement: function getFirstTextNodeOfElement(node) {
		while (node != null && node.nodeType !== Node.TEXT_NODE) {
			node = node.childNodes[0];
		}

		return node;
	},


	// getTextLengthBefore: (element, targetTextNode) ->
	// 	charsRead = 0
	// 	nodes = DOMUtil.getTextNodesInOrder element
	// 	for node in nodes
	// 		if node is targetTextNode then return charsRead
	// 		charsRead += node.nodeValue.length
	// getTextLengthBefore: (element, targetElement, indent = '') ->


	// 	console.log indent, 'getTextLengthBefore', element, targetElement

	// 	indent += '    '

	// 	totalCharactersFromStart = 0

	// 	# console.log 'so like element be all', element

	// 	# debugger;

	// 	console.log indent, 'childNodes is', element.childNodes
	// 	for child in element.childNodes
	// 		console.log indent, 'child is', child, 'target element is', targetElement
	// 		if child is targetElement
	// 			console.log indent, 'YASSSSS'
	// 			return totalCharactersFromStart

	// 		if child.nodeType is Node.ELEMENT_NODE
	// 			totalCharactersFromStart += DOMUtil.getTextLengthBefore child, targetElement, indent

	// 		if child.nodeType is Node.TEXT_NODE
	// 			# debugger;
	// 			totalCharactersFromStart += child.nodeValue.length

	// 	console.log indent, 'GUTTERBALL'
	// 	return 0


	// findTextNodeAtPosition: (offset, element) ->
	// 	console.log 'FIND TEXT NODE AT POSITION', offset, element

	// 	totalCharactersFromStart = 0

	// 	console.log 'so like element be all', element

	// 	# debugger;

	// 	for child in element.childNodes
	// 		console.log 'mah chil', child, child.nodeType, child.nodeValue
	// 		if child.nodeType is Node.ELEMENT_NODE
	// 			return DOMUtil.findTextNodeAtPosition offset - totalCharactersFromStart, child
	// 		else if child.nodeType is Node.TEXT_NODE and totalCharactersFromStart + child.nodeValue.length >= offset
	// 			return { textNode:child, offset:offset }

	// 		totalCharactersFromStart += child.nodeValue.length

	// 	return { textNode:null, offset:0 }


	// #@TODO - delete all these
	getTextNodesInOrder: function getTextNodesInOrder(element) {
		var textNodes = [];
		DOMUtil.getTextNodesInOrderRecur(element, textNodes);
		// console.log 'GET TEXT NODES IN ORDER'
		// console.log textNodes
		return textNodes;
	},
	getTextNodesInOrderRecur: function getTextNodesInOrderRecur(element, textNodes) {
		return Array.from(element.childNodes).map(function (node) {
			return node.nodeType === Node.TEXT_NODE ? textNodes.push(node) : DOMUtil.getTextNodesInOrderRecur(node, textNodes);
		});
	}
};

// getOboElementFromChild: (element, targetClass = null) ->
// 	while element isnt document.body
// 		return element if DOMUtil.isOboElement element, targetClass
// 		element = element.parentElement

// 	null

// getOboElementIdFromChild: (element, targetClass = null) ->
// 	oboElement = DOMUtil.getOboElementFromChild element, targetClass
// 	return null if not oboElement

// 	oboElement.getAttribute('data-oboid')

// isOboElement: (element, targetClass = null) ->
// 	element.getAttribute('data-oboid') isnt null and (targetClass is null or element.classList.contains(targetClass));

// findElementFromChild: (element, targetElementTag) ->
// 	chunkElement = DOMUtil.getOboElementFromChild element

// 	return null if not chunkElement

// 	targetElementTag = targetElementTag.toLowerCase()
// 	while element isnt chunkElement
// 		return element if element.tagName.toLowerCase() is targetElementTag
// 		element = element.parentElement

// 	null

// getElementByOboId: (oboid) ->
// 	document.querySelector '*[data-oboid="' + oboid + '"]'


exports.default = DOMUtil;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var OboModel = _ObojoboDraft2.default.models.OboModel;


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
	disable: function disable() {
		return Dispatcher.trigger('nav:disable');
	},
	enable: function enable() {
		return Dispatcher.trigger('nav:enable');
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
		return !state.locked && !state.disabled;
	},
	getOrderedList: function getOrderedList(state) {
		return getFlatList(state.items);
	}
};

exports.default = NavUtil;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(108)() ? Symbol : __webpack_require__(110);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Chrome sometimes has range startContainer / endContainer as an element node
// so we need to dig down in this case to find the first text node

var _domUtil = __webpack_require__(7);

var _domUtil2 = _interopRequireDefault(_domUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMSelection = function () {
	function DOMSelection() {
		_classCallCheck(this, DOMSelection);

		this.domSelection = window.getSelection();
		this.domRange = null;

		if (this.domSelection.rangeCount > 0) {
			this.domRange = this.domSelection.getRangeAt(0);
		}
	}

	_createClass(DOMSelection, [{
		key: 'getType',
		value: function getType() {
			if (this.domSelection.type != null) {
				return this.domSelection.type.toLowerCase();
			}

			if (this.domSelection.isCollapsed != null) {
				if (this.domSelection.isCollapsed) {
					return 'caret';
				} else {
					return 'range';
				}
			}

			if (this.domSelection.focusNode === this.domSelection.anchorNode && this.domSelection.focusOffset === this.domSelection.anchorOffset) {
				return 'caret';
			}

			return 'range';
		}
	}, {
		key: 'getClientRects',
		value: function getClientRects() {
			if (this.domRange == null) {
				return [];
			}
			return this.domRange.getClientRects();
		}
	}, {
		key: 'set',
		value: function set(startNode, startOffset, endNode, endOffset) {
			// console.log 'DS.set', startNode, startOffset, endNode, endOffset

			var r = document.createRange();

			r.setStart(startNode, startOffset);
			r.setEnd(endNode, endOffset);

			this.domSelection.removeAllRanges();
			this.domSelection.addRange(r);

			this.domRange = r;

			return this;
		}
	}, {
		key: 'setStart',
		value: function setStart(node, offset) {
			return this.domRange.setStart(node, offset);
		}
	}, {
		key: 'setEnd',
		value: function setEnd(node, offset) {
			return this.domRange.setEnd(node, offset);
		}
	}, {
		key: 'includes',
		value: function includes(node) {
			// console.log 'asking if', node, 'contains', @startText, 'and', @endText
			if (node == null) {
				return false;
			}
			return node.contains(this.startText) && node.contains(this.endText);
		}
	}]);

	return DOMSelection;
}();

DOMSelection.set = function (startNode, startOffset, endNode, endOffset) {
	return (
		// console.log 'DS.set', startNode, startOffset, endNode, endOffset
		new DOMSelection().set(startNode, startOffset, endNode, endOffset)
	);
};

DOMSelection.includes = function (node) {
	return new DOMSelection().includes(node);
};

DOMSelection.get = function () {
	return new DOMSelection();
};

Object.defineProperties(DOMSelection.prototype, {
	startContainer: {
		get: function get() {
			if (this.domRange == null) {
				return null;
			}
			if (this.domRange.startContainer.nodeType === Node.TEXT_NODE) {
				return this.domRange.startContainer.parentElement;
			} else {
				return this.domRange.startContainer;
			}
		}
	},
	startText: {
		get: function get() {
			if (this.domRange == null) {
				return null;
			}
			return _domUtil2.default.getFirstTextNodeOfElement(this.domRange.startContainer);
		}
	},
	startOffset: {
		get: function get() {
			if (this.domRange == null) {
				return null;
			}
			return this.domRange.startOffset;
		}
	},
	endContainer: {
		get: function get() {
			if (this.domRange == null) {
				return null;
			}
			if (this.domRange.endContainer.nodeType === Node.TEXT_NODE) {
				return this.domRange.endContainer.parentElement;
			} else {
				return this.domRange.endContainer;
			}
		}
	},
	endText: {
		get: function get() {
			if (this.domRange == null) {
				return null;
			}
			return _domUtil2.default.getFirstTextNodeOfElement(this.domRange.endContainer);
		}
	},
	endOffset: {
		get: function get() {
			if (this.domRange == null) {
				return null;
			}
			return this.domRange.endOffset;
		}
	}
});

//@TODO
window.__ds = function () {
	return DOMSelection.get();
};

exports.default = DOMSelection;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var StyleType = {
	BOLD: 'b',
	ITALIC: 'i',
	STRIKETHROUGH: 'del',
	LINK: 'a',
	QUOTE: 'q',
	MONOSPACE: 'monospace',
	SUPERSCRIPT: 'sup',
	COMMENT: '_comment',
	LATEX: '_latex'
};

exports.default = StyleType;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssign = __webpack_require__(16);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _chunkStyleList = __webpack_require__(60);

var _chunkStyleList2 = _interopRequireDefault(_chunkStyleList);

var _styleRange = __webpack_require__(18);

var _styleRange2 = _interopRequireDefault(_styleRange);

var _styleType = __webpack_require__(11);

var _styleType2 = _interopRequireDefault(_styleType);

var _htmlUtil = __webpack_require__(64);

var _htmlUtil2 = _interopRequireDefault(_htmlUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ceiling Infinity end values to the length
var trimStyleRange = function trimStyleRange(styleRange, maxLength) {
	styleRange.end = Math.min(styleRange.end, maxLength);
	return styleRange;
};

var StyleableText = function () {
	function StyleableText(text) {
		_classCallCheck(this, StyleableText);

		if (text == null) {
			text = '';
		}
		this.init();
		this.insertText(0, text);
	}

	_createClass(StyleableText, [{
		key: 'init',
		value: function init() {
			this.styleList = new _chunkStyleList2.default();
			return this.value = '';
		}
	}, {
		key: 'clone',
		value: function clone() {
			var clone = new StyleableText();
			clone.value = this.value;
			clone.styleList = this.styleList.clone();

			return clone;
		}
	}, {
		key: 'getExportedObject',
		value: function getExportedObject() {
			return {
				value: this.value,
				styleList: this.styleList.getExportedObject()
			};
		}
	}, {
		key: 'setText',
		value: function setText(text) {
			this.init();
			return this.insertText(0, text);
		}
	}, {
		key: 'replaceText',
		value: function replaceText(from, to, text) {
			if (text == null || text.length === 0) {
				return this.deleteText(from, to);
			}

			// Goal: The replaced text should adopt the styles of where the range starts.
			// The following combination of commands achieves what we want
			this.insertText(from + 1, text);
			this.normalizeStyles();
			this.deleteText(from, from + 1);
			this.normalizeStyles();
			this.deleteText(from + text.length, to + text.length - 1);
			return this.normalizeStyles();
		}
	}, {
		key: 'appendText',
		value: function appendText(text) {
			return this.insertText(this.length, text);
		}
	}, {
		key: 'insertText',
		value: function insertText(atIndex, text) {
			var insertLength = text.length;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(this.styleList.styles)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var range = _step.value;

					switch (range.compareToRange(atIndex)) {
						case _styleRange2.default.CONTAINS:
							range.end += insertLength;
							break;

						case _styleRange2.default.AFTER:
							range.start += insertLength;
							range.end += insertLength;
							break;
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

			this.value = this.value.substring(0, atIndex) + text + this.value.substring(atIndex);

			return this.normalizeStyles();
		}
	}, {
		key: 'deleteText',
		value: function deleteText(from, to) {
			if (from == null) {
				from = -1;
			}
			if (to == null) {
				to = Infinity;
			}
			if (from > to) {
				return;
			}

			from = Math.max(0, from);
			to = Math.min(to, this.value.length);

			var deleteLength = to - from;

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Array.from(this.styleList.styles)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var range = _step2.value;

					switch (range.compareToRange(from, to)) {
						case _styleRange2.default.CONTAINS:
							range.end -= deleteLength;
							break;

						case _styleRange2.default.INSIDE_LEFT:
							range.end = from;
							break;

						case _styleRange2.default.ENSCAPSULATED_BY:
							range.invalidate();
							break;

						case _styleRange2.default.INSIDE_RIGHT:
							range.start = from;
							range.end -= deleteLength;
							break;

						case _styleRange2.default.AFTER:
							range.start -= deleteLength;
							range.end -= deleteLength;
							break;
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

			this.value = this.value.substring(0, from) + this.value.substring(to);

			return this.normalizeStyles();
		}
	}, {
		key: 'toggleStyleText',
		value: function toggleStyleText(styleType, from, to, styleData) {
			if (from == null) {
				from = 0;
			}
			if (to == null) {
				to = this.length;
			}
			var styleRange = trimStyleRange(new _styleRange2.default(from, to, styleType, styleData), this.value.length);
			if (this.styleList.rangeHasStyle(from, Math.min(to, this.value.length), styleType)) {
				this.styleList.remove(styleRange);
			} else {
				this.styleList.add(styleRange);
			}

			return this.normalizeStyles();
		}
	}, {
		key: 'styleText',
		value: function styleText(styleType, from, to, styleData) {
			if (from == null) {
				from = 0;
			}
			if (to == null) {
				to = this.length;
			}
			var range = new _styleRange2.default(from, to, styleType, styleData);

			var styleRange = trimStyleRange(range, this.value.length);
			this.styleList.add(styleRange);

			return this.normalizeStyles();
		}
	}, {
		key: 'unstyleText',
		value: function unstyleText(styleType, from, to) {
			if (from == null) {
				from = 0;
			}
			if (to == null) {
				to = this.length;
			}
			var styleRange = trimStyleRange(new _styleRange2.default(from, to, styleType), this.value.length);
			this.styleList.remove(styleRange);
			return this.normalizeStyles();
		}
	}, {
		key: 'getStyles',
		value: function getStyles(from, to) {
			return this.styleList.getStylesInRange(from, to);
		}
	}, {
		key: 'split',
		value: function split(atIndex) {
			if (isNaN(atIndex)) {
				return null;
			}

			var splitAtEnd = atIndex === this.value.length;

			var sibling = this.clone();

			this.deleteText(atIndex, this.value.length);

			sibling.deleteText(0, atIndex);

			// special case - if splitting at the end of a line
			// we want to shove the last character styles as
			// initial styles into the new sibling.
			if (splitAtEnd) {
				var lastCharStyles = this.styleList.getStylesInRange(this.value.length - 1, this.value.length);
				for (var style in lastCharStyles) {
					sibling.styleText(style, 0, 0);
				} //@TODO - what about data?
			}

			return sibling;
		}
	}, {
		key: 'normalizeStyles',
		value: function normalizeStyles() {
			return this.styleList.normalize();
		}
	}, {
		key: 'merge',
		value: function merge(otherText, atIndex) {
			if (atIndex == null) {
				atIndex = null;
			}
			if (atIndex == null) {
				atIndex = this.value.length;
			}

			var insertLength = otherText.value.length;

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Array.from(this.styleList.styles)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var range = _step3.value;

					switch (range.compareToRange(atIndex)) {
						case _styleRange2.default.AFTER:
							range.start += insertLength;
							range.end += insertLength;
							break;
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

			this.value = this.value.substring(0, atIndex) + otherText.value + this.value.substring(atIndex);

			this.styleList.normalize();

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Array.from(otherText.styleList.styles)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					range = _step4.value;

					var curRange = range.clone();
					curRange.start += atIndex;
					curRange.end += atIndex;

					this.styleList.add(curRange);
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

			return this.styleList.normalize();
		}
	}, {
		key: '__debug_print',
		value: function __debug_print() {
			var end = void 0,
			    i = void 0;
			var s1 = void 0,
			    s2 = void 0,
			    start = void 0;
			console.log('   |          |' + this.value + ' |');
			var fill = '';
			for (i = 0, end = this.value.length + 10, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
				var asc;
				fill += ' ';
			}

			var j = 0;
			return Array.from(this.styleList.styles).map(function (style) {
				return s1 = (style.type + '          ').substr(0, 10) + '|', s2 = '', function () {
					var result = [];
					for (i = 0, end1 = style.start, asc1 = 0 <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
						var asc1, end1;
						result.push(s2 += '·');
					}
					return result;
				}(), s2 += '<', function () {
					var result1 = [];
					for (start = style.start + 1, i = start, end2 = style.end, asc2 = start <= end2; asc2 ? i < end2 : i > end2; asc2 ? i++ : i--) {
						var asc2, end2;
						result1.push(s2 += '=');
					}
					return result1;
				}(), s2 += '>', function () {
					var result2 = [];
					for (start1 = style.end + 1, i = start1, end3 = fill.length, asc3 = start1 <= end3; asc3 ? i < end3 : i > end3; asc3 ? i++ : i--) {
						var asc3, end3, start1;
						result2.push(s2 += '·');
					}
					return result2;
				}(), console.log((j + '   ').substr(0, 3) + '|' + (s1 + s2 + fill).substr(0, fill.length + 1) + '|' + style.start + ',' + style.end + '|' + JSON.stringify(style.data)), // + '|' + style.__debug
				j++;
			});
		}
	}]);

	return StyleableText;
}();

Object.defineProperties(StyleableText.prototype, {
	"length": {
		get: function get() {
			return this.value.length;
		}
	}
});

StyleableText.createFromObject = function (o) {
	var st = new StyleableText();
	st.styleList = _chunkStyleList2.default.createFromObject(o.styleList);
	st.value = o.value;

	return st;
};

StyleableText.getStylesOfElement = function (el) {
	// console.warn 'MOVE THIS SOMEWHERE ELSE!!!!'

	if (el.nodeType !== Node.ELEMENT_NODE) {
		return [];
	}

	var styles = [];

	var computedStyle = window.getComputedStyle(el);

	// debugger;

	// console.log '___________', el, computedStyle, computedStyle.getPropertyValue('font-weight')

	switch (computedStyle.getPropertyValue('font-weight')) {
		case "bold":case "bolder":case "700":case "800":case "900":
			styles.push({ type: _styleType2.default.BOLD });break;
	}

	switch (computedStyle.getPropertyValue('text-decoration')) {
		case "line-through":
			styles.push({ type: _styleType2.default.STRIKETHROUGH });break;
	}

	switch (computedStyle.getPropertyValue('font-style')) {
		case "italic":
			styles.push({ type: _styleType2.default.ITALIC });break;
	}

	switch (computedStyle.getPropertyValue('font-family').toLowerCase()) {
		case "monospace":
			styles.push({ type: _styleType2.default.MONOSPACE });break;
	}

	// switch computedStyle.getPropertyValue('vertical-align') + "|" + computedStyle.getPropertyValue('font-size')
	// 	when "super|smaller" then styles.push { type:StyleType.SUPERSCRIPT }
	// 	when "sub|smaller"   then styles.push { type:StyleType.SUBSCRIPT }

	switch (el.tagName.toLowerCase()) {
		//when 'b'               then styles.push { type:StyleType.BOLD }
		case 'a':
			if (el.getAttribute('href') != null) {
				styles.push({ type: _styleType2.default.LINK, data: { href: el.getAttribute('href') } });
			}
			break;
		case 'q':
			styles.push({ type: _styleType2.default.QUOTE, data: el.getAttribute('cite') });break;
		//@TODO:
		// when 'abbr', 'acronym' then styles.push { type:StyleType.COMMENT, data:el.getAttribute('title') }
		case 'sup':
			styles.push({ type: _styleType2.default.SUPERSCRIPT, data: 1 });break;
		case 'sub':
			styles.push({ type: _styleType2.default.SUPERSCRIPT, data: -1 });break;
	}
	// @TODO:
	// when 'span'
	// 	if el.classList.contains('comment') and el.hasAttribute('data-additional')
	// 		styles.push { type:StyleType.COMMENT, data:el.getAttribute('data-additional') }

	return styles;
};

StyleableText.createFromElement = function (node) {
	var state = void 0;
	if (node == null) {
		return new StyleableText();
	}

	// console.warn '@TODO - MOVE THIS method somewhere else!'

	if (arguments[1] == null) {
		state = {
			curText: new StyleableText(),
			texts: []
		};
		StyleableText.createFromElement(node, state);

		state.texts.push(state.curText);
		state.curText.styleList.normalize();

		return state.texts;
	}

	state = arguments[1];

	switch (node.nodeType) {
		case Node.TEXT_NODE:
			return state.curText.value += node.nodeValue;
		case Node.ELEMENT_NODE:
			if (state.curText.length > 0 && !_htmlUtil2.default.isElementInline(node)) {
				state.texts.push(state.curText);
				state.curText.styleList.normalize();

				state.curText = new StyleableText();
			}

			var styles = StyleableText.getStylesOfElement(node);
			var ranges = [];
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = Array.from(styles)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var style = _step5.value;

					var styleRange = new _styleRange2.default(state.curText.value.length, Infinity, style.type, style.data);
					ranges.push(styleRange);
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = Array.from(node.childNodes)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var childNode = _step6.value;

					StyleableText.createFromElement(childNode, state);
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			return Array.from(ranges).map(function (range) {
				return range.end = state.curText.value.length, state.curText.styleList.add(range);
			});
	}
};

// @TODO
window.__st = StyleableText;

exports.default = StyleableText;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	EMPTY_CHAR_CODE: 8203,
	EMPTY_CHAR: String.fromCharCode(8203)
};

/***/ }),
/* 14 */
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
				'Accept': 'application/json',
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
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});
	},
	postEvent: function postEvent(lo, eventAction, eventPayload) {
		console.log('POST EVENT', eventPayload);
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(35)() ? Object.setPrototypeOf : __webpack_require__(36);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable no-unused-vars */

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
		var test1 = new String('abc'); // eslint-disable-line
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
	} catch (e) {
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

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _oboModel = __webpack_require__(6);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseSelectionHandler = function () {
	function BaseSelectionHandler() {
		_classCallCheck(this, BaseSelectionHandler);
	}

	_createClass(BaseSelectionHandler, [{
		key: 'getCopyOfSelection',
		value: function getCopyOfSelection(selection, chunk, cloneId) {
			if (cloneId == null) {
				cloneId = false;
			}return chunk.clone(cloneId);
		}
	}, {
		key: 'selectStart',
		value: function selectStart(selection, chunk, asRange) {
			return false;
		}
	}, {
		key: 'selectEnd',
		value: function selectEnd(selection, chunk, asRange) {
			return false;
		}
	}, {
		key: 'selectAll',
		value: function selectAll(selection, chunk) {
			this.selectStart(selection, chunk, true);
			return this.selectEnd(selection, chunk, true);
		}
	}, {
		key: 'getVirtualSelectionStartData',
		value: function getVirtualSelectionStartData(selection, chunk) {
			return null;
		}
	}, {
		key: 'getDOMSelectionStart',
		value: function getDOMSelectionStart(selection, chunk) {
			return null;
		}
	}, {
		key: 'getVirtualSelectionEndData',
		value: function getVirtualSelectionEndData(selection, chunk) {
			return null;
		}
	}, {
		key: 'getDOMSelectionEnd',
		value: function getDOMSelectionEnd(selection, chunk) {
			return null;
		}
	}, {
		key: 'areCursorsEquivalent',
		value: function areCursorsEquivalent(selection, chunk, thisCursorData, otherCursorData) {
			return false;
		}
	}]);

	return BaseSelectionHandler;
}();

exports.default = BaseSelectionHandler;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleType = __webpack_require__(11);

var _styleType2 = _interopRequireDefault(_styleType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleRange = function () {
	function StyleRange(start, end, type, data) {
		_classCallCheck(this, StyleRange);

		if (start == null) {
			start = 0;
		}
		if (end == null) {
			end = 0;
		}
		if (type == null) {
			type = '';
		}
		this.type = type;
		if (data == null) {
			data = {};
		}
		this.data = data;
		this.start = parseInt(start, 10);
		this.end = parseInt(end, 10);
	}

	_createClass(StyleRange, [{
		key: 'clone',
		value: function clone() {
			//@TODO - assumes 'data' is not an object (otherwise we should clone it)
			return new StyleRange(this.start, this.end, this.type, this.data);
		}
	}, {
		key: 'getExportedObject',
		value: function getExportedObject() {
			return {
				type: this.type,
				start: this.start,
				end: this.end,
				data: this.data
			};
		}
	}, {
		key: 'toString',
		value: function toString() {
			return this.type + ":" + this.start + "," + this.end + "(" + this.data + ")";
		}
	}, {
		key: 'isInvalid',
		value: function isInvalid() {
			// @length() is 0 and @start > -1 and @end > -1
			return this.length() === 0 && this.start !== 0 && this.end !== 0;
		}

		// Instead of deleting a range it might be more useful
		// to invalidate it now and delete it later

	}, {
		key: 'invalidate',
		value: function invalidate() {
			return this.start = this.end = -1;
		}
		// @start = @end = 0

	}, {
		key: 'compareToRange',
		value: function compareToRange(from, to) {
			if (to == null) {
				to = from;
			}

			if (from === 0 && this.start === 0 && to <= this.end) {
				return StyleRange.CONTAINS;
			}
			if (to <= this.start) {
				return StyleRange.AFTER;
			}
			if (from > this.end) {
				return StyleRange.BEFORE;
			}
			if (from >= this.start && to <= this.end) {
				return StyleRange.CONTAINS;
			}
			if (from <= this.start && to >= this.end) {
				return StyleRange.ENSCAPSULATED_BY;
			}
			if (from >= this.start) {
				return StyleRange.INSIDE_LEFT;
			}
			return StyleRange.INSIDE_RIGHT;
		}
	}, {
		key: 'length',
		value: function length() {
			return this.end - this.start;
		}
	}, {
		key: 'isMergeable',
		value: function isMergeable(otherType, otherData) {
			if (this.type !== otherType) {
				return false;
			}

			//return false if @type is StyleType.SUPERSCRIPT or @type is StyleType.SUBSCRIPT

			if (this.data instanceof Object) {
				for (var k in this.data) {
					var v = this.data[k];
					if (otherData[k] == null || otherData[k] !== v) {
						return false;
					}
				}
			} else {
				if (this.data !== otherData) {
					return false;
				}
			}

			return true;
		}
	}]);

	return StyleRange;
}();

StyleRange.BEFORE = 'before';
StyleRange.AFTER = 'after';
StyleRange.INSIDE_LEFT = 'left';
StyleRange.INSIDE_RIGHT = 'right';
StyleRange.CONTAINS = 'contains';
StyleRange.ENSCAPSULATED_BY = 'enscapsulatedBy';

StyleRange.createFromObject = function (o) {
	return new StyleRange(o.start, o.end, o.type, o.data);
};

exports.default = StyleRange;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = Object.prototype.toString,
    id = toString.call(function () {
  return arguments;
}());

module.exports = function (x) {
  return toString.call(x) === id;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(85)() ? Object.assign : __webpack_require__(86);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(96)() ? String.prototype.contains : __webpack_require__(97);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var toString = Object.prototype.toString,
    id = toString.call('');

module.exports = function (x) {
		return typeof x === 'string' || x && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && (x instanceof String || toString.call(x) === id) || false;
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clear = __webpack_require__(33),
    assign = __webpack_require__(20),
    callable = __webpack_require__(3),
    value = __webpack_require__(4),
    d = __webpack_require__(5),
    autoBind = __webpack_require__(77),
    _Symbol = __webpack_require__(9),
    defineProperty = Object.defineProperty,
    defineProperties = Object.defineProperties,
    _Iterator;

module.exports = _Iterator = function Iterator(list, context) {
	if (!(this instanceof _Iterator)) return new _Iterator(list, context);
	defineProperties(this, {
		__list__: d('w', value(list)),
		__context__: d('w', context),
		__nextIndex__: d('w', 0)
	});
	if (!context) return;
	callable(context.on);
	context.on('_add', this._onAdd);
	context.on('_delete', this._onDelete);
	context.on('_clear', this._onClear);
};

defineProperties(_Iterator.prototype, assign({
	constructor: d(_Iterator),
	_next: d(function () {
		var i;
		if (!this.__list__) return;
		if (this.__redo__) {
			i = this.__redo__.shift();
			if (i !== undefined) return i;
		}
		if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
		this._unBind();
	}),
	next: d(function () {
		return this._createResult(this._next());
	}),
	_createResult: d(function (i) {
		if (i === undefined) return { done: true, value: undefined };
		return { done: false, value: this._resolve(i) };
	}),
	_resolve: d(function (i) {
		return this.__list__[i];
	}),
	_unBind: d(function () {
		this.__list__ = null;
		delete this.__redo__;
		if (!this.__context__) return;
		this.__context__.off('_add', this._onAdd);
		this.__context__.off('_delete', this._onDelete);
		this.__context__.off('_clear', this._onClear);
		this.__context__ = null;
	}),
	toString: d(function () {
		return '[object Iterator]';
	})
}, autoBind({
	_onAdd: d(function (index) {
		if (index >= this.__nextIndex__) return;
		++this.__nextIndex__;
		if (!this.__redo__) {
			defineProperty(this, '__redo__', d('c', [index]));
			return;
		}
		this.__redo__.forEach(function (redo, i) {
			if (redo >= index) this.__redo__[i] = ++redo;
		}, this);
		this.__redo__.push(index);
	}),
	_onDelete: d(function (index) {
		var i;
		if (index >= this.__nextIndex__) return;
		--this.__nextIndex__;
		if (!this.__redo__) return;
		i = this.__redo__.indexOf(index);
		if (i !== -1) this.__redo__.splice(i, 1);
		this.__redo__.forEach(function (redo, i) {
			if (redo > index) this.__redo__[i] = --redo;
		}, this);
	}),
	_onClear: d(function () {
		if (this.__redo__) clear.call(this.__redo__);
		this.__nextIndex__ = 0;
	})
})));

defineProperty(_Iterator.prototype, _Symbol.iterator, d(function () {
	return this;
}));
defineProperty(_Iterator.prototype, _Symbol.toStringTag, d('', 'Iterator'));

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(242);

exports.default = React.createClass({
	displayName: "delete-button",
	getDefaultProps: function getDefaultProps() {
		return { indent: 0 };
	},
	focus: function focus() {
		return ReactDOM.findDOMNode(this.refs.button).focus();
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "obojobo-draft--components--delete-button" },
			React.createElement(
				"button",
				{
					ref: "button",
					onClick: this.props.onClick,
					tabIndex: this.props.shouldPreventTab ? '-1' : this.props.tabIndex,
					disabled: this.props.shouldPreventTab
				},
				"Delete"
			)
		);
	}
});

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dispatcher = __webpack_require__(1);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
	function Store(name) {
		_classCallCheck(this, Store);

		this.name = name;
	}

	_createClass(Store, [{
		key: 'init',
		value: function init() {
			return this.state = {};
		}
	}, {
		key: 'triggerChange',
		value: function triggerChange() {
			return _dispatcher2.default.trigger(this.name + ':change');
		}
	}, {
		key: 'onChange',
		value: function onChange(callback) {
			return _dispatcher2.default.on(this.name + ':change', callback);
		}
	}, {
		key: 'offChange',
		value: function offChange(callback) {
			return _dispatcher2.default.off(this.name + ':change', callback);
		}
	}, {
		key: 'setAndTrigger',
		value: function setAndTrigger(keyValues) {
			Object.assign(this.state, keyValues); // merge args onto defaults
			return this.triggerChange();
		}
	}, {
		key: 'getState',
		value: function getState() {
			return Object.assign({}, this.state);
		}
	}, {
		key: 'setState',
		value: function setState(newState) {
			return this.state = Object.assign({}, newState);
		}
	}]);

	return Store;
}();

exports.default = Store;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _domSelection = __webpack_require__(10);

var _domSelection2 = _interopRequireDefault(_domSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OboSelectionRect = function OboSelectionRect() {
	_classCallCheck(this, OboSelectionRect);

	this.type = OboSelectionRect.TYPE_NONE;
	this.top = 0;
	this.right = 0;
	this.bottom = 0;
	this.left = 0;
	this.width = 0;
	this.height = 0;
};

Object.defineProperties(OboSelectionRect.prototype, {
	"valid": {
		get: function get() {
			return this.type !== OboSelectionRect.TYPE_NONE;
		}
	}
});

OboSelectionRect.TYPE_NONE = 'none';
OboSelectionRect.TYPE_CARET = 'caret';
OboSelectionRect.TYPE_SELECTION = 'selection';
OboSelectionRect.TYPE_CHUNKS = 'chunks';

OboSelectionRect.createFromSelection = function () {
	var rect = new OboSelectionRect();
	var sel = new _domSelection2.default();

	var selType = sel.getType();

	if (selType === "none") {
		return rect;
	}

	var clientRects = sel.getClientRects();

	rect.type = selType === 'caret' ? OboSelectionRect.TYPE_CARET : OboSelectionRect.TYPE_SELECTION;
	rect.top = Infinity;
	rect.right = -Infinity;
	rect.bottom = -Infinity;
	rect.left = Infinity;

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(clientRects)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var clientRect = _step.value;

			rect.top = Math.min(rect.top, clientRect.top);
			rect.right = Math.max(rect.right, clientRect.right);
			rect.bottom = Math.max(rect.bottom, clientRect.bottom);
			rect.left = Math.min(rect.left, clientRect.left);
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

	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;

	rect.selection = sel;
	rect.chunks = null;

	return rect;
};

OboSelectionRect.createFromChunks = function (chunks) {
	if (chunks == null) {
		chunks = [];
	}
	var rect = new OboSelectionRect();
	rect.type = OboSelectionRect.TYPE_CHUNKS;
	rect.top = Infinity;
	rect.right = -Infinity;
	rect.bottom = -Infinity;
	rect.left = Infinity;

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Array.from(chunks)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var chunk = _step2.value;

			if (chunk == null) {
				continue;
			}

			var chunkRect = chunk.getDomEl().getBoundingClientRect();

			rect.top = Math.min(rect.top, chunkRect.top);
			rect.right = Math.max(rect.right, chunkRect.right);
			rect.bottom = Math.max(rect.bottom, chunkRect.bottom);
			rect.left = Math.min(rect.left, chunkRect.left);
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

	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;

	rect.chunks = chunks;
	rect.selection = null;

	return rect;
};

exports.default = OboSelectionRect;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VirtualCursor = function () {
	function VirtualCursor(chunk, data) {
		_classCallCheck(this, VirtualCursor);

		this.chunk = chunk;
		this.data = data;
	}

	_createClass(VirtualCursor, [{
		key: "isEquivalentTo",
		value: function isEquivalentTo(otherCursor) {
			return this.chunk.areCursorsEquivalent(this, otherCursor);
		}
	}, {
		key: "clone",
		value: function clone() {
			// @chunk.cloneVirtualCaret @
			return new VirtualCursor(this.chunk, Object.assign({}, this.data));
		}
	}]);

	return VirtualCursor;
}();

exports.default = VirtualCursor;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _objectAssign = __webpack_require__(16);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	createData: function createData(data, template) {
		var clone = (0, _objectAssign2.default)({}, data);

		for (var key in clone) {
			if (template[key] == null) {
				delete clone[key];
			}
		}

		for (key in template) {
			if (clone[key] == null) {
				if (_typeof(template[key]) === 'object') {
					clone[key] = (0, _objectAssign2.default)({}, template[key]);
				} else {
					clone[key] = template[key];
				}
			}
		}

		return clone;
	},
	defaultCloneFn: function defaultCloneFn(data) {
		return (0, _objectAssign2.default)({}, data);
	},
	defaultMergeFn: function defaultMergeFn(consumer, digested) {
		return consumer;
	}
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dispatcher = __webpack_require__(1);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _oboModel = __webpack_require__(6);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FocusUtil = {
	focusComponent: function focusComponent(id) {
		return _dispatcher2.default.trigger('focus:component', {
			value: {
				id: id
			}
		});
	},
	unfocus: function unfocus() {
		return _dispatcher2.default.trigger('focus:unfocus');
	},
	getFocussedComponent: function getFocussedComponent(state) {
		return _oboModel2.default.models[state.focussedId];
	}
};

exports.default = FocusUtil;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _navUtil = __webpack_require__(8);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _apiUtil = __webpack_require__(14);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _ObojoboDraft2.default.flux.Store;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var OboModel = _ObojoboDraft2.default.models.OboModel;

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
			'nav:disable': function navDisable(payload) {
				return _this.setAndTrigger({ disabled: true, locked: true, open: false });
			},
			'nav:enable': function navEnable(payload) {
				return _this.setAndTrigger({ disabled: false, locked: false });
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
				return _navUtil2.default.goto(_navUtil2.default.getFirst(this.state).id);
			}
		}
	}, {
		key: 'buildMenu',
		value: function buildMenu(model) {
			this.state.itemsById = {};
			this.state.itemsByPath = {};
			this.state.itemsByFullPath = {};
			return this.state.items = this.generateNav(model);
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
			if (indent == null) {
				indent = '';
			}
			var item = _ObojoboDraft2.default.Store.getItemForType(model.get('type'));

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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var OboModel = _ObojoboDraft2.default.models.OboModel;


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
/* 32 */
/***/ (function(module, exports) {

module.exports = katex;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear



var value = __webpack_require__(4);

module.exports = function () {
	value(this).length = 0;
	return this;
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var forEach = Array.prototype.forEach,
    create = Object.create;

var process = function process(src, obj) {
	var key;
	for (key in src) {
		obj[key] = src[key];
	}
};

module.exports = function (options /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (options == null) return;
		process(Object(options), result);
	});
	return result;
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var create = Object.create,
    getPrototypeOf = Object.getPrototypeOf,
    x = {};

module.exports = function () /*customCreate*/{
	var setPrototypeOf = Object.setPrototypeOf,
	    customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== 'function') return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), x)) === x;
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554



var isObject = __webpack_require__(91),
    value = __webpack_require__(4),
    isPrototypeOf = Object.prototype.isPrototypeOf,
    defineProperty = Object.defineProperty,
    nullDesc = { configurable: true, enumerable: false, writable: true,
	value: undefined },
    validate;

validate = function validate(obj, prototype) {
	value(obj);
	if (prototype === null || isObject(prototype)) return obj;
	throw new TypeError('Prototype must be null or an object');
};

module.exports = function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function fn(obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function fn(obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = isPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, '__proto__', nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, 'level', { configurable: false,
		enumerable: false, writable: false, value: status.level });
}(function () {
	var x = Object.create(null),
	    y = {},
	    set,
	    desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');

	if (desc) {
		try {
			set = desc.set; // Opera crashes at this point
			set.call(x, y);
		} catch (ignore) {}
		if (Object.getPrototypeOf(x) === y) return { set: set, level: 2 };
	}

	x.__proto__ = y;
	if (Object.getPrototypeOf(x) === y) return { level: 2 };

	x = {};
	x.__proto__ = y;
	if (Object.getPrototypeOf(x) === y) return { level: 1 };

	return false;
}());

__webpack_require__(88);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isIterable = __webpack_require__(101);

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getDefaultBulletStyle = function getDefaultBulletStyle(indent, type) {
	var defaults = type === 'ordered' ? orderedDefaultBulletStyles : unorderedDefaultBulletStyles;
	return defaults[indent % defaults.length];
};

var getStyleWithDefaults = function getStyleWithDefaults(indent, defaultType, style) {
	if (style == null) {
		style = null;
	}
	var styleWithDefaults = new ListStyle();

	styleWithDefaults.type = (style != null ? style.type : undefined) ? style.type : defaultType;
	styleWithDefaults.start = (style != null ? style.start : undefined) ? style.start : 1;
	styleWithDefaults.bulletStyle = (style != null ? style.bulletStyle : undefined) ? style.bulletStyle : getDefaultBulletStyle(indent, styleWithDefaults.type);

	return styleWithDefaults;
};

var ListStyle = function () {
	function ListStyle(opts) {
		_classCallCheck(this, ListStyle);

		if (opts == null) {
			opts = {};
		}
		this.type = opts.type || null;
		this.start = opts.start || null;
		this.bulletStyle = opts.bulletStyle || null;
	}

	_createClass(ListStyle, [{
		key: 'toDescriptor',
		value: function toDescriptor() {
			return {
				type: this.type || null,
				start: this.start || null,
				bulletStyle: this.bulletStyle || null
			};
		}
	}, {
		key: 'clone',
		value: function clone() {
			return new ListStyle(this);
		}
	}]);

	return ListStyle;
}();

var ListStyles = function () {
	function ListStyles(type) {
		_classCallCheck(this, ListStyles);

		this.type = type;
		this.styles = {};
	}

	_createClass(ListStyles, [{
		key: 'init',
		value: function init() {
			this.type = ListStyles.TYPE_UNORDERED;
			return this.styles = {};
		}
	}, {
		key: 'set',
		value: function set(indent, opts) {
			return this.styles[indent] = new ListStyle(opts);
		}
	}, {
		key: 'get',
		value: function get(indent) {
			return getStyleWithDefaults(indent, this.type, this.styles[indent]);
		}
	}, {
		key: 'getSetStyles',
		value: function getSetStyles(indent) {
			var style = this.styles[indent];
			if (!style) {
				return new ListStyle();
			}

			return style;
		}
	}, {
		key: 'toDescriptor',
		value: function toDescriptor() {
			var desc = {
				type: this.type,
				indents: {}
			};

			for (var indent in this.styles) {
				var style = this.styles[indent];
				desc.indents[indent] = style.toDescriptor();
			}

			return desc;
		}
	}, {
		key: 'clone',
		value: function clone() {
			var clone = new ListStyles(this.type);

			for (var indent in this.styles) {
				var style = this.styles[indent];
				clone.styles[indent] = style.clone();
			}

			return clone;
		}
	}, {
		key: 'map',
		value: function map(fn) {
			var _this = this;

			return function () {
				var result = [];
				for (var indent in _this.styles) {
					var style = _this.styles[indent];
					result.push(fn(style, indent));
				}
				return result;
			}();
		}
	}]);

	return ListStyles;
}();

ListStyles.fromDescriptor = function (descriptor) {
	var styles = new ListStyles(descriptor.type);

	for (var indent in descriptor.indents) {
		var style = descriptor.indents[indent];
		styles.set(indent, style);
	}

	return styles;
};

ListStyles.TYPE_ORDERED = 'ordered';
ListStyles.TYPE_UNORDERED = 'unordered';

ListStyles.STYLE_FILLED_CIRCLE = 'disc';
ListStyles.STYLE_HOLLOW_CIRCLE = 'circle';
ListStyles.STYLE_SQUARE = 'square';

ListStyles.STYLE_NUMERIC = 'decimal';
ListStyles.STYLE_LEAD_ZERO_NUMERIC = 'decimal-leading-zero';
ListStyles.STYLE_LOWERCASE_LETTER = 'lower-alpha';
ListStyles.STYLE_UPPERCASE_LETTER = 'upper-alpha';
ListStyles.STYLE_LOWERCASE_ROMAN = 'lower-roman';
ListStyles.STYLE_UPPERCASE_ROMAN = 'upper-roman';

var unorderedDefaultBulletStyles = [ListStyles.STYLE_FILLED_CIRCLE, ListStyles.STYLE_HOLLOW_CIRCLE, ListStyles.STYLE_SQUARE];

var orderedDefaultBulletStyles = [ListStyles.STYLE_NUMERIC, ListStyles.STYLE_UPPERCASE_LETTER, ListStyles.STYLE_UPPERCASE_ROMAN, ListStyles.STYLE_LOWERCASE_LETTER, ListStyles.STYLE_LOWERCASE_ROMAN];

exports.default = ListStyles;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextGroup = _ObojoboDraft2.default.textGroup.TextGroup;
var TextGroupItem = _ObojoboDraft2.default.textGroup.TextGroupItem;

var Util = _ObojoboDraft2.default.textGroup.TextGroupUtil;
var StyleableText = _ObojoboDraft2.default.text.StyleableText;

var GridTextGroup = function (_TextGroup) {
	_inherits(GridTextGroup, _TextGroup);

	function GridTextGroup(numRows, numCols, dataTemplate, initialItems) {
		_classCallCheck(this, GridTextGroup);

		var _this = _possibleConstructorReturn(this, (GridTextGroup.__proto__ || Object.getPrototypeOf(GridTextGroup)).call(this, numRows * numCols, dataTemplate, initialItems));

		_this.numRows = numRows;
		_this.numCols = numCols;
		_this.setDimensions();
		return _this;
	}

	_createClass(GridTextGroup, [{
		key: 'addRow',
		value: function addRow(rowIndex, text, data) {
			if (rowIndex == null) {
				rowIndex = this.numRows;
			}
			if (text == null) {
				text = null;
			}
			if (data == null) {
				data = null;
			}
			console.log('addRow', rowIndex);
			// 0 | 1 | 2
			// 3 | 4 | 5
			// 6 | 7 | 8

			this.maxItems += this.numCols;

			var firstInRowIndex = rowIndex * this.numCols;
			for (var i = firstInRowIndex, end = firstInRowIndex + this.numCols - 1, asc = firstInRowIndex <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
				this.addAt(i, text, data);
			}

			this.numRows++;

			return this;
		}
	}, {
		key: 'addCol',
		value: function addCol(colIndex, text, data) {
			if (colIndex == null) {
				colIndex = this.numCols;
			}
			if (text == null) {
				text = null;
			}
			if (data == null) {
				data = null;
			}
			this.maxItems += this.numRows;

			for (var i = this.numRows - 1; i >= 0; i--) {
				this.addAt(i * this.numCols + colIndex, text, data);
			}

			this.numCols++;

			return this;
		}
	}, {
		key: 'removeRow',
		value: function removeRow(rowIndex) {
			if (rowIndex == null) {
				rowIndex = this.numRows - 1;
			}
			this.maxItems -= this.numCols;

			var firstInRowIndex = rowIndex * this.numCols;
			for (var i = firstInRowIndex, end = firstInRowIndex + this.numCols - 1, asc = firstInRowIndex <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
				this.remove(firstInRowIndex);
			}

			this.numRows--;

			return this;
		}
	}, {
		key: 'removeCol',
		value: function removeCol(colIndex) {
			if (colIndex == null) {
				colIndex = this.numCols - 1;
			}
			this.maxItems -= this.numRows;

			for (var i = this.numRows - 1; i >= 0; i--) {
				this.remove(i * this.numCols + colIndex);
			}

			this.numCols--;

			return this;
		}
	}, {
		key: 'setDimensions',
		value: function setDimensions(numRows, numCols) {
			while (this.numRows < numRows) {
				this.addRow();
			}

			while (this.numRows > numRows) {
				this.removeRow();
			}

			while (this.numCols < numCols) {
				this.addCol();
			}

			while (this.numCols > numCols) {
				this.removeCol();
			}

			return this;
		}
	}, {
		key: 'getCellPositionForIndex',
		value: function getCellPositionForIndex(index) {
			console.log('gcpfi', index);
			var row = Math.floor(index / this.numCols);

			return {
				row: row,
				col: index - row * this.numCols
			};
		}
	}, {
		key: 'getIndexForCellPosition',
		value: function getIndexForCellPosition(cellPos) {
			if (cellPos.row < 0 || cellPos.row > this.numRows - 1 || cellPos.col < 0 || cellPos.col > this.numCols - 1) {
				return -1;
			}

			return cellPos.row * this.numCols + cellPos.col;
		}
	}, {
		key: 'clone',
		value: function clone(cloneDataFn) {
			if (cloneDataFn == null) {
				cloneDataFn = Util.defaultCloneFn;
			}
			var clonedItems = [];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(this.items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var item = _step.value;

					clonedItems.push(item.clone(cloneDataFn));
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

			return new GridTextGroup(this.numRows, this.numCols, this.dataTemplate, clonedItems);
		}
	}, {
		key: 'toDescriptor',
		value: function toDescriptor(dataToDescriptorFn) {
			if (dataToDescriptorFn == null) {
				dataToDescriptorFn = Util.defaultCloneFn;
			}
			var desc = [];

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Array.from(this.items)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;

					desc.push({ text: item.text.getExportedObject(), data: dataToDescriptorFn(item.data) });
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

			return {
				textGroup: desc,
				numRows: this.numRows,
				numCols: this.numCols
			};
		}
	}, {
		key: '__grid_print',
		value: function __grid_print() {
			var _this2 = this;

			var s = void 0;
			var i = void 0,
			    item = void 0;
			console.log('========================');
			return __range__(0, this.numRows, false).map(function (row) {
				return (
					// console.log 'row', row
					s = [], __range__(0, _this2.numCols, false).map(function (col) {
						return (
							// console.log '  col', col
							i = row * _this2.numCols + col,

							// console.log '    i', i
							item = _this2.items[i], s.push((item.text.value + '          ').substr(0, 10))
						);
					}), console.log(s)
				);
			});
		}
	}]);

	return GridTextGroup;
}(TextGroup);
// console.log '---------------------'


GridTextGroup.fromDescriptor = function (descriptor, maxItems, dataTemplate, restoreDataDescriptorFn) {
	if (restoreDataDescriptorFn == null) {
		restoreDataDescriptorFn = Util.defaultCloneFn;
	}
	var items = [];
	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = Array.from(descriptor.textGroup)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var item = _step3.value;

			items.push(new TextGroupItem(StyleableText.createFromObject(item.text), restoreDataDescriptorFn(item.data)));
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

	return new GridTextGroup(descriptor.numRows, descriptor.numCols, dataTemplate, items);
};

GridTextGroup.create = function (numRows, numCols, dataTemplate) {
	if (dataTemplate == null) {
		dataTemplate = {};
	}
	var group = new GridTextGroup(numRows, numCols, dataTemplate);
	group.init(group.maxItems);

	return group;
};

// window.GridTextGroup = GridTextGroup

// window.g = new GridTextGroup(2,2)
// g.init(4)
// g.get(0).text.value = 'a0'
// g.get(1).text.value = 'a1'
// g.get(2).text.value = 'b0'
// g.get(3).text.value = 'b1'

exports.default = GridTextGroup;


function __range__(left, right, inclusive) {
	var range = [];
	var ascending = left < right;
	var end = !inclusive ? right : ascending ? right + 1 : right - 1;
	for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
		range.push(i);
	}
	return range;
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectionHandler = void 0;

var TextGroupSelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;
var TextGroupSelection = _ObojoboDraft2.default.textGroup.TextGroupSelection;

exports.default = SelectionHandler = function (_TextGroupSelectionHa) {
	_inherits(SelectionHandler, _TextGroupSelectionHa);

	function SelectionHandler() {
		_classCallCheck(this, SelectionHandler);

		return _possibleConstructorReturn(this, (SelectionHandler.__proto__ || Object.getPrototypeOf(SelectionHandler)).apply(this, arguments));
	}

	_createClass(SelectionHandler, [{
		key: 'selectAll',
		value: function selectAll(selection, chunk) {
			var tgs = new TextGroupSelection(chunk, selection.virtual);

			if (tgs.type !== 'multipleTextSpan') {
				return tgs.selectText(tgs.start.groupIndex);
			} else {
				return tgs.selectGroup();
			}
		}
	}]);

	return SelectionHandler;
}(TextGroupSelectionHandler);

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseSelectionHandler = __webpack_require__(17);

var _baseSelectionHandler2 = _interopRequireDefault(_baseSelectionHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FocusableSelectionHandler = function (_BaseSelectionHandler) {
	_inherits(FocusableSelectionHandler, _BaseSelectionHandler);

	function FocusableSelectionHandler() {
		_classCallCheck(this, FocusableSelectionHandler);

		return _possibleConstructorReturn(this, (FocusableSelectionHandler.__proto__ || Object.getPrototypeOf(FocusableSelectionHandler)).apply(this, arguments));
	}

	_createClass(FocusableSelectionHandler, [{
		key: 'getVirtualSelectionStartData',
		value: function getVirtualSelectionStartData(selection, chunk) {
			return {
				groupIndex: 'anchor:main',
				offset: 0
			};
		}
	}, {
		key: 'getVirtualSelectionEndData',
		value: function getVirtualSelectionEndData(selection, chunk) {
			return {
				groupIndex: 'anchor:main',
				offset: 0
			};
		}
	}, {
		key: 'getDOMSelectionStart',
		value: function getDOMSelectionStart(selection, chunk) {
			return {
				textNode: chunk.getDomEl().getElementsByClassName('anchor')[0].childNodes[0],
				offset: 0
			};
		}
	}, {
		key: 'getDOMSelectionEnd',
		value: function getDOMSelectionEnd(selection, chunk) {
			return {
				textNode: chunk.getDomEl().getElementsByClassName('anchor')[0].childNodes[0],
				offset: 0
			};
		}
	}, {
		key: 'selectStart',
		value: function selectStart(selection, chunk, asRange) {
			selection.virtual.setStart(chunk, { groupIndex: 'anchor:main', offset: 0 });
			if (!asRange) {
				return selection.virtual.collapse();
			}
		}
	}, {
		key: 'selectEnd',
		value: function selectEnd(selection, chunk, asRange) {
			selection.virtual.setEnd(chunk, { groupIndex: 'anchor:main', offset: 0 });
			if (!asRange) {
				return selection.virtual.collapseToEnd();
			}
		}
	}, {
		key: 'areCursorsEquivalent',
		value: function areCursorsEquivalent(selectionWhichIsNullTODO, chunk, thisCursorData, otherCursorData) {
			return thisCursorData.offset === otherCursorData.offset && thisCursorData.groupIndex === otherCursorData.groupIndex;
		}
	}]);

	return FocusableSelectionHandler;
}(_baseSelectionHandler2.default);

exports.default = FocusableSelectionHandler;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _textGroup = __webpack_require__(59);

var _textGroup2 = _interopRequireDefault(_textGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroupAdapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.textGroup;
		}) != null) {
			return model.modelState.textGroup = _textGroup2.default.fromDescriptor(attrs.content.textGroup, Infinity, { indent: 0, align: 'left' });
		} else {
			return model.modelState.textGroup = _textGroup2.default.create(Infinity, { indent: 0, align: 'left' });
		}
	},
	clone: function clone(model, _clone) {
		return _clone.modelState.textGroup = model.modelState.textGroup.clone();
	},
	toJSON: function toJSON(model, json) {
		return json.content.textGroup = model.modelState.textGroup.toDescriptor();
	},
	toText: function toText(model) {
		return model.modelState.textGroup.first.text.value;
	}
};

exports.default = TextGroupAdapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _textConstants = __webpack_require__(13);

var _domUtil = __webpack_require__(7);

var _domUtil2 = _interopRequireDefault(_domUtil);

var _styleableTextComponent = __webpack_require__(61);

var _styleableTextComponent2 = _interopRequireDefault(_styleableTextComponent);

var _dispatcher = __webpack_require__(1);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var varRegex = /\{\{(.+?)\}\}/;

var TextGroupEl = React.createClass({
	displayName: 'TextGroupEl',

	statics: {
		getTextElement: function getTextElement(chunk, groupIndex) {
			return chunk.getDomEl().querySelector('*[data-group-index=\'' + groupIndex + '\']');
		},
		getTextElementAtCursor: function getTextElementAtCursor(virtualCursor) {
			return TextGroupEl.getTextElement(virtualCursor.chunk, virtualCursor.data.groupIndex);
		},
		getDomPosition: function getDomPosition(virtualCursor) {
			// console.log 'TGE.gDP', virtualCursor

			var textNode = void 0;
			var totalCharactersFromStart = 0;

			var element = TextGroupEl.getTextElementAtCursor(virtualCursor);

			// console.log 'element', element

			if (!element) {
				return null;
			}

			if (element != null) {
				// console.log 'tnodes', DOMUtil.getTextNodesInOrder(element), virtualCursor.data.offset
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = Array.from(_domUtil2.default.getTextNodesInOrder(element))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						textNode = _step.value;

						if (totalCharactersFromStart + textNode.nodeValue.length >= virtualCursor.data.offset) {
							return { textNode: textNode, offset: virtualCursor.data.offset - totalCharactersFromStart };
						}
						totalCharactersFromStart += textNode.nodeValue.length;
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

			// There are no text nodes or something went really wrong, so return 0! ¯\_(ツ)_/¯
			return { textNode: null, offset: 0 };
		}
	},

	componentDidUpdate: function componentDidUpdate() {
		return console.timeEnd('textRender');
	},
	render: function render() {
		console.time('textRender');

		var text = this.props.textItem.text;


		if (this.props.parentModel && text.value.indexOf('{{')) {
			var match = null;
			text = text.clone();

			while ((match = varRegex.exec(text.value)) !== null) {
				var variable = match[1];
				var event = { text: '' };
				// window.ObojoboDraft.Store.getTextForVariable(event, variable, @props.parentModel, this.props.moduleData)
				_dispatcher2.default.trigger('getTextForVariable', event, variable, this.props.parentModel);
				if (event.text === null) {
					event.text = match[1];
				}
				event.text = '' + event.text;

				var startIndex = text.value.indexOf(match[0], varRegex.lastIndex);
				text.replaceText(startIndex, startIndex + match[0].length, event.text);
			}
		}

		return React.createElement(
			'span',
			{ className: 'text align-' + this.props.textItem.data.align, 'data-group-index': this.props.groupIndex, 'data-indent': this.props.textItem.data.indent },
			React.createElement(_styleableTextComponent2.default, { text: text })
		);
	}
});

window.__gdp = TextGroupEl.getDomPosition;

exports.default = TextGroupEl;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _textConstants = __webpack_require__(13);

exports.default = React.createClass({
	displayName: 'anchor',
	render: function render() {
		return React.createElement(
			'span',
			_extends({}, this.props, {
				className: 'anchor',
				ref: 'anchorElement',
				contentEditable: 'true',
				tabIndex: this.props.shouldPreventTab ? '-1' : '',
				suppressContentEditableWarning: true,
				'data-group-index': 'anchor:' + this.props.name
			}),
			_textConstants.EMPTY_CHAR
		);
	}
});

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(241);

exports.default = React.createClass({
	displayName: 'button',
	getDefaultProps: function getDefaultProps() {
		return {
			value: null,
			disabled: false,
			align: 'center'
		};
	},
	focus: function focus() {
		return ReactDOM.findDOMNode(this.refs.button).focus();
	},
	render: function render() {
		var children = void 0;
		if (this.props.value) {
			children = this.props.value;
		} else {
			children = this.props.children;
		}

		return React.createElement(
			'div',
			{ className: "obojobo-draft--components--button" + (this.props.dangerous ? ' dangerous' : '') + (this.props.altAction ? ' alt-action' : '') + (' align-' + this.props.align) },
			React.createElement(
				'button',
				{
					ref: 'button',
					onClick: this.props.onClick,
					tabIndex: this.props.shouldPreventTab ? '-1' : this.props.tabIndex,
					disabled: this.props.disabled || this.props.shouldPreventTab
				},
				children
			)
		);
	}
});

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(246);

exports.default = React.createClass({
	displayName: "bubble",
	render: function render() {
		return React.createElement(
			"div",
			{ className: "obojobo-draft--components--modal--bubble" },
			React.createElement(
				"div",
				{ className: "container" },
				this.props.children
			)
		);
	}
});

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

__webpack_require__(248);

var _button = __webpack_require__(45);

var _button2 = _interopRequireDefault(_button);

var _deleteButton = __webpack_require__(24);

var _deleteButton2 = _interopRequireDefault(_deleteButton);

var _modal = __webpack_require__(49);

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = React.createClass({
	displayName: 'dialog',
	getDefaultProps: function getDefaultProps() {
		return { centered: true };
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		return function () {
			var result = [];
			for (var index = 0; index < _this.props.buttons.length; index++) {
				var button = _this.props.buttons[index];
				var item = void 0;
				if (button.default) {
					item = _this.refs['button' + index].focus();
				}
				result.push(item);
			}
			return result;
		}();
	},
	focusOnFirstElement: function focusOnFirstElement() {
		return this.refs.button0.focus();
	},
	render: function render() {
		var styles = null;
		if (this.props.width) {
			styles = { width: this.props.width };
		}

		return React.createElement(
			'div',
			{ className: 'obojobo-draft--components--modal--dialog', style: styles },
			React.createElement(
				_modal2.default,
				{ onClose: this.props.onClose, focusOnFirstElement: this.focusOnFirstElement },
				this.props.title ? React.createElement(
					'h1',
					{ className: 'heading', style: { textAlign: this.props.centered ? 'center' : null } },
					this.props.title
				) : null,
				React.createElement(
					'div',
					{ className: 'dialog-content', style: { textAlign: this.props.centered ? 'center' : null } },
					this.props.children
				),
				React.createElement(
					'div',
					{ className: 'controls' },
					this.props.buttons.map(function (buttonPropsOrText, index) {
						if (typeof buttonPropsOrText === "string") {
							return React.createElement(
								'span',
								{ key: index, className: 'text' },
								buttonPropsOrText
							);
						}
						buttonPropsOrText.key = index;
						return React.createElement(_button2.default, _extends({ ref: 'button' + index }, buttonPropsOrText));
					})
				)
			)
		);
	}
});

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(249);

var _simpleDialog = __webpack_require__(50);

var _simpleDialog2 = _interopRequireDefault(_simpleDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = React.createClass({
	displayName: 'error-dialog',
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'obojobo-draft--components--modal--error-dialog' },
			React.createElement(
				_simpleDialog2.default,
				{ ok: true, title: this.props.title },
				this.props.children
			)
		);
	}
});

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(250);

var _deleteButton = __webpack_require__(24);

var _deleteButton2 = _interopRequireDefault(_deleteButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = React.createClass({
	displayName: 'modal',
	componentDidMount: function componentDidMount() {
		if (this.props.onClose) {
			return document.addEventListener('keyup', this.onKeyUp);
		}
	},
	componentWillUnmount: function componentWillUnmount() {
		if (this.props.onClose) {
			return document.removeEventListener('keyup', this.onKeyUp);
		}
	},
	onKeyUp: function onKeyUp(event) {
		if (event.keyCode === 27) {
			//ESC
			return this.props.onClose();
		}
	},
	onTabTrapFocus: function onTabTrapFocus() {
		if (this.props.onClose) {
			return this.refs.closeButton.focus();
		} else if (this.props.focusOnFirstElement) {
			return this.props.focusOnFirstElement();
		}
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'obojobo-draft--components--modal--modal' },
			React.createElement('input', { className: 'first-tab', ref: 'firstTab', type: 'text', onFocus: this.onTabTrapFocus }),
			this.props.onClose ? React.createElement(_deleteButton2.default, { ref: 'closeButton', onClick: this.props.onClose }) : null,
			React.createElement(
				'div',
				{ className: 'content' },
				this.props.children
			),
			React.createElement('input', { className: 'last-tab', ref: 'lastTab', type: 'text', onFocus: this.onTabTrapFocus })
		);
	}
});

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(251);

var _modalUtil = __webpack_require__(65);

var _modalUtil2 = _interopRequireDefault(_modalUtil);

var _dialog = __webpack_require__(47);

var _dialog2 = _interopRequireDefault(_dialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = React.createClass({
	displayName: 'simple-dialog',
	getDefaultProps: function getDefaultProps() {
		return {
			ok: false,
			noOrYes: false,
			yesOrNo: false,
			cancelOk: false,
			title: null,
			width: null,
			onCancel: function onCancel() {
				return _modalUtil2.default.hide();
			},
			onConfirm: function onConfirm() {
				return _modalUtil2.default.hide();
			}
		};
	},
	render: function render() {
		var buttons = void 0;
		var cancelButton = null;
		var confirmButton = null;
		if (this.props.ok) {
			buttons = [{
				value: 'OK',
				onClick: this.props.onConfirm,
				default: true
			}];
		} else if (this.props.noOrYes) {
			buttons = [{
				value: 'No',
				onClick: this.props.onCancel
			}, 'or', {
				value: 'Yes',
				onClick: this.props.onConfirm,
				default: true
			}];
		} else if (this.props.yesOrNo) {
			buttons = [{
				value: 'Yes',
				onClick: this.props.onConfirm
			}, 'or', {
				value: 'No',
				onClick: this.props.onCancel,
				default: true
			}];
		} else if (this.props.cancelOk) {
			buttons = [{
				value: 'Cancel',
				altAction: true,
				onClick: this.props.onCancel
			}, {
				value: 'OK',
				onClick: this.props.onConfirm,
				default: true
			}];
		}

		return React.createElement(
			'div',
			{ className: 'obojobo-draft--components--modal--simple-dialog' },
			React.createElement(
				_dialog2.default,
				{ centered: true, buttons: buttons, title: this.props.title, width: this.props.width },
				this.props.children
			)
		);
	}
});

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MockElement = function () {
	function MockElement(type, attrs) {
		_classCallCheck(this, MockElement);

		this.type = type;
		if (attrs == null) {
			attrs = {};
		}
		this.attrs = attrs;
		this.nodeType = 'element';
		this.children = [];
		this.parent = null;
	}

	_createClass(MockElement, [{
		key: "addChild",
		value: function addChild(child) {
			this.children.push(child);
			return child.parent = this;
		}
	}, {
		key: "addChildAt",
		value: function addChildAt(child, atIndex) {
			this.children.splice(atIndex, 0, child);
			return child.parent = this;
		}
	}, {
		key: "getChildIndex",
		value: function getChildIndex(child) {
			return this.children.indexOf(child);
		}
	}, {
		key: "addBefore",
		value: function addBefore(childToAdd, targetChild) {
			var index = this.getChildIndex(targetChild);
			return this.addChildAt(childToAdd, index);
		}
	}, {
		key: "addAfter",
		value: function addAfter(childToAdd, targetChild) {
			var index = this.getChildIndex(targetChild);
			return this.addChildAt(childToAdd, index + 1);
		}
	}, {
		key: "replaceChild",
		value: function replaceChild(childToReplace, newChild) {
			var index = this.getChildIndex(childToReplace);
			this.children[index] = newChild;
			newChild.parent = this;
			return childToReplace.parent = null;
		}
	}]);

	return MockElement;
}();

Object.defineProperties(MockElement.prototype, {
	"firstChild": {
		get: function get() {
			return this.children[0];
		}
	},
	"lastChild": {
		get: function get() {
			return this.children[this.children.length - 1];
		}
	}
});

exports.default = MockElement;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MockTextNode = function MockTextNode(text) {
	_classCallCheck(this, MockTextNode);

	if (text == null) {
		text = '';
	}
	this.text = text;
	this.nodeType = 'text';
	this.parent = null;
};

exports.default = MockTextNode;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _domUtil = __webpack_require__(7);

var _domUtil2 = _interopRequireDefault(_domUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cursor = function () {
	function Cursor(chunk, node, offset) {
		_classCallCheck(this, Cursor);

		if (chunk == null) {
			chunk = null;
		}
		this.chunk = chunk;
		if (node == null) {
			node = null;
		}
		this.node = node;
		if (offset == null) {
			offset = null;
		}
		this.offset = offset;
		this.textNode = _domUtil2.default.getFirstTextNodeOfElement(this.node);
		this.isValid = this.chunk !== null && this.offset !== null;
		this.isText = this.isValid && this.textNode !== null;
	}

	_createClass(Cursor, [{
		key: 'clone',
		value: function clone() {
			return new Cursor(this.chunk, this.node, this.offset);
		}
	}]);

	return Cursor;
}();

exports.default = Cursor;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _virtualCursor = __webpack_require__(27);

var _virtualCursor2 = _interopRequireDefault(_virtualCursor);

var _domUtil = __webpack_require__(7);

var _domUtil2 = _interopRequireDefault(_domUtil);

var _domSelection = __webpack_require__(10);

var _domSelection2 = _interopRequireDefault(_domSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VirtualSelection = function () {
	function VirtualSelection(page) {
		_classCallCheck(this, VirtualSelection);

		this.page = page;
		this.clear();
	}

	_createClass(VirtualSelection, [{
		key: 'clear',
		value: function clear() {
			this.start = null;
			return this.end = null;
		}
	}, {
		key: 'clone',
		value: function clone() {
			var virtSel = new VirtualSelection(this.page);
			virtSel.start = this.start.clone();
			virtSel.end = this.end.clone();

			return virtSel;
		}
	}, {
		key: 'getPosition',
		value: function getPosition(chunk) {
			if ((this.start != null ? this.start.chunk : undefined) == null || (this.end != null ? this.end.chunk : undefined) == null) {
				return 'unknown';
			}

			var chunkIndex = chunk.get('index');
			var startIndex = this.start.chunk.get('index');
			var endIndex = this.end.chunk.get('index');

			if (chunkIndex < startIndex) {
				return 'before';
			}
			if (chunkIndex === startIndex && chunkIndex === endIndex) {
				return 'contains';
			}
			if (chunkIndex === startIndex) {
				return 'start';
			}
			if (chunkIndex < endIndex) {
				return 'inside';
			}
			if (chunkIndex === endIndex) {
				return 'end';
			}
			return 'after';
		}
	}, {
		key: 'collapse',
		value: function collapse() {
			return this.end = this.start.clone();
		}
	}, {
		key: 'collapseToEnd',
		value: function collapseToEnd() {
			return this.start = this.end.clone();
		}
	}, {
		key: 'setStart',
		value: function setStart(chunk, data) {
			return this.start = new _virtualCursor2.default(chunk, data);
		}
	}, {
		key: 'setEnd',
		value: function setEnd(chunk, data) {
			return this.end = new _virtualCursor2.default(chunk, data);
		}
	}, {
		key: 'setCaret',
		value: function setCaret(chunk, data) {
			this.setStart(chunk, data);
			return this.collapse();
		}
	}, {
		key: 'toObject',
		value: function toObject() {
			var end = void 0,
			    start = void 0;
			if ((this.start != null ? this.start.chunk : undefined) == null || (this.start != null ? this.start.data : undefined) == null) {
				start = {
					index: -1,
					data: {}
				};
			} else {
				start = {
					index: this.start.chunk.get('index'),
					data: Object.assign({}, this.start.data)
				};
			}

			if ((this.end != null ? this.end.chunk : undefined) == null || (this.end != null ? this.end.data : undefined) == null) {
				end = {
					index: -1,
					data: {}
				};
			} else {
				end = {
					index: this.end.chunk.get('index'),
					data: Object.assign({}, this.end.data)
				};
			}

			return {
				start: start,
				end: end
			};
		}
	}, {
		key: 'fromObject',
		value: function fromObject(o) {
			this.setStart(this.page.chunks.at(o.start.index), o.start.data);
			return this.setEnd(this.page.chunks.at(o.end.index), o.end.data);
		}
	}, {
		key: 'fromDOMSelection',
		value: function fromDOMSelection(domSelection) {
			// console.log 'VS.fDS', domSelection
			if (domSelection == null) {
				domSelection = null;
			}
			if (domSelection == null) {
				domSelection = _domSelection2.default.get();
			}

			// console.log('page be all', @page)

			var startChunkIndex = _domUtil2.default.findParentAttr(domSelection.startContainer, 'data-component-index');
			var endChunkIndex = _domUtil2.default.findParentAttr(domSelection.endContainer, 'data-component-index');

			if (!startChunkIndex || !endChunkIndex) {
				return;
			}

			// console.log 'VS page', @page

			var startChunk = this.page.chunks.at(startChunkIndex);
			var endChunk = this.page.chunks.at(endChunkIndex);

			if (!startChunk || !endChunk) {
				return;
			}

			// console.log 'start', startChunk, 'end', endChunk
			// console.log startChunk.page.module.pages.models.indexOf(startChunk.page)

			this.setStart(startChunk, startChunk.getVirtualSelectionStartData());
			return this.setEnd(endChunk, endChunk.getVirtualSelectionEndData());
		}
	}, {
		key: '__debug_print',
		value: function __debug_print() {
			return console.log(JSON.stringify(this.toObject(), null, 4));
		}
	}]);

	return VirtualSelection;
}();

Object.defineProperties(VirtualSelection.prototype, {
	"type": {
		get: function get() {
			switch (false) {
				case !((this.start != null ? this.start.chunk : undefined) == null) && !((this.end != null ? this.end.chunk : undefined) == null):
					return 'none';
				case this.start.chunk.cid === this.end.chunk.cid:
					return 'chunkSpan';
				case !this.start.isEquivalentTo(this.end):
					return 'caret';
				default:
					return 'textSpan';
			}
		}
	},

	"all": {
		get: function get() {
			switch (this.type) {
				case 'chunkSpan':
					var all = [];
					var cur = this.start.chunk;

					while (cur != null && cur !== this.end.chunk.nextSibling()) {
						all.push(cur);
						cur = cur.nextSibling();
					}

					return all;

				case 'textSpan':case 'caret':
					return all = [this.start.chunk];

				default:
					return [];
			}
		}
	},

	"inbetween": {
		get: function get() {
			if (this.type !== 'chunkSpan') {
				return [];
			}

			var result = this.all;
			result.pop();
			result.shift();

			return result;
		}
	}
});

VirtualSelection.fromObject = function (page, o) {
	var vs = new VirtualSelection(page);
	vs.fromObject(page, o);

	return vs;
};

VirtualSelection.fromDOMSelection = function (page, domSelection) {
	var vs = new VirtualSelection(page);
	vs.fromDOMSelection(domSelection);

	return vs;
};

exports.default = VirtualSelection;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Store = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _componentClassMap = __webpack_require__(181);

var _componentClassMap2 = _interopRequireDefault(_componentClassMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log('====IMPORTING OBO');

var componentClassMap = new _componentClassMap2.default();
var items = new Map();
var itemsLoaded = 0;
var getItemsCallbacks = [];
var defaults = new Map();
// errorChunk = null @TODO

// this is editor stuff only
var insertItems = new Map();
var registeredToolbarItems = {
	'separator': { id: 'separator', type: 'separator' }
};
var toolbarItems = [];
var textListeners = [];
var triggerActions = {};
var variableHandlers = new Map();

window.__items = items;

var _Store = function () {
	function _Store() {
		_classCallCheck(this, _Store);
	}

	_createClass(_Store, [{
		key: 'loadDependency',
		value: function loadDependency(url, onLoadCallback) {
			if (onLoadCallback == null) {
				onLoadCallback = function onLoadCallback() {};
			}
			var type = url.substr(url.lastIndexOf('.') + 1);

			switch (type) {
				case 'js':
					var el = document.createElement('script');
					el.setAttribute('src', url);
					el.onload = onLoadCallback;
					document.head.appendChild(el);
					break;

				case 'css':
					el = document.createElement('link');
					el.setAttribute('rel', 'stylesheet');
					el.setAttribute('href', url);
					document.head.appendChild(el);
					onLoadCallback();
					break;
			}

			return this;
		}
	}, {
		key: 'registerModel',
		value: function registerModel(className, opts) {
			console.log('regsiter', className, opts);
			if (opts == null) {
				opts = {};
			}
			items.set(className, opts);
			// componentClassMap.register chunkClass.type, chunkClass

			opts = Object.assign({
				type: null,
				dependencies: [],
				default: false,
				error: false,
				insertItem: null,
				modelClass: null,
				componentClass: null,
				selectionHandler: null,
				commandHandler: null,
				variables: {},
				init: function init() {}
			}, opts);

			if (opts.default) {
				// componentClassMap.setDefault chunkClass.type
				defaults.set(opts.type, className);
			}
			// if opts.error
			// 	componentClassMap.setError chunkClass.type
			if (opts.insertItem) {
				insertItems.set(chunkClass.type, opts.insertItem);
			}

			opts.init();

			for (var variable in opts.variables) {
				var cb = opts.variables[variable];
				variableHandlers.set(variable, cb);
			}

			var loadDependency = this.loadDependency;

			var promises = opts.dependencies.map(function (dependency) {
				return new Promise(function (resolve, reject) {
					return loadDependency(dependency, resolve);
				});
			});

			Promise.all(promises).then(function () {
				itemsLoaded++;

				if (itemsLoaded === items.size) {
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = Array.from(getItemsCallbacks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var callback = _step.value;

							callback(chunks);
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

					return getItemsCallbacks = [];
				}
			});

			return this;
		}
	}, {
		key: 'getDefaultItemForModelType',
		value: function getDefaultItemForModelType(modelType) {
			var type = defaults.get(modelType);
			if (!type) {
				return null;
			}

			return items.get(type);
		}
	}, {
		key: 'getItemForType',
		value: function getItemForType(type) {
			return items.get(type);
		}
	}, {
		key: 'registerToolbarItem',
		value: function registerToolbarItem(opts) {
			registeredToolbarItems[opts.id] = opts;
			return this;
		}
	}, {
		key: 'addToolbarItem',
		value: function addToolbarItem(id) {
			toolbarItems.push(Object.assign({}, registeredToolbarItems[id]));
			return this;
		}
	}, {
		key: 'registerTextListener',
		value: function registerTextListener(opts, position) {
			if (position == null) {
				position = -1;
			}
			if (position > -1) {
				textListeners.splice(position, 0, opts);
			} else {
				textListeners.push(opts);
			}

			return this;
		}
	}, {
		key: 'getItems',
		value: function getItems(callback) {
			if (true) {
				callback(items);
			} else {
				getItemsCallbacks.push(callback);
			}

			return null;
		}
	}, {
		key: 'getDefaultItemForType',
		value: function getDefaultItemForType(type) {
			var className = defaults.get(type);
			if (className == null) {
				return null;
			}

			return items.get(className);
		}
	}, {
		key: 'getTextForVariable',
		value: function getTextForVariable(variable, model, viewerState) {
			var cb = variableHandlers.get(variable);
			if (!cb) {
				return null;
			}

			return cb.call(null, model, viewerState);
		}
	}]);

	return _Store;
}();

Object.defineProperties(_Store.prototype, {
	// errorChunk:
	// 	get: -> errorChunk

	insertItems: {
		get: function get() {
			return insertItems;
		}
	},

	registeredToolbarItems: {
		get: function get() {
			return registeredToolbarItems;
		}
	},

	toolbarItems: {
		get: function get() {
			return toolbarItems;
		}
	},

	textListeners: {
		get: function get() {
			return textListeners;
		}
	},

	triggerActions: {
		get: function get() {
			return triggerActions;
		}
	},

	__debug__chunks: {
		get: function get() {
			return chunks;
		}
	}
});

var Store = new _Store();
exports.Store = Store;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextGroupCursor = function TextGroupCursor(virtualCursor) {
	_classCallCheck(this, TextGroupCursor);

	this.virtualCursor = virtualCursor;
};

Object.defineProperties(TextGroupCursor.prototype, {
	isTextStart: {
		"get": function get() {
			return this.offset === 0;
		}
	},

	isTextEnd: {
		"get": function get() {
			return this.offset === this.text.length;
		}
	},

	isFirstText: {
		"get": function get() {
			return this.groupIndex === 0;
		}
	},

	isLastText: {
		"get": function get() {
			return this.groupIndex === this.textGroup.length - 1;
		}
	},

	isGroupStart: {
		"get": function get() {
			return this.isTextStart && this.isFirstText;
		}
	},

	isGroupEnd: {
		"get": function get() {
			return this.isTextEnd && this.isLastText;
		}
	},

	textGroup: {
		"get": function get() {
			return this.virtualCursor.chunk.modelState.textGroup;
		}
	},

	groupIndex: {
		"get": function get() {
			if (this.virtualCursor.data != null) {
				return this.virtualCursor.data.groupIndex;
			} else {
				return -1;
			}
		}
	},

	offset: {
		"get": function get() {
			if (this.virtualCursor.data != null) {
				return this.virtualCursor.data.offset;
			} else {
				return 0;
			}
		}
	},

	textGroupItem: {
		"get": function get() {
			return this.virtualCursor.chunk.modelState.textGroup.get(this.virtualCursor.data.groupIndex);
		}
	},

	text: {
		"get": function get() {
			return this.textGroupItem.text;
		}
	}
});

exports.default = TextGroupCursor;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleableText = __webpack_require__(12);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _textGroupUtil = __webpack_require__(28);

var _textGroupUtil2 = _interopRequireDefault(_textGroupUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextGroupItem = void 0;

exports.default = TextGroupItem = function () {
	function TextGroupItem(text, data, parent) {
		_classCallCheck(this, TextGroupItem);

		if (text == null) {
			text = new _styleableText2.default();
		}
		this.text = text;
		if (data == null) {
			data = {};
		}
		this.data = data;
		if (parent == null) {
			parent = null;
		}
		this.parent = parent;
	}

	_createClass(TextGroupItem, [{
		key: 'clone',
		value: function clone(cloneDataFn) {
			if (cloneDataFn == null) {
				cloneDataFn = _textGroupUtil2.default.defaultCloneFn;
			}
			return new TextGroupItem(this.text.clone(), cloneDataFn(this.data), null);
		}
	}]);

	return TextGroupItem;
}();

Object.defineProperties(TextGroupItem.prototype, {
	"index": {
		"get": function get() {
			if (this.parent === null) {
				return -1;
			}
			return this.parent.indexOf(this);
		}
	}
});

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Describes a selection in the context of TextGroups for a single chunk

var _textGroupCursor = __webpack_require__(56);

var _textGroupCursor2 = _interopRequireDefault(_textGroupCursor);

var _virtualCursor = __webpack_require__(27);

var _virtualCursor2 = _interopRequireDefault(_virtualCursor);

var _domUtil = __webpack_require__(7);

var _domUtil2 = _interopRequireDefault(_domUtil);

var _textConstants = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getCursors = function getCursors(chunk, virtualSelection) {
	if (!virtualSelection) {
		return {
			start: null,
			end: null
		};
	}

	var chunkStart = TextGroupSelection.getGroupStartCursor(chunk);
	var chunkEnd = TextGroupSelection.getGroupEndCursor(chunk);
	var position = virtualSelection.getPosition(chunk);

	switch (position) {
		case 'start':
			return {
				start: new _textGroupCursor2.default(virtualSelection.start),
				end: chunkEnd
			};

		case 'end':
			return {
				start: chunkStart,
				end: new _textGroupCursor2.default(virtualSelection.end)
			};

		case 'contains':
			return {
				start: new _textGroupCursor2.default(virtualSelection.start),
				end: new _textGroupCursor2.default(virtualSelection.end)
			};

		case 'inside':
			return {
				start: chunkStart,
				end: chunkEnd
			};

		default:
			return {
				start: null,
				end: null
			};
	}
};

var TextGroupSelection = function () {
	function TextGroupSelection(chunk, virtualSelection) {
		_classCallCheck(this, TextGroupSelection);

		this.chunk = chunk;
		this.virtualSelection = virtualSelection;
	}

	// getFrozenSelection: ->
	// 	new TextGroupSelection(chunk, virtualSelection.clone());

	_createClass(TextGroupSelection, [{
		key: 'includes',
		value: function includes(item) {
			if (this.type === 'none') {
				return false;
			}

			var groupIndex = item.index;
			return this.start.groupIndex === groupIndex || this.end.groupIndex === groupIndex;
		}
	}, {
		key: 'selectGroup',
		value: function selectGroup() {
			return TextGroupSelection.selectGroup(this.chunk, this.virtualSelection);
		}
	}, {
		key: 'selectText',
		value: function selectText(groupIndex) {
			return TextGroupSelection.selectText(this.chunk, groupIndex, this.virtualSelection);
		}
	}, {
		key: 'setCaretToGroupStart',
		value: function setCaretToGroupStart() {
			return TextGroupSelection.setCaretToGroupStart(this.chunk, this.virtualSelection);
		}
	}, {
		key: 'setCaretToTextStart',
		value: function setCaretToTextStart(groupIndex) {
			return TextGroupSelection.setCaretToTextStart(this.chunk, groupIndex, this.virtualSelection);
		}
	}, {
		key: 'setCaretToGroupEnd',
		value: function setCaretToGroupEnd() {
			return TextGroupSelection.setCaretToGroupEnd(this.chunk, this.virtualSelection);
		}
	}, {
		key: 'setCaretToTextEnd',
		value: function setCaretToTextEnd(groupIndex) {
			return TextGroupSelection.setCaretToTextEnd(this.chunk, groupIndex, this.virtualSelection);
		}
	}, {
		key: 'setCaret',
		value: function setCaret(groupIndex, offset) {
			return this.virtualSelection.setCaret(this.chunk, { groupIndex: groupIndex, offset: offset });
		}
	}, {
		key: 'setStart',
		value: function setStart(groupIndex, offset) {
			return this.virtualSelection.setStart(this.chunk, { groupIndex: groupIndex, offset: offset });
		}
	}, {
		key: 'setEnd',
		value: function setEnd(groupIndex, offset) {
			return this.virtualSelection.setEnd(this.chunk, { groupIndex: groupIndex, offset: offset });
		}
	}, {
		key: 'getAllSelectedTexts',
		value: function getAllSelectedTexts() {
			if ((this.start != null ? this.start.text : undefined) == null || (this.end != null ? this.end.text : undefined) == null) {
				return [];
			}

			var all = [];
			for (var i = this.start.groupIndex, end = this.end.groupIndex, asc = this.start.groupIndex <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
				all.push(this.chunk.modelState.textGroup.get(i));
			}

			return all;
		}
	}]);

	return TextGroupSelection;
}();

Object.defineProperties(TextGroupSelection.prototype, {
	type: {
		get: function get() {
			var cursors = getCursors(this.chunk, this.virtualSelection);
			var position = this.position;


			switch (false) {
				case cursors.start !== null && cursors.end !== null:
					return 'none';
				case position !== 'contains' || cursors.start.groupIndex !== cursors.end.groupIndex || cursors.start.offset !== cursors.end.offset:
					return 'caret';
				case cursors.start.groupIndex !== cursors.end.groupIndex:
					return 'TextSpan';
				default:
					return 'multipleTextSpan';
			}
		}
	},

	start: {
		get: function get() {
			return getCursors(this.chunk, this.virtualSelection).start;
		}
	},
	end: {
		get: function get() {
			return getCursors(this.chunk, this.virtualSelection).end;
		}
	},
	position: {
		get: function get() {
			return this.virtualSelection.getPosition(this.chunk);
		}
	}
});

TextGroupSelection.getGroupStartCursor = function (chunk) {
	return TextGroupSelection.getTextStartCursor(chunk, 0);
};

TextGroupSelection.getGroupEndCursor = function (chunk) {
	return TextGroupSelection.getTextEndCursor(chunk, chunk.modelState.textGroup.length - 1);
};

TextGroupSelection.getTextStartCursor = function (chunk, groupIndex) {
	var virtCur = new _virtualCursor2.default(chunk, { groupIndex: groupIndex, offset: 0 });
	return new _textGroupCursor2.default(virtCur);
};

TextGroupSelection.getTextEndCursor = function (chunk, groupIndex) {
	var virtCur = new _virtualCursor2.default(chunk, { groupIndex: groupIndex, offset: chunk.modelState.textGroup.get(groupIndex).text.length });
	return new _textGroupCursor2.default(virtCur);
};

TextGroupSelection.selectGroup = function (chunk, virtualSelection) {
	var start = TextGroupSelection.getGroupStartCursor(chunk);
	var end = TextGroupSelection.getGroupEndCursor(chunk);

	virtualSelection.setStart(start.virtualCursor.chunk, start.virtualCursor.data);
	return virtualSelection.setEnd(end.virtualCursor.chunk, end.virtualCursor.data);
};

TextGroupSelection.selectText = function (chunk, groupIndex, virtualSelection) {
	var start = TextGroupSelection.getTextStartCursor(chunk, groupIndex);
	var end = TextGroupSelection.getTextEndCursor(chunk, groupIndex);

	virtualSelection.setStart(start.virtualCursor.chunk, start.virtualCursor.data);
	return virtualSelection.setEnd(end.virtualCursor.chunk, end.virtualCursor.data);
};

TextGroupSelection.setCaretToGroupStart = function (chunk, virtualSelection) {
	TextGroupSelection.selectGroup(chunk, virtualSelection);
	return virtualSelection.collapse();
};

TextGroupSelection.setCaretToTextStart = function (chunk, groupIndex, virtualSelection) {
	TextGroupSelection.selectText(chunk, groupIndex, virtualSelection);
	return virtualSelection.collapse();
};

TextGroupSelection.setCaretToGroupEnd = function (chunk, virtualSelection) {
	TextGroupSelection.selectGroup(chunk, virtualSelection);
	return virtualSelection.collapseToEnd();
};

TextGroupSelection.setCaretToTextEnd = function (chunk, groupIndex, virtualSelection) {
	TextGroupSelection.selectText(chunk, groupIndex, virtualSelection);
	return virtualSelection.collapseToEnd();
};

TextGroupSelection.getCursorDataFromDOM = function (targetTextNode, offset) {
	// console.log 'getOboTextInfo', targetTextNode, offset

	var groupIndex = void 0,
	    groupIndexAttr = void 0;
	var totalCharactersFromStart = 0;
	// element ?= DOMUtil.getOboElementFromChild targetTextNode.parentElement, 'chunk'

	var oboTextNode = _domUtil2.default.findParentWithAttr(targetTextNode, 'data-group-index');

	if (oboTextNode) {
		groupIndexAttr = oboTextNode.getAttribute('data-group-index');
		groupIndex = parseInt(groupIndexAttr, 10);
		if (isNaN(groupIndex)) {
			groupIndex = groupIndexAttr;
		}
	}

	if (oboTextNode == null || oboTextNode.textContent === _textConstants.EMPTY_CHAR) {
		return {
			offset: 0,
			groupIndex: groupIndex
		};
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(_domUtil2.default.getTextNodesInOrder(oboTextNode))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var textNode = _step.value;

			if (textNode === targetTextNode) {
				break;
			}
			totalCharactersFromStart += textNode.nodeValue.length;
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

	var anchor = false;
	if (groupIndexAttr.indexOf('anchor:') === 0) {
		anchor = groupIndexAttr.substr(groupIndexAttr.indexOf(':') + 1);
	}

	offset += totalCharactersFromStart;
	if (anchor) {
		offset = 0;
	}

	return {
		offset: offset,
		groupIndex: groupIndex
	};
};

exports.default = TextGroupSelection;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleableText = __webpack_require__(12);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _textGroupUtil = __webpack_require__(28);

var _textGroupUtil2 = _interopRequireDefault(_textGroupUtil);

var _textGroupItem = __webpack_require__(57);

var _textGroupItem2 = _interopRequireDefault(_textGroupItem);

var _objectAssign = __webpack_require__(16);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getItemsArray = function getItemsArray(itemOrItems) {
	if (itemOrItems instanceof _textGroupItem2.default) {
		return [itemOrItems];
	} else {
		return itemOrItems;
	}
};

var addChildToGroup = function addChildToGroup(itemOrItems, group, atIndex) {
	if (atIndex == null) {
		atIndex = null;
	}
	var items = getItemsArray(itemOrItems);

	if (atIndex === null) {
		group.items = group.items.concat(items);
	} else {
		group.items = group.items.slice(0, atIndex).concat(items).concat(group.items.slice(atIndex));
	}

	return Array.from(items).map(function (item) {
		return item.parent = group;
	});
};

var removeChildFromGroup = function removeChildFromGroup(itemOrItems, group) {
	var removedItems = [];
	var items = getItemsArray(itemOrItems);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var item = _step.value;

			var removed = group.items.splice(item.index, 1)[0];
			removed.parent = null;
			removedItems.push(removed);
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

	return removedItems;
};

var setChildToGroup = function setChildToGroup(item, group, atIndex) {
	group.items[atIndex] = item;
	return item.parent = group;
};

var removeAllChildrenFromGroup = function removeAllChildrenFromGroup(group) {
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Array.from(group.items)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var item = _step2.value;

			item.parent = null;
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

	return group.items = [];
};

var createChild = function createChild(text, data, dataTemplate) {
	return new _textGroupItem2.default(text, _textGroupUtil2.default.createData(data, dataTemplate));
};

// dataTemplate defines the data object that will be included in each item in the
// textGroup. Attributes in the data added to the group will be ignored if those
// attributes aren't in the dataTemplate (see Util.createData)

var TextGroup = function () {
	function TextGroup(maxItems, dataTemplate, initialItems) {
		_classCallCheck(this, TextGroup);

		if (maxItems == null) {
			maxItems = Infinity;
		}
		this.maxItems = maxItems;
		if (dataTemplate == null) {
			dataTemplate = {};
		}
		if (initialItems == null) {
			initialItems = [];
		}
		this.items = [];
		this.dataTemplate = Object.freeze((0, _objectAssign2.default)({}, dataTemplate));

		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = Array.from(initialItems)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var item = _step3.value;

				this.add(item.text, item.data);
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

	_createClass(TextGroup, [{
		key: 'clear',
		value: function clear() {
			return removeAllChildrenFromGroup(this);
		}
	}, {
		key: 'indexOf',
		value: function indexOf(item) {
			return this.items.indexOf(item);
		}
	}, {
		key: 'init',
		value: function init(numItems) {
			if (numItems == null) {
				numItems = 1;
			}
			this.clear();

			while (numItems-- && !this.isFull) {
				this.add();
			}

			return this;
		}
	}, {
		key: 'fill',
		value: function fill() {
			var _this = this;

			if (this.maxItems === Infinity) {
				return;
			}

			return function () {
				var result = [];
				while (!_this.isFull) {
					result.push(_this.add());
				}
				return result;
			}();
		}
	}, {
		key: 'add',
		value: function add(text, data) {
			if (this.isFull) {
				return this;
			}

			addChildToGroup(createChild(text, data, this.dataTemplate), this);

			return this;
		}
	}, {
		key: 'addAt',
		value: function addAt(index, text, data) {
			if (this.isFull) {
				return this;
			}

			addChildToGroup(createChild(text, data, this.dataTemplate), this, index);

			return this;
		}
	}, {
		key: 'addGroup',
		value: function addGroup(group, cloneDataFn) {
			if (cloneDataFn == null) {
				cloneDataFn = _textGroupUtil2.default.defaultCloneFn;
			}
			return this.addGroupAt(group, null, cloneDataFn);
		}
	}, {
		key: 'addGroupAt',
		value: function addGroupAt(group, index, cloneDataFn) {
			if (cloneDataFn == null) {
				cloneDataFn = _textGroupUtil2.default.defaultCloneFn;
			}
			var itemsToAdd = [];
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Array.from(group.items)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var item = _step4.value;

					var clone = item.clone(cloneDataFn);
					itemsToAdd.push(createChild(clone.text, clone.data, this.dataTemplate));
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

			addChildToGroup(itemsToAdd, this, index);

			return this;
		}
	}, {
		key: 'get',
		value: function get(index) {
			return this.items[index];
		}
	}, {
		key: 'set',
		value: function set(index, text, data) {
			return setChildToGroup(createChild(text, data, this.dataTemplate), this, index);
		}
	}, {
		key: 'remove',
		value: function remove(index) {
			return removeChildFromGroup(this.items[index], this)[0];
		}
	}, {
		key: 'clone',
		value: function clone(cloneDataFn) {
			if (cloneDataFn == null) {
				cloneDataFn = _textGroupUtil2.default.defaultCloneFn;
			}
			var clonedItems = [];

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = Array.from(this.items)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var item = _step5.value;

					clonedItems.push(item.clone(cloneDataFn));
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			return new TextGroup(this.maxItems, this.dataTemplate, clonedItems);
		}
	}, {
		key: 'toDescriptor',
		value: function toDescriptor() {
			var desc = [];

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = Array.from(this.items)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var item = _step6.value;

					desc.push({ text: item.text.getExportedObject(), data: _textGroupUtil2.default.defaultCloneFn(item.data) });
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			return desc;
		}

		// textGroup.toSlice(0, 1) will reduce your text group to have one item

	}, {
		key: 'toSlice',
		value: function toSlice(from, to) {
			if (to == null) {
				to = Infinity;
			}
			removeChildFromGroup(this.items.slice(to), this);
			removeChildFromGroup(this.items.slice(0, from), this);

			return this;
		}

		// splits the group into two, one with all the items before the specified index
		// and the other with the items at index and above

	}, {
		key: 'splitBefore',
		value: function splitBefore(index) {
			var sibling = new TextGroup(this.maxItems, this.dataTemplate);

			while (this.length !== index) {
				var item = this.remove(index);
				sibling.add(item.text, item.data);
			}

			return sibling;
		}
	}, {
		key: 'splitText',
		value: function splitText(index, offset) {
			var item = this.items[index];

			var newItem = createChild(item.text.split(offset), _textGroupUtil2.default.defaultCloneFn(item.data), this.dataTemplate);

			addChildToGroup(newItem, this, index + 1);

			return newItem;
		}
	}, {
		key: 'merge',
		value: function merge(index, mergeDataFn) {
			if (mergeDataFn == null) {
				mergeDataFn = _textGroupUtil2.default.defaultMergeFn;
			}
			var digestedItem = this.items.splice(index + 1, 1)[0];
			var consumerItem = this.items[index];

			if (!digestedItem || !consumerItem) {
				return this;
			}

			consumerItem.data = _textGroupUtil2.default.createData(mergeDataFn(consumerItem.data, digestedItem.data), this.dataTemplate);

			consumerItem.text.merge(digestedItem.text);
			return this;
		}
	}, {
		key: 'deleteSpan',
		value: function deleteSpan(startIndex, startTextIndex, endIndex, endTextIndex, merge, mergeFn) {
			if (merge == null) {
				merge = true;
			}
			if (mergeFn == null) {
				mergeFn = _textGroupUtil2.default.defaultMergeFn;
			}
			var startItem = this.items[startIndex];
			var endItem = this.items[endIndex];

			if (!startItem) {
				startItem = this.first;
			}
			if (!endItem) {
				endItem = this.last;
			}

			var startText = startItem.text;
			var endText = endItem.text;

			if (startText === endText) {
				startText.deleteText(startTextIndex, endTextIndex);
				return;
			}

			startText.deleteText(startTextIndex, startText.length);
			endText.deleteText(0, endTextIndex);

			if (merge) {
				var newItems = [];
				for (var i = 0; i < this.items.length; i++) {
					var item = this.items[i];
					if (i < startIndex || i > endIndex) {
						newItems.push(item);
					} else if (i === startIndex) {
						newItems.push(startItem);
					} else if (i === endIndex) {
						newItems.push(endItem);
					}
				}

				removeAllChildrenFromGroup(this);
				addChildToGroup(newItems, this);
				return this.merge(startIndex, mergeFn);
			}
		}

		// deletes text but doesn't remove empty texts and doesn't merge any text

	}, {
		key: 'clearSpan',
		value: function clearSpan(startIndex, startTextIndex, endIndex, endTextIndex) {
			var startItem = this.items[startIndex];
			var endItem = this.items[endIndex];
			var startText = startItem.text;
			var endText = endItem.text;

			if (startText === endText) {
				startText.deleteText(startTextIndex, endTextIndex);
				return;
			}

			startText.deleteText(startTextIndex, startText.length);
			endText.deleteText(0, endTextIndex);

			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i];
				if (i > startIndex && i < endIndex) {
					item.text.init();
				}
			}

			return this;
		}
	}, {
		key: 'styleText',
		value: function styleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
			return this.applyStyleFunction('styleText', arguments);
		}
	}, {
		key: 'unstyleText',
		value: function unstyleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
			return this.applyStyleFunction('unstyleText', arguments);
		}

		//@TODO - This won't work correctly

	}, {
		key: 'toggleStyleText',
		value: function toggleStyleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
			return this.applyStyleFunction('toggleStyleText', arguments);
		}
	}, {
		key: 'applyStyleFunction',
		value: function applyStyleFunction(fn, args) {
			var _Array$from = Array.from(args),
			    _Array$from2 = _slicedToArray(_Array$from, 6),
			    startIndex = _Array$from2[0],
			    startTextIndex = _Array$from2[1],
			    endIndex = _Array$from2[2],
			    endTextIndex = _Array$from2[3],
			    styleType = _Array$from2[4],
			    styleData = _Array$from2[5];

			// console.log 'APPLY STYLE FUNCTION', startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData

			var startItem = this.items[startIndex];
			var endItem = this.items[endIndex];
			var startText = startItem.text;
			var endText = endItem.text;

			if (startText === endText) {
				startText[fn](styleType, startTextIndex, endTextIndex, styleData);
				return;
			}

			var foundStartText = false;
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = Array.from(this.items)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var item = _step7.value;

					if (item.text === startText) {
						item.text[fn](styleType, startTextIndex, startText.length, styleData);
						foundStartText = true;
					} else if (item.text === endText) {
						item.text[fn](styleType, 0, endTextIndex, styleData);
						break;
					} else if (foundStartText) {
						item.text[fn](styleType, 0, item.text.length, styleData);
					}
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			return this;
		}
	}, {
		key: 'getStyles',
		value: function getStyles(startIndex, startTextIndex, endIndex, endTextIndex) {
			var style = void 0;
			var startItem = this.items[startIndex];
			var endItem = this.items[endIndex];

			if (startItem == null || endItem == null) {
				return {};
			}

			var startText = startItem.text;
			var endText = endItem.text;

			if (startText == null || endText == null) {
				return {};
			}

			if (startText === endText) {
				return startText.getStyles(startTextIndex, endTextIndex);
			}

			var numTexts = 0;
			var allStyles = {};
			var foundStartText = false;
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = Array.from(this.items)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var item = _step8.value;

					var styles = {};

					if (item.text === startText) {
						numTexts++;
						styles = item.text.getStyles(startTextIndex, startText.length);
						foundStartText = true;
					} else if (item.text === endText) {
						numTexts++;
						styles = item.text.getStyles(0, endTextIndex);
					} else if (foundStartText) {
						numTexts++;
						styles = item.text.getStyles(0, item.text.length);
					}

					for (style in styles) {
						if (allStyles[style] != null) {
							allStyles[style]++;
						} else {
							allStyles[style] = 1;
						}
					}

					if (item.text === endText) {
						break;
					}
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			var returnedStyles = {};
			for (style in allStyles) {
				if (allStyles[style] === numTexts) {
					returnedStyles[style] = style;
				}
			}

			return returnedStyles;
		}
	}, {
		key: '__debug_print',
		value: function __debug_print() {
			console.log('========================');
			return Array.from(this.items).map(function (item) {
				return item.text.__debug_print(), console.log(JSON.stringify(item.data)), console.log('---------------------');
			});
		}
	}]);

	return TextGroup;
}();

Object.defineProperties(TextGroup.prototype, {
	"length": {
		"get": function get() {
			return this.items.length;
		}
	},

	"first": {
		"get": function get() {
			return this.items[0];
		}
	},

	"last": {
		"get": function get() {
			return this.items[this.items.length - 1];
		}
	},

	"isFull": {
		"get": function get() {
			return this.items.length === this.maxItems;
		}
	},

	"isEmpty": {
		"get": function get() {
			return this.items.length === 0;
		}
	},

	"isBlank": {
		"get": function get() {
			return this.isEmpty || this.items.length === 1 && this.first.text.length === 0;
		}
	}
});

TextGroup.fromDescriptor = function (descriptor, maxItems, dataTemplate, restoreDataDescriptorFn) {
	if (restoreDataDescriptorFn == null) {
		restoreDataDescriptorFn = _textGroupUtil2.default.defaultCloneFn;
	}
	var items = [];
	var _iteratorNormalCompletion9 = true;
	var _didIteratorError9 = false;
	var _iteratorError9 = undefined;

	try {
		for (var _iterator9 = Array.from(descriptor)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
			var item = _step9.value;

			items.push(createChild(_styleableText2.default.createFromObject(item.text), restoreDataDescriptorFn(item.data), dataTemplate));
		}
	} catch (err) {
		_didIteratorError9 = true;
		_iteratorError9 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion9 && _iterator9.return) {
				_iterator9.return();
			}
		} finally {
			if (_didIteratorError9) {
				throw _iteratorError9;
			}
		}
	}

	return new TextGroup(maxItems, dataTemplate, items);
};

TextGroup.create = function (maxItems, dataTemplate, numItemsToCreate) {
	if (maxItems == null) {
		maxItems = Infinity;
	}
	if (dataTemplate == null) {
		dataTemplate = {};
	}
	if (numItemsToCreate == null) {
		numItemsToCreate = 1;
	}
	var group = new TextGroup(maxItems, dataTemplate);
	group.init(numItemsToCreate);

	return group;
};

//@TODO
window.TextGroup = TextGroup;

exports.default = TextGroup;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleType = __webpack_require__(11);

var _styleType2 = _interopRequireDefault(_styleType);

var _styleRange = __webpack_require__(18);

var _styleRange2 = _interopRequireDefault(_styleRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keySortFn = function keySortFn(a, b) {
	return Number(a) - Number(b);
};

var ChunkStyleList = function () {
	function ChunkStyleList() {
		_classCallCheck(this, ChunkStyleList);

		this.clear();
	}

	_createClass(ChunkStyleList, [{
		key: 'clear',
		value: function clear() {
			return this.styles = [];
		}

		// Object.observe @styles, ->
		// 	console.log 'chunkstylelist changed'

	}, {
		key: 'getExportedObject',
		value: function getExportedObject() {
			if (this.styles.length === 0) {
				return null;
			}

			var output = [];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(this.styles)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var style = _step.value;

					output.push(style.getExportedObject());
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

			return output;
		}
	}, {
		key: 'clone',
		value: function clone() {
			var cloneStyleList = new ChunkStyleList();

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Array.from(this.styles)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var style = _step2.value;

					cloneStyleList.add(style.clone());
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

			return cloneStyleList;
		}
	}, {
		key: 'length',
		value: function length() {
			return this.styles.length;
		}
	}, {
		key: 'get',
		value: function get() {
			return this.styles[i];
		}
	}, {
		key: 'add',
		value: function add(styleRange) {
			return this.styles.push(styleRange);
		}

		// does not consider data

	}, {
		key: 'remove',
		value: function remove(styleRange) {
			var comparisons = this.getStyleComparisonsForRange(styleRange.start, styleRange.end, styleRange.type);

			// For any ranges that are enscapulated by this range we simply delete them
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Array.from(comparisons.enscapsulatedBy)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var co = _step3.value;

					co.invalidate();
				}

				// For any left ranges we need to trim off the right side
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

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Array.from(comparisons.left)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					co = _step4.value;

					co.end = styleRange.start;
				}

				// For any right ranges we need to trim off the left side
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

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = Array.from(comparisons.right)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					co = _step5.value;

					co.start = styleRange.end;
				}

				// For any contained ranges we have to split them into two new ranges
				// However we remove any new ranges if they have a length of 0
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = Array.from(comparisons.contains)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					co = _step6.value;

					var leftRange = co;
					var origEnd = leftRange.end;
					leftRange.end = styleRange.start;

					var rightRange = new _styleRange2.default(styleRange.end, origEnd, co.type, co.data);

					if (leftRange.length() === 0) {
						leftRange.invalidate();
					}

					if (rightRange.length() > 0) {
						this.add(rightRange);
					}
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			return this.normalize();
		}

		// type is optional

	}, {
		key: 'getStyleComparisonsForRange',
		value: function getStyleComparisonsForRange(from, to, type) {
			type = type || null;
			to = to || from;

			var comparisons = {
				after: [],
				before: [],
				enscapsulatedBy: [],
				contains: [],
				left: [],
				right: []
			};

			//@TODO - optimize
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = Array.from(this.styles)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var style = _step7.value;

					var curComparison = style.compareToRange(from, to);
					if (type === null || style.type === type) {
						comparisons[curComparison].push(style);
					}
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			return comparisons;
		}

		// Return true if the entire text range is styled by styleType

	}, {
		key: 'rangeHasStyle',
		value: function rangeHasStyle(from, to, styleType) {
			return this.getStyleComparisonsForRange(from, to, styleType).contains.length > 0;
		}

		// Returns a simple object with all the styles that are within the entire text range

	}, {
		key: 'getStylesInRange',
		value: function getStylesInRange(from, to) {
			var styles = {};

			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = Array.from(this.getStyleComparisonsForRange(from, to).contains)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var range = _step8.value;

					styles[range.type] = range.type;
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			return styles;
		}
	}, {
		key: 'getStyles',
		value: function getStyles() {
			var styles = {};

			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = Array.from(this.styles)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var range = _step9.value;

					styles[range.type] = range.type;
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			return styles;
		}

		// Moves each item in the list by byAmount
		// shift: (byAmount) ->
		// 	for range in @styles
		// 		range.start += byAmount
		// 		range.end += byAmount

	}, {
		key: 'cleanupSuperscripts',
		value: function cleanupSuperscripts() {
			// console.log 'cleanupSubSup', @styles

			var level = void 0;
			var mark = [];
			var newStyles = [];

			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = Array.from(this.styles)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var styleRange = _step10.value;

					if (styleRange.type !== _styleType2.default.SUPERSCRIPT) {
						newStyles.push(styleRange);
						continue;
					}

					if (mark[styleRange.start] == null) {
						mark[styleRange.start] = 0;
					}
					if (mark[styleRange.end] == null) {
						mark[styleRange.end] = 0;
					}

					level = parseInt(styleRange.data, 10);

					mark[styleRange.start] += level;
					mark[styleRange.end] -= level;
				}

				// console.log 'mark', mark
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10.return) {
						_iterator10.return();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}

			var curRange = new _styleRange2.default(-1, -1, _styleType2.default.SUPERSCRIPT, 0);
			var curLevel = 0;
			for (var _i = 0; _i < mark.length; _i++) {
				level = mark[_i];
				if (mark[_i] == null) {
					continue;
				}

				curLevel += level;

				if (curRange.start === -1) {
					curRange.start = _i;
					curRange.data = curLevel;
				} else if (curRange.end === -1) {
					curRange.end = _i;

					if (curRange.data !== 0) {
						newStyles.push(curRange);
					}

					curRange = new _styleRange2.default(_i, -1, _styleType2.default.SUPERSCRIPT, curLevel);
				}
			}

			// console.log 'styles before', JSON.stringify(@styles, null, 2)
			return this.styles = newStyles;
		}
		// @styles.length = 0
		// for style in newStyles
		// 	@styles.push style
		// console.log 'styles after ', JSON.stringify(@styles, null, 2)

		// 1. Loop through every style range for every type
		// 2. In an array A add 1 to A[range.start] and add -1 to A[range.end]
		// 3. Clear out the style list.
		// 4. Loop through A
		// 5. When you find a 1, that starts a new range
		// 6. Continue to add up numbers that you discover
		// 7. When your total is a 0 that ends the range

	}, {
		key: 'normalize',
		value: function normalize() {
			// console.time 'normalize'
			//@TODO - possible to improve runtime if we sort the styles?

			var i = void 0,
			    styleType = void 0;
			this.cleanupSuperscripts();

			var newStyles = [];

			// We can't merge in link styles since they might have different URLs!
			// We have to treat them seperately
			// [b: [b], i: [i], a: [google, microsoft]]
			var datasToCheck = {};
			var dataValues = {};
			//@TODO - is it ok here to rely on this object's order?
			for (var styleName in _styleType2.default) {
				styleType = _styleType2.default[styleName];
				datasToCheck[styleType] = [];
				dataValues[styleType] = [];
			}

			for (i = this.styles.length - 1; i >= 0; i--) {
				var styleRange = this.styles[i];
				var curData = styleRange.data;
				var curEncodedData = JSON.stringify(curData);

				if (datasToCheck[styleRange.type].indexOf(curEncodedData) === -1) {
					datasToCheck[styleRange.type].push(curEncodedData);
					dataValues[styleRange.type].push(curData);
				}
			}

			//console.log datasToCheck
			//console.log dataValues

			for (styleType in dataValues) {
				//console.log 'loop', styleType, datas
				var datas = dataValues[styleType];
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = Array.from(datas)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var data = _step11.value;

						var tmp = {};
						var total = 0;
						var start = null;

						var _iteratorNormalCompletion12 = true;
						var _didIteratorError12 = false;
						var _iteratorError12 = undefined;

						try {
							for (var _iterator12 = Array.from(this.styles)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
								var range = _step12.value;

								// range.invalidate() if range.length() is 0 #<-----@TODO

								if (range.isMergeable(styleType, data)) {
									if (tmp[range.start] == null) {
										tmp[range.start] = 0;
									}
									if (tmp[range.end] == null) {
										tmp[range.end] = 0;
									}

									tmp[range.start]++;
									tmp[range.end]--;
								}
							}
						} catch (err) {
							_didIteratorError12 = true;
							_iteratorError12 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion12 && _iterator12.return) {
									_iterator12.return();
								}
							} finally {
								if (_didIteratorError12) {
									throw _iteratorError12;
								}
							}
						}

						var keys = Object.keys(tmp).sort(keySortFn);

						var _iteratorNormalCompletion13 = true;
						var _didIteratorError13 = false;
						var _iteratorError13 = undefined;

						try {
							for (var _iterator13 = Array.from(keys)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
								var key = _step13.value;

								var end = Number(key);
								var t = tmp[key];
								// if not isNaN t
								// console.log 'here'
								if (start == null) {
									start = end;
								}
								total += t;
								if (total === 0) {
									newStyles.push(new _styleRange2.default(start, end, styleType, data));
									start = null;
								}
							}
						} catch (err) {
							_didIteratorError13 = true;
							_iteratorError13 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion13 && _iterator13.return) {
									_iterator13.return();
								}
							} finally {
								if (_didIteratorError13) {
									throw _iteratorError13;
								}
							}
						}
					}
				} catch (err) {
					_didIteratorError11 = true;
					_iteratorError11 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}
					} finally {
						if (_didIteratorError11) {
							throw _iteratorError11;
						}
					}
				}
			}

			for (i = newStyles.length - 1; i >= 0; i--) {
				var style = newStyles[i];
				if (style.isInvalid()) {
					newStyles.splice(i, 1);
				}
			}

			return this.styles = newStyles;
		}
	}]);

	return ChunkStyleList;
}();

// console.timeEnd 'normalize'

ChunkStyleList.createFromObject = function (o) {
	var styleList = new ChunkStyleList();

	if (o != null) {
		var _iteratorNormalCompletion14 = true;
		var _didIteratorError14 = false;
		var _iteratorError14 = undefined;

		try {
			for (var _iterator14 = Array.from(o)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
				var rangeObj = _step14.value;

				styleList.add(_styleRange2.default.createFromObject(rangeObj));
			}
		} catch (err) {
			_didIteratorError14 = true;
			_iteratorError14 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion14 && _iterator14.return) {
					_iterator14.return();
				}
			} finally {
				if (_didIteratorError14) {
					throw _iteratorError14;
				}
			}
		}
	}

	return styleList;
};

exports.default = ChunkStyleList;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _styleableTextRenderer = __webpack_require__(62);

var _styleableTextRenderer2 = _interopRequireDefault(_styleableTextRenderer);

var _textConstants = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyleableTextComponent = React.createClass({
	displayName: 'StyleableTextComponent',
	createChild: function createChild(el, key) {
		var createChild = this.createChild;
		var groupIndex = this.props.groupIndex;


		var attrs = { key: key.counter++ };

		switch (el.type) {
			case 'a':
				if ((el.attrs != null ? el.attrs.href : undefined) != null) {
					attrs.href = el.attrs.href;
					attrs.target = "_blank";
				}
				break;

			case 'span':
				if ((el.attrs != null ? el.attrs['class'] : undefined) != null) {
					attrs.className = el.attrs['class'];
				}
				break;
		}

		return React.createElement(el.type, attrs, el.children.map(function (child, index) {
			switch (child.nodeType) {
				case 'text':
					if (child.html != null) {
						// console.clear()
						// console.log('yes', child.html)
						return React.createElement('span', { key: key.counter++, dangerouslySetInnerHTML: { __html: child.html } });
					} else if (child.text.length === 0) {
						return React.createElement(
							'span',
							{ key: key.counter++ },
							_textConstants.EMPTY_CHAR
						);
					} else if (child.text.charAt(child.text.length - 1) === "\n") {
						// Hack to force the display of a blank line that has no content
						return React.createElement(
							'span',
							{ key: key.counter++ },
							child.text,
							_textConstants.EMPTY_CHAR
						);
					} else {
						return React.createElement(
							'span',
							{ key: key.counter++ },
							child.text
						);
					}
				// child.text || emptyChar
				default:
					return createChild(child, key);
			}
		}));
	},
	render: function render() {
		var key = { counter: 0 };
		var mockElement = (0, _styleableTextRenderer2.default)(this.props.text);

		return React.createElement(
			'span',
			null,
			this.createChild(mockElement, key)
		);
	}
});

exports.default = StyleableTextComponent;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _objectAssign = __webpack_require__(16);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _katex = __webpack_require__(32);

var _katex2 = _interopRequireDefault(_katex);

var _styleableText = __webpack_require__(12);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _styleRange = __webpack_require__(18);

var _styleRange2 = _interopRequireDefault(_styleRange);

var _styleType = __webpack_require__(11);

var _styleType2 = _interopRequireDefault(_styleType);

var _mockElement = __webpack_require__(51);

var _mockElement2 = _interopRequireDefault(_mockElement);

var _mockTextNode = __webpack_require__(52);

var _mockTextNode2 = _interopRequireDefault(_mockTextNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ORDER = [_styleType2.default.COMMENT, _styleType2.default.LATEX, _styleType2.default.LINK, _styleType2.default.QUOTE, _styleType2.default.BOLD, _styleType2.default.STRIKETHROUGH, _styleType2.default.MONOSPACE, _styleType2.default.SUPERSCRIPT, _styleType2.default.ITALIC]; // Turns a StyleableText item into a mock DOM tree, which can then be used to render out in React

var getTextNodeFragmentDescriptorsAtHelper = function getTextNodeFragmentDescriptorsAtHelper(stateObj, targetStartIndex, targetEndIndex) {
	if (stateObj.curNode.nodeType === 'element') {
		return Array.from(stateObj.curNode.children).map(function (child) {
			return stateObj.curNode = child, getTextNodeFragmentDescriptorsAtHelper(stateObj, targetStartIndex, targetEndIndex);
		});
	} else {
		var charsRead = stateObj.charsRead + stateObj.curNode.text.length;

		if (charsRead >= targetEndIndex && stateObj.end === null) {
			stateObj.end = {
				node: stateObj.curNode,
				startIndex: 0,
				endIndex: targetEndIndex - stateObj.charsRead
			};
		} else if (stateObj.start !== null && stateObj.end === null) {
			stateObj.inbetween.push({
				node: stateObj.curNode,
				startIndex: 0,
				endIndex: Infinity
			});
		}

		if (charsRead >= targetStartIndex && stateObj.start === null) {
			stateObj.start = {
				node: stateObj.curNode,
				startIndex: targetStartIndex - stateObj.charsRead,
				endIndex: Infinity
			};
		}

		stateObj.last = {
			node: stateObj.curNode,
			startIndex: 0,
			endIndex: Infinity
		};

		return stateObj.charsRead = charsRead;
	}
};

var getTextNodeFragmentDescriptorsAt = function getTextNodeFragmentDescriptorsAt(rootNode, startIndex, endIndex) {
	var stateObj = {
		charsRead: 0,
		start: null,
		inbetween: [],
		end: null,
		curNode: rootNode
	};

	getTextNodeFragmentDescriptorsAtHelper(stateObj, startIndex, endIndex);
	if (stateObj.end === null) {
		stateObj.end = stateObj.last;
	}

	// If start and end are equal just modify start and delete end
	if (stateObj.start.node === stateObj.end.node) {
		stateObj.start.endIndex = stateObj.end.endIndex;
		stateObj.end = null;
	}

	var fragmentDescriptors = stateObj.inbetween;

	if (stateObj.start !== null) {
		fragmentDescriptors.unshift(stateObj.start);
	}
	if (stateObj.end !== null) {
		fragmentDescriptors.push(stateObj.end);
	}

	return fragmentDescriptors;
};

var wrapElement = function wrapElement(styleRange, nodeToWrap, text) {
	var newChild = void 0,
	    node = void 0,
	    root = void 0;
	switch (styleRange.type) {
		case 'sup':
			var level = styleRange.data;
			if (level > 0) {
				node = root = new _mockElement2.default('sup');
				while (level > 1) {
					newChild = new _mockElement2.default('sup');
					node.addChild(newChild);
					node = newChild;
					level--;
				}
			} else {
				level = Math.abs(level);
				node = root = new _mockElement2.default('sub');
				while (level > 1) {
					newChild = new _mockElement2.default('sub');
					node.addChild(newChild);
					node = newChild;
					level--;
				}
			}

			nodeToWrap.parent.replaceChild(nodeToWrap, root);
			node.addChild(nodeToWrap);
			nodeToWrap.text = text;
			return root;

		case '_comment':
			newChild = new _mockElement2.default('span', (0, _objectAssign2.default)({ 'class': 'comment' }, styleRange.data));
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild);
			newChild.addChild(nodeToWrap);
			nodeToWrap.text = text;
			return newChild;

		case '_latex':
			newChild = new _mockElement2.default('span', (0, _objectAssign2.default)({ 'class': 'latex' }, styleRange.data));
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild);
			newChild.addChild(nodeToWrap);
			var html = _katex2.default.renderToString(text);
			nodeToWrap.html = html;
			nodeToWrap.text = text;
			return newChild;

		default:
			newChild = new _mockElement2.default(styleRange.type, (0, _objectAssign2.default)({}, styleRange.data));
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild);
			newChild.addChild(nodeToWrap);
			nodeToWrap.text = text;
			return newChild;
	}
};

var wrap = function wrap(styleRange, nodeFragmentDescriptor) {
	var newChild = void 0;
	var nodeToWrap = nodeFragmentDescriptor.node;
	var _nodeToWrap = nodeToWrap,
	    text = _nodeToWrap.text;

	var fromPosition = nodeFragmentDescriptor.startIndex;
	var toPosition = nodeFragmentDescriptor.endIndex;

	var leftText = text.substring(0, fromPosition);
	var wrappedText = text.substring(fromPosition, toPosition);
	var rightText = text.substring(toPosition);

	if (wrappedText.length === 0) {
		return;
	}

	// add in left text
	if (leftText.length > 0) {
		newChild = new _mockTextNode2.default(leftText);
		nodeToWrap.parent.addBefore(newChild, nodeToWrap);
	}

	// add in wrapped text
	nodeToWrap = wrapElement(styleRange, nodeToWrap, wrappedText);

	// add in right text
	if (rightText.length > 0) {
		newChild = new _mockTextNode2.default(rightText);
		return nodeToWrap.parent.addAfter(newChild, nodeToWrap);
	}
};

var applyStyle = function applyStyle(el, styleRange) {
	var fragmentDescriptors = getTextNodeFragmentDescriptorsAt(el, styleRange.start, styleRange.end);
	return function () {
		var result = [];
		for (var i = fragmentDescriptors.length - 1; i >= 0; i--) {
			var fragmentDescriptor = fragmentDescriptors[i];
			result.push(wrap(styleRange, fragmentDescriptor));
		}
		return result;
	}();
};

var getMockElement = function getMockElement(styleableText) {
	// console.time 'getMockElement'
	var root = new _mockElement2.default('span');
	root.addChild(new _mockTextNode2.default(styleableText.value));

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(ORDER)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var styleType = _step.value;
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Array.from(styleableText.styleList.styles)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var styleRange = _step2.value;

					if (styleRange.type === styleType) {
						applyStyle(root, styleRange);
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
		}

		// console.timeEnd 'getMockElement'
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

	return root;
};

// __debugPrintFragments = (fragments) ->
// 	s = ''
// 	for fragment in fragments
// 		s += fragment.node.text + '(' + fragment.startIndex + ':' + fragment.endIndex + ') '

// 	console.log 'Fragments=', fragments, s

var __debugPrintNode = function __debugPrintNode(node, indent) {
	if (indent == null) {
		indent = '';
	}
	if (node.nodeType === 'element') {
		console.log(indent + node.type);
		return Array.from(node.children).map(function (child) {
			return __debugPrintNode(child, indent + '  ');
		});
	} else {
		return console.log(indent + '[' + node.text + ']');
	}
};

var __getHTML = function __getHTML(node) {
	if (node.nodeType === 'text') {
		return node.text;
	}

	return '<' + node.type + '>' + node.children.map(function (child) {
		return __getHTML(child);
	}).join('') + '</' + node.type + '>';
};

window.__getMockElement = getMockElement;
window.__debugPrintNode = __debugPrintNode;
window.__getHTML = __getHTML;

exports.default = getMockElement;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (asset) {
  return "url('" + asset.replace(/'/g, "\\'") + "')";
};

;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var sanitize = function sanitize(node) {
	if (node.nodeType === Node.ELEMENT_NODE) {
		if (node.tagName.toLowerCase() === 'script') {
			node = node.parentElement.replaceChild(document.createElement('span'), node);
		}

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(node.attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var attr = _step.value;

				switch (attr.name) {
					case 'href':case 'cite':case 'style':
						true; //do nothing
						break;
					default:
						node.setAttribute(attr.name, '');
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
			for (var _iterator2 = Array.from(node.childNodes)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var child = _step2.value;

				sanitize(child);
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
	}

	return node;
};

var isElementInline = function isElementInline(el) {
	switch (el.tagName.toLowerCase()) {
		case 'b':case 'big':case 'i':case 'small':case 'tt':case 'abbr':case 'acronym':case 'cite':case 'code':case 'dfn':case 'em':case 'kbd':case 'strong':case 'samp':case 'time':case 'var':case 'a':case 'bdo':case 'br':case 'img':case 'map':case 'object':case 'q':case 'script':case 'span':case 'sub':case 'sup':case 'button':case 'input':case 'label':case 'select':case 'textarea':
			return true;
		default:
			return false;
	}
};

exports.sanitize = sanitize;
exports.isElementInline = isElementInline;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dispatcher = __webpack_require__(1);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModalUtil = {
	show: function show(component) {
		return _dispatcher2.default.trigger('modal:show', {
			value: {
				component: component
			}
		});
	},
	hide: function hide() {
		return _dispatcher2.default.trigger('modal:hide');
	},
	getCurrentModal: function getCurrentModal(state) {
		if (state.modals.length === 0) {
			return null;
		}
		return state.modals[0];
	}
};

exports.default = ModalUtil;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	//https://gist.github.com/jed/982883
	var getId = function getId(a) {
		if (a) {
			return (a ^ Math.random() * 16 >> a / 4).toString(16);
		} else {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, getId);
		}
	};
	return getId();
};

;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(258);

var _navUtil = __webpack_require__(8);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _obojoboLogo = __webpack_require__(266);

var _obojoboLogo2 = _interopRequireDefault(_obojoboLogo);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _window = window,
    OBO = _window.OBO;
var getBackgroundImage = _ObojoboDraft2.default.util.getBackgroundImage;


var Logo = React.createClass({
	displayName: 'Logo',
	render: function render() {
		var bg = getBackgroundImage(_obojoboLogo2.default);

		return React.createElement(
			'div',
			{ className: 'viewer--components--logo' + (this.props.inverted ? ' is-inverted' : ' is-not-inverted'), style: {
					backgroundImage: bg
				} },
			'Obojobo'
		);
	}
});

exports.default = Logo;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _assessmentUtil = __webpack_require__(71);

var _assessmentUtil2 = _interopRequireDefault(_assessmentUtil);

var _scoreUtil = __webpack_require__(72);

var _scoreUtil2 = _interopRequireDefault(_scoreUtil);

var _questionUtil = __webpack_require__(31);

var _questionUtil2 = _interopRequireDefault(_questionUtil);

var _apiUtil = __webpack_require__(14);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

var _navUtil = __webpack_require__(8);

var _navUtil2 = _interopRequireDefault(_navUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _ObojoboDraft2.default.flux.Store;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var ErrorUtil = _ObojoboDraft2.default.util.ErrorUtil;
var SimpleDialog = _ObojoboDraft2.default.components.modal.SimpleDialog;
var ModalUtil = _ObojoboDraft2.default.util.ModalUtil;


var getNewAssessmentObject = function getNewAssessmentObject() {
	return {
		current: null,
		currentResponses: [],
		attempts: []
	};
};

var startAssessmentAttempt = function startAssessmentAttempt(state, attemptObject) {
	var id = attemptObject.assessmentId;
	var model = OboModel.models[id];

	model.children.at(1).children.reset();
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(attemptObject.state.questions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

	if (!state.assessments[id]) {
		state.assessments[id] = getNewAssessmentObject();
	}

	state.assessments[id].current = attemptObject;

	_navUtil2.default.rebuildMenu(model.getRoot());
	_navUtil2.default.goto(id);

	return model.processTrigger('onStartAttempt');
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
			id = payload.value.id;

			model = OboModel.models[id];

			return _apiUtil2.default.startAttempt(model.getRoot(), model, {}).then(function (res) {
				if (res.status === 'error') {
					switch (res.value.message.toLowerCase()) {
						case 'attempt limit reached':
							return ErrorUtil.show('No attempts left', "You have attempted this assessment the maximum number of times available.");
							break;
						default:
							return ErrorUtil.errorResponse(res);
					}
				}

				startAssessmentAttempt(_this.state, res.value);
				return _this.triggerChange();
			});
		});

		Dispatcher.on('assessment:endAttempt', function (payload) {
			id = payload.value.id;

			model = OboModel.models[id];

			assessment = _this.state.assessments[id];

			return _apiUtil2.default.endAttempt(assessment.current).then(function (res) {
				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res);
				}

				assessment.current.state.questions.forEach(function (question) {
					return _questionUtil2.default.hideQuestion(question.id);
				});

				assessment.currentResponses.forEach(function (responderId) {
					return _questionUtil2.default.resetResponse(responderId);
				});

				assessment.attempts.push(res.value);
				assessment.current = null;

				model.processTrigger('onEndAttempt');
				return _this.triggerChange();
			});
		});

		Dispatcher.on('question:recordResponse', function (payload) {
			id = payload.value.id;

			model = OboModel.models[id];

			assessment = _assessmentUtil2.default.getAssessmentForModel(_this.state, model);
			// if typeof assessment?.current?.responses[id] isnt "undefined"
			// debugger

			if ((assessment != null ? assessment.currentResponses : undefined) != null) {
				assessment.currentResponses.push(id);
			}

			if ((assessment != null ? assessment.current : undefined) != null) {
				var questionModel = model.getParentOfType('ObojoboDraft.Chunks.Question');

				return _apiUtil2.default.postEvent(model.getRoot(), 'assessment:recordResponse', {
					attemptId: assessment.current.attemptId,
					questionId: questionModel.get('id'),
					responderId: id,
					response: payload.value.response
				}).then(function (res) {
					// APIUtil.recordQuestionResponse assessment.current, questionModel, payload.value.response

					// @triggerChange()
					if (res.status === 'error') {
						return ErrorUtil.errorResponse(res);
					}
					return _this.triggerChange();
				});
			}
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

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Array.from(history)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var attempt = _step2.value;

					if (!this.state.assessments[attempt.assessmentId]) {
						this.state.assessments[attempt.assessmentId] = getNewAssessmentObject();
					}

					if (!attempt.endTime) {
						// @state.assessments[attempt.assessmentId].current = attempt
						unfinishedAttempt = attempt;
					} else {
						this.state.assessments[attempt.assessmentId].attempts.push(attempt);
					}

					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = Array.from(attempt.state.questions)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							question = _step4.value;

							if (!OboModel.models[question.id]) {
								nonExistantQuestions.push(question);
							}
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

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Array.from(nonExistantQuestions)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					question = _step3.value;

					OboModel.create(question);
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

			if (unfinishedAttempt) {
				return ModalUtil.show(React.createElement(
					SimpleDialog,
					{ ok: true, title: 'Resume Attempt', onConfirm: this.onResumeAttemptConfirm.bind(this, unfinishedAttempt) },
					React.createElement(
						'p',
						null,
						'It looks like you were in the middle of an attempt. We\'ll resume you where you left off.'
					)
				));
			}
		}
		//startAssessmentAttempt(attempt)

	}, {
		key: 'onResumeAttemptConfirm',
		value: function onResumeAttemptConfirm(unfinishedAttempt) {
			ModalUtil.hide();

			startAssessmentAttempt(this.state, unfinishedAttempt);
			return this.triggerChange();
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
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _apiUtil = __webpack_require__(14);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _ObojoboDraft2.default.flux.Store;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var OboModel = _ObojoboDraft2.default.models.OboModel;

var QuestionStore = function (_Store) {
	_inherits(QuestionStore, _Store);

	function QuestionStore() {
		_classCallCheck(this, QuestionStore);

		var id = void 0;

		var _this = _possibleConstructorReturn(this, (QuestionStore.__proto__ || Object.getPrototypeOf(QuestionStore)).call(this, 'questionStore'));

		Dispatcher.on({
			'question:recordResponse': function questionRecordResponse(payload) {
				id = payload.value.id;

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
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _apiUtil = __webpack_require__(14);

var _apiUtil2 = _interopRequireDefault(_apiUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store = _ObojoboDraft2.default.flux.Store;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var FocusUtil = _ObojoboDraft2.default.util.FocusUtil;
var OboModel = _ObojoboDraft2.default.models.OboModel;

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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _questionUtil = __webpack_require__(31);

var _questionUtil2 = _interopRequireDefault(_questionUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;


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
			return 0;
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
	getLastAttemptForModel: function getLastAttemptForModel(state, model) {
		var assessment = AssessmentUtil.getAssessmentForModel(state, model);
		if (!assessment || assessment.attempts.length === 0) {
			return null;
		}

		return assessment.attempts[assessment.attempts.length - 1];
	},
	isCurrentAttemptComplete: function isCurrentAttemptComplete(assessmentState, questionState, model) {
		var current = AssessmentUtil.getCurrentAttemptForModel(assessmentState, model);
		if (!current) {
			return null;
		}

		model.children.at(1).children.models.forEach(function (questionModel) {
			if (!__guard__(_questionUtil2.default.getResponse(questionState, questionModel), function (x) {
				return x.set;
			})) {
				return false;
			}
		});

		return true;
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

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;


var ScoreUtil = {
	getScoreForModel: function getScoreForModel(state, model) {
		var score = state.scores[model.get('id')];
		if (typeof score === "undefined" || score === null) {
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
/* 73 */
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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(2);

var _Viewer2 = _interopRequireDefault(_Viewer);

__webpack_require__(215);

__webpack_require__(220);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APIUtil = _Viewer2.default.util.APIUtil;
var OboGlobals = _ObojoboDraft2.default.util.OboGlobals;


var debounce = function debounce(ms, cb) {
	clearTimeout(debounce.id);
	return debounce.id = setTimeout(cb, ms);
};
debounce.id = null;

// set up global event listeners
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;

// Set up listeners for window for blur/focus

var onFocus = function onFocus() {
	document.body.className = 'is-focused-window';
	return Dispatcher.trigger('window:focus');
};

var onBlur = function onBlur() {
	document.body.className = 'is-blured-window';
	return Dispatcher.trigger('window:blur');
};

var ie = false;
//@cc_on ie = true;
if (ie) {
	document.onfocusin = onFocus;
	document.onfocusout = onBlur;
} else {
	window.onfocus = onFocus;
	window.onblur = onBlur;
}

var moduleData = {
	model: null,
	navState: null,
	scoreState: null,
	questionState: null,
	assessmentState: null,
	modalState: null
};

var render = function render() {
	return ReactDOM.render(React.createElement(
		'div',
		{ className: 'root' },
		React.createElement(_Viewer2.default.components.ViewerApp, null)
	), document.getElementById('viewer-app'));
};

history.replaceState('', document.title, '/view/' + OboGlobals.get('draftId') + window.location.search);

render();

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = typeof Array.from === 'function' ? Array.from : __webpack_require__(76);

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: http://www.ecma-international.org/ecma-262/6.0/#sec-array.from
module.exports = function () {
  var isCallable = function isCallable(fn) {
    return typeof fn === 'function';
  };
  var toInteger = function toInteger(value) {
    var number = Number(value);
    if (isNaN(number)) {
      return 0;
    }
    if (number === 0 || !isFinite(number)) {
      return number;
    }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  var maxSafeInteger = Math.pow(2, 53) - 1;
  var toLength = function toLength(value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  };
  var iteratorProp = function iteratorProp(value) {
    if (value != null) {
      if (['string', 'number', 'boolean', 'symbol'].indexOf(typeof value === 'undefined' ? 'undefined' : _typeof(value)) > -1) {
        return Symbol.iterator;
      } else if (typeof Symbol !== 'undefined' && 'iterator' in Symbol && Symbol.iterator in value) {
        return Symbol.iterator;
      }
      // Support "@@iterator" placeholder, Gecko 27 to Gecko 35
      else if ('@@iterator' in value) {
          return '@@iterator';
        }
    }
  };
  var getMethod = function getMethod(O, P) {
    // Assert: IsPropertyKey(P) is true.
    if (O != null && P != null) {
      // Let func be GetV(O, P).
      var func = O[P];
      // ReturnIfAbrupt(func).
      // If func is either undefined or null, return undefined.
      if (func == null) {
        return void 0;
      }
      // If IsCallable(func) is false, throw a TypeError exception.
      if (!isCallable(func)) {
        throw new TypeError(func + ' is not a function');
      }
      return func;
    }
  };
  var iteratorStep = function iteratorStep(iterator) {
    // Let result be IteratorNext(iterator).
    // ReturnIfAbrupt(result).
    var result = iterator.next();
    // Let done be IteratorComplete(result).
    // ReturnIfAbrupt(done).
    var done = Boolean(result.done);
    // If done is true, return false.
    if (done) {
      return false;
    }
    // Return result.
    return result;
  };

  // The length property of the from method is 1.
  return function from(items /*, mapFn, thisArg */) {
    'use strict';

    // 1. Let C be the this value.

    var C = this;

    // 2. If mapfn is undefined, let mapping be false.
    var mapFn = arguments.length > 1 ? arguments[1] : void 0;

    var T;
    if (typeof mapFn !== 'undefined') {
      // 3. else
      //   a. If IsCallable(mapfn) is false, throw a TypeError exception.
      if (!isCallable(mapFn)) {
        throw new TypeError('Array.from: when provided, the second argument must be a function');
      }

      //   b. If thisArg was supplied, let T be thisArg; else let T
      //      be undefined.
      if (arguments.length > 2) {
        T = arguments[2];
      }
      //   c. Let mapping be true (implied by mapFn)
    }

    var A, k;

    // 4. Let usingIterator be GetMethod(items, @@iterator).
    // 5. ReturnIfAbrupt(usingIterator).
    var usingIterator = getMethod(items, iteratorProp(items));

    // 6. If usingIterator is not undefined, then
    if (usingIterator !== void 0) {
      // a. If IsConstructor(C) is true, then
      //   i. Let A be the result of calling the [[Construct]]
      //      internal method of C with an empty argument list.
      // b. Else,
      //   i. Let A be the result of the abstract operation ArrayCreate
      //      with argument 0.
      // c. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C()) : [];

      // d. Let iterator be GetIterator(items, usingIterator).
      var iterator = usingIterator.call(items);

      // e. ReturnIfAbrupt(iterator).
      if (iterator == null) {
        throw new TypeError('Array.from requires an array-like or iterable object');
      }

      // f. Let k be 0.
      k = 0;

      // g. Repeat
      var next, nextValue;
      while (true) {
        // i. Let Pk be ToString(k).
        // ii. Let next be IteratorStep(iterator).
        // iii. ReturnIfAbrupt(next).
        next = iteratorStep(iterator);

        // iv. If next is false, then
        if (!next) {

          // 1. Let setStatus be Set(A, "length", k, true).
          // 2. ReturnIfAbrupt(setStatus).
          A.length = k;

          // 3. Return A.
          return A;
        }
        // v. Let nextValue be IteratorValue(next).
        // vi. ReturnIfAbrupt(nextValue)
        nextValue = next.value;

        // vii. If mapping is true, then
        //   1. Let mappedValue be Call(mapfn, T, «nextValue, k»).
        //   2. If mappedValue is an abrupt completion, return
        //      IteratorClose(iterator, mappedValue).
        //   3. Let mappedValue be mappedValue.[[value]].
        // viii. Else, let mappedValue be nextValue.
        // ix.  Let defineStatus be the result of
        //      CreateDataPropertyOrThrow(A, Pk, mappedValue).
        // x. [TODO] If defineStatus is an abrupt completion, return
        //    IteratorClose(iterator, defineStatus).
        if (mapFn) {
          A[k] = mapFn.call(T, nextValue, k);
        } else {
          A[k] = nextValue;
        }
        // xi. Increase k by 1.
        k++;
      }
      // 7. Assert: items is not an Iterable so assume it is
      //    an array-like object.
    } else {

      // 8. Let arrayLike be ToObject(items).
      var arrayLike = Object(items);

      // 9. ReturnIfAbrupt(items).
      if (items == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 10. Let len be ToLength(Get(arrayLike, "length")).
      // 11. ReturnIfAbrupt(len).
      var len = toLength(arrayLike.length);

      // 12. If IsConstructor(C) is true, then
      //     a. Let A be Construct(C, «len»).
      // 13. Else
      //     a. Let A be ArrayCreate(len).
      // 14. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 15. Let k be 0.
      k = 0;
      // 16. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = arrayLike[k];
        if (mapFn) {
          A[k] = mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k++;
      }
      // 17. Let setStatus be Set(A, "length", len, true).
      // 18. ReturnIfAbrupt(setStatus).
      A.length = len;
      // 19. Return A.
    }
    return A;
  };
}();

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var copy = __webpack_require__(87),
    normalizeOptions = __webpack_require__(34),
    ensureCallable = __webpack_require__(3),
    map = __webpack_require__(95),
    callable = __webpack_require__(3),
    validValue = __webpack_require__(4),
    bind = Function.prototype.bind,
    defineProperty = Object.defineProperty,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    define;

define = function define(name, desc, options) {
	var value = validValue(desc) && callable(desc.value),
	    dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (!options.overwriteDefinition && hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, options.resolveContext ? options.resolveContext(this) : this);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props /*, options*/) {
	var options = normalizeOptions(arguments[1]);
	if (options.resolveContext != null) ensureCallable(options.resolveContext);
	return map(props, function (desc, name) {
		return define(name, desc, options);
	});
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toPosInt = __webpack_require__(83),
    value = __webpack_require__(4),
    indexOf = Array.prototype.indexOf,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    abs = Math.abs,
    floor = Math.floor;

module.exports = function (searchElement /*, fromIndex*/) {
	var i, l, fromIndex, val;
	if (searchElement === searchElement) {
		//jslint: ignore
		return indexOf.apply(this, arguments);
	}

	l = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;else if (fromIndex >= 0) fromIndex = floor(fromIndex);else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < l; ++i) {
		if (hasOwnProperty.call(this, i)) {
			val = this[i];
			if (val !== val) return i; //jslint: ignore
		}
	}
	return -1;
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(80)() ? Math.sign : __webpack_require__(81);

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== 'function') return false;
	return sign(10) === 1 && sign(-20) === -1;
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || value === 0) return value;
	return value > 0 ? 1 : -1;
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var sign = __webpack_require__(79),
    abs = Math.abs,
    floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if (value === 0 || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toInteger = __webpack_require__(82),
    max = Math.max;

module.exports = function (value) {
  return max(0, toInteger(value));
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order



var callable = __webpack_require__(3),
    value = __webpack_require__(4),
    bind = Function.prototype.bind,
    call = Function.prototype.call,
    keys = Object.keys,
    propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb /*, thisArg, compareFn*/) {
		var list,
		    thisArg = arguments[2],
		    compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(typeof compareFn === 'function' ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== 'function') method = list[method];
		return call.call(method, list, function (key, index) {
			if (!propertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var assign = Object.assign,
	    obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return obj.foo + obj.bar + obj.trzy === 'razdwatrzy';
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys = __webpack_require__(92),
    value = __webpack_require__(4),
    max = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error,
	    i,
	    l = max(arguments.length, 2),
	    assign;
	dest = Object(value(dest));
	assign = function assign(key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < l; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign = __webpack_require__(20),
    value = __webpack_require__(4);

module.exports = function (obj) {
	var copy = Object(value(obj));
	if (copy !== obj) return copy;
	return assign({}, obj);
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Workaround for http://code.google.com/p/v8/issues/detail?id=2804



var create = Object.create,
    shim;

if (!__webpack_require__(35)()) {
	shim = __webpack_require__(36);
}

module.exports = function () {
	var nullObject, props, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	props = {};
	desc = { configurable: false, enumerable: false, writable: true,
		value: undefined };
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === '__proto__') {
			props[name] = { configurable: true, enumerable: false, writable: true,
				value: undefined };
			return;
		}
		props[name] = desc;
	});
	Object.defineProperties(nullObject, props);

	Object.defineProperty(shim, 'nullPolyfill', { configurable: false,
		enumerable: false, writable: false, value: nullObject });

	return function (prototype, props) {
		return create(prototype === null ? nullObject : prototype, props);
	};
}();

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(84)('forEach');

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Deprecated



module.exports = function (obj) {
  return typeof obj === 'function';
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var map = { 'function': true, object: true };

module.exports = function (x) {
	return x != null && map[typeof x === 'undefined' ? 'undefined' : _typeof(x)] || false;
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(93)() ? Object.keys : __webpack_require__(94);

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) {
		return false;
	}
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var callable = __webpack_require__(3),
    forEach = __webpack_require__(89),
    call = Function.prototype.call;

module.exports = function (obj, cb /*, thisArg*/) {
	var o = {},
	    thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, obj, index) {
		o[key] = call.call(cb, thisArg, value, key, obj, index);
	});
	return o;
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return str.contains('dwa') === true && str.contains('foo') === false;
};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var indexOf = String.prototype.indexOf;

module.exports = function (searchString /*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var setPrototypeOf = __webpack_require__(15),
    contains = __webpack_require__(21),
    d = __webpack_require__(5),
    Iterator = __webpack_require__(23),
    defineProperty = Object.defineProperty,
    ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
	Iterator.call(this, arr);
	if (!kind) kind = 'value';else if (contains.call(kind, 'key+value')) kind = 'key+value';else if (contains.call(kind, 'key')) kind = 'key';else kind = 'value';
	defineProperty(this, '__kind__', d('', kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(ArrayIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__list__[i];
		if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
		return i;
	}),
	toString: d(function () {
		return '[object Array Iterator]';
	})
});

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArguments = __webpack_require__(19),
    callable = __webpack_require__(3),
    isString = __webpack_require__(22),
    get = __webpack_require__(100),
    isArray = Array.isArray,
    call = Function.prototype.call,
    some = Array.prototype.some;

module.exports = function (iterable, cb /*, thisArg*/) {
	var mode,
	    thisArg = arguments[2],
	    result,
	    doBreak,
	    broken,
	    i,
	    l,
	    char,
	    code;
	if (isArray(iterable) || isArguments(iterable)) mode = 'array';else if (isString(iterable)) mode = 'string';else iterable = get(iterable);

	callable(cb);
	doBreak = function doBreak() {
		broken = true;
	};
	if (mode === 'array') {
		some.call(iterable, function (value) {
			call.call(cb, thisArg, value, doBreak);
			if (broken) return true;
		});
		return;
	}
	if (mode === 'string') {
		l = iterable.length;
		for (i = 0; i < l; ++i) {
			char = iterable[i];
			if (i + 1 < l) {
				code = char.charCodeAt(0);
				if (code >= 0xD800 && code <= 0xDBFF) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArguments = __webpack_require__(19),
    isString = __webpack_require__(22),
    ArrayIterator = __webpack_require__(98),
    StringIterator = __webpack_require__(102),
    iterable = __webpack_require__(37),
    iteratorSymbol = __webpack_require__(9).iterator;

module.exports = function (obj) {
  if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
  if (isArguments(obj)) return new ArrayIterator(obj);
  if (isString(obj)) return new StringIterator(obj);
  return new ArrayIterator(obj);
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArguments = __webpack_require__(19),
    isString = __webpack_require__(22),
    iteratorSymbol = __webpack_require__(9).iterator,
    isArray = Array.isArray;

module.exports = function (value) {
	if (value == null) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	if (isArguments(value)) return true;
	return typeof value[iteratorSymbol] === 'function';
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols



var setPrototypeOf = __webpack_require__(15),
    d = __webpack_require__(5),
    Iterator = __webpack_require__(23),
    defineProperty = Object.defineProperty,
    StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) return new StringIterator(str);
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, '__length__', d('', str.length));
};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

StringIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(StringIterator),
	_next: d(function () {
		if (!this.__list__) return;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i],
		    code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if (code >= 0xD800 && code <= 0xDBFF) return char + this.__list__[this.__nextIndex__++];
		return char;
	}),
	toString: d(function () {
		return '[object String Iterator]';
	})
});

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(104)() ? Set : __webpack_require__(107);

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var set, iterator, result;
	if (typeof Set !== 'function') return false;
	set = new Set(['raz', 'dwa', 'trzy']);
	if (String(set) !== '[object Set]') return false;
	if (set.size !== 3) return false;
	if (typeof set.add !== 'function') return false;
	if (typeof set.clear !== 'function') return false;
	if (typeof set.delete !== 'function') return false;
	if (typeof set.entries !== 'function') return false;
	if (typeof set.forEach !== 'function') return false;
	if (typeof set.has !== 'function') return false;
	if (typeof set.keys !== 'function') return false;
	if (typeof set.values !== 'function') return false;

	iterator = set.values();
	result = iterator.next();
	if (result.done !== false) return false;
	if (result.value !== 'raz') return false;

	return true;
};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Exports true if environment provides native `Set` implementation,
// whatever that is.



module.exports = function () {
	if (typeof Set === 'undefined') return false;
	return Object.prototype.toString.call(Set.prototype) === '[object Set]';
}();

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var setPrototypeOf = __webpack_require__(15),
    contains = __webpack_require__(21),
    d = __webpack_require__(5),
    Iterator = __webpack_require__(23),
    toStringTagSymbol = __webpack_require__(9).toStringTag,
    defineProperty = Object.defineProperty,
    SetIterator;

SetIterator = module.exports = function (set, kind) {
	if (!(this instanceof SetIterator)) return new SetIterator(set, kind);
	Iterator.call(this, set.__setData__, set);
	if (!kind) kind = 'value';else if (contains.call(kind, 'key+value')) kind = 'key+value';else kind = 'value';
	defineProperty(this, '__kind__', d('', kind));
};
if (setPrototypeOf) setPrototypeOf(SetIterator, Iterator);

SetIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(SetIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__list__[i];
		return [this.__list__[i], this.__list__[i]];
	}),
	toString: d(function () {
		return '[object Set Iterator]';
	})
});
defineProperty(SetIterator.prototype, toStringTagSymbol, d('c', 'Set Iterator'));

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clear = __webpack_require__(33),
    eIndexOf = __webpack_require__(78),
    setPrototypeOf = __webpack_require__(15),
    callable = __webpack_require__(3),
    d = __webpack_require__(5),
    ee = __webpack_require__(112),
    _Symbol = __webpack_require__(9),
    iterator = __webpack_require__(37),
    forOf = __webpack_require__(99),
    Iterator = __webpack_require__(106),
    isNative = __webpack_require__(105),
    call = Function.prototype.call,
    defineProperty = Object.defineProperty,
    getPrototypeOf = Object.getPrototypeOf,
    SetPoly,
    getValues,
    NativeSet;

if (isNative) NativeSet = Set;

module.exports = SetPoly = function Set() /*iterable*/{
	var iterable = arguments[0],
	    self;
	if (!(this instanceof SetPoly)) throw new TypeError('Constructor requires \'new\'');
	if (isNative && setPrototypeOf) self = setPrototypeOf(new NativeSet(), getPrototypeOf(this));else self = this;
	if (iterable != null) iterator(iterable);
	defineProperty(self, '__setData__', d('c', []));
	if (!iterable) return self;
	forOf(iterable, function (value) {
		if (eIndexOf.call(this, value) !== -1) return;
		this.push(value);
	}, self.__setData__);
	return self;
};

if (isNative) {
	if (setPrototypeOf) setPrototypeOf(SetPoly, NativeSet);
	SetPoly.prototype = Object.create(NativeSet.prototype, { constructor: d(SetPoly) });
}

ee(Object.defineProperties(SetPoly.prototype, {
	add: d(function (value) {
		if (this.has(value)) return this;
		this.emit('_add', this.__setData__.push(value) - 1, value);
		return this;
	}),
	clear: d(function () {
		if (!this.__setData__.length) return;
		clear.call(this.__setData__);
		this.emit('_clear');
	}),
	delete: d(function (value) {
		var index = eIndexOf.call(this.__setData__, value);
		if (index === -1) return false;
		this.__setData__.splice(index, 1);
		this.emit('_delete', index, value);
		return true;
	}),
	entries: d(function () {
		return new Iterator(this, 'key+value');
	}),
	forEach: d(function (cb /*, thisArg*/) {
		var thisArg = arguments[1],
		    iterator,
		    result,
		    value;
		callable(cb);
		iterator = this.values();
		result = iterator._next();
		while (result !== undefined) {
			value = iterator._resolve(result);
			call.call(cb, thisArg, value, value, this);
			result = iterator._next();
		}
	}),
	has: d(function (value) {
		return eIndexOf.call(this.__setData__, value) !== -1;
	}),
	keys: d(getValues = function getValues() {
		return this.values();
	}),
	size: d.gs(function () {
		return this.__setData__.length;
	}),
	values: d(function () {
		return new Iterator(this);
	}),
	toString: d(function () {
		return '[object Set]';
	})
}));
defineProperty(SetPoly.prototype, _Symbol.iterator, d(getValues));
defineProperty(SetPoly.prototype, _Symbol.toStringTag, d('c', 'Set'));

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try {
		String(symbol);
	} catch (e) {
		return false;
	}

	// Return 'true' also for polyfills
	if (!validTypes[_typeof(Symbol.iterator)]) return false;
	if (!validTypes[_typeof(Symbol.toPrimitive)]) return false;
	if (!validTypes[_typeof(Symbol.toStringTag)]) return false;

	return true;
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (x) {
	if (!x) return false;
	if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return x[x.constructor.toStringTag] === 'Symbol';
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ES2015 Symbol polyfill for environments that do not (or partially) support it



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var d = __webpack_require__(5),
    validateSymbol = __webpack_require__(111),
    create = Object.create,
    defineProperties = Object.defineProperties,
    defineProperty = Object.defineProperty,
    objPrototype = Object.prototype,
    NativeSymbol,
    SymbolPolyfill,
    HiddenSymbol,
    globalSymbols = create(null),
    isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0,
		    name,
		    ie11BugWorkaround;
		while (created[desc + (postfix || '')]) {
			++postfix;
		}desc += postfix || '';
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}();

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function _Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function _Symbol2(description) {
	var symbol;
	if (this instanceof _Symbol2) throw new TypeError('Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = description === undefined ? '' : String(description);
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return globalSymbols[key] = SymbolPolyfill(String(key));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) {
			if (globalSymbols[key] === s) return key;
		}
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d('', NativeSymbol && NativeSymbol.hasInstance || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', NativeSymbol && NativeSymbol.isConcatSpreadable || SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', NativeSymbol && NativeSymbol.iterator || SymbolPolyfill('iterator')),
	match: d('', NativeSymbol && NativeSymbol.match || SymbolPolyfill('match')),
	replace: d('', NativeSymbol && NativeSymbol.replace || SymbolPolyfill('replace')),
	search: d('', NativeSymbol && NativeSymbol.search || SymbolPolyfill('search')),
	species: d('', NativeSymbol && NativeSymbol.species || SymbolPolyfill('species')),
	split: d('', NativeSymbol && NativeSymbol.split || SymbolPolyfill('split')),
	toPrimitive: d('', NativeSymbol && NativeSymbol.toPrimitive || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', NativeSymbol && NativeSymbol.toStringTag || SymbolPolyfill('toStringTag')),
	unscopables: d('', NativeSymbol && NativeSymbol.unscopables || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () {
		return this.__name__;
	})
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () {
		return 'Symbol (' + validateSymbol(this).__description__ + ')';
	}),
	valueOf: d(function () {
		return validateSymbol(this);
	})
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if ((typeof symbol === 'undefined' ? 'undefined' : _typeof(symbol)) === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag, d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive, d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isSymbol = __webpack_require__(109);

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var d = __webpack_require__(5),
    callable = __webpack_require__(3),
    apply = Function.prototype.apply,
    call = Function.prototype.call,
    create = Object.create,
    defineProperty = Object.defineProperty,
    defineProperties = Object.defineProperties,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    descriptor = { configurable: true, enumerable: false, writable: true },
    on,
    _once2,
    off,
    emit,
    methods,
    descriptors,
    base;

on = function on(type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;else if (_typeof(data[type]) === 'object') data[type].push(listener);else data[type] = [data[type], listener];

	return this;
};

_once2 = function once(type, listener) {
	var _once, self;

	callable(listener);
	self = this;
	on.call(this, type, _once = function once() {
		off.call(self, type, _once);
		apply.call(listener, this, arguments);
	});

	_once.__eeOnceListener__ = listener;
	return this;
};

off = function off(type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if ((typeof listeners === 'undefined' ? 'undefined' : _typeof(listeners)) === 'object') {
		for (i = 0; candidate = listeners[i]; ++i) {
			if (candidate === listener || candidate.__eeOnceListener__ === listener) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];else listeners.splice(i, 1);
			}
		}
	} else {
		if (listeners === listener || listeners.__eeOnceListener__ === listener) {
			delete data[type];
		}
	}

	return this;
};

emit = function emit(type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if ((typeof listeners === 'undefined' ? 'undefined' : _typeof(listeners)) === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) {
			args[i - 1] = arguments[i];
		}listeners = listeners.slice();
		for (i = 0; listener = listeners[i]; ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: _once2,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(_once2),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function exports(o) {
	return o == null ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

/***/ }),
/* 113 */
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
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (_typeof(this) !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function () {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new this.constructor(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
    setImmediate(fn);
  } || function (fn) {
    setTimeoutFunc(fn, 0);
  };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }
})(undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(117).setImmediate))

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function registerImmediate(handle) {
            process.nextTick(function () {
                runIfPresent(handle);
            });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function registerImmediate(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function registerImmediate(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function registerImmediate(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function registerImmediate(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(118), __webpack_require__(113)))

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * smoothscroll polyfill - v0.3.4
 * https://iamdustan.github.io/smoothscroll
 * 2016 (c) Dustan Kasten, Jeremias Menichelli - MIT License
 */

(function (w, d, undefined) {
  'use strict';

  /*
   * aliases
   * w: window global object
   * d: document
   * undefined: undefined
   */

  // polyfill

  function polyfill() {
    // return when scrollBehavior interface is supported
    if ('scrollBehavior' in d.documentElement.style) {
      return;
    }

    /*
     * globals
     */
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    /*
     * object gathering original scroll methods
     */
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    /*
     * define timing method
     */
    var now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} x
     * @returns {Boolean}
     */
    function shouldBailOut(x) {
      if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object' || x === null || x.behavior === undefined || x.behavior === 'auto' || x.behavior === 'instant') {
        // first arg not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError('behavior not valid');
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      var isBody;
      var hasScrollableSpace;
      var hasVisibleOverflow;

      do {
        el = el.parentNode;

        // set condition variables
        isBody = el === d.body;
        hasScrollableSpace = el.clientHeight < el.scrollHeight || el.clientWidth < el.scrollWidth;
        hasVisibleOverflow = w.getComputedStyle(el, null).overflow === 'visible';
      } while (!isBody && !(hasScrollableSpace && !hasVisibleOverflow));

      isBody = hasScrollableSpace = hasVisibleOverflow = null;

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     */
    function step(context) {
      // call method again on next available frame
      context.frame = w.requestAnimationFrame(step.bind(w, context));

      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // return when end points have been reached
      if (currentX === context.x && currentY === context.y) {
        w.cancelAnimationFrame(context.frame);
        return;
      }
    }

    /**
     * scrolls window with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();
      var frame;

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // cancel frame when a scroll event's happening
      if (frame) {
        w.cancelAnimationFrame(frame);
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y,
        frame: frame
      });
    }

    /*
     * ORIGINAL METHODS OVERRIDES
     */

    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function () {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scroll.call(w, arguments[0].left || arguments[0], arguments[0].top || arguments[1]);
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(w, d.body, ~~arguments[0].left, ~~arguments[0].top);
    };

    // w.scrollBy
    w.scrollBy = function () {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(w, arguments[0].left || arguments[0], arguments[0].top || arguments[1]);
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function () {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollIntoView.call(this, arguments[0] || true);
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top);
        // reveal parent in viewport
        w.scrollBy({
          left: parentRects.left,
          top: parentRects.top,
          behavior: 'smooth'
        });
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  if (( false ? 'undefined' : _typeof(exports)) === 'object') {
    // commonjs
    module.exports = { polyfill: polyfill };
  } else {
    // global
    polyfill();
  }
})(window, document);

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(115);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;

/***/ }),
/* 118 */
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
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroup = _ObojoboDraft2.default.textGroup.TextGroup;

var TextGroupAdapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.textGroup;
		}) != null) {
			model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, Infinity, { indent: 0 });
		} else {
			model.modelState.textGroup = TextGroup.create(Infinity, { indent: 0 });
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.label;
		})) {
			model.modelState.label = attrs.content.label;
		} else {
			model.modelState.label = '';
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x2) {
			return x2.align;
		})) {
			return model.modelState.align = attrs.content.align;
		} else {
			return model.modelState.align = 'center';
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.textGroup = model.modelState.textGroup.clone();
		_clone.modelState.label = model.modelState.label;
		return _clone.modelState.align = model.modelState.align;
	},
	toJSON: function toJSON(model, json) {
		json.content.textGroup = model.modelState.textGroup.toDescriptor();
		json.content.label = model.modelState.label;
		return json.content.align = model.modelState.align;
	},
	toText: function toText(model) {
		return model.modelState.textGroup.first.text.value;
	}
};

exports.default = TextGroupAdapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(222);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var Button = _ObojoboDraft2.default.components.Button;
var TextGroupEl = _ObojoboDraft2.default.chunk.textChunk.TextGroupEl;
var TextChunk = _ObojoboDraft2.default.chunk.TextChunk;

var ActionButton = React.createClass({
	displayName: 'ActionButton',
	onClick: function onClick() {
		return this.props.model.processTrigger('onClick');
	},
	render: function render() {
		var textItem = this.props.model.modelState.textGroup.first;

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				TextChunk,
				{ className: 'obojobo-draft--chunks--action-button pad' },
				React.createElement(
					Button,
					{ onClick: this.onClick, value: this.props.model.modelState.label, align: this.props.model.modelState.align },
					React.createElement(TextGroupEl, { textItem: textItem, groupIndex: '0', parentModel: this.props.model })
				)
			)
		);
	}
});

exports.default = ActionButton;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _adapter = __webpack_require__(119);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(120);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.ActionButton', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler() //@TODO
});

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	toText: function toText(model) {
		return '---';
	}
};

exports.default = Adapter;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(223);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var NonEditableChunk = _ObojoboDraft2.default.chunk.NonEditableChunk;


var Break = React.createClass({
	displayName: 'Break',
	render: function render() {
		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				NonEditableChunk,
				{ className: 'obojobo-draft--chunks--break viewer' },
				React.createElement('hr', null)
			)
		);
	}
});

exports.default = Break;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(122);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(123);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.focusableChunk.FocusableSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.Break', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(224);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var TextGroupEl = _ObojoboDraft2.default.chunk.textChunk.TextGroupEl;
var TextChunk = _ObojoboDraft2.default.chunk.TextChunk;


var Code = React.createClass({
	displayName: 'Code',
	render: function render() {
		var _this = this;

		var texts = this.props.model.modelState.textGroup.items.map(function (textItem, index) {
			return React.createElement(TextGroupEl, { parentModel: _this.props.model, textItem: textItem, groupIndex: index, key: index });
		});

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				TextChunk,
				{ className: 'obojobo-draft--chunks--single-text pad' },
				React.createElement(
					'pre',
					null,
					React.createElement(
						'code',
						null,
						texts
					)
				)
			)
		);
	}
});

exports.default = Code;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _viewerComponent = __webpack_require__(125);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;
var adapter = _ObojoboDraft2.default.chunk.textChunk.textGroupAdapter;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.Code', {
	type: 'chunk',
	default: true,
	adapter: adapter,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroupAdapter = _ObojoboDraft2.default.chunk.textChunk.TextGroupAdapter;


var Adapter = {
	construct: function construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs);
		model.modelState.textGroup.maxItems = 1;

		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.url;
		})) {
			model.modelState.url = attrs.content.url;
		} else {
			model.modelState.url = null;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.size;
		})) {
			model.modelState.size = attrs.content.size;
		} else {
			model.modelState.size = 'small';
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x2) {
			return x2.width;
		})) {
			model.modelState.width = attrs.content.width;
		} else {
			model.modelState.width = null;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x3) {
			return x3.height;
		})) {
			model.modelState.height = attrs.content.height;
		} else {
			model.modelState.height = null;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x4) {
			return x4.alt;
		})) {
			return model.modelState.alt = attrs.content.alt;
		} else {
			return model.modelState.alt = null;
		}
	},
	clone: function clone(model, _clone) {
		TextGroupAdapter.clone(model, _clone);
		_clone.modelState.url = model.modelState.url;
		_clone.modelState.size = model.modelState.size;
		_clone.modelState.width = model.modelState.width;
		_clone.modelState.height = model.modelState.height;
		return _clone.modelState.alt = model.modelState.alt;
	},
	toJSON: function toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json);
		json.content.url = model.modelState.url;
		json.content.size = model.modelState.size;
		json.content.width = model.modelState.width;
		json.content.height = model.modelState.height;
		return json.content.alt = model.modelState.alt;
	},
	toText: function toText(model) {
		return 'Image: ' + model.modelState.url + '\n Caption:' + TextGroupAdapter.toText(model);
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Image = React.createClass({
	displayName: 'Image',
	render: function render() {
		var imgStyles = void 0;
		var data = this.props.chunk.modelState;

		if (data.url == null) {
			imgStyles = {
				backgroundImage: Common.util.getBackgroundImage(__webpack_require__(261)),
				backgroundSize: '16px',
				height: '300px'
			};

			return React.createElement('div', { className: 'img-placeholder', style: imgStyles });
		}

		switch (data.size) {
			case 'small':case 'medium':case 'large':
				return React.createElement('img', { src: data.url, unselectable: 'on', alt: data.alt });
			case 'custom':
				imgStyles = {};

				if (data.width != null) {
					imgStyles.width = data.width + 'px';
				}

				if (data.height != null) {
					imgStyles.height = data.height + 'px';
				}

				return React.createElement('img', { src: data.url, unselectable: 'on', alt: data.alt, style: imgStyles });
		}
	}
});

exports.default = Image;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectionHandler = void 0;
var TextGroupSelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;
var FocusableSelectionHandler = _ObojoboDraft2.default.chunk.focusableChunk.FocusableSelectionHandler;
var Chunk = _ObojoboDraft2.default.models.Chunk;

exports.default = SelectionHandler = function (_TextGroupSelectionHa) {
	_inherits(SelectionHandler, _TextGroupSelectionHa);

	function SelectionHandler() {
		_classCallCheck(this, SelectionHandler);

		return _possibleConstructorReturn(this, (SelectionHandler.__proto__ || Object.getPrototypeOf(SelectionHandler)).apply(this, arguments));
	}

	_createClass(SelectionHandler, [{
		key: 'selectStart',
		value: function selectStart(selection, chunk) {
			return FocusableSelectionHandler.prototype.selectStart(selection, chunk);
		}
	}]);

	return SelectionHandler;
}(TextGroupSelectionHandler);

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(225);

var _image = __webpack_require__(128);

var _image2 = _interopRequireDefault(_image);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var TextGroupEl = _ObojoboDraft2.default.chunk.textChunk.TextGroupEl;
var NonEditableChunk = _ObojoboDraft2.default.chunk.NonEditableChunk;


var Figure = React.createClass({
	displayName: 'Figure',
	render: function render() {
		var data = this.props.model.modelState;

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				NonEditableChunk,
				{ className: 'obojobo-draft--chunks--figure viewer ' + data.size, ref: 'component' },
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(
						'figure',
						{ unselectable: 'on' },
						React.createElement(_image2.default, { chunk: this.props.model }),
						data.textGroup.first.text.length > 0 ? React.createElement(
							'figcaption',
							{ ref: 'caption' },
							React.createElement(TextGroupEl, { parentModel: this.props.model, textItem: data.textGroup.first, groupIndex: '0' })
						) : null
					)
				)
			)
		);
	}
});

exports.default = Figure;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _selectionHandler = __webpack_require__(129);

var _selectionHandler2 = _interopRequireDefault(_selectionHandler);

var _adapter = __webpack_require__(127);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(130);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.Figure', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new _selectionHandler2.default()
});

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.html;
		}) != null) {
			model.modelState.html = attrs.content.html;
		} else {
			model.modelState.html = null;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.align;
		}) != null) {
			return model.modelState.align = attrs.content.align;
		} else {
			return model.modelState.align = 'left';
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.html = model.modelState.html;
		return _clone.modelState.align = model.modelState.align;
	},
	toJSON: function toJSON(model, json) {
		json.content.html = model.modelState.html;
		return json.content.align = model.modelState.align;
	},
	toText: function toText(model) {
		var node = document.createElement('p');
		node.innerHTML = model.modelState.html;

		return node.textContent;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(226);

var _katex = __webpack_require__(32);

var _katex2 = _interopRequireDefault(_katex);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var HTML = React.createClass({
	displayName: 'HTML',
	createMarkup: function createMarkup() {
		var div = document.createElement('div');
		div.innerHTML = this.props.model.modelState.html;

		var latexes = div.querySelectorAll('.latex');

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(latexes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var el = _step.value;

				el.innerHTML = _katex2.default.renderToString(el.innerHTML);
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

		return { __html: div.innerHTML };
	},
	render: function render() {
		var data = this.props.model.modelState;

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement('div', { className: 'obojobo-draft--chunks--html viewer pad align-' + data.align, dangerouslySetInnerHTML: this.createMarkup() })
		);
	}
});

exports.default = HTML;

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(132);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(133);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.focusableChunk.FocusableSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.HTML', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroupAdapter = _ObojoboDraft2.default.chunk.textChunk.TextGroupAdapter;


var Adapter = {
	construct: function construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs);
		model.modelState.textGroup.maxItems = 1;

		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.headingLevel;
		})) {
			model.modelState.headingLevel = attrs.content.headingLevel;
		} else {
			model.modelState.headingLevel = 1;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.align;
		})) {
			return model.modelState.align = attrs.content.align;
		} else {
			return model.modelState.align = 'left';
		}
	},
	clone: function clone(model, _clone) {
		TextGroupAdapter.clone(model, _clone);
		_clone.modelState.headingLevel = model.modelState.headingLevel;
		return _clone.modelState.align = model.modelState.align;
	},
	toJSON: function toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json);
		json.content.headingLevel = model.modelState.headingLevel;
		return json.content.align = model.modelState.align;
	},
	toText: function toText(model) {
		return TextGroupAdapter.toText(model);
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(227);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var TextGroupEl = _ObojoboDraft2.default.chunk.textChunk.TextGroupEl;
var TextChunk = _ObojoboDraft2.default.chunk.TextChunk;


var Heading = React.createClass({
	displayName: 'Heading',
	render: function render() {
		var data = this.props.model.modelState;

		var inner = React.createElement('h' + data.headingLevel, null, React.createElement(TextGroupEl, { parentModel: this.props.model, textItem: data.textGroup.first, groupIndex: '0' }));

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				TextChunk,
				{ className: 'obojobo-draft--chunks--heading pad' },
				inner
			)
		);
	}
});

exports.default = Heading;

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(135);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(136);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.Heading', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler(),
	getNavItem: function getNavItem(model) {
		switch (model.modelState.headingLevel) {
			// when 1
			// 	type: 'link',
			// 	label: model.modelState.textGroup.first.text.value,
			// 	path: [model.modelState.textGroup.first.text.value.toLowerCase().replace(/ /g, '-')],
			// 	showChildren: false

			case 1:case 2:
				if (model.modelState.headingLevel === 1 && model.getIndex() === 0) {
					return null;
				}

				return {
					type: 'sub-link',
					label: model.modelState.textGroup.first.text,
					path: [model.toText().toLowerCase().replace(/ /g, '-')],
					showChildren: false
				};

			default:
				return null;
		}
	}
});

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.src;
		}) != null) {
			return model.modelState.src = src;
		} else {
			return model.modelState.src = null;
		}
	},
	clone: function clone(model, _clone) {
		return _clone.modelState.src = model.modelState.src;
	},
	toJSON: function toJSON(model, json) {
		return json.content.src = model.modelState.src;
	},
	toText: function toText(model) {
		return model.modelState.src;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(228);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var IFrame = React.createClass({
	displayName: 'IFrame',
	render: function render() {
		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				'div',
				{ className: 'obojobo-draft--chunks--iframe viewer' },
				React.createElement('iframe', { src: this.props.model.modelState.src, frameBorder: '0', allowFullScreen: 'true' })
			)
		);
	}
});

exports.default = IFrame;

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(138);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(139);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.focusableChunk.FocusableSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.IFrame', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _listStyles = __webpack_require__(38);

var _listStyles2 = _interopRequireDefault(_listStyles);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroup = _ObojoboDraft2.default.textGroup.TextGroup;
var TextGroupAdapter = _ObojoboDraft2.default.chunk.textChunk.TextGroupAdapter;


var Adapter = {
	construct: function construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs);

		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.listStyles;
		}) != null) {
			return model.modelState.listStyles = _listStyles2.default.fromDescriptor(attrs.content.listStyles);
		} else {
			return model.modelState.listStyles = new _listStyles2.default('unordered');
		}
	},
	clone: function clone(model, _clone) {
		TextGroupAdapter.clone(model, _clone);
		return _clone.modelState.listStyles = model.modelState.listStyles.clone();
	},
	toJSON: function toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json);
		return json.content.listStyles = model.modelState.listStyles.toDescriptor();
	},
	toText: function toText(model) {
		console.log('@TODO - List toText method');
		var text = '';
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(model.modelState.textGroup.items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var textItem = _step.value;

				text += '  * ' + textItem.text.value + '\n';
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

		return text;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(229);

var _listStyles = __webpack_require__(38);

var _listStyles2 = _interopRequireDefault(_listStyles);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroup = _ObojoboDraft2.default.textGroup.TextGroup; //@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!

var TextGroupEl = _ObojoboDraft2.default.chunk.textChunk.TextGroupEl;
var Chunk = _ObojoboDraft2.default.models.Chunk;
var MockElement = _ObojoboDraft2.default.mockDOM.MockElement;
var MockTextNode = _ObojoboDraft2.default.mockDOM.MockTextNode;
var TextChunk = _ObojoboDraft2.default.chunk.TextChunk;

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;
var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var selectionHandler = new SelectionHandler();

var List = React.createClass({
	displayName: 'List',
	createMockListElement: function createMockListElement(data, indentLevel) {
		var style = data.listStyles.get(indentLevel);

		var tag = style.type === 'unordered' ? 'ul' : 'ol';
		var el = new MockElement(tag);
		el.start = style.start;
		el._listStyleType = style.bulletStyle;

		return el;
	},
	addItemToList: function addItemToList(ul, li, lis) {
		ul.addChild(li);
		li.listStyleType = ul._listStyleType;
		return lis.push(li);
	},
	render: function render() {
		var curUl = void 0;
		window.yeOldListHandler = List.commandHandler;
		window.yeOldListChunk = this.props.model;

		var data = this.props.model.modelState;

		var texts = data.textGroup;

		var curIndentLevel = 0;
		var curIndex = 0;
		var rootUl = curUl = this.createMockListElement(data, curIndentLevel);
		var lis = [];

		var li = new MockElement('li');
		this.addItemToList(curUl, li, lis);

		for (var itemIndex = 0; itemIndex < texts.items.length; itemIndex++) {
			// if this item is lower than the current indent level...
			var item = texts.items[itemIndex];
			if (item.data.indent < curIndentLevel) {
				// traverse up the tree looking for our curUl:
				while (curIndentLevel > item.data.indent) {
					curUl = curUl.parent.parent;
					curIndentLevel--;
				}

				// else, if this item is higher than the current indent level...
			} else if (item.data.indent > curIndentLevel) {
				// traverse down the tree...
				while (curIndentLevel < item.data.indent) {
					curIndentLevel++;

					// if the last LI's last child isn't a UL, create it
					if ((curUl.lastChild.lastChild != null ? curUl.lastChild.lastChild.type : undefined) !== 'ul' && (curUl.lastChild.lastChild != null ? curUl.lastChild.lastChild.type : undefined) !== 'ol') {
						var newUl = this.createMockListElement(data, curIndentLevel);
						var newLi = new MockElement('li');
						this.addItemToList(newUl, newLi, lis);
						curUl.lastChild.addChild(newUl);
						curUl = newUl;
					} else {
						curUl = curUl.lastChild.lastChild;
					}
				}
			}

			// if the lastChild is not an LI or it is an LI that already has text inside
			if (!((curUl.lastChild != null ? curUl.lastChild.type : undefined) === 'li') || (curUl.lastChild != null ? curUl.lastChild.lastChild : undefined) != null) {
				li = new MockElement('li');
				this.addItemToList(curUl, li, lis);
			}

			var text = new MockTextNode(item.text);
			text.index = curIndex;
			curIndex++;

			curUl.lastChild.addChild(text);
		}

		// console.log 'TREE'
		// console.log '==========================================='
		// @printTree '', rootUl, curUl

		// Remove bullets from nested LIs
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(lis)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				li = _step.value;

				if (__guard__(li.children != null ? li.children[0] : undefined, function (x) {
					return x.nodeType;
				}) !== 'text') {
					li.listStyleType = 'none';
				}
			}

			// React.createElement 'div', { style: { marginLeft: (data.indent * 20) + 'px' } }, @renderEl(rootUl, 0, 0)
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

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				TextChunk,
				{ className: 'obojobo-draft--chunks--list pad' },
				React.createElement(
					'div',
					{ 'data-indent': data.indent },
					this.renderEl(rootUl, 0, 0)
				)
			)
		);
	},
	renderEl: function renderEl(node, index, indent) {
		var key = this.props.model.cid + '-' + indent + '-' + index;

		switch (node.nodeType) {
			case 'text':
				return React.createElement(TextGroupEl, { parentModel: this.props.model, textItem: { text: node.text, data: {} }, key: key, groupIndex: node.index });
			case 'element':
				return React.createElement(node.type, { key: key, start: node.start, style: { listStyleType: node.listStyleType } }, this.renderChildren(node.children, indent + 1));
		}
	},
	renderChildren: function renderChildren(children, indent) {
		// console.log 'renderChildren', children
		var els = [];
		for (var index = 0; index < children.length; index++) {
			var child = children[index];
			els.push(this.renderEl(child, index, indent));
		}

		return els;
	}
});

exports.default = List;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(141);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(142);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.List', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(230);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var MCAnswer = React.createClass({
	displayName: 'MCAnswer',
	render: function render() {
		var _this = this;

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--chunks--mc-assessment--mc-answer'
			},
			this.props.model.children.models.map(function (child, index) {
				var Component = child.getComponentClass();
				return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this.props.moduleData });
			})
		);
	}
});

exports.default = MCAnswer;

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _viewerComponent = __webpack_require__(144);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCAnswer', {
	type: 'chunk',
	adapter: null,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.score;
		}) != null) {
			model.modelState.score = attrs.content.score;
			return model.modelState._score = attrs.content.score;
		} else {
			return model.modelState.score = '';
		}
	},
	clone: function clone(model, _clone) {
		return _clone.modelState.score = model.modelState.score;
	},
	toJSON: function toJSON(model, json) {
		return json.content.score = model.modelState.score;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(231);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(2);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;


var MCChoice = React.createClass({
	displayName: 'MCChoice',
	getDefaultProps: function getDefaultProps() {
		return {
			responseType: null,
			revealAll: false,
			questionSubmitted: false
		};
	},


	// getInitialState: ->
	// 	children: @createChildren(this.props.model.children.models)

	// componentWillReceiveProps: (nextProps) ->
	// 	if nextProps.model?
	// 		@setState { children:@createChildren(this.props.model.children.models) }

	// createChildren: (models) ->
	// 	children = []
	// 	hasFeedback = false
	// 	for model in models
	// 		children.push model
	// 		if model.get('type') is 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
	// 			hasFeedback = true

	// 	if not hasFeedback
	// 		if @props.model.modelState.score is 100
	// 			children.push @createFeedbackItem('Correct!')
	// 		else
	// 			children.push @createFeedbackItem('Incorrect')

	// 	children

	createFeedbackItem: function createFeedbackItem(message) {
		var feedback = OboModel.create('ObojoboDraft.Chunks.MCAssessment.MCFeedback');
		var text = OboModel.create('ObojoboDraft.Chunks.Text');
		// console.log('text', text)
		text.modelState.textGroup.first.text.insertText(0, message);
		// console.log('feedback', feedback)
		feedback.children.add(text);

		return feedback;
	},


	// onChange: (event) ->
	// 	if event.target.checked
	// 		QuestionUtil.recordResponse @props.model.get('id'), true
	// 	else
	// 		QuestionUtil.resetResponse @props.model.get('id')

	// onClick: (event) ->
	// 	# if not @props.isSelected
	// 		# @props.onChange @props.model, true
	// 	# QuestionUtil.recordResponse @props.model.get('id'), true
	// 	@refs.input.checked = true

	getInputType: function getInputType() {
		switch (this.props.responseType) {
			case 'pick-all':
				return 'checkbox';
			default:
				//'pick-one', 'pick-one-multiple-correct'
				return 'radio';
		}
	},
	render: function render() {
		var _this = this;

		var isSelected = __guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, this.props.model), function (x) {
			return x.set;
		}) === true;

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--chunks--mc-assessment--mc-choice' + (isSelected ? ' is-selected' : ' is-not-selected') + (this.props.model.modelState.score === 100 ? ' is-correct' : ' is-incorrect'),
				'data-choice-label': this.props.label
			},
			React.createElement('input', {
				ref: 'input',
				type: this.getInputType(),
				value: this.props.model.get('id'),
				checked: isSelected,
				name: this.props.model.parent.get('id')

			}),
			React.createElement(
				'div',
				{ className: 'children' },
				this.props.model.children.map(function (child, index) {
					var type = child.get('type');
					var isAnswerItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCAnswer';
					var isFeedbackItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback';

					if (isAnswerItem) {
						var Component = child.getComponentClass();
						return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this.props.moduleData });
					}
				})
			)
		);
	}
});

exports.default = MCChoice;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(146);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(147);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCChoice', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(232);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var MCFeedback = React.createClass({
	displayName: 'MCFeedback',
	render: function render() {
		var _this = this;

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--chunks--mc-assessment--mc-feedback' + (this.props.model.parent.modelState.score === 100 ? ' is-correct-feedback' : ' is-incorrect-feedback'),
				'data-choice-label': this.props.label
			},
			this.props.model.children.models.map(function (child, index) {
				var Component = child.getComponentClass();
				return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this.props.moduleData });
			})
		);
	}
});

exports.default = MCFeedback;

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _viewerComponent = __webpack_require__(149);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCFeedback', {
	type: 'chunk',
	adapter: null,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.responseType;
		}) != null) {
			return model.modelState.responseType = attrs.content.responseType;
		} else {
			return model.modelState.responseType = '';
		}
	},
	clone: function clone(model, _clone) {
		return _clone.modelState.responseType = model.modelState.responseType;
	},
	toJSON: function toJSON(model, json) {
		return json.content.responseType = model.modelState.responseType;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(233);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(2);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var Button = _ObojoboDraft2.default.components.Button;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var DOMUtil = _ObojoboDraft2.default.page.DOMUtil;

// FocusUtil = Common.util.FocusUtil

OboModel = _ObojoboDraft2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;
var ScoreUtil = _Viewer2.default.util.ScoreUtil;

// @TODO - This wont update if new children are passed in via props

var MCAssessment = React.createClass({
	displayName: 'MCAssessment',

	// getInitialState: ->
	// 	showingSolution: false

	// componentWillMount: ->
	// 	shuffledIds = QuestionUtil.getData(@props.moduleData.questionState, @props.model, 'shuffledIds')
	// 	if not shuffledIds
	// 		shuffledIds = _.shuffle(@props.model.children.models).map (model) -> model.get('id')
	// 		QuestionUtil.setData(@props.model.get('id'), 'shuffledIds', shuffledIds)

	getResponseData: function getResponseData() {
		var correct = new Set();
		var responses = new Set();

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(this.props.model.children.models)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var child = _step.value;

				if (child.modelState.score === 100) {
					correct.add(child.get('id'));
				}

				if (__guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, child), function (x) {
					return x.set;
				})) {
					// return child.modelState.score
					responses.add(child.get('id'));
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

		return {
			correct: correct,
			responses: responses
		};
	},
	calculateScore: function calculateScore() {
		var responseData = this.getResponseData();
		var correct = responseData.correct;
		var responses = responseData.responses;


		switch (this.props.model.modelState.responseType) {
			case 'pick-all':
				if (correct.size !== responses.size) {
					return 0;
				}
				var score = 100;
				correct.forEach(function (id) {
					if (!responses.has(id)) {
						return score = 0;
					}
				});
				return score;

			default:
				// pick-one | pick-one-multiple-correct
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = Array.from(Array.from(correct))[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var id = _step2.value;

						if (responses.has(id)) {
							return 100;
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

				return 0;
		}
	},
	onClickSubmit: function onClickSubmit(event) {
		event.preventDefault();
		return this.updateScore();
	},
	updateScore: function updateScore() {
		return ScoreUtil.setScore(this.props.model.parent.get('id'), this.calculateScore());
	},
	onClickUndoRevealAll: function onClickUndoRevealAll(event) {
		event.preventDefault();
		return QuestionUtil.setData(this.props.model.get('id'), 'revealAll', false);
	},
	onClickRevealAll: function onClickRevealAll(event) {
		event.preventDefault();
		return QuestionUtil.setData(this.props.model.get('id'), 'revealAll', true);
	},
	onClickReset: function onClickReset(event) {
		event.preventDefault();
		return this.reset();
	},
	reset: function reset() {
		this.clearRevealAll();
		this.clearResponses();
		return this.clearScore();
	},
	clearRevealAll: function clearRevealAll() {
		return QuestionUtil.clearData(this.props.model.get('id'), 'revealAll');
	},

	// QuestionUtil.clearData @props.model.get('id'), 'shuffledIds'

	clearResponses: function clearResponses() {
		return Array.from(this.props.model.children.models).map(function (child) {
			return QuestionUtil.resetResponse(child.get('id'));
		});
	},
	clearScore: function clearScore() {
		return ScoreUtil.clearScore(this.props.model.parent.get('id'));
	},
	onClick: function onClick(event) {
		var mcChoiceEl = DOMUtil.findParentWithAttr(event.target, 'data-type', 'ObojoboDraft.Chunks.MCAssessment.MCChoice');
		if (!mcChoiceEl) {
			return;
		}

		var mcChoiceId = mcChoiceEl.getAttribute('data-id');
		if (!mcChoiceId) {
			return;
		}

		var revealAll = this.isRevealingAll();

		if (this.getScore() !== null) {
			this.reset();
		}

		switch (this.props.model.modelState.responseType) {
			case 'pick-all':
				return QuestionUtil.recordResponse(mcChoiceId, {
					set: !__guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, OboModel.models[mcChoiceId]), function (x) {
						return x.set;
					})
				});

			default:
				// pick-one | pick-one-multiple-correct
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = Array.from(this.props.model.children.models)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var child = _step3.value;

						if (child.get('id') !== mcChoiceId) {
							QuestionUtil.recordResponse(child.get('id'), {
								set: false
							});
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

				return QuestionUtil.recordResponse(mcChoiceId, {
					set: true
				});
		}
	},
	getScore: function getScore() {
		return ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model.parent);
	},


	// showSolution: (event) ->
	// 	event.preventDefault()
	// 	@setState { showingSolution:true }

	isRevealingAll: function isRevealingAll() {
		return QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'revealAll');
	},
	render: function render() {
		var _this = this;

		var responseType = this.props.model.modelState.responseType;


		var shuffledIds = QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'shuffledIds');
		if (!shuffledIds) {
			shuffledIds = _.shuffle(this.props.model.children.models).map(function (model) {
				return model.get('id');
			});
			QuestionUtil.setData(this.props.model.get('id'), 'shuffledIds', shuffledIds);
		}

		var revealAll = this.isRevealingAll();
		var score = this.getScore();
		var questionSubmitted = score !== null;
		var questionAnswered = this.getResponseData().responses.size >= 1;
		// shuffledIds = QuestionUtil.getData(@props.moduleData.questionState, @props.model, 'shuffledIds')
		// shuffledIds = _.shuffle(@props.model.children.models).map (model) -> model.get('id')

		var feedbacks = Array.from(this.getResponseData().responses).filter(function (mcChoiceId) {
			return OboModel.models[mcChoiceId].children.length > 1;
		}).sort(function (id1, id2) {
			return shuffledIds.indexOf(id1) - shuffledIds.indexOf(id2);
		}).map(function (mcChoiceId) {
			return OboModel.models[mcChoiceId].children.at(1);
		});

		var solution = this.props.model.parent.modelState.solution;

		if (solution != null) {
			var SolutionComponent = solution.getComponentClass();
		}

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				onClick: this.onClick,
				tag: 'form',
				className: 'obojobo-draft--chunks--mc-assessment' + (' is-response-type-' + this.props.model.modelState.responseType) + (revealAll ? ' is-revealing-all' : ' is-not-revealing-all') + (score === null ? ' is-unscored' : ' is-scored')
			},
			React.createElement(
				'span',
				{ className: 'instructions' },
				function () {
					switch (responseType) {
						case 'pick-one':
							return React.createElement(
								'span',
								null,
								'Pick the correct answer'
							);
						case 'pick-one-multiple-correct':
							return React.createElement(
								'span',
								null,
								'Pick one of the correct answers'
							);
						case 'pick-all':
							return React.createElement(
								'span',
								null,
								'Pick ',
								React.createElement(
									'b',
									null,
									'all'
								),
								' of the correct answers'
							);
					}
				}()
			),
			shuffledIds.map(function (id, index) {
				var child = OboModel.models[id];
				if (child.get('type') !== 'ObojoboDraft.Chunks.MCAssessment.MCChoice') {
					return null;
				}

				var Component = child.getComponentClass();
				return React.createElement(Component, {
					key: child.get('id'),
					model: child,
					moduleData: _this.props.moduleData,
					responseType: responseType,
					revealAll: revealAll,
					questionSubmitted: questionSubmitted,
					label: String.fromCharCode(index + 65)

				});
			}),
			React.createElement(
				'div',
				{ className: 'submit' },
				questionSubmitted ? React.createElement(Button, {
					altAction: true,
					onClick: this.onClickReset,
					value: 'Try Again'
				}) : React.createElement(Button, {
					onClick: this.onClickSubmit,
					value: 'Check Your Answer',
					disabled: !questionAnswered
				}),
				questionSubmitted ? score === 100 ? React.createElement(
					'div',
					{ className: 'result-container' },
					React.createElement(
						'p',
						{ className: 'result correct' },
						'Correct!'
					)
				) : React.createElement(
					'div',
					{ className: 'result-container' },
					React.createElement(
						'p',
						{ className: 'result incorrect' },
						'Incorrect'
					),
					responseType === 'pick-all' ? React.createElement(
						'span',
						{ className: 'pick-all-instructions' },
						'You have either missed some correct answers or selected some incorrect answers'
					) : null
				) : null
			),
			React.createElement(
				ReactCSSTransitionGroup,
				{
					component: 'div',
					transitionName: 'submit',
					transitionEnterTimeout: 800,
					transitionLeaveTimeout: 800
				},
				questionSubmitted && (feedbacks.length > 0 || solution) ? React.createElement(
					'div',
					{ className: 'solution', key: 'solution' },
					React.createElement(
						'div',
						{ className: 'score' },
						feedbacks.length === 0 ? null : React.createElement(
							'div',
							{ className: 'feedback' + (responseType === 'pick-all' ? ' is-pick-all-feedback' : ' is-not-pick-all-feedback') },
							feedbacks.map(function (model) {
								var Component = model.getComponentClass();
								return React.createElement(Component, {
									key: model.get('id'),
									model: model,
									moduleData: _this.props.moduleData,
									responseType: responseType,
									revealAll: revealAll,
									questionSubmitted: questionSubmitted,
									label: String.fromCharCode(shuffledIds.indexOf(model.parent.get('id')) + 65)
								});
							})
						)
					),
					revealAll ? React.createElement(Button, {
						altAction: true,
						onClick: this.onClickUndoRevealAll,
						value: 'Hide Explanation'
					}) : solution ? React.createElement(Button, {
						altAction: true,
						onClick: this.onClickRevealAll,
						value: 'Read an explanation of the answer'
					}) : null,
					React.createElement(
						ReactCSSTransitionGroup,
						{
							component: 'div',
							transitionName: 'solution',
							transitionEnterTimeout: 800,
							transitionLeaveTimeout: 800
						},
						revealAll ? React.createElement(
							'div',
							{ className: 'solution-container', key: 'solution-component' },
							React.createElement(SolutionComponent, { model: solution, moduleData: this.props.moduleData })
						) : null
					)
				) : null
			)
		);
	}
});

exports.default = MCAssessment;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

__webpack_require__(148);

__webpack_require__(145);

__webpack_require__(150);

var _adapter = __webpack_require__(151);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(152);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.latex;
		}) != null) {
			model.modelState.latex = attrs.content.latex;
		} else {
			model.modelState.latex = '';
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.align;
		}) != null) {
			return model.modelState.align = attrs.content.align;
		} else {
			return model.modelState.align = 'center';
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.latex = model.modelState.latex;
		return _clone.modelState.align = model.modelState.align;
	},
	toJSON: function toJSON(model, json) {
		json.content.latex = model.modelState.latex;
		return json.content.align = model.modelState.align;
	},
	toText: function toText(model) {
		return model.modelState.latex;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(234);

var _katex = __webpack_require__(32);

var _katex2 = _interopRequireDefault(_katex);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// katex = null #dynamically load
var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var NonEditableChunk = _ObojoboDraft2.default.chunk.NonEditableChunk;


var getLatexHtml = function getLatexHtml(latex) {
	try {
		var html = _katex2.default.renderToString(latex, { displayMode: true });
		return { html: html };
	} catch (e) {
		return { error: e };
	}
};

var MathEquation = React.createClass({
	displayName: 'MathEquation',
	getInitialState: function getInitialState() {
		var katexHtml = getLatexHtml(this.props.model.modelState.latex);
		if (katexHtml.error != null) {
			katexHtml = '';
		} else {
			katexHtml = katexHtml.html;
		}

		return { katexHtml: katexHtml };
	},
	render: function render() {
		if (this.state.katexHtml.length === 0) {
			return null;
		}

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData, className: 'obojobo-draft--chunks--math-equation pad align-' + this.props.model.modelState.align },
			React.createElement(
				NonEditableChunk,
				null,
				React.createElement('div', { className: 'katex-container', dangerouslySetInnerHTML: { __html: this.state.katexHtml } })
			)
		);
	}
});

exports.default = MathEquation;

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(154);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(155);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.focusableChunk.FocusableSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.MathEquation', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(235);

var QuestionContent = React.createClass({
	displayName: 'QuestionContent',
	render: function render() {
		var _this = this;

		return React.createElement(
			'div',
			{
				className: 'obojobo-draft--chunks--mc-question--content'
			},
			this.props.model.children.models.slice(0, this.props.model.children.models.length - 1).map(function (child, index) {
				var Component = child.getComponentClass();
				return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this.props.moduleData });
			})
		);
	}
});

exports.default = QuestionContent;

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboModel = _ObojoboDraft2.default.models.OboModel;


var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.shuffle;
		}) != null) {
			model.modelState.shuffle = attrs.content.shuffle;
		} else {
			model.modelState.shuffle = false;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.limit;
		}) != null) {
			model.modelState.limit = attrs.content.limit;
		} else {
			model.modelState.limit = 0;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x2) {
			return x2.practice;
		}) != null) {
			model.modelState.practice = attrs.content.practice;
		} else {
			model.modelState.practice = true;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x3) {
			return x3.solution;
		}) != null) {
			return model.modelState.solution = OboModel.create(attrs.content.solution);
		} else {
			return model.modelState.solution = null;
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.shuffle = model.modelState.shuffle;
		_clone.modelState.type = model.modelState.type;
		_clone.modelState.solution = null;

		if (model.modelState.solution != null) {
			return _clone.modelState.solution = model.modelState.solution.clone();
		}
	},
	toJSON: function toJSON(model, json) {
		json.content.shuffle = model.modelState.shuffle;
		json.content.type = model.modelState.type;
		json.content.solution = null;

		if (model.modelState.solution != null) {
			return json.content.solution = model.modelState.solution.toJSON();
		}
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(236);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(2);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _viewerComponent = __webpack_require__(157);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var FocusUtil = _ObojoboDraft2.default.util.FocusUtil;
var Button = _ObojoboDraft2.default.components.Button;
var ScoreUtil = _Viewer2.default.util.ScoreUtil;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;


var Question = React.createClass({
	displayName: 'Question',
	onClickBlocker: function onClickBlocker() {
		QuestionUtil.viewQuestion(this.props.model.get('id'));

		if (this.props.model.modelState.practice) {
			return FocusUtil.focusComponent(this.props.model.get('id'));
		}
	},


	// setTimeout (->
	// 	FocusUtil.unfocus()
	// 	QuestionUtil.hideQuestion @props.model.get('id')
	// ).bind(@), 5000

	render: function render() {
		if (this.props.showContentOnly) {
			return this.renderContentOnly();
		}

		var score = ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model);
		var viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model);

		var assessment = this.props.model.children.models[this.props.model.children.models.length - 1];
		var AssessmentComponent = assessment.getComponentClass();

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'flip-container obojobo-draft--chunks--question' + (score === null ? '' : score === 100 ? ' is-correct' : ' is-incorrect') + ' is-' + viewState + (this.props.model.modelState.practice ? ' is-practice' : ' is-not-practice')
			},
			React.createElement(
				'div',
				{ className: 'flipper' },
				React.createElement(
					'div',
					{ className: 'content back' },
					React.createElement(_viewerComponent2.default, { model: this.props.model, moduleData: this.props.moduleData }),
					React.createElement(AssessmentComponent, {
						key: assessment.get('id'),
						model: assessment,
						moduleData: this.props.moduleData
					})
				),
				React.createElement(
					'div',
					{ className: 'blocker front', key: 'blocker', onClick: this.onClickBlocker },
					React.createElement(Button, { value: this.props.model.modelState.practice ? 'Try Question' : 'View Question' })
				)
			)
		);
	},
	renderContentOnly: function renderContentOnly() {
		var score = ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model);
		var viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model);

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'flip-container obojobo-draft--chunks--question' + (score === null ? '' : score === 100 ? ' is-correct' : ' is-incorrect') + ' is-active' + (this.props.model.modelState.practice ? ' is-practice' : ' is-not-practice')
			},
			React.createElement(
				'div',
				{ className: 'flipper' },
				React.createElement(
					'div',
					{ className: 'content back' },
					React.createElement(_viewerComponent2.default, { model: this.props.model, moduleData: this.props.moduleData }),
					React.createElement(
						'div',
						{ className: 'pad responses-hidden' },
						'(Responses Hidden)'
					)
				)
			)
		);
	}
});

exports.default = Question;

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(158);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(159);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.Question', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler(),
	getNavItem: function getNavItem(model) {
		var label = void 0;
		var questions = model.parent.children.models.filter(function (child) {
			return child.get('type') === 'ObojoboDraft.Chunks.Question';
		});

		if (model.title) {
			label = model.title;
		} else if (model.modelState.practice) {
			label = 'Practice Question ' + (questions.indexOf(model) + 1);
		} else {
			label = 'Question ' + (questions.indexOf(model) + 1);
		}

		return {
			type: 'sub-link',
			label: label,
			path: ['#obo-' + model.get('id')]
		};
	}
});

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		// choose: How many "groups" in the QuestionBank to display
		// groupSize: The number of items in a "group"
		// select: One of the following
		//	* sequential: Select groups in document order
		//	* random-unseen: Select groups at random. Additional attempts select previously unselected items
		//	* random-all: Select groups at random. Additional attempts may select the same questions
		// shuffleGroup: If true the items in a group are shuffled randomly, otherwise they are presented in document order
		// resetWhenEmpty: If true the saved state of an assessment will be cleared when the assessment has no more questions to show (i.e. Sequential banks start back at the first question, random banks being selecting seen questions, etc)
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.choose;
		}) != null) {
			model.modelState.choose = attrs.content.choose;
		} else {
			model.modelState.choose = Infinity;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.groupSize;
		}) != null) {
			model.modelState.groupSize = attrs.content.groupSize;
		} else {
			model.modelState.groupSize = 1;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x2) {
			return x2.select;
		}) != null) {
			model.modelState.select = attrs.content.select;
		} else {
			model.modelState.select = "sequential"; //random-unseen | random-all | sequential
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x3) {
			return x3.shuffleGroup;
		}) != null) {
			return model.modelState.shuffleGroup = attrs.content.shuffleGroup;
		} else {
			return model.modelState.shuffleGroup = false;
		}
	},


	// if attrs?.content?.resetWhenEmpty?
	// 	model.modelState.resetWhenEmpty = attrs.content.resetWhenEmpty
	// else
	// 	model.modelState.resetWhenEmpty = true

	clone: function clone(model, _clone) {
		_clone.modelState.choose = model.modelState.choose;
		_clone.modelState.groupSize = model.modelState.groupSize;
		_clone.modelState.select = model.modelState.select;
		return _clone.modelState.resetWhenEmpty = model.modelState.resetWhenEmpty;
	},
	toJSON: function toJSON(model, json) {
		json.content.choose = model.modelState.choose;
		json.content.groupSize = model.modelState.groupSize;
		json.content.select = model.modelState.select;
		return json.content.resetWhenEmpty = model.modelState.resetWhenEmpty;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(237);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var QuestionBank = React.createClass({
	displayName: 'QuestionBank',
	render: function render() {
		var _this = this;

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--chunks--question-bank'
			},
			this.props.model.children.models.map(function (child, index) {
				var Component = child.getComponentClass();

				return React.createElement(Component, { key: index, model: child, moduleData: _this.props.moduleData });
			})
		);
	}
});

exports.default = QuestionBank;

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(161);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(162);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.QuestionBank', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _gridTextGroup = __webpack_require__(39);

var _gridTextGroup2 = _interopRequireDefault(_gridTextGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.textGroup;
		}) != null) {
			model.modelState.textGroup = _gridTextGroup2.default.fromDescriptor(attrs.content.textGroup, Infinity, { indent: 0 });
		} else {
			model.modelState.textGroup = _gridTextGroup2.default.create(3, 2);
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.header;
		}) != null) {
			return model.modelState.header = attrs.content.header;
		} else {
			return model.modelState.header = true;
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.textGroup = model.modelState.textGroup.clone();
		return _clone.modelState.header = model.modelState.header;
	},
	toJSON: function toJSON(model, json) {
		json.content.textGroup = model.modelState.textGroup.toDescriptor();
		return json.content.header = model.modelState.header;
	},
	toText: function toText(model) {
		var longestStringLength = 0;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(model.modelState.textGroup.items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var textItem = _step.value;

				longestStringLength = Math.max(longestStringLength, textItem.text.value.length);
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

		var pad = ' '.repeat(longestStringLength);
		var border = '-'.repeat(longestStringLength);

		var text = '';

		text += border + "\n";
		for (var row = 0, end = model.modelState.textGroup.numRows, asc = 0 <= end; asc ? row < end : row > end; asc ? row++ : row--) {
			// console.log 'row', row
			var s = [];
			for (var col = 0, end1 = model.modelState.textGroup.numCols, asc1 = 0 <= end1; asc1 ? col < end1 : col > end1; asc1 ? col++ : col--) {
				// console.log '  col', col
				var i = row * model.modelState.textGroup.numCols + col;

				// console.log '    i', i
				var item = model.modelState.textGroup.items[i];
				s.push((item.text.value + pad).substr(0, pad.length));
			}
			text += '| ' + s.join(' | ') + ' |\n' + border + '\n';
		}

		return text;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(238);

var _gridTextGroup = __webpack_require__(39);

var _gridTextGroup2 = _interopRequireDefault(_gridTextGroup);

var _selectionHandler = __webpack_require__(40);

var _selectionHandler2 = _interopRequireDefault(_selectionHandler);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroupEl = _ObojoboDraft2.default.chunk.textChunk.TextGroupEl;
var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var Table = React.createClass({
	displayName: 'Table',
	render: function render() {
		var _this = this;

		var header = void 0,
		    row = void 0;
		var model = this.props.model;

		var data = model.modelState;
		var numCols = data.textGroup.numCols;


		if (data.header) {
			row = data.textGroup.items.slice(0, numCols).map(function (textGroupItem, index) {
				return React.createElement(
					'th',
					{
						key: index,
						className: 'cell row-0 col-' + index,
						'data-table-position': model.get('id') + ',0,' + index
					},
					React.createElement(TextGroupEl, { parentModel: _this.props.model, textItem: textGroupItem, groupIndex: index })
				);
			});

			header = React.createElement(
				'tr',
				{ key: 'header' },
				row
			);
		} else {
			header = null;
		}

		var startIndex = data.header ? 1 : 0;
		var rows = __range__(startIndex, data.textGroup.numRows, false).map(function (rowNum) {
			row = data.textGroup.items.slice(rowNum * numCols, (rowNum + 1) * numCols).map(function (textGroupItem, index) {
				return React.createElement(
					'td',
					{
						key: index,
						className: 'cell row-' + rowNum + ' col-' + index,
						'data-table-position': model.get('id') + ',' + rowNum + ',' + index
					},
					React.createElement(TextGroupEl, { parentModel: _this.props.model, textItem: textGroupItem, groupIndex: rowNum * numCols + index })
				);
			});

			return React.createElement(
				'tr',
				{ key: rowNum },
				row
			);
		});

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				'div',
				{ className: 'obojobo-draft--chunks--table viewer pad' },
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(
						'table',
						{
							className: 'view',
							ref: 'table',
							key: 'table'
						},
						React.createElement(
							'thead',
							{ key: 'thead' },
							header
						),
						React.createElement(
							'tbody',
							{ key: 'tbody' },
							rows
						)
					)
				)
			)
		);
	}
});

exports.default = Table;

function __range__(left, right, inclusive) {
	var range = [];
	var ascending = left < right;
	var end = !inclusive ? right : ascending ? right + 1 : right - 1;
	for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
		range.push(i);
	}
	return range;
}

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _selectionHandler = __webpack_require__(40);

var _selectionHandler2 = _interopRequireDefault(_selectionHandler);

var _adapter = __webpack_require__(164);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(165);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.Table', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new _selectionHandler2.default()
});

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(239);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var TextGroupEl = _ObojoboDraft2.default.chunk.textChunk.TextGroupEl;
var TextChunk = _ObojoboDraft2.default.chunk.TextChunk;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;


var Text = React.createClass({
	displayName: 'Text',
	render: function render() {
		var _this = this;

		var texts = this.props.model.modelState.textGroup.items.map(function (textItem, index) {
			return React.createElement(TextGroupEl, { textItem: textItem, groupIndex: index, key: index, parentModel: _this.props.model });
		}.bind(this));

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				TextChunk,
				{ className: 'obojobo-draft--chunks--single-text pad' },
				texts
			)
		);
	}
});

exports.default = Text;

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _textGroupAdapter = __webpack_require__(42);

var _textGroupAdapter2 = _interopRequireDefault(_textGroupAdapter);

var _viewerComponent = __webpack_require__(167);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.Text', {
	type: 'chunk',
	default: true,
	adapter: _textGroupAdapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.videoId;
		}) != null) {
			return model.modelState.videoId = attrs.content.videoId;
		} else {
			return model.modelState.videoId = null;
		}
	},
	clone: function clone(model, _clone) {
		return _clone.modelState.videoId = model.modelState.videoId;
	},
	toJSON: function toJSON(model, json) {
		return json.content.videoId = model.modelState.videoId;
	},
	toText: function toText(model) {
		return 'https://www.youtube.com/watch?v=' + model.modelState.videoId;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(240);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var YouTube = React.createClass({
	displayName: 'YouTube',
	render: function render() {
		var data = this.props.model.modelState;

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				'div',
				{ className: 'obojobo-draft--chunks--you-tube viewer' },
				React.createElement('iframe', { src: 'https://www.youtube.com/embed/' + data.videoId, frameBorder: '0', allowFullScreen: 'true' })
			)
		);
	}
});

exports.default = YouTube;

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(169);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(170);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.focusableChunk.FocusableSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.YouTube', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _anchor = __webpack_require__(44);

var _anchor2 = _interopRequireDefault(_anchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = React.createClass({
	displayName: 'focusable-chunk',
	getDefaultProps: function getDefaultProps() {
		return {
			indent: 0,
			spellcheck: true
		};
	},
	getAnchorNode: function getAnchorNode() {
		if (__guard__(__guard__(this.refs != null ? this.refs.anchor : undefined, function (x1) {
			return x1.refs;
		}), function (x) {
			return x.anchorElement;
		}) == null) {
			return null;
		}
		return this.refs.anchor.refs.anchorElement;
	},
	render: function render() {
		var className = this.props.className;


		return React.createElement(
			'div',
			{ className: 'focusable-chunk anchor-container' + (className ? ' ' + className : ''), contentEditable: 'false' },
			React.createElement(_anchor2.default, _extends({}, this.props, { name: 'main', ref: 'anchor' })),
			this.props.children
		);
	}
});

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseSelectionHandler = __webpack_require__(17);

var _baseSelectionHandler2 = _interopRequireDefault(_baseSelectionHandler);

var _focusableSelectionHandler = __webpack_require__(41);

var _focusableSelectionHandler2 = _interopRequireDefault(_focusableSelectionHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToggleSelectionHandler = function (_BaseSelectionHandler) {
	_inherits(ToggleSelectionHandler, _BaseSelectionHandler);

	function ToggleSelectionHandler(textSelectionHandler, focusSelectionHandler) {
		_classCallCheck(this, ToggleSelectionHandler);

		if (focusSelectionHandler == null) {
			focusSelectionHandler = new _focusableSelectionHandler2.default();
		}

		var _this = _possibleConstructorReturn(this, (ToggleSelectionHandler.__proto__ || Object.getPrototypeOf(ToggleSelectionHandler)).call(this));

		_this.textSelectionHandler = textSelectionHandler;
		_this.focusSelectionHandler = focusSelectionHandler;
		return _this;
	}

	_createClass(ToggleSelectionHandler, [{
		key: 'getCopyOfSelection',
		value: function getCopyOfSelection(selection, chunk, cloneId) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getCopyOfSelection.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getCopyOfSelection.apply(this, arguments);
			}
		}
	}, {
		key: 'selectAll',
		value: function selectAll(selection, chunk) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.selectAll.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.selectAll.apply(this, arguments);
			}
		}
	}, {
		key: 'selectStart',
		value: function selectStart(selection, chunk, asRange) {
			if (asRange == null) {
				asRange = false;
			}
			if (chunk.isEditing()) {
				return this.textSelectionHandler.selectStart.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.selectStart.apply(this, arguments);
			}
		}
	}, {
		key: 'selectEnd',
		value: function selectEnd(selection, chunk, asRange) {
			if (asRange == null) {
				asRange = false;
			}
			if (chunk.isEditing()) {
				return this.textSelectionHandler.selectEnd.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.selectEnd.apply(this, arguments);
			}
		}
	}, {
		key: 'getVirtualSelectionStartData',
		value: function getVirtualSelectionStartData(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getVirtualSelectionStartData.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getVirtualSelectionStartData.apply(this, arguments);
			}
		}
	}, {
		key: 'getVirtualSelectionEndData',
		value: function getVirtualSelectionEndData(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getVirtualSelectionEndData.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getVirtualSelectionEndData.apply(this, arguments);
			}
		}
	}, {
		key: 'getDOMSelectionStart',
		value: function getDOMSelectionStart(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getDOMSelectionStart.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getDOMSelectionStart.apply(this, arguments);
			}
		}
	}, {
		key: 'getDOMSelectionEnd',
		value: function getDOMSelectionEnd(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getDOMSelectionEnd.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getDOMSelectionEnd.apply(this, arguments);
			}
		}
	}, {
		key: 'areCursorsEquivalent',
		value: function areCursorsEquivalent(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.areCursorsEquivalent.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.areCursorsEquivalent.apply(this, arguments);
			}
		}
	}]);

	return ToggleSelectionHandler;
}(_baseSelectionHandler2.default);

exports.default = ToggleSelectionHandler;

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = React.createClass({
	displayName: "non-editable-chunk",
	getDefaultProps: function getDefaultProps() {
		return { indent: 0 };
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "non-editable-chunk" + (this.props.className ? " " + this.props.className : ''), contentEditable: "false", "data-indent": this.props.indent },
			this.props.children
		);
	}
});

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = React.createClass({
	displayName: 'text-chunk',
	getDefaultProps: function getDefaultProps() {
		return { indent: 0 };
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'text-chunk' + (this.props.className ? ' ' + this.props.className : '') },
			this.props.children
		);
	}
});

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (chunk, targetTextGroupItem) {
	var results = void 0;
	console.time('linkify');

	var styleApplied = false;
	var links = [];

	var selection = chunk.page.module.app.selection;

	var styleableText = targetTextGroupItem.text;

	while ((results = regex.exec(styleableText.value)) !== null) {
		links.unshift([results.index, regex.lastIndex, styleableText.value.substring(results.index, regex.lastIndex)]);
	}

	if (links.length === 0) {
		return false;
	}

	selection.saveVirtualSelection();

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(links)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var link = _step.value;

			selection.virtual.start.data.groupIndex = targetTextGroupItem.index;
			selection.virtual.end.data.groupIndex = selection.virtual.start.data.groupIndex;
			selection.virtual.start.data.offset = link[0];
			selection.virtual.end.data.offset = link[1];

			if (chunk.getSelectionStyles().a == null) {
				if (link[2].indexOf('http') !== 0) {
					link[2] = "http://" + link[2];
				}
				chunk.styleSelection('a', { href: link[2] });

				styleApplied = true;
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

	selection.restoreVirtualSelection();

	console.timeEnd('linkify');

	return styleApplied;
};

//
// Regular Expression for URL validation
//
// Author: Diego Perini
// Updated: 2010/12/05
// License: MIT
//
// Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// the regular expression composed & commented
// could be easily tweaked for RFC compliance,
// it was expressly modified to fit & satisfy
// these test for an URL shortener:
//
//   http://mathiasbynens.be/demo/url-regex
//
// Notes on possible differences from a standard/generic validation:
//
// - utf-8 char class take in consideration the full Unicode range
// - TLDs have been made mandatory so single names like "localhost" fails
// - protocols have been restricted to ftp, http and https only as requested
//
// Changes:
//
// - IP address dotted notation validation, range: 1.0.0.0 - 223.255.255.255
//   first and last IP address of each class is considered invalid
//   (since they are broadcast/network addresses)
//
// - Added exclusion of private, reserved and/or local networks ranges
//
// - Made starting path slash optional (http://example.com?foo=bar)
//
// - Allow a dot (.) at the end of hostnames (http://example.com.)
//
// Compressed one-line versions:
//
// Javascript version
//
// /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
//
// PHP version
//
// _^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]-*)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]-*)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$_iuS
//
// re_weburl = new RegExp(
// 	# "^" +
// 	# protocol identifier
// 	"(?:(?:https?|ftp)://)" +
// 	# user:pass authentication
// 	"(?:\\S+(?::\\S*)?@)?" +
// 	"(?:" +
// 		# IP address exclusion
// 		# private & local networks
// 		"(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
// 		"(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
// 		"(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
// 		# IP address dotted notation octets
// 		# excludes loopback network 0.0.0.0
// 		# excludes reserved space >= 224.0.0.0
// 		# excludes network & broacast addresses
// 		# (first & last IP address of each class)
// 		"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
// 		"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
// 		"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
// 	"|" +
// 		# host name
// 		"(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
// 		# domain name
// 		"(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
// 		# TLD identifier
// 		"(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
// 		# TLD may end with dot
// 		"\\.?" +
// 	")" +
// 	# port number
// 	"(?::\\d{2,5})?" +
// 	# resource path
// 	"(?:[/?#]\\S*)?" #+
// 	, "gi"
// 	# "$", "i"
// )

var regex = new RegExp(
// "^" +
// protocol identifier
"(?:(?:https?)://)?" +
// user:pass authentication
"(?:\\S+(?::\\S*)?@)?" + "(?:" +
// IP address exclusion
// private & local networks
"(?!(?:10|127)(?:\\.\\d{1,3}){3})" + "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" + "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
// IP address dotted notation octets
// excludes loopback network 0.0.0.0
// excludes reserved space >= 224.0.0.0
// excludes network & broacast addresses
// (first & last IP address of each class)
"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" + "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" + "|" +
// host name
"(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
// domain name
"(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
// TLD identifier
"(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
// TLD may end with dot
"\\.?" + ")" +
// port number
"(?::\\d{2,5})?" +
// resource path
"(?:[/?#]\\S*)?" //+
, "gi"
// "$", "i"
);

;

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseSelectionHandler = __webpack_require__(17);

var _baseSelectionHandler2 = _interopRequireDefault(_baseSelectionHandler);

var _textGroupSelection = __webpack_require__(58);

var _textGroupSelection2 = _interopRequireDefault(_textGroupSelection);

var _textGroupEl = __webpack_require__(43);

var _textGroupEl2 = _interopRequireDefault(_textGroupEl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextGroupSelectionHandler = function (_BaseSelectionHandler) {
	_inherits(TextGroupSelectionHandler, _BaseSelectionHandler);

	function TextGroupSelectionHandler() {
		_classCallCheck(this, TextGroupSelectionHandler);

		return _possibleConstructorReturn(this, (TextGroupSelectionHandler.__proto__ || Object.getPrototypeOf(TextGroupSelectionHandler)).apply(this, arguments));
	}

	_createClass(TextGroupSelectionHandler, [{
		key: 'selectStart',
		value: function selectStart(selection, chunk, asRange) {
			if (asRange == null) {
				asRange = false;
			}
			selection.virtual.start = _textGroupSelection2.default.getGroupStartCursor(chunk).virtualCursor;
			if (!asRange) {
				return selection.virtual.collapse();
			}
		}
	}, {
		key: 'selectEnd',
		value: function selectEnd(selection, chunk, asRange) {
			if (asRange == null) {
				asRange = false;
			}
			selection.virtual.end = _textGroupSelection2.default.getGroupEndCursor(chunk).virtualCursor;
			if (!asRange) {
				return selection.virtual.collapseToEnd();
			}
		}
	}, {
		key: 'selectAll',
		value: function selectAll(selection, chunk) {
			return _textGroupSelection2.default.selectGroup(chunk, selection.virtual);
		}
	}, {
		key: 'getCopyOfSelection',
		value: function getCopyOfSelection(selection, chunk, cloneId) {
			if (cloneId == null) {
				cloneId = false;
			}
			var clone = chunk.clone(cloneId);

			var position = selection.virtual.getPosition(chunk);
			if (position === 'contains' || position === 'start' || position === 'end') {
				var sel = new _textGroupSelection2.default(chunk, selection.virtual);

				var chunkStart = _textGroupSelection2.default.getGroupStartCursor(chunk);
				var chunkEnd = _textGroupSelection2.default.getGroupEndCursor(chunk);

				clone.modelState.textGroup.deleteSpan(sel.end.groupIndex, sel.end.offset, chunkEnd.groupIndex, chunkEnd.offset, true, this.mergeTextGroups);
				clone.modelState.textGroup.deleteSpan(chunkStart.groupIndex, chunkStart.offset, sel.start.groupIndex, sel.start.offset, true, this.mergeTextGroups);
			}

			return clone;
		}
	}, {
		key: 'getVirtualSelectionStartData',
		value: function getVirtualSelectionStartData(selection, chunk) {
			// console.log('selection.dom', selection)
			if ((selection.dom != null ? selection.dom.startText : undefined) == null) {
				return null;
			}
			return _textGroupSelection2.default.getCursorDataFromDOM(selection.dom.startText, selection.dom.startOffset);
		}
	}, {
		key: 'getVirtualSelectionEndData',
		value: function getVirtualSelectionEndData(selection, chunk) {
			if ((selection.dom != null ? selection.dom.startText : undefined) == null) {
				return null;
			}
			return _textGroupSelection2.default.getCursorDataFromDOM(selection.dom.endText, selection.dom.endOffset);
		}
	}, {
		key: 'getDOMSelectionStart',
		value: function getDOMSelectionStart(selection, chunk) {
			return _textGroupEl2.default.getDomPosition(selection.virtual.start);
		}
	}, {
		key: 'getDOMSelectionEnd',
		value: function getDOMSelectionEnd(selection, chunk) {
			return _textGroupEl2.default.getDomPosition(selection.virtual.end);
		}
	}, {
		key: 'areCursorsEquivalent',
		value: function areCursorsEquivalent(selectionWhichIsNullTODO, chunk, thisCursor, otherCursor) {
			return thisCursor.chunk === otherCursor.chunk && thisCursor.data.offset === otherCursor.data.offset && thisCursor.data.groupIndex === otherCursor.data.groupIndex;
		}
	}, {
		key: 'highlightSelection',
		value: function highlightSelection(selection, chunk) {
			chunk.markDirty();

			var sel = new _textGroupSelection2.default(chunk, selection.virtual);

			return chunk.modelState.textGroup.styleText(sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset, '_comment', {});
		}
	}]);

	return TextGroupSelectionHandler;
}(_baseSelectionHandler2.default);

exports.default = TextGroupSelectionHandler;

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.replaceTextsWithinSelection = exports.activateStyle = exports.deleteSelection = exports.send = undefined;

var _oboModel = __webpack_require__(6);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Utility methods for dealing with chunks

var send = function send(fn, chunkOrChunks, selection, data) {
	if (data == null) {
		data = [];
	}
	if (!(chunkOrChunks instanceof Array)) {
		return chunkOrChunks.callCommandFn(fn, data);
	}

	var chunks = chunkOrChunks;
	var results = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(chunks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var chunk = _step.value;

			results.push(chunk.callCommandFn(fn, data));
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

	return results;
};

var deleteSelection = function deleteSelection(selection) {
	// vs = selection.virtual
	// type = vs.type


	// console.clear()
	// console.log 'deleteSelection'
	// console.log type

	if (selection.virtual.type === 'caret') {
		return;
	}
	// console.log JSON.stringify(selection.getSelectionDescriptor(), null, 2);
	// console.log 'con', vs.inbetween

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Array.from(selection.virtual.inbetween)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var node = _step2.value;

			node.remove();
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

	selection.saveVirtualSelection();

	selection.startChunk.deleteSelection();
	selection.restoreVirtualSelection();

	if (selection.virtual.type === 'chunkSpan') {
		selection.endChunk.deleteSelection();
		if (selection.endChunk.canMergeWith(selection.startChunk)) {
			selection.startChunk.merge(selection.endChunk);
		}
	}

	return selection.virtual.collapse();
};

var replaceTextsWithinSelection = function replaceTextsWithinSelection(selection, newChunk, expandSelection) {
	if (expandSelection == null) {
		expandSelection = true;
	}
	selection.virtual.start.chunk.addChildBefore(newChunk);

	if (expandSelection) {
		selection.virtual.start.data.offset = 0;
		var end = selection.virtual.end;

		end.data.offset = end.chunk.modelState.textGroup.get(end.data.groupIndex).text.length;
	}

	return newChunk.replaceSelection();
};

var activateStyle = function activateStyle(style, selection, styleBrush, data) {
	if (data == null) {
		data = null;
	}
	if (selection.virtual.type === 'caret') {
		return styleBrush.add(style, selection.styles[style] != null);
	} else {
		if (selection.styles[style] != null) {
			return send('unstyleSelection', selection.virtual.all, selection, [style, data]);
		} else {
			return send('styleSelection', selection.virtual.all, selection, [style, data]);
		}
	}
};

exports.send = send;
exports.deleteSelection = deleteSelection;
exports.activateStyle = activateStyle;
exports.replaceTextsWithinSelection = replaceTextsWithinSelection;

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (componentClass, position, referenceChunk, selection, callback) {
	var newChunk = _oboModel2.default.create(componentClass);
	var extraChunk = null;

	switch (position) {
		case 'before':
			referenceChunk.addChildBefore(newChunk);
			if (newChunk.isFirst()) {
				newChunk.addChildBefore(_oboModel2.default.create());
			}
			break;

		case 'after':
			referenceChunk.addChildAfter(newChunk);
			if (newChunk.isLast()) {
				newChunk.addChildAfter(_oboModel2.default.create());
			}
			break;
	}

	newChunk.selectStart();

	return callback();
};

var _oboModel = __webpack_require__(6);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (componentClass, position, referenceChunk, selection, callback) {
	var newChunk = _oboModel2.default.create(componentClass);

	switch (position) {
		case 'before':
			referenceChunk.addChildBefore(newChunk);break;
		case 'after':
			referenceChunk.addChildAfter(newChunk);break;
	}

	newChunk.selectStart();

	return callback();
};

var _oboModel = __webpack_require__(6);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentClassMap = function () {
	function ComponentClassMap() {
		_classCallCheck(this, ComponentClassMap);

		this.nameToClass = new Map();
		this.classToName = new Map();
		this.defaultClass = null;
		this.errorClass = null;
	}

	_createClass(ComponentClassMap, [{
		key: "setDefault",
		value: function setDefault(type) {
			return this.defaultClass = this.getClassForType(type);
		}

		// getDefaultComponentClass: ->
		// 	console.log '__________GET DEFAULT CLASS', @defaultClass
		// 	@defaultClass

	}, {
		key: "setError",
		value: function setError(type) {
			return this.errorClass = this.getClassForType(type);
		}

		// getErrorComponentClass: ->
		// 	@errorClass

	}, {
		key: "register",
		value: function register(type, componentClass) {
			this.nameToClass.set(type, componentClass);
			return this.classToName.set(componentClass, type);
		}
	}, {
		key: "getClassForType",
		value: function getClassForType(type) {
			var componentClass = this.nameToClass.get(type);

			if (componentClass == null) {
				return this.errorClass;
			}

			return componentClass;
		}
	}, {
		key: "getTypeOfClass",
		value: function getTypeOfClass(componentClass) {
			return this.classToName.get(componentClass);
		}
	}, {
		key: "hasType",
		value: function hasType(type) {
			return this.nameToClass.has(type);
		}
	}, {
		key: "hasClass",
		value: function hasClass(componentClass) {
			return this.classToName.has(componentClass);
		}
	}]);

	return ComponentClassMap;
}();

exports.default = ComponentClassMap;

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(243);

var _getBackgroundImage = __webpack_require__(63);

var _getBackgroundImage2 = _interopRequireDefault(_getBackgroundImage);

var _edit = __webpack_require__(262);

var _edit2 = _interopRequireDefault(_edit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = React.createClass({
	displayName: 'edit-button',
	getDefaultProps: function getDefaultProps() {
		return { indent: 0 };
	},
	render: function render() {
		var editButtonStyles = { backgroundImage: Common.util.getBackgroundImage(_edit2.default) };

		return React.createElement(
			'div',
			{ className: 'obojobo-draft--components--edit-button' },
			React.createElement(
				'button',
				{
					onClick: this.props.onClick,
					style: editButtonStyles,
					tabIndex: this.props.shouldPreventTab ? '-1' : 1,
					disabled: this.props.shouldPreventTab
				},
				'Edit'
			)
		);
	}
});

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(244);

var _focusUtil = __webpack_require__(29);

var _focusUtil2 = _interopRequireDefault(_focusUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FocusBlocker = React.createClass({
	displayName: 'FocusBlocker',
	render: function render() {
		return React.createElement('div', { className: 'viewer--components--focus-blocker' });
	}
});

exports.default = FocusBlocker;

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(245);

exports.default = React.createClass({
	displayName: "modal-container",
	render: function render() {
		return React.createElement(
			"div",
			{ className: "obojobo-draft--components--modal-container" },
			React.createElement(
				"div",
				{ className: "content" },
				this.props.children
			)
		);
	}
});

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(247);

var _bubble = __webpack_require__(46);

var _bubble2 = _interopRequireDefault(_bubble);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = React.createClass({
	displayName: 'single-input-bubble',
	onChange: function onChange(event) {
		console.log('BubbleChange', event.target.value);
		return this.props.onChange(event.target.value);
	},
	onSubmit: function onSubmit(event) {
		event.preventDefault();
		return this.props.onClose();
	},
	onKeyUp: function onKeyUp(event) {
		console.log(event.keyCode);
		if (event.keyCode === 27) {
			//ESC
			return this.props.onCancel();
		}
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		return setTimeout(function () {
			return _this.refs.input.select();
		});
	},
	render: function render() {
		console.log('BubbleRender', this.props.value);
		return React.createElement(
			_bubble2.default,
			null,
			React.createElement(
				'label',
				{ className: 'single-input-bubble' },
				React.createElement(
					'form',
					{ className: 'interactable', onSubmit: this.onSubmit },
					React.createElement('input', { ref: 'input', type: 'text', value: this.props.value, onChange: this.onChange, onKeyUp: this.onKeyUp }),
					React.createElement(
						'button',
						{ onClick: this.onSubmit },
						'Ok'
					)
				),
				React.createElement(
					'span',
					{ className: 'label' },
					this.props.label
				)
			)
		);
	}
});

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = React.createClass({
	displayName: 'question',
	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'p',
				null,
				this.props.children
			),
			React.createElement(
				'button',
				{ onClick: this.props.modal.onButtonClick.bind(this, this.props.cancelOnReject ? this.props.cancel : this.props.reject) },
				this.props.rejectButtonLabel || 'No'
			),
			React.createElement(
				'button',
				{ onClick: this.props.modal.onButtonClick.bind(this, this.props.confirm) },
				this.props.confirmButtonLabel || 'Yes'
			)
		);
	}
});

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = React.createClass({
	displayName: 'simple-message',
	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'p',
				null,
				this.props.children
			),
			React.createElement(
				'button',
				{ onClick: this.props.modal.onButtonClick.bind(this, this.props.confirm) },
				this.props.buttonLabel || 'OK'
			)
		);
	}
});

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _focusUtil = __webpack_require__(29);

var _focusUtil2 = _interopRequireDefault(_focusUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = React.createClass({
	displayName: 'OboComponent',
	getDefaultProps: function getDefaultProps() {
		return { tag: 'div' };
	},
	componentDidMount: function componentDidMount() {
		return this.props.model.processTrigger('onMount');
	},
	componentWillUnmount: function componentWillUnmount() {
		return this.props.model.processTrigger('onUnmount');
	},
	render: function render() {
		var Component = this.props.model.getComponentClass();
		var Tag = this.props.tag;

		var className = 'component';
		if (this.props.className != null) {
			className += ' ' + this.props.className;
		}

		var isFocussed = _focusUtil2.default.getFocussedComponent(this.props.moduleData.focusState) === this.props.model;

		return React.createElement(
			Tag,
			_extends({}, this.props, {
				className: className,
				id: 'obo-' + this.props.model.get('id'),
				'data-obo-component': true,
				'data-id': this.props.model.get('id'),
				'data-type': this.props.model.get('type'),
				'data-focussed': isFocussed
			}),
			this.props.children
		);
	}
});

exports.default = OboComponent;

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(252);

var TextMenu = React.createClass({
	displayName: 'TextMenu',

	// getInitialState: ->
	// 	selectionRect: @props.selection.rect

	// componentWillReceiveProps: (nextProps) ->
	// 	@setState {
	// 		selectionRect: nextProps.selection.rect
	// 	}

	renderImg: function renderImg(command) {
		if (command.image == null) {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'span',
					null,
					command.label
				),
				React.createElement('img', { className: 'click-blocker' })
			);
		}

		return React.createElement('img', { src: command.image, alt: command.label, title: command.label });
	},
	onMouseDown: function onMouseDown(label, event) {
		console.log(arguments);

		event.preventDefault();
		event.stopPropagation();

		return this.props.commandHandler(label);
	},
	render: function render() {
		var _this = this;

		if (!this.props.relativeToElement) {
			return null;
		}
		if (!this.props.enabled) {
			return null;
		}

		var ctrlRect = this.props.relativeToElement.getBoundingClientRect();
		var selRect = this.props.selectionRect;
		var renderImg = this.renderImg;


		if (!selRect || !this.props.commands || this.props.commands.length === 0) {
			return null;
		}

		return React.createElement('div', { className: 'editor--components--text-menu', style: {
				left: selRect.left + selRect.width / 2 - ctrlRect.left + 'px',
				top: selRect.top - ctrlRect.top + 'px'
				// height: HEIGHT + 'px'
			} }, this.props.commands.map(function (command, index) {
			return React.createElement('a', {
				onMouseDown: _this.onMouseDown.bind(null, command.label),
				key: index
			}, renderImg(command));
		}));
	}
});

exports.default = TextMenu;

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _oboModel = __webpack_require__(6);

var _oboModel2 = _interopRequireDefault(_oboModel);

var _styleableText = __webpack_require__(12);

var _styleableText2 = _interopRequireDefault(_styleableText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var patternAddUL = /<LI>([\s\S]*?)<\/LI>/gi;
var patternRemoveExtraUL = /<\/ul><ul>/gi;
var patternTF = /<\/?textformat\s?[\s\S]*?>/gi;

var Legacy = {
	createModuleFromObo2ModuleJSON: function createModuleFromObo2ModuleJSON(json) {
		var oboModule = _oboModel2.default.create('ObojoboDraft.Modules.Module');

		var objective = _oboModel2.default.create('ObojoboDraft.Sections.Content');
		// oboModule.children.add objective
		var objectivePage = _oboModel2.default.create('ObojoboDraft.Pages.Page');
		objective.children.add(objectivePage);
		objectivePage.children.add(Legacy.createChunksFromObo2HTML(json.objective));

		var content = _oboModel2.default.create('ObojoboDraft.Sections.Content');
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(json.pages)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var page = _step.value;

				content.children.add(Legacy.createPageFromObo2ModuleJSON(page));
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

		oboModule.children.add(objective);
		oboModule.children.add(content);

		return oboModule;
	},
	createPageFromObo2ModuleJSON: function createPageFromObo2ModuleJSON(json) {
		var page = _oboModel2.default.create('ObojoboDraft.Pages.Page');

		var header = _oboModel2.default.create('ObojoboDraft.Chunks.Heading');
		header.modelState.textGroup.first.text.value = json.title;
		page.children.add(header);

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = Array.from(json.items)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var item = _step2.value;

				switch (item.component) {
					case 'TextArea':
						page.children.add(Legacy.createChunksFromObo2HTML(item.data));
						break;

					case 'MediaView':
						page.children.add(Legacy.createMediaFromObo2JSON(item.media));
						break;
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

		return page;
	},
	createChunksFromObo2HTML: function createChunksFromObo2HTML(html) {
		var chunks = [];

		// get rid of all the textformat tags
		html = html.replace(patternTF, "");

		// add <ul></ul> arround list items
		html = html.replace(patternAddUL, "<ul><li>$1</li></ul>");

		//kill extra </ul><ul> that are back to back - this will make proper lists
		html = html.replace(patternRemoveExtraUL, "");

		var el = document.createElement('div');
		document.body.appendChild(el);
		el.innerHTML = html;

		var sts = null;
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = Array.from(el.children)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var child = _step3.value;

				var chunk;
				switch (child.tagName.toLowerCase()) {
					case 'ul':
						chunk = _oboModel2.default.create('ObojoboDraft.Chunks.List');
						break;

					default:
						chunk = _oboModel2.default.create('ObojoboDraft.Chunks.Text');
				}

				var tg = chunk.modelState.textGroup;
				tg.clear();
				sts = _styleableText2.default.createFromElement(child);
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = Array.from(sts)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var st = _step4.value;

						tg.add(st);
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

				chunks.push(chunk);
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

		document.body.removeChild(el);

		console.log('-----------------');
		console.log(html);
		console.log(el.innerHTML);
		console.log(chunks);
		console.log(sts);

		return chunks;
	},
	createMediaFromObo2JSON: function createMediaFromObo2JSON(json) {
		return _oboModel2.default.create('ObojoboDraft.Chunks.Figure');
	}
};

exports.default = Legacy;

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var makeRequest = function makeRequest(method, url, data, callback) {
	if (data == null) {
		data = null;
	}
	if (callback == null) {
		callback = function callback() {};
	}
	var request = new XMLHttpRequest();

	request.addEventListener('load', callback); //(event) ->
	// callback Module.createFromDescriptor({ id:moduleId, chunks:JSON.parse(request.responseText) })

	request.open(method, url, true);

	if (data != null) {
		var a = [];
		for (var k in data) {
			var v = data[k];
			a.push(k + '=' + v);
		}
		data = a.join("&");

		return request.send(data);
	} else {
		return request.send();
	}
};

var APIModule = function () {
	function APIModule() {
		_classCallCheck(this, APIModule);
	}

	_createClass(APIModule, [{
		key: 'get',
		value: function get(moduleId, callback) {
			return makeRequest('GET', '/api/draft/' + moduleId + '/chunks', null, function (event) {
				return callback({ id: moduleId, chunks: JSON.parse(event.target.responseText) });
			});
		}
	}]);

	return APIModule;
}();

var APIChunk = function () {
	function APIChunk() {
		_classCallCheck(this, APIChunk);
	}

	_createClass(APIChunk, [{
		key: 'move',
		value: function move(chunkMoved, chunkBefore, callback) {
			console.log(arguments);
			var beforeId = chunkBefore != null ? chunkBefore.get('id') : null;
			return makeRequest('POST', '/api/chunk/' + chunkMoved.get('id') + '/move_before', { before_chunk_id: beforeId }, callback);
		}
	}]);

	return APIChunk;
}();

var API = function API() {
	_classCallCheck(this, API);
};

Object.defineProperties(API.prototype, {
	"module": {
		get: function get() {
			return new APIModule();
		}
	},

	"chunk": {
		get: function get() {
			return new APIChunk();
		}
	}
});

exports.default = new API();

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var addEl = function addEl(url, el, onLoad, onError) {
	if (onLoad == null) {
		onLoad = null;
	}
	if (onError == null) {
		onError = null;
	}
	if (loaded[url]) {
		if (onLoad != null) {
			onLoad(url);
		}
		return true; // return true, meaning the file was loaded
	}

	if (onError != null) {
		el.onerror = onError;
	}
	if (onLoad != null) {
		el.onload = function () {
			loaded[url] = url;
			return onLoad(url);
		};
	}

	document.head.appendChild(el);

	return false; // return false, meaning the file wasn't already loaded
};

var loaded = {};

exports.default = {
	add: function add(urlOrUrls, onLoad, onError) {
		var urls = void 0;
		var type = void 0;
		if (onLoad == null) {
			onLoad = null;
		}
		if (onError == null) {
			onError = null;
		}
		console.log('add', arguments);

		if (typeof urlOrUrls === 'string') {
			urls = [urlOrUrls];
		} else {
			urls = urlOrUrls;
		}

		return Array.from(urls).map(function (url) {
			return type = url.substr(url.lastIndexOf('.') + 1), console.log(type), function () {
				switch (type) {
					case 'js':
						var script = document.createElement('script');
						script.setAttribute('src', url);
						return addEl(url, script, onLoad, onError);

					case 'css':
						var link = document.createElement('link');
						link.setAttribute('rel', 'stylesheet');
						link.setAttribute('href', url);
						return addEl(url, link, onLoad, onError);
				}
			}();
		});
	}
};

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	SPACE: 32,
	LEFT_ARROW: 37,
	UP_ARROW: 38,
	RIGHT_ARROW: 39,
	DOWN_ARROW: 40,
	DELETE: 46,
	META: 91
};

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _oboSelectionRect = __webpack_require__(26);

var _oboSelectionRect2 = _interopRequireDefault(_oboSelectionRect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PX_EDGE_PADDING = 50;

var Screen = function () {
	function Screen(el) {
		_classCallCheck(this, Screen);

		this.el = el;
		this.intervalId = null;
		this.distance = 0;
		this.distanceLeft = 0;
		this.travelBy = 0;
	}

	// getScrollPosition: ->
	// 	x: @el.scrollTop
	// 	y: @el.scrollLeft

	// saveScrollPosition: ->
	// 	pos = @getScrollPosition()

	// 	@savedScrollPos = @getScrollPosition()
	// 	console.log 'Screen.saveScrollPosition', @savedScrollPos

	// restoreScrollPosition: ->
	// 	return if not @savedScrollPos?
	// 	console.log 'Screen.restoreScrollPosition', @savedScrollPos
	// 	window.scrollTo @savedScrollPos.x, @savedScrollPos.y

	_createClass(Screen, [{
		key: 'scrollToTop',
		value: function scrollToTop() {
			return this.el.scrollTop = 0;
		}
	}, {
		key: 'scrollToBottom',
		value: function scrollToBottom() {
			return this.el.scrollTop = this.el.scrollHeight;
		}
	}, {
		key: 'getScrollDistanceNeededToPutClientRectIntoView',
		value: function getScrollDistanceNeededToPutClientRectIntoView(clientRect) {
			var rect = this.el.getBoundingClientRect();

			if (!clientRect.valid) {
				return 0;
			}
			if (clientRect.top < 0) {
				return clientRect.top - PX_EDGE_PADDING;
			}
			if (clientRect.bottom > rect.height) {
				return clientRect.bottom - rect.height + PX_EDGE_PADDING;
			}
			return 0;
		}
	}, {
		key: 'getScrollDistanceNeededToPutElementIntoView',
		value: function getScrollDistanceNeededToPutElementIntoView(el) {
			return this.getScrollDistanceNeededToPutClientRectIntoView(el.getBoundingClientRect());
		}
	}, {
		key: 'getScrollDistanceNeededToPutSelectionIntoView',
		value: function getScrollDistanceNeededToPutSelectionIntoView() {
			return this.getScrollDistanceNeededToPutClientRectIntoView(_oboSelectionRect2.default.createFromSelection());
		}
	}, {
		key: 'scrollSelectionIntoViewIfNeeded',
		value: function scrollSelectionIntoViewIfNeeded() {
			this.distance = this.getScrollDistanceNeededToPutSelectionIntoView();
			return this.el.scrollTop += this.distance;
		}
	}, {
		key: 'tweenByDistance',
		value: function tweenByDistance(distance) {
			var _this = this;

			this.distance = distance;
			this.distanceLeft = this.distance;

			if (this.distance !== 0) {
				this.travelBy = Math.max(1, parseInt(Math.abs(this.distance) / 10, 10));

				clearInterval(this.intervalId);
				return this.intervalId = setInterval(function () {
					var travel = void 0;
					if (_this.distance < 1) {
						travel = Math.min(_this.travelBy, _this.distanceLeft * -1);
						_this.el.scrollTop -= travel;
						_this.distanceLeft += travel;

						if (_this.distanceLeft >= 0) {
							return clearInterval(_this.intervalId);
						}
					} else {
						travel = Math.min(_this.travelBy, _this.distanceLeft);
						_this.el.scrollTop += travel;
						_this.distanceLeft -= travel;

						if (_this.distanceLeft <= 0) {
							return clearInterval(_this.intervalId);
						}
					}
				}, 10);
			}
		}
	}, {
		key: 'tweenElementIntoViewIfNeeded',
		value: function tweenElementIntoViewIfNeeded(el) {
			return this.tweenByDistance(this.getScrollDistanceNeededToPutElementIntoView(el));
		}

		//@TODO - delete this?

	}, {
		key: 'tweenSelectionIntoViewIfNeeded',
		value: function tweenSelectionIntoViewIfNeeded() {
			return this.tweenByDistance(this.getScrollDistanceNeededToPutSelectionIntoView());
		}
	}]);

	return Screen;
}();

Screen.isElementVisible = function (node) {
	var rect = node.getBoundingClientRect();
	return !(rect.top > window.innerHeight || rect.bottom < 0);
};

window.__screen = Screen; //@todo
exports.default = Screen;

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cursor = __webpack_require__(53);

var _cursor2 = _interopRequireDefault(_cursor);

var _domSelection = __webpack_require__(10);

var _domSelection2 = _interopRequireDefault(_domSelection);

var _domUtil = __webpack_require__(7);

var _domUtil2 = _interopRequireDefault(_domUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var domType = null;

var ChunkSelection = function () {
	function ChunkSelection(module) {
		_classCallCheck(this, ChunkSelection);

		this.module = module;
		this.clear();
	}

	_createClass(ChunkSelection, [{
		key: 'clear',
		value: function clear() {
			this.start = this.end = domType = null;
			this.inbetween = [];
			return this.all = [];
		}
	}, {
		key: 'calculateAllNodes',
		value: function calculateAllNodes() {
			this.inbetween = [];
			this.all = [];

			if ((this.start != null ? this.start.chunk : undefined) != null) {
				this.all = [this.start.chunk];
			}

			var n = this.start.chunk;
			while (n != null && n !== this.end.chunk) {
				if (n !== this.start.chunk) {
					this.inbetween.push(n);
					this.all.push(n);
				}
				n = n.nextSibling();
			}

			if ((this.end != null ? this.end.chunk : undefined) != null && this.all[this.all.length - 1] !== this.end.chunk) {
				return this.all.push(this.end.chunk);
			}
		}
	}, {
		key: 'getChunkForDomNode',
		value: function getChunkForDomNode(domNode) {
			// console.log 'getChunkForDomNode', domNode
			var index = this.getIndex(domNode);
			return this.module.chunks.at(index);
		}
	}, {
		key: 'getPosition',
		value: function getPosition(chunk) {
			// console.log 'get position', @
			if ((this.start != null ? this.start.chunk : undefined) == null || (this.end != null ? this.end.chunk : undefined) == null) {
				return 'unknown';
			}

			var chunkIndex = chunk.get('index');
			var startIndex = this.start.chunk.get('index');
			var endIndex = this.end.chunk.get('index');

			if (chunkIndex < startIndex) {
				return 'before';
			}
			if (chunkIndex === startIndex && chunkIndex === endIndex) {
				return 'contains';
			}
			if (chunkIndex === startIndex) {
				return 'start';
			}
			if (chunkIndex < endIndex) {
				return 'inside';
			}
			if (chunkIndex === endIndex) {
				return 'end';
			}
			return 'after';
		}
	}, {
		key: 'getIndex',
		value: function getIndex(node) {
			return _domUtil2.default.findParentAttr(node, 'data-component-index');
		}
	}, {
		key: 'getFromDOMSelection',
		value: function getFromDOMSelection(s) {
			if (s == null) {
				s = new _domSelection2.default();
			}
			this.clear();

			// s = new DOMSelection()
			domType = s.getType();

			if (domType === 'none') {
				this.start = null;
				this.end = null;
			} else {
				this.start = this.getCursor(s.startContainer, s.startOffset);
				this.end = this.getCursor(s.endContainer, s.endOffset);
				this.calculateAllNodes();
			}

			return this;
		}
	}, {
		key: 'getCursor',
		value: function getCursor(node, offset) {
			var chunk = this.getChunkForDomNode(node);
			return new _cursor2.default(chunk, node, offset);
		}
	}, {
		key: 'setTextStart',
		value: function setTextStart(node, offset) {
			this.start = this.getCursor(node, offset);

			if (this.end === null) {
				this.end = this.start.clone();
			}

			return this.calculateAllNodes();
		}
	}, {
		key: 'setTextEnd',
		value: function setTextEnd(node, offset) {
			this.end = this.getCursor(node, offset);

			if (this.start === null) {
				this.start = this.end.clone();
			}

			return this.calculateAllNodes();
		}
	}, {
		key: 'setCaret',
		value: function setCaret(node, offset) {
			this.setTextStart(node, offset);
			return this.collapse();
		}
	}, {
		key: 'select',
		value: function select() {
			return _domSelection2.default.set(this.start.node, this.start.offset, this.end.node, this.end.offset);
		}
	}, {
		key: 'collapse',
		value: function collapse() {
			return this.end = this.start.clone();
		}
	}]);

	return ChunkSelection;
}();

Object.defineProperties(ChunkSelection.prototype, {
	"type": {
		get: function get() {
			if ((this.start != null ? this.start.chunk : undefined) == null || (this.end != null ? this.end.chunk : undefined) == null || !this.start.isText || !this.end.isText) {
				return 'none';
			} else if ((this.start != null ? this.start.chunk.cid : undefined) === (this.end != null ? this.end.chunk.cid : undefined)) {
				if (domType === 'caret') {
					return 'caret';
				} else {
					return 'textSpan';
				}
			} else {
				return 'chunkSpan';
			}
		}
	}
});

ChunkSelection.createDescriptor = function (startIndex, startData, endIndex, endData) {
	return {
		start: {
			index: startIndex,
			data: startData
		},
		end: {
			index: endIndex,
			data: endData
		}
	};
};

ChunkSelection.getFromDOMSelection = function (module, domSelection) {
	return new ChunkSelection(module).getFromDOMSelection(domSelection);
};

exports.default = ChunkSelection;

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _oboSelectionRect = __webpack_require__(26);

var _oboSelectionRect2 = _interopRequireDefault(_oboSelectionRect);

var _domSelection = __webpack_require__(10);

var _domSelection2 = _interopRequireDefault(_domSelection);

var _virtualSelection = __webpack_require__(54);

var _virtualSelection2 = _interopRequireDefault(_virtualSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Selection = function () {
	function Selection(page) {
		_classCallCheck(this, Selection);

		this.setPage(page);
		this.saved = null;
		this.clear();
	}

	_createClass(Selection, [{
		key: 'saveVirtualSelection',
		value: function saveVirtualSelection() {
			return this.saved = this.virtual.clone();
		}
	}, {
		key: 'restoreVirtualSelection',
		value: function restoreVirtualSelection() {
			return this.virtual = this.saved;
		}
	}, {
		key: 'clear',
		value: function clear() {
			this.rect = null;
			this.chunkRect = null;
			return this.dom = null;
		}
	}, {
		key: 'setPage',
		value: function setPage(page) {
			this.page = page;
			return this.virtual = new _virtualSelection2.default(this.page);
		}
	}, {
		key: 'getSelectionDescriptor',
		value: function getSelectionDescriptor() {
			return this.virtual.toObject();
		}
	}, {
		key: 'fromObject',
		value: function fromObject(o) {
			this.virtual.fromObject(o);
			this.selectDOM();
			return this.update();
		}
	}, {
		key: 'selectDOM',
		value: function selectDOM() {
			console.log('SELECTION selectDOM');
			if ((this.virtual.start != null ? this.virtual.start.chunk : undefined) == null || (this.virtual.end != null ? this.virtual.end.chunk : undefined) == null) {
				return;
			}
			console.log('startChunk', this.startChunk.cid);
			// console.log @startChunk
			// console.log 'endChunk', @endChunk

			var s = this.startChunk.getDOMSelectionStart();
			var e = this.endChunk.getDOMSelectionEnd();

			// console.log 's', s, 'e', e
			return _domSelection2.default.set(s.textNode, s.offset, e.textNode, e.offset);
		}
	}, {
		key: 'update',
		value: function update() {
			// return if not document.getElementById('editor').contains(document.activeElement)
			// console.log 'UUUUUUUUUUPDATE!'

			console.time('selection.update');
			// @clear()

			console.time('new oboSelection');
			this.dom = new _domSelection2.default();
			// @chunk.getFromDOMSelection @dom

			this.virtual.fromDOMSelection(this.dom);
			console.timeEnd('new oboSelection');

			console.time('OboSelectionRect.createFromSelection');
			this.rect = _oboSelectionRect2.default.createFromSelection();
			this.chunkRect = _oboSelectionRect2.default.createFromChunks(this.virtual.all);
			console.timeEnd('OboSelectionRect.createFromSelection');

			return console.timeEnd('selection.update');
		}
	}]);

	return Selection;
}();

Object.defineProperties(Selection.prototype, {
	startChunk: {
		get: function get() {
			if ((this.virtual != null ? this.virtual.start : undefined) == null) {
				return null;
			}
			return this.virtual.start.chunk;
		}
	},

	endChunk: {
		get: function get() {
			if ((this.virtual != null ? this.virtual.end : undefined) == null) {
				return null;
			}
			return this.virtual.end.chunk;
		}
	}
});

exports.default = Selection;

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VirtualCursorData = function () {
	function VirtualCursorData(content) {
		_classCallCheck(this, VirtualCursorData);

		this.content = content;
	}

	_createClass(VirtualCursorData, [{
		key: "clone",
		value: function clone() {
			return new VirtualCursorData(Object.assign({}, this.content));
		}
	}]);

	return VirtualCursorData;
}();

// toObject: () ->
// Object.assign({}, @content)


exports.default = VirtualCursorData;

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = __webpack_require__(25);

var _store2 = _interopRequireDefault(_store);

var _dispatcher = __webpack_require__(1);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TRANSITION_TIME_MS = 800;
var timeoutId = null;

var FocusStore = function (_Store) {
	_inherits(FocusStore, _Store);

	function FocusStore() {
		_classCallCheck(this, FocusStore);

		var _this = _possibleConstructorReturn(this, (FocusStore.__proto__ || Object.getPrototypeOf(FocusStore)).call(this, 'focusStore'));

		_dispatcher2.default.on('focus:component', function (payload) {
			_this.state.viewState = 'enter';
			_this.state.focussedId = payload.value.id;
			_this.triggerChange();

			window.clearTimeout(timeoutId);
			return timeoutId = window.setTimeout(function () {
				_this.state.viewState = 'active';
				return _this.triggerChange();
			}, TRANSITION_TIME_MS);
		});

		_dispatcher2.default.on('focus:unfocus', function (payload) {
			_this.state.viewState = 'leave';
			_this.triggerChange();

			window.clearTimeout(timeoutId);
			return timeoutId = window.setTimeout(function () {
				_this.state.viewState = 'inactive';
				_this.state.focussedId = null;
				return _this.triggerChange();
			}, TRANSITION_TIME_MS);
		});
		return _this;
	}

	_createClass(FocusStore, [{
		key: 'init',
		value: function init() {
			return this.state = {
				focussedId: null,
				viewState: 'inactive'
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

	return FocusStore;
}(_store2.default);

var focusStore = new FocusStore();
exports.default = focusStore;

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = __webpack_require__(25);

var _store2 = _interopRequireDefault(_store);

var _dispatcher = __webpack_require__(1);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModalStore = function (_Store) {
	_inherits(ModalStore, _Store);

	function ModalStore() {
		_classCallCheck(this, ModalStore);

		var _this = _possibleConstructorReturn(this, (ModalStore.__proto__ || Object.getPrototypeOf(ModalStore)).call(this, 'modalstore'));

		_dispatcher2.default.on('modal:show', function (payload) {
			_this.state.modals.push(payload.value.component);
			return _this.triggerChange();
		});

		_dispatcher2.default.on('modal:hide', function () {
			_this.state.modals.shift();
			return _this.triggerChange();
		});
		return _this;
	}

	_createClass(ModalStore, [{
		key: 'init',
		value: function init() {
			return this.state = {
				modals: []
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

	return ModalStore;
}(_store2.default);

var modalStore = new ModalStore();
exports.default = modalStore;

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// console.time = ->
// console.timeEnd = ->
// console.log = ->

console._log = console.log;
console._times = {};
console._interval = null;
console.time = function (s) {
	if (!console._times[s]) {
		console._times[s] = {
			time: 0,
			count: 0,
			start: 0,
			avg: 0
		};
	}

	return console._times[s].start = performance.now();
};

console.timeEnd = function (s) {
	if (console._times[s] != null) {
		var diff = performance.now() - console._times[s].start;
		console._times[s].count++;
		console._times[s].time += diff;
		console._times[s].avg = (console._times[s].time / console._times[s].count).toFixed(3);
	}
	// console._log('%c' + s + ': ' + diff.toFixed(3) + 'ms (Avg: ' + console._times[s].avg + 'ms)', 'color: gray;');

	clearTimeout(console._interval);
	return console._interval = setTimeout(console.showTimeAverages, 1000);
};
// console.showTimeAverages()

console.showTimeAverages = function () {
	var byTime = [];
	for (var s in console._times) {
		byTime.push({ s: s, avg: console._times[s].avg });
	}

	byTime.sort(function (a, b) {
		if (a.avg < b.avg) {
			return 1;
		}
		if (a.avg > b.avg) {
			return -1;
		}
		return 0;
	});

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(byTime)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var o = _step.value;

			console._log('%c' + o.avg + ': ' + o.s, 'color: blue;');
			return;
		} //@Todo - hack to only show worst thing
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
};

// console._error = console.error
// console.error = (msg) ->
// 	if msg.substr(0, 7) is 'Warning'
// 		if msg.indexOf('Warning: bind()') > -1 or msg.indexOf('contentEditable') > -1 then return false
// 		console.warn msg #@TODO - SUPRESS WARNINGS
// 		# false
// 	else
// 		console._error msg

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dispatcher = __webpack_require__(1);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _errorDialog = __webpack_require__(48);

var _errorDialog2 = _interopRequireDefault(_errorDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorUtil = {
	show: function show(title, errorMessage) {
		return _dispatcher2.default.trigger('modal:show', {
			value: {
				component: React.createElement(
					_errorDialog2.default,
					{ title: title },
					errorMessage
				)
			}
		});
	},
	errorResponse: function errorResponse(res) {
		var title = function () {
			switch (res.value.type) {
				case 'input':
					return 'Bad Input';
				case 'unexpected':
					return 'Unexpected Error';
				case 'reject':
					return 'Rejected';
			}
		}();

		return ErrorUtil.show(title, res.value.message);
	}
};

exports.default = ErrorUtil;

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var GLOBAL_KEY = '__oboGlobals';
var globals = new Map();

exports.default = {
	get: function get(key) {
		if (globals.has(key)) return globals.get(key);
		if (!window[GLOBAL_KEY][key]) throw 'No Obo Global found for key ' + key;

		globals.set(key, window[GLOBAL_KEY][key]);

		delete window[GLOBAL_KEY][key];

		return globals.get(key);
	}
};

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.start;
		}) != null) {
			if (attrs.content.start === 'unlimited') {
				return model.modelState.start = null;
			} else {
				return model.modelState.start = attrs.content.start;
			}
		}
	},
	clone: function clone(model, _clone) {
		return _clone.modelState.start = model.modelState.start;
	},
	toJSON: function toJSON(model, json) {
		return json.content.start = model.modelState.start;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(253);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(2);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var navStore = _Viewer2.default.stores.navStore;
var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var NavUtil = _Viewer2.default.util.NavUtil;
exports.default = React.createClass({
	displayName: 'viewer-component',
	render: function render() {
		var childEl = null;
		var navTargetModel = NavUtil.getNavTargetModel(this.props.moduleData.navState);

		if (navTargetModel) {
			var child = this.props.model.getChildContainingModel(navTargetModel);
			var ChildComponent = child.getComponentClass();
			childEl = React.createElement(ChildComponent, { model: child, moduleData: this.props.moduleData });
		}

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--modules--module'
			},
			React.createElement(
				'div',
				null,
				childEl
			)
		);
	}
});

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(203);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(204);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Modules.Module', {
	type: 'module',
	default: true,
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: null,
	getNavItem: function getNavItem(model) {
		return {
			type: 'heading',
			label: model.title,
			showChildren: true
		};
	},
	generateNav: function generateNav(model) {
		return [{
			type: 'heading',
			label: model.title
		}];
	}
});

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(254);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(2);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var NavUtil = _Viewer2.default.util.NavUtil;
exports.default = React.createClass({
	displayName: 'viewer-component',
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (nextProps.moduleData.navState.navTargetId !== this.props.moduleData.navState.navTargetId) {
			return NavUtil.setFlag(this.props.moduleData.navState.navTargetId, 'visited', true);
		}
	},
	render: function render() {
		var _this = this;

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--pages--page'
			},
			this.props.model.children.models.map(function (child, index) {
				var Component = child.getComponentClass();

				return React.createElement(Component, { key: index, model: child, moduleData: _this.props.moduleData });
			})
		);
	}
});

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _viewerComponent = __webpack_require__(206);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Pages.Page', {
	type: 'page',
	default: true,
	componentClass: _viewerComponent2.default,
	selectionHandler: null,
	getNavItem: function getNavItem(model) {
		var title = '';
		if (model.title != null) {
			title = model.title;
		}

		return {
			type: 'link',
			label: model.title,
			// path: ['page-' + (model.getIndex() + 1) + '-' + model.get('id')],
			path: [title.toLowerCase().replace(/ /g, '-')],
			showChildren: false
		};
	}
	// init: ->
	// 	Dispatcher.on 'nav:willGotoPath', (oldNavItem, newNavItem) ->
	// 		alert('yeah')

});

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _scoreActions = __webpack_require__(210);

var _scoreActions2 = _interopRequireDefault(_scoreActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.attempts;
		}) != null) {
			if (attrs.content.attempts === 'unlimited') {
				model.modelState.attempts = Infinity;
			} else {
				model.modelState.attempts = parseInt(attrs.content.attempts, 10);
			}
		} else {
			model.modelState.attempts = Infinity;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.scoreActions;
		}) != null) {
			return model.modelState.scoreActions = new _scoreActions2.default(attrs.content.scoreActions);
		} else {
			return model.modelState.scoreActions = new _scoreActions2.default();
		}
	},


	// model.modelState.assessmentState =
	// 	inTest: false
	// 	scores: []
	// 	currentScore: 0


	clone: function clone(model, _clone) {
		_clone.modelState.attempts = model.modelState.attempts;
		_clone.modelState.hideNav = model.modelState.hideNav;
		return _clone.modelState.scoreActions = model.modelState.scoreActions.clone();
	},


	//@TODO - necessary?
	// clone.modelState.assessmentState =
	// 	inTest: model.modelState.assessmentState.inTest
	// 	currentScore: model.modelState.assessmentState.currentScore
	// 	scores: Object.assign [], model.modelState.assessmentState.scores

	toJSON: function toJSON(model, json) {
		json.content.attempts = model.modelState.attempts;
		json.content.hideNav = model.modelState.hideNav;
		return json.content.scoreActions = model.modelState.scoreActions.toObject();
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dialog = _ObojoboDraft2.default.components.modal.Dialog;
var ModalUtil = _ObojoboDraft2.default.util.ModalUtil;
exports.default = React.createClass({
	displayName: 'attempt-incomplete-dialog',
	onCancel: function onCancel() {
		return ModalUtil.hide();
	},
	onSubmit: function onSubmit() {
		ModalUtil.hide();
		return this.props.onSubmit();
	},
	render: function render() {
		return React.createElement(
			Dialog,
			{ width: '32rem', buttons: [{
					value: 'Submit as incomplete',
					altAction: true,
					dangerous: true,
					onClick: this.onSubmit
				}, 'or', {
					value: 'Resume assessment',
					onClick: this.onCancel,
					default: true
				}] },
			React.createElement(
				'b',
				null,
				'Wait! You left some questions blank.'
			),
			React.createElement('br', null),
			'Finish answering all questions and submit again.'
		);
	}
});

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScoreActions = function () {
	function ScoreActions(_actions) {
		_classCallCheck(this, ScoreActions);

		if (_actions == null) {
			_actions = [];
		}
		this._actions = _actions;
	}

	_createClass(ScoreActions, [{
		key: "getActionForScore",
		value: function getActionForScore(score) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(this._actions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var action = _step.value;

					if (score >= action.from && score <= action.to) {
						return action;
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

			return null;
		}
	}, {
		key: "toObject",
		value: function toObject() {
			return Object.assign([], this._actions);
		}
	}, {
		key: "clone",
		value: function clone() {
			return new ScoreActions(this.toObject());
		}
	}]);

	return ScoreActions;
}();

exports.default = ScoreActions;

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(255);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(2);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _attemptIncompleteDialog = __webpack_require__(209);

var _attemptIncompleteDialog2 = _interopRequireDefault(_attemptIncompleteDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var Button = _ObojoboDraft2.default.components.Button;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var ModalUtil = _ObojoboDraft2.default.util.ModalUtil;
var ScoreStore = _Viewer2.default.stores.ScoreStore;
var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;
var NavUtil = _Viewer2.default.util.NavUtil;
exports.default = React.createClass({
	displayName: 'viewer-component',
	getInitialState: function getInitialState() {
		return { step: null };
	},
	getCurrentStep: function getCurrentStep() {
		var assessment = AssessmentUtil.getAssessmentForModel(this.props.moduleData.assessmentState, this.props.model);

		if (assessment === null) {
			return 'untested';
		}
		if (assessment.current !== null) {
			return 'takingTest';
		}
		if (assessment.attempts.length > 0) {
			return 'scoreSubmitted';
		}
		return 'untested';
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		var curStep = this.getCurrentStep();
		if (curStep !== this.state.step) {
			this.needsScroll = true;
		}

		return this.setState({ step: curStep });
	},
	componentDidUpdate: function componentDidUpdate() {
		if (this.needsScroll) {
			delete this.needsScroll;
			return Dispatcher.trigger('viewer:scrollToTop');
		}
	},


	// if @needsScroll
	// 	delete @needsScroll
	// 	alert 'TRIG'
	// 	Dispatcher.trigger 'viewer:scrollTo', { value: 0 }

	// # componentDidMount: ->
	// # 	ModalUtil.show `<AttemptIncompleteDialog onSubmit={this.endAttempt} />`

	isAttemptComplete: function isAttemptComplete() {
		return AssessmentUtil.isCurrentAttemptComplete(this.props.moduleData.assessmentState, this.props.moduleData.questionState, this.props.model);
	},
	onClickSubmit: function onClickSubmit() {
		if (!this.isAttemptComplete()) {
			ModalUtil.show(React.createElement(_attemptIncompleteDialog2.default, { onSubmit: this.endAttempt }));
			return;
		}

		return this.endAttempt();
	},
	endAttempt: function endAttempt() {
		return AssessmentUtil.endAttempt(this.props.model);
	},
	exitAssessment: function exitAssessment() {
		var scoreAction = this.getScoreAction();

		switch (scoreAction.action.value) {
			case '_next':
				return NavUtil.goNext();

			case '_prev':
				return NavUtil.goPrev();

			default:
				return NavUtil.goto(scoreAction.action.value);
		}
	},
	getScoreAction: function getScoreAction() {
		var highestScore = AssessmentUtil.getHighestAttemptScoreForModel(this.props.moduleData.assessmentState, this.props.model);
		var scoreAction = this.props.model.modelState.scoreActions.getActionForScore(highestScore);
		if (scoreAction) {
			return scoreAction;
		}

		return {
			from: 0,
			to: 100,
			message: "",
			action: {
				type: "unlock",
				value: "_next"
			}
		};
	},
	render: function render() {
		var _this = this;

		var recentScore = AssessmentUtil.getLastAttemptScoreForModel(this.props.moduleData.assessmentState, this.props.model);
		var highestScore = AssessmentUtil.getHighestAttemptScoreForModel(this.props.moduleData.assessmentState, this.props.model);

		// alert(@state.step+ ','+ @getCurrentStep())

		var childEl = function () {
			switch (_this.getCurrentStep()) {
				case 'untested':
					var child = _this.props.model.children.at(0);
					var Component = child.getComponentClass();

					return React.createElement(
						'div',
						{ className: 'untested' },
						React.createElement(Component, { model: child, moduleData: _this.props.moduleData })
					);

				case 'takingTest':
					child = _this.props.model.children.at(1);
					Component = child.getComponentClass();

					return React.createElement(
						'div',
						{ className: 'test' },
						React.createElement(Component, { className: 'untested', model: child, moduleData: _this.props.moduleData, showScore: recentScore !== null }),
						React.createElement(
							'div',
							{ className: 'submit-button' },
							React.createElement(Button, { onClick: _this.onClickSubmit, value: _this.isAttemptComplete() ? 'Submit' : 'Submit (Not all questions have been answered)' })
						)
					);

				case 'scoreSubmitted':
					var scoreAction = _this.getScoreAction();

					var questionScores = AssessmentUtil.getLastAttemptScoresForModel(_this.props.moduleData.assessmentState, _this.props.model);

					var numCorrect = questionScores.reduce(function (acc, questionScore) {
						var n = 0;
						if (parseInt(questionScore.score, 10) === 100) {
							n = 1;
						}
						return parseInt(acc, 10) + n;
					}, [0]);

					if (scoreAction.page != null) {
						var pageModel = OboModel.create(scoreAction.page);
						pageModel.parent = _this.props.model; //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
						var PageComponent = pageModel.getComponentClass();
						childEl = React.createElement(PageComponent, { model: pageModel, moduleData: _this.props.moduleData });
					} else {
						childEl = React.createElement(
							'p',
							null,
							scoreAction.message
						);
					}

					return React.createElement(
						'div',
						{ className: 'score unlock' },
						React.createElement(
							'h1',
							null,
							'Your score is ' + Math.round(recentScore) + '%'
						),
						recentScore === highestScore ? React.createElement(
							'h2',
							null,
							'This is your highest score'
						) : React.createElement(
							'h2',
							null,
							'Your highest score was ' + Math.round(highestScore) + '%'
						),
						childEl,
						React.createElement(
							'div',
							{ className: 'review' },
							React.createElement(
								'p',
								{ className: 'number-correct' },
								'You got ' + numCorrect + ' out of ' + questionScores.length + ' questions correct:'
							),
							questionScores.map(function (questionScore, index) {
								var questionModel = OboModel.models[questionScore.id];
								var QuestionComponent = questionModel.getComponentClass();

								return React.createElement(
									'div',
									{ key: index, className: questionScore.score === 100 ? 'is-correct' : 'is-not-correct' },
									React.createElement(
										'p',
										null,
										'Question ' + (index + 1) + ' - ' + (questionScore.score === 100 ? 'Correct:' : 'Incorrect:')
									),
									React.createElement(QuestionComponent, { model: questionModel, moduleData: _this.props.moduleData, showContentOnly: true })
								);
							})
						)
					);
			}
		}();

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--sections--assessment'
			},
			childEl
		);
	}
});

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(2);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _adapter = __webpack_require__(208);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(211);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;


_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Sections.Assessment', {
	type: 'section',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: null,
	getNavItem: function getNavItem(model) {
		var title = model.title || 'Assessment';

		return {
			type: 'link',
			label: title,
			path: [title.toLowerCase().replace(/ /g, '-')],
			showChildren: false,
			showChildrenOnNavigation: false
		};
	},

	variables: {
		'assessment:attemptsRemaining': function assessmentAttemptsRemaining(textModel, viewerProps) {
			var assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment');
			if (assessmentModel.modelState.attempts === Infinity) {
				return 'unlimited';
			}

			return assessmentModel.modelState.attempts - AssessmentUtil.getNumberOfAttemptsCompletedForModel(viewerProps.assessmentState, textModel);
		},
		'assessment:attemptsAmount': function assessmentAttemptsAmount(textModel, viewerProps) {
			var assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment');
			if (assessmentModel.modelState.attempts === Infinity) {
				return 'unlimited';
			}

			return assessmentModel.modelState.attempts;
		}
	}

	// generateNav: (model) ->
	// 	[
	// 		{
	// 			type: 'link',
	// 			label: model.title ||= 'Assessment',
	// 			id: model.get('id')
	// 		},
	// 		{
	// 			type: 'seperator'
	// 		}
	// 	]
});

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(256);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(2);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var NavUtil = _Viewer2.default.util.NavUtil;
exports.default = React.createClass({
	displayName: 'viewer-component',
	render: function render() {
		var childEl = null;
		var navTargetModel = NavUtil.getNavTargetModel(this.props.moduleData.navState);
		if (navTargetModel) {
			var child = this.props.model.getChildContainingModel(navTargetModel);
			var ChildComponent = child.getComponentClass();
			childEl = React.createElement(ChildComponent, { model: child, moduleData: this.props.moduleData });
		}

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--sections--content'
			},
			React.createElement(
				'div',
				null,
				childEl
			)
		);
	}
});

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _viewerComponent = __webpack_require__(213);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Sections.Content', {
	type: 'section',
	default: true,
	adapter: null,
	componentClass: _viewerComponent2.default,
	selectionHandler: null,
	getNavItem: function getNavItem(model) {
		return {
			type: 'hidden',
			showChildren: true
		};
	},
	generateNav: function generateNav(model) {
		var nav = [];

		for (var index = 0; index < model.children.models.length; index++) {
			var child = model.children.models[index];
			nav.push({
				type: 'link',
				label: child.title,
				id: child.get('id')
			});
		}

		nav.push({
			type: 'seperator'
		});

		return nav;
	}
});

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(205);

__webpack_require__(214);

__webpack_require__(212);

__webpack_require__(207);

__webpack_require__(121);

__webpack_require__(124);

__webpack_require__(126);

__webpack_require__(131);

__webpack_require__(137);

__webpack_require__(134);

__webpack_require__(140);

__webpack_require__(143);

__webpack_require__(156);

__webpack_require__(153);

__webpack_require__(160);

__webpack_require__(163);

__webpack_require__(166);

__webpack_require__(168);

__webpack_require__(171);

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(257);

var _navUtil = __webpack_require__(8);

var _navUtil2 = _interopRequireDefault(_navUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InlineNavButton = React.createClass({
	displayName: 'InlineNavButton',
	onClick: function onClick() {
		if (this.props.disabled) {
			return;
		}

		switch (this.props.type) {
			case 'prev':
				return _navUtil2.default.goPrev();

			case 'next':
				return _navUtil2.default.goNext();
		}
	},
	render: function render() {
		return React.createElement(
			'div',
			{
				className: 'viewer--components--inline-nav-button is-' + this.props.type + (this.props.disabled ? ' is-disabled' : ' is-enabled'),
				onClick: this.onClick
			},
			this.props.title
		);
	}
});

exports.default = InlineNavButton;

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var JSONInput = React.createClass({
	displayName: 'JSONInput',
	getInitialState: function getInitialState() {
		return {
			value: this.props.value,
			open: false
		};
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		return this.setState({
			value: nextProps.value
		});
	},
	onClick: function onClick(event) {
		return this.props.onChange(this.state.value);
	},
	onChange: function onChange(event) {
		return this.setState({ value: event.target.value });
	},
	onToggle: function onToggle(event) {
		var newVal = !this.state.open;
		return this.setState({ open: newVal });
	},

	// @props.onToggle newVal

	render: function render() {
		if (this.state.open) {
			return React.createElement(
				'div',
				{ style: { position: 'fixed', right: 0, top: 0, bottom: 0, width: '300px', background: 'gray', zIndex: 9999 } },
				React.createElement(
					'button',
					{ style: { position: 'absolute', top: '0', left: 0, display: 'block', width: '300px' }, onClick: this.onToggle },
					'Close'
				),
				React.createElement('textarea', { style: { position: 'absolute', left: 0, top: '20px', right: 0, bottom: '40px', width: '300px', fontFamily: 'monospace', fontSize: '10pt', padding: 0, margin: 0, boxSizing: 'border-box' }, value: this.state.value, onChange: this.onChange }),
				React.createElement(
					'button',
					{ style: { position: 'absolute', bottom: '10px', left: 0, display: 'block', width: '300px' }, onClick: this.onClick },
					'Update'
				)
			);
		}

		return React.createElement(
			'div',
			{ style: { position: 'fixed', right: 0, top: '50px', zIndex: 9999 } },
			React.createElement(
				'button',
				{ onClick: this.onToggle },
				'Open'
			)
		);
	}
});

exports.default = JSONInput;

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(259);

var _navStore = __webpack_require__(30);

var _navStore2 = _interopRequireDefault(_navStore);

var _navUtil = __webpack_require__(8);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _logo = __webpack_require__(67);

var _logo2 = _interopRequireDefault(_logo);

var _hamburger = __webpack_require__(264);

var _hamburger2 = _interopRequireDefault(_hamburger);

var _arrow = __webpack_require__(263);

var _arrow2 = _interopRequireDefault(_arrow);

var _lockIcon = __webpack_require__(265);

var _lockIcon2 = _interopRequireDefault(_lockIcon);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getBackgroundImage = _ObojoboDraft2.default.util.getBackgroundImage;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var StyleableText = _ObojoboDraft2.default.text.StyleableText;
var StyleableTextComponent = _ObojoboDraft2.default.text.StyleableTextComponent;


var Nav = React.createClass({
	displayName: 'Nav',
	getInitialState: function getInitialState() {
		return { hover: false };
	},
	onClick: function onClick(item) {
		if (item.type === 'link') {
			return _navUtil2.default.gotoPath(item.fullPath);
		} else if (item.type === 'sub-link') {
			var el = OboModel.models[item.id].getDomEl();
			return el.scrollIntoView({ behavior: 'smooth' });
		}
	},
	hideNav: function hideNav() {
		return _navUtil2.default.toggle();
	},
	onMouseOver: function onMouseOver() {
		return this.setState({ hover: true });
	},
	onMouseOut: function onMouseOut() {
		return this.setState({ hover: false });
	},
	renderLabel: function renderLabel(label) {
		if (label instanceof StyleableText) {
			return React.createElement(StyleableTextComponent, { text: label });
		} else {
			return React.createElement(
				'a',
				null,
				label
			);
		}
	},
	render: function render() {
		var _this = this;

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
			{ className: 'viewer--components--nav' + (this.props.navState.locked ? ' is-locked' : ' is-unlocked') + (this.props.navState.open ? ' is-open' : ' is-closed') + (this.props.navState.disabled ? ' is-disabled' : ' is-enabled') },
			React.createElement(
				'button',
				{
					className: 'toggle-button',
					onClick: this.hideNav,
					onMouseOver: this.onMouseOver,
					onMouseOut: this.onMouseOut,
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
								{ key: index, className: 'heading' + (isSelected ? ' is-selected' : ' is-not-select') },
								_this.renderLabel(item.label)
							);
							break;

						case 'link':
							var isSelected = _this.props.navState.navTargetId === item.id;
							//var isPrevVisited = this.props.navState.navTargetHistory.indexOf(item.id) > -1
							return React.createElement(
								'li',
								{ key: index, onClick: _this.onClick.bind(null, item), className: 'link' + (isSelected ? ' is-selected' : ' is-not-select') + (item.flags.visited ? ' is-visited' : ' is-not-visited') + (item.flags.complete ? ' is-complete' : ' is-not-complete') + (item.flags.correct ? ' is-correct' : ' is-not-correct') },
								_this.renderLabel(item.label),
								lockEl
							);
							break;

						case 'sub-link':
							var isSelected = _this.props.navState.navTargetIndex === index;

							return React.createElement(
								'li',
								{ key: index, onClick: _this.onClick.bind(null, item), className: 'sub-link' + (isSelected ? ' is-selected' : ' is-not-select') + (item.flags.correct ? ' is-correct' : ' is-not-correct') },
								_this.renderLabel(item.label),
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
});

exports.default = Nav;

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(221);

__webpack_require__(260);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _react = __webpack_require__(267);

var _react2 = _interopRequireDefault(_react);

var _jsonInput = __webpack_require__(217);

var _jsonInput2 = _interopRequireDefault(_jsonInput);

var _inlineNavButton = __webpack_require__(216);

var _inlineNavButton2 = _interopRequireDefault(_inlineNavButton);

var _navUtil = __webpack_require__(8);

var _navUtil2 = _interopRequireDefault(_navUtil);

var _logo = __webpack_require__(67);

var _logo2 = _interopRequireDefault(_logo);

var _scoreStore = __webpack_require__(70);

var _scoreStore2 = _interopRequireDefault(_scoreStore);

var _questionStore = __webpack_require__(69);

var _questionStore2 = _interopRequireDefault(_questionStore);

var _assessmentStore = __webpack_require__(68);

var _assessmentStore2 = _interopRequireDefault(_assessmentStore);

var _navStore = __webpack_require__(30);

var _navStore2 = _interopRequireDefault(_navStore);

var _nav = __webpack_require__(218);

var _nav2 = _interopRequireDefault(_nav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@TODO
var Legacy = _ObojoboDraft2.default.models.Legacy;
var DOMUtil = _ObojoboDraft2.default.page.DOMUtil;
var Screen = _ObojoboDraft2.default.page.Screen;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var ModalContainer = _ObojoboDraft2.default.components.ModalContainer;
var SimpleDialog = _ObojoboDraft2.default.components.modal.SimpleDialog;
var ModalUtil = _ObojoboDraft2.default.util.ModalUtil;
var FocusBlocker = _ObojoboDraft2.default.components.FocusBlocker;
var ModalStore = _ObojoboDraft2.default.stores.ModalStore;
var FocusStore = _ObojoboDraft2.default.stores.FocusStore;
var FocusUtil = _ObojoboDraft2.default.util.FocusUtil;
var OboGlobals = _ObojoboDraft2.default.util.OboGlobals;

// Dispatcher.on 'all', (eventName, payload) -> console.log 'EVENT TRIGGERED', eventName

Dispatcher.on('viewer:alert', function (payload) {
	return ModalUtil.show(_react2.default.createElement(
		SimpleDialog,
		{ ok: true, title: payload.value.title },
		payload.value.message
	));
});

var ViewerApp = _react2.default.createClass({
	displayName: 'ViewerApp',

	// === REACT LIFECYCLE METHODS ===

	getInitialState: function getInitialState() {
		var _this = this;

		_ObojoboDraft2.default.Store.loadDependency('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css');

		Dispatcher.on('viewer:scrollTo', function (payload) {
			return ReactDOM.findDOMNode(_this.refs.container).scrollTop = payload.value;
		});

		Dispatcher.on('viewer:scrollToTop', this.scrollToTop.bind(this));
		Dispatcher.on('getTextForVariable', this.getTextForVariable.bind(this));

		this.isPreviewing = OboGlobals.get('previewing');

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

		return state;
	},
	componentWillMount: function componentWillMount() {
		var _this2 = this;

		// === SET UP DATA STORES ===
		_navStore2.default.onChange(function () {
			return _this2.setState({ navState: _navStore2.default.getState() });
		});
		_scoreStore2.default.onChange(function () {
			return _this2.setState({ scoreState: _scoreStore2.default.getState() });
		});
		_questionStore2.default.onChange(function () {
			return _this2.setState({ questionState: _questionStore2.default.getState() });
		});
		_assessmentStore2.default.onChange(function () {
			return _this2.setState({ assessmentState: _assessmentStore2.default.getState() });
		});
		ModalStore.onChange(function () {
			return _this2.setState({ modalState: ModalStore.getState() });
		});
		return FocusStore.onChange(function () {
			return _this2.setState({ focusState: FocusStore.getState() });
		});
	},


	// componentDidMount: ->
	// NavUtil.gotoPath window.location.pathname

	componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
		var navTargetId = this.state.navTargetId;

		var nextNavTargetId = this.state.navState.navTargetId;

		if (navTargetId !== nextNavTargetId) {
			this.needsScroll = true;
			return this.setState({ navTargetId: nextNavTargetId });
		}
	},
	componentDidUpdate: function componentDidUpdate() {
		// alert 'here, fixme'
		if (this.lastCanNavigate !== _navUtil2.default.canNavigate(this.state.navState)) {
			this.needsScroll = true;
		}
		this.lastCanNavigate = _navUtil2.default.canNavigate(this.state.navState);
		if (this.needsScroll != null) {
			this.scrollToTop();

			return delete this.needsScroll;
		}
	},
	getTextForVariable: function getTextForVariable(event, variable, textModel) {
		return event.text = _ObojoboDraft2.default.Store.getTextForVariable(variable, textModel, this.state);
	},
	scrollToTop: function scrollToTop() {
		var el = ReactDOM.findDOMNode(this.refs.prev);
		if (el) {
			return ReactDOM.findDOMNode(this.refs.container).scrollTop = ReactDOM.findDOMNode(el).getBoundingClientRect().height;
		} else {
			return ReactDOM.findDOMNode(this.refs.container).scrollTop = 0;
		}
	},


	// === NON REACT LIFECYCLE METHODS ===

	update: function update(json) {
		try {
			var o = void 0;
			return o = JSON.parse(json);
		} catch (e) {
			alert('Error parsing JSON');
			this.setState({ model: this.state.model });
			return;
		}
	},
	onBack: function onBack() {
		return _navUtil2.default.goPrev();
	},
	onNext: function onNext() {
		return _navUtil2.default.goNext();
	},
	onMouseDown: function onMouseDown(event) {
		if (this.state.focusState.focussedId == null) {
			return;
		}
		if (!DOMUtil.findParentComponentIds(event.target).has(this.state.focusState.focussedId)) {
			return FocusUtil.unfocus();
		}
	},
	onScroll: function onScroll(event) {
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
	},
	onChangeJSON: function onChangeJSON(json) {
		var o = void 0;
		try {
			o = JSON.parse(json);
		} catch (e) {
			alert('Error parsing JSON');
			return;
		}

		var newModule = OboModel.create(o);

		_navStore2.default.init(newModule, newModule.modelState.start);
		_scoreStore2.default.init();
		_questionStore2.default.init();
		_assessmentStore2.default.init();
		ModalStore.init();
		FocusStore.init();

		return this.setState({
			model: newModule,
			navState: _navStore2.default.getState(),
			scoreState: _scoreStore2.default.getState(),
			questionState: _questionStore2.default.getState(),
			assessmentState: _assessmentStore2.default.getState(),
			modalState: ModalStore.getState(),
			focusState: FocusStore.getState()
		});
	},
	resetAssessments: function resetAssessments() {
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
	},
	unlockNavigation: function unlockNavigation() {
		return _navUtil2.default.unlock();
	},
	render: function render() {
		var nextEl = void 0,
		    nextModel = void 0,
		    prevEl = void 0;
		window.__lo = this.state.model;
		window.__s = this.state;

		var ModuleComponent = this.state.model.getComponentClass();

		//<JSONInput onChange={this.onChangeJSON} value={JSON.stringify(this.state.model.toJSON(), null, 2)} />

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
				prevEl = _react2.default.createElement(_inlineNavButton2.default, { ref: 'prev', type: 'prev', title: 'Start of ' + this.state.model.title, disabled: true });
			}

			nextModel = _navUtil2.default.getNextModel(this.state.navState);
			if (nextModel) {
				nextEl = _react2.default.createElement(_inlineNavButton2.default, { ref: 'next', type: 'next', title: 'Next: ' + nextModel.title });
			} else {
				nextEl = _react2.default.createElement(_inlineNavButton2.default, { ref: 'next', type: 'next', title: 'End of ' + this.state.model.title, disabled: true });
			}
		}

		var modal = ModalUtil.getCurrentModal(this.state.modalState);

		return _react2.default.createElement(
			'div',
			{ ref: 'container', onMouseDown: this.onMouseDown, onScroll: this.onScroll, className: 'viewer--viewer-app' + (this.isPreviewing ? ' is-previewing' : ' is-not-previewing') + (this.state.navState.locked ? ' is-locked-nav' : ' is-unlocked-nav') + (this.state.navState.open ? ' is-open-nav' : ' is-closed-nav') + (this.state.navState.disabled ? ' is-disabled-nav' : ' is-enabled-nav') + ' is-focus-state-' + this.state.focusState.viewState },
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
						{ onClick: this.unlockNavigation, disabled: !this.state.navState.locked },
						'Unlock navigation'
					),
					_react2.default.createElement(
						'button',
						{ onClick: this.resetAssessments },
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
});

exports.default = ViewerApp;

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _es6Set = __webpack_require__(103);

var _es6Set2 = _interopRequireDefault(_es6Set);

var _arrayFrom = __webpack_require__(75);

var _arrayFrom2 = _interopRequireDefault(_arrayFrom);

var _promisePolyfill = __webpack_require__(114);

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

var _smoothscrollPolyfill = __webpack_require__(116);

var _smoothscrollPolyfill2 = _interopRequireDefault(_smoothscrollPolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Object.assign (IE)
if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) {
    // .length of function is 2
    'use strict';

    if (target == null) {
      // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

// Set (IE)
if (!window.Set) {
  window.Set = _es6Set2.default;
}

// Array.from (IE)
if (!Array.from) {
  Array.from = _arrayFrom2.default;
}

// Promise (IE)
if (!window.Promise) {
  window.Promise = _promisePolyfill2.default;
}

// Smooth scrollTo (non-FF)
_smoothscrollPolyfill2.default.polyfill();

/***/ }),
/* 221 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 222 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 223 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 224 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 225 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 226 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 227 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 228 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 229 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 230 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 231 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 232 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 233 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 234 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 235 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 236 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 237 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 238 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 239 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 240 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 241 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 242 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 243 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 244 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 245 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 246 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 247 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 248 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 249 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 250 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 251 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 252 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 253 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 254 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 255 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 256 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 257 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 258 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 259 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 260 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 261 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.03;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Ebg%3C/title%3E%3Crect class='cls-1' width='6' height='6'/%3E%3Crect class='cls-1' x='6' y='6' width='6' height='6'/%3E%3C/svg%3E"

/***/ }),
/* 262 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3Csvg id='Layer_10' data-name='Layer 10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.48 20.48'%3E %3Cdefs%3E %3Cstyle%3E .cls-1 %7B fill: %236714bd; %7D %3C/style%3E %3C/defs%3E %3Ctitle%3Etoolbar-icons%3C/title%3E %3Cg%3E %3Crect class='cls-1' x='15.15' y='4.57' width='5.75' height='18.82' rx='1.13' ry='1.13' transform='translate(9.4 -14.41) rotate(45)'/%3E %3Cpath class='cls-1' d='M11.06,25l-5.3,1.23L7,20.94a1.12,1.12,0,0,1,1.59,0l2.47,2.47A1.13,1.13,0,0,1,11.06,25Z' transform='translate(-5.76 -5.76)'/%3E %3C/g%3E %3C/svg%3E"

/***/ }),
/* 263 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='-290 387 30 20' style='enable-background:new -290 387 30 20;' xml:space='preserve'%3E %3Cpath d='M-272.5,405.4l-12.1-7.4c-0.6-0.4-0.6-1.7,0-2.1l12.1-7.4c0.5-0.3,1,0.3,1,1.1v14.7C-271.4,405.2-272,405.7-272.5,405.4z' fill='rgba(0, 0, 0, .2)' transform='translate(2, 0)'/%3E %3C/svg%3E"

/***/ }),
/* 264 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E %3Cline x1='0' y1='10' x2='100' y2='10' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3Cline x1='0' y1='50' x2='100' y2='50' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3Cline x1='0' y1='90' x2='100' y2='90' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3C/svg%3E"

/***/ }),
/* 265 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E %3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 10 16' style='enable-background:new 0 0 10 16;' xml:space='preserve'%3E %3Cpath fill='white' id='XMLID_6_' d='M9.1,6H8.5V3.5C8.5,1.5,6.9,0,5,0C3.1,0,1.6,1.5,1.6,3.5l0,2.5H0.9C0.4,6,0,6.4,0,6.9v8.2 C0,15.6,0.4,16,0.9,16h8.2c0.5,0,0.9-0.4,0.9-0.9V6.9C10,6.4,9.6,6,9.1,6z M3.3,3.4c0-0.9,0.8-1.6,1.7-1.6c0.9,0,1.7,0.8,1.7,1.7V6 H3.3V3.4z'/%3E %3C/svg%3E"

/***/ }),
/* 266 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 15.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E %3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='253px' height='64.577px' viewBox='0 0 253 64.577' enable-background='new 0 0 253 64.577' xml:space='preserve' fill='black'%3E %3Cpath d='M18.399,53.629c-0.01,0-0.021,0-0.031,0C7.023,53.396,0,43.151,0,33.793c0-10.79,8.426-19.905,18.399-19.905 c11.006,0,18.399,10.292,18.399,19.905c0,10.719-8.239,19.617-18.367,19.835C18.421,53.629,18.41,53.629,18.399,53.629z M18.399,18.257c-8.393,0-14.031,8.033-14.031,15.536c0.295,7.574,5.625,15.468,14.031,15.468c8.393,0,14.031-7.998,14.031-15.468 C32.43,25.372,26.005,18.257,18.399,18.257z'/%3E %3Cpath d='M58.15,53.629c-6.02,0-13.502-3.57-16.154-10.394c-0.287-0.733-0.603-1.542-0.603-3.281l0-38.454 c0-0.398,0.158-0.779,0.439-1.061S42.495,0,42.893,0h1.369c0.829,0,1.5,0.671,1.5,1.5v18.495c3.827-4.056,8.188-6.106,13.004-6.106 c11.111,0,17.989,10.332,17.989,19.905C76.444,44.75,68.099,53.629,58.15,53.629z M45.761,27.446v12.437 c0,4.652,7.208,9.378,12.389,9.378c8.516,0,14.236-7.998,14.236-15.468c0-7.472-5.208-15.536-13.621-15.536 C51.235,18.257,47.065,24.927,45.761,27.446z'/%3E %3Cpath d='M99.064,53.629c-0.01,0-0.021,0-0.031,0c-11.346-0.233-18.369-10.478-18.369-19.835 c0-10.79,8.426-19.905,18.399-19.905c11.005,0,18.398,10.292,18.398,19.905c0,10.719-8.239,19.617-18.366,19.835 C99.086,53.629,99.075,53.629,99.064,53.629z M99.064,18.257c-8.393,0-14.031,8.033-14.031,15.536 c0.294,7.574,5.624,15.468,14.031,15.468c8.393,0,14.031-7.998,14.031-15.468C113.096,25.372,106.67,18.257,99.064,18.257z'/%3E %3Cpath d='M153.252,53.629c-0.01,0-0.021,0-0.031,0c-11.346-0.233-18.369-10.478-18.369-19.835 c0-10.79,8.426-19.905,18.399-19.905c11.006,0,18.399,10.292,18.399,19.905c0,10.719-8.239,19.617-18.367,19.835 C153.273,53.629,153.263,53.629,153.252,53.629z M153.252,18.257c-8.393,0-14.031,8.033-14.031,15.536 c0.294,7.574,5.624,15.468,14.031,15.468c8.393,0,14.031-7.998,14.031-15.468C167.283,25.372,160.858,18.257,153.252,18.257z'/%3E %3Cpath d='M234.601,53.629c-0.01,0-0.021,0-0.031,0c-11.345-0.233-18.367-10.478-18.367-19.835 c0-10.79,8.426-19.905,18.398-19.905c11.006,0,18.399,10.292,18.399,19.905c0,10.719-8.239,19.617-18.367,19.835 C234.622,53.629,234.611,53.629,234.601,53.629z M234.601,18.257c-8.393,0-14.03,8.033-14.03,15.536 c0.294,7.574,5.624,15.468,14.03,15.468c8.394,0,14.031-7.998,14.031-15.468C248.632,25.372,242.206,18.257,234.601,18.257z'/%3E %3Cpath d='M193.62,53.629c-6.021,0-13.503-3.57-16.155-10.394l-0.098-0.239c-0.254-0.607-0.603-1.438-0.603-3.042 c0.002-15.911,0.098-38.237,0.099-38.461c0.003-0.826,0.674-1.494,1.5-1.494h1.368c0.829,0,1.5,0.671,1.5,1.5v18.495 c3.827-4.055,8.188-6.106,13.005-6.106c11.111,0,17.988,10.332,17.988,19.904C211.915,44.75,203.569,53.629,193.62,53.629z M181.231,27.446v12.437c0,4.652,7.208,9.378,12.389,9.378c8.515,0,14.235-7.998,14.235-15.468c0-7.472-5.207-15.536-13.619-15.536 C186.705,18.257,182.535,24.927,181.231,27.446z'/%3E %3Cpath d='M118.017,64.577c-0.013,0-0.026,0-0.039,0c-2.437-0.063-5.533-0.434-7.865-2.765 c-0.308-0.308-0.467-0.734-0.436-1.167c0.031-0.434,0.249-0.833,0.597-1.094l1.096-0.821c0.566-0.425,1.353-0.396,1.887,0.072 c1.083,0.947,2.617,1.408,4.691,1.408c2.913,0,6.3-2.752,6.3-6.3V16.073c0-0.829,0.671-1.5,1.5-1.5h1.368c0.829,0,1.5,0.671,1.5,1.5 v37.835C128.616,60.195,123.03,64.577,118.017,64.577z M127.116,8.268h-1.368c-0.829,0-1.5-0.671-1.5-1.5V2.389 c0-0.829,0.671-1.5,1.5-1.5h1.368c0.829,0,1.5,0.671,1.5,1.5v4.379C128.616,7.597,127.945,8.268,127.116,8.268z'/%3E %3C/svg%3E"

/***/ }),
/* 267 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(73);
module.exports = __webpack_require__(74);


/***/ })
/******/ ]);