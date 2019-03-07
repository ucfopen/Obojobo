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
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import MCAssessmentAnswerChoices from './mc-assessment-answer-choices'
import Common from 'Common'

const { focus } = Common.page
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

	test('focusOnResults renders', () => {
		const component = renderer.create(<MCAssessmentAnswerChoices {...defaultProps} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('focusOnResults calls focus with resultsRef', () => {
		const component = mount(<MCAssessmentAnswerChoices {...defaultProps} />)
		component.instance().focusOnResults()
		expect(focus).toHaveBeenCalledWith(component.instance().resultsRef.current)
	})
})
