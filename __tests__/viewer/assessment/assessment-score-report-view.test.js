import React from 'react'
import renderer from 'react-test-renderer'

import ReportView from '../../../src/scripts/viewer/assessment/assessment-score-report-view'

const TYPE_TEXT = 'text'
const TYPE_DIV = 'divider'
const TYPE_EXTRA_CRED = 'extra-credit'
const TYPE_PENALTY = 'penalty'
const TYPE_VAL = 'value'
const TYPE_TOTAL = 'total'
const VAL_DID_NOT_PASS = 'Did Not Pass'

describe('AssessmentScoreReportView', () => {
	test('AssessmentScoreReportView component', () => {
		let report = {
			textItems: [],
			scoreChangeDescription: null
		}

		let component = renderer.create(<ReportView report={report} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('AssessmentScoreReportView component with scoreChangeDescription', () => {
		let report = {
			textItems: [],
			scoreChangeDescription: 'mockDescription'
		}

		let component = renderer.create(<ReportView report={report} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('AssessmentScoreReportView component with textItems', () => {
		let report = {
			textItems: [
				{
					type: TYPE_TEXT,
					text: 'mockText'
				},
				{
					type: TYPE_DIV
				},
				{
					type: TYPE_EXTRA_CRED,
					value: '5'
				},
				{
					type: TYPE_PENALTY,
					value: '5'
				},
				{
					type: TYPE_VAL,
					value: '100'
				},
				{
					type: TYPE_TOTAL,
					value: '100'
				}
			],
			scoreChangeDescription: 'mockDescription'
		}

		let component = renderer.create(<ReportView report={report} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('AssessmentScoreReportView component did not pass', () => {
		let report = {
			textItems: [
				{
					type: TYPE_VAL,
					value: VAL_DID_NOT_PASS
				}
			],
			scoreChangeDescription: 'mockDescription'
		}

		let component = renderer.create(<ReportView report={report} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
