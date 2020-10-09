import { Machine, interpret, assign } from 'xstate'

import AssessmentAPI from '../util/assessment-api'
import Common from 'Common'
import NavStore from '../stores/nav-store'
import AssessmentNetworkStates from './assessment-store/assessment-network-states'
import AssessmentStateActions from './assessment-store/assessment-state-actions'
import NavUtil from '../util/nav-util'

import AssessmentScoreReportView from '../assessment/assessment-score-report-view'
import AssessmentScoreReporter from '../assessment/assessment-score-reporter'
import AssessmentUtil from '../util/assessment-util'
import CurrentAssessmentStates from '../util/current-assessment-states'
import FocusUtil from '../util/focus-util'
import LTINetworkStates from './assessment-store/lti-network-states'
import LTIResyncStates from './assessment-store/lti-resync-states'
import QuestionStore from './question-store'
import QuestionUtil from '../util/question-util'
import React from 'react'
import findItemsWithMaxPropValue from '../../common/util/find-items-with-max-prop-value'

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const { OboModel } = Common.models
const { ErrorUtil, ModalUtil } = Common.util
const { Dispatcher } = Common.flux
const { SimpleDialog, Dialog } = Common.components.modal

const {
	PROMPTING_FOR_RESUME,
	STARTING_ATTEMPT,
	RESUMING_ATTEMPT,
	IN_ATTEMPT,
	START_ATTEMPT_FAILED,
	RESUME_ATTEMPT_FAILED,
	// TRYING_TO_SUBMIT,
	SENDING_RESPONSES,
	SEND_RESPONSES_SUCCESSFUL,
	SEND_RESPONSES_FAILED,
	NOT_IN_ATTEMPT,
	ENDING_ATTEMPT,
	END_ATTEMPT_FAILED,
	END_ATTEMPT_SUCCESSFUL,
	PROMPTING_FOR_IMPORT,
	IMPORTING_ATTEMPT,
	IMPORT_ATTEMPT_FAILED,
	IMPORT_ATTEMPT_SUCCESSFUL
} = AssessmentNetworkStates

const {
	START_ATTEMPT,
	PROMPT_FOR_IMPORT,
	PROMPT_FOR_RESUME,
	IMPORT_ATTEMPT,
	RESUME_ATTEMPT,
	TRY_TO_SUBMIT,
	SEND_RESPONSES,
	ACKNOWLEDGE,
	END_ATTEMPT,
	CONTINUE_ATTEMPT
	// RETRY
} = AssessmentStateActions

class AssessmentStateHelpers {
	static async startAttempt(assessmentId) {
		console.log('startATtempt', assessmentId)
		return this.onRequest(
			await this.sendStartAttemptRequest(assessmentId),
			this.onAttemptStarted.bind(this)
		)
	}

	static async resumeAttempt(draftId, attemptId) {
		return this.onRequest(
			await this.sendResumeAttemptRequest(draftId, attemptId),
			this.onAttemptStarted.bind(this)
		)
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
		}).catch(e => {
			console.error(e)
		})
	}

	static async endAttempt(draftId, attemptId) {
		const res = await this.sendEndAttemptRequest(draftId, attemptId)
		const attemptHistory = await this.getAttemptHistory(res.value.assessmentId)

		const assessmentModel = OboModel.models[res.value.assessmentId]

		this.signalAttemptEnded(assessmentModel)
		// this.updateStateByContextForAttempt(assessment.attempts[assessment.attempts.length - 1])

		// return assessment
		return attemptHistory
	}

	static async importAttempt(assessmentId, importedAssessmentScoreId) {
		console.log('@TODO - Most of this is copied from above!')
		const model = OboModel.models[assessmentId]

		const res = await AssessmentAPI.importScore({
			draftId: model.getRoot().get('draftId'),
			assessmentId: model.get('id'),
			visitId: NavStore.getState().visitId,
			importedAssessmentScoreId
		})
		const attemptHistory = await this.getAttemptHistory(assessmentId)

		const assessmentModel = OboModel.models[assessmentId]

		this.signalAttemptEnded(assessmentModel)

		return attemptHistory
	}

	static async sendStartAttemptRequest(assessmentId) {
		const model = OboModel.models[assessmentId]

		return await AssessmentAPI.startAttempt({
			draftId: model.getRoot().get('draftId'),
			assessmentId: model.get('id'),
			visitId: NavStore.getState().visitId
		})
	}

	static async sendResumeAttemptRequest(draftId, attemptId) {
		return await AssessmentAPI.resumeAttempt({
			draftId,
			attemptId,
			visitId: NavStore.getState().visitId
		})
	}

	static async sendEndAttemptRequest(draftId, attemptId) {
		return await AssessmentAPI.endAttempt({
			attemptId,
			draftId,
			visitId: NavStore.getState().visitId
		})
	}

	static async onRequest(res, successFn) {
		if (res.status !== 'ok') {
			return this.onError(res)
		}

		return successFn(res)
	}

	static async onError(res = null) {
		throw Error(res ? res.value.message : 'Request Failed')
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

	static async getAttemptHistory(assessmentId) {
		return this.onRequest(
			await this.sendGetAttemptHistoryRequest(assessmentId),
			this.onGetAttemptHistory.bind(this)
		)
	}

	static async sendGetAttemptHistoryRequest(assessmentId) {
		try {
			const model = OboModel.models[assessmentId]

			const historyResponse = await AssessmentAPI.getAttemptHistory({
				draftId: model.getRoot().get('draftId'),
				visitId: NavStore.getState().visitId
			})

			const history = historyResponse.value
			console.log('history', history)
			if (history.length === 0) {
				return historyResponse
			}

			const assessment = history.find(assessment => assessment.assessmentId === assessmentId)

			if (!assessment) {
				return historyResponse
			}

			const attemptIds = assessment.attempts.map(attempt => attempt.id)

			const review = await AssessmentAPI.reviewAttempt(attemptIds)

			assessment.attempts.forEach(attempt => {
				attempt.state.questionModels = review[attempt.id]
			})

			return historyResponse
		} catch (e) {
			console.error(e)
			return null
		}
	}

	static onGetAttemptHistory(res) {
		// const attemptsByAssessment = res.value

		// this.updateStateAfterAttemptHistory(attemptsByAssessment)

		// Return the response so that the assessment data can be added to the context
		return res
	}

	// static async onAttemptEnded(res) {
	// 	/*
	// 	example response
	// 	{
	// 		status: 'ok',
	// 		value: {
	// 			assessmentId: ...,
	// 			attemptId: ...,
	// 			assessmentScoreId: ...,
	// 			assessmentModdedScore: 0
	// 			assessmentScore: 0
	// 			attemptNumber: 2
	// 			attemptScore: 0
	// 			rewardTotal: 0
	// 			rewardedMods: []
	// 			status: "passed"
	// 		}
	// 	}
	// 	*/

	// }

	// Turns the assessment history response into local state data
	static getUpdatedAssessmentData(assessmentItem) {
		const attempts = assessmentItem.attempts

		// is the 'state' property needed as well?
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
		// UPDATE QUESTION STORE
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

	// static updateStateByContextForAttempt(attempt) {
	// 	const scores = {}
	// 	attempt.questionScores.forEach(scoreData => {
	// 		scores[scoreData.id] = scoreData
	// 	})
	// 	const stateToUpdate = {
	// 		scores,
	// 		responses: attempt.responses
	// 	}

	// 	QuestionStore.updateStateByContext(stateToUpdate, `assessmentReview:${attempt.attemptId}`)
	// }

	// static hideQuestions(chosenQuestions, navContext) {
	// 	chosenQuestions.forEach(question => {
	// 		if (question.type !== QUESTION_NODE_TYPE) {
	// 			return
	// 		}

	// 		QuestionUtil.hideQuestion(question.id, navContext)
	// 	})
	// }

	// static clearResponses(responses, navContext) {
	// 	responses.forEach(questionId => QuestionUtil.clearResponse(questionId, navContext))
	// }

	static signalAttemptEnded(assessmentModel) {
		assessmentModel.processTrigger('onEndAttempt')
		Dispatcher.trigger('assessment:attemptEnded', assessmentModel.get('id'))
	}

	static composeNavContextString(assessmentId, attemptId) {
		return `assessment:${assessmentId}:${attemptId}`
	}

	// Converts the assessmentResponse return value to an object that Obojobo can more easily use!
	// static getInternalAssessmentObjectFromResponse(assessmentResponse) {
	// 	const attempts = assessmentResponse.attempts

	// 	const getLastOf = array => {
	// 		return array && array.length > 0 ? array[array.length - 1] : null
	// 	}

	// 	console.log('@TODO DRY VIOLATION!', assessmentResponse)

	// 	return {
	// 		lti: assessmentResponse.ltiState,
	// 		highestAttemptScoreAttempts: findItemsWithMaxPropValue(attempts, 'attemptScore'),
	// 		highestAssessmentScoreAttempts: findItemsWithMaxPropValue(attempts, 'assessmentScore'),
	// 		unfinishedAttempt: getLastOf(attempts.filter(attempt => !attempt.isFinished)),
	// 		attempts: attempts
	// 			.filter(attempt => attempt.isFinished)
	// 			.map(attempt => {
	// 				// Server returns responses in an array, but we use a object keyed by the questionId:
	// 				if (!Array.isArray(attempt.responses)) {
	// 					return attempt
	// 				}

	// 				const responsesById = {}
	// 				attempt.responses.forEach(r => {
	// 					responsesById[r.id] = r.response
	// 				})

	// 				return { ...attempt, responses: responsesById }
	// 			})
	// 	}
	// }
}

export default AssessmentStateHelpers
