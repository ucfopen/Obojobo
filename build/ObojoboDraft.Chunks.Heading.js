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
/******/ 	return __webpack_require__(__webpack_require__.s = 172);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = ObojoboDraft;

/***/ }),

/***/ 106:
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

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(149);

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

/***/ 149:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(36);


/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(106);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(107);

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

/***/ })

/******/ });