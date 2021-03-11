import AssessmentAPI from '../util/assessment-api'
import Common from 'Common'
import NavStore from '../stores/nav-store'
// import AssessmentNetworkStates from './assessment-store/assessment-network-states'
// import AssessmentStateActions from './assessment-store/assessment-state-actions'
import NavUtil from '../util/nav-util'

// import AssessmentScoreReportView from '../assessment/assessment-score-report-view'
// import AssessmentScoreReporter from '../assessment/assessment-score-reporter'
// import AssessmentUtil from '../util/assessment-util'
// import CurrentAssessmentStates from '../util/current-assessment-states'
// import FocusUtil from '../util/focus-util'
import LTINetworkStates from './assessment-store/lti-network-states'
import LTIResyncStates from './assessment-store/lti-resync-states'
import QuestionStore from './question-store'
import QuestionUtil from '../util/question-util'
// import React from 'react'
import findItemsWithMaxPropValue from '../../common/util/find-items-with-max-prop-value'

// const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const { OboModel } = Common.models
// const { ErrorUtil, ModalUtil } = Common.util
const { Dispatcher } = Common.flux
// const { SimpleDialog, Dialog } = Common.components.modal

// const {
// 	PROMPTING_FOR_RESUME,
// 	STARTING_ATTEMPT,
// 	RESUMING_ATTEMPT,
// 	IN_ATTEMPT,
// 	START_ATTEMPT_FAILED,
// 	RESUME_ATTEMPT_FAILED,
// 	// TRYING_TO_SUBMIT,
// 	SENDING_RESPONSES,
// 	SEND_RESPONSES_SUCCESSFUL,
// 	SEND_RESPONSES_FAILED,
// 	NOT_IN_ATTEMPT,
// 	ENDING_ATTEMPT,
// 	END_ATTEMPT_FAILED,
// 	END_ATTEMPT_SUCCESSFUL,
// 	PROMPTING_FOR_IMPORT,
// 	IMPORTING_ATTEMPT,
// 	IMPORT_ATTEMPT_FAILED,
// 	IMPORT_ATTEMPT_SUCCESSFUL
// } = AssessmentNetworkStates

// const {
// 	START_ATTEMPT,
// 	PROMPT_FOR_IMPORT,
// 	PROMPT_FOR_RESUME,
// 	IMPORT_ATTEMPT,
// 	RESUME_ATTEMPT,
// 	TRY_TO_SUBMIT,
// 	SEND_RESPONSES,
// 	ACKNOWLEDGE,
// 	END_ATTEMPT,
// 	CONTINUE_ATTEMPT
// 	// RETRY
// } = AssessmentStateActions

const getErrorFromResponse = res => {
	return Error(res ? res.value.message : 'Request Failed')
}

class AssessmentAPIHelpers {
	static sendStartAttemptRequest(assessmentId) {
		const model = OboModel.models[assessmentId]

		return AssessmentAPI.startAttempt({
			draftId: model.getRoot().get('draftId'),
			assessmentId: model.get('id'),
			visitId: NavStore.getState().visitId
		})
	}

	static sendResumeAttemptRequest(assessmentId, attemptId) {
		const model = OboModel.models[assessmentId]

		return AssessmentAPI.resumeAttempt({
			draftId: model.getRoot().get('draftId'),
			attemptId,
			visitId: NavStore.getState().visitId
		})
	}

	static sendEndAttemptRequest(assessmentId, attemptId) {
		const model = OboModel.models[assessmentId]

		return AssessmentAPI.endAttempt({
			attemptId,
			draftId: model.getRoot().get('draftId'),
			visitId: NavStore.getState().visitId
		})
	}

	static sendImportScoreRequest(assessmentId, importedAssessmentScoreId) {
		const model = OboModel.models[assessmentId]

		return AssessmentAPI.importScore({
			draftId: model.getRoot().get('draftId'),
			assessmentId: model.get('id'),
			visitId: NavStore.getState().visitId,
			importedAssessmentScoreId
		})
	}

	static sendGetAttemptHistoryRequest(assessmentId) {
		const model = OboModel.models[assessmentId]

		return AssessmentAPI.getAttemptHistory({
			draftId: model.getRoot().get('draftId'),
			visitId: NavStore.getState().visitId
		})
	}
}

class AssessmentStateHelpers {
	static async onError(res = null) {
		throw Error(res ? res.value.message : 'Request Failed')
	}

	static async startAttempt(assessmentId) {
		const res = await AssessmentAPIHelpers.sendStartAttemptRequest(assessmentId)

		if (res.status !== 'ok') {
			throw getErrorFromResponse(res)
		}

		return this.onAttemptStarted(res)
	}

	static async resumeAttempt(assessmentId, attemptId) {
		const res = await AssessmentAPIHelpers.sendResumeAttemptRequest(assessmentId, attemptId)

		if (res.status !== 'ok') {
			throw getErrorFromResponse(res)
		}

		return this.onAttemptStarted(res)
	}

	static async endAttempt(assessmentId, attemptId) {
		const model = OboModel.models[assessmentId]

		const res = await AssessmentAPIHelpers.sendEndAttemptRequest(assessmentId, attemptId)

		if (res.status !== 'ok') {
			throw getErrorFromResponse(res)
		}

		const attemptHistory = await this.getAttemptHistoryWithReviewData(assessmentId)

		this.signalAttemptEnded(model)

		return attemptHistory
	}

	static async importAttempt(assessmentId, importedAssessmentScoreId) {
		const model = OboModel.models[assessmentId]

		const res = await AssessmentAPIHelpers.sendImportScoreRequest(
			assessmentId,
			importedAssessmentScoreId
		)

		if (res.status !== 'ok') {
			throw getErrorFromResponse(res)
		}

		const attemptHistory = await this.getAttemptHistoryWithReviewData(assessmentId)

		this.signalAttemptEnded(model)

		return attemptHistory
	}

	static async getAttemptHistoryWithReviewData(assessmentId) {
		const historyResponse = await AssessmentAPIHelpers.sendGetAttemptHistoryRequest(assessmentId)

		if (historyResponse.status !== 'ok') {
			throw getErrorFromResponse(historyResponse)
		}

		const assessment = historyResponse.value.find(
			assessment => assessment.assessmentId === assessmentId
		)
		if (assessment) {
			await this.updateAttemptHistoryWithReviewData(assessment)
		}

		return historyResponse
	}

	static sendResponses(assessmentId, attemptId) {
		return new Promise((resolve, reject) => {
			const listener = ({ value }) => {
				Dispatcher.off('question:forceSentAllResponses', listener)

				if (value.success) {
					resolve()
				} else {
					reject(new Error('Sending all responses failed'))
				}
			}

			Dispatcher.on('question:forceSentAllResponses', listener)
			QuestionUtil.forceSendAllResponsesForContext(
				this.composeNavContextString(assessmentId, attemptId)
			)
		})
	}

	static onAttemptStarted(res) {
		const assessment = res.value
		const assessmentId = assessment.assessmentId
		const assessmentModel = OboModel.models[assessmentId]

		this.setAssessmentQuestionBank(assessmentModel, assessment.questions)
		this.updateNavContextAndMenu(assessmentModel, assessment.attemptId)
		this.signalAttemptStarted(assessmentModel)

		// Return the response so that the assessment data can be added to the context
		return res
	}

	static setAssessmentQuestionBank(assessmentModel, questions) {
		const qb = assessmentModel.children.at(1)

		qb.children.reset()
		Array.from(questions).forEach(child => qb.children.add(OboModel.create(child)))
	}

	static updateNavContextAndMenu(assessmentModel, attemptId) {
		const assessmentId = assessmentModel.get('id')

		NavUtil.setContext(this.composeNavContextString(assessmentId, attemptId))
		NavUtil.rebuildMenu(assessmentModel.getRoot())
		NavUtil.goto(assessmentId)
	}

	static signalAttemptStarted(assessmentModel) {
		const assessmentId = assessmentModel.get('id')

		assessmentModel.processTrigger('onStartAttempt')
		Dispatcher.trigger('assessment:attemptStarted', assessmentId)
	}

	static async updateAttemptHistoryWithReviewData(assessment) {
		const attemptIds = assessment.attempts.map(attempt => attempt.id)

		const review = await AssessmentAPI.reviewAttempt(attemptIds)

		assessment.attempts.forEach(attempt => {
			attempt.state.questionModels = review[attempt.id]
		})

		return assessment
	}

	// Turns the assessment history response into local state data
	static getUpdatedAssessmentData(assessmentItem) {
		const attempts = assessmentItem.attempts

		return {
			id: assessmentItem.assessmentId,
			attempts,
			current: null,
			unfinishedAttempt: attempts.find(a => !a.isFinished) || null,
			lti: assessmentItem.ltiState,
			ltiNetworkState: LTINetworkStates.IDLE,
			ltiResyncState: LTIResyncStates.NO_RESYNC_ATTEMPTED,
			attemptHistoryNetworkState: 'loaded',
			highestAttemptScoreAttempts: findItemsWithMaxPropValue(attempts, 'result.attemptScore'),
			highestAssessmentScoreAttempts: findItemsWithMaxPropValue(attempts, 'assessmentScore'),
			isScoreImported: attempts.some(a => a.isImported)
		}
	}

	static getStateSummaryFromAssessmentState(assessmentState) {
		const summary = {
			assessmentId: assessmentState.id,
			importUsed: assessmentState.isScoreImported,
			unfinishedAttemptId: null,
			scores: []
		}

		assessmentState.attempts.forEach(attempt => {
			if (!attempt.isFinished) {
				summary.unfinishedAttemptId = attempt.id
			} else {
				summary.scores.push(attempt.assessmentScore)
			}
		})

		return summary
	}

	static updateQuestionStore(assessmentItem) {
		assessmentItem.attempts.forEach(attempt => {
			const qState = {
				scores: {},
				responses: {}
			}

			attempt.result.questionScores.forEach(score => {
				qState.scores[score.id] = score
			})

			attempt.questionResponses.forEach(resp => {
				qState.responses[resp.questionId] = resp.response
			})

			QuestionStore.updateStateByContext(qState, `assessmentReview:${attempt.id}`)
		})
	}

	static signalAttemptEnded(assessmentModel) {
		assessmentModel.processTrigger('onEndAttempt')
		Dispatcher.trigger('assessment:attemptEnded', assessmentModel.get('id'))
	}

	static composeNavContextString(assessmentId, attemptId) {
		return `assessment:${assessmentId}:${attemptId}`
	}
}

export default AssessmentStateHelpers
