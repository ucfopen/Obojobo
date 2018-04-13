import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import MCChoice from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/viewer-component'
import FocusStore from '../../../../../src/scripts/common/stores/focus-store'
import QuestionStore from '../../../../../src/scripts/viewer/stores/question-store'
import NavStore from '../../../../../src/scripts/viewer/stores/nav-store'
import AssessmentStore from '../../../../../src/scripts/viewer/stores/assessment-store'
import QuestionUtil from '../../../../../src/scripts/viewer/util/question-util'
import OboModel from '../../../../../__mocks__/_obo-model-with-chunks'
import APIUtil from '../../../../../src/scripts/viewer/util/api-util'

jest.mock('../../../../../src/scripts/viewer/util/question-util', () => {
	return {
		getResponse: jest.fn(),
		getScoreForModel: jest.fn()
	}
})

describe('MCChoice viewer-component', () => {
	OboModel.create({
		id: 'parent',
		type: 'ObojoboDraft.Chunks.Question',
		content: {
			title: 'Title',
			solution: {
				id: 'page-id',
				type: 'ObojoboDraft.Pages.Page',
				children: [
					{
						id: 'text-id',
						type: 'ObojoboDraft.Chunks.Text',
						content: {
							textGroup: [
								{
									text: {
										value: 'Example text'
									}
								}
							]
						}
					}
				]
			}
		},
		children: [
			{
				id: 'id',
				type: 'ObojoboDraft.Chunks.MCAssessment',
				children: [
					{
						id: 'testChoice1',
						type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
						content: {
							score: 100
						},
						children: [
							{
								id: 'choice1-answer',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
								children: [
									{
										id: 'choice1-answer-text',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Example Text'
													}
												}
											]
										}
									}
								]
							},
							{
								id: 'choice1-feedback',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
								children: [
									{
										id: 'choice1-feedback-text',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Example Text 2'
													}
												}
											]
										}
									}
								]
							}
						]
					},
					{
						id: 'choice2',
						type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
						content: {
							score: 0
						},
						children: [
							{
								id: 'choice2-answer',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
								children: [
									{
										id: 'choice1-answer-text',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Example Text 3'
													}
												}
											]
										}
									}
								]
							},
							{
								id: 'choice2-feedback',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
								children: [
									{
										id: 'choice1-feedback-text',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Example Text 4'
													}
												}
											]
										}
									}
								]
							}
						]
					}
				]
			}
		]
	})

	let model = OboModel.models.testChoice1

	let getModuleData = () => {
		QuestionStore.init()
		AssessmentStore.init()
		FocusStore.init()
		NavStore.setState({
			itemsById: {}
		})

		return {
			focusState: FocusStore.getState(),
			questionState: QuestionStore.getState(),
			assessmentState: AssessmentStore.getState(),
			navState: NavStore.getState()
		}
	}

	test.skip('pick-one questions render as expected', () => {
		//@TODO
	})

	test.skip('pick-one-multiple-correct questions render as expected', () => {
		//@TODO
	})

	test.skip('pick-all questions render as expected', () => {
		//@TODO
	})

	// Review Tests
	// Elli Not done
	test('getAnsType renders nothing when not reviewing', () => {
		let moduleData = getModuleData()

		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set up this answer to be unselected
		QuestionUtil.getResponse.mockReturnValueOnce({
			'ids':[]})

		// set answer to incorrect
		model.get('content').score = 0

		const component = renderer.create(
			<MCChoice model={model} moduleData={moduleData} mode="test" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice model={model} moduleData={moduleData} mode="test" />).html()
		expect(el2.textContent).toBe('Example Text')
	})

	test('getAnsType renders correct flag when user picks correct answer', () => {
		let moduleData = getModuleData()

		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set up this answer to be selected
		QuestionUtil.getResponse.mockReturnValueOnce({
			'ids':["testChoice1"]})

		// set answer to correct
		model.get('content').score = 100

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice model={model} moduleData={moduleData} mode="review" />).html()
		expect(el2.textContent).toContain('Your Answer (Correct)')
	})
	test('getAnsType renders incorrect flag when user picks incorrect answer', () => {
		let moduleData = getModuleData()

		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set up this answer to be selected
		QuestionUtil.getResponse.mockReturnValueOnce({
			'ids':["testChoice1"]})

		// set answer to incorrect
		model.get('content').score = 0

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice model={model} moduleData={moduleData} mode="review" />).html()
		expect(el2.textContent).toContain('Your Answer (Incorrect)')
	})
	test('getAnsType renders alt flag when user picks other correct answer', () => {
		// Set up this answer to be unselected
		QuestionUtil.getResponse.mockReturnValueOnce({
			'ids':[]})
		let moduleData = getModuleData()

		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set question to be correct
		model.get('content').score = 100

		// Set up that user selected a different correct choice
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice model={model} moduleData={moduleData} mode="review" />).html()
		expect(el2.textContent).toContain('Another Correct Answer')
	})
	test('getAnsType renders correct flag when user picks other incorrect answer', () => {
		// Set up this answer to be unselected
		QuestionUtil.getResponse.mockReturnValueOnce({
			'ids':[]})
		let moduleData = getModuleData()

		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set question to be correct
		model.get('content').score = 100

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice model={model} moduleData={moduleData} mode="review" />).html()
		expect(el2.textContent).toContain('Correct Answer')
	})
})
