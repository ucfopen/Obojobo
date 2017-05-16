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

module.exports = ObojoboDraft;

/***/ }),

/***/ 144:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(31);


/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _adapter = __webpack_require__(95);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(96);

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

/***/ 95:
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

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(144);

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

/***/ })

/******/ });