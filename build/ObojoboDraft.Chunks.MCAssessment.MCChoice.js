/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 165);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = Viewer;

/***/ }),

/***/ 15:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(8);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(9);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCChoice', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.score;
		}) != null) {
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

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(15);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _Common2.default.components.OboComponent;
var OboModel = _Common2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;


var MCChoice = React.createClass({
	displayName: 'MCChoice',
	getDefaultProps: function getDefaultProps() {
		return {
			responseType: null,
			revealAll: false,
			questionSubmitted: false
		};
	},


	// getInitialState: ->
	// 	children: @createChildren(this.props.model.children.models)

	// componentWillReceiveProps: (nextProps) ->
	// 	if nextProps.model?
	// 		@setState { children:@createChildren(this.props.model.children.models) }

	// createChildren: (models) ->
	// 	children = []
	// 	hasFeedback = false
	// 	for model in models
	// 		children.push model
	// 		if model.get('type') is 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
	// 			hasFeedback = true

	// 	if not hasFeedback
	// 		if @props.model.modelState.score is 100
	// 			children.push @createFeedbackItem('Correct!')
	// 		else
	// 			children.push @createFeedbackItem('Incorrect')

	// 	children

	createFeedbackItem: function createFeedbackItem(message) {
		var feedback = OboModel.create('ObojoboDraft.Chunks.MCAssessment.MCFeedback');
		var text = OboModel.create('ObojoboDraft.Chunks.Text');
		// console.log('text', text)
		text.modelState.textGroup.first.text.insertText(0, message);
		// console.log('feedback', feedback)
		feedback.children.add(text);

		return feedback;
	},


	// onChange: (event) ->
	// 	if event.target.checked
	// 		QuestionUtil.recordResponse @props.model.get('id'), true
	// 	else
	// 		QuestionUtil.resetResponse @props.model.get('id')

	// onClick: (event) ->
	// 	# if not @props.isSelected
	// 		# @props.onChange @props.model, true
	// 	# QuestionUtil.recordResponse @props.model.get('id'), true
	// 	@refs.input.checked = true

	getInputType: function getInputType() {
		switch (this.props.responseType) {
			case 'pick-all':
				return 'checkbox';
			default:
				//'pick-one', 'pick-one-multiple-correct'
				return 'radio';
		}
	},
	render: function render() {
		var _this = this;

		var isSelected = __guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, this.props.model), function (x) {
			return x.set;
		}) === true;

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
						return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this.props.moduleData });
					}
				})
			)
		);
	}
});

exports.default = MCChoice;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ })

/******/ });