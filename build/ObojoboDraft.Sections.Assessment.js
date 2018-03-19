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
/******/ 	return __webpack_require__(__webpack_require__.s = 280);
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

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _adapter = __webpack_require__(156);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(163);

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

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _scoreActions = __webpack_require__(159);

var _scoreActions2 = _interopRequireDefault(_scoreActions);

var _assessmentRubric = __webpack_require__(236);

var _assessmentRubric2 = _interopRequireDefault(_assessmentRubric);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Adapter = {
	construct: function construct(model, attrs) {
		// Default state.
		model.modelState.attempts = Infinity;
		model.modelState.review = 'never';
		model.modelState.scoreActions = new _scoreActions2.default();
		model.modelState.rubric = new _assessmentRubric2.default(attrs.content.rubric);

		// Set state if XML has the attributes.
		if (attrs && attrs.content) {
			model.modelState.attempts = attrs.content.attempts === 'unlimited' ? Infinity : parseInt(attrs.content.attempts, 10);
			model.modelState.review = attrs.content.review || 'never';
			model.modelState.scoreActions = new _scoreActions2.default(attrs.content.scoreActions || null);
		}
	},


	// model.modelState.assessmentState =
	// 	inTest: false
	// 	scores: []
	// 	currentScore: 0

	clone: function clone(model, _clone) {
		_clone.modelState.attempts = model.modelState.attempts;
		_clone.modelState.hideNav = model.modelState.hideNav;
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
		json.content.hideNav = model.modelState.hideNav;
		json.content.scoreActions = model.modelState.scoreActions.toObject();
		json.content.rubric = model.modelState.rubric.toObject();
	}
};
// @TODO: Importing from the server code, we shouldn't do this:
exports.default = Adapter;

/***/ }),

/***/ 157:
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

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(258);

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
				case 'ok_null_score_not_sent':
					return null;

				case 'ok_gradebook_matches_assessment_score':
					return this.renderSynced();

				default:
					return this.renderError();
			}
		}
	}, {
		key: 'renderSynced',
		value: function renderSynced() {
			var systemLabel = this.props.externalSystemLabel;

			return React.createElement(
				'div',
				{ className: 'obojobo-draft--sections--assessment--lti-status is-synced' },
				'\u2714 Your retained score of ' + Math.round(this.props.assessmentScore) + '% was sent to ' + systemLabel
			);
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

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScoreActions = function () {
	function ScoreActions(_actions) {
		_classCallCheck(this, ScoreActions);

		if (_actions == null) {
			_actions = [];
		}
		this._actions = _actions;
	}

	_createClass(ScoreActions, [{
		key: "getActionForScore",
		value: function getActionForScore(score) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(this._actions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var action = _step.value;

					if (score >= action.from && score <= action.to) {
						return action;
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

			return null;
		}
	}, {
		key: "toObject",
		value: function toObject() {
			return Object.assign([], this._actions);
		}
	}, {
		key: "clone",
		value: function clone() {
			return new ScoreActions(this.toObject());
		}
	}]);

	return ScoreActions;
}();

exports.default = ScoreActions;

/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _ltiStatus = __webpack_require__(158);

var _ltiStatus2 = _interopRequireDefault(_ltiStatus);

var _viewerComponentReview = __webpack_require__(65);

var _viewerComponentReview2 = _interopRequireDefault(_viewerComponentReview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboModel = _Common2.default.models.OboModel;
var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;

var Launch = _Common2.default.Launch;
var NavUtil = _Viewer2.default.util.NavUtil;

var scoreSubmittedView = function scoreSubmittedView(assessment) {
	var questionScores = AssessmentUtil.getLastAttemptScoresForModel(assessment.props.moduleData.assessmentState, assessment.props.model);
	var recentScore = AssessmentUtil.getLastAttemptScoreForModel(assessment.props.moduleData.assessmentState, assessment.props.model);
	var isAssessmentComplete = function isAssessmentComplete() {
		return !AssessmentUtil.hasAttemptsRemaining(assessment.props.moduleData.assessmentState, assessment.props.model);
	};
	var attemptsRemaining = AssessmentUtil.getAttemptsRemaining(assessment.props.moduleData.assessmentState, assessment.props.model);

	var scoreAction = assessment.getScoreAction();
	var numCorrect = AssessmentUtil.getNumCorrect(questionScores);

	var assessmentScore = AssessmentUtil.getAssessmentScoreForModel(assessment.props.moduleData.assessmentState, assessment.props.model);

	var onClickResendScore = function onClickResendScore() {
		AssessmentUtil.resendLTIScore(assessment.props.model);
	};

	var ltiState = AssessmentUtil.getLTIStateForModel(assessment.props.moduleData.assessmentState, assessment.props.model);

	var assessmentLabel = NavUtil.getNavLabelForModel(assessment.props.moduleData.navState, assessment.props.model);

	var childEl = void 0;

	if (scoreAction.page != null) {
		var pageModel = OboModel.create(scoreAction.page);
		pageModel.parent = assessment.props.model; //'@TODO - FIGURE OUT A BETTER WAY TO DO THIS - THIS IS NEEDED TO GET {{VARIABLES}} WORKING')
		var PageComponent = pageModel.getComponentClass();
		childEl = React.createElement(PageComponent, { model: pageModel, moduleData: assessment.props.moduleData });
	} else {
		childEl = React.createElement(
			'p',
			null,
			scoreAction.message
		);
	}

	var externalSystemLabel = assessment.props.moduleData.lti.outcomeServiceHostname;

	var showFullReview = function (reviewType) {
		switch (reviewType) {
			case 'always':
				return true;
			case 'never':
				return false;
			case 'afterAttempts':
				return isAssessmentComplete();
		}
	}(assessment.props.model.modelState.review);

	return React.createElement(
		'div',
		{ className: 'score unlock' },
		React.createElement(
			'div',
			{ className: 'results-bar' },
			React.createElement(
				'h1',
				null,
				assessmentLabel,
				' - How You Did'
			),
			React.createElement(
				'table',
				null,
				React.createElement(
					'thead',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'th',
							null,
							'Last Attempt Score'
						),
						React.createElement(
							'th',
							null,
							'Retained Score'
						),
						React.createElement(
							'th',
							null,
							'Attempts Remaining'
						)
					)
				),
				React.createElement(
					'tbody',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							null,
							Math.round(recentScore),
							'%'
						),
						React.createElement(
							'td',
							null,
							assessmentScore === null ? '--' : Math.round(assessmentScore),
							'%'
						),
						React.createElement(
							'td',
							null,
							attemptsRemaining
						)
					)
				)
			),
			React.createElement(_ltiStatus2.default, {
				ltiState: ltiState,
				externalSystemLabel: externalSystemLabel,
				onClickResendScore: onClickResendScore
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
			}
		),
		childEl,
		showFullReview ? (0, _viewerComponentReview2.default)(assessment) : React.createElement(
			'div',
			{ className: 'review' },
			React.createElement(
				'p',
				{ className: 'number-correct' },
				'You got ' + numCorrect + ' out of ' + questionScores.length + ' questions correct:'
			),
			questionScores.map(function (questionScore, index) {
				return questionResultView(assessment.props, questionScore, index);
			})
		)
	);
};

var questionResultView = function questionResultView(props, questionScore, index) {
	var questionModel = OboModel.models[questionScore.id];
	var QuestionComponent = questionModel.getComponentClass();

	return React.createElement(
		'div',
		{ key: index, className: questionScore.score === 100 ? 'is-correct' : 'is-not-correct' },
		React.createElement(
			'p',
			null,
			'Question ' + (index + 1) + ' - ' + (questionScore.score === 100 ? 'Correct:' : 'Incorrect:')
		),
		React.createElement(QuestionComponent, { model: questionModel, moduleData: props.moduleData, showContentOnly: true })
	);
};

exports.default = scoreSubmittedView;

/***/ }),

/***/ 161:
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

var Button = _Common2.default.components.Button;
var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;


var takingTestView = function takingTestView(assessment) {
	var moduleData = assessment.props.moduleData;
	var recentScore = AssessmentUtil.getLastAttemptScoreForModel(assessment.props.moduleData.assessmentState, assessment.props.model);
	var child = assessment.props.model.children.at(1);
	var Component = child.getComponentClass();
	return React.createElement(
		'div',
		{ className: 'test' },
		React.createElement(Component, {
			className: 'untested',
			model: child,
			moduleData: moduleData,
			showScore: recentScore !== null
		}),
		React.createElement(
			'div',
			{ className: 'submit-button' },
			React.createElement(Button, {
				onClick: assessment.onClickSubmit.bind(assessment),
				value: assessment.isAttemptComplete() ? 'Submit' : 'Submit (Not all questions have been answered)'
			})
		)
	);
};

exports.default = takingTestView;

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var untestedView = function untestedView(assessment) {
	var child = assessment.props.model.children.at(0);
	var Component = child.getComponentClass();

	return React.createElement(
		"div",
		{ className: "untested" },
		React.createElement(Component, { model: child, moduleData: assessment.props.moduleData })
	);
};

exports.default = untestedView;

/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(259);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _attemptIncompleteDialog = __webpack_require__(157);

var _attemptIncompleteDialog2 = _interopRequireDefault(_attemptIncompleteDialog);

var _viewerComponentUntested = __webpack_require__(162);

var _viewerComponentUntested2 = _interopRequireDefault(_viewerComponentUntested);

var _viewerComponentReview = __webpack_require__(65);

var _viewerComponentReview2 = _interopRequireDefault(_viewerComponentReview);

var _viewerComponentScoreSubmitted = __webpack_require__(160);

var _viewerComponentScoreSubmitted2 = _interopRequireDefault(_viewerComponentScoreSubmitted);

var _viewerComponentTakingTest = __webpack_require__(161);

var _viewerComponentTakingTest2 = _interopRequireDefault(_viewerComponentTakingTest);

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

		_this.state = { step: null };
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

			var recentScore = AssessmentUtil.getLastAttemptScoreForModel(this.props.moduleData.assessmentState, this.props.model);
			var assessmentScore = AssessmentUtil.getAssessmentScoreForModel(this.props.moduleData.assessmentState, this.props.model);
			var ltiState = AssessmentUtil.getLTIStateForModel(this.props.moduleData.assessmentState, this.props.model);

			var childEl = function () {
				switch (_this2.getCurrentStep()) {
					case 'untested':
						return (0, _viewerComponentUntested2.default)(_this2);

					case 'takingTest':
						return (0, _viewerComponentTakingTest2.default)(_this2);

					case 'scoreSubmitted':
						return (0, _viewerComponentScoreSubmitted2.default)(_this2);

					case 'review':
						return (0, _viewerComponentReview2.default)(_this2);

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

/***/ 236:
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

var MOD_AMOUNT_LIMIT = 20;

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

var getRangeString = function getRangeString(range) {
	if (range.min === range.max && range.isMinInclusive && range.isMaxInclusive) {
		return '' + range.min;
	}

	var lhs = range.isMinInclusive ? '[' : '(';
	var rhs = range.isMaxInclusive ? ']' : ')';

	return lhs + range.min + ',' + range.max + rhs;
};

var tryGetParsedFloat = function tryGetParsedFloat(value) {
	var replaceDict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var allowNull = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	var replaceDictValue = void 0;

	for (var placeholder in replaceDict) {
		if (value === placeholder) {
			replaceDictValue = replaceDict[placeholder];
			value = replaceDictValue === null ? null : parseFloat(replaceDictValue);
			break;
		}
	}

	if (allowNull && value === null) {
		return null;
	}

	var parsedValue = parseFloat(value);

	if (!Number.isFinite(parsedValue)) throw new Error('Unable to parse "' + value + '": Got "' + parsedValue + '" - Unsure how to proceed');

	return parsedValue;
};

var isValueInRange = function isValueInRange(value, range, replaceDict) {
	// By default a null range is defined to be all-inclusive
	if (range === null) return true;

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
			var attemptScore = void 0;

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
						attemptScore = highestAttemptScore;
					} else {
						attemptScore = latestAttemptScore;
					}
					assessmentScore = tryGetParsedFloat(this.rubric.unableToPassResult, scoreReplaceDict, true);

					break;

				case AssessmentRubric.STATUS_FAILED:
					scoreReplaceDict[AssessmentRubric.NO_SCORE] = null;

					attemptScore = latestAttemptScore;
					assessmentScore = tryGetParsedFloat(this.rubric.failedResult, scoreReplaceDict, true);
					break;

				case AssessmentRubric.STATUS_PASSED:
					scoreReplaceDict[AssessmentRubric.VAR_ATTEMPT_SCORE] = latestAttemptScore;

					attemptScore = latestAttemptScore;
					assessmentScore = tryGetParsedFloat(this.rubric.passedResult, scoreReplaceDict, true);

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
				attemptScore: attemptScore,
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

/***/ 258:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 259:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 280:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(114);


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssessmentUtil = _Viewer2.default.util.AssessmentUtil;
var NavUtil = _Viewer2.default.util.NavUtil;
var OboModel = _Common2.default.models.OboModel;


var assessmentReviewView = function assessmentReviewView(assessment) {
	var attemptReviewComponents = {};

	var attempts = AssessmentUtil.getAllAttempts(assessment.props.moduleData.assessmentState, assessment.props.model);

	var attemptReviewComponent = function attemptReviewComponent(attempt, assessment) {
		return React.createElement(
			'div',
			{ className: 'review' },
			React.createElement(
				'h1',
				null,
				'Attempt ' + attempt.attemptNumber
			),
			React.createElement(
				'h2',
				null,
				'Score: ' + attempt.attemptScore
			),
			attempt.questionScores.map(function (scoreObj) {
				var questionModel = OboModel.models[scoreObj.id];
				var QuestionComponent = questionModel.getComponentClass();
				return React.createElement(QuestionComponent, {
					model: questionModel,
					moduleData: assessment.props.moduleData,
					mode: 'review'
				});
			})
		);
	};

	attempts.forEach(function (attempt) {
		attemptReviewComponents['assessmentReview:' + attempt.attemptId] = attemptReviewComponent(attempt, assessment);
	});

	var context = assessment.props.moduleData.navState.context;
	if (context.split(':')[0] !== 'assessmentReview')
		// show most recent attempt
		NavUtil.setContext('assessmentReview:' + attempts[attempts.length - 1].attemptId);

	var attemptButtons = attempts.map(function (attempt, index) {
		return React.createElement(
			'button',
			{ onClick: function onClick() {
					return NavUtil.setContext('assessmentReview:' + attempt.attemptId);
				} },
			'Attempt #',
			attempt.attemptNumber
		);
	});

	return React.createElement(
		'div',
		{ className: 'score unlock' },
		attemptButtons,
		attemptReviewComponents[context],
		attemptButtons
	);
};

exports.default = assessmentReviewView;

/***/ })

/******/ });