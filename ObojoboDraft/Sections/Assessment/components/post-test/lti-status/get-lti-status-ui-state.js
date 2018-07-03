import Viewer from 'Viewer'

const { LTIResyncStates } = Viewer.stores.assessmentStore

import UIStates from './lti-status-ui-states'

export default ltiProps => {
	if (
		ltiProps.isPreviewing ||
		!ltiProps.externalSystemLabel ||
		ltiProps.gradebookStatus === 'ok_no_outcome_service'
	) {
		return UIStates.UI_NOT_LTI
	}
	if (ltiProps.externalSystemLabel && !ltiProps.isLTIDataComplete) return UIStates.UI_ERROR
	if (ltiProps.gradebookStatus === 'ok_null_score_not_sent') return UIStates.UI_NO_SCORE_SENT
	if (ltiProps.gradebookStatus === 'ok_gradebook_matches_assessment_score') {
		if (ltiProps.resyncState === LTIResyncStates.RESYNC_SUCCEEDED) {
			return UIStates.UI_RESYNCED
		}
		return UIStates.UI_SYNCED
	}

	return UIStates.UI_ERROR
}
