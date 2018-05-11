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
/******/ 	return __webpack_require__(__webpack_require__.s = 301);
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

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @category Common Helpers
 * @summary Is the given argument an instance of Date?
 *
 * @description
 * Is the given argument an instance of Date?
 *
 * @param {*} argument - the argument to check
 * @returns {Boolean} the given argument is an instance of Date
 *
 * @example
 * // Is 'mayonnaise' a Date?
 * var result = isDate('mayonnaise')
 * //=> false
 */
function isDate(argument) {
  return argument instanceof Date;
}

module.exports = isDate;

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _adapter = __webpack_require__(160);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(170);

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

			return AssessmentUtil.getAttemptsRemaining(viewerProps.assessmentState, assessmentModel);
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

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _scoreActions = __webpack_require__(169);

var _scoreActions2 = _interopRequireDefault(_scoreActions);

var _assessmentRubric = __webpack_require__(256);

var _assessmentRubric2 = _interopRequireDefault(_assessmentRubric);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Adapter = {
	construct: function construct(model, attrs) {
		// Set state if XML has the attributes.
		if (attrs && attrs.content) {
			var attempts = attrs.content.attempts || 'unlimited';
			model.modelState.attempts = attempts === 'unlimited' ? Infinity : parseInt(attempts, 10);
			model.modelState.review = attrs.content.review || 'never';
			model.modelState.scoreActions = new _scoreActions2.default(attrs.content.scoreActions || null);
			model.modelState.rubric = new _assessmentRubric2.default(attrs.content.rubric || null);
		} else {
			// Default state.
			model.modelState.attempts = Infinity;
			model.modelState.review = 'never';
			model.modelState.scoreActions = new _scoreActions2.default();
			model.modelState.rubric = new _assessmentRubric2.default();
		}
	},


	// model.modelState.assessmentState =
	// 	inTest: false
	// 	scores: []
	// 	currentScore: 0

	clone: function clone(model, _clone) {
		_clone.modelState.attempts = model.modelState.attempts;
		_clone.modelState.scoreActions = model.modelState.scoreActions.clone();
		_clone.modelState.rubric = model.modelState.rubric.clone();
	},


	//@TODO - necessary?
	// clone.modelState.assessmentState =
	// 	inTest: model.modelState.assessmentState.inTest
	// 	currentScore: model.modelState.assessmentState.currentScore
	// 	scores: Object.assign [], model.modelState.assessmentState.scores

	toJSON: function toJSON(model, json) {
		json.content.attempts = model.modelState.attempts;
		json.content.scoreActions = model.modelState.scoreActions.toObject();
		json.content.rubric = model.modelState.rubric.toObject();
	}
};
// @TODO: Importing from the server code, we shouldn't do this:
exports.default = Adapter;

/***/ }),

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dialog = _Common2.default.components.modal.Dialog;
var ModalUtil = _Common2.default.util.ModalUtil;


var onCancel = function onCancel() {
	ModalUtil.hide();
};

var onSubmit = function onSubmit(submitProp) {
	ModalUtil.hide();
	submitProp();
};

exports.default = function (props) {
	return React.createElement(
		Dialog,
		{
			buttons: [{
				value: 'Submit as incomplete',
				altAction: true,
				isDangerous: true,
				onClick: onSubmit.bind(null, props.onSubmit)
			}, 'or', {
				value: 'Resume assessment',
				onClick: onCancel,
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
};

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboModel = _Common2.default.models.OboModel;


var basicReview = function basicReview(moduleData, questionScore, index) {
	var questionModel = OboModel.models[questionScore.id];
	var QuestionComponent = questionModel.getComponentClass();

	return React.createElement(
		'div',
		{ key: index, className: questionScore.score === 100 ? 'is-correct' : 'is-not-correct' },
		React.createElement(
			'p',
			null,
			'Question ' + (index + 1) + ': ' + (questionScore.score === 100 ? 'Correct' : 'Incorrect')
		),
		React.createElement(QuestionComponent, { model: questionModel, moduleData: moduleData, showContentOnly: true })
	);
};

exports.default = basicReview;

/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _reviewIcon = __webpack_require__(167);

var _reviewIcon2 = _interopRequireDefault(_reviewIcon);

var _format = __webpack_require__(243);

var _format2 = _interopRequireDefault(_format);

var _basicReview = __webpack_require__(162);

var _basicReview2 = _interopRequireDefault(_basicReview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Viewer$assessment = _Viewer2.default.assessment,
    AssessmentScoreReporter = _Viewer$assessment.AssessmentScoreReporter,
    AssessmentScoreReportView = _Viewer$assessment.AssessmentScoreReportView;
var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;
var NavUtil = _Viewer2.default.util.NavUtil;
var OboModel = _Common2.default.models.OboModel;
var _Common$components = _Common2.default.components,
    Button = _Common$components.Button,
    ButtonBar = _Common$components.ButtonBar,
    MoreInfoButton = _Common$components.MoreInfoButton;

var AssessmentReviewView = function (_React$Component) {
	_inherits(AssessmentReviewView, _React$Component);

	function AssessmentReviewView() {
		_classCallCheck(this, AssessmentReviewView);

		return _possibleConstructorReturn(this, (AssessmentReviewView.__proto__ || Object.getPrototypeOf(AssessmentReviewView)).apply(this, arguments));
	}

	_createClass(AssessmentReviewView, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var lastAttempt = AssessmentUtil.getLastAttemptForModel(this.props.moduleData.assessmentState, this.props.model);

			NavUtil.setContext('assessmentReview:' + lastAttempt.attemptId);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var attemptReviewComponents = {};

			var attempts = AssessmentUtil.getAllAttempts(this.props.moduleData.assessmentState, this.props.model);
			var highestAttempts = AssessmentUtil.getHighestAttemptsForModelByAttemptScore(this.props.moduleData.assessmentState, this.props.model);
			var scoreReporter = new AssessmentScoreReporter({
				assessmentRubric: this.props.model.modelState.rubric.toObject(),
				totalNumberOfAttemptsAllowed: this.props.model.modelState.attempts,
				allAttempts: attempts
			});

			var attemptReviewComponent = function attemptReviewComponent(attempt, assessment, isAHighestScoringNonNullAttempt) {
				var dateString = (0, _format2.default)(new Date(attempt.finishTime), 'M/D/YY [at] h:mma');
				var numCorrect = AssessmentUtil.getNumCorrect(attempt.questionScores);

				var report = scoreReporter.getReportFor(attempt.attemptNumber);

				var attemptScoreSummary = Math.round(attempt.attemptScore) + '%';
				if (attempt.attemptScore !== attempt.assessmentScore) {
					attemptScoreSummary += ' → ' + (attempt.assessmentScore === null ? 'Did Not Pass' : Math.round(attempt.assessmentScore) + '%');
				}

				return React.createElement(
					'div',
					{ className: 'attempt-results' },
					React.createElement(
						'div',
						{ className: 'attempt-header' },
						React.createElement(
							'div',
							{ className: 'attempt-info-container' },
							React.createElement(_reviewIcon2.default, null),
							React.createElement(
								'div',
								{ className: 'attempt-info-content-container' },
								React.createElement(
									'h4',
									null,
									React.createElement(
										'strong',
										null,
										'Attempt ' + attempt.attemptNumber
									),
									isAHighestScoringNonNullAttempt ? React.createElement(
										'span',
										{ className: 'highest-attempt' },
										'\u2605 Highest Attempt'
									) : null
								),
								React.createElement(
									'div',
									{ className: 'attempt-info-content' },
									React.createElement(
										'ul',
										null,
										React.createElement(
											'li',
											null,
											dateString
										),
										React.createElement(
											'li',
											null,
											numCorrect,
											' out of ',
											attempt.questionScores.length,
											' questions correct'
										),
										React.createElement(
											'li',
											null,
											'Attempt Score: ',
											React.createElement(
												'strong',
												null,
												attemptScoreSummary
											),
											React.createElement(
												MoreInfoButton,
												null,
												React.createElement(AssessmentScoreReportView, { report: report })
											)
										)
									)
								)
							)
						)
					),
					React.createElement(
						'div',
						{
							className: 'review ' + (_this2.props.showFullReview ? 'is-full-review' : 'is-basic-review')
						},
						attempt.questionScores.map(function (scoreObj, index) {
							var questionModel = OboModel.models[scoreObj.id];
							var QuestionComponent = questionModel.getComponentClass();

							return _this2.props.showFullReview ? React.createElement(QuestionComponent, {
								model: questionModel,
								moduleData: _this2.props.moduleData,
								mode: 'review',
								key: scoreObj.id
							}) : (0, _basicReview2.default)(_this2.props.moduleData, scoreObj, index);
						})
					)
				);
			};

			var getSelectedIndex = function getSelectedIndex() {
				var context = _this2.props.moduleData.navState.context;

				for (var i in attempts) {
					var attempt = attempts[i];

					if (context === 'assessmentReview:' + attempt.attemptId) {
						return parseInt(i, 10);
					}
				}

				return attempts.length - 1;
			};

			var attemptButtons = attempts.map(function (attempt, index) {
				return React.createElement(
					Button,
					{
						onClick: function onClick() {
							return NavUtil.setContext('assessmentReview:' + attempt.attemptId);
						},
						key: index
					},
					attempt.attemptNumber
				);
			});

			attempts.forEach(function (attempt) {
				attemptReviewComponents['assessmentReview:' + attempt.attemptId] = attemptReviewComponent(attempt, _this2.props.assessment, highestAttempts.indexOf(attempt) > -1 && attempt.assessmentScore !== null);
			});

			return React.createElement(
				'div',
				{ className: 'attempt-review-container' },
				React.createElement(
					'div',
					{
						className: 'attempt-button-container ' + (attemptButtons.length <= 1 ? 'is-showing-one-item' : null)
					},
					React.createElement(
						ButtonBar,
						{ altAction: true, selectedIndex: getSelectedIndex() },
						attemptButtons
					)
				),
				attemptReviewComponents[this.props.moduleData.navState.context]
			);
		}
	}]);

	return AssessmentReviewView;
}(React.Component);

exports.default = AssessmentReviewView;

/***/ }),

/***/ 164:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _ltiStatus = __webpack_require__(165);

var _ltiStatus2 = _interopRequireDefault(_ltiStatus);

var _fullReview = __webpack_require__(163);

var _fullReview2 = _interopRequireDefault(_fullReview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboModel = _Common2.default.models.OboModel;
var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;

var Launch = _Common2.default.Launch;
var NavUtil = _Viewer2.default.util.NavUtil;

//@TODO - Rename to simply "Review"

var AssessmentPostTest = function AssessmentPostTest(props) {
	var questionScores = AssessmentUtil.getLastAttemptScoresForModel(props.moduleData.assessmentState, props.model);

	var isFullReviewAvailable = function isFullReviewAvailable(reviewType) {
		switch (reviewType) {
			case 'always':
				return true;
			case 'never':
				return false;
			case 'no-attempts-remaining':
				return isAssessmentComplete();
		}
	};

	var isAssessmentComplete = function isAssessmentComplete() {
		return !AssessmentUtil.hasAttemptsRemaining(props.moduleData.assessmentState, props.model);
	};

	// const scoreAction = assessment.getScoreAction()
	var numCorrect = AssessmentUtil.getNumCorrect(questionScores);

	var assessmentScore = AssessmentUtil.getAssessmentScoreForModel(props.moduleData.assessmentState, props.model);

	var firstHighestAttempt = null;
	if (assessmentScore !== null) {
		var highestAttempts = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(props.moduleData.assessmentState, props.model);

		firstHighestAttempt = highestAttempts.length === 0 ? null : highestAttempts[0];
	}

	var onClickResendScore = function onClickResendScore() {
		AssessmentUtil.resendLTIScore(props.model);
	};

	var ltiState = AssessmentUtil.getLTIStateForModel(props.moduleData.assessmentState, props.model);

	var assessmentLabel = NavUtil.getNavLabelForModel(props.moduleData.navState, props.model);

	var scoreActionsPage = void 0;

	if (props.scoreAction.page != null) {
		var pageModel = OboModel.create(props.scoreAction.page);
		pageModel.parent = props.model; //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
		var PageComponent = pageModel.getComponentClass();
		scoreActionsPage = React.createElement(PageComponent, { model: pageModel, moduleData: props.moduleData });
	} else {
		scoreActionsPage = React.createElement(
			'p',
			null,
			scoreAction.message
		);
	}

	var externalSystemLabel = props.moduleData.lti.outcomeServiceHostname;

	var showFullReview = isFullReviewAvailable(props.model.modelState.review);

	return React.createElement(
		'div',
		{ className: 'score unlock' },
		React.createElement(
			'div',
			{ className: 'overview' },
			React.createElement(
				'h1',
				null,
				assessmentLabel,
				' Overview'
			),
			assessmentScore === null ? React.createElement(
				'div',
				{ className: 'recorded-score is-null' },
				React.createElement(
					'h2',
					null,
					'Recorded Score:'
				),
				React.createElement(
					'span',
					{ className: 'value' },
					'Did Not Pass'
				)
			) : React.createElement(
				'div',
				{ className: 'recorded-score is-not-null' },
				React.createElement(
					'h2',
					null,
					'Recorded Score:'
				),
				React.createElement(
					'span',
					{ className: 'value' },
					Math.round(assessmentScore)
				),
				React.createElement(
					'span',
					{ className: 'from-attempt' },
					'From attempt ' + firstHighestAttempt.assessmentScoreDetails.attemptNumber
				)
			),
			React.createElement(_ltiStatus2.default, {
				ltiState: ltiState,
				isPreviewing: props.moduleData.isPreviewing,
				externalSystemLabel: externalSystemLabel,
				onClickResendScore: onClickResendScore,
				assessmentScore: assessmentScore
			}),
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
			},
			React.createElement(
				'div',
				{ className: 'score-actions-page' },
				scoreActionsPage
			)
		),
		React.createElement(
			'div',
			{ className: 'attempt-history' },
			React.createElement(
				'h1',
				null,
				'Attempt History:'
			),
			React.createElement(_fullReview2.default, _extends({}, props, { showFullReview: showFullReview }))
		)
	);
};

exports.default = AssessmentPostTest;

/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(280);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = _Common2.default.components.Button;

var LTINetworkStates = _Viewer2.default.stores.assessmentStore.LTINetworkStates;

var notLTI = function notLTI() {
	return React.createElement(
		'div',
		{ className: 'obojobo-draft--sections--assessment--lti-status is-not-lti' },
		'\xA0'
	);
};

var noScoreSent = function noScoreSent(externalSystemLabel) {
	return React.createElement(
		'div',
		{ className: 'obojobo-draft--sections--assessment--lti-status is-synced' },
		'No score has been sent to ' + externalSystemLabel + ' (Only passing scores are sent)'
	);
};

var synced = function synced(assessmentScore, externalSystemLabel) {
	return React.createElement(
		'div',
		{ className: 'obojobo-draft--sections--assessment--lti-status is-synced' },
		'\u2714 Your recorded score of ' + assessmentScore + '% was sent to ' + externalSystemLabel
	);
};

var renderError = function renderError() {
	var ltiState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var systemLabel = arguments[1];
	var onClickResendScore = arguments[2];
	return React.createElement(
		'div',
		{ className: 'obojobo-draft--sections--assessment--lti-status is-not-synced' },
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
		ltiState.errorCount === 0 || ltiState.networkState !== LTINetworkStates.IDLE ? null : React.createElement(
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

				case LTINetworkStates.IDLE:
				default:
					return React.createElement(
						Button,
						{ isDangerous: true, onClick: onClickResendScore },
						ltiState.errorCount === 0 ? 'Resend score' : 'Try again anyway'
					);
			}
		}()
	);
};

exports.default = function (props) {
	if (props.isPreviewing || !props.externalSystemLabel) return notLTI();

	if (props.externalSystemLabel && (!props.ltiState || !props.ltiState.state)) {
		return renderError(props.ltiState, props.externalSystemLabel, props.onClickResendScore);
	}

	switch (props.ltiState.state.gradebookStatus) {
		case 'ok_no_outcome_service':
			return notLTI();

		case 'ok_null_score_not_sent':
			return noScoreSent(props.externalSystemLabel);

		case 'ok_gradebook_matches_assessment_score':
			return synced(Math.round(props.assessmentScore), props.externalSystemLabel);

		default:
			return renderError(props.ltiState, props.externalSystemLabel, props.onClickResendScore);
	}
};

/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var AssessmentPreTest = function AssessmentPreTest(props) {
	var Component = props.model.getComponentClass();

	return React.createElement(
		"div",
		{ className: "pre-test" },
		React.createElement(Component, { model: props.model, moduleData: props.moduleData })
	);
};

exports.default = AssessmentPreTest;

/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (props) {
	return React.createElement(
		"svg",
		{ xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 114.33 114.33" },
		React.createElement(
			"defs",
			null,
			React.createElement(
				"style",
				null,
				".cls-1{fill:#eadff6;}.cls-2{fill:#fff;}.cls-3{fill:#d7c6ed;}.cls-4{fill:#8fb9eb;}.cls-5{fill:#e8f3e2;}.cls-6{fill:#77b851;}"
			)
		),
		React.createElement(
			"title",
			null,
			"obo-assessment-review-icon"
		),
		React.createElement("circle", { className: "cls-1", cx: "57.17", cy: "57.17", r: "57.17" }),
		React.createElement("rect", { className: "cls-2", x: "32.5", y: "28.87", width: "49.33", height: "56.6", rx: "3.72", ry: "3.72" }),
		React.createElement("path", {
			className: "cls-3",
			d: "M43.15,39.35a4.06,4.06,0,1,0,4.06,4.06A4.06,4.06,0,0,0,43.15,39.35Zm0,6.31a2.25,2.25,0,1,1,2.25-2.25A2.25,2.25,0,0,1,43.15,45.67Z"
		}),
		React.createElement("rect", { className: "cls-3", x: "51.5", y: "41.29", width: "23.75", height: "4.25", rx: "2.12", ry: "2.12" }),
		React.createElement("path", {
			className: "cls-3",
			d: "M43.15,53.1a4.06,4.06,0,1,0,4.06,4.06A4.06,4.06,0,0,0,43.15,53.1Zm0,6.31a2.25,2.25,0,1,1,2.25-2.25A2.25,2.25,0,0,1,43.15,59.42Z"
		}),
		React.createElement("rect", { className: "cls-3", x: "51.5", y: "55.04", width: "23.75", height: "4.25", rx: "2.12", ry: "2.12" }),
		React.createElement("path", {
			className: "cls-3",
			d: "M43.15,66.85a4.06,4.06,0,1,0,4.06,4.06A4.06,4.06,0,0,0,43.15,66.85Z"
		}),
		React.createElement("rect", { className: "cls-3", x: "51.5", y: "68.79", width: "23.75", height: "4.25", rx: "2.12", ry: "2.12" }),
		React.createElement("path", {
			className: "cls-2",
			d: "M91.27,81.5l-5.39-5.39a15.3,15.3,0,1,0-7.65,7.74l5.35,5.35a3.53,3.53,0,0,0,5,0l2.72-2.72A3.53,3.53,0,0,0,91.27,81.5Z"
		}),
		React.createElement("path", {
			className: "cls-4",
			d: "M88.24,83.1,82,76.86A11.87,11.87,0,1,0,78.82,80l6.24,6.24a1.25,1.25,0,0,0,1.76,0l1.42-1.42A1.25,1.25,0,0,0,88.24,83.1Z"
		}),
		React.createElement("circle", { className: "cls-5", cx: "72.16", cy: "70.2", r: "8.79" }),
		React.createElement("path", {
			className: "cls-6",
			d: "M78.18,67.41l-1.75-1.75a.67.67,0,0,0-.94,0l-4.17,4.17L69.46,68a.67.67,0,0,0-.94,0l-1.75,1.75a.67.67,0,0,0,0,.94l2.72,2.72h0l1.35,1.35a.67.67,0,0,0,.94,0l6.39-6.39A.67.67,0,0,0,78.18,67.41Z"
		})
	);
};

/***/ }),

/***/ 168:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = _Common2.default.components.Button;


var AssessmentTest = function AssessmentTest(props) {
	var Component = props.model.getComponentClass();

	var submitButtonText = 'Loading ...';
	if (!props.isAttemptComplete) {
		submitButtonText = 'Submit (Not all questions have been answered)';
	} else if (!props.isFetching) {
		submitButtonText = 'Submit';
	}

	return React.createElement(
		'div',
		{ className: 'test' },
		React.createElement(Component, { model: props.model, moduleData: props.moduleData }),
		React.createElement(
			'div',
			{ className: 'submit-button' },
			React.createElement(Button, {
				disabled: props.isFetching,
				onClick: props.onClickSubmit,
				value: submitButtonText
			})
		)
	);
};

exports.default = AssessmentTest;

/***/ }),

/***/ 169:
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

					if (isValueInRange(score, action.range, replaceDict)) return action;
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

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isDate = __webpack_require__(100);

var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var DEFAULT_ADDITIONAL_DIGITS = 2;

var parseTokenDateTimeDelimeter = /[T ]/;
var parseTokenPlainTime = /:/;

// year tokens
var parseTokenYY = /^(\d{2})$/;
var parseTokensYYY = [/^([+-]\d{2})$/, // 0 additional digits
/^([+-]\d{3})$/, // 1 additional digit
/^([+-]\d{4})$/ // 2 additional digits
];

var parseTokenYYYY = /^(\d{4})/;
var parseTokensYYYYY = [/^([+-]\d{4})/, // 0 additional digits
/^([+-]\d{5})/, // 1 additional digit
/^([+-]\d{6})/ // 2 additional digits
];

// date tokens
var parseTokenMM = /^-(\d{2})$/;
var parseTokenDDD = /^-?(\d{3})$/;
var parseTokenMMDD = /^-?(\d{2})-?(\d{2})$/;
var parseTokenWww = /^-?W(\d{2})$/;
var parseTokenWwwD = /^-?W(\d{2})-?(\d{1})$/;

// time tokens
var parseTokenHH = /^(\d{2}([.,]\d*)?)$/;
var parseTokenHHMM = /^(\d{2}):?(\d{2}([.,]\d*)?)$/;
var parseTokenHHMMSS = /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/;

// timezone tokens
var parseTokenTimezone = /([Z+-].*)$/;
var parseTokenTimezoneZ = /^(Z)$/;
var parseTokenTimezoneHH = /^([+-])(\d{2})$/;
var parseTokenTimezoneHHMM = /^([+-])(\d{2}):?(\d{2})$/;

/**
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If an argument is a string, the function tries to parse it.
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If all above fails, the function passes the given argument to Date constructor.
 *
 * @param {Date|String|Number} argument - the value to convert
 * @param {Object} [options] - the object with options
 * @param {0 | 1 | 2} [options.additionalDigits=2] - the additional number of digits in the extended year format
 * @returns {Date} the parsed date in the local time zone
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * var result = parse('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Parse string '+02014101',
 * // if the additional number of digits in the extended year format is 1:
 * var result = parse('+02014101', {additionalDigits: 1})
 * //=> Fri Apr 11 2014 00:00:00
 */
function parse(argument, dirtyOptions) {
  if (isDate(argument)) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument !== 'string') {
    return new Date(argument);
  }

  var options = dirtyOptions || {};
  var additionalDigits = options.additionalDigits;
  if (additionalDigits == null) {
    additionalDigits = DEFAULT_ADDITIONAL_DIGITS;
  } else {
    additionalDigits = Number(additionalDigits);
  }

  var dateStrings = splitDateString(argument);

  var parseYearResult = parseYear(dateStrings.date, additionalDigits);
  var year = parseYearResult.year;
  var restDateString = parseYearResult.restDateString;

  var date = parseDate(restDateString, year);

  if (date) {
    var timestamp = date.getTime();
    var time = 0;
    var offset;

    if (dateStrings.time) {
      time = parseTime(dateStrings.time);
    }

    if (dateStrings.timezone) {
      offset = parseTimezone(dateStrings.timezone);
    } else {
      // get offset accurate to hour in timezones that change offset
      offset = new Date(timestamp + time).getTimezoneOffset();
      offset = new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE).getTimezoneOffset();
    }

    return new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE);
  } else {
    return new Date(argument);
  }
}

function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(parseTokenDateTimeDelimeter);
  var timeString;

  if (parseTokenPlainTime.test(array[0])) {
    dateStrings.date = null;
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
  }

  if (timeString) {
    var token = parseTokenTimezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], '');
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings;
}

function parseYear(dateString, additionalDigits) {
  var parseTokenYYY = parseTokensYYY[additionalDigits];
  var parseTokenYYYYY = parseTokensYYYYY[additionalDigits];

  var token;

  // YYYY or ±YYYYY
  token = parseTokenYYYY.exec(dateString) || parseTokenYYYYY.exec(dateString);
  if (token) {
    var yearString = token[1];
    return {
      year: parseInt(yearString, 10),
      restDateString: dateString.slice(yearString.length)
    };
  }

  // YY or ±YYY
  token = parseTokenYY.exec(dateString) || parseTokenYYY.exec(dateString);
  if (token) {
    var centuryString = token[1];
    return {
      year: parseInt(centuryString, 10) * 100,
      restDateString: dateString.slice(centuryString.length)
    };
  }

  // Invalid ISO-formatted year
  return {
    year: null
  };
}

function parseDate(dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) {
    return null;
  }

  var token;
  var date;
  var month;
  var week;

  // YYYY
  if (dateString.length === 0) {
    date = new Date(0);
    date.setUTCFullYear(year);
    return date;
  }

  // YYYY-MM
  token = parseTokenMM.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;
    date.setUTCFullYear(year, month);
    return date;
  }

  // YYYY-DDD or YYYYDDD
  token = parseTokenDDD.exec(dateString);
  if (token) {
    date = new Date(0);
    var dayOfYear = parseInt(token[1], 10);
    date.setUTCFullYear(year, 0, dayOfYear);
    return date;
  }

  // YYYY-MM-DD or YYYYMMDD
  token = parseTokenMMDD.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;
    var day = parseInt(token[2], 10);
    date.setUTCFullYear(year, month, day);
    return date;
  }

  // YYYY-Www or YYYYWww
  token = parseTokenWww.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;
    return dayOfISOYear(year, week);
  }

  // YYYY-Www-D or YYYYWwwD
  token = parseTokenWwwD.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;
    var dayOfWeek = parseInt(token[2], 10) - 1;
    return dayOfISOYear(year, week, dayOfWeek);
  }

  // Invalid ISO-formatted date
  return null;
}

function parseTime(timeString) {
  var token;
  var hours;
  var minutes;

  // hh
  token = parseTokenHH.exec(timeString);
  if (token) {
    hours = parseFloat(token[1].replace(',', '.'));
    return hours % 24 * MILLISECONDS_IN_HOUR;
  }

  // hh:mm or hhmm
  token = parseTokenHHMM.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseFloat(token[2].replace(',', '.'));
    return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
  }

  // hh:mm:ss or hhmmss
  token = parseTokenHHMMSS.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseInt(token[2], 10);
    var seconds = parseFloat(token[3].replace(',', '.'));
    return hours % 24 * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * 1000;
  }

  // Invalid ISO-formatted time
  return null;
}

function parseTimezone(timezoneString) {
  var token;
  var absoluteOffset;

  // Z
  token = parseTokenTimezoneZ.exec(timezoneString);
  if (token) {
    return 0;
  }

  // ±hh
  token = parseTokenTimezoneHH.exec(timezoneString);
  if (token) {
    absoluteOffset = parseInt(token[2], 10) * 60;
    return token[1] === '+' ? -absoluteOffset : absoluteOffset;
  }

  // ±hh:mm or ±hhmm
  token = parseTokenTimezoneHHMM.exec(timezoneString);
  if (token) {
    absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10);
    return token[1] === '+' ? -absoluteOffset : absoluteOffset;
  }

  return 0;
}

function dayOfISOYear(isoYear, week, day) {
  week = week || 0;
  day = day || 0;
  var date = new Date(0);
  date.setUTCFullYear(isoYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

module.exports = parse;

/***/ }),

/***/ 170:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(281);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _attemptIncompleteDialog = __webpack_require__(161);

var _attemptIncompleteDialog2 = _interopRequireDefault(_attemptIncompleteDialog);

var _preTest = __webpack_require__(166);

var _preTest2 = _interopRequireDefault(_preTest);

var _test = __webpack_require__(168);

var _test2 = _interopRequireDefault(_test);

var _postTest = __webpack_require__(164);

var _postTest2 = _interopRequireDefault(_postTest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OboComponent = _Common2.default.components.OboComponent;
var OboModel = _Common2.default.models.OboModel;
var Button = _Common2.default.components.Button;
var Dispatcher = _Common2.default.flux.Dispatcher;
var ModalUtil = _Common2.default.util.ModalUtil;
var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;
var NavUtil = _Viewer2.default.util.NavUtil;

var Assessment = function (_React$Component) {
	_inherits(Assessment, _React$Component);

	function Assessment() {
		_classCallCheck(this, Assessment);

		var _this = _possibleConstructorReturn(this, (Assessment.__proto__ || Object.getPrototypeOf(Assessment)).call(this));

		_this.state = {
			isFetching: false,
			step: null

			// pre-bind scopes to this object once
		};_this.onEndAttempt = _this.onEndAttempt.bind(_this);
		_this.onAttemptEnded = _this.onAttemptEnded.bind(_this);
		_this.endAttempt = _this.endAttempt.bind(_this);
		_this.onClickSubmit = _this.onClickSubmit.bind(_this);
		return _this;
	}

	_createClass(Assessment, [{
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			NavUtil.setContext('practice');
		}
	}, {
		key: 'getCurrentStep',
		value: function getCurrentStep() {
			var assessment = AssessmentUtil.getAssessmentForModel(this.props.moduleData.assessmentState, this.props.model);

			if (assessment === null) {
				return 'pre-test';
			}
			if (assessment.current !== null) {
				return 'test';
			}

			if (assessment.attempts.length > 0) {
				return 'post-test';
			}
			return 'pre-test';
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var curStep = this.getCurrentStep();
			if (curStep !== this.state.step) {
				this.needsScroll = true;
			}

			this.setState({
				step: curStep
			});
		}
	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			Dispatcher.on('assessment:endAttempt', this.onEndAttempt);
			Dispatcher.on('assessment:attemptEnded', this.onAttemptEnded);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			Dispatcher.off('assessment:endAttempt', this.onEndAttempt);
			Dispatcher.off('assessment:attemptEnded', this.onAttemptEnded);
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
		key: 'onEndAttempt',
		value: function onEndAttempt() {
			this.setState({ isFetching: true });
		}
	}, {
		key: 'onAttemptEnded',
		value: function onAttemptEnded() {
			this.setState({ isFetching: false });
		}
	}, {
		key: 'isAttemptComplete',
		value: function isAttemptComplete() {
			return AssessmentUtil.isCurrentAttemptComplete(this.props.moduleData.assessmentState, this.props.moduleData.questionState, this.props.model, this.props.moduleData.navState.context);
		}
	}, {
		key: 'isAssessmentComplete',
		value: function isAssessmentComplete() {
			return !AssessmentUtil.hasAttemptsRemaining(this.props.moduleData.assessmentState, this.props.model);
		}
	}, {
		key: 'onClickSubmit',
		value: function onClickSubmit() {
			// disable multiple clicks
			if (this.state.isFetching) return;

			if (!this.isAttemptComplete()) {
				ModalUtil.show(React.createElement(_attemptIncompleteDialog2.default, { onSubmit: this.endAttempt }));
				return;
			}
			return this.endAttempt();
		}
	}, {
		key: 'endAttempt',
		value: function endAttempt() {
			return AssessmentUtil.endAttempt(this.props.model, this.props.moduleData.navState.context);
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

			var assessmentScore = AssessmentUtil.getAssessmentScoreForModel(this.props.moduleData.assessmentState, this.props.model);
			var ltiState = AssessmentUtil.getLTIStateForModel(this.props.moduleData.assessmentState, this.props.model);

			var childEl = function () {
				switch (_this2.getCurrentStep()) {
					case 'pre-test':
						return (0, _preTest2.default)({
							model: _this2.props.model.children.at(0),
							moduleData: _this2.props.moduleData
						});

					case 'test':
						return (0, _test2.default)({
							model: _this2.props.model.children.at(1),
							moduleData: _this2.props.moduleData,
							onClickSubmit: _this2.onClickSubmit,
							isAttemptComplete: _this2.isAttemptComplete(),
							isFetching: _this2.state.isFetching
						});

					case 'post-test':
						return (0, _postTest2.default)({
							model: _this2.props.model,
							moduleData: _this2.props.moduleData,
							scoreAction: _this2.getScoreAction()
						});

					default:
						return null;
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

/***/ 242:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var startOfDay = __webpack_require__(251);

var MILLISECONDS_IN_MINUTE = 60000;
var MILLISECONDS_IN_DAY = 86400000;

/**
 * @category Day Helpers
 * @summary Get the number of calendar days between the given dates.
 *
 * @description
 * Get the number of calendar days between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar days
 *
 * @example
 * // How many calendar days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * var result = differenceInCalendarDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 366
 */
function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
  var startOfDayLeft = startOfDay(dirtyDateLeft);
  var startOfDayRight = startOfDay(dirtyDateRight);

  var timestampLeft = startOfDayLeft.getTime() - startOfDayLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
  var timestampRight = startOfDayRight.getTime() - startOfDayRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a day is not constant
  // (e.g. it's different in the day of the daylight saving time clock shift)
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);
}

module.exports = differenceInCalendarDays;

/***/ }),

/***/ 243:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getDayOfYear = __webpack_require__(244);
var getISOWeek = __webpack_require__(245);
var getISOYear = __webpack_require__(99);
var parse = __webpack_require__(17);
var isValid = __webpack_require__(246);
var enLocale = __webpack_require__(250);

/**
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format.
 *
 * Accepted tokens:
 * | Unit                    | Token | Result examples                  |
 * |-------------------------|-------|----------------------------------|
 * | Month                   | M     | 1, 2, ..., 12                    |
 * |                         | Mo    | 1st, 2nd, ..., 12th              |
 * |                         | MM    | 01, 02, ..., 12                  |
 * |                         | MMM   | Jan, Feb, ..., Dec               |
 * |                         | MMMM  | January, February, ..., December |
 * | Quarter                 | Q     | 1, 2, 3, 4                       |
 * |                         | Qo    | 1st, 2nd, 3rd, 4th               |
 * | Day of month            | D     | 1, 2, ..., 31                    |
 * |                         | Do    | 1st, 2nd, ..., 31st              |
 * |                         | DD    | 01, 02, ..., 31                  |
 * | Day of year             | DDD   | 1, 2, ..., 366                   |
 * |                         | DDDo  | 1st, 2nd, ..., 366th             |
 * |                         | DDDD  | 001, 002, ..., 366               |
 * | Day of week             | d     | 0, 1, ..., 6                     |
 * |                         | do    | 0th, 1st, ..., 6th               |
 * |                         | dd    | Su, Mo, ..., Sa                  |
 * |                         | ddd   | Sun, Mon, ..., Sat               |
 * |                         | dddd  | Sunday, Monday, ..., Saturday    |
 * | Day of ISO week         | E     | 1, 2, ..., 7                     |
 * | ISO week                | W     | 1, 2, ..., 53                    |
 * |                         | Wo    | 1st, 2nd, ..., 53rd              |
 * |                         | WW    | 01, 02, ..., 53                  |
 * | Year                    | YY    | 00, 01, ..., 99                  |
 * |                         | YYYY  | 1900, 1901, ..., 2099            |
 * | ISO week-numbering year | GG    | 00, 01, ..., 99                  |
 * |                         | GGGG  | 1900, 1901, ..., 2099            |
 * | AM/PM                   | A     | AM, PM                           |
 * |                         | a     | am, pm                           |
 * |                         | aa    | a.m., p.m.                       |
 * | Hour                    | H     | 0, 1, ... 23                     |
 * |                         | HH    | 00, 01, ... 23                   |
 * |                         | h     | 1, 2, ..., 12                    |
 * |                         | hh    | 01, 02, ..., 12                  |
 * | Minute                  | m     | 0, 1, ..., 59                    |
 * |                         | mm    | 00, 01, ..., 59                  |
 * | Second                  | s     | 0, 1, ..., 59                    |
 * |                         | ss    | 00, 01, ..., 59                  |
 * | 1/10 of second          | S     | 0, 1, ..., 9                     |
 * | 1/100 of second         | SS    | 00, 01, ..., 99                  |
 * | Millisecond             | SSS   | 000, 001, ..., 999               |
 * | Timezone                | Z     | -01:00, +00:00, ... +12:00       |
 * |                         | ZZ    | -0100, +0000, ..., +1200         |
 * | Seconds timestamp       | X     | 512969520                        |
 * | Milliseconds timestamp  | x     | 512969520900                     |
 *
 * The characters wrapped in square brackets are escaped.
 *
 * The result may vary by locale.
 *
 * @param {Date|String|Number} date - the original date
 * @param {String} [format='YYYY-MM-DDTHH:mm:ss.SSSZ'] - the string of tokens
 * @param {Object} [options] - the object with options
 * @param {Object} [options.locale=enLocale] - the locale object
 * @returns {String} the formatted date string
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * var result = format(
 *   new Date(2014, 1, 11),
 *   'MM/DD/YYYY'
 * )
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * var eoLocale = require('date-fns/locale/eo')
 * var result = format(
 *   new Date(2014, 6, 2),
 *   'Do [de] MMMM YYYY',
 *   {locale: eoLocale}
 * )
 * //=> '2-a de julio 2014'
 */
function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
  var formatStr = dirtyFormatStr ? String(dirtyFormatStr) : 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  var options = dirtyOptions || {};

  var locale = options.locale;
  var localeFormatters = enLocale.format.formatters;
  var formattingTokensRegExp = enLocale.format.formattingTokensRegExp;
  if (locale && locale.format && locale.format.formatters) {
    localeFormatters = locale.format.formatters;

    if (locale.format.formattingTokensRegExp) {
      formattingTokensRegExp = locale.format.formattingTokensRegExp;
    }
  }

  var date = parse(dirtyDate);

  if (!isValid(date)) {
    return 'Invalid Date';
  }

  var formatFn = buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp);

  return formatFn(date);
}

var formatters = {
  // Month: 1, 2, ..., 12
  'M': function M(date) {
    return date.getMonth() + 1;
  },

  // Month: 01, 02, ..., 12
  'MM': function MM(date) {
    return addLeadingZeros(date.getMonth() + 1, 2);
  },

  // Quarter: 1, 2, 3, 4
  'Q': function Q(date) {
    return Math.ceil((date.getMonth() + 1) / 3);
  },

  // Day of month: 1, 2, ..., 31
  'D': function D(date) {
    return date.getDate();
  },

  // Day of month: 01, 02, ..., 31
  'DD': function DD(date) {
    return addLeadingZeros(date.getDate(), 2);
  },

  // Day of year: 1, 2, ..., 366
  'DDD': function DDD(date) {
    return getDayOfYear(date);
  },

  // Day of year: 001, 002, ..., 366
  'DDDD': function DDDD(date) {
    return addLeadingZeros(getDayOfYear(date), 3);
  },

  // Day of week: 0, 1, ..., 6
  'd': function d(date) {
    return date.getDay();
  },

  // Day of ISO week: 1, 2, ..., 7
  'E': function E(date) {
    return date.getDay() || 7;
  },

  // ISO week: 1, 2, ..., 53
  'W': function W(date) {
    return getISOWeek(date);
  },

  // ISO week: 01, 02, ..., 53
  'WW': function WW(date) {
    return addLeadingZeros(getISOWeek(date), 2);
  },

  // Year: 00, 01, ..., 99
  'YY': function YY(date) {
    return addLeadingZeros(date.getFullYear(), 4).substr(2);
  },

  // Year: 1900, 1901, ..., 2099
  'YYYY': function YYYY(date) {
    return addLeadingZeros(date.getFullYear(), 4);
  },

  // ISO week-numbering year: 00, 01, ..., 99
  'GG': function GG(date) {
    return String(getISOYear(date)).substr(2);
  },

  // ISO week-numbering year: 1900, 1901, ..., 2099
  'GGGG': function GGGG(date) {
    return getISOYear(date);
  },

  // Hour: 0, 1, ... 23
  'H': function H(date) {
    return date.getHours();
  },

  // Hour: 00, 01, ..., 23
  'HH': function HH(date) {
    return addLeadingZeros(date.getHours(), 2);
  },

  // Hour: 1, 2, ..., 12
  'h': function h(date) {
    var hours = date.getHours();
    if (hours === 0) {
      return 12;
    } else if (hours > 12) {
      return hours % 12;
    } else {
      return hours;
    }
  },

  // Hour: 01, 02, ..., 12
  'hh': function hh(date) {
    return addLeadingZeros(formatters['h'](date), 2);
  },

  // Minute: 0, 1, ..., 59
  'm': function m(date) {
    return date.getMinutes();
  },

  // Minute: 00, 01, ..., 59
  'mm': function mm(date) {
    return addLeadingZeros(date.getMinutes(), 2);
  },

  // Second: 0, 1, ..., 59
  's': function s(date) {
    return date.getSeconds();
  },

  // Second: 00, 01, ..., 59
  'ss': function ss(date) {
    return addLeadingZeros(date.getSeconds(), 2);
  },

  // 1/10 of second: 0, 1, ..., 9
  'S': function S(date) {
    return Math.floor(date.getMilliseconds() / 100);
  },

  // 1/100 of second: 00, 01, ..., 99
  'SS': function SS(date) {
    return addLeadingZeros(Math.floor(date.getMilliseconds() / 10), 2);
  },

  // Millisecond: 000, 001, ..., 999
  'SSS': function SSS(date) {
    return addLeadingZeros(date.getMilliseconds(), 3);
  },

  // Timezone: -01:00, +00:00, ... +12:00
  'Z': function Z(date) {
    return formatTimezone(date.getTimezoneOffset(), ':');
  },

  // Timezone: -0100, +0000, ... +1200
  'ZZ': function ZZ(date) {
    return formatTimezone(date.getTimezoneOffset());
  },

  // Seconds timestamp: 512969520
  'X': function X(date) {
    return Math.floor(date.getTime() / 1000);
  },

  // Milliseconds timestamp: 512969520900
  'x': function x(date) {
    return date.getTime();
  }
};

function buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp) {
  var array = formatStr.match(formattingTokensRegExp);
  var length = array.length;

  var i;
  var formatter;
  for (i = 0; i < length; i++) {
    formatter = localeFormatters[array[i]] || formatters[array[i]];
    if (formatter) {
      array[i] = formatter;
    } else {
      array[i] = removeFormattingTokens(array[i]);
    }
  }

  return function (date) {
    var output = '';
    for (var i = 0; i < length; i++) {
      if (array[i] instanceof Function) {
        output += array[i](date, formatters);
      } else {
        output += array[i];
      }
    }
    return output;
  };
}

function removeFormattingTokens(input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|]$/g, '');
  }
  return input.replace(/\\/g, '');
}

function formatTimezone(offset, delimeter) {
  delimeter = delimeter || '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  return sign + addLeadingZeros(hours, 2) + delimeter + addLeadingZeros(minutes, 2);
}

function addLeadingZeros(number, targetLength) {
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}

module.exports = format;

/***/ }),

/***/ 244:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(17);
var startOfYear = __webpack_require__(254);
var differenceInCalendarDays = __webpack_require__(242);

/**
 * @category Day Helpers
 * @summary Get the day of the year of the given date.
 *
 * @description
 * Get the day of the year of the given date.
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the day of year
 *
 * @example
 * // Which day of the year is 2 July 2014?
 * var result = getDayOfYear(new Date(2014, 6, 2))
 * //=> 183
 */
function getDayOfYear(dirtyDate) {
  var date = parse(dirtyDate);
  var diff = differenceInCalendarDays(date, startOfYear(date));
  var dayOfYear = diff + 1;
  return dayOfYear;
}

module.exports = getDayOfYear;

/***/ }),

/***/ 245:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(17);
var startOfISOWeek = __webpack_require__(62);
var startOfISOYear = __webpack_require__(252);

var MILLISECONDS_IN_WEEK = 604800000;

/**
 * @category ISO Week Helpers
 * @summary Get the ISO week of the given date.
 *
 * @description
 * Get the ISO week of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the ISO week
 *
 * @example
 * // Which week of the ISO-week numbering year is 2 January 2005?
 * var result = getISOWeek(new Date(2005, 0, 2))
 * //=> 53
 */
function getISOWeek(dirtyDate) {
  var date = parse(dirtyDate);
  var diff = startOfISOWeek(date).getTime() - startOfISOYear(date).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

module.exports = getISOWeek;

/***/ }),

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isDate = __webpack_require__(100);

/**
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @param {Date} date - the date to check
 * @returns {Boolean} the date is valid
 * @throws {TypeError} argument must be an instance of Date
 *
 * @example
 * // For the valid date:
 * var result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the invalid date:
 * var result = isValid(new Date(''))
 * //=> false
 */
function isValid(dirtyDate) {
  if (isDate(dirtyDate)) {
    return !isNaN(dirtyDate);
  } else {
    throw new TypeError(toString.call(dirtyDate) + ' is not an instance of Date');
  }
}

module.exports = isValid;

/***/ }),

/***/ 247:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var commonFormatterKeys = ['M', 'MM', 'Q', 'D', 'DD', 'DDD', 'DDDD', 'd', 'E', 'W', 'WW', 'YY', 'YYYY', 'GG', 'GGGG', 'H', 'HH', 'h', 'hh', 'm', 'mm', 's', 'ss', 'S', 'SS', 'SSS', 'Z', 'ZZ', 'X', 'x'];

function buildFormattingTokensRegExp(formatters) {
  var formatterKeys = [];
  for (var key in formatters) {
    if (formatters.hasOwnProperty(key)) {
      formatterKeys.push(key);
    }
  }

  var formattingTokens = commonFormatterKeys.concat(formatterKeys).sort().reverse();
  var formattingTokensRegExp = new RegExp('(\\[[^\\[]*\\])|(\\\\)?' + '(' + formattingTokens.join('|') + '|.)', 'g');

  return formattingTokensRegExp;
}

module.exports = buildFormattingTokensRegExp;

/***/ }),

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function buildDistanceInWordsLocale() {
  var distanceInWordsLocale = {
    lessThanXSeconds: {
      one: 'less than a second',
      other: 'less than {{count}} seconds'
    },

    xSeconds: {
      one: '1 second',
      other: '{{count}} seconds'
    },

    halfAMinute: 'half a minute',

    lessThanXMinutes: {
      one: 'less than a minute',
      other: 'less than {{count}} minutes'
    },

    xMinutes: {
      one: '1 minute',
      other: '{{count}} minutes'
    },

    aboutXHours: {
      one: 'about 1 hour',
      other: 'about {{count}} hours'
    },

    xHours: {
      one: '1 hour',
      other: '{{count}} hours'
    },

    xDays: {
      one: '1 day',
      other: '{{count}} days'
    },

    aboutXMonths: {
      one: 'about 1 month',
      other: 'about {{count}} months'
    },

    xMonths: {
      one: '1 month',
      other: '{{count}} months'
    },

    aboutXYears: {
      one: 'about 1 year',
      other: 'about {{count}} years'
    },

    xYears: {
      one: '1 year',
      other: '{{count}} years'
    },

    overXYears: {
      one: 'over 1 year',
      other: 'over {{count}} years'
    },

    almostXYears: {
      one: 'almost 1 year',
      other: 'almost {{count}} years'
    }
  };

  function localize(token, count, options) {
    options = options || {};

    var result;
    if (typeof distanceInWordsLocale[token] === 'string') {
      result = distanceInWordsLocale[token];
    } else if (count === 1) {
      result = distanceInWordsLocale[token].one;
    } else {
      result = distanceInWordsLocale[token].other.replace('{{count}}', count);
    }

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return 'in ' + result;
      } else {
        return result + ' ago';
      }
    }

    return result;
  }

  return {
    localize: localize
  };
}

module.exports = buildDistanceInWordsLocale;

/***/ }),

/***/ 249:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var buildFormattingTokensRegExp = __webpack_require__(247);

function buildFormatLocale() {
  // Note: in English, the names of days of the week and months are capitalized.
  // If you are making a new locale based on this one, check if the same is true for the language you're working on.
  // Generally, formatted dates should look like they are in the middle of a sentence,
  // e.g. in Spanish language the weekdays and months should be in the lowercase.
  var months3char = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var weekdays2char = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var weekdays3char = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var meridiemUppercase = ['AM', 'PM'];
  var meridiemLowercase = ['am', 'pm'];
  var meridiemFull = ['a.m.', 'p.m.'];

  var formatters = {
    // Month: Jan, Feb, ..., Dec
    'MMM': function MMM(date) {
      return months3char[date.getMonth()];
    },

    // Month: January, February, ..., December
    'MMMM': function MMMM(date) {
      return monthsFull[date.getMonth()];
    },

    // Day of week: Su, Mo, ..., Sa
    'dd': function dd(date) {
      return weekdays2char[date.getDay()];
    },

    // Day of week: Sun, Mon, ..., Sat
    'ddd': function ddd(date) {
      return weekdays3char[date.getDay()];
    },

    // Day of week: Sunday, Monday, ..., Saturday
    'dddd': function dddd(date) {
      return weekdaysFull[date.getDay()];
    },

    // AM, PM
    'A': function A(date) {
      return date.getHours() / 12 >= 1 ? meridiemUppercase[1] : meridiemUppercase[0];
    },

    // am, pm
    'a': function a(date) {
      return date.getHours() / 12 >= 1 ? meridiemLowercase[1] : meridiemLowercase[0];
    },

    // a.m., p.m.
    'aa': function aa(date) {
      return date.getHours() / 12 >= 1 ? meridiemFull[1] : meridiemFull[0];
    }

    // Generate ordinal version of formatters: M -> Mo, D -> Do, etc.
  };var ordinalFormatters = ['M', 'D', 'DDD', 'd', 'Q', 'W'];
  ordinalFormatters.forEach(function (formatterToken) {
    formatters[formatterToken + 'o'] = function (date, formatters) {
      return ordinal(formatters[formatterToken](date));
    };
  });

  return {
    formatters: formatters,
    formattingTokensRegExp: buildFormattingTokensRegExp(formatters)
  };
}

function ordinal(number) {
  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st';
      case 2:
        return number + 'nd';
      case 3:
        return number + 'rd';
    }
  }
  return number + 'th';
}

module.exports = buildFormatLocale;

/***/ }),

/***/ 250:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var buildDistanceInWordsLocale = __webpack_require__(248);
var buildFormatLocale = __webpack_require__(249);

/**
 * @category Locales
 * @summary English locale.
 */
module.exports = {
  distanceInWords: buildDistanceInWordsLocale(),
  format: buildFormatLocale()
};

/***/ }),

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(17);

/**
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a day
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * var result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */
function startOfDay(dirtyDate) {
  var date = parse(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfDay;

/***/ }),

/***/ 252:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getISOYear = __webpack_require__(99);
var startOfISOWeek = __webpack_require__(62);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the start of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the start of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of an ISO year
 *
 * @example
 * // The start of an ISO week-numbering year for 2 July 2005:
 * var result = startOfISOYear(new Date(2005, 6, 2))
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfISOYear(dirtyDate) {
  var year = getISOYear(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuary);
  return date;
}

module.exports = startOfISOYear;

/***/ }),

/***/ 253:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(17);

/**
 * @category Week Helpers
 * @summary Return the start of a week for the given date.
 *
 * @description
 * Return the start of a week for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @param {Object} [options] - the object with options
 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Date} the start of a week
 *
 * @example
 * // The start of a week for 2 September 2014 11:55:00:
 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfWeek(dirtyDate, dirtyOptions) {
  var weekStartsOn = dirtyOptions ? Number(dirtyOptions.weekStartsOn) || 0 : 0;

  var date = parse(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfWeek;

/***/ }),

/***/ 254:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(17);

/**
 * @category Year Helpers
 * @summary Return the start of a year for the given date.
 *
 * @description
 * Return the start of a year for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of a year
 *
 * @example
 * // The start of a year for 2 September 2014 11:55:00:
 * var result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Jan 01 2014 00:00:00
 */
function startOfYear(dirtyDate) {
  var cleanDate = parse(dirtyDate);
  var date = new Date(0);
  date.setFullYear(cleanDate.getFullYear(), 0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = startOfYear;

/***/ }),

/***/ 256:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

* = Optional

Expected input for type 'attempt':
{
	type: 'attempt',
	*mods: Array<Mod> (Default = [])
}

Expected input for type 'pass-fail':
{
	type: 'pass-file',
	*passingAttemptScore: 0-100 [Default = 100],
	*passedResult: (0-100 | '$attempt_score') [Default = 100],
	*failedResult: (0-100 | 'no-score' | '$highest_attempt_score' ) [Default = 0],
	*unableToPassResult: (0-100 | 'no-score' | '$attempt_score' | '$highest_attempt_score' | null) [Default = null],
	*mods: Array<Mod> (Default = [])
}

Mod:

{
	attemptCondition: (Number | AttemptRange) [Default = '[1-$last_attempt]'],
	reward: Number
}

AttemptRange:
	("[" | "(") + (>=1 | '$last_attempt') + "," + (>=1 | '$last_attempt') + ("]" | ")")

(Mods are only applied if PASSING. Mods must contain at least one condition)

*/

//@TODO: Maybe shouldn't be importing this here since this file will someday be on the server
var _require = __webpack_require__(257),
    getParsedRange = _require.getParsedRange,
    tryGetParsedFloat = _require.tryGetParsedFloat,
    isValueInRange = _require.isValueInRange;

var MOD_AMOUNT_LIMIT = 20;

var getRubricType = function getRubricType(rubric) {
	return !rubric || !rubric.type ? AssessmentRubric.TYPE_ATTEMPT : rubric.type;
};

var createWhitelistedRubric = function createWhitelistedRubric(rubric) {
	var rubricType = getRubricType(rubric);

	var whitelistedRubric = void 0;

	switch (rubricType) {
		case AssessmentRubric.TYPE_PASS_FAIL:
			whitelistedRubric = Object.assign({
				passingAttemptScore: 100,
				passedResult: 100,
				failedResult: 0,
				unableToPassResult: null
			}, rubric);
			break;

		case AssessmentRubric.TYPE_ATTEMPT:
		default:
			whitelistedRubric = {
				passingAttemptScore: 0,
				passedResult: AssessmentRubric.VAR_ATTEMPT_SCORE,
				failedResult: 0,
				unableToPassResult: null
			};
			break;
	}

	return whitelistedRubric;
};

var createWhitelistedMod = function createWhitelistedMod(mod) {
	var parsedReward = void 0;

	// Ensure at least one condition exists:
	if (!mod.attemptCondition) {
		return null;
	}

	mod = Object.assign({
		attemptCondition: '[0,$last_attempt]'
		// dateCondition: null,
	}, mod);

	return {
		attemptCondition: getParsedRange(mod.attemptCondition.toString()),
		reward: mod.reward
	};
};

var modToObject = function modToObject(whitelistedMod) {
	return {
		attemptCondition: getRangeString(whitelistedMod.attemptCondition),
		reward: whitelistedMod.reward
	};
};

var getRangeString = function getRangeString(range) {
	if (range.min === range.max && range.isMinInclusive && range.isMaxInclusive) {
		return '' + range.min;
	}

	var lhs = range.isMinInclusive ? '[' : '(';
	var rhs = range.isMaxInclusive ? ']' : ')';

	return lhs + range.min + ',' + range.max + rhs;
};

var AssessmentRubric = function () {
	function AssessmentRubric(rubric) {
		_classCallCheck(this, AssessmentRubric);

		this.originalRubric = Object.assign(rubric || {});

		var mods = rubric && rubric.mods ? rubric.mods.slice(0, MOD_AMOUNT_LIMIT) : [];

		this.rubric = createWhitelistedRubric(rubric);
		this.type = getRubricType(rubric);
		this.mods = mods.map(createWhitelistedMod).filter(function (mod) {
			return mod !== null;
		});
	}

	_createClass(AssessmentRubric, [{
		key: 'toObject',
		value: function toObject() {
			return {
				type: this.type,
				passingAttemptScore: this.rubric.passingAttemptScore,
				passedResult: this.rubric.passedResult,
				failedResult: this.rubric.failedResult,
				unableToPassResult: this.rubric.unableToPassResult,
				mods: this.mods.map(modToObject)
			};
		}
	}, {
		key: 'clone',
		value: function clone() {
			return new AssessmentRubric(this.originalRubric);
		}
	}, {
		key: 'getAssessmentScoreInfoForAttempt',
		value: function getAssessmentScoreInfoForAttempt(totalNumberOfAttemptsAvailable, attemptScores) {
			if (attemptScores.length === 0) return null;
			if (totalNumberOfAttemptsAvailable !== Infinity && (!Number.isInteger(totalNumberOfAttemptsAvailable) || totalNumberOfAttemptsAvailable <= 0)) {
				throw new Error('totalNumberOfAttemptsAvailable must be 1 to Infinity!');
			}

			var highestAttemptScore = Math.max.apply(null, attemptScores);
			var highestAttemptNumber = attemptScores.reduce(function (iMax, x, i, arr) {
				return x >= arr[iMax] ? i : iMax;
			}, 0) + 1;
			var latestAttemptScore = attemptScores[attemptScores.length - 1];
			var attemptNumber = attemptScores.length;
			var isLastAttempt = attemptNumber === totalNumberOfAttemptsAvailable;

			var rewardedMods = [];
			var rewardedModsIndicies = [];
			var rewardTotal = 0;
			var assessmentScore = void 0;
			var status = void 0;

			var attemptReplaceDict = {};
			attemptReplaceDict[AssessmentRubric.VAR_LAST_ATTEMPT] = totalNumberOfAttemptsAvailable;

			var scoreReplaceDict = {};

			if (latestAttemptScore >= this.rubric.passingAttemptScore) {
				status = AssessmentRubric.STATUS_PASSED;
			} else if (isLastAttempt && this.rubric.unableToPassResult !== null && highestAttemptScore < this.rubric.passingAttemptScore) {
				status = AssessmentRubric.STATUS_UNABLE_TO_PASS;
			} else {
				status = AssessmentRubric.STATUS_FAILED;
			}

			switch (status) {
				case AssessmentRubric.STATUS_UNABLE_TO_PASS:
					scoreReplaceDict[AssessmentRubric.VAR_HIGHEST_ATTEMPT_SCORE] = highestAttemptScore;
					scoreReplaceDict[AssessmentRubric.NO_SCORE] = null;

					if (this.rubric.unableToPassResult === AssessmentRubric.VAR_HIGHEST_ATTEMPT_SCORE) {
						attemptNumber = highestAttemptNumber;
					}
					assessmentScore = tryGetParsedFloat(this.rubric.unableToPassResult, scoreReplaceDict, [null]);

					break;

				case AssessmentRubric.STATUS_FAILED:
					scoreReplaceDict[AssessmentRubric.NO_SCORE] = null;
					assessmentScore = tryGetParsedFloat(this.rubric.failedResult, scoreReplaceDict, [null]);
					break;

				case AssessmentRubric.STATUS_PASSED:
					scoreReplaceDict[AssessmentRubric.VAR_ATTEMPT_SCORE] = latestAttemptScore;
					assessmentScore = tryGetParsedFloat(this.rubric.passedResult, scoreReplaceDict, [null]);

					// find matching mods and apply them
					this.mods.forEach(function (mod, i) {
						if (isValueInRange(attemptNumber, mod.attemptCondition, attemptReplaceDict)) {
							rewardedMods.push(mod);
							rewardedModsIndicies.push(i);
						}
					});

					rewardTotal = rewardedMods.reduce(function (acc, mod) {
						return acc + tryGetParsedFloat(mod.reward);
					}, 0);
					break;
			}

			return {
				attemptNumber: attemptNumber,
				attemptScore: latestAttemptScore,
				assessmentScore: assessmentScore,
				rewardedMods: rewardedModsIndicies,
				rewardTotal: rewardTotal,
				assessmentModdedScore: assessmentScore === null ? null : Math.min(100, Math.max(0, assessmentScore + rewardTotal)),
				status: status
			};
		}
	}]);

	return AssessmentRubric;
}();

AssessmentRubric.TYPE_ATTEMPT = 'attempt';
AssessmentRubric.TYPE_PASS_FAIL = 'pass-fail';

AssessmentRubric.STATUS_PASSED = 'passed';
AssessmentRubric.STATUS_FAILED = 'failed';
AssessmentRubric.STATUS_UNABLE_TO_PASS = 'unableToPass';

AssessmentRubric.VAR_HIGHEST_ATTEMPT_SCORE = '$highest_attempt_score';
AssessmentRubric.VAR_ATTEMPT_SCORE = '$attempt_score';
AssessmentRubric.VAR_LAST_ATTEMPT = '$last_attempt';

AssessmentRubric.NO_SCORE = 'no-score';
// AssessmentRubric.VAR_CLOSE_DATE = '$close_date'

module.exports = AssessmentRubric;

/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getParsedRange = function getParsedRange(range) {
	if (typeof range === 'undefined' || range === null) return null;

	if (range.indexOf(',') === -1) return getParsedRangeFromSingleValue(range);

	var ints = range.replace(/[\(\[\)\] ]+/g, '');
	var rangeValues = ints.split(',');

	return {
		min: rangeValues[0],
		isMinInclusive: range.charAt(0) === '[',
		max: rangeValues[1],
		isMaxInclusive: range.charAt(range.length - 1) === ']'
	};
};

var getParsedRangeFromSingleValue = function getParsedRangeFromSingleValue(value) {
	if (typeof value === 'undefined' || value === null) return null;

	return {
		min: value,
		isMinInclusive: true,
		max: value,
		isMaxInclusive: true
	};
};

// replaceDict is an object of possibile replacements for `value`.
// For example, if replaceDict = { '$highest_score':100 } and `value` is '$highest_score' then
// `value` will be replaced with 100.
// nonParsedValueOrValues is a value or an array of values that won't be parsed by parseFloat.
// If `value` is one of these values then `value` is not parsed and simply returned.
// For example, if nonParsedValueOrValues is `[null, undefined]` and `value` is null
// then null is returned.
var tryGetParsedFloat = function tryGetParsedFloat(value) {
	var replaceDict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var nonParsedValueOrValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	var replaceDictValue = void 0;
	var nonParsedValues = void 0;

	if (!(nonParsedValueOrValues instanceof Array)) {
		nonParsedValues = [nonParsedValueOrValues];
	} else {
		nonParsedValues = nonParsedValueOrValues;
	}

	for (var placeholder in replaceDict) {
		if (value === placeholder) {
			value = replaceDict[placeholder];
			break;
		}
	}

	// If the value is an allowed non-numeric value then we don't parse it
	// and simply return it as is
	if (nonParsedValues.indexOf(value) > -1) return value;

	var parsedValue = parseFloat(value);

	if (!Number.isFinite(parsedValue) && parsedValue !== Infinity && parsedValue !== -Infinity) {
		throw new Error('Unable to parse "' + value + '": Got "' + parsedValue + '" - Unsure how to proceed');
	}

	return parsedValue;
};

var isValueInRange = function isValueInRange(value, range, replaceDict) {
	// By definition a value is not inside a null range
	if (range === null) return false;

	var isMinRequirementMet = void 0,
	    isMaxRequirementMet = void 0;

	var min = tryGetParsedFloat(range.min, replaceDict);
	var max = tryGetParsedFloat(range.max, replaceDict);

	if (range.isMinInclusive) {
		isMinRequirementMet = value >= min;
	} else {
		isMinRequirementMet = value > min;
	}

	if (range.isMaxInclusive) {
		isMaxRequirementMet = value <= max;
	} else {
		isMaxRequirementMet = value < max;
	}

	return isMinRequirementMet && isMaxRequirementMet;
};

module.exports = {
	getParsedRange: getParsedRange,
	getParsedRangeFromSingleValue: getParsedRangeFromSingleValue,
	tryGetParsedFloat: tryGetParsedFloat,
	isValueInRange: isValueInRange
};

/***/ }),

/***/ 280:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 281:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 301:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(118);


/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var startOfWeek = __webpack_require__(253);

/**
 * @category ISO Week Helpers
 * @summary Return the start of an ISO week for the given date.
 *
 * @description
 * Return the start of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the original date
 * @returns {Date} the start of an ISO week
 *
 * @example
 * // The start of an ISO week for 2 September 2014 11:55:00:
 * var result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfISOWeek(dirtyDate) {
  return startOfWeek(dirtyDate, { weekStartsOn: 1 });
}

module.exports = startOfISOWeek;

/***/ }),

/***/ 99:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(17);
var startOfISOWeek = __webpack_require__(62);

/**
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the ISO week-numbering year of the given date.
 *
 * @description
 * Get the ISO week-numbering year of the given date,
 * which always starts 3 days before the year's first Thursday.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param {Date|String|Number} date - the given date
 * @returns {Number} the ISO week-numbering year
 *
 * @example
 * // Which ISO-week numbering year is 2 January 2005?
 * var result = getISOYear(new Date(2005, 0, 2))
 * //=> 2004
 */
function getISOYear(dirtyDate) {
  var date = parse(dirtyDate);
  var year = date.getFullYear();

  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);

  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

module.exports = getISOYear;

/***/ })

/******/ });