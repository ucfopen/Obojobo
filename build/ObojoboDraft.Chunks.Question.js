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

	module.exports = __webpack_require__(111);


/***/ },

/***/ 109:
/***/ function(module, exports) {

	"use strict";

	var Adapter, OboModel;

	OboModel = window.ObojoboDraft.Common.models.OboModel;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref, ref1, ref2, ref3;
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
	    if ((attrs != null ? (ref2 = attrs.content) != null ? ref2.practice : void 0 : void 0) != null) {
	      model.modelState.practice = attrs.content.practice;
	    } else {
	      model.modelState.practice = true;
	    }
	    if ((attrs != null ? (ref3 = attrs.content) != null ? ref3.solution : void 0 : void 0) != null) {
	      return model.modelState.solution = OboModel.create(attrs.content.solution);
	    } else {
	      return model.modelState.solution = null;
	    }
	  },
	  clone: function clone(model, _clone) {
	    _clone.modelState.shuffle = model.modelState.shuffle;
	    _clone.modelState.type = model.modelState.type;
	    return _clone.modelState.solution = model.modelState.solution.clone();
	  },
	  toJSON: function toJSON(model, json) {
	    json.content.shuffle = model.modelState.shuffle;
	    json.content.type = model.modelState.type;
	    return json.content.solution = model.modelState.solution.toJSON();
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 110:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Button, Common, Dispatcher, FocusUtil, OboComponent, Question, QuestionUtil, ReactCSSTransitionGroup, ScoreUtil;

	__webpack_require__(187);

	ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Dispatcher = Common.flux.Dispatcher;

	FocusUtil = Common.util.FocusUtil;

	Button = Common.components.Button;

	ScoreUtil = window.Viewer.util.ScoreUtil;

	QuestionUtil = window.Viewer.util.QuestionUtil;

	Question = React.createClass({
		displayName: 'Question',

		onClickBlocker: function onClickBlocker() {
			QuestionUtil.viewQuestion(this.props.model.get('id'));
			if (this.props.model.modelState.practice) {
				return FocusUtil.focusComponent(this.props.model.get('id'));
			}
		},
		render: function render() {
			var score, viewState;
			score = ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model);
			viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model);
			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'flip-container obojobo-draft--chunks--question' + (score === null ? '' : score === 100 ? ' is-correct' : ' is-incorrect') + ' is-' + viewState + (this.props.model.modelState.practice ? ' is-practice' : ' is-not-practice')
				},
				React.createElement(
					'div',
					{ className: 'flipper' },
					React.createElement(
						'div',
						{ className: 'content back' },
						this.props.model.children.models.map(function (child, index) {
							var Component = child.getComponentClass();
							return React.createElement(Component, {
								key: child.get('id'),
								model: child,
								moduleData: this.props.moduleData
							});
						}.bind(this))
					),
					React.createElement(
						'div',
						{ className: 'blocker front', key: 'blocker', onClick: this.onClickBlocker },
						React.createElement(Button, { value: 'Try question' })
					)
				)
			);
		}
	});

	module.exports = Question;

/***/ },

/***/ 111:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.Question', {
	  type: 'chunk',
	  adapter: __webpack_require__(109),
	  componentClass: __webpack_require__(110),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler(),
	  getNavItem: function getNavItem(model) {
	    return {
	      type: 'sub-link',
	      label: '[Q] ' + model.children.at(0).modelState.textGroup.first.text.value
	    };
	  },
	  generateNav: function generateNav(model) {
	    return [{
	      type: 'sub-link',
	      label: 'Question',
	      id: model.get('id')
	    }];
	  }
	});

/***/ },

/***/ 187:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });