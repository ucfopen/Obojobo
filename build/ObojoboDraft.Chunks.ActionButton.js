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
/******/ 	return __webpack_require__(__webpack_require__.s = 284);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _adapter = __webpack_require__(123);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(124);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.ActionButton', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler() //@TODO
});

/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroup = _Common2.default.textGroup.TextGroup;

var TextGroupAdapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.textGroup;
		}) != null) {
			model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, Infinity, {
				indent: 0
			});
		} else if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
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
		if (_clone.modelState.textGroup) _clone.modelState.textGroup = model.modelState.textGroup.clone();else _clone.modelState.label = model.modelState.label;
		_clone.modelState.align = model.modelState.align;
	},
	toJSON: function toJSON(model, json) {
		if (json.content.textGroup) json.content.textGroup = model.modelState.textGroup.toDescriptor();else json.content.label = model.modelState.label;
		json.content.align = model.modelState.align;
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

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(260);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _Common2.default.components.OboComponent;
var Button = _Common2.default.components.Button;
var TextGroupEl = _Common2.default.chunk.textChunk.TextGroupEl;
var TextChunk = _Common2.default.chunk.TextChunk;

exports.default = function (props) {
	var model = props.model;
	var textItem = model.modelState.textGroup ? model.modelState.textGroup.first : '';

	return React.createElement(
		OboComponent,
		{ model: model, moduleData: props.moduleData },
		React.createElement(
			TextChunk,
			{ className: 'obojobo-draft--chunks--action-button pad' },
			React.createElement(
				Button,
				{
					onClick: model.processTrigger.bind(model, 'onClick'),
					value: model.modelState.label,
					align: model.modelState.align
				},
				React.createElement(TextGroupEl, { textItem: textItem, groupIndex: '0', parentModel: model })
			)
		)
	);
};

/***/ }),

/***/ 260:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 284:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(102);


/***/ })

/******/ });