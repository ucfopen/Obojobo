import { Machine, interpret, assign } from 'xstate'

import APIUtil from '../util/api-util'
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
		})
	}

	static async endAttempt(draftId, attemptId) {
		return this.onRequest(
			await this.sendEndAttemptRequest(draftId, attemptId),
			this.onAttemptEnded.bind(this)
		)
	}

	static async sendStartAttemptRequest(assessmentId) {
		const model = OboModel.models[assessmentId]

		return await APIUtil.startAttempt({
			draftId: model.getRoot().get('draftId'),
			assessmentId: model.get('id'),
			visitId: NavStore.getState().visitId
		})
	}

	static async sendResumeAttemptRequest(draftId, attemptId) {
		return await APIUtil.resumeAttempt({
			draftId,
			attemptId,
			visitId: NavStore.getState().visitId
		})
	}

	static async sendEndAttemptRequest(draftId, attemptId) {
		return await APIUtil.endAttempt({
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

	static onAttemptEnded(res) {
		/*
		example response
		{
			"status": "ok",
			"value": {
				"assessmentId": "my-assessment",
				"attempts": [
					{
						"userId": "1",
						"draftId": "00000000-0000-0000-0000-000000000000",
						"contentId": "b156af29-faf5-4c61-a035-1cc33d8f1bf5",
						"attemptId": "d9b51660-60f4-4e13-a877-9c8339d3ecd8",
						"assessmentScoreId": "6",
						"attemptNumber": 1,
						"assessmentId": "my-assessment",
						"startTime": "2020-05-15T20:12:07.163Z",
						"finishTime": "2020-05-15T21:11:45.301Z",
						"isFinished": true,
						"state": {
							"chosen": [
								{
									"id": "e32101dd-8f0e-4bec-b519-968270efb426",
									"type": "ObojoboDraft.Chunks.Question"
								},
								{
									"id": "f1ebeb0e-606f-4d1e-b8b9-2ba4fbfbfa0f",
									"type": "ObojoboDraft.Chunks.Question"
								},
								{
									"id": "fa4c4db0-30f1-4386-9ce9-956aaf228378",
									"type": "ObojoboDraft.Chunks.Question"
								},
								{
									"id": "5345c7c6-ac69-4e9f-80da-6037765fa612",
									"type": "ObojoboDraft.Chunks.QuestionBank"
								},
								{
									"id": "af4ea08a-e488-4156-a2a0-c0f9a64c58eb",
									"type": "ObojoboDraft.Chunks.QuestionBank"
								}
							]
						},
						"questionScores": [
							{
								"id": "e32101dd-8f0e-4bec-b519-968270efb426",
								"score": 0
							},
							{
								"id": "f1ebeb0e-606f-4d1e-b8b9-2ba4fbfbfa0f",
								"score": 0
							},
							{
								"id": "fa4c4db0-30f1-4386-9ce9-956aaf228378",
								"score": 0
							}
						],
						"responses": [],
						"attemptScore": 0,
						"assessmentScore": 0,
						"assessmentScoreDetails": {
							"status": "passed",
							"rewardTotal": 0,
							"attemptScore": 0,
							"rewardedMods": [],
							"attemptNumber": 1,
							"assessmentScore": 0,
							"assessmentModdedScore": 0
						}
					}
				],
				"ltiState": null
			}
		}

		*/
		const assessment = this.getInternalAssessmentObjectFromResponse(res.value)
		const attempts = assessment.attempts //res.value.attempts
		const lastAttempt = attempts[attempts.length - 1]
		const { assessmentId, attemptId, attemptNumber } = lastAttempt
		const assessmentModel = OboModel.models[assessmentId]

		this.signalAttemptEnded(assessmentModel)
		this.updateStateByContextForAttempt(assessment.attempts[assessment.attempts.length - 1])

		return assessment
	}

	static updateStateByContextForAttempt(attempt) {
		const scores = {}
		attempt.questionScores.forEach(scoreData => {
			scores[scoreData.id] = scoreData
		})
		const stateToUpdate = {
			scores,
			responses: attempt.responses
		}

		QuestionStore.updateStateByContext(stateToUpdate, `assessmentReview:${attempt.attemptId}`)
	}

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
	static getInternalAssessmentObjectFromResponse(assessmentResponse) {
		const attempts = assessmentResponse.attempts

		const getLastOf = array => {
			return array && array.length > 0 ? array[array.length - 1] : null
		}

		return {
			lti: assessmentResponse.ltiState,
			highestAttemptScoreAttempts: AssessmentUtil.findHighestAttempts(attempts, 'attemptScore'),
			highestAssessmentScoreAttempts: AssessmentUtil.findHighestAttempts(
				attempts,
				'assessmentScore'
			),
			unfinishedAttempt: getLastOf(attempts.filter(attempt => !attempt.isFinished)),
			attempts: attempts
				.filter(attempt => attempt.isFinished)
				.map(attempt => {
					// Server returns responses in an array, but we use a object keyed by the questionId:
					if (!Array.isArray(attempt.responses)) {
						return attempt
					}

					const responsesById = {}
					attempt.responses.forEach(r => {
						responsesById[r.id] = r.response
					})

					return { ...attempt, responses: responsesById }
				})
		}
	}
}

export default AssessmentStateHelpers
