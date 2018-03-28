import React from 'react'
import renderer from 'react-test-renderer'

import MCAssessment from '../../../../ObojoboDraft/Chunks/MCAssessment/viewer-component'
import FocusStore from '../../../../src/scripts/common/stores/focus-store'
import QuestionStore from '../../../../src/scripts/viewer/stores/question-store'
import NavStore from '../../../../src/scripts/viewer/stores/nav-store'
import ScoreStore from '../../../../src/scripts/viewer/stores/score-store'
import AssessmentStore from '../../../../src/scripts/viewer/stores/assessment-store'
import QuestionUtil from '../../../../src/scripts/viewer/util/question-util'
import ScoreUtil from '../../../../src/scripts/viewer/util/score-util'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import APIUtil from '../../../../src/scripts/viewer/util/api-util'

describe('MCAssessment', () => {
	_.shuffle = a => a

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
						id: 'choice1',
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

	let model = OboModel.models.id

	let getModuleData = () => {
		QuestionStore.init()
		ScoreStore.init()
		AssessmentStore.init()
		FocusStore.init()
		NavStore.setState({
			itemsById: {}
		})

		return {
			focusState: FocusStore.getState(),
			questionState: QuestionStore.getState(),
			scoreState: ScoreStore.getState(),
			assessmentState: AssessmentStore.getState(),
			navState: NavStore.getState()
		}
	}

	test('MCAssessment component', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment with response', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		APIUtil.postEvent = jest.fn()
		QuestionUtil.setResponse('parent', { ids: ['choice1'] })
		const component2 = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('MCAssessment with revealAll', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		QuestionUtil.setData('id', 'revealAll', true)
		const component2 = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('MCAssessment with a set score', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		ScoreUtil.setScore('id', 100)
		const component2 = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('MCAssessment with shuffle not set', () => {
		_.shuffle = jest.fn()
		let moduleData = getModuleData()
		const component = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		expect(_.shuffle).toBeCalled()
	})

	test('MCAssessment with shuffle set to true', () => {
		_.shuffle = jest.fn()
		let moduleData = getModuleData()
		model.modelState.shuffle = true
		const component = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		expect(_.shuffle).toBeCalled()
	})

	test('MCAssessment with shuffle set to false', () => {
		_.shuffle = jest.fn()
		let moduleData = getModuleData()
		model.modelState.shuffle = false
		const component = renderer.create(<MCAssessment model={model} moduleData={moduleData} />)
		expect(_.shuffle).not.toBeCalled()
	})

	test.skip('Clicking Check Answer on an incorrect answer shows you that you got the answer wrong', () => {
		//@TODO
	})

	test.skip('Clicking Check Answer on a correct answer shows you that you got the answer correct', () => {
		//@TODO
	})
})
