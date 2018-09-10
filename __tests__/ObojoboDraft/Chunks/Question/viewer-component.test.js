import React from 'react'
import _ from 'underscore'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

jest.mock('../../../../src/scripts/viewer/util/question-util')
jest.mock('../../../../src/scripts/common/util/focus-util')

import Question from '../../../../ObojoboDraft/Chunks/Question/viewer-component'
import FocusUtil from '../../../../src/scripts/common/util/focus-util'
import QuestionUtil from '../../../../src/scripts/viewer/util/question-util'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

const MODE_REVIEW = 'review'
const MODE_PRACTICE = 'practice'
const questionJSON = {
	id: 'id',
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
			id: 'mc-assessment-id',
			type: 'ObojoboDraft.Chunks.MCAssessment',
			content: {
				correctLabels: 'test'
			},
			children: [
				{
					id: 'choice1',
					type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
					content: {
						score: 100
					},
					children: [
						{
							id: 'choice1-answer1',
							type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
							children: [
								{
									id: 'choice1-answer-1-text',
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
							id: 'choice1-answer2',
							type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
							children: [
								{
									id: 'choice1-answer-2-text',
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
							id: 'choice2-answer1',
							type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
							children: [
								{
									id: 'choice1-answer-1-text',
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
							id: 'choice2-answer2',
							type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
							children: [
								{
									id: 'choice1-answer-1-text',
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
}

describe('MCAssessment', () => {
	beforeAll(() => {
		_.shuffle = a => a
	})

	test('Question component', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		// Question with no score data
		QuestionUtil.getScoreForModel.mockReturnValueOnce(null)
		QuestionUtil.getViewState.mockReturnValueOnce('mockViewState')

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component answered correctly', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		// Question answered correctly
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)
		QuestionUtil.getViewState.mockReturnValueOnce('mockViewState')

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component answered incorrectly', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		// Question answered incorrectly
		QuestionUtil.getScoreForModel.mockReturnValueOnce(0)
		QuestionUtil.getViewState.mockReturnValueOnce('mockViewState')

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component in review mode', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		// Question with no score data
		QuestionUtil.getScoreForModel.mockReturnValueOnce(null)
		QuestionUtil.getViewState.mockReturnValueOnce('mockViewState')

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} mode={MODE_REVIEW} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component in practice mode', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		// Question with no score data
		QuestionUtil.getScoreForModel.mockReturnValueOnce(null)
		QuestionUtil.getViewState.mockReturnValueOnce('mockViewState')

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} mode={MODE_PRACTICE} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component with content only', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		// Question answered incorrectly
		QuestionUtil.getScoreForModel.mockReturnValueOnce(0)

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} showContentOnly={true} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component with content only in review mode', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		// Question answered incorrectly
		QuestionUtil.getScoreForModel.mockReturnValueOnce(0)

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} showContentOnly={true} mode={MODE_REVIEW} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('onClickBlocker does not return anything when not in practice mode', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const component = shallow(
			<Question model={model} moduleData={moduleData} showContentOnly={true} mode={MODE_REVIEW} />
		)

		const value = component.instance().onClickBlocker()

		expect(QuestionUtil.viewQuestion).toHaveBeenCalled()
		expect(value).toEqual(undefined) //eslint-disable-line
	})

	test('onClickBlocker returns FocusUtil.focusComponent in practice mode', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		FocusUtil.focusComponent.mockReturnValueOnce('mockFocusCall')

		const component = shallow(
			<Question model={model} moduleData={moduleData} showContentOnly={true} />
		)

		const value = component.instance().onClickBlocker()

		expect(QuestionUtil.viewQuestion).toHaveBeenCalled()
		expect(FocusUtil.focusComponent).toHaveBeenCalled()
		expect(value).toEqual('mockFocusCall')
	})
})
