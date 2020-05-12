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

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const { Dispatcher, Store } = Common.flux
const { OboModel } = Common.models
const { ErrorUtil, ModalUtil, StateMachine } = Common.util
const { SimpleDialog, Dialog } = Common.components.modal

const {
	WILL_RESUME_ATTEMPT,
	TRYING_START_ATTEMPT,
	TRYING_RESUME_ATTEMPT,
	IN_ATTEMPT,
	START_ATTEMPT_FAILED,
	RESUME_ATTEMPT_FAILED,
	TRYING_SENDING_RESPONSES,
	SENDING_RESPONSES_SUCCESSFUL,
	SENDING_RESPONSES_FAILED,
	TRYING_END_ATTEMPT,
	NOT_IN_ATTEMPT,
	TRYING_TO_SUBMIT,
	END_ATTEMPT_FAILED,
	END_ATTEMPT_SUCCESSFUL,
	PROMPT_FOR_IMPORT,
	TRYING_IMPORT_ATTEMPT,
	IMPORT_ATTEMPT_FAILED,
	IMPORT_ATTEMPT_SUCCESSFUL
} = AssessmentNetworkStates

// const getNewAssessmentObject = assessmentId => ({
// 	id: assessmentId,
// 	state: NO_ATTEMPT_STARTED,
// 	current: null,
// 	currentResponses: [],
// 	attempts: [],
// 	highestAssessmentScoreAttempts: [],
// 	highestAttemptScoreAttempts: [],
// 	lti: null,
// 	ltiNetworkState: LTINetworkStates.IDLE,
// 	ltiResyncState: LTIResyncStates.NO_RESYNC_ATTEMPTED,
// 	isShowingAttemptHistory: false
// })

// {
// 	[NOT_IN_ATTEMPT]: [
// 		'promptForImport',
// 		'tryStartAttempt',
// 		'tryResumeAttempt'
// 	],
// 	[TRYING_START_ATTEMPT_RE
// 		'onEnter'
// 	]
// }

const createTransitions = () => ({
	[NOT_IN_ATTEMPT]: {
		canTransitionTo: [PROMPT_FOR_IMPORT, WILL_RESUME_ATTEMPT, TRYING_START_ATTEMPT],
		actions: {
			promptForImport() {
				this.transitionTo(PROMPT_FOR_IMPORT)
			},
			tryStartAttempt() {
				this.transitionTo(TRYING_START_ATTEMPT)
			},
			willResumeAttempt() {
				this.transitionTo(WILL_RESUME_ATTEMPT)
			}
		}
	},
	[PROMPT_FOR_IMPORT]: {
		canTransitionTo: [TRYING_IMPORT_ATTEMPT, TRYING_START_ATTEMPT],
		actions: {
			tryImport() {
				this.transitionTo(TRYING_IMPORT_ATTEMPT)
			},
			tryStartAttempt() {
				this.transitionTo(TRYING_START_ATTEMPT)
			}
		}
	},
	[WILL_RESUME_ATTEMPT]: {
		canTransitionTo: [TRYING_RESUME_ATTEMPT],
		actions: {
			tryResumeAttempt() {
				this.transitionTo(TRYING_RESUME_ATTEMPT)
			}
		}
	},
	[TRYING_START_ATTEMPT]: {
		canTransitionTo: [START_ATTEMPT_FAILED, IN_ATTEMPT],
		async onEnter() {
			try {
				this.onStartAttemptRequest(await this.sendStartAttemptRequest())
			} catch (e) {
				console.error(e) /* eslint-disable-line no-console */
				this.transitionTo(START_ATTEMPT_FAILED)
			}
		},
		async sendStartAttemptRequest() {
			const assessment = this.state.assessment
			const model = OboModel.models[assessment.id]

			return await APIUtil.startAttempt({
				draftId: model.getRoot().get('draftId'),
				assessmentId: model.get('id'),
				visitId: NavStore.getState().visitId
			})
		},
		onStartAttemptRequest(res) {
			if (res.status !== 'ok') {
				return this.onError(res)
			}

			return this.onAttemptStarted(res.value)
		},
		onError(res = null) {
			switch (res.value.message.toLowerCase()) {
				case 'attempt limit reached':
					ErrorUtil.show(
						'No attempts left',
						'You have attempted this assessment the maximum number of times available.'
					)
					break

				default:
					ErrorUtil.errorResponse(res)
					break
			}

			this.transitionTo(START_ATTEMPT_FAILED)
		}
	},
	[TRYING_RESUME_ATTEMPT]: {
		canTransitionTo: [RESUME_ATTEMPT_FAILED, IN_ATTEMPT],
		async onEnter() {
			const unfinishedAttempt = this.state.assessment.unfinishedAttempt

			try {
				const res = await APIUtil.resumeAttempt({
					draftId: unfinishedAttempt.draftId,
					attemptId: unfinishedAttempt.attemptId,
					visitId: NavStore.getState().visitId
				})
				this.onResumeAttemptRequest(res)
			} catch (e) {
				console.error(e) /* eslint-disable-line no-console */

				//assessment.state = START_ATTEMPT_FAILED
				//this.triggerChange()
				this.transitionTo(RESUME_ATTEMPT_FAILED)
			}
		},
		onResumeAttemptRequest(res) {
			if (res.status !== 'ok') {
				this.onError(res)
			}

			this.onAttemptStarted(res.value)
		},
		onError(res) {
			ErrorUtil.errorResponse(res)
			this.transitionTo(RESUME_ATTEMPT_FAILED)
		}
	},
	[START_ATTEMPT_FAILED]: {
		canTransitionTo: [NOT_IN_ATTEMPT],
		actions: {
			acknowledge() {
				this.transitionTo(NOT_IN_ATTEMPT)
			}
		}
	},
	[RESUME_ATTEMPT_FAILED]: {
		canTransitionTo: [WILL_RESUME_ATTEMPT],
		actions: {
			retry() {
				this.transitionTo(WILL_RESUME_ATTEMPT)
			}
		}
	},
	[IN_ATTEMPT]: {
		canTransitionTo: [TRYING_SENDING_RESPONSES],
		onEnter() {
			const currentAttempt = this.state.assessment.current
			const id = currentAttempt.assessmentId
			const model = OboModel.models[id]

			this.state.context = `assessment:${currentAttempt.assessmentId}:${currentAttempt.attemptId}`
			NavUtil.setContext(this.state.context)
			NavUtil.rebuildMenu(model.getRoot())
			NavUtil.goto(id)

			model.processTrigger('onStartAttempt')
			Dispatcher.trigger('assessment:attemptStarted', id)
		},
		actions: {
			forceSendAllResponses() {
				this.transitionTo(TRYING_SENDING_RESPONSES)
			}
		}
	},
	// [TRYING_TO_SUBMIT]: {
	// 	canTransitionTo: [TRYING_SENDING_RESPONSES],
	// 	onEnter() {
	// 		// debugger
	// 		// this.transitionTo(TRYING_SENDING_RESPONSES)
	// 	}
	// },
	[TRYING_SENDING_RESPONSES]: {
		canTransitionTo: [SENDING_RESPONSES_SUCCESSFUL, SENDING_RESPONSES_FAILED],
		onEnter() {
			this.listener = this.onForceSentAllResponses.bind(this)
			Dispatcher.on('question:forceSentAllResponses', this.listener)

			QuestionUtil.forceSendAllResponsesForContext(this.state.context)
		},
		onForceSentAllResponses({ success, context }) {
			// // debugger
			Dispatcher.off('question:forceSentAllResponses', this.listener)
			delete this.listener

			if (!success) {
				this.transitionTo(SENDING_RESPONSES_FAILED)

				return
			}

			//@TODO - This no worky
			// const currentAssessmentStatus = AssessmentUtil.getCurrentAttemptStatus(
			// 	this.state,
			// 	QuestionStore.getState(),
			// 	assessmentModel,
			// 	context
			// )

			//@TODO
			const currentAssessmentStatus = CurrentAssessmentStates.READY_TO_SUBMIT

			this.transitionTo(
				currentAssessmentStatus === CurrentAssessmentStates.READY_TO_SUBMIT
					? SENDING_RESPONSES_SUCCESSFUL
					: SENDING_RESPONSES_FAILED
			)
		}
	},
	[SENDING_RESPONSES_FAILED]: {
		canTransitionTo: [IN_ATTEMPT],
		actions: {
			acknowledge() {
				this.transitionTo(IN_ATTEMPT)
			}
		}
	},
	[SENDING_RESPONSES_SUCCESSFUL]: {
		canTransitionTo: [IN_ATTEMPT, TRYING_END_ATTEMPT],
		actions: {
			acknowledge() {
				this.transitionTo(IN_ATTEMPT)
			},
			tryEndAttempt() {
				// const model = OboModel.models[assessmentId]
				// const assessment = this.state.assessments[assessmentId]

				this.transitionTo(TRYING_END_ATTEMPT)
			}
		}
	},
	[TRYING_END_ATTEMPT]: {
		canTransitionTo: [END_ATTEMPT_FAILED, END_ATTEMPT_SUCCESSFUL],
		async onEnter() {
			try {
				this.onEndAttemptRequest(await this.sendEndAttemptRequest())
			} catch (e) {
				console.error(e) /* eslint-disable-line no-console */
				this.transitionTo(END_ATTEMPT_FAILED)
			}
		},
		async sendEndAttemptRequest() {
			const assessment = this.state.assessment
			const model = OboModel.models[assessment.id]

			return await APIUtil.endAttempt({
				attemptId: this.state.assessment.current.attemptId,
				draftId: model.getRoot().get('draftId'),
				visitId: NavStore.getState().visitId
			})
		},
		onEndAttemptRequest(res) {
			if (res.status !== 'ok') {
				return this.onError(res)
			}

			return this.onAttemptEnded(res.value)
		},
		onError(res = null) {
			ErrorUtil.errorResponse(res)
			this.transitionTo(END_ATTEMPT_FAILED)
		},
		onAttemptEnded() {
			// const assessId = this.state.__endAttemptResponse.assessmentId
			// const assessment = this.state.assessment

			this.hideQuestions()
			this.clearResponses()

			this.state.assessment.current = null
			this.__onEndAttempt(this.state.__endAttemptResponse)

			this.signalAttemptEnded()

			const attempts = this.state.__endAttemptResponse.attempts
			const lastAttempt = attempts[attempts.length - 1]
			this.showReportDialog(lastAttempt)

			this.transitionTo(END_ATTEMPT_SUCCESSFUL)
		},
		hideQuestions() {
			this.state.assessment.current.state.chosen.forEach(question => {
				if (question.type === QUESTION_NODE_TYPE) {
					QuestionUtil.hideQuestion(question.id, this.state.context)
				}
			})
		},
		clearResponses() {
			this.state.assessment.currentResponses.forEach(questionId =>
				QuestionUtil.clearResponse(questionId, this.state.context)
			)
		},
		getReportForAttempt(attemptNumber) {
			const assessId = this.state.__endAttemptResponse.assessmentId
			const assessment = this.state.assessment
			const model = OboModel.models[assessId]

			const reporter = new AssessmentScoreReporter({
				assessmentRubric: model.modelState.rubric.toObject(),
				totalNumberOfAttemptsAllowed: model.modelState.attempts,
				allAttempts: assessment.attempts
			})

			return reporter.getReportFor(attemptNumber)
		},
		signalAttemptEnded() {
			const assessId = this.state.__endAttemptResponse.assessmentId
			const model = OboModel.models[assessId]

			model.processTrigger('onEndAttempt')

			Dispatcher.trigger('assessment:attemptEnded', assessId)
		},
		showReportDialog(attempt) {
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
					<AssessmentScoreReportView report={this.getReportForAttempt(attempt.attemptNumber)} />
				</Dialog>
			)
		},
		onCloseResultsDialog() {
			ModalUtil.hide()
			FocusUtil.focusOnNavTarget()
		}
	},
	[END_ATTEMPT_FAILED]: {
		canTransitionTo: [IN_ATTEMPT],
		actions: {
			acknowledge() {
				this.transitionTo(IN_ATTEMPT)
			}
		}
	},
	[END_ATTEMPT_SUCCESSFUL]: {
		canTransitionTo: [NOT_IN_ATTEMPT],
		actions: {
			acknowledge() {
				this.transitionTo(NOT_IN_ATTEMPT)
			}
		},
		onEnter() {
			//
		}
	}
})

class AssessmentStateMachine extends StateMachine {
	constructor(assessmentObject, onStateTransition, __onEndAttempt) {
		super({
			initialStep: NOT_IN_ATTEMPT,
			onTransition: onStateTransition,
			transitions: createTransitions()
		})

		// this.boundOnForceSentAllResponses = this.onForceSentAllResponses.bind(this)
		this.__onEndAttempt = __onEndAttempt

		this.state = {
			assessment: assessmentObject,
			__endAttemptResponse: null,
			context: null
		}
	}

	onAttemptStarted(startAttemptResp) {
		// debugger
		const id = startAttemptResp.assessmentId
		const model = OboModel.models[id]

		model.children.at(1).children.reset()
		for (const child of Array.from(startAttemptResp.questions)) {
			const c = OboModel.create(child)
			model.children.at(1).children.add(c)
		}

		//this.state.assessments[id].state = IN_ATTEMPT
		//@TODO:
		this.state.assessment.current = startAttemptResp

		this.transitionTo(IN_ATTEMPT)
	}

	onForceSentAllResponses(payload) {
		// // debugger
		this.dispatch('_onForceSentAllResponses', payload.value)
	}
}

export default AssessmentStateMachine
