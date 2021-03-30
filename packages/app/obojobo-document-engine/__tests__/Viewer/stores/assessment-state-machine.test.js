import AssessmentStateMachine from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-state-machine'
import AssessmentNetworkStates from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store/assessment-network-states'
import AssessmentStateActions from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store/assessment-state-actions'
import { done } from 'xstate/lib/actions'
import OboModel from '../../../src/scripts/common/models/obo-model'
import AssessmentStateHelpers from '../../../src/scripts/viewer/stores/assessment-state-helpers'

jest.mock('../../../src/scripts/viewer/stores/assessment-state-helpers')

const {
	INIT,
	PROMPTING_FOR_RESUME,
	PRE_STARTING_ATTEMPT,
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
	// IMPORT_ATTEMPT_SUCCESSFUL,
	FETCHING_ATTEMPT_HISTORY,
	FETCH_HISTORY_FAILED
} = AssessmentNetworkStates

const {
	FETCH_ATTEMPT_HISTORY,
	START_ATTEMPT,
	// PROMPT_FOR_IMPORT,
	// PROMPT_FOR_RESUME,
	IMPORT_ATTEMPT,
	ABANDON_IMPORT,
	RESUME_ATTEMPT,
	// TRY_TO_SUBMIT,
	SEND_RESPONSES,
	ACKNOWLEDGE,
	END_ATTEMPT,
	CONTINUE_ATTEMPT
	// RETRY
} = AssessmentStateActions

/*
Pathways to test:

[x] INIT -> PROMPTING_FOR_RESUME
[x] INIT -> NOT_IN_ATTEMPT
[x] NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) -> cond=true -> FETCHING_ATTEMPT_HISTORY
[x] NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) -> cond=false -> NOT_IN_ATTEMPT
[ ] NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isNoImportAvailable -> STARTING_ATTEMPT -> onDone -> IN_ATTEMPT
[ ] NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isNoImportAvailable -> STARTING_ATTEMPT -> onError -> START_ATTEMPT_FAILED
[ ] NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isImportAvailable -> PROMPTING_FOR_IMPORT
[ ] FETCHING_ATTEMPT_HISTORY -> onDone -> NOT_IN_ATTEMPT
[ ] FETCHING_ATTEMPT_HISTORY -> onError -> FETCH_HISTORY_FAILED
[ ] FETCH_HISTORY_FAILED(FETCH_ATTEMPT_HISTORY) -> FETCHING_ATTEMPT_HISTORY
[ ] FETCH_HISTORY_FAILED(ACKNOWLEDGE) -> NOT_IN_ATTEMPT
[ ] PROMPTING_FOR_IMPORT(ABANDON_IMPORT) -> STARTING_ATTEMPT
[ ] PROMPTING_FOR_IMPORT(IMPORT_ATTEMPT) -> IMPORTING_ATTEMPT
[ ] IMPORTING_ATTEMPT -> onDone -> END_ATTEMPT_SUCCESSFUL
[ ] IMPORTING_ATTEMPT -> onError -> IMPORT_ATTEMPT_FAILED
[ ] PROMPTING_FOR_RESUME(RESUME_ATTEMPT) -> RESUMING_ATTEMPT
[ ] RESUMING_ATTEMPT -> onDone -> IN_ATTEMPT
[ ] RESUMING_ATTEMPT -> onError -> RESUME_ATTEMPT_FAILED
[ ] IN_ATTEMPT(SEND_RESPONSES) -> SENDING_RESPONSES
[ ] START_ATTEMPT_FAILED(ACKNOWLEDGE) -> NOT_IN_ATTEMPT
[ ] IMPORT_ATTEMPT_FAILED(ACKNOWLEDGE) -> NOT_IN_ATTEMPT
[ ] RESUME_ATTEMPT_FAILED(ACKNOWLEDGE) -> PROMPTING_FOR_RESUME
[ ] SENDING_RESPONSES -> onDone -> SEND_RESPONSES_SUCCESSFUL
[ ] SENDING_RESPONSES -> onError -> SEND_RESPONSES_FAILED
[ ] SEND_RESPONSES_SUCCESSFUL(END_ATTEMPT) -> ENDING_ATTEMPT
[ ] SEND_RESPONSES_SUCCESSFUL(CONTINUE_ATTEMPT) -> IN_ATTEMPT
[ ] SEND_RESPONSES_FAILED(CONTINUE_ATTEMPT) -> END_ATTEMPT
[ ] ENDING_ATTEMPT -> onDone -> END_ATTEMPT_SUCCESSFUL
[ ] ENDING_ATTEMPT -> onError -> END_ATTEMPT_FAILED
[ ] END_ATTEMPT_SUCCESSFUL(ACKNOWLEDGE) -> NOT_IN_ATTEMPT
[ ] END_ATTEMPT_FAILED(ACKNOWLEDGE) -> IN_ATTEMPT
*/

describe('AssessmentStateMachine', () => {
	beforeEach(() => {
		OboModel.models.mockAssessmentId = {
			get: key => {
				switch (key) {
					case 'id':
						return 'mockAssessmentId'

					case 'type':
						return 'ObojoboDraft.Sections.Assessment'
				}
			}
		}
	})

	test('State machine defaults to NOT_IN_ATTEMPT when there is no attempt data', () => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {},
			assessmentSummaries: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
	})

	test('State machine defaults to NOT_IN_ATTEMPT when there is no attempt to resume', () => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {
				mockAssessmentId: {}
			},
			assessmentSummaries: {
				mockAssessmentId: {
					unfinishedAttemptId: null
				}
			}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
	})

	test('State machine defaults to PROMPTING_FOR_RESUME when there is an attempt to resume', () => {
		const assessmentStoreState = {
			importableScores: {},
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {
					unfinishedAttemptId: 'mockAttemptId'
				}
			}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		expect(m.getCurrentState()).toBe(PROMPTING_FOR_RESUME)
	})

	test.only('NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) -> FETCHING_ATTEMPT_HISTORY if attempt history is not loaded', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentStateHelpers.getAttemptHistoryWithReviewData.mockResolvedValue({
			value: [
				{
					assessmentId: 'mockAssessmentId',
					ltiState: 'mockLtiState',
					attempts: [
						{
							isImported: false,
							isFinished: true,
							assessmentScore: 90,
							result: {
								attemptScore: 100
							}
						},
						{
							isImported: false,
							isFinished: false,
							assessmentScore: 100,
							result: {
								attemptScore: 90
							}
						}
					]
				}
			]
		})

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(FETCH_ATTEMPT_HISTORY)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
			expect(m.machine.context.assessmentStoreState).toBe({
				assessments: {
					mockAssessmentId: {
						id: 'mockAssessmentId',
						attemptHistoryNetworkState: 'none'
					}
				},
				assessmentSummaries: {
					mockAssessmentId: {}
				},
				importableScores: {}
			})
			done()
		})
	})

	test('NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) does nothing if attempt history is not loaded', () => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'loaded'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentStateHelpers.getAttemptHistoryWithReviewData.mockResolvedValue({})

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(FETCH_ATTEMPT_HISTORY)
		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
	})

	test('NOT_IN_ATTEMPT(START_ATTEMPT) -> cond=isNoImportAvailable -> STARTING_ATTEMPT -> onDone -> IN_ATTEMPT', done => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			},
			importableScores: {}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentStateHelpers.getAttemptHistoryWithReviewData.mockResolvedValue({ value: [] })
		AssessmentStateHelpers.startAttempt.mockResolvedValue({ value: {} })

		expect(m.getCurrentState()).toBe(NOT_IN_ATTEMPT)
		m.send(START_ATTEMPT)

		setTimeout(() => {
			expect(m.getCurrentState()).toBe(IN_ATTEMPT)
			done()
		})
	})
})
