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

// Create one permutation of a Question component.
// Options are:
// type = 'default' or 'survey'
// mode = 'practice', 'assessment' or 'review'
// score = 100, 0, 'no-score' (survey question) or null (not answered)
// showContentOnly = true or false
const createComponent = (type, mode, score, showContentOnly) => {
	let context
	switch (mode) {
		case 'practice':
			context = 'practice'
			break

		case 'assessment':
			context = 'assessment'
			break

		case 'review':
			context = 'assessmentReview:mockAttemptId'
			break
	}

	const moduleData = {
		questionState: 'mockQuestionState',
		navState: {
			context
		},
		focusState: 'mockFocus'
	}

	questionJSON.content.type = type

	const model = OboModel.create(questionJSON)

	// Question answered correctly
	QuestionUtil.getScoreForModel.mockReturnValueOnce(score)
	QuestionUtil.getViewState.mockReturnValueOnce('mockViewState')

	return renderer.create(
		<Question model={model} moduleData={moduleData} showContentOnly={showContentOnly} />
	)
}

describe('Question', () => {
	beforeAll(() => {
		_.shuffle = a => a
	})

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Question in practice not answered', () => {
		expect(createComponent('default', 'practice', null, false).toJSON()).toMatchSnapshot()
	})

	test('Question in practice answered incorrectly', () => {
		expect(createComponent('default', 'practice', 0, false).toJSON()).toMatchSnapshot()
	})

	test('Question in practice answered correctly', () => {
		expect(createComponent('default', 'practice', 100, false).toJSON()).toMatchSnapshot()
	})

	test('Survey question in practice not answered', () => {
		expect(createComponent('survey', 'practice', null, false).toJSON()).toMatchSnapshot()
	})

	test('Survey question in practice answered', () => {
		expect(createComponent('survey', 'practice', 'no-score', false).toJSON()).toMatchSnapshot()
	})

	test('Question in practice not answered (content only)', () => {
		expect(createComponent('default', 'practice', null, true).toJSON()).toMatchSnapshot()
	})

	test('Question in practice answered incorrectly (content only)', () => {
		expect(createComponent('default', 'practice', 0, true).toJSON()).toMatchSnapshot()
	})

	test('Question in practice answered correctly (content only)', () => {
		expect(createComponent('default', 'practice', 100, true).toJSON()).toMatchSnapshot()
	})

	test('Survey question in practice not answered (content only)', () => {
		expect(createComponent('survey', 'practice', null, true).toJSON()).toMatchSnapshot()
	})

	test('Survey question in practice answered (content only)', () => {
		expect(createComponent('survey', 'practice', 'no-score', true).toJSON()).toMatchSnapshot()
	})

	test('Question in assessment not answered', () => {
		expect(createComponent('default', 'assessment', null, false).toJSON()).toMatchSnapshot()
	})

	test('Question in assessment answered incorrectly', () => {
		expect(createComponent('default', 'assessment', 0, false).toJSON()).toMatchSnapshot()
	})

	test('Question in assessment answered correctly', () => {
		expect(createComponent('default', 'assessment', 100, false).toJSON()).toMatchSnapshot()
	})

	test('Survey question in assessment not answered', () => {
		expect(createComponent('survey', 'assessment', null, false).toJSON()).toMatchSnapshot()
	})

	test('Survey question in assessment answered', () => {
		expect(createComponent('survey', 'assessment', 'no-score', false).toJSON()).toMatchSnapshot()
	})

	test('Question in assessment not answered (content only)', () => {
		expect(createComponent('default', 'assessment', null, true).toJSON()).toMatchSnapshot()
	})

	test('Question in assessment answered incorrectly (content only)', () => {
		expect(createComponent('default', 'assessment', 0, true).toJSON()).toMatchSnapshot()
	})

	test('Question in assessment answered correctly (content only)', () => {
		expect(createComponent('default', 'assessment', 100, true).toJSON()).toMatchSnapshot()
	})

	test('Survey question in assessment not answered (content only)', () => {
		expect(createComponent('survey', 'assessment', null, true).toJSON()).toMatchSnapshot()
	})

	test('Survey question in assessment answered (content only)', () => {
		expect(createComponent('survey', 'assessment', 'no-score', true).toJSON()).toMatchSnapshot()
	})

	test('Question in review not answered', () => {
		expect(createComponent('default', 'review', null, false).toJSON()).toMatchSnapshot()
	})

	test('Question in review answered incorrectly', () => {
		expect(createComponent('default', 'review', 0, false).toJSON()).toMatchSnapshot()
	})

	test('Question in review answered correctly', () => {
		expect(createComponent('default', 'review', 100, false).toJSON()).toMatchSnapshot()
	})

	test('Survey question in review not answered', () => {
		expect(createComponent('survey', 'review', null, false).toJSON()).toMatchSnapshot()
	})

	test('Survey question in review answered', () => {
		expect(createComponent('survey', 'review', 'no-score', false).toJSON()).toMatchSnapshot()
	})

	test('Question in review not answered (content only)', () => {
		expect(createComponent('default', 'review', null, true).toJSON()).toMatchSnapshot()
	})

	test('Question in review answered incorrectly (content only)', () => {
		expect(createComponent('default', 'review', 0, true).toJSON()).toMatchSnapshot()
	})

	test('Question in review answered correctly (content only)', () => {
		expect(createComponent('default', 'review', 100, true).toJSON()).toMatchSnapshot()
	})

	test('Survey question in review not answered (content only)', () => {
		expect(createComponent('survey', 'review', null, true).toJSON()).toMatchSnapshot()
	})

	test('Survey question in review answered (content only)', () => {
		expect(createComponent('survey', 'review', 'no-score', true).toJSON()).toMatchSnapshot()
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
			<Question model={model} moduleData={moduleData} showContentOnly={true} mode={'review'} />
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

	test('focusOnContent does nothing if no DOM element exists', () => {
		const didFocus = Question.focusOnContent({
			getDomEl: () => null
		})

		expect(didFocus).toBe(false)
		expect(focus).not.toHaveBeenCalled()
	})
})
