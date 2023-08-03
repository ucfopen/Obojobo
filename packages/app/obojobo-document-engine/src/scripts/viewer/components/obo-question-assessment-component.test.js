import React from 'react'
import renderer from 'react-test-renderer'
import OboQuestionAssessmentComponent from './obo-question-assessment-component'

describe('OboQuestionAssessmentComponent', () => {
	test('static getRevealAnswerDefault returns never', () => {
		expect(OboQuestionAssessmentComponent.prototype.revealAnswerDefault).toBe('never')
	})

	test('getDetails returns null', () => {
		const component = renderer.create(<OboQuestionAssessmentComponent />)

		expect(component.getInstance().getDetails()).toBe(null)
	})

	test('getInstructions returns null', () => {
		const component = renderer.create(<OboQuestionAssessmentComponent />)

		expect(component.getInstance().getInstructions()).toBe(null)
	})

	test('static isResponseEmpty returns true', () => {
		expect(OboQuestionAssessmentComponent.isResponseEmpty()).toBe(true)
	})

	test('calculateScore returns null', () => {
		const component = renderer.create(<OboQuestionAssessmentComponent />)

		expect(component.getInstance().calculateScore()).toBe(null)
	})

	test('checkIfResponseIsValid returns true', () => {
		const component = renderer.create(<OboQuestionAssessmentComponent />)

		expect(component.getInstance().checkIfResponseIsValid()).toBe(true)
	})

	test('handleFormChange returns expected object', () => {
		const component = renderer.create(<OboQuestionAssessmentComponent />)

		expect(component.getInstance().handleFormChange()).toEqual({
			state: null,
			targetId: null,
			sendResponseImmediately: false
		})
	})

	test('render returns null', () => {
		expect(OboQuestionAssessmentComponent.prototype.render()).toBe(null)
	})
})
