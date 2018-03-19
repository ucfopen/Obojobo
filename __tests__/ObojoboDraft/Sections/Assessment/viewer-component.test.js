import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import {
	moduleData,
	initModuleData,
	AssessmentStore,
	NavStore,
	QuestionStore,
	ModalStore,
	FocusStore
} from '../../../../__mocks__/viewer-state.mock'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import {
	getAttemptStartServerResponse,
	getAttemptEndServerResponse
} from '../../../../__mocks__/assessment-server.mock'
import Assessment from '../../../../ObojoboDraft/Sections/Assessment/viewer-component'
import Dispatcher from '../../../../src/scripts/common/flux/dispatcher'
import Common from '../../../../src/scripts/common'
import APIUtil from '../../../../src/scripts/viewer/util/api-util'
import AssessmentUtil from '../../../../src/scripts/viewer/util/assessment-util'

APIUtil.startAttempt = () => {
	return Promise.resolve(getAttemptStartServerResponse())
}
APIUtil.post = jest.fn()

describe('Assessment', () => {
	_.shuffle = a => a

	let model = OboModel.create({
		id: 'assessment',
		type: 'ObojoboDraft.Sections.Assessment',
		content: {
			attempts: 3
		},
		children: [
			{
				id: 'page',
				type: 'ObojoboDraft.Pages.Page',
				children: [
					{
						id: 'child',
						type: 'ObojoboDraft.Chunks.Text',
						content: {
							textGroup: [
								{
									text: {
										value:
											'You have {{assessment:attemptsRemaining}} attempts remaining out of {{assessment:attemptsAmount}}.'
									}
								}
							]
						}
					}
				]
			},
			{
				id: 'QuestionBank',
				type: 'ObojoboDraft.Chunks.QuestionBank'
			}
		]
	})

	beforeEach(() => {
		initModuleData()
	})

	test('Assessment component', () => {
		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Assessment variable replacement', () => {
		// No replacement:
		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		// Replacement with 3 attempts:
		Dispatcher.on('getTextForVariable', (event, variable, textModel) => {
			event.text = Common.Store.getTextForVariable(variable, textModel, moduleData)
		})
		const component2 = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()
		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<Assessment model={model} moduleData={moduleData} />).html()
		expect(el2.textContent).toBe('You have 3 attempts remaining out of 3.')

		// Replacement with no attempt limit:
		OboModel.models.assessment.modelState.attempts = Infinity
		const component3 = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree3 = component3.toJSON()
		expect(tree3).toMatchSnapshot()

		expect(tree).not.toEqual(tree3)
		expect(tree).not.toEqual(tree2)

		let el3 = document.createElement('div')
		el3.innerHTML = shallow(<Assessment model={model} moduleData={moduleData} />).html()
		expect(el3.textContent).toBe('You have unlimited attempts remaining out of unlimited.')
	})

	test.skip('Assessment page changes when attempt started and submitted', () => {
		// New assessment:
		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
		let el = document.createElement('div')
		el.innerHTML = shallow(<Assessment model={model} moduleData={moduleData} />).html()
		expect(el.textContent.indexOf('%')).toBe(-1)

		// Start attempt:
		AssessmentStore.startAttempt(getAttemptStartServerResponse().value)

		const component2 = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()
		expect(tree2).toMatchSnapshot()
		expect(tree).not.toEqual(tree2)
		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<Assessment model={model} moduleData={moduleData} />).html()

		expect(el.innerHTML).not.toEqual(el2.innerHTML)
		expect(el2.textContent.indexOf('%')).toBe(-1)

		// End attempt (0%):
		AssessmentStore.endAttempt(getAttemptEndServerResponse(0, 0).value)

		const component3 = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree3 = component3.toJSON()
		expect(tree3).toMatchSnapshot()
		expect(tree).not.toEqual(tree3)
		expect(tree2).not.toEqual(tree3)
		let el3 = document.createElement('div')
		el3.innerHTML = shallow(<Assessment model={model} moduleData={moduleData} />).html()

		expect(el.innerHTML).not.toEqual(el3.innerHTML)
		expect(el2.innerHTML).not.toEqual(el3.innerHTML)

		expect(el3.textContent.indexOf(' 0%')).not.toBe(-1)
		expect(el3.textContent.indexOf(' 100%')).toBe(-1)
		expect(el3.textContent.indexOf('This is your recorded score')).not.toBe(-1)

		// Another attempt (100%):
		AssessmentStore.startAttempt(getAttemptStartServerResponse().value)
		AssessmentStore.endAttempt(getAttemptEndServerResponse(100, 100).value)

		const component4 = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree4 = component4.toJSON()
		expect(tree4).toMatchSnapshot()
		expect(tree).not.toEqual(tree4)
		expect(tree2).not.toEqual(tree4)
		expect(tree3).not.toEqual(tree4)
		let el4 = document.createElement('div')
		el4.innerHTML = shallow(<Assessment model={model} moduleData={moduleData} />).html()

		expect(el.innerHTML).not.toEqual(el4.innerHTML)
		expect(el2.innerHTML).not.toEqual(el4.innerHTML)
		expect(el3.innerHTML).not.toEqual(el4.innerHTML)

		expect(el4.textContent.indexOf(' 0%')).toBe(-1)
		expect(el4.textContent.indexOf(' 100%')).not.toBe(-1)
		expect(el4.textContent.indexOf('This is your recorded score')).not.toBe(-1)

		// Last attempt (0%):
		AssessmentStore.startAttempt(getAttemptStartServerResponse().value)
		AssessmentStore.endAttempt(getAttemptEndServerResponse(0, 100).value)

		const component5 = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree5 = component5.toJSON()
		expect(tree5).toMatchSnapshot()
		expect(tree).not.toEqual(tree5)
		expect(tree2).not.toEqual(tree5)
		expect(tree3).not.toEqual(tree5)
		expect(tree4).not.toEqual(tree5)
		let el5 = document.createElement('div')
		el5.innerHTML = shallow(<Assessment model={model} moduleData={moduleData} />).html()

		expect(el.innerHTML).not.toEqual(el5.innerHTML)
		expect(el2.innerHTML).not.toEqual(el5.innerHTML)
		expect(el3.innerHTML).not.toEqual(el5.innerHTML)
		expect(el4.innerHTML).not.toEqual(el5.innerHTML)

		expect(el5.textContent.indexOf(' 0%')).not.toBe(-1)
		expect(el5.textContent.indexOf(' 100%')).not.toBe(-1)
		expect(el5.textContent.indexOf('This is your highest score')).toBe(-1)
	})
})
