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

	__webpack_require__(38);

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

/***/ 38:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });