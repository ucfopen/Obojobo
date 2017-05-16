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
/******/ 	return __webpack_require__(__webpack_require__.s = 183);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = ObojoboDraft;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = Viewer;

/***/ }),

/***/ 135:
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

/***/ 136:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(162);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(1);

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

/***/ 162:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(46);


/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(135);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(136);

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

/***/ })

/******/ });