import { Machine, interpret, assign } from 'xstate'

import APIUtil from '../util/api-util'
import Common from 'Common'
import NavStore from '../stores/nav-store'
import AssessmentNetworkStates from './assessment-store/assessment-network-states'
import AssessmentStateActions from './assessment-store/assessment-state-actions'
import NavUtil from '../util/nav-util'

import AssessmentStateHelpers from './assessment-state-helpers'
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

const updateContextWithAssessmentResponse = assign({
	// When the src function is completed the results will be
	// put into event.data. It will then call this action. assign() will
	// set the contents of event.data into this machine's context,
	// therefore making context.currentAttempt = the attempt data
	// returned by AssessmentStateHelpers.startAttempt

	assessment: (context, event) => {
		context.assessment.current = event.data.value
		return context.assessment
	}
})

const updateContextWithError = assign({
	assessment: (context, event) => {
		if (!context.assessment.current) {
			context.assessment.current = {}
		}

		context.assessment.current.error = event.data.message

		return context.assessment
	}
})

class AssessmentStateMachine {
	constructor(assessmentObject) {
		//eslint-disable-next-line new-cap
		this.machine = Machine({
			id: 'assessment',
			initial: NOT_IN_ATTEMPT,
			context: {
				assessment: assessmentObject
				// forceSentAllResponsesListener: null
			},
			states: {
				[NOT_IN_ATTEMPT]: {
					on: {
						[START_ATTEMPT]: STARTING_ATTEMPT,
						[PROMPT_FOR_IMPORT]: PROMPTING_FOR_IMPORT,
						[PROMPT_FOR_RESUME]: PROMPTING_FOR_RESUME
					}
				},
				[STARTING_ATTEMPT]: {
					invoke: {
						id: 'startAttempt',
						src: async context => {
							return await AssessmentStateHelpers.startAttempt(context.assessment.id)
						},
						onDone: {
							target: IN_ATTEMPT,
							actions: [updateContextWithAssessmentResponse]
						},
						onError: {
							target: START_ATTEMPT_FAILED,
							actions: [updateContextWithError]
						}
					}
				},
				[PROMPTING_FOR_IMPORT]: {
					on: {
						[START_ATTEMPT]: STARTING_ATTEMPT,
						[IMPORT_ATTEMPT]: IMPORTING_ATTEMPT
					}
				},
				[IMPORTING_ATTEMPT]: {
					invoke: {
						id: 'importAttempt',
						src: () => {},
						onDone: IN_ATTEMPT,
						onError: {
							target: IMPORT_ATTEMPT_FAILED,
							actions: [updateContextWithError]
						}
					}
				},
				[PROMPTING_FOR_RESUME]: {
					on: {
						[RESUME_ATTEMPT]: RESUMING_ATTEMPT
					}
				},
				[RESUMING_ATTEMPT]: {
					invoke: {
						id: 'resumeAttempt',
						src: async context => {
							const { draftId, attemptId } = context.assessment.unfinishedAttempt
							return await AssessmentStateHelpers.resumeAttempt(draftId, attemptId)
						},
						onDone: {
							target: IN_ATTEMPT,
							actions: updateContextWithAssessmentResponse
						},
						onError: {
							target: RESUME_ATTEMPT_FAILED,
							actions: [updateContextWithError]
						}
					}
				},
				[IN_ATTEMPT]: {
					on: {
						[SEND_RESPONSES]: SENDING_RESPONSES
					}
				},
				[START_ATTEMPT_FAILED]: {
					on: {
						[ACKNOWLEDGE]: NOT_IN_ATTEMPT
					}
				},
				[IMPORT_ATTEMPT_FAILED]: {
					on: {
						[ACKNOWLEDGE]: NOT_IN_ATTEMPT
					}
				},
				[RESUME_ATTEMPT_FAILED]: {
					on: {
						[ACKNOWLEDGE]: PROMPTING_FOR_RESUME
					}
				},
				[SENDING_RESPONSES]: {
					invoke: {
						id: 'sendingResponses',
						src: async context => {
							const { assessmentId, attemptId } = context.assessment.current
							return await AssessmentStateHelpers.sendResponses(assessmentId, attemptId)
						},
						onDone: SEND_RESPONSES_SUCCESSFUL,
						onError: {
							target: SEND_RESPONSES_FAILED,
							actions: [updateContextWithError]
						}
					}
				},
				[SEND_RESPONSES_SUCCESSFUL]: {
					on: {
						[END_ATTEMPT]: ENDING_ATTEMPT,
						[CONTINUE_ATTEMPT]: IN_ATTEMPT
					}
				},
				[SEND_RESPONSES_FAILED]: {
					on: {
						retry: SENDING_RESPONSES,
						[CONTINUE_ATTEMPT]: IN_ATTEMPT
					}
				},
				[ENDING_ATTEMPT]: {
					invoke: {
						id: 'endAttempt',
						src: async context => {
							const { assessmentId, attemptId } = context.assessment.current
							const draftId = OboModel.models[assessmentId].getRoot().get('draftId')

							return await AssessmentStateHelpers.endAttempt(draftId, attemptId)
						},
						onDone: {
							target: END_ATTEMPT_SUCCESSFUL,
							actions: [
								assign({
									assessment: (context, event) => {
										context.assessment.attempts = event.data.attempts
										context.assessment.highestAssessmentScoreAttempts =
											event.data.highestAssessmentScoreAttempts
										context.assessment.highestAttemptScoreAttempts =
											event.data.highestAttemptScoreAttempts
										context.assessment.lti = event.data.lti
										context.assessment.unfinishedAttempt = event.data.unfinishedAttempt
										context.assessment.current = null
										// context.assessment = { ...context.assessment, ...event.data, current: null }

										return context.assessment
									}
								})
							]
						},
						onError: {
							target: END_ATTEMPT_FAILED,
							actions: [updateContextWithError]
						}
					}
				},
				[END_ATTEMPT_SUCCESSFUL]: {
					on: {
						[ACKNOWLEDGE]: NOT_IN_ATTEMPT
					}
				},
				[END_ATTEMPT_FAILED]: {
					on: {
						[ACKNOWLEDGE]: IN_ATTEMPT
					}
				}
			}
		})

		this.service = interpret(this.machine)
	}

	send(action) {
		this.service.send(action)
	}

	getCurrentState() {
		return this.service.state.value
	}

	start(onTransition) {
		this.service.start()
		this.service.onTransition((state, oldValues) => {
			if (!state.changed) {
				return
			}

			onTransition(this, state, oldValues)
		})
	}

	stop() {
		this.service.stop()
	}

	// startAttempt() {
	// 	this.service.send('startAttempt')
	// }
}

export default AssessmentStateMachine
