import MCAssessmentExplanation from './mc-assessment-explanation'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import React from 'react'
import { mount } from 'enzyme'

require('./viewer') // used to register this oboModel
require('./MCChoice/viewer') // // dependency on Obojobo.Chunks.MCAssessment
require('./MCAnswer/viewer') // // dependency on Obojobo.Chunks.MCAssessment.MCAnswer
require('./MCFeedback/viewer') // // dependency on Obojobo.Chunks.MCAssessment.MCFeedback
require('obojobo-chunks-question/viewer') // dependency on Obojobo.Chunks.Question
require('obojobo-pages-page/viewer') // dependency on Obojobo.Pages.Page
require('obojobo-chunks-text/viewer') // // dependency on Obojobo.Chunks.Text

const questionJSON = {
	id: 'parent',
	type: 'ObojoboDraft.Chunks.Question',
	content: {
		title: 'Title',
		solution: {
			id: 'page-id',
			type: 'ObojoboDraft.Pages.Page',
			content: {
				readExplanationLabel: "Read Explanation Label",
				hideExplanationLabel: "Hide Explanation Label"
			},
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
													value: 'Example Text Choice 1'
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
													value: 'Example Text Feedback 1'
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
									id: 'choice2-answer-text',
									type: 'ObojoboDraft.Chunks.Text',
									content: {
										textGroup: [
											{
												text: {
													value: 'Example Text Choice 2'
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
									id: 'choice2-feedback-text',
									type: 'ObojoboDraft.Chunks.Text',
									content: {
										textGroup: [
											{
												text: {
													value: 'Example Text Feedback 2'
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
}

describe('MCAssessment', () => {
	beforeAll(() => {})
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('css transition animation lifecycle events are called with props', () => {
		jest.useFakeTimers()

		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}

		let animationOnEnteredCalled = false
		let animationOnExitCalled = false
		let animationOnExitingCalled = false

		const onClickShowExplanation = jest.fn()
		const onClickHideExplanation = jest.fn()

		const animationOnEntered = jest.fn(() => (animationOnEnteredCalled = true))
		const animationOnExit = jest.fn(() => (animationOnExitCalled = true))
		const animationOnExiting = jest.fn(() => (animationOnExitingCalled = true))

		const isShowingExplanationValue = false

		const component = mount(
			<MCAssessmentExplanation
				model={model}
				moduleData={moduleData}
				mode="assessment"
				isShowingExplanation={isShowingExplanationValue}
				solutionModel={model.parent.modelState.solution}
				animationTransitionTime={0}
				animationOnEntered={animationOnEntered}
				animationOnExit={animationOnExit}
				animationOnExiting={animationOnExiting}
				onClickShowExplanation={onClickShowExplanation}
				onClickHideExplanation={onClickHideExplanation}
			/>
		)

		component.setProps({ isShowingExplanation: true })
		component.setProps({ isShowingExplanation: false })
		component.setProps({ isShowingExplanation: true })

		jest.runAllTimers()
		expect(animationOnEnteredCalled).toBe(true)
		expect(animationOnExitCalled).toBe(true)
		expect(animationOnExitingCalled).toBe(true)
	})

	test('Show explanation text', () => {
		jest.useFakeTimers()

		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}

		const onClickShowExplanation = jest.fn()
		const onClickHideExplanation = jest.fn()

		const readExplanationLabel = 'mockReadExplanationLabel'
		const hideExplanationLabel = 'mockHideExplanationLabel'

		const animationOnEntered = jest.fn(() => (animationOnEnteredCalled = true))
		const animationOnExit = jest.fn(() => (animationOnExitCalled = true))
		const animationOnExiting = jest.fn(() => (animationOnExitingCalled = true))

		const isShowingExplanationValue = false

		const component = mount(
			<MCAssessmentExplanation
				model={model}
				moduleData={moduleData}
				mode="assessment"
				isShowingExplanation={isShowingExplanationValue}
				solutionModel={model.parent.modelState.solution}
				animationTransitionTime={0}
				animationOnEntered={animationOnEntered}
				animationOnExit={animationOnExit}
				animationOnExiting={animationOnExiting}
				onClickShowExplanation={onClickShowExplanation}
				onClickHideExplanation={onClickHideExplanation}
			/>
		)

		const object = component.instance()
		object.readExplanationLabel = readExplanationLabel
		object.hideExplanationLabel = hideExplanationLabel

		expect(readExplanationLabel).toContain(object.readExplanationLabel)
		expect(hideExplanationLabel).toContain(object.hideExplanationLabel)
	})
})
