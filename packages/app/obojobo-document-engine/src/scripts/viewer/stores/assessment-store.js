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

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const { Dispatcher, Store } = Common.flux
const { OboModel } = Common.models
const { ErrorUtil, ModalUtil } = Common.util
const { SimpleDialog, Dialog } = Common.components.modal

const getNewAssessmentObject = assessmentId => ({
	id: assessmentId,
	state: AssessmentNetworkStates.NO_ATTEMPT_STARTED,
	current: null,
	currentResponses: [],
	attempts: [],
	unfinishedAttempt: null,
	highestAssessmentScoreAttempts: [],
	highestAttemptScoreAttempts: [],
	lti: null,
	ltiNetworkState: LTINetworkStates.IDLE,
	ltiResyncState: LTIResyncStates.NO_RESYNC_ATTEMPTED,
	isShowingAttemptHistory: false
})

class AssessmentStore extends Store {
	constructor() {
		super('assessmentstore')

		Dispatcher.on('assessment:startAttempt', payload => {
			this.tryStartAttempt(payload.value.id)
		})

		Dispatcher.on('assessment:endAttempt', payload => {
			this.tryEndAttempt(payload.value.id, payload.value.context)
		})

		Dispatcher.on('assessment:resendLTIScore', payload => {
			this.tryResendLTIScore(payload.value.id)
		})

		Dispatcher.on('assessment:forceSendResponses', payload => {
			this.forceSendResponses(payload.value.id, payload.value.context)
		})

		Dispatcher.on('assessment:resetNetworkState', payload => {
			this.resetNetworkState(payload.value.id)
		})

		Dispatcher.on('question:setResponse', payload => {
			this.trySetResponse(payload.value.id, payload.value.response, payload.value.targetId)
		})

		Dispatcher.on('question:forceSentAllResponses', payload => {
			this.onForceSentAllResponses(payload.value.success, payload.value.context)
		})

		Dispatcher.on('viewer:closeAttempted', shouldPrompt => {
			if (AssessmentUtil.isInAssessment(this.state)) {
				shouldPrompt()
			}
		})
	}

	resetNetworkState(assessmentId) {
		const assessmentModel = OboModel.models[assessmentId]
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)

		if (!assessment) {
			return
		}

		switch (assessment.state) {
			case AssessmentNetworkStates.END_ATTEMPT_FAILED:
			case AssessmentNetworkStates.START_ATTEMPT_FAILED:
			case AssessmentNetworkStates.SENDING_RESPONSES_FAILED:
			case AssessmentNetworkStates.SENDING_RESPONSES_SUCCESSFUL:
				assessment.state = AssessmentUtil.isInAssessment(this.state)
					? AssessmentNetworkStates.IN_ATTEMPT
					: AssessmentNetworkStates.OUT_OF_ATTEMPT
				this.triggerChange()
				break
		}
	}

	init(attemptsByAssessment) {
		this.state = {
			assessments: {},
			machines: {}
		}

		console.log('init', attemptsByAssessment)

		// Find all the assessments:
		Object.values(OboModel.models)
			.filter(model => model.get('type') === 'ObojoboDraft.Sections.Assessment')
			.forEach(model => {
				const id = model.get('id')
				const assessmentObject = getNewAssessmentObject(id)
				this.state.assessments[id] = assessmentObject
				this.state.machines[id] = new AssessmentStateMachine(
					assessmentObject,
					this.triggerChange.bind(this),
					this.onEndAttempt.bind(this)
				)
			})

		// necessary?
		if (!attemptsByAssessment) return
		this.updateAttempts(attemptsByAssessment)
	}

	onEndAttempt(endAttemptResp) {
		this.updateAttempts([endAttemptResp])
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

		// debugger

		if (assessment && assessment.unfinishedAttempt) {
			NavUtil.goto(assessment.unfinishedAttempt.assessmentId)
			const machine = this.state.machines[assessment.unfinishedAttempt.assessmentId]

			machine.gotoStep(AssessmentNetworkStates.WILL_RESUME_ATTEMPT)
			// return ModalUtil.show(
			// 	<SimpleDialog
			// 		ok
			// 		title="Resume Attempt"
			// 		onConfirm={this.onResumeAttemptConfirm.bind(this, unfinishedAttempt)}
			// 		preventEsc
			// 	>
			// 		<p>
			// 			It looks like you were in the middle of an attempt. We&apos;ll resume where you left
			// 			off.
			// 		</p>
			// 	</SimpleDialog>,
			// 	true
			// )
		}
	}

	onResumeAttemptConfirm(unfinishedAttempt) {
		ModalUtil.hide()

		return APIUtil.resumeAttempt({
			draftId: unfinishedAttempt.draftId,
			attemptId: unfinishedAttempt.attemptId,
			visitId: NavStore.getState().visitId
		}).then(response => {
			this.startAttempt(response.value)
			this.triggerChange()
		})
	}

	tryStartAttempt(id) {
		const model = OboModel.models[id]
		let assessment = AssessmentUtil.getAssessmentForModel(this.state, model)

		if (!assessment) {
			this.state.assessments[id] = assessment = getNewAssessmentObject(id)
		}

		assessment.state = AssessmentNetworkStates.AWAITING_START_ATTEMPT_RESPONSE

		return APIUtil.startAttempt({
			draftId: model.getRoot().get('draftId'),
			assessmentId: model.get('id'),
			visitId: NavStore.getState().visitId
		})
			.then(res => {
				if (res.status === 'error') {
					switch (res.value.message.toLowerCase()) {
						case 'attempt limit reached':
							ErrorUtil.show(
								'No attempts left',
								'You have attempted this assessment the maximum number of times available.'
							)
							break

						default:
							ErrorUtil.errorResponse(res)
					}

					assessment.state = AssessmentNetworkStates.START_ATTEMPT_FAILED
				} else {
					this.startAttempt(res.value)
				}

				this.triggerChange()
			})
			.catch(e => {
				console.error(e) /* eslint-disable-line no-console */

				assessment.state = AssessmentNetworkStates.START_ATTEMPT_FAILED
				this.triggerChange()
			})
	}

	startAttempt(startAttemptResp) {
		const id = startAttemptResp.assessmentId
		const model = OboModel.models[id]

		model.children.at(1).children.reset()
		for (const child of Array.from(startAttemptResp.questions)) {
			const c = OboModel.create(child)
			model.children.at(1).children.add(c)
		}

		// if (!this.state.assessments[id]) {
		// 	this.state.assessments[id] = getNewAssessmentObject(id)
		// }

		this.state.assessments[id].state = AssessmentNetworkStates.IN_ATTEMPT
		this.state.assessments[id].current = startAttemptResp

		NavUtil.setContext(`assessment:${startAttemptResp.assessmentId}:${startAttemptResp.attemptId}`)
		NavUtil.rebuildMenu(model.getRoot())
		NavUtil.goto(id)

		model.processTrigger('onStartAttempt')
		Dispatcher.trigger('assessment:attemptStarted', id)
	}

	tryEndAttempt(id, context) {
		const model = OboModel.models[id]
		const assessment = this.state.assessments[id]

		assessment.state = AssessmentNetworkStates.AWAITING_END_ATTEMPT_RESPONSE

		return APIUtil.endAttempt({
			attemptId: assessment.current.attemptId,
			draftId: model.getRoot().get('draftId'),
			visitId: NavStore.getState().visitId
		})
			.then(res => {
				if (res.status === 'error') {
					assessment.state = AssessmentNetworkStates.END_ATTEMPT_FAILED
					return ErrorUtil.errorResponse(res)
				}

				this.endAttempt(res.value, context)
				return this.triggerChange()
			})
			.catch(e => {
				console.error(e) /* eslint-disable-line no-console */

				assessment.state = AssessmentNetworkStates.END_ATTEMPT_FAILED
				this.triggerChange()
			})
	}

	onCloseResultsDialog() {
		ModalUtil.hide()
		FocusUtil.focusOnNavTarget()
	}

	endAttempt(endAttemptResp, context) {
		const assessId = endAttemptResp.assessmentId
		const assessment = this.state.assessments[assessId]
		const model = OboModel.models[assessId]

		assessment.state = AssessmentNetworkStates.END_ATTEMPT_SUCCESSFUL

		assessment.current.state.chosen.forEach(question => {
			if (question.type === QUESTION_NODE_TYPE) {
				QuestionUtil.hideQuestion(question.id, context)
			}
		})

		assessment.currentResponses.forEach(questionId =>
			QuestionUtil.clearResponse(questionId, context)
		)

		assessment.current = null

		this.updateAttempts([endAttemptResp])

		model.processTrigger('onEndAttempt')

		Dispatcher.trigger('assessment:attemptEnded', assessId)

		const attempt = AssessmentUtil.getLastAttemptForModel(this.state, model)
		const reporter = new AssessmentScoreReporter({
			assessmentRubric: model.modelState.rubric.toObject(),
			totalNumberOfAttemptsAllowed: model.modelState.attempts,
			allAttempts: assessment.attempts
		})

		const assessmentLabel = NavUtil.getNavLabelForModel(NavStore.getState(), model)
		ModalUtil.show(
			<Dialog
				modalClassName="obojobo-draft--sections--assessment--results-modal"
				centered
				buttons={[
					{
						value: `Show ${assessmentLabel} Overview`,
						onClick: this.onCloseResultsDialog.bind(this),
						default: true
					}
				]}
				title={`Attempt ${attempt.attemptNumber} Results`}
				width="35rem"
			>
				<AssessmentScoreReportView report={reporter.getReportFor(attempt.attemptNumber)} />
			</Dialog>
		)
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
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)

		if (!assessment) {
			return
		}

		const currentAttempt = AssessmentUtil.getCurrentAttemptForModel(this.state, assessmentModel)

		if (!currentAttempt) {
			return
		}

		// const currentAttemptQuestionsStatus = AssessmentUtil.getCurrentAttemptQuestionsStatus(
		// 	this.state,
		// 	QuestionStore.getState(),
		// 	assessmentModel,
		// 	context
		// )

		// if (currentAttemptQuestionsStatus.error === 0 && currentAttemptQuestionsStatus.sending === 0) {
		// 	return
		// }

		assessment.state = AssessmentNetworkStates.AWAITING_SENDING_RESPONSES

		// currentAttempt.currentResponses.forEach(questionId => {
		// 	QuestionUtil.sendResponse(questionId, context, false)
		// })

		QuestionUtil.forceSendAllResponsesForContext(context)

		this.triggerChange()
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

	trySetResponse(questionId) {
		const model = OboModel.models[questionId]
		const assessment = AssessmentUtil.getAssessmentForModel(this.state, model)

		if (!assessment || !assessment.currentResponses) {
			// Resolve false if not an error but couldn't do anything because not in an attempt
			return Promise.resolve(false)
		}

		if (assessment.currentResponses.indexOf(questionId) === -1) {
			assessment.currentResponses.push(questionId)
		}

		this.triggerChange()
	}

	onForceSentAllResponses(success, context) {
		// debugger
		//@TODO - hardcoded assessment id
		const assessmentId = context.split(':')[1]
		const assessmentModel = OboModel.models[assessmentId]

		if (!assessmentModel) {
			return
		}

		const assessment = AssessmentUtil.getAssessmentForModel(this.state, assessmentModel)

		if (!assessment) {
			return
		}

		if (assessment.state !== AssessmentNetworkStates.AWAITING_SENDING_RESPONSES) {
			return
		}

		const currentAttempt = AssessmentUtil.getCurrentAttemptForModel(this.state, assessmentModel)

		if (!currentAttempt) {
			return
		}

		if (!success) {
			assessment.state = AssessmentNetworkStates.SENDING_RESPONSES_FAILED

			this.triggerChange()

			return
		}

		const currentAssessmentStatus = AssessmentUtil.getCurrentAttemptStatus(
			this.state,
			QuestionStore.getState(),
			assessmentModel,
			context
		)

		assessment.state =
			currentAssessmentStatus === CurrentAssessmentStates.READY_TO_SUBMIT
				? AssessmentNetworkStates.SENDING_RESPONSES_SUCCESSFUL
				: AssessmentNetworkStates.IN_ATTEMPT

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
