import LTIStatus, { UIStates } from './index'

import React from 'react'
import Viewer from 'Viewer'
import focus from 'obojobo-document-engine/src/scripts/common/page/focus'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

jest.mock('obojobo-document-engine/src/scripts/common/page/focus')

const { LTINetworkStates, LTIResyncStates } = Viewer.stores.assessmentStore

const getLtiState = gradebookStatus => ({
	state: {
		gradebookStatus: gradebookStatus
	},
	networkState: LTINetworkStates.IDLE,
	resyncState: LTIResyncStates.NO_RESYNC_ATTEMPTED
})

const mockSymbol = 'mocklti'

const GRADEBOOK_STATUS_ERROR_NEWER_SCORE_UNSENT /*  */ = 'error_newer_assessment_score_unsent'
const GRADEBOOK_STATUS_ERROR_STATE_UNKNOWN /*       */ = 'error_state_unknown'
const GRADEBOOK_STATUS_ERROR_INVALID /*             */ = 'error_invalid'
const GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT /*    */ = 'ok_null_score_not_sent'
const GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE /**/ = 'ok_gradebook_matches_assessment_score'
const GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE /*     */ = 'ok_no_outcome_service'

const originalGetUIState = LTIStatus.prototype.getUIState
describe('LTIStatus', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('LTIStatus component with state GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE returns notLTI', () => {
		expect(
			renderer.create(
				<LTIStatus
					ltiState={getLtiState(GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE)}
					externalSystemLabel={mockSymbol}
				/>
			)
		).toMatchSnapshot()
	})

	test('LTIStatus component with isPreviewing true returns notLTI', () => {
		expect(renderer.create(<LTIStatus isPreviewing={true} />)).toMatchSnapshot()
	})

	test('LTIStatus component with no externalSystemLabel returns notLTI', () => {
		expect(renderer.create(<LTIStatus />)).toMatchSnapshot()
	})

	test('LTIStatus component with lti state GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT returns noScoreSent', () => {
		expect(
			renderer.create(
				<LTIStatus
					ltiState={getLtiState(GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT)}
					externalSystemLabel={mockSymbol}
				/>
			)
		).toMatchSnapshot()
	})

	test('LTIStatus component with lti state GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE returns synced', () => {
		expect(
			renderer.create(
				<LTIStatus
					ltiState={getLtiState(GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE)}
					externalSystemLabel={mockSymbol}
					assessmentScore={75.99}
				/>
			)
		).toMatchSnapshot()
	})

	test('LTIStatus component with an externalSystemLabel and no lti state returns renderError', () => {
		expect(renderer.create(<LTIStatus externalSystemLabel={mockSymbol} />)).toMatchSnapshot()
	})

	test('LTIStatus component with lti state GRADEBOOK_STATUS_ERROR_NEWER_SCORE_UNSENT returns renderError', () => {
		expect(
			renderer.create(
				<LTIStatus
					ltiState={getLtiState(GRADEBOOK_STATUS_ERROR_NEWER_SCORE_UNSENT)}
					externalSystemLabel={mockSymbol}
				/>
			)
		).toMatchSnapshot()
	})

	test('LTIStatus component with lti state GRADEBOOK_STATUS_ERROR_STATE_UNKNOWN returns renderError', () => {
		expect(
			renderer.create(
				<LTIStatus
					ltiState={getLtiState(GRADEBOOK_STATUS_ERROR_STATE_UNKNOWN)}
					externalSystemLabel={mockSymbol}
				/>
			)
		).toMatchSnapshot()
	})

	test('LTIStatus component with lti state GRADEBOOK_STATUS_ERROR_INVALID returns renderError', () => {
		expect(
			renderer.create(
				<LTIStatus
					ltiState={getLtiState(GRADEBOOK_STATUS_ERROR_INVALID)}
					externalSystemLabel={mockSymbol}
				/>
			)
		).toMatchSnapshot()
	})

	test('LTIStatus component with error shows additional information if resync failed', () => {
		const ltiState = {
			state: {
				gradebookStatus: 'error'
			},
			networkState: LTINetworkStates.IDLE,
			resyncState: LTIResyncStates.RESYNC_FAILED
		}
		expect(
			renderer.create(<LTIStatus ltiState={ltiState} externalSystemLabel={mockSymbol} />)
		).toMatchSnapshot()
	})

	test('LTIStatus component shows a resync successful message', () => {
		const ltiState = {
			state: {
				gradebookStatus: GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE
			},
			networkState: LTINetworkStates.IDLE,
			resyncState: LTIResyncStates.RESYNC_SUCCEEDED
		}
		expect(
			renderer.create(<LTIStatus ltiState={ltiState} externalSystemLabel={mockSymbol} />)
		).toMatchSnapshot()
	})

	test('LTIStatus component shows loading state', () => {
		const ltiState = {
			state: {
				gradebookStatus: 'error'
			},
			networkState: LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE
		}
		expect(
			renderer.create(<LTIStatus ltiState={ltiState} externalSystemLabel={mockSymbol} />)
		).toMatchSnapshot()
	})

	test('LTIStatus component calls onClickResendScore when error and button clicked', () => {
		const onClickResendScore = jest.fn()
		const ltiState = {
			state: {
				gradebookStatus: 'error'
			},
			networkState: LTINetworkStates.IDLE
		}
		const component = mount(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={onClickResendScore}
			/>
		)
		component
			.find('button')
			.at(0)
			.simulate('click')
		expect(onClickResendScore).toHaveBeenCalled()
	})

	test('componentDidUpdate calls focus when appropriate', () => {
		const component = mount(<LTIStatus />)
		const instance = component.instance()
		instance.getNextFocusTarget = jest.fn()
		instance.getCurrentAndNextLTIStates = jest.fn()

		// no focus
		instance.nextFocusTarget = null
		instance.componentDidUpdate()
		expect(focus).not.toHaveBeenCalled()
		expect(instance.nextFocusTarget).toBe(null)

		// focus resyncFailed
		instance.getNextFocusTarget.mockReturnValue('resyncFailed')
		instance.nextFocusTarget = 'resyncFailed'
		instance.componentDidUpdate()
		expect(focus).toHaveBeenCalledTimes(1)
		expect(focus).toHaveBeenCalledWith(instance.resyncFailedRef)
		expect(instance.nextFocusTarget).toBe(null)

		// focus component
		instance.getNextFocusTarget.mockReturnValue('component')
		instance.nextFocusTarget = 'component'
		instance.componentDidUpdate()
		expect(focus).toHaveBeenCalledTimes(2)
		expect(focus).toHaveBeenCalledWith(instance.componentRef)
		expect(instance.nextFocusTarget).toBe(null)
	})

	describe('LTIStatus getCurrentAndNextLTIStates', () => {
		test('Returns object with expected properties', () => {
			LTIStatus.prototype.getLTIStatusProps = jest.fn(props => {
				return {
					networkState: props.networkState,
					uiState: props.uiState
				}
			})

			LTIStatus.prototype.getUIState = jest.fn(ltiStatusProps => ltiStatusProps.uiState)

			const ltiStatus = new LTIStatus()

			expect(
				ltiStatus.getCurrentAndNextLTIStates(
					{
						networkState: 'current-network-state',
						uiState: 'current-ui-state'
					},
					{
						networkState: 'next-network-state',
						uiState: 'next-ui-state'
					}
				)
			).toEqual({
				currentLTINetworkState: 'current-network-state',
				nextLTINetworkState: 'next-network-state',
				currentUIState: 'current-ui-state',
				nextUIState: 'next-ui-state'
			})
		})
	})

	describe('LTIStatus getLTIStatusProps', () => {
		const p = LTIStatus.prototype.getLTIStatusProps

		test('getLTIStatusProps transforms LTIStatus props into a flat structure', () => {
			expect(
				p({
					ltiState: {
						state: {
							gradebookStatus: 'mock-gradebook-status'
						},
						networkState: 'mock-network-state',
						resyncState: 'mock-resync-state'
					},
					externalSystemLabel: 'mock-external-system-label',
					assessmentScore: 33.3,
					isPreviewing: 'mock-is-previewing'
				})
			).toEqual({
				isLTIDataComplete: true,
				gradebookStatus: 'mock-gradebook-status',
				networkState: 'mock-network-state',
				resyncState: 'mock-resync-state',
				isPreviewing: 'mock-is-previewing',
				externalSystemLabel: 'mock-external-system-label',
				roundedAssessmentScore: 33
			})
		})

		test('handles incomplete LTI data', () => {
			expect(
				p({
					externalSystemLabel: 'mock-external-system-label',
					assessmentScore: 33.3,
					isPreviewing: 'mock-is-previewing'
				})
			).toEqual({
				isLTIDataComplete: false,
				gradebookStatus: null,
				networkState: null,
				resyncState: null,
				isPreviewing: 'mock-is-previewing',
				externalSystemLabel: 'mock-external-system-label',
				roundedAssessmentScore: 33
			})

			expect(
				p({
					ltiState: {
						networkState: 'mock-network-state',
						resyncState: 'mock-resync-state'
					},
					externalSystemLabel: 'mock-external-system-label',
					assessmentScore: 33.3,
					isPreviewing: 'mock-is-previewing'
				})
			).toEqual({
				isLTIDataComplete: false,
				gradebookStatus: null,
				networkState: 'mock-network-state',
				resyncState: 'mock-resync-state',
				isPreviewing: 'mock-is-previewing',
				externalSystemLabel: 'mock-external-system-label',
				roundedAssessmentScore: 33
			})
		})
	})

	describe('LTIStatus getNextFocusTarget', () => {
		test('Returns expected focus targets', () => {
			const NET_IDLE = LTINetworkStates.IDLE
			const NET_WAIT = LTINetworkStates.AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE
			const U_NOTL = UIStates.UI_NOT_LTI
			const U_EROR = UIStates.UI_ERROR
			const U_FAIL = UIStates.UI_ERROR_RESYNC_FAILED
			const U_NOSC = UIStates.UI_NO_SCORE_SENT
			const U_SYNC = UIStates.UI_SYNCED
			const U_RSNC = UIStates.UI_RESYNCED

			const tc = (currentLTINetworkState, nextLTINetworkState, currentUIState, nextUIState) => {
				return LTIStatus.prototype.getNextFocusTarget({
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

	describe('LTIStatus getUIState', () => {
		beforeAll(() => {
			LTIStatus.prototype.getUIState = originalGetUIState
		})
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
			return LTIStatus.prototype.getUIState({
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
})
