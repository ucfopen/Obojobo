import React from 'react'
import renderer from 'react-test-renderer'
import OboQuestionComponent from '../../../src/scripts/viewer/components/obo-question-component'

describe('OboQuestionComponent', () => {
	test('Renders as expected', () => {
		const componentContents = <OboQuestionComponent />
		const component = renderer.create(componentContents)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Static method returns null', () => {
		expect(OboQuestionComponent.getQuestionAssessmentModel()).toBe(null)
	})
})
