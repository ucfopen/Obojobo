import Common from 'Common'

let { Dispatcher } = Common.flux

import QuestionUtil from '../../viewer/util/question-util'

var AssessmentUtil = {
	getAssessmentForModel(state, model) {
		let assessmentModel
		if (model.get('type') === 'ObojoboDraft.Sections.Assessment') {
			assessmentModel = model
		} else {
			assessmentModel = model.getParentOfType('ObojoboDraft.Sections.Assessment')
		}

		if (!assessmentModel) {
			return null
		}

		let assessment = state.assessments[assessmentModel.get('id')]
		if (!assessment) {
			return null
		}

		return assessment
	},

	getLastAttemptScoreForModel(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		if (assessment.attempts.length === 0) {
			return 0
		}

		return assessment.attempts[assessment.attempts.length - 1].attemptScore
	},

	getAssessmentScoreForModel(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		return assessment.score
	},

	getLastAttemptScoresForModel(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		if (assessment.attempts.length === 0) {
			return []
		}

		return assessment.attempts[assessment.attempts.length - 1].questionScores
	},

	getCurrentAttemptForModel(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		return assessment.current
	},

	getAllAttempts(state, model) {
		return this.getAssessmentForModel(state, model).attempts
	},

	getAttemptsRemaining(state, model) {
		return Math.max(
			model.modelState.attempts - this.getNumberOfAttemptsCompletedForModel(state, model),
			0
		)
	},

	hasAttemptsRemaining(state, model) {
		return model.modelState.attempts - this.getNumberOfAttemptsCompletedForModel(state, model) > 0
	},

	getLTIStateForModel(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		return {
			state: assessment.lti,
			networkState: assessment.ltiNetworkState,
			errorCount: assessment.ltiErrorCount
		}
	},

	isLTIScoreNeedingToBeResynced(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)

		if (!assessment || !assessment.lti || !assessment.lti.gradebookStatus) {
			return false
		}

		switch (assessment.lti.gradebookStatus) {
			case 'ok_no_outcome_service':
			case 'ok_gradebook_matches_assessment_score':
			case 'ok_null_score_not_sent':
				return false

			default:
				return true
		}
	},

	isCurrentAttemptComplete(assessmentState, questionState, model, context) {
		let current = AssessmentUtil.getCurrentAttemptForModel(assessmentState, model)
		if (!current) {
			return null
		}
		let models = model.children.at(1).children.models
		return (
			models.filter(function(questionModel) {
				let resp = QuestionUtil.getResponse(questionState, questionModel, context)
				return resp
			}).length === models.length
		)
	},

	getNumberOfAttemptsCompletedForModel(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment || assessment.attempts.length === 0) {
			return 0
		}

		return assessment.attempts.length
	},

	getNumCorrect(questionScores) {
		return questionScores.reduce(
			function(acc, questionScore) {
				let n = 0
				if (parseInt(questionScore.score, 10) === 100) {
					n = 1
				}
				return parseInt(acc, 10) + n
			},
			[0]
		)
	},

	startAttempt(model) {
		return Dispatcher.trigger('assessment:startAttempt', {
			value: {
				id: model.get('id')
			}
		})
	},

	endAttempt(model, context) {
		return Dispatcher.trigger('assessment:endAttempt', {
			value: {
				id: model.get('id'),
				context
			}
		})
	},

	resendLTIScore(model) {
		return Dispatcher.trigger('assessment:resendLTIScore', {
			value: {
				id: model.get('id')
			}
		})
	}
}

export default AssessmentUtil
