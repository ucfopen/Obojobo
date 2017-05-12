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
/******/ 	return __webpack_require__(__webpack_require__.s = 169);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = ObojoboDraft;

/***/ }),

/***/ 146:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(33);


/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _viewerComponent = __webpack_require__(99);

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

/***/ 99:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(146);

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

/***/ })

/******/ });