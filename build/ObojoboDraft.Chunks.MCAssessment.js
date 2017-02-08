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

	module.exports = __webpack_require__(100);


/***/ },

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, MCAnswer, OboComponent;

	__webpack_require__(36);

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
	      return model.modelState.score = attrs.content.score;
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

	var Common, MCChoice, OboComponent, OboModel;

	__webpack_require__(37);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	OboModel = Common.models.OboModel;

	MCChoice = React.createClass({
	  displayName: 'MCChoice',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      isSelected: false,
	      showFeedback: false,
	      type: 'practice',
	      onChange: function onChange() {}
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
	  onChange: function onChange(event) {
	    return this.props.onChange(this.props.model, event.target.checked);
	  },
	  onClick: function onClick(event) {
	    if (!this.props.isSelected) {
	      return this.props.onChange(this.props.model, true);
	    }
	  },
	  getInputType: function getInputType() {
	    switch (this.props.model.parent.modelState.responseType) {
	      case 'pick-all':
	        return 'checkbox';
	      default:
	        return 'radio';
	    }
	  },
	  render: function render() {
	    return React.createElement(
	      OboComponent,
	      {
	        model: this.props.model,
	        onClick: this.onClick,
	        className: 'obojobo-draft--chunks--mc-assessment--mc-choice' + (this.props.isSelected ? ' is-selected' : ' is-not-selected') + (this.props.model.modelState.score === 100 ? ' is-correct' : ' is-incorrect')
	      },
	      React.createElement('input', {
	        type: this.getInputType(),
	        value: this.props.model.get('id'),
	        checked: this.props.isSelected,
	        name: this.props.model.parent.get('id'),
	        onChange: this.onChange
	      }),
	      React.createElement(
	        'div',
	        { className: 'children' },
	        this.state.children.map(function (child, index) {
	          var type = child.get('type');
	          var isAnswerItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCAnswer';
	          var isFeedbackItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback';

	          if (!isAnswerItem && !isFeedbackItem) {
	            return null;
	          }

	          if (isFeedbackItem && !this.props.showFeedback) {
	            return null;
	          }

	          var Component = child.getComponentClass();

	          return React.createElement(Component, { key: child.get('id'), model: child });
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

	__webpack_require__(38);

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

/***/ 36:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 37:
36,

/***/ 38:
36,

/***/ 98:
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

/***/ 99:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Button, Common, Dispatcher, MCAssessment, OboComponent, OboModel, QuestionUtil;

	__webpack_require__(181);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Button = Common.components.Button;

	OboModel = Common.models.OboModel;

	Dispatcher = Common.flux.Dispatcher;

	QuestionUtil = window.Viewer.util.QuestionUtil;

	MCAssessment = React.createClass({
	  displayName: 'MCAssessment',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      score: null,
	      type: 'practice'
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      shuffledAnswers: this.getShuffledAnswers(),
	      __responses: new Set(),
	      __showAllFeedback: false
	    };
	  },
	  getResponse: function getResponse() {
	    var response;
	    response = QuestionUtil.getResponse(this.props.moduleData.questionState, this.props.model);
	    if (!response) {
	      response = this.createNewResponseObject();
	    }
	    return response;
	  },
	  setResponse: function setResponse(response) {
	    return QuestionUtil.setResponse(this.props.model.get('id'), response);
	  },
	  createNewResponseObject: function createNewResponseObject() {
	    return {
	      answers: {},
	      revealAll: false
	    };
	  },
	  getShuffledAnswers: function getShuffledAnswers() {
	    var children, i, len, model, ref;
	    children = [];
	    ref = this.props.model.children.models;
	    for (i = 0, len = ref.length; i < len; i++) {
	      model = ref[i];
	      children.push(model);
	    }
	    return _.shuffle(children);
	  },
	  onAnswerChoiceChange: function onAnswerChoiceChange(model, checked) {
	    var response, submitAfter;
	    submitAfter = false;
	    response = this.getResponse();
	    if (this.props.model.modelState.responseType !== 'pick-all') {
	      response = this.createNewResponseObject();
	    }
	    if (checked) {
	      response.answers[model.get('id')] = model.get('id');
	    } else {
	      delete response.answers[model.get('id')];
	    }
	    return this.setResponse(response);
	  },
	  getSelectedAnswerItemSet: function getSelectedAnswerItemSet() {
	    var r;
	    r = this.getResponse();
	    console.log(r);
	    return new Set(Object.keys(this.getResponse().answers).map(function (answerId) {
	      return OboModel.models[answerId];
	    }));
	  },
	  calculateScore: function calculateScore() {
	    var i, isCorrectAnswer, isIncorrectAnswer, j, len, len1, mcChoice, mcChoiceSelected, ref, ref1, responses;
	    responses = this.getSelectedAnswerItemSet();
	    if (this.props.model.modelState.responseType === 'pick-all') {
	      ref = this.state.shuffledAnswers;
	      for (i = 0, len = ref.length; i < len; i++) {
	        mcChoice = ref[i];
	        mcChoiceSelected = responses.has(mcChoice);
	        isCorrectAnswer = mcChoice.modelState.score === 100;
	        isIncorrectAnswer = mcChoice.modelState.score === 0;
	        console.log('calc', mcChoiceSelected, mcChoice.modelState.score);
	        if (isCorrectAnswer && !mcChoiceSelected || isIncorrectAnswer && mcChoiceSelected) {
	          return 0;
	        }
	      }
	      return 100;
	    } else {
	      ref1 = this.state.shuffledAnswers;
	      for (j = 0, len1 = ref1.length; j < len1; j++) {
	        mcChoice = ref1[j];
	        mcChoiceSelected = responses.has(mcChoice);
	        isCorrectAnswer = mcChoice.modelState.score === 100;
	        isIncorrectAnswer = mcChoice.modelState.score === 0;
	        if (mcChoiceSelected) {
	          if (isCorrectAnswer) {
	            return 100;
	          }
	          return 0;
	        }
	      }
	    }
	    return 0;
	  },
	  onClickSubmit: function onClickSubmit(event) {
	    var response;
	    event.preventDefault();
	    response = this.getResponse();
	    response.revealAll = true;
	    return this.setResponse(response);
	  },
	  onClickRevealAll: function onClickRevealAll(event) {
	    var response;
	    event.preventDefault();
	    response = this.getResponse();
	    response.revealAll = true;
	    return this.setResponse(response);
	  },
	  onClickReset: function onClickReset(event) {
	    event.preventDefault();
	    return this.reset();
	  },
	  reset: function reset() {
	    return QuestionUtil.resetResponse(this.props.model.get('id'));
	  },
	  render: function render() {
	    var instructions, responseType, responses;
	    responseType = this.props.model.modelState.responseType;
	    responses = this.getSelectedAnswerItemSet();
	    console.log('MCAssessment responses', responses);
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
	    return React.createElement(
	      OboComponent,
	      {
	        model: this.props.model,
	        tag: 'form',
	        className: 'obojobo-draft--chunks--mc-assessment' + (' is-response-type-' + this.props.model.modelState.responseType) + (this.state.showAllFeedback ? ' is-showing-all-feedback' : ' is-not-showing-all-feedback') + (this.props.score === null ? ' is-unscored' : ' is-scored')
	      },
	      React.createElement(
	        'span',
	        { className: 'instructions pad' },
	        instructions,
	        ':'
	      ),
	      this.state.shuffledAnswers.map(function (child, index) {
	        if (child.get('type') !== 'ObojoboDraft.Chunks.MCAssessment.MCChoice') {
	          return null;
	        }

	        var isSelected = responses.has(child);
	        var Component = child.getComponentClass();
	        return React.createElement(Component, {
	          key: child.get('id'),
	          model: child,
	          isSelected: isSelected,
	          showFeedback: this.props.type === 'practice' && (this.state.showAllFeedback || isSelected && responseType !== 'pick-all'),
	          type: this.props.type,
	          onChange: this.onAnswerChoiceChange
	        });
	      }.bind(this)),
	      this.props.type === 'practice' ? React.createElement(
	        'div',
	        { className: 'submit' },
	        responseType === 'pick-all' ? React.createElement(Button, {
	          onClick: this.onClickSubmit,
	          disabled: this.state.showAllFeedback,
	          value: 'Check Your Answers'
	        }) : React.createElement(Button, {
	          onClick: this.onClickRevealAll,
	          disabled: this.state.showAllFeedback,
	          value: 'Reveal All Answers'
	        }),
	        React.createElement(
	          'span',
	          { className: 'divider' },
	          ' - '
	        ),
	        React.createElement(Button, {
	          onClick: this.onClickReset,
	          value: 'Reset'
	        })
	      ) : React.createElement('div', { className: 'submit' })
	    );
	  }
	});

	module.exports = MCAssessment;

/***/ },

/***/ 100:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	__webpack_require__(28);

	__webpack_require__(25);

	__webpack_require__(30);

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.MCAssessment', {
	  type: 'chunk',
	  adapter: __webpack_require__(98),
	  componentClass: __webpack_require__(99),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 181:
36

/******/ })));