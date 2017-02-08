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

	module.exports = __webpack_require__(109);


/***/ },

/***/ 107:
/***/ function(module, exports) {

	"use strict";

	var Adapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref, ref1, ref2, ref3;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.choose : void 0 : void 0) != null) {
	      model.modelState.choose = attrs.content.choose;
	    } else {
	      model.modelState.choose = 2e308;
	    }
	    if ((attrs != null ? (ref1 = attrs.content) != null ? ref1.groupSize : void 0 : void 0) != null) {
	      model.modelState.groupSize = attrs.content.groupSize;
	    } else {
	      model.modelState.groupSize = 1;
	    }
	    if ((attrs != null ? (ref2 = attrs.content) != null ? ref2.select : void 0 : void 0) != null) {
	      model.modelState.select = attrs.content.select;
	    } else {
	      model.modelState.select = "sequential";
	    }
	    if ((attrs != null ? (ref3 = attrs.content) != null ? ref3.shuffleGroup : void 0 : void 0) != null) {
	      return model.modelState.shuffleGroup = attrs.content.shuffleGroup;
	    } else {
	      return model.modelState.shuffleGroup = false;
	    }
	  },
	  clone: function clone(model, _clone) {
	    _clone.modelState.choose = model.modelState.choose;
	    _clone.modelState.groupSize = model.modelState.groupSize;
	    _clone.modelState.select = model.modelState.select;
	    return _clone.modelState.resetWhenEmpty = model.modelState.resetWhenEmpty;
	  },
	  toJSON: function toJSON(model, json) {
	    json.content.choose = model.modelState.choose;
	    json.content.groupSize = model.modelState.groupSize;
	    json.content.select = model.modelState.select;
	    return json.content.resetWhenEmpty = model.modelState.resetWhenEmpty;
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 108:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AssessmentUtil, Common, Dispatcher, OboComponent, OboModel, QuestionBank;

	__webpack_require__(184);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Dispatcher = Common.flux.Dispatcher;

	OboModel = Common.models.OboModel;

	AssessmentUtil = window.Viewer.util.AssessmentUtil;

	QuestionBank = React.createClass({
	  displayName: 'QuestionBank',

	  componentWillMount: function componentWillMount() {
	    var assessment, questions, selectionHistory;
	    assessment = AssessmentUtil.getAssessmentForModel(this.props.moduleData.assessmentState, this.props.model);
	    if (assessment) {
	      if (typeof assessment.current.data[this.props.model.get('id')] === 'undefined') {
	        selectionHistory = AssessmentUtil.getDataForAssessment(this.props.moduleData.assessmentState, this.props.model, 'questions');
	        if (typeof selectionHistory === 'undefined' || selectionHistory.length === 0) {
	          questions = this.props.model.children.models.map(function (child) {
	            return child.get('id');
	          });
	          AssessmentUtil.registerDataForAssessment(this.props.model, 'questions', questions);
	        }
	        return AssessmentUtil.registerDataForCurrentAttempt(this.props.model, this.props.model.get('id'), this.chooseChildren());
	      }
	    }
	  },
	  chooseChildren: function chooseChildren() {
	    var chosen, i, j, mode, n, numChildrenToPick, questions, randomSetIndex, ref, ref1;
	    questions = Array.from(AssessmentUtil.getDataForAssessment(this.props.moduleData.assessmentState, this.props.model, 'questions'));
	    chosen = [];
	    n = this.props.model.modelState.choose;
	    mode = this.props.model.modelState.select;
	    switch (mode) {
	      case 'random':
	        numChildrenToPick = Math.min(n, questions.length);
	        while (numChildrenToPick) {
	          chosen.push(questions.splice(Math.floor(Math.random() * questions.length), 1)[0]);
	          numChildrenToPick--;
	        }
	        break;
	      case 'random-group-with-sequential-children':
	      case 'random-group-with-shuffled-children':
	        randomSetIndex = Math.floor(Math.random() * Math.ceil(questions.length / n)) * n;
	        for (i = j = ref = randomSetIndex, ref1 = randomSetIndex + n; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
	          if (questions[randomSetIndex] != null) {
	            chosen.push(questions.splice(randomSetIndex, 1));
	          }
	        }
	        if (mode === 'random-group-with-shuffled-children') {
	          chosen = _.shuffle(chosen);
	        }
	        break;
	      case 'sequential':
	        chosen = questions.splice(0, n);
	    }
	    if (mode === 'sequential') {
	      AssessmentUtil.registerDataForAssessment(this.props.model, 'questions', questions);
	    }
	    return chosen;
	  },
	  getChosenChildrenModels: function getChosenChildrenModels() {
	    var chosen, id, ids, j, len;
	    ids = AssessmentUtil.getDataForCurrentAttempt(this.props.moduleData.assessmentState, this.props.model, this.props.model.get('id'));
	    if (!ids) {
	      return [];
	    }
	    chosen = [];
	    for (j = 0, len = ids.length; j < len; j++) {
	      id = ids[j];
	      chosen.push(OboModel.models[id]);
	    }
	    return chosen;
	  },
	  render: function render() {
	    console.log('QB RENDER', this.props);
	    return React.createElement(
	      OboComponent,
	      {
	        model: this.props.model,
	        className: 'obojobo-draft--chunks--question-bank'
	      },
	      this.getChosenChildrenModels().map(function (child, index) {
	        var Component = child.getComponentClass();

	        return React.createElement(Component, { key: index, model: child, moduleData: this.props.moduleData });
	      }.bind(this))
	    );
	  }
	});

	module.exports = QuestionBank;

/***/ },

/***/ 109:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.QuestionBank', {
	  type: 'chunk',
	  adapter: __webpack_require__(107),
	  componentClass: __webpack_require__(108),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 184:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });