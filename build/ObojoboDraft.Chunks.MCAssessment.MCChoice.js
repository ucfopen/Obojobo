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
/******/ 	return __webpack_require__(__webpack_require__.s = 165);
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

/***/ 15:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(8);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(9);

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

/***/ 8:
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
			return model.modelState._score = attrs.content.score;
		} else {
			return model.modelState.score = '';
		}
	},
	clone: function clone(model, _clone) {
		return _clone.modelState.score = model.modelState.score;
	},
	toJSON: function toJSON(model, json) {
		return json.content.score = model.modelState.score;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(15);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OboComponent = _Common2.default.components.OboComponent;
var OboModel = _Common2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;

var MCChoice = function (_React$Component) {
	_inherits(MCChoice, _React$Component);

	function MCChoice() {
		_classCallCheck(this, MCChoice);

		return _possibleConstructorReturn(this, (MCChoice.__proto__ || Object.getPrototypeOf(MCChoice)).apply(this, arguments));
	}

	_createClass(MCChoice, [{
		key: 'getQuestionModel',
		value: function getQuestionModel() {
			return this.props.model.getParentOfType('ObojoboDraft.Chunks.Question');
		}
	}, {
		key: 'createFeedbackItem',
		value: function createFeedbackItem(message) {
			var feedback = OboModel.create('ObojoboDraft.Chunks.MCAssessment.MCFeedback');
			var text = OboModel.create('ObojoboDraft.Chunks.Text');
			// console.log('text', text)
			text.modelState.textGroup.first.text.insertText(0, message);
			// console.log('feedback', feedback)
			feedback.children.add(text);

			return feedback;
		}
	}, {
		key: 'getInputType',
		value: function getInputType() {
			switch (this.props.responseType) {
				case 'pick-all':
					return 'checkbox';
				default:
					//'pick-one', 'pick-one-multiple-correct'
					return 'radio';
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var response = QuestionUtil.getResponse(this.props.moduleData.questionState, this.getQuestionModel()) || { ids: [] };
			var isSelected = response.ids.indexOf(this.props.model.get('id')) !== -1;

			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'obojobo-draft--chunks--mc-assessment--mc-choice' + (isSelected ? ' is-selected' : ' is-not-selected') + (this.props.model.modelState.score === 100 ? ' is-correct' : ' is-incorrect'),
					'data-choice-label': this.props.label
				},
				React.createElement('input', {
					ref: 'input',
					type: this.getInputType(),
					value: this.props.model.get('id'),
					checked: isSelected,
					onChange: function onChange() {},
					name: this.props.model.parent.get('id')
				}),
				React.createElement(
					'div',
					{ className: 'children' },
					this.props.model.children.map(function (child, index) {
						var type = child.get('type');
						var isAnswerItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCAnswer';
						var isFeedbackItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback';

						if (isAnswerItem) {
							var Component = child.getComponentClass();
							return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this2.props.moduleData });
						}
					})
				)
			);
		}
	}], [{
		key: 'defaultProps',
		get: function get() {
			return {
				responseType: null,
				revealAll: false,
				questionSubmitted: false
			};
		}
	}]);

	return MCChoice;
}(React.Component);

exports.default = MCChoice;


function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ })

/******/ });