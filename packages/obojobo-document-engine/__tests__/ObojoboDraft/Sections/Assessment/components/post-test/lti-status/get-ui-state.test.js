import Viewer from 'Viewer'

const { LTIResyncStates } = Viewer.stores.assessmentStore

import * as LTIStatus from '../../../../../../../ObojoboDraft/Sections/Assessment/components/post-test/lti-status'

describe('LTIStatus getUIState', () => {
	const UIStates = LTIStatus.UIStates

	const GB_NULL_SCORE = 'ok_null_score_not_sent'
	const GB_MATCHES = 'ok_gradebook_matches_assessment_score'
	const GB_NO_SERVICE = 'ok_no_outcome_service'

	// Function to create test case:
	const tc = (
		isPreviewing,
		hasExternalSystemLabel,
		isLTIDataComplete,
		resyncState,
		gradebookStatus
	) => {
		return LTIStatus.default.prototype.getUIState({
			isPreviewing: Boolean(isPreviewing),
			externalSystemLabel: hasExternalSystemLabel ? 'mock-external-system-label' : null,
			isLTIDataComplete: Boolean(isLTIDataComplete),
			resyncState: resyncState,
			gradebookStatus
		})
	}

	const RS_PASS = LTIResyncStates.RESYNC_SUCCEEDED
	const RS_FAIL = LTIResyncStates.RESYNC_FAILED
	const NO_RSNC = LTIResyncStates.NO_RESYNC_ATTEMPTED

	test('test all possible getLTIStatusUIStates outcomes', () => {
		expect(tc(0, 0, 0, NO_RSNC, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 0, RS_FAIL, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 0, RS_PASS, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 1, NO_RSNC, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 1, RS_FAIL, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 1, RS_PASS, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 1, 0, NO_RSNC, GB_NULL_SCORE)).toBe(UIStates.UI_ERROR)
		expect(tc(0, 1, 0, RS_FAIL, GB_NULL_SCORE)).toBe(UIStates.UI_ERROR_RESYNC_FAILED)
		expect(tc(0, 1, 0, RS_PASS, GB_NULL_SCORE)).toBe(UIStates.UI_ERROR)
		expect(tc(0, 1, 1, NO_RSNC, GB_NULL_SCORE)).toBe(UIStates.UI_NO_SCORE_SENT)
		expect(tc(0, 1, 1, RS_FAIL, GB_NULL_SCORE)).toBe(UIStates.UI_NO_SCORE_SENT)
		expect(tc(0, 1, 1, RS_PASS, GB_NULL_SCORE)).toBe(UIStates.UI_NO_SCORE_SENT)
		expect(tc(1, 0, 0, NO_RSNC, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 0, RS_FAIL, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 0, RS_PASS, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 1, NO_RSNC, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 1, RS_FAIL, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 1, RS_PASS, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 0, NO_RSNC, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 0, RS_FAIL, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 0, RS_PASS, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 1, NO_RSNC, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 1, RS_FAIL, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 1, RS_PASS, GB_NULL_SCORE)).toBe(UIStates.UI_NOT_LTI)

		expect(tc(0, 0, 0, NO_RSNC, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 0, RS_FAIL, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 0, RS_PASS, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 1, NO_RSNC, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 1, RS_FAIL, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 1, RS_PASS, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 1, 0, NO_RSNC, GB_MATCHES)).toBe(UIStates.UI_ERROR)
		expect(tc(0, 1, 0, RS_FAIL, GB_MATCHES)).toBe(UIStates.UI_ERROR_RESYNC_FAILED)
		expect(tc(0, 1, 0, RS_PASS, GB_MATCHES)).toBe(UIStates.UI_ERROR)
		expect(tc(0, 1, 1, NO_RSNC, GB_MATCHES)).toBe(UIStates.UI_SYNCED)
		expect(tc(0, 1, 1, RS_FAIL, GB_MATCHES)).toBe(UIStates.UI_SYNCED)
		expect(tc(0, 1, 1, RS_PASS, GB_MATCHES)).toBe(UIStates.UI_RESYNCED)
		expect(tc(1, 0, 0, NO_RSNC, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 0, RS_FAIL, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 0, RS_PASS, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 1, NO_RSNC, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 1, RS_FAIL, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 1, RS_PASS, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 0, NO_RSNC, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 0, RS_FAIL, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 0, RS_PASS, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 1, NO_RSNC, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 1, RS_FAIL, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 1, RS_PASS, GB_MATCHES)).toBe(UIStates.UI_NOT_LTI)

		expect(tc(0, 0, 0, NO_RSNC, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 0, RS_FAIL, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 0, RS_PASS, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 1, NO_RSNC, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 1, RS_FAIL, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 0, 1, RS_PASS, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 1, 0, NO_RSNC, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 1, 0, RS_FAIL, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 1, 0, RS_PASS, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 1, 1, NO_RSNC, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 1, 1, RS_FAIL, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(0, 1, 1, RS_PASS, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 0, NO_RSNC, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 0, RS_FAIL, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 0, RS_PASS, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 1, NO_RSNC, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 1, RS_FAIL, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 0, 1, RS_PASS, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 0, NO_RSNC, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 0, RS_FAIL, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 0, RS_PASS, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 1, NO_RSNC, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 1, RS_FAIL, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
		expect(tc(1, 1, 1, RS_PASS, GB_NO_SERVICE)).toBe(UIStates.UI_NOT_LTI)
	})
})
