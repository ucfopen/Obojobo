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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(186);


/***/ },

/***/ 182:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Adapter, Common, ScoreActions;

	ScoreActions = __webpack_require__(184);

	Common = window.ObojoboDraft.Common;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref, ref1;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.attempts : void 0 : void 0) != null) {
	      if (attrs.content.attempts === 'unlimited') {
	        model.modelState.attempts = 2e308;
	      } else {
	        model.modelState.attempts = parseInt(attrs.content.attempts, 10);
	      }
	    } else {
	      model.modelState.attempts = 2e308;
	    }
	    if ((attrs != null ? (ref1 = attrs.content) != null ? ref1.scoreActions : void 0 : void 0) != null) {
	      return model.modelState.scoreActions = new ScoreActions(attrs.content.scoreActions);
	    } else {
	      return model.modelState.scoreActions = new ScoreActions();
	    }
	  },
	  clone: function clone(model, _clone) {
	    _clone.modelState.attempts = model.modelState.attempts;
	    _clone.modelState.hideNav = model.modelState.hideNav;
	    return _clone.modelState.scoreActions = model.modelState.scoreActions.clone();
	  },
	  toJSON: function toJSON(model, json) {
	    json.content.attempts = model.modelState.attempts;
	    json.content.hideNav = model.modelState.hideNav;
	    return json.content.scoreActions = model.modelState.scoreActions.toObject();
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 183:
/***/ function(module, exports) {

	'use strict';

	var Dialog, ModalUtil;

	Dialog = window.ObojoboDraft.Common.components.modal.Dialog;

	ModalUtil = window.ObojoboDraft.Common.util.ModalUtil;

	module.exports = React.createClass({
		displayName: 'exports',

		onCancel: function onCancel() {
			return ModalUtil.hide();
		},
		onSubmit: function onSubmit() {
			ModalUtil.hide();
			return this.props.onSubmit();
		},
		render: function render() {
			return React.createElement(
				Dialog,
				{ width: '32rem', buttons: [{
						value: 'Submit as incomplete',
						altAction: true,
						dangerous: true,
						onClick: this.onSubmit
					}, 'or', {
						value: 'Resume assessment',
						onClick: this.onCancel,
						default: true
					}] },
				React.createElement(
					'b',
					null,
					'Wait! You left some questions blank.'
				),
				React.createElement('br', null),
				'Finish answering all questions and submit again.'
			);
		}
	});

/***/ },

/***/ 184:
/***/ function(module, exports) {

	"use strict";

	var ScoreActions;

	ScoreActions = function () {
	  function ScoreActions(_actions) {
	    this._actions = _actions != null ? _actions : [];
	  }

	  ScoreActions.prototype.getActionForScore = function (score) {
	    var action, i, len, ref;
	    ref = this._actions;
	    for (i = 0, len = ref.length; i < len; i++) {
	      action = ref[i];
	      if (score >= action.from && score <= action.to) {
	        return action;
	      }
	    }
	    return null;
	  };

	  ScoreActions.prototype.toObject = function () {
	    return Object.assign([], this._actions);
	  };

	  ScoreActions.prototype.clone = function () {
	    return new ScoreActions(this.toObject());
	  };

	  return ScoreActions;
	}();

	module.exports = ScoreActions;

/***/ },

/***/ 185:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AssessmentUtil, AttemptIncompleteDialog, Button, Common, Dispatcher, ModalUtil, NavUtil, OboComponent, OboModel, ScoreStore;

	__webpack_require__(232);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	OboModel = Common.models.OboModel;

	Button = Common.components.Button;

	Dispatcher = Common.flux.Dispatcher;

	ModalUtil = Common.util.ModalUtil;

	ScoreStore = window.Viewer.stores.ScoreStore;

	AssessmentUtil = window.Viewer.util.AssessmentUtil;

	NavUtil = window.Viewer.util.NavUtil;

	AttemptIncompleteDialog = __webpack_require__(183);

	module.exports = React.createClass({
	  displayName: 'exports',

	  getInitialState: function getInitialState() {
	    return {
	      step: null
	    };
	  },
	  getCurrentStep: function getCurrentStep() {
	    var assessment;
	    assessment = AssessmentUtil.getAssessmentForModel(this.props.moduleData.assessmentState, this.props.model);
	    if (assessment === null) {
	      return 'untested';
	    }
	    if (assessment.current !== null) {
	      return 'takingTest';
	    }
	    if (assessment.attempts.length > 0) {
	      return 'scoreSubmitted';
	    }
	    return 'untested';
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var curStep;
	    curStep = this.getCurrentStep();
	    if (curStep !== this.state.step) {
	      this.needsScroll = true;
	    }
	    return this.setState({
	      step: curStep
	    });
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    if (this.needsScroll) {
	      delete this.needsScroll;
	      return Dispatcher.trigger('viewer:scrollToTop');
	    }
	  },
	  isAttemptComplete: function isAttemptComplete() {
	    return AssessmentUtil.isCurrentAttemptComplete(this.props.moduleData.assessmentState, this.props.moduleData.questionState, this.props.model);
	  },
	  onClickSubmit: function onClickSubmit() {
	    if (!this.isAttemptComplete()) {
	      ModalUtil.show(React.createElement(AttemptIncompleteDialog, { onSubmit: this.endAttempt }));
	      return;
	    }
	    return this.endAttempt();
	  },
	  endAttempt: function endAttempt() {
	    return AssessmentUtil.endAttempt(this.props.model);
	  },
	  exitAssessment: function exitAssessment() {
	    var scoreAction;
	    scoreAction = this.getScoreAction();
	    switch (scoreAction.action.value) {
	      case '_next':
	        return NavUtil.goNext();
	      case '_prev':
	        return NavUtil.goPrev();
	      default:
	        return NavUtil.goto(scoreAction.action.value);
	    }
	  },
	  getScoreAction: function getScoreAction() {
	    var highestScore, scoreAction;
	    highestScore = AssessmentUtil.getHighestAttemptScoreForModel(this.props.moduleData.assessmentState, this.props.model);
	    scoreAction = this.props.model.modelState.scoreActions.getActionForScore(highestScore);
	    if (scoreAction) {
	      return scoreAction;
	    }
	    return {
	      from: 0,
	      to: 100,
	      message: "",
	      action: {
	        type: "unlock",
	        value: "_next"
	      }
	    };
	  },
	  render: function render() {
	    var Component, PageComponent, child, childEl, highestScore, numCorrect, pageModel, questionScores, recentScore, scoreAction;
	    recentScore = AssessmentUtil.getLastAttemptScoreForModel(this.props.moduleData.assessmentState, this.props.model);
	    highestScore = AssessmentUtil.getHighestAttemptScoreForModel(this.props.moduleData.assessmentState, this.props.model);
	    childEl = function () {
	      switch (this.getCurrentStep()) {
	        case 'untested':
	          child = this.props.model.children.at(0);
	          Component = child.getComponentClass();
	          return React.createElement(
	            'div',
	            { className: 'untested' },
	            React.createElement(Component, { model: child, moduleData: this.props.moduleData })
	          );
	        case 'takingTest':
	          child = this.props.model.children.at(1);
	          Component = child.getComponentClass();
	          return React.createElement(
	            'div',
	            { className: 'test' },
	            React.createElement(Component, { className: 'untested', model: child, moduleData: this.props.moduleData, showScore: recentScore !== null }),
	            React.createElement(
	              'div',
	              { className: 'submit-button' },
	              React.createElement(Button, { onClick: this.onClickSubmit, value: this.isAttemptComplete() ? 'Submit' : 'Submit (Not all questions have been answered)' })
	            )
	          );
	        case 'scoreSubmitted':
	          scoreAction = this.getScoreAction();
	          questionScores = AssessmentUtil.getLastAttemptScoresForModel(this.props.moduleData.assessmentState, this.props.model);
	          numCorrect = questionScores.reduce(function (acc, questionScore) {
	            var n;
	            n = 0;
	            if (parseInt(questionScore.score, 10) === 100) {
	              n = 1;
	            }
	            return parseInt(acc, 10) + n;
	          }, [0]);
	          if (scoreAction.page != null) {
	            pageModel = OboModel.create(scoreAction.page);
	            pageModel.parent = this.props.model;
	            PageComponent = pageModel.getComponentClass();
	            childEl = React.createElement(PageComponent, { model: pageModel, moduleData: this.props.moduleData });
	          } else {
	            childEl = React.createElement(
	              'p',
	              null,
	              scoreAction.message
	            );
	          }
	          return React.createElement(
	            'div',
	            { className: 'score unlock' },
	            React.createElement(
	              'h1',
	              null,
	              'Your score is ' + Math.round(recentScore) + '%'
	            ),
	            recentScore === highestScore ? React.createElement(
	              'h2',
	              null,
	              'This is your highest score'
	            ) : React.createElement(
	              'h2',
	              null,
	              'Your highest score was ' + Math.round(highestScore) + '%'
	            ),
	            childEl,
	            React.createElement(
	              'div',
	              { className: 'review' },
	              React.createElement(
	                'p',
	                { className: 'number-correct' },
	                'You got ' + numCorrect + ' out of ' + questionScores.length + ' questions correct:'
	              ),
	              questionScores.map(function (questionScore, index) {
	                var questionModel = OboModel.models[questionScore.id];
	                var QuestionComponent = questionModel.getComponentClass();

	                return React.createElement(
	                  'div',
	                  { key: index, className: questionScore.score === 100 ? 'is-correct' : 'is-not-correct' },
	                  React.createElement(
	                    'p',
	                    null,
	                    'Question ' + (index + 1) + ' - ' + (questionScore.score === 100 ? 'Correct:' : 'Incorrect:')
	                  ),
	                  React.createElement(QuestionComponent, { model: questionModel, moduleData: this.props.moduleData, showContentOnly: true })
	                );
	              }.bind(this))
	            )
	          );
	      }
	    }.call(this);
	    return React.createElement(
	      OboComponent,
	      {
	        model: this.props.model,
	        moduleData: this.props.moduleData,
	        className: 'obojobo-draft--sections--assessment'
	      },
	      childEl
	    );
	  }
	});

/***/ },

/***/ 186:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AssessmentUtil, ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	AssessmentUtil = window.Viewer.util.AssessmentUtil;

	OBO.register('ObojoboDraft.Sections.Assessment', {
	  type: 'section',
	  adapter: __webpack_require__(182),
	  componentClass: __webpack_require__(185),
	  selectionHandler: null,
	  getNavItem: function getNavItem(model) {
	    var title;
	    title = model.title || 'Assessment';
	    return {
	      type: 'link',
	      label: title,
	      path: [title.toLowerCase().replace(/ /g, '-')],
	      showChildren: false,
	      showChildrenOnNavigation: false
	    };
	  },
	  variables: {
	    'assessment:attemptsRemaining': function assessmentAttemptsRemaining(textModel, viewerProps) {
	      var assessmentModel;
	      assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment');
	      if (assessmentModel.modelState.attempts === 2e308) {
	        return 'unlimited';
	      }
	      return assessmentModel.modelState.attempts - AssessmentUtil.getNumberOfAttemptsCompletedForModel(viewerProps.assessmentState, textModel);
	    },
	    'assessment:attemptsAmount': function assessmentAttemptsAmount(textModel, viewerProps) {
	      var assessmentModel;
	      assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment');
	      if (assessmentModel.modelState.attempts === 2e308) {
	        return 'unlimited';
	      }
	      return assessmentModel.modelState.attempts;
	    }
	  }
	});

/***/ },

/***/ 232:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });