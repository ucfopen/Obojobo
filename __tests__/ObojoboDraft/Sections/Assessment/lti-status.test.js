import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

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
import LTIStatus from '../../../../ObojoboDraft/Sections/Assessment/lti-status'

describe('lti-status', () => {
	beforeEach(() => {
		initModuleData()
	})

	test('renders nothing for ok_no_outcome_service or ok_null_score_not_sent gradebook statuses', () => {
		let resendScore = jest.fn()
		let ltiState = {
			state: {
				gradebookStatus: "ok_no_outcome_service"
			},
			networkState: "idle",
			errorCount: 0
		}
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			/>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		let el = document.createElement('div')
		el.innerHTML = shallow(<LTIStatus
			ltiState={ltiState}
			externalSystemLabel={'mocklti'}
			onClickResendScore={resendScore}
		/>).html()

		// Expect no error message box
		expect(el.textContent.indexOf('There was a problem')).toBe(-1)

		// Expect no sync error notification
		// Note - Only works once issue 135 is synced to dev
		// expect(el.textContent.indexOf('not sent to')).toBe(-1)
	})

	test.skip('renders a synced message for ok_gradebook_matches_assessment_score', () => {
		let resendScore = jest.fn()
		let ltiState = {
			state: {
				gradebookStatus: "ok_no_outcome_service"
			},
			networkState: "idle",
			errorCount: 0
		}
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			/>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('renders error for error gradebook statuses', () => {
		let resendScore = jest.fn()
		let ltiState = {
			state: {
				gradebookStatus: "error_newer_assessment_score_unsent"
			},
			networkState: "idle",
			errorCount: 0
		}
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={'mocklti'}
				onClickResendScore={resendScore}
			/>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		let el = document.createElement('div')
		el.innerHTML = shallow(<LTIStatus
			ltiState={ltiState}
			externalSystemLabel={'mocklti'}
			onClickResendScore={resendScore}
		/>).html()

		// Expect sync error box
		expect(el.textContent.indexOf('There was a problem')).not.toBe(-1)

		// Expect sync error notification
		// Note - Only works once issue 135 is synced to dev
		// expect(el.textContent).toBe('not sent to')
	})

	test.skip('error shows additional information if error count is above 0', () => {
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={externalSystemLabel}
				onClickResendScore={this.onClickResendScore.bind(this)}
			/>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

	})

	test.skip('error shows a loading state when loading', () => {
		const component = renderer.create(
			<LTIStatus
				ltiState={ltiState}
				externalSystemLabel={externalSystemLabel}
				onClickResendScore={this.onClickResendScore.bind(this)}
			/>
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

	})
})
