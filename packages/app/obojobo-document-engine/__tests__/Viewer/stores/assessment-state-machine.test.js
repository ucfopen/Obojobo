import AssessmentStateMachine from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-state-machine'
import AssessmentNetworkStates from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store/assessment-network-states'
import AssessmentStateActions from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store/assessment-state-actions'
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

	test('NOT_IN_ATTEMPT(FETCH_ATTEMPT_HISTORY) -> FETCHING_ATTEMPT_HISTORY if attempt history is not loaded', () => {
		const assessmentStoreState = {
			assessments: {
				mockAssessmentId: {
					id: 'mockAssessmentId',
					attemptHistoryNetworkState: 'none'
				}
			},
			assessmentSummaries: {
				mockAssessmentId: {}
			}
		}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)
		m.start(jest.fn())

		AssessmentStateHelpers.getAttemptHistoryWithReviewData.mockResolvedValue({})

		m.send(FETCH_ATTEMPT_HISTORY)

		expect(m.getCurrentState()).toBe(FETCHING_ATTEMPT_HISTORY)
	})
})
