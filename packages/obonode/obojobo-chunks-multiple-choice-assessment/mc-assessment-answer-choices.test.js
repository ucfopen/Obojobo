jest.mock(
	'Common',
	() => ({
		page: {
			focus: jest.fn()
		}
	}),
	{ virtual: true }
)
import React from 'react'
import renderer from 'react-test-renderer'
import MCAssessmentAnswerChoices from './mc-assessment-answer-choices'

let defaultProps

describe('MCAssessment Answer Choices', () => {
	beforeEach(() => {
		defaultProps = {
			responseType: '',
			score: '',
			correctLabel: '',
			incorrectLabel: '',
			pickAllIncorrectMessage: '',
			models: [],
			moduleData: '',
			mode: ''
		}
	})

	test('Renders', () => {
		const component = renderer.create(<MCAssessmentAnswerChoices {...defaultProps} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
