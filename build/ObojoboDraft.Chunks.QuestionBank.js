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
/******/ 	return __webpack_require__(__webpack_require__.s = 295);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(150);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(151);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.QuestionBank', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 150:
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
			model.modelState.select = 'sequential'; //random-unseen | random-all | sequential
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x3) {
			return x3.shuffleGroup;
		}) != null) {
			model.modelState.shuffleGroup = attrs.content.shuffleGroup;
		} else {
			model.modelState.shuffleGroup = false;
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
		_clone.modelState.shuffleGroup = model.modelState.shuffleGroup;
		// clone.modelState.resetWhenEmpty = model.modelState.resetWhenEmpty
	},
	toJSON: function toJSON(model, json) {
		json.content.choose = model.modelState.choose;
		json.content.groupSize = model.modelState.groupSize;
		json.content.select = model.modelState.select;
		// json.content.resetWhenEmpty = model.modelState.resetWhenEmpty
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(274);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _Common2.default.components.OboComponent;

exports.default = function (props) {
	return React.createElement(
		OboComponent,
		{
			model: props.model,
			moduleData: props.moduleData,
			className: 'obojobo-draft--chunks--question-bank'
		},
		props.model.children.models.map(function (child, index) {
			var Component = child.getComponentClass();

			return React.createElement(Component, { key: index, model: child, moduleData: props.moduleData });
		})
	);
};

/***/ }),

/***/ 274:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 295:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(112);


/***/ })

/******/ });