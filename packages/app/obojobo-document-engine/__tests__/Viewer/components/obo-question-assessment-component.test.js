import React from 'react'
import renderer from 'react-test-renderer'
import OboQuestionAssessmentComponent from '../../../src/scripts/viewer/components/obo-question-assessment-component'

describe('OboQuestionAssessmentComponent', () => {
	test('static getRevealAnswerDefault returns never', () => {
		expect(OboQuestionAssessmentComponent.getRevealAnswerDefault()).toBe('never')
	})

	test('getRevealAnswerDefault returns never, calls static method', () => {
		const spy = jest.spyOn(OboQuestionAssessmentComponent, 'getRevealAnswerDefault')
		const questionModel = jest.fn()
		const model = jest.fn()

		const component = renderer.create(
			<OboQuestionAssessmentComponent questionModel={questionModel} model={model} />
		)

		expect(component.getInstance().getRevealAnswerDefault()).toBe('never')
		expect(spy).toHaveBeenCalledWith(questionModel, model)

		spy.mockRestore()
	})

	test('static getDetails returns null', () => {
		expect(OboQuestionAssessmentComponent.getDetails()).toBe(null)
	})

	test('getDetails returns null, calls static method', () => {
		const spy = jest.spyOn(OboQuestionAssessmentComponent, 'getDetails')
		const questionModel = jest.fn()
		const model = jest.fn()

		const component = renderer.create(
			<OboQuestionAssessmentComponent questionModel={questionModel} model={model} />
		)

		expect(component.getInstance().getDetails('mock-score')).toBe(null)
		expect(spy).toHaveBeenCalledWith(questionModel, model, 'mock-score')

		spy.mockRestore()
	})

	test('static getInstructions returns null', () => {
		expect(OboQuestionAssessmentComponent.getInstructions()).toBe(null)
	})

	test('getInstructions returns null, calls static method', () => {
		const spy = jest.spyOn(OboQuestionAssessmentComponent, 'getInstructions')
		const questionModel = jest.fn()
		const model = jest.fn()

		const component = renderer.create(
			<OboQuestionAssessmentComponent questionModel={questionModel} model={model} />
		)

		expect(component.getInstance().getInstructions()).toBe(null)
		expect(spy).toHaveBeenCalledWith(questionModel, model)

		spy.mockRestore()
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
