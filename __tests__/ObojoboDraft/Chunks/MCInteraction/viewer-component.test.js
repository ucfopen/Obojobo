import React from 'react'
import renderer from 'react-test-renderer'

import MCInteraction from '../../../../ObojoboDraft/Chunks/MCInteraction/viewer-component'
import FocusStore from '../../../../src/scripts/common/stores/focus-store'
import QuestionStore from '../../../../src/scripts/viewer/stores/question-store'
import NavStore from '../../../../src/scripts/viewer/stores/nav-store'
import ScoreStore from '../../../../src/scripts/viewer/stores/score-store'
import AssessmentStore from '../../../../src/scripts/viewer/stores/assessment-store'
import QuestionUtil from '../../../../src/scripts/viewer/util/question-util'
import ScoreUtil from '../../../../src/scripts/viewer/util/score-util'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import APIUtil from '../../../../src/scripts/viewer/util/api-util'

describe('MCInteraction', () => {
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
				type: 'ObojoboDraft.Chunks.MCInteraction',
				children: [
					{
						id: 'choice1',
						type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
						content: {
							score: 100
						},
						children: [
							{
								id: 'choice1-answer',
								type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
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
								type: 'ObojoboDraft.Chunks.MCInteraction.MCFeedback',
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
						type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
						content: {
							score: 0
						},
						children: [
							{
								id: 'choice2-answer',
								type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
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
								type: 'ObojoboDraft.Chunks.MCInteraction.MCFeedback',
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

	test('MCInteraction component', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<MCInteraction model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCInteraction with response', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<MCInteraction model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		APIUtil.postEvent = jest.fn()
		QuestionUtil.setResponse('parent', { ids: ['choice1'] })
		const component2 = renderer.create(<MCInteraction model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('MCInteraction with revealAll', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<MCInteraction model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		QuestionUtil.setData('id', 'revealAll', true)
		const component2 = renderer.create(<MCInteraction model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('MCInteraction with a set score', () => {
		let moduleData = getModuleData()
		const component = renderer.create(<MCInteraction model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		ScoreUtil.setScore('id', 100)
		const component2 = renderer.create(<MCInteraction model={model} moduleData={moduleData} />)
		let tree2 = component2.toJSON()

		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})
})
