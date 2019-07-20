import Question from './viewer-component'
import React from 'react'
import _ from 'underscore'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import focus from 'obojobo-document-engine/src/scripts/common/page/focus'

const { getScoreClass } = require.requireActual(
	'obojobo-document-engine/src/scripts/viewer/util/question-util'
).default

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
				correctLabels: 'mock-correct-labels'
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
	QuestionUtil.getScoreForModel.mockReturnValue(score)
	QuestionUtil.isAnswered.mockReturnValue(score !== null)
	QuestionUtil.getViewState.mockReturnValue('mockViewState')

	return renderer.create(
		<Question model={model} moduleData={moduleData} showContentOnly={showContentOnly} />
	)
}

const expectClasses = (className, type, mode, answered, correct) => {
	// All possible classes that we care about:
	const types = ['is-type-default', 'is-type-survey']
	const modes = ['is-mode-practice', 'is-mode-assessment', 'is-mode-review']
	const answereds = ['is-answered', 'is-not-answered']
	const corrects = ['is-not-correct', 'is-correct', 'is-not-scored', 'is-no-score']

	// Remove the classes we are targeting for
	types.splice(types.indexOf(type), 1)
	modes.splice(modes.indexOf(mode), 1)
	answereds.splice(answereds.indexOf(answered), 1)
	corrects.splice(corrects.indexOf(correct), 1)

	// Ensure the classes we *are not* expecting to exist are indeed not there!
	expect(className.includes(types[0])).toBe(false)
	expect(className.includes(modes[0])).toBe(false)
	expect(className.includes(modes[1])).toBe(false)
	expect(className.includes(answereds[0])).toBe(false)
	expect(className.includes(corrects[0])).toBe(false)
	expect(className.includes(corrects[1])).toBe(false)
	expect(className.includes(corrects[2])).toBe(false)

	// Ensure the classes we *are* expecting to exist are there!
	expect(className.includes(type)).toBe(true)
	expect(className.includes(mode)).toBe(true)
	expect(className.includes(answered)).toBe(true)
	expect(className.includes(correct)).toBe(true)
}

describe('Question', () => {
	beforeAll(() => {
		_.shuffle = a => a
		QuestionUtil.getScoreClass = getScoreClass
	})

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Question in practice not answered', () => {
		const JSON = createComponent('default', 'practice', null, false).toJSON()

		// expect(JSON.props.className).toBe(1)
		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-practice',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in practice answered incorrectly', () => {
		const JSON = createComponent('default', 'practice', 0, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-practice',
			'is-answered',
			'is-not-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in practice answered correctly', () => {
		const JSON = createComponent('default', 'practice', 100, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-practice',
			'is-answered',
			'is-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in practice not answered', () => {
		const JSON = createComponent('survey', 'practice', null, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-practice',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in practice answered', () => {
		const JSON = createComponent('survey', 'practice', 'no-score', false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-practice',
			'is-answered',
			'is-no-score'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in practice not answered (content only)', () => {
		const JSON = createComponent('default', 'practice', null, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-practice',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in practice answered incorrectly (content only)', () => {
		const JSON = createComponent('default', 'practice', 0, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-practice',
			'is-answered',
			'is-not-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in practice answered correctly (content only)', () => {
		const JSON = createComponent('default', 'practice', 100, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-practice',
			'is-answered',
			'is-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in practice not answered (content only)', () => {
		const JSON = createComponent('survey', 'practice', null, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-practice',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in practice answered (content only)', () => {
		const JSON = createComponent('survey', 'practice', 'no-score', true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-practice',
			'is-answered',
			'is-no-score'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in assessment not answered', () => {
		const JSON = createComponent('default', 'assessment', null, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-assessment',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in assessment answered incorrectly', () => {
		const JSON = createComponent('default', 'assessment', 0, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-assessment',
			'is-answered',
			'is-not-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in assessment answered correctly', () => {
		const JSON = createComponent('default', 'assessment', 100, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-assessment',
			'is-answered',
			'is-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in assessment not answered', () => {
		const JSON = createComponent('survey', 'assessment', null, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-assessment',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in assessment answered', () => {
		const JSON = createComponent('survey', 'assessment', 'no-score', false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-assessment',
			'is-answered',
			'is-no-score'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in assessment not answered (content only)', () => {
		const JSON = createComponent('default', 'assessment', null, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-assessment',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in assessment answered incorrectly (content only)', () => {
		const JSON = createComponent('default', 'assessment', 0, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-assessment',
			'is-answered',
			'is-not-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in assessment answered correctly (content only)', () => {
		const JSON = createComponent('default', 'assessment', 100, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-assessment',
			'is-answered',
			'is-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in assessment not answered (content only)', () => {
		const JSON = createComponent('survey', 'assessment', null, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-assessment',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in assessment answered (content only)', () => {
		const JSON = createComponent('survey', 'assessment', 'no-score', true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-assessment',
			'is-answered',
			'is-no-score'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in review not answered', () => {
		const JSON = createComponent('default', 'review', null, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-review',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in review answered incorrectly', () => {
		const JSON = createComponent('default', 'review', 0, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-review',
			'is-answered',
			'is-not-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in review answered correctly', () => {
		const JSON = createComponent('default', 'review', 100, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-review',
			'is-answered',
			'is-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in review not answered', () => {
		const JSON = createComponent('survey', 'review', null, false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-review',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in review answered', () => {
		const JSON = createComponent('survey', 'review', 'no-score', false).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-review',
			'is-answered',
			'is-no-score'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in review not answered (content only)', () => {
		const JSON = createComponent('default', 'review', null, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-review',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in review answered incorrectly (content only)', () => {
		const JSON = createComponent('default', 'review', 0, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-review',
			'is-answered',
			'is-not-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Question in review answered correctly (content only)', () => {
		const JSON = createComponent('default', 'review', 100, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-default',
			'is-mode-review',
			'is-answered',
			'is-correct'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in review not answered (content only)', () => {
		const JSON = createComponent('survey', 'review', null, true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-review',
			'is-not-answered',
			'is-not-scored'
		)
		expect(JSON).toMatchSnapshot()
	})

	test('Survey question in review answered (content only)', () => {
		const JSON = createComponent('survey', 'review', 'no-score', true).toJSON()

		expectClasses(
			JSON.props.className,
			'is-type-survey',
			'is-mode-review',
			'is-answered',
			'is-no-score'
		)
		expect(JSON).toMatchSnapshot()
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
