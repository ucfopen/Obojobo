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
/******/ 	return __webpack_require__(__webpack_require__.s = 293);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),

/***/ 110:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(145);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(146);

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

/***/ 145:
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

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.label;
		}) != null) {
			model.modelState.label = attrs.content.label;
		} else {
			model.modelState.label = '';
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.size;
		}) != null) {
			model.modelState.size = attrs.content.size + 'em';
		} else {
			model.modelState.size = '1em';
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.latex = model.modelState.latex;
		_clone.modelState.align = model.modelState.align;
		_clone.modelState.label = model.modelState.label;
		_clone.modelState.size = model.modelState.size;
	},
	toJSON: function toJSON(model, json) {
		json.content.latex = model.modelState.latex;
		json.content.align = model.modelState.align;
		json.content.label = model.modelState.label;
		json.content.size = model.modelState.size;
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

/***/ 146:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(271);

var _katex = __webpack_require__(64);

var _katex2 = _interopRequireDefault(_katex);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

exports.default = function (props) {
	var katexHtml = getLatexHtml(props.model.modelState.latex);
	if (katexHtml.error != null) {
		katexHtml = '';
	} else {
		katexHtml = katexHtml.html;
	}

	if (katexHtml.length === 0) {
		return null;
	}

	return React.createElement(
		OboComponent,
		{
			model: props.model,
			moduleData: props.moduleData,
			className: 'obojobo-draft--chunks--math-equation pad align-' + props.model.modelState.align
		},
		React.createElement(
			NonEditableChunk,
			null,
			React.createElement('div', {
				className: 'katex-container',
				style: { fontSize: props.model.modelState.size },
				dangerouslySetInnerHTML: { __html: katexHtml }
			}),
			props.model.modelState.label === '' ? null : React.createElement(
				'div',
				{ className: 'equation-label' },
				props.model.modelState.label
			)
		)
	);
};

/***/ }),

/***/ 271:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 293:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(110);


/***/ }),

/***/ 64:
/***/ (function(module, exports) {

module.exports = katex;

/***/ })

/******/ });