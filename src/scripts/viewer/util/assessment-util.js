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

	getNumberOfAttemptsCompletedForModel(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment || assessment.attempts.length === 0) {
			return 0
		}

		return assessment.attempts.length
	},

	startAttempt(model) {
		return Dispatcher.trigger('assessment:startAttempt', {
			value: {
				id: model.get('id')
			}
		})
	},

	endAttempt(model) {
		return Dispatcher.trigger('assessment:endAttempt', {
			value: {
				id: model.get('id')
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
