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
/******/ 	return __webpack_require__(__webpack_require__.s = 275);
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

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _adapter = __webpack_require__(155);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(159);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;


_Common2.default.Store.registerModel('ObojoboDraft.Sections.Assessment', {
	type: 'section',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: null,
	getNavItem: function getNavItem(model) {
		var title = model.title || 'Assessment';

		return {
			type: 'link',
			label: title,
			path: [title.toLowerCase().replace(/ /g, '-')],
			showChildren: false,
			showChildrenOnNavigation: false
		};
	},

	variables: {
		'assessment:attemptsRemaining': function assessmentAttemptsRemaining(textModel, viewerProps) {
			var assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment');
			if (assessmentModel.modelState.attempts === Infinity) {
				return 'unlimited';
			}

			return assessmentModel.modelState.attempts - AssessmentUtil.getNumberOfAttemptsCompletedForModel(viewerProps.assessmentState, textModel);
		},
		'assessment:attemptsAmount': function assessmentAttemptsAmount(textModel, viewerProps) {
			var assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment');
			if (assessmentModel.modelState.attempts === Infinity) {
				return 'unlimited';
			}

			return assessmentModel.modelState.attempts;
		}
	}

	// generateNav: (model) ->
	// 	[
	// 		{
	// 			type: 'link',
	// 			label: model.title ||= 'Assessment',
	// 			id: model.get('id')
	// 		},
	// 		{
	// 			type: 'seperator'
	// 		}
	// 	]
});

/***/ }),

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _scoreActions = __webpack_require__(158);

var _scoreActions2 = _interopRequireDefault(_scoreActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Adapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.attempts;
		}) != null) {
			if (attrs.content.attempts === 'unlimited') {
				model.modelState.attempts = Infinity;
			} else {
				model.modelState.attempts = parseInt(attrs.content.attempts, 10);
			}
		} else {
			model.modelState.attempts = Infinity;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, function (x1) {
			return x1.scoreActions;
		}) != null) {
			return model.modelState.scoreActions = new _scoreActions2.default(attrs.content.scoreActions);
		} else {
			return model.modelState.scoreActions = new _scoreActions2.default();
		}
	},


	// model.modelState.assessmentState =
	// 	inTest: false
	// 	scores: []
	// 	currentScore: 0

	clone: function clone(model, _clone) {
		_clone.modelState.attempts = model.modelState.attempts;
		_clone.modelState.hideNav = model.modelState.hideNav;
		return _clone.modelState.scoreActions = model.modelState.scoreActions.clone();
	},


	//@TODO - necessary?
	// clone.modelState.assessmentState =
	// 	inTest: model.modelState.assessmentState.inTest
	// 	currentScore: model.modelState.assessmentState.currentScore
	// 	scores: Object.assign [], model.modelState.assessmentState.scores

	toJSON: function toJSON(model, json) {
		json.content.attempts = model.modelState.attempts;
		json.content.hideNav = model.modelState.hideNav;
		return json.content.scoreActions = model.modelState.scoreActions.toObject();
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dialog = _Common2.default.components.modal.Dialog;
var ModalUtil = _Common2.default.util.ModalUtil;

var AttemptIncompleteDialog = function (_React$Component) {
	_inherits(AttemptIncompleteDialog, _React$Component);

	function AttemptIncompleteDialog() {
		_classCallCheck(this, AttemptIncompleteDialog);

		return _possibleConstructorReturn(this, (AttemptIncompleteDialog.__proto__ || Object.getPrototypeOf(AttemptIncompleteDialog)).apply(this, arguments));
	}

	_createClass(AttemptIncompleteDialog, [{
		key: 'onCancel',
		value: function onCancel() {
			return ModalUtil.hide();
		}
	}, {
		key: 'onSubmit',
		value: function onSubmit() {
			ModalUtil.hide();
			return this.props.onSubmit();
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				Dialog,
				{
					buttons: [{
						value: 'Submit as incomplete',
						altAction: true,
						dangerous: true,
						onClick: this.onSubmit.bind(this)
					}, 'or', {
						value: 'Resume assessment',
						onClick: this.onCancel.bind(this),
						default: true
					}]
				},
				React.createElement(
					'b',
					null,
					'Wait! You left some questions blank.'
				),
				React.createElement('br', null),
				'Finish answering all questions and submit again.'
			);
		}
	}]);

	return AttemptIncompleteDialog;
}(React.Component);

exports.default = AttemptIncompleteDialog;

/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(253);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = _Common2.default.components.Button;

var LTINetworkStates = _Viewer2.default.stores.assessmentStore.LTINetworkStates;

var LTIStatus = function (_React$Component) {
	_inherits(LTIStatus, _React$Component);

	function LTIStatus() {
		_classCallCheck(this, LTIStatus);

		return _possibleConstructorReturn(this, (LTIStatus.__proto__ || Object.getPrototypeOf(LTIStatus)).apply(this, arguments));
	}

	_createClass(LTIStatus, [{
		key: 'onClickResendScore',
		value: function onClickResendScore() {
			AssessmentUtil.resendLTIScore(this.props.model);
		}
	}, {
		key: 'render',
		value: function render() {
			var ltiState = this.props.ltiState;

			if (!ltiState.state) return null;

			switch (ltiState.state.gradebookStatus) {
				case 'ok_no_outcome_service':
				case 'ok_gradebook_matches_assessment_score':
				case 'ok_null_score_not_sent':
					return null;

				default:
					return this.renderError();
			}
		}
	}, {
		key: 'renderError',
		value: function renderError() {
			var _this2 = this;

			var ltiState = this.props.ltiState;
			var systemLabel = this.props.externalSystemLabel;

			return React.createElement(
				'div',
				{ className: 'obojobo-draft--sections--assessment--lti-status' },
				React.createElement(
					'h2',
					null,
					'There was a problem sending your score to ' + systemLabel + '.'
				),
				React.createElement(
					'p',
					null,
					'Don\u2019t worry - your score is safely recorded here. We just weren\u2019t able to send it to ' + systemLabel + '. Click the button below to resend your score:'
				),
				this.props.ltiState.errorCount === 0 || ltiState.networkState !== LTINetworkStates.IDLE ? null : React.createElement(
					'p',
					null,
					React.createElement(
						'strong',
						null,
						'Sorry - That didn\'t work.'
					),
					' Most likely the connection to ' + systemLabel + ' has expired and just needs to be refreshed. Please close this tab or window, reopen this module from ' + systemLabel + ', return to this page and then resend your score.'
				),
				function () {
					switch (ltiState.networkState) {
						case LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE:
							return React.createElement(
								Button,
								{ disabled: true },
								'Resending Score...'
							);
							break;

						case LTINetworkStates.IDLE:
						default:
							return React.createElement(
								Button,
								{ dangerous: true, onClick: _this2.props.onClickResendScore },
								_this2.props.ltiState.errorCount === 0 ? 'Resend score' : 'Try again anyway'
							);
							break;
					}
				}()
			);
		}
	}]);

	return LTIStatus;
}(React.Component);

exports.default = LTIStatus;

/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getParsedRange = _Common2.default.util.RangeParsing.getParsedRange;
var isValueInRange = _Common2.default.util.RangeParsing.isValueInRange;

var replaceDict = {
	'no-score': null
};

var ScoreActions = function () {
	function ScoreActions(actions) {
		_classCallCheck(this, ScoreActions);

		this.originalActions = actions;

		this.actions = (actions == null ? [] : actions).map(function (action) {
			var forAttr = action.for;

			// Transform legacy to/from to newer "for"
			if (typeof action.from !== 'undefined' && typeof action.to !== 'undefined' && typeof action.for === 'undefined') {
				forAttr = '[' + action.from + ',' + action.to + ']';
			}

			return {
				page: action.page,
				range: getParsedRange(forAttr)
			};
		});
	}

	_createClass(ScoreActions, [{
		key: 'getActionForScore',
		value: function getActionForScore(score) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var action = _step.value;

					if (isValueInRange(score, action.range, replaceDict, true)) return action;
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

			return null;
		}
	}, {
		key: 'toObject',
		value: function toObject() {
			return Object.assign([], this.originalActions);
		}
	}, {
		key: 'clone',
		value: function clone() {
			return new ScoreActions(this.toObject());
		}
	}]);

	return ScoreActions;
}();

exports.default = ScoreActions;

/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(254);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _attemptIncompleteDialog = __webpack_require__(156);

var _attemptIncompleteDialog2 = _interopRequireDefault(_attemptIncompleteDialog);

var _ltiStatus = __webpack_require__(157);

var _ltiStatus2 = _interopRequireDefault(_ltiStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OboComponent = _Common2.default.components.OboComponent;
var OboModel = _Common2.default.models.OboModel;
var Button = _Common2.default.components.Button;
var Dispatcher = _Common2.default.flux.Dispatcher;
var ModalUtil = _Common2.default.util.ModalUtil;
var ScoreStore = _Viewer2.default.stores.ScoreStore;
var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;
var NavUtil = _Viewer2.default.util.NavUtil;

var Assessment = function (_React$Component) {
	_inherits(Assessment, _React$Component);

	function Assessment() {
		_classCallCheck(this, Assessment);

		var _this = _possibleConstructorReturn(this, (Assessment.__proto__ || Object.getPrototypeOf(Assessment)).call(this));

		_this.state = { step: null };
		return _this;
	}

	_createClass(Assessment, [{
		key: 'getCurrentStep',
		value: function getCurrentStep() {
			var assessment = AssessmentUtil.getAssessmentForModel(this.props.moduleData.assessmentState, this.props.model);

			if (assessment === null) {
				return 'untested';
			}
			if (assessment.current !== null) {
				return 'takingTest';
			}
			if (assessment.attempts.length > 0) {
				return 'scoreSubmitted';
			}
			return 'untested';
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var curStep = this.getCurrentStep();
			if (curStep !== this.state.step) {
				this.needsScroll = true;
			}

			return this.setState({ step: curStep });
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			if (this.needsScroll) {
				delete this.needsScroll;
				return Dispatcher.trigger('viewer:scrollToTop');
			}
		}
	}, {
		key: 'isAttemptComplete',
		value: function isAttemptComplete() {
			return AssessmentUtil.isCurrentAttemptComplete(this.props.moduleData.assessmentState, this.props.moduleData.questionState, this.props.model);
		}
	}, {
		key: 'onClickSubmit',
		value: function onClickSubmit() {
			if (!this.isAttemptComplete()) {
				ModalUtil.show(React.createElement(_attemptIncompleteDialog2.default, { onSubmit: this.endAttempt.bind(this) }));
				return;
			}

			return this.endAttempt();
		}
	}, {
		key: 'onClickResendScore',
		value: function onClickResendScore() {
			AssessmentUtil.resendLTIScore(this.props.model);
		}
	}, {
		key: 'endAttempt',
		value: function endAttempt() {
			return AssessmentUtil.endAttempt(this.props.model);
		}
	}, {
		key: 'exitAssessment',
		value: function exitAssessment() {
			var scoreAction = this.getScoreAction();

			switch (scoreAction.action.value) {
				case '_next':
					return NavUtil.goNext();

				case '_prev':
					return NavUtil.goPrev();

				default:
					return NavUtil.goto(scoreAction.action.value);
			}
		}
	}, {
		key: 'getScoreAction',
		value: function getScoreAction() {
			var assessmentScore = AssessmentUtil.getAssessmentScoreForModel(this.props.moduleData.assessmentState, this.props.model);
			var scoreAction = this.props.model.modelState.scoreActions.getActionForScore(assessmentScore);
			if (scoreAction) {
				return scoreAction;
			}

			return {
				from: 0,
				to: 100,
				message: '',
				action: {
					type: 'unlock',
					value: '_next'
				}
			};
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var recentScore = AssessmentUtil.getLastAttemptScoreForModel(this.props.moduleData.assessmentState, this.props.model);
			var assessmentScore = AssessmentUtil.getAssessmentScoreForModel(this.props.moduleData.assessmentState, this.props.model);
			var ltiState = AssessmentUtil.getLTIStateForModel(this.props.moduleData.assessmentState, this.props.model);

			var externalSystemLabel = this.props.moduleData.lti.outcomeServiceHostname;

			var childEl = function () {
				switch (_this2.getCurrentStep()) {
					case 'untested':
						var child = _this2.props.model.children.at(0);
						var Component = child.getComponentClass();

						return React.createElement(
							'div',
							{ className: 'untested' },
							React.createElement(Component, { model: child, moduleData: _this2.props.moduleData })
						);

					case 'takingTest':
						child = _this2.props.model.children.at(1);
						Component = child.getComponentClass();

						return React.createElement(
							'div',
							{ className: 'test' },
							React.createElement(Component, {
								className: 'untested',
								model: child,
								moduleData: _this2.props.moduleData,
								showScore: recentScore !== null
							}),
							React.createElement(
								'div',
								{ className: 'submit-button' },
								React.createElement(Button, {
									onClick: _this2.onClickSubmit.bind(_this2),
									value: _this2.isAttemptComplete() ? 'Submit' : 'Submit (Not all questions have been answered)'
								})
							)
						);

					case 'scoreSubmitted':
						var scoreAction = _this2.getScoreAction();

						var questionScores = AssessmentUtil.getLastAttemptScoresForModel(_this2.props.moduleData.assessmentState, _this2.props.model);

						var numCorrect = questionScores.reduce(function (acc, questionScore) {
							var n = 0;
							if (parseInt(questionScore.score, 10) === 100) {
								n = 1;
							}
							return parseInt(acc, 10) + n;
						}, [0]);

						if (scoreAction.page != null) {
							var pageModel = OboModel.create(scoreAction.page);
							pageModel.parent = _this2.props.model; //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
							var PageComponent = pageModel.getComponentClass();
							childEl = React.createElement(PageComponent, { model: pageModel, moduleData: _this2.props.moduleData });
						} else {
							childEl = React.createElement(
								'p',
								null,
								scoreAction.message
							);
						}

						return React.createElement(
							'div',
							{ className: 'score unlock' },
							React.createElement(_ltiStatus2.default, {
								ltiState: ltiState,
								externalSystemLabel: externalSystemLabel,
								onClickResendScore: _this2.onClickResendScore.bind(_this2)
							}),
							React.createElement(
								'h1',
								null,
								'Your attempt score is ' + Math.round(recentScore) + '%'
							),
							React.createElement(
								'h2',
								null,
								'Your overall score for this assessment is',
								' ',
								React.createElement(
									'strong',
									null,
									assessmentScore === null ? '--' : Math.round(assessmentScore),
									'% '
								),
								function () {
									switch (ltiState.state.gradebookStatus) {
										case 'ok_no_outcome_service':
										case 'ok_null_score_not_sent':
											return null;

										case 'ok_gradebook_matches_assessment_score':
											return React.createElement(
												'span',
												{ className: 'lti-sync-message is-synced' },
												'(',
												'sent to ' + externalSystemLabel + ' ',
												React.createElement(
													'span',
													null,
													'\u2714'
												),
												')'
											);

										default:
											return React.createElement(
												'span',
												{ className: 'lti-sync-message is-not-synced' },
												'(',
												'not sent to ' + externalSystemLabel + ' ',
												React.createElement(
													'span',
													null,
													'\u2716'
												),
												')'
											);
									}
								}()
							),
							childEl,
							React.createElement(
								'div',
								{ className: 'review' },
								React.createElement(
									'p',
									{ className: 'number-correct' },
									'You got ' + numCorrect + ' out of ' + questionScores.length + ' questions correct:'
								),
								questionScores.map(function (questionScore, index) {
									var questionModel = OboModel.models[questionScore.id];
									var QuestionComponent = questionModel.getComponentClass();

									return React.createElement(
										'div',
										{
											key: index,
											className: questionScore.score === 100 ? 'is-correct' : 'is-not-correct'
										},
										React.createElement(
											'p',
											null,
											'Question ' + (index + 1) + ' - ' + (questionScore.score === 100 ? 'Correct:' : 'Incorrect:')
										),
										React.createElement(QuestionComponent, {
											model: questionModel,
											moduleData: _this2.props.moduleData,
											showContentOnly: true
										})
									);
								})
							)
						);
				}
			}();

			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: 'obojobo-draft--sections--assessment'
				},
				childEl
			);
		}
	}]);

	return Assessment;
}(React.Component);

exports.default = Assessment;

/***/ }),

/***/ 253:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 254:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 275:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(113);


/***/ })

/******/ });