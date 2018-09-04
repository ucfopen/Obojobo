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

	getLastAttemptForModel(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		if (assessment.attempts.length === 0) {
			return 0
		}

		return assessment.attempts[assessment.attempts.length - 1]
	},

	getHighestAttemptsForModelByAssessmentScore(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return []
		}

		return assessment.highestAssessmentScoreAttempts
	},

	getHighestAttemptsForModelByAttemptScore(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return []
		}

		return assessment.highestAttemptScoreAttempts
	},

	getAssessmentScoreForModel(state, model) {
		let attempts = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(state, model)
		if (attempts.length === 0) {
			return null
		}

		return attempts[0].assessmentScore
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

	getResponseCount(questionModels, questionState, context) {
		const count = (acc, questionModel) => {
			if (QuestionUtil.getResponse(questionState, questionModel, context)) {
				return acc + 1
			}
		}

		return questionModels.reduce(count, 0)
	},

	isCurrentAttemptComplete(assessmentState, questionState, model, context) {
		// exit if there is no current attempt
		if (!AssessmentUtil.getCurrentAttemptForModel(assessmentState, model)) {
			return null
		}

		const models = model.children.at(1).children.models
		const responseCount = this.getResponseCount(models, questionState, context)

		// is complete if the number of answered questions is
		// equal to the total number of questions
		return responseCount === models.length
	},

	isInAssessment(state) {
		if (!state) return false

		for (let assessmentName in state.assessments) {
			if (state.assessments[assessmentName].current !== null) {
				return true
			}
		}

		return false
	},

	getNumberOfAttemptsCompletedForModel(state, model) {
		let assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment || assessment.attempts.length === 0) {
			return 0
		}

		return assessment.attempts.length
	},

	getNumCorrect(questionScores) {
		const count100s = (acc, qs) => acc + (parseInt(qs.score, 10) === 100 ? 1 : 0)
		return questionScores.reduce(count100s, 0)
	},

	findHighestAttempts(attempts, scoreProperty) {
		if (attempts.length === 0) return []

		let attemptsByScore = {}
		let highestScore = -1

		attempts.forEach(attempt => {
			let score = attempt[scoreProperty] === null ? -1 : attempt[scoreProperty]

			if (score > highestScore) {
				highestScore = score
			}

			if (!attemptsByScore[score]) {
				attemptsByScore[score] = []
			}

			attemptsByScore[score].push(attempt)
		})

		return attemptsByScore[highestScore]
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
