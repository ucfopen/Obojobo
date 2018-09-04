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
/******/ 	return __webpack_require__(__webpack_require__.s = 397);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _selectionHandler = __webpack_require__(180);

var _selectionHandler2 = _interopRequireDefault(_selectionHandler);

var _adapter = __webpack_require__(179);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(181);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.Passage', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new _selectionHandler2.default()
});

/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroupAdapter = _Common2.default.chunk.textChunk.TextGroupAdapter;


var Adapter = {
	construct: function construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs);
		model.modelState.textGroup.maxItems = 1;

		model.modelState.style = attrs.content.style ? attrs.content.style : 'default';
		model.modelState.workTitle = attrs.content.workTitle ? attrs.content.workTitle : null;
		model.modelState.author = attrs.content.author ? attrs.content.author : null;
	},
	clone: function clone(model, _clone) {
		// TextGroupAdapter.clone(model, clone)
		// clone.modelState.headingLevel = model.modelState.headingLevel
		// clone.modelState.align = model.modelState.align
	},
	toJSON: function toJSON(model, json) {
		// TextGroupAdapter.toJSON(model, json)
		// json.content.headingLevel = model.modelState.headingLevel
		// json.content.align = model.modelState.align
	},
	toText: function toText(model) {
		return TextGroupAdapter.toText(model);
	}
};

exports.default = Adapter;
// function __guard__(value, transform) {
// 	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
// }

/***/ }),

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectionHandler = void 0;
var TextGroupSelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;
var FocusableSelectionHandler = _Common2.default.chunk.focusableChunk.FocusableSelectionHandler;
var Chunk = _Common2.default.models.Chunk;

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

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(368);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OboComponent = _Common2.default.components.OboComponent;
var TextGroupEl = _Common2.default.chunk.textChunk.TextGroupEl;
var TextChunk = _Common2.default.chunk.TextChunk;
var Dispatcher = _Common2.default.flux.Dispatcher;

var Passage = function (_React$Component) {
	_inherits(Passage, _React$Component);

	function Passage() {
		_classCallCheck(this, Passage);

		return _possibleConstructorReturn(this, (Passage.__proto__ || Object.getPrototypeOf(Passage)).apply(this, arguments));
	}

	_createClass(Passage, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var texts = this.props.model.modelState.textGroup.items.map(function (textItem, index) {
				return React.createElement(TextGroupEl, {
					textItem: textItem,
					groupIndex: index,
					key: index,
					parentModel: _this2.props.model
				});
			}.bind(this));

			var data = this.props.model.modelState;

			return React.createElement(
				OboComponent,
				{ model: this.props.model, moduleData: this.props.moduleData },
				React.createElement(
					TextChunk,
					{
						className: 'obojobo-draft--chunks--passage is-style-' + this.props.model.modelState.style
					},
					React.createElement(
						'h1',
						null,
						data.workTitle
					),
					React.createElement(
						'h2',
						null,
						'By ' + data.author
					),
					texts
				)
			);
		}
	}]);

	return Passage;
}(React.Component);

exports.default = Passage;

/***/ }),

/***/ 368:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 397:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(138);


/***/ })

/******/ });