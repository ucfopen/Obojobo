import * as LTIStatus from '../../../../../../../ObojoboDraft/Sections/Assessment/components/post-test/lti-status'

import LTINetworkStates from '../../../../../../../src/scripts/viewer/stores/assessment-store/lti-network-states'

describe('LTIStatus getNextFocusTarget', () => {
	test('Returns expected focus targets', () => {
		const NET_IDLE = LTINetworkStates.IDLE
		const NET_WAIT = LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE
		const U_NOTL = LTIStatus.UIStates.UI_NOT_LTI
		const U_EROR = LTIStatus.UIStates.UI_ERROR
		const U_FAIL = LTIStatus.UIStates.UI_ERROR_RESYNC_FAILED
		const U_NOSC = LTIStatus.UIStates.UI_NO_SCORE_SENT
		const U_SYNC = LTIStatus.UIStates.UI_SYNCED
		const U_RSNC = LTIStatus.UIStates.UI_RESYNCED

		const tc = (currentLTINetworkState, nextLTINetworkState, currentUIState, nextUIState) => {
			return LTIStatus.default.prototype.getNextFocusTarget({
				currentLTINetworkState,
				nextLTINetworkState,
				currentUIState,
				nextUIState
			})
		}

		expect(tc(NET_IDLE, NET_IDLE, U_NOTL, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOTL, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOTL, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOTL, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOTL, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOTL, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_IDLE, U_EROR, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_EROR, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_EROR, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_EROR, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_EROR, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_EROR, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_IDLE, U_FAIL, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_FAIL, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_FAIL, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_FAIL, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_FAIL, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_FAIL, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_IDLE, U_NOSC, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOSC, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOSC, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOSC, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOSC, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_NOSC, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_IDLE, U_SYNC, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_SYNC, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_SYNC, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_SYNC, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_SYNC, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_SYNC, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_IDLE, U_RSNC, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_RSNC, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_RSNC, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_RSNC, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_RSNC, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_IDLE, U_RSNC, U_RSNC)).toBe(null)

		//

		expect(tc(NET_IDLE, NET_WAIT, U_NOTL, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOTL, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOTL, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOTL, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOTL, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOTL, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_WAIT, U_EROR, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_EROR, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_EROR, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_EROR, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_EROR, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_EROR, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_WAIT, U_FAIL, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_FAIL, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_FAIL, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_FAIL, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_FAIL, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_FAIL, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_WAIT, U_NOSC, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOSC, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOSC, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOSC, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOSC, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_NOSC, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_WAIT, U_SYNC, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_SYNC, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_SYNC, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_SYNC, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_SYNC, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_SYNC, U_RSNC)).toBe(null)

		expect(tc(NET_IDLE, NET_WAIT, U_RSNC, U_NOTL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_RSNC, U_EROR)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_RSNC, U_FAIL)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_RSNC, U_NOSC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_RSNC, U_SYNC)).toBe(null)
		expect(tc(NET_IDLE, NET_WAIT, U_RSNC, U_RSNC)).toBe(null)

		//

		expect(tc(NET_WAIT, NET_IDLE, U_NOTL, U_NOTL)).toBe(null)
		expect(tc(NET_WAIT, NET_IDLE, U_NOTL, U_EROR)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_NOTL, U_FAIL)).toBe('resyncFailed')
		expect(tc(NET_WAIT, NET_IDLE, U_NOTL, U_NOSC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_NOTL, U_SYNC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_NOTL, U_RSNC)).toBe('component')

		expect(tc(NET_WAIT, NET_IDLE, U_EROR, U_NOTL)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_EROR, U_EROR)).toBe(null)
		expect(tc(NET_WAIT, NET_IDLE, U_EROR, U_FAIL)).toBe('resyncFailed')
		expect(tc(NET_WAIT, NET_IDLE, U_EROR, U_NOSC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_EROR, U_SYNC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_EROR, U_RSNC)).toBe('component')

		expect(tc(NET_WAIT, NET_IDLE, U_FAIL, U_NOTL)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_FAIL, U_EROR)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_FAIL, U_FAIL)).toBe(null)
		expect(tc(NET_WAIT, NET_IDLE, U_FAIL, U_NOSC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_FAIL, U_SYNC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_FAIL, U_RSNC)).toBe('component')

		expect(tc(NET_WAIT, NET_IDLE, U_NOSC, U_NOTL)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_NOSC, U_EROR)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_NOSC, U_FAIL)).toBe('resyncFailed')
		expect(tc(NET_WAIT, NET_IDLE, U_NOSC, U_NOSC)).toBe(null)
		expect(tc(NET_WAIT, NET_IDLE, U_NOSC, U_SYNC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_NOSC, U_RSNC)).toBe('component')

		expect(tc(NET_WAIT, NET_IDLE, U_SYNC, U_NOTL)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_SYNC, U_EROR)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_SYNC, U_FAIL)).toBe('resyncFailed')
		expect(tc(NET_WAIT, NET_IDLE, U_SYNC, U_NOSC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_SYNC, U_SYNC)).toBe(null)
		expect(tc(NET_WAIT, NET_IDLE, U_SYNC, U_RSNC)).toBe('component')

		expect(tc(NET_WAIT, NET_IDLE, U_RSNC, U_NOTL)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_RSNC, U_EROR)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_RSNC, U_FAIL)).toBe('resyncFailed')
		expect(tc(NET_WAIT, NET_IDLE, U_RSNC, U_NOSC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_RSNC, U_SYNC)).toBe('component')
		expect(tc(NET_WAIT, NET_IDLE, U_RSNC, U_RSNC)).toBe(null)

		//

		expect(tc(NET_WAIT, NET_WAIT, U_NOTL, U_NOTL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOTL, U_EROR)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOTL, U_FAIL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOTL, U_NOSC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOTL, U_SYNC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOTL, U_RSNC)).toBe(null)

		expect(tc(NET_WAIT, NET_WAIT, U_EROR, U_NOTL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_EROR, U_EROR)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_EROR, U_FAIL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_EROR, U_NOSC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_EROR, U_SYNC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_EROR, U_RSNC)).toBe(null)

		expect(tc(NET_WAIT, NET_WAIT, U_FAIL, U_NOTL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_FAIL, U_EROR)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_FAIL, U_FAIL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_FAIL, U_NOSC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_FAIL, U_SYNC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_FAIL, U_RSNC)).toBe(null)

		expect(tc(NET_WAIT, NET_WAIT, U_NOSC, U_NOTL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOSC, U_EROR)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOSC, U_FAIL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOSC, U_NOSC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOSC, U_SYNC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_NOSC, U_RSNC)).toBe(null)

		expect(tc(NET_WAIT, NET_WAIT, U_SYNC, U_NOTL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_SYNC, U_EROR)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_SYNC, U_FAIL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_SYNC, U_NOSC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_SYNC, U_SYNC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_SYNC, U_RSNC)).toBe(null)

		expect(tc(NET_WAIT, NET_WAIT, U_RSNC, U_NOTL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_RSNC, U_EROR)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_RSNC, U_FAIL)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_RSNC, U_NOSC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_RSNC, U_SYNC)).toBe(null)
		expect(tc(NET_WAIT, NET_WAIT, U_RSNC, U_RSNC)).toBe(null)
	})
})
