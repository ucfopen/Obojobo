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

	module.exports = __webpack_require__(101);


/***/ },

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, MCAnswer, OboComponent;

	__webpack_require__(37);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	MCAnswer = React.createClass({
		displayName: 'MCAnswer',

		render: function render() {
			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					className: 'obojobo-draft--chunks--mc-assessment--mc-answer'
				},
				this.props.model.children.models.map(function (child, index) {
					var Component = child.getComponentClass();
					return React.createElement(Component, { key: child.get('id'), model: child });
				})
			);
		}
	});

	module.exports = MCAnswer;

/***/ },

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.MCAssessment.MCAnswer', {
	  type: 'chunk',
	  adapter: null,
	  componentClass: __webpack_require__(24),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 26:
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

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, MCChoice, OboComponent, OboModel, QuestionUtil;

	__webpack_require__(38);

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
	  getInitialState: function getInitialState() {
	    return {
	      children: this.createChildren(this.props.model.children.models)
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.model != null) {
	      return this.setState({
	        children: this.createChildren(this.props.model.children.models)
	      });
	    }
	  },
	  createChildren: function createChildren(models) {
	    var children, hasFeedback, i, len, model;
	    children = [];
	    hasFeedback = false;
	    for (i = 0, len = models.length; i < len; i++) {
	      model = models[i];
	      children.push(model);
	      if (model.get('type') === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback') {
	        hasFeedback = true;
	      }
	    }
	    if (!hasFeedback) {
	      if (this.props.model.modelState.score === 100) {
	        children.push(this.createFeedbackItem('Correct!'));
	      } else {
	        children.push(this.createFeedbackItem('Incorrect'));
	      }
	    }
	    return children;
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
	    var isSelected;
	    isSelected = QuestionUtil.getResponse(this.props.moduleData.questionState, this.props.model) === true;
	    return React.createElement(
	      OboComponent,
	      {
	        model: this.props.model,
	        className: 'obojobo-draft--chunks--mc-assessment--mc-choice' + (isSelected ? ' is-selected' : ' is-not-selected') + (this.props.model.modelState.score === 100 ? ' is-correct' : ' is-incorrect')
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
	        this.state.children.map(function (child, index) {
	          var type = child.get('type');
	          var isAnswerItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCAnswer';
	          var isFeedbackItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback';

	          //console.log('TEST', child.get('id'), child.get('type'), '==>', isAnswerItem, '||(', isFeedbackItem, '&&', this.props.revealAll, '))')

	          if (isAnswerItem || isFeedbackItem && this.props.questionSubmitted && isSelected || isFeedbackItem && this.props.revealAll) {
	            var Component = child.getComponentClass();
	            return React.createElement(Component, { key: child.get('id'), model: child });
	          }
	        }.bind(this))
	      )
	    );
	  }
	});

	module.exports = MCChoice;

/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.MCAssessment.MCChoice', {
	  type: 'chunk',
	  adapter: __webpack_require__(26),
	  componentClass: __webpack_require__(27),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 29:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, MCFeedback, OboComponent;

	__webpack_require__(39);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	MCFeedback = React.createClass({
		displayName: 'MCFeedback',

		render: function render() {
			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					className: 'obojobo-draft--chunks--mc-assessment--mc-feedback'
				},
				this.props.model.children.models.map(function (child, index) {
					var Component = child.getComponentClass();
					return React.createElement(Component, { key: child.get('id'), model: child });
				})
			);
		}
	});

	module.exports = MCFeedback;

/***/ },

/***/ 30:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.MCAssessment.MCFeedback', {
	  type: 'chunk',
	  adapter: null,
	  componentClass: __webpack_require__(29),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 37:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 38:
37,

/***/ 39:
37,

/***/ 99:
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

/***/ 100:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Button, Common, DOMUtil, Dispatcher, MCAssessment, OboComponent, OboModel, QuestionUtil, ScoreUtil;

	__webpack_require__(182);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Button = Common.components.Button;

	OboModel = Common.models.OboModel;

	Dispatcher = Common.flux.Dispatcher;

	DOMUtil = Common.page.DOMUtil;

	QuestionUtil = window.Viewer.util.QuestionUtil;

	ScoreUtil = window.Viewer.util.ScoreUtil;

	MCAssessment = React.createClass({
	  displayName: 'MCAssessment',

	  componentWillMount: function componentWillMount() {
	    var shuffledIds;
	    shuffledIds = QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'shuffledIds');
	    if (!shuffledIds) {
	      shuffledIds = _.shuffle(this.props.model.children.models).map(function (model) {
	        return model.get('id');
	      });
	      return QuestionUtil.setData(this.props.model.get('id'), 'shuffledIds', shuffledIds);
	    }
	  },
	  getResponseData: function getResponseData() {
	    var child, correct, i, len, ref, responses;
	    correct = new Set();
	    responses = new Set();
	    ref = this.props.model.children.models;
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      if (child.modelState.score === 100) {
	        correct.add(child.get('id'));
	      }
	      if (QuestionUtil.getResponse(this.props.moduleData.questionState, child)) {
	        responses.add(child.get('id'));
	      }
	    }
	    return {
	      correct: correct,
	      responses: responses
	    };
	  },
	  calculateScore: function calculateScore() {
	    var correct, i, id, len, ref, responseData, responses;
	    responseData = this.getResponseData();
	    correct = responseData.correct;
	    responses = responseData.responses;
	    switch (this.props.model.modelState.responseType) {
	      case 'pick-all':
	        if (correct.size !== responses.size) {
	          return 0;
	        }
	        correct.forEach(function (id) {
	          if (!responses.has(id)) {
	            return 0;
	          }
	        });
	        return 100;
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
	    return ScoreUtil.setScore(this.props.model.get('id'), this.calculateScore());
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
	    var child, i, len, ref;
	    ref = this.props.model.children.models;
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      QuestionUtil.resetResponse(child.get('id'));
	    }
	    QuestionUtil.clearData(this.props.model.get('id'), 'revealAll');
	    return ScoreUtil.clearScore(this.props.model.get('id'));
	  },
	  onClick: function onClick(event) {
	    var child, i, len, mcChoiceEl, mcChoiceId, ref;
	    mcChoiceEl = DOMUtil.findParentWithAttr(event.target, 'data-type', 'ObojoboDraft.Chunks.MCAssessment.MCChoice');
	    if (!mcChoiceEl) {
	      return;
	    }
	    mcChoiceId = mcChoiceEl.getAttribute('data-id');
	    if (!mcChoiceId) {
	      return;
	    }
	    if (this.getScore() !== null) {
	      this.reset();
	    }
	    switch (this.props.model.modelState.responseType) {
	      case 'pick-all':
	        console.log('SETTING', mcChoiceId, 'TO', !QuestionUtil.getResponse(this.props.moduleData.questionState, OboModel.models[mcChoiceId]));
	        console.log(this.props.moduleData.questionState);
	        return QuestionUtil.recordResponse(mcChoiceId, !QuestionUtil.getResponse(this.props.moduleData.questionState, OboModel.models[mcChoiceId]));
	      default:
	        ref = this.props.model.children.models;
	        for (i = 0, len = ref.length; i < len; i++) {
	          child = ref[i];
	          QuestionUtil.resetResponse(child.get('id'));
	        }
	        return QuestionUtil.recordResponse(mcChoiceId, true);
	    }
	  },
	  getScore: function getScore() {
	    return ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model);
	  },
	  render: function render() {
	    var instructions, questionAnswered, questionSubmitted, responseType, revealAll, score, shuffledIds;
	    responseType = this.props.model.modelState.responseType;
	    instructions = function () {
	      switch (responseType) {
	        case 'pick-one':
	          return 'Pick the correct answer';
	        case 'pick-one-multiple-correct':
	          return 'Pick a correct answer';
	        case 'pick-all':
	          return 'Pick all the correct answers';
	      }
	    }();
	    revealAll = QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'revealAll');
	    score = this.getScore();
	    questionSubmitted = score !== null;
	    questionAnswered = this.getResponseData().responses.size >= 1;
	    shuffledIds = QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'shuffledIds');
	    console.log('RESPSONE DATA', this.getResponseData());
	    return React.createElement(
	      OboComponent,
	      {
	        model: this.props.model,
	        onClick: this.onClick,
	        tag: 'form',
	        className: 'obojobo-draft--chunks--mc-assessment' + (' is-response-type-' + this.props.model.modelState.responseType) + (revealAll ? ' is-revealing-all' : ' is-not-revealing-all') + (score === null ? ' is-unscored' : ' is-scored')
	      },
	      React.createElement(
	        'span',
	        { className: 'instructions pad' },
	        instructions,
	        ':'
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
	          questionSubmitted: questionSubmitted

	        });
	      }.bind(this)),
	      React.createElement(
	        'div',
	        { className: 'submit' },
	        React.createElement(Button, {
	          onClick: this.onClickSubmit,
	          disabled: questionSubmitted || !questionAnswered,
	          value: 'Check Your Answer'
	        }),
	        questionSubmitted ? React.createElement(
	          'div',
	          { className: 'reveal-all-button' },
	          React.createElement(
	            'span',
	            { className: 'divider' },
	            ' - '
	          ),
	          React.createElement(Button, {
	            onClick: this.onClickRevealAll,
	            disabled: revealAll,
	            value: 'Reveal All Answers'
	          })
	        ) : null,
	        React.createElement(
	          'div',
	          { className: 'reset-button' },
	          React.createElement(Button, {
	            altAction: true,
	            onClick: this.onClickReset,
	            disabled: !questionAnswered,
	            value: 'Reset'
	          })
	        )
	      )
	    );
	  }
	});

	module.exports = MCAssessment;

/***/ },

/***/ 101:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	__webpack_require__(28);

	__webpack_require__(25);

	__webpack_require__(30);

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.MCAssessment', {
	  type: 'chunk',
	  adapter: __webpack_require__(99),
	  componentClass: __webpack_require__(100),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 182:
37

/******/ })));