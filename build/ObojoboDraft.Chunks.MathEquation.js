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
/******/ 	return __webpack_require__(__webpack_require__.s = 167);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),

/***/ 145:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = katex;

/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(34);


/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(69);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(70);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.focusableChunk.FocusableSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MathEquation', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
	// dependencies: ['https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css']
});

/***/ }),

/***/ 69:
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
			model.modelState.align = attrs.content.align;
		} else {
			model.modelState.align = 'center';
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.latex = model.modelState.latex;
		_clone.modelState.align = model.modelState.align;
	},
	toJSON: function toJSON(model, json) {
		json.content.latex = model.modelState.latex;
		json.content.align = model.modelState.align;
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

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(145);

var _katex = __webpack_require__(16);

var _katex2 = _interopRequireDefault(_katex);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// katex = null #dynamically load


var OboComponent = _Common2.default.components.OboComponent;
var NonEditableChunk = _Common2.default.chunk.NonEditableChunk;


var getLatexHtml = function getLatexHtml(latex) {
	try {
		var html = _katex2.default.renderToString(latex, { displayMode: true });
		return { html: html };
	} catch (e) {
		return { error: e };
	}
};

var MathEquation = function (_React$Component) {
	_inherits(MathEquation, _React$Component);

	function MathEquation(props) {
		_classCallCheck(this, MathEquation);

		var _this = _possibleConstructorReturn(this, (MathEquation.__proto__ || Object.getPrototypeOf(MathEquation)).call(this, props));

		var katexHtml = getLatexHtml(_this.props.model.modelState.latex);
		if (katexHtml.error != null) {
			katexHtml = '';
		} else {
			katexHtml = katexHtml.html;
		}

		_this.state = { katexHtml: katexHtml };
		return _this;
	}

	_createClass(MathEquation, [{
		key: 'render',
		value: function render() {
			if (this.state.katexHtml.length === 0) {
				return null;
			}

			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'obojobo-draft--chunks--math-equation pad align-' + this.props.model.modelState.align
				},
				React.createElement(
					NonEditableChunk,
					null,
					React.createElement('div', {
						className: 'katex-container',
						dangerouslySetInnerHTML: { __html: this.state.katexHtml }
					})
				)
			);
		}
	}]);

	return MathEquation;
}(React.Component);

exports.default = MathEquation;

/***/ })

/******/ });