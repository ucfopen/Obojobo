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
	AWAITING_START_ATTEMPT_RESPONSE,
	AWAITING_RESUME_ATTEMPT_RESPONSE,
	IN_ATTEMPT,
	START_ATTEMPT_FAILED,
	RESUME_ATTEMPT_FAILED,
	AWAITING_SENDING_RESPONSES,
	SENDING_RESPONSES_SUCCESSFUL,
	SENDING_RESPONSES_FAILED,
	AWAITING_END_ATTEMPT_RESPONSE,
	NOT_IN_ATTEMPT,
	TRYING_TO_SUBMIT,
	END_ATTEMPT_FAILED,
	PROMPT_FOR_IMPORT,
	AWAITING_IMPORT_ATTEMPT_RESPONSE,
	IMPORT_ATTEMPT_FAILED
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
// 	[AWAITING_START_ATTEMPT_RESPONSE]: [
// 		'onEnter'
// 	]
// }

class AssessmentStateMachine extends StateMachine {
	constructor(assessmentObject, onStateTransition, onEndAttempt) {
		super({
			initialStep: NOT_IN_ATTEMPT,
			onTransition: onStateTransition,
			transitions: {
				[NOT_IN_ATTEMPT]: {
					canTransitionTo: [
						PROMPT_FOR_IMPORT,
						WILL_RESUME_ATTEMPT,
						AWAITING_START_ATTEMPT_RESPONSE
					],
					promptForImport: function() {
						this.gotoStep(PROMPT_FOR_IMPORT)
					},
					tryStartAttempt: function() {
						this.gotoStep(AWAITING_START_ATTEMPT_RESPONSE)
					},
					tryResumeAttempt: function() {
						this.gotoStep(AWAITING_RESUME_ATTEMPT_RESPONSE)
					}
				},
				[PROMPT_FOR_IMPORT]: {
					canTransitionTo: [NOT_IN_ATTEMPT, AWAITING_IMPORT_ATTEMPT_RESPONSE],
					tryImport: function() {
						// @TODO: Do things
						this.gotoStep(AWAITING_IMPORT_ATTEMPT_RESPONSE)
					},
					tryStartAttempt: function() {
						//@TODO - this is a duplicated function
						this.gotoStep(NOT_IN_ATTEMPT)
						this.dispatch('tryStartAttempt')
					}
				},
				[WILL_RESUME_ATTEMPT]: {
					canTransitionTo: [AWAITING_RESUME_ATTEMPT_RESPONSE],
					tryResumeAttempt() {
						this.gotoStep(AWAITING_RESUME_ATTEMPT_RESPONSE)
					}
				},
				[AWAITING_START_ATTEMPT_RESPONSE]: {
					canTransitionTo: [START_ATTEMPT_FAILED, IN_ATTEMPT],
					async onEnter() {
						const assessment = this.state.assessment
						const model = OboModel.models[assessment.id]

						try {
							const res = await APIUtil.startAttempt({
								draftId: model.getRoot().get('draftId'),
								assessmentId: model.get('id'),
								visitId: NavStore.getState().visitId
							})

							if (res.status === 'ok') {
								this.dispatch('_startAttempt', res.value)
							} else {
								this.dispatch('_onError', res)
							}
						} catch (e) {
							console.error(e) /* eslint-disable-line no-console */

							this.gotoStep(START_ATTEMPT_FAILED)
						}
					},
					_onError: function(res = null) {
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

						this.gotoStep(START_ATTEMPT_FAILED)
					},
					_startAttempt: function(startAttemptResp) {
						this.startAttempt(startAttemptResp)
					}
				},
				[AWAITING_RESUME_ATTEMPT_RESPONSE]: {
					canTransitionTo: [RESUME_ATTEMPT_FAILED, IN_ATTEMPT],
					onEnter: function() {
						const unfinishedAttempt = this.state.assessment.unfinishedAttempt

						APIUtil.resumeAttempt({
							draftId: unfinishedAttempt.draftId,
							attemptId: unfinishedAttempt.attemptId,
							visitId: NavStore.getState().visitId
						})
							.then(res => {
								switch (res.status) {
									case 'ok': {
										// debugger
										this.dispatch('_startAttempt', res.value)
										break
									}

									case 'error': {
										this.dispatch('_onError', res)
										break
									}
								}
							})
							.catch(e => {
								console.error(e) /* eslint-disable-line no-console */

								//assessment.state = START_ATTEMPT_FAILED
								//this.triggerChange()
								this.gotoStep(RESUME_ATTEMPT_FAILED)
							})
					},
					_startAttempt: function(startAttemptResp) {
						this.startAttempt(startAttemptResp)
					},
					_onError: function(res) {
						ErrorUtil.errorResponse(res)
						this.gotoStep(RESUME_ATTEMPT_FAILED)
					}
				},
				[START_ATTEMPT_FAILED]: {
					canTransitionTo: [NOT_IN_ATTEMPT],
					acknowledge: function() {
						this.gotoStep(NOT_IN_ATTEMPT)
					}
				},
				[RESUME_ATTEMPT_FAILED]: {
					canTransitionTo: [AWAITING_RESUME_ATTEMPT_RESPONSE],
					retry: function() {
						this.gotoStep(AWAITING_RESUME_ATTEMPT_RESPONSE)
					}
				},
				[IN_ATTEMPT]: {
					canTransitionTo: [TRYING_TO_SUBMIT],
					onEnter: function() {
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
					forceSendAllResponses: function() {
						this.gotoStep(AWAITING_SENDING_RESPONSES)
					}
				},
				[TRYING_TO_SUBMIT]: {
					canTransitionTo: [AWAITING_SENDING_RESPONSES],
					onEnter() {
						// debugger
						// this.gotoStep(AWAITING_SENDING_RESPONSES)
					}
				},
				[AWAITING_SENDING_RESPONSES]: {
					canTransitionTo: [SENDING_RESPONSES_SUCCESSFUL, IN_ATTEMPT],
					onEnter: function() {
						Dispatcher.on('question:forceSentAllResponses', this.boundOnForceSentAllResponses)

						QuestionUtil.forceSendAllResponsesForContext(this.state.context)
					},
					_onForceSentAllResponses: function({ success, context }) {
						// // debugger
						Dispatcher.off('question:forceSentAllResponses', this.boundOnForceSentAllResponses)

						if (!success) {
							this.gotoStep(SENDING_RESPONSES_FAILED)

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

						this.gotoStep(
							currentAssessmentStatus === CurrentAssessmentStates.READY_TO_SUBMIT
								? SENDING_RESPONSES_SUCCESSFUL
								: IN_ATTEMPT
						)
					}
				},
				[SENDING_RESPONSES_FAILED]: {
					canTransitionTo: [IN_ATTEMPT],
					acknowledge: function() {
						this.gotoStep(IN_ATTEMPT)
					}
				},
				[SENDING_RESPONSES_SUCCESSFUL]: {
					canTransitionTo: [IN_ATTEMPT, AWAITING_END_ATTEMPT_RESPONSE],
					acknowledge: function() {
						this.gotoStep(IN_ATTEMPT)
					},
					tryEndAttempt: function() {
						// const model = OboModel.models[assessmentId]
						// const assessment = this.state.assessments[assessmentId]

						this.gotoStep(AWAITING_END_ATTEMPT_RESPONSE)
					}
				},
				[AWAITING_END_ATTEMPT_RESPONSE]: {
					canTransitionTo: [END_ATTEMPT_FAILED, NOT_IN_ATTEMPT],
					onEnter: function() {
						const model = OboModel.models[this.state.assessment.id]
						APIUtil.endAttempt({
							attemptId: this.state.assessment.current.attemptId,
							draftId: model.getRoot().get('draftId'),
							visitId: NavStore.getState().visitId
						})
							.then(res => {
								if (res.status === 'error') {
									ErrorUtil.errorResponse(res)
									this.gotoStep(END_ATTEMPT_FAILED)
									return
								}

								this.state.__endAttemptResponse = res.value

								// this.endAttempt(res.value, this.state.context)
								this.dispatch('_endAttempt')
							})
							.catch(e => {
								console.error(e) /* eslint-disable-line no-console */

								// assessment.state = END_ATTEMPT_FAILED
								this.gotoStep(END_ATTEMPT_FAILED)
							})
					},
					_endAttempt: function() {
						const assessId = this.state.__endAttemptResponse.assessmentId
						const assessment = this.state.assessment
						const model = OboModel.models[assessId]

						assessment.current.state.chosen.forEach(question => {
							if (question.type === QUESTION_NODE_TYPE) {
								QuestionUtil.hideQuestion(question.id, this.state.context)
							}
						})

						assessment.currentResponses.forEach(questionId =>
							QuestionUtil.clearResponse(questionId, this.state.context)
						)

						assessment.current = null

						// this.updateAttempts([this.state.__endAttemptResponse])
						this.onEndAttempt(this.state.__endAttemptResponse)

						model.processTrigger('onEndAttempt')

						Dispatcher.trigger('assessment:attemptEnded', assessId)

						const reporter = new AssessmentScoreReporter({
							assessmentRubric: model.modelState.rubric.toObject(),
							totalNumberOfAttemptsAllowed: model.modelState.attempts,
							allAttempts: assessment.attempts
						})

						// const attempt = AssessmentUtil.getLastAttemptForModel(this.state, model)
						const attempts = this.state.__endAttemptResponse.attempts
						const attempt = attempts[attempts.length - 1]

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

						this.gotoStep(NOT_IN_ATTEMPT)
					}
				},
				[END_ATTEMPT_FAILED]: {
					canTransitionTo: [IN_ATTEMPT],
					acknowledge: function() {
						this.gotoStep(IN_ATTEMPT)
					}
				}
			}
		})

		this.boundOnForceSentAllResponses = this.onForceSentAllResponses.bind(this)
		this.onEndAttempt = onEndAttempt

		this.state = {
			assessment: assessmentObject,
			__endAttemptResponse: null,
			context: null
		}
	}

	startAttempt(startAttemptResp) {
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

		this.gotoStep(IN_ATTEMPT)
	}

	onForceSentAllResponses(payload) {
		// // debugger
		this.dispatch('_onForceSentAllResponses', payload.value)
	}

	onCloseResultsDialog() {
		ModalUtil.hide()
		FocusUtil.focusOnNavTarget()
	}
}

export default AssessmentStateMachine
