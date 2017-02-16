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

	module.exports = __webpack_require__(28);


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

/***/ 38:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });