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
/******/ 	return __webpack_require__(__webpack_require__.s = 166);
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

/***/ 142:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 143:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 144:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 15:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(33);


/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

__webpack_require__(7);

__webpack_require__(64);

__webpack_require__(66);

var _adapter = __webpack_require__(67);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(68);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(142);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OboComponent = _Common2.default.components.OboComponent;

var MCAnswer = function (_React$Component) {
	_inherits(MCAnswer, _React$Component);

	function MCAnswer() {
		_classCallCheck(this, MCAnswer);

		return _possibleConstructorReturn(this, (MCAnswer.__proto__ || Object.getPrototypeOf(MCAnswer)).apply(this, arguments));
	}

	_createClass(MCAnswer, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'obojobo-draft--chunks--mc-assessment--mc-answer'
				},
				this.props.model.children.models.map(function (child, index) {
					var Component = child.getComponentClass();
					return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this2.props.moduleData });
				})
			);
		}
	}]);

	return MCAnswer;
}(React.Component);

exports.default = MCAnswer;

/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _viewerComponent = __webpack_require__(63);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCAnswer', {
	type: 'chunk',
	adapter: null,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(143);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OboComponent = _Common2.default.components.OboComponent;

var MCFeedback = function (_React$Component) {
	_inherits(MCFeedback, _React$Component);

	function MCFeedback() {
		_classCallCheck(this, MCFeedback);

		return _possibleConstructorReturn(this, (MCFeedback.__proto__ || Object.getPrototypeOf(MCFeedback)).apply(this, arguments));
	}

	_createClass(MCFeedback, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'obojobo-draft--chunks--mc-assessment--mc-feedback' + (this.props.model.parent.modelState.score === 100 ? ' is-correct-feedback' : ' is-incorrect-feedback'),
					'data-choice-label': this.props.label
				},
				this.props.model.children.models.map(function (child, index) {
					var Component = child.getComponentClass();
					return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this2.props.moduleData });
				})
			);
		}
	}]);

	return MCFeedback;
}(React.Component);

exports.default = MCFeedback;

/***/ }),

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _viewerComponent = __webpack_require__(65);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCFeedback', {
	type: 'chunk',
	adapter: null,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.responseType;
		}) != null) {
			model.modelState.responseType = attrs.content.responseType;
		} else {
			model.modelState.responseType = '';
		}
	},
	clone: function clone(model, _clone) {
		_clone.modelState.responseType = model.modelState.responseType;
	},
	toJSON: function toJSON(model, json) {
		json.content.responseType = model.modelState.responseType;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(144);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var OboComponent = _Common2.default.components.OboComponent;
var Button = _Common2.default.components.Button;
var OboModel = _Common2.default.models.OboModel;
var Dispatcher = _Common2.default.flux.Dispatcher;
var DOMUtil = _Common2.default.page.DOMUtil;

// FocusUtil = Common.util.FocusUtil

OboModel = _Common2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;
var ScoreUtil = _Viewer2.default.util.ScoreUtil;

// @TODO - This wont update if new children are passed in via props

var MCAssessment = function (_React$Component) {
	_inherits(MCAssessment, _React$Component);

	function MCAssessment() {
		_classCallCheck(this, MCAssessment);

		return _possibleConstructorReturn(this, (MCAssessment.__proto__ || Object.getPrototypeOf(MCAssessment)).apply(this, arguments));
	}

	_createClass(MCAssessment, [{
		key: 'getResponseData',
		value: function getResponseData() {
			var correct = new Set();
			var responses = new Set();

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(this.props.model.children.models)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var child = _step.value;

					if (child.modelState.score === 100) {
						correct.add(child.get('id'));
					}

					if (__guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, child), function (x) {
						return x.set;
					})) {
						// return child.modelState.score
						responses.add(child.get('id'));
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return {
				correct: correct,
				responses: responses
			};
		}
	}, {
		key: 'calculateScore',
		value: function calculateScore() {
			var responseData = this.getResponseData();
			var correct = responseData.correct;
			var responses = responseData.responses;


			switch (this.props.model.modelState.responseType) {
				case 'pick-all':
					if (correct.size !== responses.size) {
						return 0;
					}
					var score = 100;
					correct.forEach(function (id) {
						if (!responses.has(id)) {
							return score = 0;
						}
					});
					return score;

				default:
					// pick-one | pick-one-multiple-correct
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = Array.from(Array.from(correct))[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var id = _step2.value;

							if (responses.has(id)) {
								return 100;
							}
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					return 0;
			}
		}
	}, {
		key: 'onClickSubmit',
		value: function onClickSubmit(event) {
			event.preventDefault();
			return this.updateScore();
		}
	}, {
		key: 'updateScore',
		value: function updateScore() {
			return ScoreUtil.setScore(this.props.model.parent.get('id'), this.calculateScore());
		}
	}, {
		key: 'onClickUndoRevealAll',
		value: function onClickUndoRevealAll(event) {
			event.preventDefault();
			return QuestionUtil.setData(this.props.model.get('id'), 'revealAll', false);
		}
	}, {
		key: 'onClickRevealAll',
		value: function onClickRevealAll(event) {
			event.preventDefault();
			return QuestionUtil.setData(this.props.model.get('id'), 'revealAll', true);
		}
	}, {
		key: 'onClickReset',
		value: function onClickReset(event) {
			event.preventDefault();
			return this.reset();
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.clearRevealAll();
			this.clearResponses();
			return this.clearScore();
		}
	}, {
		key: 'clearRevealAll',
		value: function clearRevealAll() {
			return QuestionUtil.clearData(this.props.model.get('id'), 'revealAll');
		}
		// QuestionUtil.clearData @props.model.get('id'), 'shuffledIds'

	}, {
		key: 'clearResponses',
		value: function clearResponses() {
			return Array.from(this.props.model.children.models).map(function (child) {
				return QuestionUtil.resetResponse(child.get('id'));
			});
		}
	}, {
		key: 'clearScore',
		value: function clearScore() {
			return ScoreUtil.clearScore(this.props.model.parent.get('id'));
		}
	}, {
		key: 'onClick',
		value: function onClick(event) {
			var mcChoiceEl = DOMUtil.findParentWithAttr(event.target, 'data-type', 'ObojoboDraft.Chunks.MCAssessment.MCChoice');
			if (!mcChoiceEl) {
				return;
			}

			var mcChoiceId = mcChoiceEl.getAttribute('data-id');
			if (!mcChoiceId) {
				return;
			}

			var revealAll = this.isRevealingAll();

			if (this.getScore() !== null) {
				this.reset();
			}

			switch (this.props.model.modelState.responseType) {
				case 'pick-all':
					return QuestionUtil.recordResponse(mcChoiceId, {
						set: !__guard__(QuestionUtil.getResponse(this.props.moduleData.questionState, OboModel.models[mcChoiceId]), function (x) {
							return x.set;
						})
					});

				default:
					// pick-one | pick-one-multiple-correct
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = Array.from(this.props.model.children.models)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var child = _step3.value;

							if (child.get('id') !== mcChoiceId) {
								QuestionUtil.recordResponse(child.get('id'), {
									set: false
								});
							}
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					return QuestionUtil.recordResponse(mcChoiceId, {
						set: true
					});
			}
		}
	}, {
		key: 'getScore',
		value: function getScore() {
			return ScoreUtil.getScoreForModel(this.props.moduleData.scoreState, this.props.model.parent);
		}

		// showSolution: (event) ->
		// 	event.preventDefault()
		// 	@setState { showingSolution:true }

	}, {
		key: 'isRevealingAll',
		value: function isRevealingAll() {
			return QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'revealAll');
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps() {
			this.shuffle();
		}
	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.shuffle();
		}
	}, {
		key: 'shuffle',
		value: function shuffle() {
			var shuffledIds = QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'shuffledIds');
			if (!shuffledIds) {
				shuffledIds = _.shuffle(this.props.model.children.models).map(function (model) {
					return model.get('id');
				});
				QuestionUtil.setData(this.props.model.get('id'), 'shuffledIds', shuffledIds);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var responseType = this.props.model.modelState.responseType;

			var revealAll = this.isRevealingAll();
			var score = this.getScore();
			var questionSubmitted = score !== null;
			var questionAnswered = this.getResponseData().responses.size >= 1;
			var shuffledIds = QuestionUtil.getData(this.props.moduleData.questionState, this.props.model, 'shuffledIds');
			// shuffledIds = _.shuffle(@props.model.children.models).map (model) -> model.get('id')

			if (!shuffledIds) return false;

			var feedbacks = Array.from(this.getResponseData().responses).filter(function (mcChoiceId) {
				return OboModel.models[mcChoiceId].children.length > 1;
			}).sort(function (id1, id2) {
				return shuffledIds.indexOf(id1) - shuffledIds.indexOf(id2);
			}).map(function (mcChoiceId) {
				return OboModel.models[mcChoiceId].children.at(1);
			});

			var solution = this.props.model.parent.modelState.solution;

			if (solution != null) {
				var SolutionComponent = solution.getComponentClass();
			}

			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					onClick: this.onClick.bind(this),
					tag: 'form',
					className: 'obojobo-draft--chunks--mc-assessment' + (' is-response-type-' + this.props.model.modelState.responseType) + (revealAll ? ' is-revealing-all' : ' is-not-revealing-all') + (score === null ? ' is-unscored' : ' is-scored')
				},
				React.createElement(
					'span',
					{ className: 'instructions' },
					function () {
						switch (responseType) {
							case 'pick-one':
								return React.createElement(
									'span',
									null,
									'Pick the correct answer'
								);
							case 'pick-one-multiple-correct':
								return React.createElement(
									'span',
									null,
									'Pick one of the correct answers'
								);
							case 'pick-all':
								return React.createElement(
									'span',
									null,
									'Pick ',
									React.createElement(
										'b',
										null,
										'all'
									),
									' of the correct answers'
								);
						}
					}()
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
						moduleData: _this2.props.moduleData,
						responseType: responseType,
						revealAll: revealAll,
						questionSubmitted: questionSubmitted,
						label: String.fromCharCode(index + 65)
					});
				}),
				React.createElement(
					'div',
					{ className: 'submit' },
					questionSubmitted ? React.createElement(Button, { altAction: true, onClick: this.onClickReset.bind(this), value: 'Try Again' }) : React.createElement(Button, {
						onClick: this.onClickSubmit.bind(this),
						value: 'Check Your Answer',
						disabled: !questionAnswered
					}),
					questionSubmitted ? score === 100 ? React.createElement(
						'div',
						{ className: 'result-container' },
						React.createElement(
							'p',
							{ className: 'result correct' },
							'Correct!'
						)
					) : React.createElement(
						'div',
						{ className: 'result-container' },
						React.createElement(
							'p',
							{ className: 'result incorrect' },
							'Incorrect'
						),
						responseType === 'pick-all' ? React.createElement(
							'span',
							{ className: 'pick-all-instructions' },
							'You have either missed some correct answers or selected some incorrect answers'
						) : null
					) : null
				),
				React.createElement(
					ReactCSSTransitionGroup,
					{
						component: 'div',
						transitionName: 'submit',
						transitionEnterTimeout: 800,
						transitionLeaveTimeout: 800
					},
					questionSubmitted && (feedbacks.length > 0 || solution) ? React.createElement(
						'div',
						{ className: 'solution', key: 'solution' },
						React.createElement(
							'div',
							{ className: 'score' },
							feedbacks.length === 0 ? null : React.createElement(
								'div',
								{
									className: 'feedback' + (responseType === 'pick-all' ? ' is-pick-all-feedback' : ' is-not-pick-all-feedback')
								},
								feedbacks.map(function (model) {
									var Component = model.getComponentClass();
									return React.createElement(Component, {
										key: model.get('id'),
										model: model,
										moduleData: _this2.props.moduleData,
										responseType: responseType,
										revealAll: revealAll,
										questionSubmitted: questionSubmitted,
										label: String.fromCharCode(shuffledIds.indexOf(model.parent.get('id')) + 65)
									});
								})
							)
						),
						revealAll ? React.createElement(Button, {
							altAction: true,
							onClick: this.onClickUndoRevealAll.bind(this),
							value: 'Hide Explanation'
						}) : solution ? React.createElement(Button, {
							altAction: true,
							onClick: this.onClickRevealAll.bind(this),
							value: 'Read an explanation of the answer'
						}) : null,
						React.createElement(
							ReactCSSTransitionGroup,
							{
								component: 'div',
								transitionName: 'solution',
								transitionEnterTimeout: 800,
								transitionLeaveTimeout: 800
							},
							revealAll ? React.createElement(
								'div',
								{ className: 'solution-container', key: 'solution-component' },
								React.createElement(SolutionComponent, { model: solution, moduleData: this.props.moduleData })
							) : null
						)
					) : null
				)
			);
		}
	}]);

	return MCAssessment;
}(React.Component);

exports.default = MCAssessment;


function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(15);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OboComponent = _Common2.default.components.OboComponent;
var OboModel = _Common2.default.models.OboModel;
var QuestionUtil = _Viewer2.default.util.QuestionUtil;

var MCChoice = function (_React$Component) {
	_inherits(MCChoice, _React$Component);

	function MCChoice() {
		_classCallCheck(this, MCChoice);

		return _possibleConstructorReturn(this, (MCChoice.__proto__ || Object.getPrototypeOf(MCChoice)).apply(this, arguments));
	}

	_createClass(MCChoice, [{
		key: 'createFeedbackItem',
		value: function createFeedbackItem(message) {
			var feedback = OboModel.create('ObojoboDraft.Chunks.MCAssessment.MCFeedback');
			var text = OboModel.create('ObojoboDraft.Chunks.Text');
			// console.log('text', text)
			text.modelState.textGroup.first.text.insertText(0, message);
			// console.log('feedback', feedback)
			feedback.children.add(text);

			return feedback;
		}
	}, {
		key: 'getInputType',
		value: function getInputType() {
			switch (this.props.responseType) {
				case 'pick-all':
					return 'checkbox';
				default:
					//'pick-one', 'pick-one-multiple-correct'
					return 'radio';
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

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
					onChange: function onChange() {},
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
							return React.createElement(Component, { key: child.get('id'), model: child, moduleData: _this2.props.moduleData });
						}
					})
				)
			);
		}
	}], [{
		key: 'defaultProps',
		get: function get() {
			return {
				responseType: null,
				revealAll: false,
				questionSubmitted: false
			};
		}
	}]);

	return MCChoice;
}(React.Component);

exports.default = MCChoice;


function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ })

/******/ });