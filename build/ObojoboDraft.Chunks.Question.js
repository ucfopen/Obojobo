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
/******/ 	return __webpack_require__(__webpack_require__.s = 268);
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

/***/ 106:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(143);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(144);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.Question', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler(),
	getNavItem: function getNavItem(model) {
		var label = void 0;
		var questions = model.parent.children.models.filter(function (child) {
			return child.get('type') === 'ObojoboDraft.Chunks.Question';
		});

		if (model.title) {
			label = model.title;
		} else if (model.modelState.practice) {
			label = 'Practice Question ' + (questions.indexOf(model) + 1);
		} else {
			label = 'Question ' + (questions.indexOf(model) + 1);
		}

		return {
			type: 'sub-link',
			label: label,
			path: ['#obo-' + model.get('id')]
		};
	}
});

/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(245);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QuestionContent = function (_React$Component) {
	_inherits(QuestionContent, _React$Component);

	function QuestionContent() {
		_classCallCheck(this, QuestionContent);

		return _possibleConstructorReturn(this, (QuestionContent.__proto__ || Object.getPrototypeOf(QuestionContent)).apply(this, arguments));
	}

	_createClass(QuestionContent, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			return React.createElement(
				'div',
				{ className: 'obojobo-draft--chunks--mc-question--content' },
				this.props.model.children.models.slice(0, this.props.model.children.models.length - 1).map(function (child, index) {
					var Component = child.getComponentClass();
					return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this2.props.moduleData });
				})
			);
		}
	}]);

	return QuestionContent;
}(React.Component);

exports.default = QuestionContent;

/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboModel = _Common2.default.models.OboModel;


var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x2) {
			return x2.practice;
		}) != null) {
			model.modelState.practice = attrs.content.practice;
		} else {
			model.modelState.practice = true;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x3) {
			return x3.solution;
		}) != null) {
			model.modelState.solution = OboModel.create(attrs.content.solution);
		} else {
			model.modelState.solution = null;
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.type = model.modelState.type;
		_clone.modelState.practice = model.modelState.practice;
		_clone.modelState.solution = null;

		if (model.modelState.solution != null) {
			_clone.modelState.solution = Object.assign({}, model.modelState.solution);
		}
	},
	toJSON: function toJSON(model, json) {
		json.content.type = model.modelState.type;
		json.content.solution = null;

		if (model.modelState.solution != null) {
			json.content.solution = model.modelState.solution.toJSON();
		}
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(246);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _viewerComponent = __webpack_require__(142);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var OboComponent = _Common2.default.components.OboComponent;
var Dispatcher = _Common2.default.flux.Dispatcher;
var FocusUtil = _Common2.default.util.FocusUtil;
var Button = _Common2.default.components.Button;
var ScoreUtil = _Viewer2.default.util.ScoreUtil;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;

var Question = function (_React$Component) {
	_inherits(Question, _React$Component);

	function Question() {
		_classCallCheck(this, Question);

		return _possibleConstructorReturn(this, (Question.__proto__ || Object.getPrototypeOf(Question)).apply(this, arguments));
	}

	_createClass(Question, [{
		key: 'onClickBlocker',
		value: function onClickBlocker() {
			QuestionUtil.viewQuestion(this.props.model.get('id'));

			if (this.props.model.modelState.practice) {
				return FocusUtil.focusComponent(this.props.model.get('id'));
			}
		}
	}, {
		key: 'render',
		value: function render() {
			if (this.props.showContentOnly) {
				return this.renderContentOnly();
			}

			var score = ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model);
			var viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model);

			var assessment = this.props.model.children.models[this.props.model.children.models.length - 1];
			var AssessmentComponent = assessment.getComponentClass();

			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'flip-container obojobo-draft--chunks--question' + (score === null ? '' : score === 100 ? ' is-correct' : ' is-incorrect') + ' is-' + viewState + (this.props.model.modelState.practice ? ' is-practice' : ' is-not-practice')
				},
				React.createElement(
					'div',
					{ className: 'flipper' },
					React.createElement(
						'div',
						{ className: 'content back' },
						React.createElement(_viewerComponent2.default, { model: this.props.model, moduleData: this.props.moduleData }),
						React.createElement(AssessmentComponent, {
							key: assessment.get('id'),
							model: assessment,
							moduleData: this.props.moduleData
						})
					),
					React.createElement(
						'div',
						{ className: 'blocker front', key: 'blocker', onClick: this.onClickBlocker.bind(this) },
						React.createElement(Button, {
							value: this.props.model.modelState.practice ? 'Try Question' : 'View Question'
						})
					)
				)
			);
		}
	}, {
		key: 'renderContentOnly',
		value: function renderContentOnly() {
			var score = ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model);
			var viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model);

			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'flip-container obojobo-draft--chunks--question' + (score === null ? '' : score === 100 ? ' is-correct' : ' is-incorrect') + ' is-active' + (this.props.model.modelState.practice ? ' is-practice' : ' is-not-practice')
				},
				React.createElement(
					'div',
					{ className: 'flipper' },
					React.createElement(
						'div',
						{ className: 'content back' },
						React.createElement(_viewerComponent2.default, { model: this.props.model, moduleData: this.props.moduleData }),
						React.createElement(
							'div',
							{ className: 'pad responses-hidden' },
							'(Responses Hidden)'
						)
					)
				)
			);
		}
	}]);

	return Question;
}(React.Component);

exports.default = Question;

/***/ }),

/***/ 245:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 246:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 268:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(106);


/***/ })

/******/ });