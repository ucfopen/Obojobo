import Common from 'Common'

const { Dispatcher } = Common.flux

import QuestionUtil from '../util/question-util'
import QuestionResponseSendStates from '../stores/question-store/question-response-send-states'
import CurrentAssessmentStates from './current-assessment-states'

const AssessmentUtil = {
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

		const assessment = state.assessments[assessmentModel.get('id')]
		if (!assessment) {
			return null
		}

		return assessment
	},

	getAssessmentMachineForModel(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		return state.machines[assessment.id] || null
	},

	getAssessmentMachineStateForModel(state, model) {
		const machine = AssessmentUtil.getAssessmentMachineForModel(state, model)
		if (!machine) {
			return null
		}

		return machine.getCurrentState()
	},

	getLastAttemptForModel(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		if (assessment.attempts.length === 0) {
			return 0
		}

		return assessment.attempts[assessment.attempts.length - 1]
	},

	getHighestAttemptsForModelByAssessmentScore(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return []
		}

		return assessment.highestAssessmentScoreAttempts
	},

	getHighestAttemptsForModelByAttemptScore(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return []
		}

		return assessment.highestAttemptScoreAttempts
	},

	getAssessmentScoreForModel(state, model) {
		const attempts = AssessmentUtil.getHighestAttemptsForModelByAssessmentScore(state, model)

		if (attempts.length === 0) {
			return null
		}

		return attempts[0].assessmentScore
	},

	getLastAttemptScoresForModel(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		if (assessment.attempts.length === 0) {
			return []
		}

		return assessment.attempts[assessment.attempts.length - 1].questionScores
	},

	getAssessmentStateForModel(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		return assessment.state
	},

	getCurrentAttemptForModel(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
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
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		return {
			state: assessment.lti,
			networkState: assessment.ltiNetworkState,
			resyncState: assessment.ltiResyncState
		}
	},

	getAssessmentStep(state, model) {
		const machine = AssessmentUtil.getAssessmentMachineForModel(state, model)
		if (!machine) {
			return null
		}

		return machine.step
	},

	isLTIScoreNeedingToBeResynced(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)

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
			return acc
		}

		return questionModels.reduce(count, 0)
	},

	getRecordedResponseCount(questionModels, questionState, context) {
		const count = (acc, questionModel) => {
			if (QuestionUtil.isResponseRecorded(questionState, questionModel, context)) {
				return acc + 1
			}
			return acc
		}

		return questionModels.reduce(count, 0)
	},

	getCurrentAttemptQuestionsStatus(assessmentState, questionState, model, context) {
		// exit if there is no current attempt
		if (!AssessmentUtil.getCurrentAttemptForModel(assessmentState, model)) {
			return null
		}

		const questionModels = model.children.at(1).children.models

		const questionStatuses = {
			all: questionModels,
			unanswered: [],
			empty: [],
			notSent: [],
			recorded: [],
			error: [],
			sending: [],
			unknown: []
		}

		questionModels.forEach(questionModel => {
			if (!QuestionUtil.hasResponse(questionState, questionModel, context)) {
				questionStatuses.unanswered.push(questionModel)
				return
			}

			if (QuestionUtil.isResponseEmpty(questionState, questionModel, context)) {
				questionStatuses.empty.push(questionModel)
				return
			}

			const sendState = QuestionUtil.getResponseSendState(questionState, questionModel, context)

			switch (sendState) {
				case QuestionResponseSendStates.RECORDED:
					questionStatuses.recorded.push(questionModel)
					break

				case QuestionResponseSendStates.SENDING:
					questionStatuses.sending.push(questionModel)
					break

				case QuestionResponseSendStates.NOT_SENT:
					questionStatuses.notSent.push(questionModel)
					break

				case QuestionResponseSendStates.ERROR:
					questionStatuses.error.push(questionModel)
					break

				default:
					questionStatuses.unknown.push(questionModel)
					break
			}
		})

		return questionStatuses
	},

	getCurrentAttemptStatus(assessmentState, questionState, model, context) {
		const questionStatuses = AssessmentUtil.getCurrentAttemptQuestionsStatus(
			assessmentState,
			questionState,
			model,
			context
		)

		if (!questionStatuses) {
			return CurrentAssessmentStates.NO_ATTEMPT
		}

		if (questionStatuses.all.length === 0) {
			return CurrentAssessmentStates.NO_QUESTIONS
		}

		if (questionStatuses.unknown.length > 0) {
			return CurrentAssessmentStates.HAS_RESPONSES_WITH_UNKNOWN_SEND_STATES
		}

		if (questionStatuses.unanswered.length > 0) {
			return CurrentAssessmentStates.HAS_QUESTIONS_UNANSWERED
		}

		if (questionStatuses.empty.length > 0) {
			return CurrentAssessmentStates.HAS_QUESTIONS_EMPTY
		}

		if (questionStatuses.notSent.length > 0) {
			return CurrentAssessmentStates.HAS_RESPONSES_UNSENT
		}

		if (questionStatuses.error.length > 0) {
			return CurrentAssessmentStates.HAS_RESPONSES_WITH_ERROR_SEND_STATES
		}

		if (questionStatuses.sending.length > 0) {
			return CurrentAssessmentStates.HAS_RESPONSES_SENDING
		}

		if (questionStatuses.recorded.length === questionStatuses.all.length) {
			return CurrentAssessmentStates.READY_TO_SUBMIT
		}

		return CurrentAssessmentStates.UNKNOWN
	},

	// isCurrentAttemptComplete(assessmentState, questionState, model, context) {
	// 	const questionStatuses = AssessmentUtil.getCurrentAttemptQuestionsStatus(
	// 		assessmentState,
	// 		questionState,
	// 		model,
	// 		context
	// 	)

	// 	return questionStatuses && questionStatuses.recorded.length === questionStatuses.all.length
	// },

	// isCurrentAttemptComplete(assessmentState, questionState, model, context) {
	// 	// exit if there is no current attempt
	// 	if (!AssessmentUtil.getCurrentAttemptForModel(assessmentState, model)) {
	// 		return null
	// 	}

	// 	const models = model.children.at(1).children.models
	// 	const responseCount = this.getRecordedResponseCount(models, questionState, context)

	// 	// is complete if the number of answered questions is
	// 	// equal to the total number of questions
	// 	return responseCount === models.length
	// },

	isInAssessment(state) {
		if (!state) return false

		for (const assessmentName in state.assessments) {
			if (state.assessments[assessmentName].current !== null) {
				return true
			}
		}

		return false
	},

	getNumberOfAttemptsCompletedForModel(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment || assessment.attempts.length === 0) {
			return 0
		}

		return assessment.attempts.length
	},

	getNumPossibleCorrect(questionScores) {
		return questionScores.map(q => q.score).filter(Number.isFinite).length
	},

	getNumCorrect(questionScores) {
		return questionScores.map(q => q.score).filter(score => parseInt(score, 10) === 100).length
	},

	findHighestAttempts(attempts, scoreProperty) {
		if (attempts.length === 0) return []

		const attemptsByScore = {}
		let highestScore = -1

		attempts.forEach(attempt => {
			const score = attempt[scoreProperty] === null ? -1 : attempt[scoreProperty]

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

	endAttempt({ model, context, visitId }) {
		return Dispatcher.trigger('assessment:endAttempt', {
			value: {
				id: model.get('id'),
				context,
				visitId
			}
		})
	},

	forceSendResponsesForCurrentAttempt(model, context) {
		return Dispatcher.trigger('assessment:forceSendResponses', {
			value: {
				id: model.get('id'),
				context
			}
		})
	},

	resetNetworkState(model) {
		return Dispatcher.trigger('assessment:resetNetworkState', {
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
	},

	isFullReviewAvailableForModel(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		switch (model.modelState.review) {
			case 'always':
				return true
			case 'never':
				return false
			case 'no-attempts-remaining':
				return !AssessmentUtil.hasAttemptsRemaining(state, model)
		}
	}
}

export default AssessmentUtil
