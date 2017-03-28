/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ((function(modules) {
	// Check all modules for deduplicated modules
	for(var i in modules) {
		if(Object.prototype.hasOwnProperty.call(modules, i)) {
			switch(typeof modules[i]) {
			case "function": break;
			case "object":
				// Module can be created from a template
				modules[i] = (function(_m) {
					var args = _m.slice(1), fn = modules[_m[0]];
					return function (a,b,c) {
						fn.apply(this, [a,b,c].concat(args));
					};
				}(modules[i]));
				break;
			default:
				// Module is a copy of another module
				modules[i] = modules[modules[i]];
				break;
			}
		}
	}
	return modules;
}({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(125);


/***/ },

/***/ 33:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, MCAnswer, OboComponent;

	__webpack_require__(47);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	MCAnswer = React.createClass({
		displayName: 'MCAnswer',

		render: function render() {
			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'obojobo-draft--chunks--mc-assessment--mc-answer'
				},
				this.props.model.children.models.map(function (child, index) {
					var Component = child.getComponentClass();
					return React.createElement(Component, { key: child.get('id'), model: child, moduleData: this.props.moduleData });
				}.bind(this))
			);
		}
	});

	module.exports = MCAnswer;

/***/ },

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.MCAssessment.MCAnswer', {
	  type: 'chunk',
	  adapter: null,
	  componentClass: __webpack_require__(33),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 35:
/***/ function(module, exports) {

	'use strict';

	var Adapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.score : void 0 : void 0) != null) {
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

	module.exports = Adapter;

/***/ },

/***/ 36:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, MCChoice, OboComponent, OboModel, QuestionUtil;

	__webpack_require__(48);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	OboModel = Common.models.OboModel;

	QuestionUtil = window.Viewer.util.QuestionUtil;

	MCChoice = React.createClass({
	  displayName: 'MCChoice',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      responseType: null,
	      revealAll: false,
	      questionSubmitted: false
	    };
	  },
	  createFeedbackItem: function createFeedbackItem(message) {
	    var feedback, text;
	    feedback = OboModel.create('ObojoboDraft.Chunks.MCAssessment.MCFeedback');
	    text = OboModel.create('ObojoboDraft.Chunks.Text');
	    text.modelState.textGroup.first.text.insertText(0, message);
	    feedback.children.add(text);
	    return feedback;
	  },
	  getInputType: function getInputType() {
	    switch (this.props.responseType) {
	      case 'pick-all':
	        return 'checkbox';
	      default:
	        return 'radio';
	    }
	  },
	  render: function render() {
	    var isSelected, ref;
	    isSelected = ((ref = QuestionUtil.getResponse(this.props.moduleData.questionState, this.props.model)) != null ? ref.set : void 0) === true;
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
	            return React.createElement(Component, { key: child.get('id'), model: child, moduleData: this.props.moduleData });
	          }
	        }.bind(this))
	      )
	    );
	  }
	});

	module.exports = MCChoice;

/***/ },

/***/ 37:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.MCAssessment.MCChoice', {
	  type: 'chunk',
	  adapter: __webpack_require__(35),
	  componentClass: __webpack_require__(36),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 38:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, MCFeedback, OboComponent;

	__webpack_require__(49);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	MCFeedback = React.createClass({
		displayName: 'MCFeedback',

		render: function render() {
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
					return React.createElement(Component, { key: child.get('id'), model: child, moduleData: this.props.moduleData });
				}.bind(this))
			);
		}
	});

	module.exports = MCFeedback;

/***/ },

/***/ 39:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.MCAssessment.MCFeedback', {
	  type: 'chunk',
	  adapter: null,
	  componentClass: __webpack_require__(38),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 47:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 48:
47,

/***/ 49:
47,

/***/ 123:
/***/ function(module, exports) {

	'use strict';

	var Adapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.responseType : void 0 : void 0) != null) {
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

	module.exports = Adapter;

/***/ },

/***/ 124:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Button, Common, DOMUtil, Dispatcher, MCAssessment, OboComponent, OboModel, QuestionUtil, ReactCSSTransitionGroup, ScoreUtil;

	__webpack_require__(207);

	ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Button = Common.components.Button;

	OboModel = Common.models.OboModel;

	Dispatcher = Common.flux.Dispatcher;

	DOMUtil = Common.page.DOMUtil;

	OboModel = Common.models.OboModel;

	QuestionUtil = window.Viewer.util.QuestionUtil;

	ScoreUtil = window.Viewer.util.ScoreUtil;

	MCAssessment = React.createClass({
			displayName: 'MCAssessment',

			getResponseData: function getResponseData() {
					var child, correct, i, len, ref, ref1, responses;
					correct = new Set();
					responses = new Set();
					ref = this.props.model.children.models;
					for (i = 0, len = ref.length; i < len; i++) {
							child = ref[i];
							if (child.modelState.score === 100) {
									correct.add(child.get('id'));
							}
							if ((ref1 = QuestionUtil.getResponse(this.props.moduleData.questionState, child)) != null ? ref1.set : void 0) {
									responses.add(child.get('id'));
							}
					}
					return {
							correct: correct,
							responses: responses
					};
			},
			calculateScore: function calculateScore() {
					var correct, i, id, len, ref, responseData, responses, score;
					responseData = this.getResponseData();
					correct = responseData.correct;
					responses = responseData.responses;
					switch (this.props.model.modelState.responseType) {
							case 'pick-all':
									if (correct.size !== responses.size) {
											return 0;
									}
									score = 100;
									correct.forEach(function (id) {
											if (!responses.has(id)) {
													return score = 0;
											}
									});
									return score;
							default:
									ref = Array.from(correct);
									for (i = 0, len = ref.length; i < len; i++) {
											id = ref[i];
											if (responses.has(id)) {
													return 100;
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
			clearResponses: function clearResponses() {
					var child, i, len, ref, results;
					ref = this.props.model.children.models;
					results = [];
					for (i = 0, len = ref.length; i < len; i++) {
							child = ref[i];
							results.push(QuestionUtil.resetResponse(child.get('id')));
					}
					return results;
			},
			clearScore: function clearScore() {
					return ScoreUtil.clearScore(this.props.model.parent.get('id'));
			},
			onClick: function onClick(event) {
					var child, i, len, mcChoiceEl, mcChoiceId, ref, ref1, revealAll;
					mcChoiceEl = DOMUtil.findParentWithAttr(event.target, 'data-type', 'ObojoboDraft.Chunks.MCAssessment.MCChoice');
					if (!mcChoiceEl) {
							return;
					}
					mcChoiceId = mcChoiceEl.getAttribute('data-id');
					if (!mcChoiceId) {
							return;
					}
					revealAll = this.isRevealingAll();
					if (this.getScore() !== null) {
							this.reset();
					}
					switch (this.props.model.modelState.responseType) {
							case 'pick-all':
									return QuestionUtil.recordResponse(mcChoiceId, {
											set: !((ref = QuestionUtil.getResponse(this.props.moduleData.questionState, OboModel.models[mcChoiceId])) != null ? ref.set : void 0)
									});
							default:
									ref1 = this.props.model.children.models;
									for (i = 0, len = ref1.length; i < len; i++) {
											child = ref1[i];
											QuestionUtil.recordResponse(child.get('id'), {
													set: false
											});
									}
									return QuestionUtil.recordResponse(mcChoiceId, {
											set: true
									});
					}
			},
			getScore: function getScore() {
					return ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model.parent);
			},
			isRevealingAll: function isRevealingAll() {
					return QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'revealAll');
			},
			render: function render() {
					var SolutionComponent, feedbacks, questionAnswered, questionSubmitted, responseType, revealAll, score, shuffledIds, solution;
					responseType = this.props.model.modelState.responseType;
					shuffledIds = QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'shuffledIds');
					if (!shuffledIds) {
							shuffledIds = _.shuffle(this.props.model.children.models).map(function (model) {
									return model.get('id');
							});
							QuestionUtil.setData(this.props.model.get('id'), 'shuffledIds', shuffledIds);
					}
					revealAll = this.isRevealingAll();
					score = this.getScore();
					questionSubmitted = score !== null;
					questionAnswered = this.getResponseData().responses.size >= 1;
					feedbacks = Array.from(this.getResponseData().responses).filter(function (mcChoiceId) {
							return OboModel.models[mcChoiceId].children.length > 1;
					}.bind(this)).sort(function (id1, id2) {
							return shuffledIds.indexOf(id1) - shuffledIds.indexOf(id2);
					}.bind(this)).map(function (mcChoiceId) {
							return OboModel.models[mcChoiceId].children.at(1);
					}.bind(this));
					solution = this.props.model.parent.modelState.solution;
					if (solution != null) {
							SolutionComponent = solution.getComponentClass();
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
											moduleData: this.props.moduleData,
											responseType: responseType,
											revealAll: revealAll,
											questionSubmitted: questionSubmitted,
											label: String.fromCharCode(index + 65)

									});
							}.bind(this)),
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
																			moduleData: this.props.moduleData,
																			responseType: responseType,
																			revealAll: revealAll,
																			questionSubmitted: questionSubmitted,
																			label: String.fromCharCode(shuffledIds.indexOf(model.parent.get('id')) + 65)
																	});
															}.bind(this))
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

	module.exports = MCAssessment;

/***/ },

/***/ 125:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	__webpack_require__(37);

	__webpack_require__(34);

	__webpack_require__(39);

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.MCAssessment', {
	  type: 'chunk',
	  adapter: __webpack_require__(123),
	  componentClass: __webpack_require__(124),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 207:
47

/******/ })));