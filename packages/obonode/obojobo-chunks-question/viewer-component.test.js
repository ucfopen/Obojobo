import Question from './viewer-component'
import React from 'react'
import _ from 'underscore'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import focus from 'obojobo-document-engine/src/scripts/common/page/focus'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/question-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/focus-util')
jest.mock('obojobo-document-engine/src/scripts/common/page/focus')

require('./viewer') // used to register this oboModel
require('obojobo-pages-page/viewer') // dependency on Obojobo.Pages.Page
require('obojobo-chunks-text/viewer') // // dependency on Obojobo.Chunks.Text
require('obojobo-chunks-multiple-choice-assessment/viewer') // // dependency on Obojobo.Chunks.Text

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

describe('Question', () => {
	beforeAll(() => {
		_.shuffle = a => a
	})

	beforeEach(() => {
		jest.resetAllMocks()
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

		component.instance().applyFlipCSS = jest.fn()

		const value = component.instance().onClickBlocker()

		expect(QuestionUtil.viewQuestion).toHaveBeenCalled()
		expect(component.instance().applyFlipCSS).toHaveBeenCalled()
		expect(value).toEqual(undefined) //eslint-disable-line
	})

	test('onClickBlocker calls FocusUtil.focusComponent in practice mode', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const component = shallow(
			<Question model={model} moduleData={moduleData} showContentOnly={true} />
		)

		component.instance().applyFlipCSS = jest.fn()

		component.instance().onClickBlocker()

		expect(QuestionUtil.viewQuestion).toHaveBeenCalled()
		expect(FocusUtil.focusComponent).toHaveBeenCalled()
		expect(component.instance().applyFlipCSS).toHaveBeenCalled()
	})

	test('applyFlipCSS temporarily sets state.isFlipping to true', () => {
		jest.useFakeTimers()
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const component = shallow(
			<Question model={model} moduleData={moduleData} showContentOnly={true} />
		)

		expect(component.state()).toEqual({ isFlipping: false })
		component.instance().applyFlipCSS()
		expect(component.state()).toEqual({ isFlipping: true })
		jest.runAllTimers()
		expect(component.state()).toEqual({ isFlipping: false })
	})

	test('focusOnContent focuses on the first child component (when question is being shown)', () => {
		const mockFirstChildEl = jest.fn()

		const didFocus = Question.focusOnContent({
			getDomEl: () => ({
				classList: {
					contains: () => false
				}
			}),
			children: {
				at: () => ({
					getDomEl: () => mockFirstChildEl
				})
			}
		})

		expect(didFocus).toBe(true)
		expect(focus).toHaveBeenCalledTimes(1)
		expect(focus).toHaveBeenCalledWith(mockFirstChildEl)
	})

	test('focusOnContent does nothing when question is being shown and the first child component element can not be found', () => {
		const didFocus = Question.focusOnContent({
			getDomEl: () => ({
				classList: {
					contains: () => false
				}
			}),
			children: {
				at: () => ({
					getDomEl: () => null
				})
			}
		})

		expect(didFocus).toBe(false)
		expect(focus).toHaveBeenCalledTimes(0)
	})

	test('focusOnContent does nothing when question is being shown but has no child components', () => {
		const didFocus = Question.focusOnContent({
			getDomEl: () => ({
				classList: {
					contains: () => false
				}
			}),
			children: {
				at: () => null
			}
		})

		expect(didFocus).toBe(false)
		expect(focus).toHaveBeenCalledTimes(0)
	})

	test('focusOnContent focuses on the button (when question is still un-opened)', () => {
		const mockButtonEl = jest.fn()

		const didFocus = Question.focusOnContent({
			getDomEl: () => ({
				classList: {
					contains: () => true
				},
				querySelector: () => mockButtonEl
			})
		})

		expect(didFocus).toBe(true)
		expect(focus).toHaveBeenCalledTimes(1)
		expect(focus).toHaveBeenCalledWith(mockButtonEl)
	})
})
