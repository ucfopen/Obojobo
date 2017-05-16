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
/******/ 	return __webpack_require__(__webpack_require__.s = 176);
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

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(152);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var MCAnswer = React.createClass({
	displayName: 'MCAnswer',
	render: function render() {
		var _this = this;

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--chunks--mc-assessment--mc-answer'
			},
			this.props.model.children.models.map(function (child, index) {
				var Component = child.getComponentClass();
				return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this.props.moduleData });
			})
		);
	}
});

exports.default = MCAnswer;

/***/ }),

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _viewerComponent = __webpack_require__(112);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCAnswer', {
	type: 'chunk',
	adapter: null,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(153);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;


var MCFeedback = React.createClass({
	displayName: 'MCFeedback',
	render: function render() {
		var _this = this;

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				className: 'obojobo-draft--chunks--mc-assessment--mc-feedback' + (this.props.model.parent.modelState.score === 100 ? ' is-correct-feedback' : ' is-incorrect-feedback'),
				'data-choice-label': this.props.label
			},
			this.props.model.children.models.map(function (child, index) {
				var Component = child.getComponentClass();
				return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this.props.moduleData });
			})
		);
	}
});

exports.default = MCFeedback;

/***/ }),

/***/ 115:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _viewerComponent = __webpack_require__(114);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCFeedback', {
	type: 'chunk',
	adapter: null,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 116:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.responseType;
		}) != null) {
			return model.modelState.responseType = attrs.content.responseType;
		} else {
			return model.modelState.responseType = '';
		}
	},
	clone: function clone(model, _clone) {
		return _clone.modelState.responseType = model.modelState.responseType;
	},
	toJSON: function toJSON(model, json) {
		return json.content.responseType = model.modelState.responseType;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(154);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var Button = _ObojoboDraft2.default.components.Button;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;
var DOMUtil = _ObojoboDraft2.default.page.DOMUtil;

// FocusUtil = Common.util.FocusUtil

OboModel = _ObojoboDraft2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;
var ScoreUtil = _Viewer2.default.util.ScoreUtil;

// @TODO - This wont update if new children are passed in via props

var MCAssessment = React.createClass({
	displayName: 'MCAssessment',

	// getInitialState: ->
	// 	showingSolution: false

	// componentWillMount: ->
	// 	shuffledIds = QuestionUtil.getData(@props.moduleData.questionState, @props.model, 'shuffledIds')
	// 	if not shuffledIds
	// 		shuffledIds = _.shuffle(@props.model.children.models).map (model) -> model.get('id')
	// 		QuestionUtil.setData(@props.model.get('id'), 'shuffledIds', shuffledIds)

	getResponseData: function getResponseData() {
		var correct = new Set();
		var responses = new Set();

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(this.props.model.children.models)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var child = _step.value;

				if (child.modelState.score === 100) {
					correct.add(child.get('id'));
				}

				if (__guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, child), function (x) {
					return x.set;
				})) {
					// return child.modelState.score
					responses.add(child.get('id'));
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
	},
	calculateScore: function calculateScore() {
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
	},
	onClickSubmit: function onClickSubmit(event) {
		event.preventDefault();
		return this.updateScore();
	},
	updateScore: function updateScore() {
		return ScoreUtil.setScore(this.props.model.parent.get('id'), this.calculateScore());
	},
	onClickUndoRevealAll: function onClickUndoRevealAll(event) {
		event.preventDefault();
		return QuestionUtil.setData(this.props.model.get('id'), 'revealAll', false);
	},
	onClickRevealAll: function onClickRevealAll(event) {
		event.preventDefault();
		return QuestionUtil.setData(this.props.model.get('id'), 'revealAll', true);
	},
	onClickReset: function onClickReset(event) {
		event.preventDefault();
		return this.reset();
	},
	reset: function reset() {
		this.clearRevealAll();
		this.clearResponses();
		return this.clearScore();
	},
	clearRevealAll: function clearRevealAll() {
		return QuestionUtil.clearData(this.props.model.get('id'), 'revealAll');
	},

	// QuestionUtil.clearData @props.model.get('id'), 'shuffledIds'

	clearResponses: function clearResponses() {
		return Array.from(this.props.model.children.models).map(function (child) {
			return QuestionUtil.resetResponse(child.get('id'));
		});
	},
	clearScore: function clearScore() {
		return ScoreUtil.clearScore(this.props.model.parent.get('id'));
	},
	onClick: function onClick(event) {
		var mcChoiceEl = DOMUtil.findParentWithAttr(event.target, 'data-type', 'ObojoboDraft.Chunks.MCAssessment.MCChoice');
		if (!mcChoiceEl) {
			return;
		}

		var mcChoiceId = mcChoiceEl.getAttribute('data-id');
		if (!mcChoiceId) {
			return;
		}

		var revealAll = this.isRevealingAll();

		if (this.getScore() !== null) {
			this.reset();
		}

		switch (this.props.model.modelState.responseType) {
			case 'pick-all':
				return QuestionUtil.recordResponse(mcChoiceId, {
					set: !__guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, OboModel.models[mcChoiceId]), function (x) {
						return x.set;
					})
				});

			default:
				// pick-one | pick-one-multiple-correct
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = Array.from(this.props.model.children.models)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var child = _step3.value;

						if (child.get('id') !== mcChoiceId) {
							QuestionUtil.recordResponse(child.get('id'), {
								set: false
							});
						}
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				return QuestionUtil.recordResponse(mcChoiceId, {
					set: true
				});
		}
	},
	getScore: function getScore() {
		return ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model.parent);
	},


	// showSolution: (event) ->
	// 	event.preventDefault()
	// 	@setState { showingSolution:true }

	isRevealingAll: function isRevealingAll() {
		return QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'revealAll');
	},
	render: function render() {
		var _this = this;

		var responseType = this.props.model.modelState.responseType;


		var shuffledIds = QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'shuffledIds');
		if (!shuffledIds) {
			shuffledIds = _.shuffle(this.props.model.children.models).map(function (model) {
				return model.get('id');
			});
			QuestionUtil.setData(this.props.model.get('id'), 'shuffledIds', shuffledIds);
		}

		var revealAll = this.isRevealingAll();
		var score = this.getScore();
		var questionSubmitted = score !== null;
		var questionAnswered = this.getResponseData().responses.size >= 1;
		// shuffledIds = QuestionUtil.getData(@props.moduleData.questionState, @props.model, 'shuffledIds')
		// shuffledIds = _.shuffle(@props.model.children.models).map (model) -> model.get('id')

		var feedbacks = Array.from(this.getResponseData().responses).filter(function (mcChoiceId) {
			return OboModel.models[mcChoiceId].children.length > 1;
		}).sort(function (id1, id2) {
			return shuffledIds.indexOf(id1) - shuffledIds.indexOf(id2);
		}).map(function (mcChoiceId) {
			return OboModel.models[mcChoiceId].children.at(1);
		});

		var solution = this.props.model.parent.modelState.solution;

		if (solution != null) {
			var SolutionComponent = solution.getComponentClass();
		}

		return React.createElement(
			OboComponent,
			{
				model: this.props.model,
				moduleData: this.props.moduleData,
				onClick: this.onClick,
				tag: 'form',
				className: 'obojobo-draft--chunks--mc-assessment' + (' is-response-type-' + this.props.model.modelState.responseType) + (revealAll ? ' is-revealing-all' : ' is-not-revealing-all') + (score === null ? ' is-unscored' : ' is-scored')
			},
			React.createElement(
				'span',
				{ className: 'instructions' },
				function () {
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
				}()
			),
			shuffledIds.map(function (id, index) {
				var child = OboModel.models[id];
				if (child.get('type') !== 'ObojoboDraft.Chunks.MCAssessment.MCChoice') {
					return null;
				}

				var Component = child.getComponentClass();
				return React.createElement(Component, {
					key: child.get('id'),
					model: child,
					moduleData: _this.props.moduleData,
					responseType: responseType,
					revealAll: revealAll,
					questionSubmitted: questionSubmitted,
					label: String.fromCharCode(index + 65)

				});
			}),
			React.createElement(
				'div',
				{ className: 'submit' },
				questionSubmitted ? React.createElement(Button, {
					altAction: true,
					onClick: this.onClickReset,
					value: 'Try Again'
				}) : React.createElement(Button, {
					onClick: this.onClickSubmit,
					value: 'Check Your Answer',
					disabled: !questionAnswered
				}),
				questionSubmitted ? score === 100 ? React.createElement(
					'div',
					{ className: 'result-container' },
					React.createElement(
						'p',
						{ className: 'result correct' },
						'Correct!'
					)
				) : React.createElement(
					'div',
					{ className: 'result-container' },
					React.createElement(
						'p',
						{ className: 'result incorrect' },
						'Incorrect'
					),
					responseType === 'pick-all' ? React.createElement(
						'span',
						{ className: 'pick-all-instructions' },
						'You have either missed some correct answers or selected some incorrect answers'
					) : null
				) : null
			),
			React.createElement(
				ReactCSSTransitionGroup,
				{
					component: 'div',
					transitionName: 'submit',
					transitionEnterTimeout: 800,
					transitionLeaveTimeout: 800
				},
				questionSubmitted && (feedbacks.length > 0 || solution) ? React.createElement(
					'div',
					{ className: 'solution', key: 'solution' },
					React.createElement(
						'div',
						{ className: 'score' },
						feedbacks.length === 0 ? null : React.createElement(
							'div',
							{ className: 'feedback' + (responseType === 'pick-all' ? ' is-pick-all-feedback' : ' is-not-pick-all-feedback') },
							feedbacks.map(function (model) {
								var Component = model.getComponentClass();
								return React.createElement(Component, {
									key: model.get('id'),
									model: model,
									moduleData: _this.props.moduleData,
									responseType: responseType,
									revealAll: revealAll,
									questionSubmitted: questionSubmitted,
									label: String.fromCharCode(shuffledIds.indexOf(model.parent.get('id')) + 65)
								});
							})
						)
					),
					revealAll ? React.createElement(Button, {
						altAction: true,
						onClick: this.onClickUndoRevealAll,
						value: 'Hide Explanation'
					}) : solution ? React.createElement(Button, {
						altAction: true,
						onClick: this.onClickRevealAll,
						value: 'Read an explanation of the answer'
					}) : null,
					React.createElement(
						ReactCSSTransitionGroup,
						{
							component: 'div',
							transitionName: 'solution',
							transitionEnterTimeout: 800,
							transitionLeaveTimeout: 800
						},
						revealAll ? React.createElement(
							'div',
							{ className: 'solution-container', key: 'solution-component' },
							React.createElement(SolutionComponent, { model: solution, moduleData: this.props.moduleData })
						) : null
					)
				) : null
			)
		);
	}
});

exports.default = MCAssessment;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 14:
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

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(17);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var OboModel = _ObojoboDraft2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;


var MCChoice = React.createClass({
	displayName: 'MCChoice',
	getDefaultProps: function getDefaultProps() {
		return {
			responseType: null,
			revealAll: false,
			questionSubmitted: false
		};
	},


	// getInitialState: ->
	// 	children: @createChildren(this.props.model.children.models)

	// componentWillReceiveProps: (nextProps) ->
	// 	if nextProps.model?
	// 		@setState { children:@createChildren(this.props.model.children.models) }

	// createChildren: (models) ->
	// 	children = []
	// 	hasFeedback = false
	// 	for model in models
	// 		children.push model
	// 		if model.get('type') is 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
	// 			hasFeedback = true

	// 	if not hasFeedback
	// 		if @props.model.modelState.score is 100
	// 			children.push @createFeedbackItem('Correct!')
	// 		else
	// 			children.push @createFeedbackItem('Incorrect')

	// 	children

	createFeedbackItem: function createFeedbackItem(message) {
		var feedback = OboModel.create('ObojoboDraft.Chunks.MCAssessment.MCFeedback');
		var text = OboModel.create('ObojoboDraft.Chunks.Text');
		// console.log('text', text)
		text.modelState.textGroup.first.text.insertText(0, message);
		// console.log('feedback', feedback)
		feedback.children.add(text);

		return feedback;
	},


	// onChange: (event) ->
	// 	if event.target.checked
	// 		QuestionUtil.recordResponse @props.model.get('id'), true
	// 	else
	// 		QuestionUtil.resetResponse @props.model.get('id')

	// onClick: (event) ->
	// 	# if not @props.isSelected
	// 		# @props.onChange @props.model, true
	// 	# QuestionUtil.recordResponse @props.model.get('id'), true
	// 	@refs.input.checked = true

	getInputType: function getInputType() {
		switch (this.props.responseType) {
			case 'pick-all':
				return 'checkbox';
			default:
				//'pick-one', 'pick-one-multiple-correct'
				return 'radio';
		}
	},
	render: function render() {
		var _this = this;

		var isSelected = __guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, this.props.model), function (x) {
			return x.set;
		}) === true;

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
						return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this.props.moduleData });
					}
				})
			)
		);
	}
});

exports.default = MCChoice;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 152:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 153:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 154:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(39);


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

__webpack_require__(7);

__webpack_require__(113);

__webpack_require__(115);

var _adapter = __webpack_require__(116);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(117);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _adapter = __webpack_require__(14);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(15);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCChoice', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ })

/******/ });