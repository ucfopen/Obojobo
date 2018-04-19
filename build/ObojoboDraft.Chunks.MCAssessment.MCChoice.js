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
/******/ 	return __webpack_require__(__webpack_require__.s = 291);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = Viewer;

/***/ }),

/***/ 291:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(39);


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(40);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(41);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCChoice', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.score;
		}) != null) {
			model.modelState.score = attrs.content.score;
			model.modelState._score = attrs.content.score;
		} else {
			model.modelState.score = '';
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.score = model.modelState.score;
	},
	toJSON: function toJSON(model, json) {
		json.content.score = model.modelState.score;
	}
};

exports.default = Adapter;

var __guard__ = function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
};

/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(63);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _isornot = __webpack_require__(62);

var _isornot2 = _interopRequireDefault(_isornot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _Common2.default.components.OboComponent;
var OboModel = _Common2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;


var getInputType = function getInputType(responseType) {
	switch (responseType) {
		case 'pick-all':
			return 'checkbox';
		case 'pick-one':
		case 'pick-one-multiple-correct':
		default:
			return 'radio';
	}
};

var questionIsSelected = function questionIsSelected(questionState, model) {
	var response = QuestionUtil.getResponse(questionState, model.getParentOfType('ObojoboDraft.Chunks.Question')) || { ids: [] };

	return response.ids.indexOf(model.get('id')) !== -1;
};

var answerIsCorrect = function answerIsCorrect(model, mode, questionState, navStateContext) {
	var score = void 0;
	if (mode === 'review') {
		// no score data for this context? no idea what to do, throw an error
		if (!questionState.scores[navStateContext]) throw 'Unkown Question State';

		score = QuestionUtil.getScoreForModel(questionState, model, navStateContext);
	} else {
		score = model.modelState.score;
	}

	return score === 100;
};

var MCChoice = function MCChoice(props) {
	var isCorrect = void 0;

	try {
		isCorrect = answerIsCorrect(props.model, props.mode, props.moduleData.questionState, props.moduleData.navState.context);
	} catch (error) {
		// if there's no questionState data for this
		// or getting the score throws an error
		// just display a div
		return React.createElement('div', null);
	}

	var isSelected = questionIsSelected(props.moduleData.questionState, props.model);

	var className = 'obojobo-draft--chunks--mc-assessment--mc-choice' + (0, _isornot2.default)(isSelected, 'selected') + (0, _isornot2.default)(isCorrect, 'correct') + ' is-mode-' + props.mode;

	return React.createElement(
		OboComponent,
		{
			model: props.model,
			moduleData: props.moduleData,
			className: className,
			'data-choice-label': props.label
		},
		React.createElement('input', {
			type: getInputType(props.responseType),
			value: props.model.get('id'),
			checked: isSelected,
			name: props.model.parent.get('id')
		}),
		React.createElement(
			'div',
			{ className: 'children' },
			props.model.children.map(function (child, index) {
				var type = child.get('type');
				var isAnswerItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCAnswer';
				var isFeedbackItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback';
				if (isAnswerItem) {
					var Component = child.getComponentClass();
					return React.createElement(Component, { key: child.get('id'), model: child, moduleData: props.moduleData });
				}
			})
		)
	);
};

MCChoice.defaultProps = {
	responseType: null,
	revealAll: false,
	questionSubmitted: false
};

exports.default = MCChoice;

/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// used to apply ' is-label' or ' is-not-label' styles
var isOrNot = function isOrNot(flag, label) {
  return ' is-' + (flag ? '' : 'not-') + label;
};
exports.default = isOrNot;

/***/ }),

/***/ 63:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

/******/ });