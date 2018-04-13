import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme'

import {
	moduleData,
	initModuleData,
	AssessmentStore
} from '../../../../__mocks__/viewer-state.mock'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import {
	getAttemptStartServerResponse,
	getAttemptEndServerResponse
} from '../../../../__mocks__/assessment-server.mock'
import LTIStatus from '../../../../ObojoboDraft/Sections/Assessment/components/score-submitted/lti-status'
import AssessmentUtil from '../../../../src/scripts/viewer/util/assessment-util'

jest.mock('../../../../src/scripts/viewer/util/assessment-util', () => {
	return {
		resendLTIScore: jest.fn()
	}
})

describe('lti-status', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test.skip('renders nothing for ok_no_outcome_service or ok_null_score_not_sent gradebook statuses', () => {
		let resendScore = jest.fn()
		let ltiState = {
			state: {
				gradebookStatus: 'ok_no_outcome_service'
			},
			networkState: 'idle',
			errorCount: 0
		}
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		let el = document.createElement('div')
		el.innerHTML = shallow(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		).html()

		// Expect no error message box
		expect(el.textContent.indexOf('There was a problem')).toBe(-1)

		// Expect no sync notification
		expect(el.textContent.indexOf('sent to')).toBe(-1)

		ltiState = {
			state: {
				gradebookStatus: 'ok_null_score_not_sent'
			},
			networkState: 'idle',
			errorCount: 0
		}

		el = document.createElement('div')
		el.innerHTML = shallow(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		).html()

		// Expect no error message box
		expect(el.textContent.indexOf('There was a problem')).toBe(-1)

		// Expect no sync notification
		expect(el.textContent.indexOf('sent to')).toBe(-1)
	})

	test('renders no error message for ok_gradebook_matches_assessment_score', () => {
		let resendScore = jest.fn()
		let ltiState = {
			state: {
				gradebookStatus: 'ok_gradebook_matches_assessment_score'
			},
			networkState: 'idle',
			errorCount: 0
		}
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		let el = document.createElement('div')
		el.innerHTML = shallow(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		).html()

		// Expect no error message box
		expect(el.textContent.indexOf('There was a problem')).toBe(-1)

		// Expect positive sync notification
		expect(el.textContent.indexOf('not sent to')).toBe(-1)
	})

	test('renders error for error gradebook statuses', () => {
		let resendScore = jest.fn()
		let ltiState = {
			state: {
				gradebookStatus: 'error_newer_assessment_score_unsent'
			},
			networkState: 'idle',
			errorCount: 0
		}
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		let el = document.createElement('div')
		el.innerHTML = shallow(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		).html()

		// Expect sync error box
		expect(el.textContent.indexOf('There was a problem')).not.toBe(-1)

		// Expect sync error notification
		// Note - Only works once issue 135 is synced to dev
		// expect(el.textContent.indexOf('not sent to')).not.toBe(-1)
	})

	test('error shows additional information if error count is above 0', () => {
		let resendScore = jest.fn()
		let ltiState = {
			state: {
				gradebookStatus: 'error'
			},
			networkState: 'idle',
			errorCount: 1
		}
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		let el = document.createElement('div')
		el.innerHTML = shallow(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		).html()

		// Expect extended sync error box
		expect(el.textContent.indexOf('There was a problem')).not.toBe(-1)
		expect(el.textContent.indexOf('Try again anyway')).not.toBe(-1)

		// Expect sync error notification
		// Note - Only works once issue 135 is synced to dev
		// expect(el.textContent.indexOf('not sent to')).not.toBe(-1)
	})

	test('error shows a loading state when loading', () => {
		let resendScore = jest.fn()
		let ltiState = {
			state: {
				gradebookStatus: 'error_state_unknown'
			},
			networkState: 'awaitingSendAssessmentScoreResponse',
			errorCount: 0
		}
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		let el = document.createElement('div')
		el.innerHTML = shallow(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		).html()

		// Expect extended sync error box with diabled button
		expect(el.textContent.indexOf('There was a problem')).not.toBe(-1)
		expect(el.textContent.indexOf('Resending Score...')).not.toBe(-1)
	})

	test('clicking on the resend score button calls AssessmentUtil.resendLTIScore', () => {
		let resendScore = AssessmentUtil.resendLTIScore
		let ltiState = {
			state: {
				gradebookStatus: 'error_state_unknown'
			},
			networkState: 'idle',
			errorCount: 1
		}
		const component = mount(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			>
				<h1 className="lti-score"> Dummy Score </h1>
			</LTIStatus>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(AssessmentUtil.resendLTIScore).toHaveBeenCalled()
		expect(resendScore).toHaveBeenCalled()
	})
})
