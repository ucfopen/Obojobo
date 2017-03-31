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

	module.exports = __webpack_require__(132);


/***/ },

/***/ 129:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var QuestionContent;

	__webpack_require__(211);

	QuestionContent = React.createClass({
		displayName: 'QuestionContent',

		render: function render() {
			return React.createElement(
				'div',
				{
					className: 'obojobo-draft--chunks--mc-question--content'
				},
				this.props.model.children.models.slice(0, this.props.model.children.models.length - 1).map(function (child, index) {
					var Component = child.getComponentClass();
					return React.createElement(Component, { key: child.get('id'), model: child, moduleData: this.props.moduleData });
				}.bind(this))
			);
		}
	});

	module.exports = QuestionContent;

/***/ },

/***/ 130:
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
	    _clone.modelState.solution = null;
	    if (model.modelState.solution != null) {
	      return _clone.modelState.solution = model.modelState.solution.clone();
	    }
	  },
	  toJSON: function toJSON(model, json) {
	    json.content.shuffle = model.modelState.shuffle;
	    json.content.type = model.modelState.type;
	    json.content.solution = null;
	    if (model.modelState.solution != null) {
	      return json.content.solution = model.modelState.solution.toJSON();
	    }
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 131:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Button, Common, Dispatcher, FocusUtil, OboComponent, Question, QuestionContent, QuestionUtil, ReactCSSTransitionGroup, ScoreUtil;

	__webpack_require__(212);

	ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Dispatcher = Common.flux.Dispatcher;

	FocusUtil = Common.util.FocusUtil;

	Button = Common.components.Button;

	ScoreUtil = window.Viewer.util.ScoreUtil;

	QuestionUtil = window.Viewer.util.QuestionUtil;

	QuestionContent = __webpack_require__(129);

	Question = React.createClass({
		displayName: 'Question',

		onClickBlocker: function onClickBlocker() {
			QuestionUtil.viewQuestion(this.props.model.get('id'));
			if (this.props.model.modelState.practice) {
				return FocusUtil.focusComponent(this.props.model.get('id'));
			}
		},
		render: function render() {
			var AssessmentComponent, assessment, score, viewState;
			if (this.props.showContentOnly) {
				return this.renderContentOnly();
			}
			score = ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model);
			viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model);
			assessment = this.props.model.children.models[this.props.model.children.models.length - 1];
			AssessmentComponent = assessment.getComponentClass();
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
						React.createElement(QuestionContent, { model: this.props.model, moduleData: this.props.moduleData }),
						React.createElement(AssessmentComponent, {
							key: assessment.get('id'),
							model: assessment,
							moduleData: this.props.moduleData
						})
					),
					React.createElement(
						'div',
						{ className: 'blocker front', key: 'blocker', onClick: this.onClickBlocker },
						React.createElement(Button, { value: this.props.model.modelState.practice ? 'Try Question' : 'View Question' })
					)
				)
			);
		},
		renderContentOnly: function renderContentOnly() {
			var score, viewState;
			score = ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model);
			viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model);
			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'flip-container obojobo-draft--chunks--question' + (score === null ? '' : score === 100 ? ' is-correct' : ' is-incorrect') + ' is-active' + (this.props.model.modelState.practice ? ' is-practice' : ' is-not-practice')
				},
				React.createElement(
					'div',
					{ className: 'flipper' },
					React.createElement(
						'div',
						{ className: 'content back' },
						React.createElement(QuestionContent, { model: this.props.model, moduleData: this.props.moduleData }),
						React.createElement(
							'div',
							{ className: 'pad responses-hidden' },
							'(Responses Hidden)'
						)
					)
				)
			);
		}
	});

	module.exports = Question;

/***/ },

/***/ 132:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.Question', {
	  type: 'chunk',
	  adapter: __webpack_require__(130),
	  componentClass: __webpack_require__(131),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler(),
	  getNavItem: function getNavItem(model) {
	    var label, questions;
	    questions = model.parent.children.models.filter(function (child) {
	      return child.get('type') === 'ObojoboDraft.Chunks.Question';
	    });
	    if (model.title) {
	      label = model.title;
	    } else if (model.modelState.practice) {
	      label = 'Practice Question ' + (questions.indexOf(model) + 1);
	    } else {
	      label = 'Question ' + (questions.indexOf(model) + 1);
	    }
	    return {
	      type: 'sub-link',
	      label: label,
	      path: ['#obo-' + model.get('id')]
	    };
	  }
	});

/***/ },

/***/ 211:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 212:
211

/******/ })));