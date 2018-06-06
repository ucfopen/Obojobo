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
/******/ 	return __webpack_require__(__webpack_require__.s = 292);
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

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

__webpack_require__(40);

__webpack_require__(140);

__webpack_require__(142);

var _adapter = __webpack_require__(143);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(144);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 139:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(268);

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
			className: 'obojobo-draft--chunks--mc-assessment--mc-answer'
		},
		props.model.children.models.map(function (child, index) {
			var Component = child.getComponentClass();
			return React.createElement(Component, { key: child.get('id'), model: child, moduleData: props.moduleData });
		})
	);
};

/***/ }),

/***/ 140:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _viewerComponent = __webpack_require__(139);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCAnswer', {
	type: 'chunk',
	adapter: null,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 141:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(269);

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
			className: 'obojobo-draft--chunks--mc-assessment--mc-feedback' + (props.model.parent.modelState.score === 100 ? ' is-correct-feedback' : ' is-not-correct-feedback'),
			'data-choice-label': props.label
		},
		props.model.children.models.map(function (child, index) {
			var Component = child.getComponentClass();
			return React.createElement(Component, { key: child.get('id'), model: child, moduleData: props.moduleData });
		})
	);
};

/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _viewerComponent = __webpack_require__(141);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCFeedback', {
	type: 'chunk',
	adapter: null,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		var content = attrs && attrs.content ? attrs.content : {};

		model.modelState.responseType = content.responseType || 'pick-one';
		model.modelState.correctLabels = content.correctLabels ? content.correctLabels.split('|') : null;
		model.modelState.incorrectLabels = content.incorrectLabels ? content.incorrectLabels.split('|') : null;
		model.modelState.shuffle = content.shuffle !== false;
	},
	clone: function clone(model, _clone) {
		_clone.modelState.responseType = model.modelState.responseType;
		_clone.modelState.correctLabels = model.modelState.correctLabels ? model.modelState.correctLabels.slice(0) : null;
		_clone.modelState.incorrectLabels = model.modelState.incorrectLabels ? model.modelState.incorrectLabels.slice(0) : null;
		_clone.modelState.shuffle = model.modelState.shuffle;
	},
	toJSON: function toJSON(model, json) {
		json.content.responseType = model.modelState.responseType;
		json.content.correctLabels = model.modelState.correctLabels ? model.modelState.correctLabels.join('|') : null;
		json.content.incorrectLabels = model.modelState.incorrectLabels ? model.modelState.incorrectLabels.join('|') : null;
		json.content.shuffle = model.modelState.shuffle;
	}
};

exports.default = Adapter;

/***/ }),

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(270);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _isornot = __webpack_require__(20);

var _isornot2 = _interopRequireDefault(_isornot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var OboComponent = _Common2.default.components.OboComponent;
var Button = _Common2.default.components.Button;
var OboModel = _Common2.default.models.OboModel;
var Dispatcher = _Common2.default.flux.Dispatcher;
var DOMUtil = _Common2.default.page.DOMUtil;
// FocusUtil = Common.util.FocusUtil

var QuestionUtil = _Viewer2.default.util.QuestionUtil;
var NavUtil = _Viewer2.default.util.NavUtil;


var DEFAULT_CORRECT_PRACTICE_LABELS = ['Correct!', 'You got it!', 'Great job!', "That's right!"];
var DEFAULT_CORRECT_REVIEW_LABELS = ['Correct'];
var DEFAULT_INCORRECT_LABELS = ['Incorrect'];

// @TODO - This wont update if new children are passed in via props

var MCAssessment = function (_React$Component) {
	_inherits(MCAssessment, _React$Component);

	function MCAssessment(props) {
		_classCallCheck(this, MCAssessment);

		var _this = _possibleConstructorReturn(this, (MCAssessment.__proto__ || Object.getPrototypeOf(MCAssessment)).call(this, props));

		var _this$props$model$mod = _this.props.model.modelState,
		    correctLabels = _this$props$model$mod.correctLabels,
		    incorrectLabels = _this$props$model$mod.incorrectLabels;


		_this.onClickShowExplanation = _this.onClickShowExplanation.bind(_this);
		_this.onClickHideExplanation = _this.onClickHideExplanation.bind(_this);
		_this.onClickSubmit = _this.onClickSubmit.bind(_this);
		_this.onClickReset = _this.onClickReset.bind(_this);
		_this.onClick = _this.onClick.bind(_this);
		_this.onCheckAnswer = _this.onCheckAnswer.bind(_this);
		_this.isShowingExplanation = _this.isShowingExplanation.bind(_this);
		_this.correctLabels = correctLabels ? correctLabels : _this.props.mode === 'review' ? DEFAULT_CORRECT_REVIEW_LABELS : DEFAULT_CORRECT_PRACTICE_LABELS;
		_this.incorrectLabels = incorrectLabels ? incorrectLabels : DEFAULT_INCORRECT_LABELS;
		_this.updateFeedbackLabels();
		return _this;
	}

	_createClass(MCAssessment, [{
		key: 'getQuestionModel',
		value: function getQuestionModel() {
			return this.props.model.getParentOfType('ObojoboDraft.Chunks.Question');
		}
	}, {
		key: 'getResponseData',
		value: function getResponseData() {
			var questionResponse = QuestionUtil.getResponse(this.props.moduleData.questionState, this.getQuestionModel(), this.props.moduleData.navState.context) || { ids: [] };

			var correct = new Set();
			var responses = new Set();
			var childId = void 0;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(this.props.model.children.models)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var child = _step.value;

					childId = child.get('id');

					if (child.modelState.score === 100) {
						correct.add(childId);
					}

					if (questionResponse.ids.indexOf(childId) !== -1) {
						responses.add(childId);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return {
				correct: correct,
				responses: responses
			};
		}
	}, {
		key: 'calculateScore',
		value: function calculateScore() {
			var responseData = this.getResponseData();
			var correct = responseData.correct;
			var responses = responseData.responses;


			switch (this.props.model.modelState.responseType) {
				case 'pick-all':
					if (correct.size !== responses.size) {
						return 0;
					}
					var score = 100;
					correct.forEach(function (id) {
						if (!responses.has(id)) {
							return score = 0;
						}
					});
					return score;

				default:
					// pick-one | pick-one-multiple-correct
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = Array.from(Array.from(correct))[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var id = _step2.value;

							if (responses.has(id)) {
								return 100;
							}
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					return 0;
			}
		}
	}, {
		key: 'isShowingExplanation',
		value: function isShowingExplanation() {
			return QuestionUtil.isShowingExplanation(this.props.moduleData.questionState, this.getQuestionModel());
		}
	}, {
		key: 'retry',
		value: function retry() {
			QuestionUtil.retryQuestion(this.getQuestionModel().get('id'), this.props.moduleData.navState.context);
		}
	}, {
		key: 'hideExplanation',
		value: function hideExplanation() {
			QuestionUtil.hideExplanation(this.getQuestionModel().get('id'), 'user');
		}
	}, {
		key: 'onClickReset',
		value: function onClickReset(event) {
			event.preventDefault();

			this.retry();
		}
	}, {
		key: 'onClickSubmit',
		value: function onClickSubmit(event) {
			event.preventDefault();

			QuestionUtil.setScore(this.getQuestionModel().get('id'), this.calculateScore(), this.props.moduleData.navState.context);
			// ScoreUtil.setScore(this.getQuestionModel().get('id'), this.calculateScore())
			this.updateFeedbackLabels();
			QuestionUtil.checkAnswer(this.getQuestionModel().get('id'));
		}
	}, {
		key: 'onClickShowExplanation',
		value: function onClickShowExplanation(event) {
			event.preventDefault();

			QuestionUtil.showExplanation(this.getQuestionModel().get('id'));
		}
	}, {
		key: 'onClickHideExplanation',
		value: function onClickHideExplanation(event) {
			event.preventDefault();

			this.hideExplanation();
		}
	}, {
		key: 'onClick',
		value: function onClick(event) {
			var response = void 0;
			var questionModel = this.getQuestionModel();
			var mcChoiceEl = DOMUtil.findParentWithAttr(event.target, 'data-type', 'ObojoboDraft.Chunks.MCAssessment.MCChoice');
			if (!mcChoiceEl) {
				return;
			}

			var mcChoiceId = mcChoiceEl.getAttribute('data-id');
			if (!mcChoiceId) {
				return;
			}

			if (this.getScore() !== null) {
				this.retry();
			}

			switch (this.props.model.modelState.responseType) {
				case 'pick-all':
					response = QuestionUtil.getResponse(this.props.moduleData.questionState, questionModel, this.props.moduleData.navState.context) || {
						ids: []
					};
					var responseIndex = response.ids.indexOf(mcChoiceId);

					if (responseIndex === -1) {
						response.ids.push(mcChoiceId);
					} else {
						response.ids.splice(responseIndex, 1);
					}
					break;

				default:
					response = {
						ids: [mcChoiceId]
					};
					break;
			}

			QuestionUtil.setResponse(questionModel.get('id'), response, mcChoiceId, this.props.moduleData.navState.context, this.props.moduleData.navState.context.split(':')[1], this.props.moduleData.navState.context.split(':')[2]);
		}
	}, {
		key: 'getScore',
		value: function getScore() {
			return QuestionUtil.getScoreForModel(this.props.moduleData.questionState, this.getQuestionModel(), this.props.moduleData.navState.context);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps() {
			this.sortIds();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			Dispatcher.on('question:checkAnswer', this.onCheckAnswer);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			Dispatcher.off('question:checkAnswer', this.onCheckAnswer);
		}
	}, {
		key: 'onCheckAnswer',
		value: function onCheckAnswer(payload) {
			var questionId = this.getQuestionModel().get('id');

			if (payload.value.id === questionId) {
				QuestionUtil.setScore(questionId, this.calculateScore(), this.props.moduleData.navState.context);
			}
		}
	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.sortIds();
		}
	}, {
		key: 'sortIds',
		value: function sortIds() {
			if (!QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'sortedIds')) {
				var ids = this.props.model.children.models.map(function (model) {
					return model.get('id');
				});
				if (this.props.model.modelState.shuffle) ids = _.shuffle(ids);
				QuestionUtil.setData(this.props.model.get('id'), 'sortedIds', ids);
			}
		}
	}, {
		key: 'updateFeedbackLabels',
		value: function updateFeedbackLabels() {
			this.correctLabelToShow = this.getRandomItem(this.correctLabels);
			this.incorrectLabelToShow = this.getRandomItem(this.incorrectLabels);
		}
	}, {
		key: 'getRandomItem',
		value: function getRandomItem(arrayOfOptions) {
			return arrayOfOptions[Math.floor(Math.random() * arrayOfOptions.length)];
		}
	}, {
		key: 'createInstructions',
		value: function createInstructions(responseType) {
			switch (responseType) {
				case 'pick-one':
					return React.createElement(
						'span',
						null,
						'Pick the correct answer'
					);
				case 'pick-one-multiple-correct':
					return React.createElement(
						'span',
						null,
						'Pick one of the correct answers'
					);
				case 'pick-all':
					return React.createElement(
						'span',
						null,
						'Pick ',
						React.createElement(
							'b',
							null,
							'all'
						),
						' of the correct answers'
					);
			}
		}
	}, {
		key: 'renderSubmitFooter',
		value: function renderSubmitFooter(isAnswerSelected, isAnswerScored) {
			return React.createElement(
				'div',
				{ className: 'submit' },
				isAnswerScored ? React.createElement(Button, { altAction: true, onClick: this.onClickReset, value: 'Try Again' }) : React.createElement(Button, {
					onClick: this.onClickSubmit,
					value: 'Check Your Answer',
					disabled: !isAnswerSelected
				})
			);
		}
	}, {
		key: 'renderSubmittedResultsFooter',
		value: function renderSubmittedResultsFooter(isCorrect, isPickAll) {
			if (isCorrect) {
				return React.createElement(
					'div',
					{ className: 'result-container' },
					React.createElement(
						'p',
						{ className: 'result correct' },
						this.correctLabelToShow
					)
				);
			}

			return React.createElement(
				'div',
				{ className: 'result-container' },
				React.createElement(
					'p',
					{ className: 'result incorrect' },
					this.incorrectLabelToShow
				),
				isPickAll ? React.createElement(
					'span',
					{ className: 'pick-all-instructions' },
					'You have either missed some correct answers or selected some incorrect answers'
				) : null
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var sortedIds = QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'sortedIds');
			if (!sortedIds) return null;

			var responseType = this.props.model.modelState.responseType;
			var isShowingExplanation = this.isShowingExplanation();
			var score = this.getScore();
			var isAnswerScored = score !== null; // Question has been submitted in practice or scored by server in assessment
			var isAnswerSelected = this.getResponseData().responses.size >= 1; // An answer choice was selected

			var feedbacks = Array.from(this.getResponseData().responses).filter(function (mcChoiceId) {
				return OboModel.models[mcChoiceId].children.length > 1;
			}).sort(function (id1, id2) {
				return sortedIds.indexOf(id1) - sortedIds.indexOf(id2);
			}).map(function (mcChoiceId) {
				return OboModel.models[mcChoiceId].children.at(1);
			});

			var solution = this.props.model.parent.modelState.solution;

			if (solution != null) {
				var SolutionComponent = solution.getComponentClass();
			}

			var explanationFooter = null;
			if (isShowingExplanation) {
				explanationFooter = React.createElement(Button, { altAction: true, onClick: this.onClickHideExplanation, value: 'Hide Explanation' });
			} else if (solution) {
				explanationFooter = React.createElement(Button, {
					className: 'show-explanation-button',
					altAction: true,
					onClick: this.onClickShowExplanation,
					value: 'Read an explanation of the answer'
				});
			}

			var feedbackAndSolution = null;
			if (isAnswerScored && (feedbacks.length > 0 || solution)) {
				feedbackAndSolution = React.createElement(
					'div',
					{ className: 'solution', key: 'solution' },
					React.createElement(
						'div',
						{ className: 'score' },
						feedbacks.length === 0 ? null : React.createElement(
							'div',
							{
								className: 'feedback' + (0, _isornot2.default)(responseType === 'pick-all', 'pick-all-feedback')
							},
							feedbacks.map(function (model) {
								var Component = model.getComponentClass();
								return React.createElement(Component, {
									key: model.get('id'),
									model: model,
									moduleData: _this2.props.moduleData,
									responseType: responseType,
									isShowingExplanation: true,
									questionSubmitted: true,
									label: String.fromCharCode(sortedIds.indexOf(model.parent.get('id')) + 65)
								});
							})
						)
					),
					explanationFooter,
					React.createElement(
						ReactCSSTransitionGroup,
						{
							component: 'div',
							transitionName: 'solution',
							transitionEnterTimeout: 800,
							transitionLeaveTimeout: 800
						},
						isShowingExplanation ? React.createElement(
							'div',
							{ className: 'solution-container', key: 'solution-component' },
							React.createElement(SolutionComponent, { model: solution, moduleData: this.props.moduleData })
						) : null
					)
				);
			}

			var className = 'obojobo-draft--chunks--mc-assessment' + (' is-response-type-' + this.props.model.modelState.responseType) + (' is-mode-' + this.props.mode) + (0, _isornot2.default)(isShowingExplanation, 'showing-explanation') + (0, _isornot2.default)(score !== null, 'scored');

			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					onClick: this.props.mode !== 'review' ? this.onClick : null,
					tag: 'form',
					className: className
				},
				React.createElement(
					'span',
					{ className: 'instructions' },
					this.createInstructions(responseType)
				),
				sortedIds.map(function (id, index) {
					var child = OboModel.models[id];
					if (child.get('type') !== 'ObojoboDraft.Chunks.MCAssessment.MCChoice') {
						return null;
					}

					var Component = child.getComponentClass();
					return React.createElement(Component, {
						key: child.get('id'),
						model: child,
						moduleData: _this2.props.moduleData,
						responseType: responseType,
						isShowingExplanation: true,
						mode: _this2.props.mode,
						questionSubmitted: isAnswerScored,
						label: String.fromCharCode(index + 65)
					});
				}),
				this.props.mode === 'practice' || this.props.mode === 'review' ? React.createElement(
					'div',
					{ className: 'submit-and-result-container' },
					this.props.mode === 'practice' ? this.renderSubmitFooter(isAnswerSelected, isAnswerScored) : null,
					isAnswerScored ? this.renderSubmittedResultsFooter(score === 100, responseType === 'pick-all') : null
				) : null,
				React.createElement(
					ReactCSSTransitionGroup,
					{
						component: 'div',
						transitionName: 'submit',
						transitionEnterTimeout: 800,
						transitionLeaveTimeout: 800
					},
					feedbackAndSolution
				)
			);
		}
	}]);

	return MCAssessment;
}(React.Component);

exports.default = MCAssessment;

/***/ }),

/***/ 20:
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

/***/ 268:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 269:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 270:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 292:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(109);


/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(41);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(42);

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

/***/ 41:
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

/***/ 42:
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

var _isornot = __webpack_require__(20);

var _isornot2 = _interopRequireDefault(_isornot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _Common2.default.components.OboComponent;
var OboModel = _Common2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;


var QUESTION_TYPE = 'ObojoboDraft.Chunks.Question';
var CHOSEN_CORRECTLY = 'chosen-correctly';
var SHOULD_NOT_HAVE_CHOSEN = 'should-not-have-chosen';
var COULD_HAVE_CHOSEN = 'could-have-chosen';
var SHOULD_HAVE_CHOSEN = 'should-have-chosen';
var UNCHOSEN_CORRECTLY = 'unchosen-correctly';

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

var questionIsSelected = function questionIsSelected(questionState, model, navStateContext) {
	var response = QuestionUtil.getResponse(questionState, model.getParentOfType(QUESTION_TYPE), navStateContext) || { ids: [] };

	return response.ids.indexOf(model.get('id')) !== -1;
};

var getQuestionModel = function getQuestionModel(model) {
	return model.getParentOfType(QUESTION_TYPE);
};

var answerIsCorrect = function answerIsCorrect(model, mode, questionState, navStateContext) {
	var score = void 0;
	if (mode === 'review') {
		// no score data for this context? no idea what to do, throw an error
		if (!questionState.scores[navStateContext]) throw 'Unkown Question State';

		score = QuestionUtil.getScoreForModel(questionState, getQuestionModel(model), navStateContext);
	} else {
		score = model.modelState.score;
	}
	return score === 100;
};

var renderAnsFlag = function renderAnsFlag(type) {
	var flagEl = void 0;

	switch (type) {
		case UNCHOSEN_CORRECTLY:
			return React.createElement('div', null);
		case CHOSEN_CORRECTLY:
			flagEl = React.createElement(
				'p',
				null,
				'Your Answer (Correct)'
			);
			break;
		case SHOULD_NOT_HAVE_CHOSEN:
			flagEl = React.createElement(
				'p',
				null,
				'Your Answer (Incorrect)'
			);
			break;
		case COULD_HAVE_CHOSEN:
			flagEl = React.createElement(
				'p',
				null,
				'Another Correct Answer'
			);
			break;
		case SHOULD_HAVE_CHOSEN:
			flagEl = React.createElement(
				'p',
				null,
				' Correct Answer '
			);
			break;
	}

	return React.createElement(
		'div',
		{ className: 'answer-flag is-type-' + type },
		flagEl
	);
};

var getAnsType = function getAnsType(model, isCorrect, isSelected) {
	// The user selected a correct answer (not necessarily this one)
	// On multi-select questions, this is only true if a user selected all and only correct answers
	// Renamed for clarity w/ isACorrectChoice
	var userIsCorrect = isCorrect;

	var isACorrectChoice = model.get('content').score === 100;

	if (isSelected) {
		return isACorrectChoice ? CHOSEN_CORRECTLY : SHOULD_NOT_HAVE_CHOSEN;
	}

	if (isACorrectChoice) {
		return userIsCorrect ? COULD_HAVE_CHOSEN : SHOULD_HAVE_CHOSEN;
	}

	return UNCHOSEN_CORRECTLY;
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

	var isSelected = questionIsSelected(props.moduleData.questionState, props.model, props.moduleData.navState.context);

	var ansType = getAnsType(props.model, isCorrect, isSelected);

	var flag = void 0;
	if (props.mode === 'review') {
		flag = renderAnsFlag(ansType);
	}

	var className = 'obojobo-draft--chunks--mc-assessment--mc-choice' + (0, _isornot2.default)(isSelected, 'selected') + (0, _isornot2.default)(isCorrect, 'correct') + (' is-type-' + ansType) + (' is-mode-' + props.mode);

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
				var id = child.get('id');

				if (isAnswerItem) {
					var Component = child.getComponentClass();
					return React.createElement(
						'div',
						{ key: id },
						flag,
						React.createElement(Component, { key: id, model: child, moduleData: props.moduleData })
					);
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

/***/ 63:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

/******/ });