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

	module.exports = __webpack_require__(106);


/***/ },

/***/ 104:
/***/ function(module, exports) {

	"use strict";

	var Adapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref, ref1, ref2;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.shuffle : void 0 : void 0) != null) {
	      model.modelState.shuffle = attrs.content.shuffle;
	    } else {
	      model.modelState.shuffle = false;
	    }
	    if ((attrs != null ? (ref1 = attrs.content) != null ? ref1.limit : void 0 : void 0) != null) {
	      model.modelState.limit = attrs.content.limit;
	    } else {
	      model.modelState.limit = 0;
	    }
	    if ((attrs != null ? (ref2 = attrs.content) != null ? ref2.type : void 0 : void 0) != null) {
	      return model.modelState.type = attrs.content.type;
	    } else {
	      return model.modelState.type = "practice";
	    }
	  },
	  clone: function clone(model, _clone) {
	    _clone.modelState.shuffle = model.modelState.shuffle;
	    return _clone.modelState.type = model.modelState.type;
	  },
	  toJSON: function toJSON(model, json) {
	    json.content.shuffle = model.modelState.shuffle;
	    return json.content.type = model.modelState.type;
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 105:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AssessmentUtil, Common, Dispatcher, OboComponent, Question, QuestionUtil, ScoreUtil;

	__webpack_require__(183);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Dispatcher = Common.flux.Dispatcher;

	AssessmentUtil = window.Viewer.util.AssessmentUtil;

	ScoreUtil = window.Viewer.util.ScoreUtil;

	QuestionUtil = window.Viewer.util.QuestionUtil;

	Question = React.createClass({
	  displayName: 'Question',

	  getInitialState: function getInitialState() {
	    var currentAttempt;
	    if (this.props.model.modelState.type === 'assessment') {
	      currentAttempt = AssessmentUtil.getCurrentAttemptForModel(this.props.moduleData.assessmentState, this.props.model);
	      console.log('currentAttempt', currentAttempt);
	      if ((currentAttempt != null ? currentAttempt.responses[this.props.model.get('id')] : void 0) == null) {
	        AssessmentUtil.registerQuestionForAttempt(this.props.model);
	      }
	    }
	    return {
	      score: null
	    };
	  },
	  setScore: function setScore(score) {
	    ScoreUtil.setScore(this.props.model.get('id'), score);
	    return this.setState({
	      score: score
	    });
	  },
	  onClickBlocker: function onClickBlocker() {
	    return QuestionUtil.viewQuestion(this.props.model.get('id'));
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.model !== this.props.model) {
	      return this.setScore(null);
	    }
	  },
	  render: function render() {
	    var score, viewState;
	    console.log('R', this.props);
	    if (this.props.model.modelState.type === 'practice') {
	      score = this.state.score;
	    } else {
	      score = null;
	    }
	    viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model);
	    return React.createElement(
	      OboComponent,
	      {
	        model: this.props.model,
	        className: 'obojobo-draft--chunks--question' + (score === null ? '' : score === 100 ? ' is-correct' : ' is-incorrect') + (' is-type-' + this.props.model.modelState.type) + ' is-' + viewState
	      },
	      this.props.model.children.models.map(function (child, index) {
	        var Component = child.getComponentClass();
	        return React.createElement(Component, {
	          key: child.get('id'),
	          model: child,
	          setScore: this.setScore,
	          score: score,
	          type: this.props.model.modelState.type,
	          moduleData: this.props.moduleData
	        });
	      }.bind(this)),
	      React.createElement(
	        'div',
	        { className: 'blocker', onClick: this.onClickBlocker },
	        React.createElement(
	          'span',
	          null,
	          'Click to view question'
	        )
	      )
	    );
	  }
	});

	module.exports = Question;

/***/ },

/***/ 106:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.Question', {
	  type: 'chunk',
	  adapter: __webpack_require__(104),
	  componentClass: __webpack_require__(105),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 183:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });