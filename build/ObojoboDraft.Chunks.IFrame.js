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
/******/ 	return __webpack_require__(__webpack_require__.s = 173);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = ObojoboDraft;

/***/ }),

/***/ 108:
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

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(150);

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

/***/ 150:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(37);


/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(108);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(109);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.focusableChunk.FocusableSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.IFrame', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ })

/******/ });