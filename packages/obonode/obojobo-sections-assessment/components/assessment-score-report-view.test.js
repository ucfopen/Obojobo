import React from 'react'
import renderer from 'react-test-renderer'

import ReportView from './assessment-score-report-view'

const TYPE_TEXT = 'text'
const TYPE_DIV = 'divider'
const TYPE_EXTRA_CRED = 'extra-credit'
const TYPE_PENALTY = 'penalty'
const TYPE_VAL = 'updated'
const TYPE_TOTAL = 'total'
const VAL_DID_NOT_PASS = 'Did Not Pass'

describe('AssessmentScoreReportView', () => {
	beforeEach(() => {
		jest.spyOn(Math, 'random').mockReturnValue(0)
	})

	test('AssessmentScoreReportView component', () => {
		const report = {
			textItems: [],
			scoreChangeDescription: null
		}

		const component = renderer.create(<ReportView report={report} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('AssessmentScoreReportView component with scoreChangeDescription', () => {
		const report = {
			textItems: [],
			scoreChangeDescription: 'mockDescription'
		}

		const component = renderer.create(<ReportView report={report} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('AssessmentScoreReportView component with textItems', () => {
		const report = {
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
					updated: '5'
				},
				{
					type: TYPE_PENALTY,
					updated: '5'
				},
				{
					type: TYPE_VAL,
					updated: '100'
				},
				{
					type: TYPE_TOTAL,
					updated: '100'
				}
			],
			scoreChangeDescription: 'mockDescription'
		}

		const component = renderer.create(<ReportView report={report} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('AssessmentScoreReportView component did not pass', () => {
		const report = {
			textItems: [
				{
					type: TYPE_VAL,
					updated: VAL_DID_NOT_PASS
				}
			],
			scoreChangeDescription: 'mockDescription'
		}

		const component = renderer.create(<ReportView report={report} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
