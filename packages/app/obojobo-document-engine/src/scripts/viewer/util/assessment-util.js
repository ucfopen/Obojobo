import Common from 'Common'

const { Dispatcher } = Common.flux

import QuestionUtil from './question-util'
import QuestionResponseSendStates from '../stores/question-store/question-response-send-states'
import CurrentAssessmentStates from './current-assessment-states'

import AssessmentStore from '../stores/assessment-store'
import QuestionStore from '../stores/question-store'

const AssessmentUtil = {
	getAssessmentForModel(state, model) {
		if (!model) {
			return null
		}

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

	getAssessmentSummaryForModel(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return null
		}

		return state.assessmentSummaries[assessment.id] || null
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
		const summary = AssessmentUtil.getAssessmentSummaryForModel(state, model)

		if (!summary || !summary.scores || summary.scores.length === 0) {
			return null
		}

		const scores = summary.scores.map(s => (s === null ? -1 : s))
		const max = Math.max.apply(null, scores)

		return max === -1 ? null : max
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
		if (AssessmentUtil.isScoreImported(state, model)) {
			return 0
		}

		return Math.max(
			model.modelState.attempts - this.getNumberOfAttemptsCompletedForModel(state, model),
			0
		)
	},

	hasAttemptsRemaining(state, model) {
		return AssessmentUtil.getAttemptsRemaining(state, model) > 0
	},

	getImportableScoreForModel(state, model) {
		const assessmentId = model.get('id')
		if (!state.importableScores[assessmentId]) {
			return null
		}

		return state.importableScores[assessmentId].highestScore
	},

	isScoreImported(state, model) {
		const summary = AssessmentUtil.getAssessmentSummaryForModel(state, model)
		if (!summary) {
			return null
		}

		return summary.importUsed
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

	isAttemptHistoryLoadedForModel(state, model) {
		const assessment = AssessmentUtil.getAssessmentForModel(state, model)
		if (!assessment) {
			return false
		}

		return assessment.attemptHistoryNetworkState === 'loaded'
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
		const summary = AssessmentUtil.getAssessmentSummaryForModel(state, model)

		if (!summary) {
			return 0
		}

		return summary.scores.length
	},

	getNumPossibleCorrect(questionScores) {
		return questionScores.map(q => q.score).filter(Number.isFinite).length
	},

	getNumCorrect(questionScores) {
		return questionScores.map(q => q.score).filter(score => parseInt(score, 10) === 100).length
	},

	getUnfinishedAttemptId(state, model) {
		const summary = AssessmentUtil.getAssessmentSummaryForModel(state, model)

		if (!summary) return null

		return summary.unfinishedAttemptId || null
	},

	hasUnfinishedAttempt(state, model) {
		return AssessmentUtil.getUnfinishedAttemptId(state, model) !== null
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

	continueAttempt(model) {
		return Dispatcher.trigger('assessment:continueAttempt', {
			value: {
				id: model.get('id')
			}
		})
	},

	resumeAttempt(model) {
		return Dispatcher.trigger('assessment:resumeAttempt', {
			value: {
				id: model.get('id')
			}
		})
	},

	importAttempt(model) {
		return Dispatcher.trigger('assessment:importAttempt', {
			value: {
				id: model.get('id')
			}
		})
	},

	abandonImport(model) {
		return Dispatcher.trigger('assessment:abandonImport', {
			value: {
				id: model.get('id')
			}
		})
	},

	acknowledgeStartAttemptFailed(model) {
		return Dispatcher.trigger('assessment:acknowledgeStartAttemptFailed', {
			value: {
				id: model.get('id')
			}
		})
	},

	acknowledgeResumeAttemptFailed(model) {
		return Dispatcher.trigger('assessment:acknowledgeResumeAttemptFailed', {
			value: {
				id: model.get('id')
			}
		})
	},

	acknowledgeEndAttemptSuccessful(model) {
		return Dispatcher.trigger('assessment:acknowledgeEndAttemptSuccessful', {
			value: {
				id: model.get('id')
			}
		})
	},

	acknowledgeEndAttemptFailed(model) {
		return Dispatcher.trigger('assessment:acknowledgeEndAttemptFailed', {
			value: {
				id: model.get('id')
			}
		})
	},

	acknowledgeImportAttemptFailed(model) {
		return Dispatcher.trigger('assessment:acknowledgeImportAttemptFailed', {
			value: {
				id: model.get('id')
			}
		})
	},

	acknowledgeFetchHistoryFailed(model, retry = false) {
		return Dispatcher.trigger('assessment:acknowledgeFetchHistoryFailed', {
			value: {
				id: model.get('id'),
				retry
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
	},

	// check to make sure the current question has been answered, move onto the next one if so
	nextQuestion(model, context) {
		const assessmentState = AssessmentStore.getState()
		// would be nice if there was a more reliable way of getting the state of questions arbitrarily like this
		const questionContextState = QuestionStore.getContextState(context)

		const currentQuestionIndex =
			assessmentState.assessments[model.get('id')].current.state.currentQuestion
		const question = model.children.at(1).children.models[currentQuestionIndex]

		// if the current question has a response, we're okay to move onto the next question
		if (questionContextState.responses[question.get('id')]) {
			return Dispatcher.trigger('assessment:nextQuestion', {
				value: {
					id: model.get('id')
				}
			})
		} else {
			return Dispatcher.trigger('assessment:tryNextQuestion', {
				value: {
					id: model.get('id')
				}
			})
		}
	},

	// user has chosen to move on to the next question without answering the current question
	acknowledgeSkipQuestion(model) {
		return Dispatcher.trigger('assessment:nextQuestion', {
			value: {
				id: model.get('id')
			}
		})
	}
}

export default AssessmentUtil
