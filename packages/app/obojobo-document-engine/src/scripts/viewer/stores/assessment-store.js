import APIUtil from '../util/api-util'
import AssessmentScoreReportView from '../assessment/assessment-score-report-view'
import AssessmentScoreReporter from '../assessment/assessment-score-reporter'
import AssessmentUtil from '../util/assessment-util'
import CurrentAssessmentStates from '../util/current-assessment-states'
import Common from 'Common'
import FocusUtil from '../util/focus-util'
import LTINetworkStates from './assessment-store/lti-network-states'
import LTIResyncStates from './assessment-store/lti-resync-states'
import AssessmentNetworkStates from './assessment-store/assessment-network-states'
import NavStore from '../stores/nav-store'
import NavUtil from '../util/nav-util'
import QuestionStore from './question-store'
import QuestionUtil from '../util/question-util'
import React from 'react'
import AssessmentStateMachine from './assessment-state-machine'
import AssessmentStateActions from './assessment-store/assessment-state-actions'

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const { Dispatcher, Store } = Common.flux
const { OboModel } = Common.models
const { ErrorUtil, ModalUtil } = Common.util
const { SimpleDialog, Dialog } = Common.components.modal

const {
	PROMPTING_FOR_RESUME,
	STARTING_ATTEMPT,
	RESUMING_ATTEMPT,
	IN_ATTEMPT,
	START_ATTEMPT_FAILED,
	RESUME_ATTEMPT_FAILED,
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

const getNewAssessmentObject = assessmentId => ({
	id: assessmentId,
	state: AssessmentNetworkStates.NO_ATTEMPT_STARTED,
	current: null,
	// currentResponses: [],
	attempts: [],
	unfinishedAttempt: null,
	highestAssessmentScoreAttempts: [],
	highestAttemptScoreAttempts: [],
	lti: null,
	ltiNetworkState: LTINetworkStates.IDLE,
	ltiResyncState: LTIResyncStates.NO_RESYNC_ATTEMPTED
})

class AssessmentStore extends Store {
	constructor() {
		super('assessmentstore')

		Dispatcher.on('assessment:startAttempt', payload => {
			this.startAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:endAttempt', payload => {
			this.endAttempt(payload.value.id, payload.value.context)
		})

		Dispatcher.on('assessment:resendLTIScore', payload => {
			this.tryResendLTIScore(payload.value.id)
		})

		Dispatcher.on('assessment:forceSendResponses', payload => {
			this.forceSendResponses(payload.value.id, payload.value.context)
		})

		Dispatcher.on('assessment:acknowledgeEndAttemptSuccessful', payload => {
			this.acknowledgeEndAttemptSuccessful(payload.value.id)
		})

		Dispatcher.on('assessment:acknowledgeStartAttemptFailed', payload => {
			this.acknowledgeStartAttemptFailed(payload.value.id)
		})

		Dispatcher.on('assessment:acknowledgeEndAttemptFailed', payload => {
			this.acknowledgeEndAttemptFailed(payload.value.id)
		})

		Dispatcher.on('assessment:acknowledgeResumeAttemptFailed', payload => {
			this.acknowledgeResumeAttemptFailed(payload.value.id)
		})

		Dispatcher.on('assessment:continueAttempt', payload => {
			this.continueAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:resumeAttempt', payload => {
			this.resumeAttempt(payload.value.id)
		})

		Dispatcher.on('viewer:closeAttempted', shouldPrompt => {
			if (AssessmentUtil.isInAssessment(this.state)) {
				shouldPrompt()
			}
		})
	}

	init(attemptsByAssessment) {
		this.state = {
			assessments: {},
			machines: {}
		}

		// Find all the assessments:
		Object.values(OboModel.models)
			.filter(model => model.get('type') === 'ObojoboDraft.Sections.Assessment')
			.forEach(model => {
				const id = model.get('id')
				const assessmentObject = getNewAssessmentObject(id)

				this.state.assessments[id] = assessmentObject
				this.state.machines[id] = new AssessmentStateMachine(assessmentObject)
				this.state.machines[id].start(this.triggerChange.bind(this))
			})

		// necessary?
		if (!attemptsByAssessment) return
		this.updateAttempts(attemptsByAssessment)
	}

	updateAttempts(attemptsByAssessment) {
		// let unfinishedAttempt = null
		const assessments = this.state.assessments
		let assessment

		attemptsByAssessment.forEach(assessmentItem => {
			const assessId = assessmentItem.assessmentId
			const attempts = assessmentItem.attempts

			// if (!assessments[assessId]) {
			// 	assessments[assessId] = getNewAssessmentObject(assessId)
			// } else {
			// 	assessments[assessId].attempts = []
			// }

			assessments[assessId].lti = assessmentItem.ltiState
			assessments[assessId].highestAttemptScoreAttempts = AssessmentUtil.findHighestAttempts(
				attempts,
				'attemptScore'
			)
			assessments[assessId].highestAssessmentScoreAttempts = AssessmentUtil.findHighestAttempts(
				attempts,
				'assessmentScore'
			)

			attempts.forEach(attempt => {
				assessment = assessments[attempt.assessmentId]

				// Server returns responses in an array, but we use a object keyed by the questionId:
				if (Array.isArray(attempt.responses)) {
					const responsesById = {}
					attempt.responses.forEach(r => {
						responsesById[r.id] = r.response
					})
					attempt.responses = responsesById
				}

				if (!attempt.isFinished) {
					// unfinishedAttempt = attempt
					assessment.unfinishedAttempt = attempt
				} else {
					assessment.attempts.push(attempt)
				}
			})
		})

		for (const assessment in assessments) {
			assessments[assessment].attempts.forEach(attempt => {
				const scoreObject = {}
				attempt.questionScores.forEach(scoreData => {
					scoreObject[scoreData.id] = scoreData
				})
				const stateToUpdate = {
					scores: scoreObject,
					responses: attempt.responses
				}

				QuestionStore.updateStateByContext(stateToUpdate, `assessmentReview:${attempt.attemptId}`)
			})
		}

		if (assessment && assessment.unfinishedAttempt) {
			NavUtil.goto(assessment.unfinishedAttempt.assessmentId)
			const machine = this.state.machines[assessment.unfinishedAttempt.assessmentId]

			// machine.dispatch('willResumeAttempt')
			machine.send(AssessmentStateActions.PROMPT_FOR_RESUME)
		}
	}

	startAttempt(id, context) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't start attempt - No assessment!"
		}

		machine.send(AssessmentStateActions.START_ATTEMPT)
	}

	endAttempt(id, context) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't end attempt - No assessment!"
		}

		if (machine.getCurrentState() !== SEND_RESPONSES_SUCCESSFUL) {
			throw "Can't end attempt - Have not sent responses successfully!"
		}

		machine.send(AssessmentStateActions.END_ATTEMPT)
	}

	continueAttempt(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't continue attempt - No assessment!"
		}

		console.log('@TODO - Decide how to handle not in right state errors')

		machine.send(AssessmentStateActions.CONTINUE_ATTEMPT)
	}

	resumeAttempt(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't resume attempt - No assessment!"
		}

		console.log('@TODO - Decide how to handle not in right state errors')

		machine.send(AssessmentStateActions.RESUME_ATTEMPT)
	}

	acknowledgeEndAttemptSuccessful(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't acknowledge end attempt - No assessment!"
		}

		machine.send(AssessmentStateActions.ACKNOWLEDGE)
	}

	acknowledgeStartAttemptFailed(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't acknowledge start attempt failed - No assessment!"
		}

		console.log('@TODO - this should happen in the state machine', assessmentModel)

		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)
		assessment.current = null

		machine.send(AssessmentStateActions.ACKNOWLEDGE)
	}

	acknowledgeEndAttemptFailed(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't acknowledge end attempt failed - No assessment!"
		}

		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)
		delete assessment.current.error

		machine.send(AssessmentStateActions.ACKNOWLEDGE)
	}

	acknowledgeResumeAttemptFailed(id) {
		const assessmentModel = OboModel.models[id]

		const machine = AssessmentUtil.getAssessmentMachineForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't acknowledge resume attempt failed - No assessment!"
		}

		machine.send(AssessmentStateActions.ACKNOWLEDGE)
	}

	tryResendLTIScore(assessmentId) {
		const assessmentModel = OboModel.models[assessmentId]
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)

		assessment.ltiNetworkState = LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE
		this.triggerChange()

		return APIUtil.resendLTIAssessmentScore({
			draftId: assessmentModel.getRoot().get('draftId'),
			assessmentId: assessmentModel.get('id'),
			visitId: NavStore.getState().visitId
		})
			.then(res => {
				assessment.ltiNetworkState = LTINetworkStates.IDLE

				if (res.status === 'error') {
					return ErrorUtil.errorResponse(res)
				}

				this.updateLTIScore(
					AssessmentUtil.getAssessmentForModel(this.state, assessmentModel),
					res.value
				)
				return this.triggerChange()
			})
			.catch(e => {
				console.error(e) /* eslint-disable-line no-console */
			})
	}

	forceSendResponses(assessmentId, context) {
		const assessmentModel = OboModel.models[assessmentId]

		const machine = AssessmentUtil.getAssessmentMachineStateForModel(this.state, assessmentModel)

		if (!machine) {
			throw "Can't send responses - No assessment!"
		}

		machine.send(SENDING_RESPONSES)
	}

	updateLTIScore(assessment, updateLTIScoreResp) {
		assessment.lti = updateLTIScoreResp

		const assessmentModel = OboModel.models[assessment.id]
		if (AssessmentUtil.isLTIScoreNeedingToBeResynced(this.state, assessmentModel)) {
			assessment.ltiResyncState = LTIResyncStates.RESYNC_FAILED
		} else {
			assessment.ltiResyncState = LTIResyncStates.RESYNC_SUCCEEDED
		}

		this.triggerChange()
	}

	getState() {
		return this.state
	}

	setState(newState) {
		return (this.state = newState)
	}
}

const assessmentStore = new AssessmentStore()
export default assessmentStore
