import LTIStatus from './index'
import React from 'react'
import ReactDOM from 'react-dom'
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

	test('componentWillReceiveProps updates nextFocusEl', () => {
		const component = mount(<LTIStatus />)
		component.instance().getNextFocusTarget = jest.fn(() => 'mock-focus-target')
		component.instance().getCurrentAndNextLTIStates = jest.fn()

		expect(component.instance().nextFocusTarget).toBe(null)
		component.instance().componentWillReceiveProps()
		expect(component.instance().getNextFocusTarget).toHaveBeenCalledTimes(1)
		expect(component.instance().nextFocusTarget).toBe('mock-focus-target')
	})

	test('componentDidUpdate calls focus', () => {
		jest.spyOn(ReactDOM, 'findDOMNode')
		ReactDOM.findDOMNode.mockReturnValueOnce('mock-dom-node')

		const component = mount(<LTIStatus />)

		component.instance().nextFocusTarget = null
		component.instance().componentDidUpdate()
		expect(focus).not.toHaveBeenCalled()
		expect(component.instance().nextFocusTarget).toBe(null)

		component.instance().nextFocusTarget = 'resyncFailed'
		component.instance().componentDidUpdate()
		expect(focus).toHaveBeenCalledTimes(1)
		expect(focus).toHaveBeenCalledWith(component.instance().refs.resyncFailed)
		expect(component.instance().nextFocusTarget).toBe(null)

		component.instance().nextFocusTarget = 'component'
		component.instance().componentDidUpdate()
		expect(focus).toHaveBeenCalledTimes(2)
		expect(focus).toHaveBeenCalledWith('mock-dom-node')
		expect(component.instance().nextFocusTarget).toBe(null)
	})
})
