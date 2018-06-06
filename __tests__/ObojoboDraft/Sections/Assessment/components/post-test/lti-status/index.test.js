import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import LTIStatus from 'ObojoboDraft/Sections/Assessment/components/post-test/lti-status'

const getLtiState = state => ({
	state: {
		gradebookStatus: state
	},
	networkState: 'idle',
	errorCount: 0
})

const mockSymbol = 'mocklti'

const GRADEBOOK_STATUS_ERROR_NEWER_SCORE_UNSENT /*  */ = 'error_newer_assessment_score_unsent'
const GRADEBOOK_STATUS_ERROR_STATE_UNKNOWN /*       */ = 'error_state_unknown'
const GRADEBOOK_STATUS_ERROR_INVALID /*             */ = 'error_invalid'
const GRADEBOOK_STATUS_OK_NULL_SCORE_NOT_SENT /*    */ = 'ok_null_score_not_sent'
const GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE /**/ = 'ok_gradebook_matches_assessment_score'
const GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE /*     */ = 'ok_no_outcome_service'

const AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE = 'awaitingSendAssessmentScoreResponse'

describe('LTIStatus', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	/////////////////////
	// return notLTI
	test('LTIStatus component with state GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE returns notLTI', () => {
		expect(
			renderer.create(<LTIStatus ltiState={getLtiState(GRADEBOOK_STATUS_OK_NO_OUTCOME_SERVICE)} externalSystemLabel={mockSymbol} />)
		).toMatchSnapshot()
	})

	test('LTIStatus component with isPreviewing true returns notLTI', () => {
		expect(renderer.create(<LTIStatus isPreviewing={true} />)).toMatchSnapshot()
	})

	test('LTIStatus component with no externalSystemLabel returns notLTI', () => {
		expect(renderer.create(<LTIStatus />)).toMatchSnapshot()
	})
	/////////////////////

	/////////////////////
	// return noScoreSent
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
	/////////////////////

	/////////////////////
	// return synced
	test('LTIStatus component with lti state GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE returns synced', () => {
		expect(
			renderer.create(
				<LTIStatus
					ltiState={getLtiState(GRADEBOOK_STATUS_OK_GRADEBOOK_MATCHES_SCORE)}
					externalSystemLabel={mockSymbol}
					assessmentScore={75}
				/>
			)
		).toMatchSnapshot()
	})

	/////////////////////
	// return renderError
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

	test('LTIStatus component with error shows additional information if errorCount is above 0', () => {
		const ltiState = {
			state: {
				gradebookStatus: 'error'
			},
			networkState: 'idle',
			errorCount: 1
		}
		expect(
			renderer.create(<LTIStatus ltiState={ltiState} externalSystemLabel={mockSymbol} />)
		).toMatchSnapshot()
	})

	test('LTIStatus component with error shows a loading state', () => {
		const ltiState = {
			state: {
				gradebookStatus: 'error'
			},
			networkState: AWAITING_SEND_ASSESSMENT_SCORE_RESPONSE,
			errorCount: 0
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
			networkState: 'idle',
			errorCount: 0
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
})
