import Question from './viewer-component'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import focus from 'obojobo-document-engine/src/scripts/common/page/focus'

const { getScoreClass } = jest.requireActual(
	'obojobo-document-engine/src/scripts/viewer/util/question-util'
).default

jest.mock('obojobo-document-engine/src/scripts/viewer/util/question-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/focus-util')
jest.mock('obojobo-document-engine/src/scripts/common/page/focus')
jest.mock('obojobo-document-engine/src/scripts/common/util/shuffle', () => a => a)

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
				correctLabels: 'mock-correct-labels',
				partialLabels: 'mock-partial-labels',
				incorrectLabels: 'mock-incorrect-labels'
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
	QuestionUtil.getResponse.mockReturnValue(
		score !== null ? { ids: [score === 100 ? 'choice1' : 'choice2'] } : null
	)
	QuestionUtil.getViewState.mockReturnValue('mockViewState')

	return renderer.create(
		<Question model={model} moduleData={moduleData} showContentOnly={showContentOnly} />
	)
}

const expectClasses = (className, type, mode, answered, correct) => {
	// return
	// All possible classes that we care about:
	const types = ['is-type-default', 'is-type-survey']
	const modes = ['is-mode-practice', 'is-mode-assessment', 'is-mode-review']
	// const answereds = ['is-answered', 'is-not-answered']
	const corrects = ['is-not-correct', 'is-correct', 'is-not-scored', 'is-no-score']

	// Remove the classes we are targeting for
	types.splice(types.indexOf(type), 1)
	modes.splice(modes.indexOf(mode), 1)
	// answereds.splice(answereds.indexOf(answered), 1)
	corrects.splice(corrects.indexOf(correct), 1)

	// Ensure the classes we *are not* expecting to exist are indeed not there!
	expect(className.includes(types[0])).toBe(false)
	expect(className.includes(modes[0])).toBe(false)
	expect(className.includes(modes[1])).toBe(false)
	// expect(className.includes(answereds[0])).toBe(false)
	expect(className.includes(corrects[0])).toBe(false)
	expect(className.includes(corrects[1])).toBe(false)
	expect(className.includes(corrects[2])).toBe(false)

	// Ensure the classes we *are* expecting to exist are there!
	expect(className.includes(type)).toBe(true)
	expect(className.includes(mode)).toBe(true)
	// expect(className.includes(answered)).toBe(true)
	expect(className.includes(correct)).toBe(true)
}

describe('Question', () => {
	beforeAll(() => {
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

	test('onEnterPress refocuses the input component', () => {
		jest.useFakeTimers()
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)
		const spy = jest.spyOn(QuestionUtil, 'setResponse')

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} isReview={true} />
		)

		component.getInstance().assessmentComponentRef = {
			current: {
				inputRef: {
					current: {
						focus: jest.fn()
					}
				}
			}
		}
		component.getInstance().onEnterPress()

		expect(
			component.getInstance().assessmentComponentRef.current.inputRef.current.focus
		).not.toHaveBeenCalled()
		expect(spy).not.toHaveBeenCalled()
		expect(component.getInstance().nextFocus).not.toBeDefined()

		jest.runAllTimers()
		expect(
			component.getInstance().assessmentComponentRef.current.inputRef.current.focus
		).toHaveBeenCalledTimes(1)

		spy.mockRestore()
	})

	test('focusOnContent focuses on the first child component (when question is being shown)', () => {
		const mockFirstChildEl = jest.fn()
		const mockOpts = { preventScroll: true }

		const didFocus = Question.focusOnContent(
			{
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
			},
			mockOpts
		)

		expect(didFocus).toBe(true)
		expect(focus).toHaveBeenCalledTimes(1)
		expect(focus).toHaveBeenCalledWith(mockFirstChildEl, true)
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
		const mockOpts = { preventScroll: true }

		const didFocus = Question.focusOnContent(
			{
				getDomEl: () => ({
					classList: {
						contains: () => true
					},
					querySelector: () => mockButtonEl
				})
			},
			mockOpts
		)

		expect(didFocus).toBe(true)
		expect(focus).toHaveBeenCalledTimes(1)
		expect(focus).toHaveBeenCalledWith(mockButtonEl, true)
	})

	test('focusOnContent does nothing if no DOM element exists', () => {
		const didFocus = Question.focusOnContent({
			getDomEl: () => null
		})

		expect(didFocus).toBe(false)
		expect(focus).not.toHaveBeenCalled()
	})

	test('onFormChange does nothing if in review mode', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)
		const spy = jest.spyOn(QuestionUtil, 'setResponse')

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} isReview={true} />
		)

		component.getInstance().assessmentComponentRef = {
			current: {
				handleFormChange: jest.fn()
			}
		}

		const event = jest.fn()
		component.getInstance().onFormChange(event)

		expect(
			component.getInstance().assessmentComponentRef.current.handleFormChange
		).not.toHaveBeenCalled()
		expect(spy).not.toHaveBeenCalled()
		expect(component.getInstance().nextFocus).not.toBeDefined()

		spy.mockRestore()
	})

	test('onFormChange sets the response, calls assessment components handleFormChange method and updates nextFocus if not in review mode', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext:subContext1:subContext2'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)
		const spy = jest.spyOn(QuestionUtil, 'setResponse')
		const getRespSpy = jest.spyOn(QuestionUtil, 'getResponse').mockReturnValue({ ids: [] })

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} isReview={false} />
		)

		component.getInstance().assessmentComponentRef = {
			current: {
				handleFormChange: jest.fn().mockReturnValue({
					state: 'mock-state',
					targetId: 'mock-target-id',
					sendResponseImmediately: 'mock-immediate'
				})
			}
		}

		const event = jest.fn()
		component.getInstance().onFormChange(event)

		expect(
			component.getInstance().assessmentComponentRef.current.handleFormChange
		).toHaveBeenCalledWith(event, { ids: [] })
		expect(spy).toHaveBeenCalledWith(
			'id',
			'mock-state',
			'mock-target-id',
			'mockContext:subContext1:subContext2',
			'subContext1',
			'subContext2',
			'mock-immediate'
		)
		expect(component.getInstance().nextFocus).toBe('results')

		spy.mockRestore()
		getRespSpy.mockRestore()
	})

	test('onFormSubmit prevents event default, does nothing else if mode is not practice', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext:subContext1:subContext2'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const getModeSpy = jest.spyOn(Question.prototype, 'getMode').mockReturnValue('not-practice')
		const submitRespSpy = jest.spyOn(Question.prototype, 'submitResponse')

		const event = {
			preventDefault: jest.fn(),
			target: { reset: jest.fn(), reportValidity: jest.fn() }
		}
		component.getInstance().onFormSubmit(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(event.target.reset).not.toHaveBeenCalled()
		expect(event.target.reportValidity).not.toHaveBeenCalled()
		expect(submitRespSpy).not.toHaveBeenCalled()

		getModeSpy.mockRestore()
		submitRespSpy.mockRestore()
	})

	test('onFormSubmit prevents event default, submits the response, reports validity and resets the form if mode is practice', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext:subContext1:subContext2'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const getModeSpy = jest.spyOn(Question.prototype, 'getMode').mockReturnValue('practice')
		const submitRespSpy = jest.spyOn(Question.prototype, 'submitResponse')

		const event = {
			preventDefault: jest.fn(),
			target: { reset: jest.fn(), reportValidity: jest.fn() }
		}
		component.getInstance().onFormSubmit(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(event.target.reset).toHaveBeenCalled()
		expect(event.target.reportValidity).toHaveBeenCalled()
		expect(submitRespSpy).toHaveBeenCalled()

		getModeSpy.mockRestore()
		submitRespSpy.mockRestore()
	})

	test('submitResponse calls scoreResponse, QuestionUtil.submitResponse if is a survey question', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)
		model.modelState.type = 'survey'

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const checkAnsSpy = jest.spyOn(QuestionUtil, 'checkAnswer')
		const submitRespSpy = jest.spyOn(QuestionUtil, 'submitResponse')
		const checkIfRespValidSpy = jest
			.spyOn(Question.prototype, 'checkIfResponseIsValid')
			.mockReturnValue(true)

		component.getInstance().submitResponse()

		expect(submitRespSpy).toHaveBeenCalledWith('id', 'mockContext')
		expect(checkAnsSpy).not.toHaveBeenCalled()

		checkAnsSpy.mockRestore()
		submitRespSpy.mockRestore()
		checkIfRespValidSpy.mockRestore()
	})

	test('submitResponse calls scoreResponse, QuestionUtil.checkAnswer if NOT survey question', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)
		model.modelState.type = 'default'

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const checkAnsSpy = jest.spyOn(QuestionUtil, 'checkAnswer')
		const submitRespSpy = jest.spyOn(QuestionUtil, 'submitResponse')
		const checkIfRespValidSpy = jest
			.spyOn(Question.prototype, 'checkIfResponseIsValid')
			.mockReturnValue(true)

		component.getInstance().submitResponse()

		expect(checkAnsSpy).toHaveBeenCalledWith('id', 'mockContext')
		expect(submitRespSpy).not.toHaveBeenCalled()

		checkAnsSpy.mockRestore()
		submitRespSpy.mockRestore()
		checkIfRespValidSpy.mockRestore()
	})

	test('submitResponse does nothing if response is not valid', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)
		model.modelState.type = 'default'

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const checkAnsSpy = jest.spyOn(QuestionUtil, 'checkAnswer')
		const scoreRespSpy = jest.spyOn(Question.prototype, 'scoreResponse')
		const submitRespSpy = jest.spyOn(QuestionUtil, 'submitResponse')
		const checkIfRespValidSpy = jest
			.spyOn(Question.prototype, 'checkIfResponseIsValid')
			.mockReturnValue(false)

		component.getInstance().submitResponse()

		expect(checkAnsSpy).not.toHaveBeenCalledWith('id', 'mockContext')
		expect(submitRespSpy).not.toHaveBeenCalled()
		expect(scoreRespSpy).not.toHaveBeenCalled()

		checkAnsSpy.mockRestore()
		submitRespSpy.mockRestore()
		checkIfRespValidSpy.mockRestore()
		scoreRespSpy.mockRestore()
	})

	test('checkIfResponseIsValid does nothing if the assessment component ref has no element', () => {
		expect(
			Question.prototype.checkIfResponseIsValid.bind({
				assessmentComponentRef: {}
			})()
		).toBe(false)
	})

	test('checkIfResponseIsValid calls assessment component method if it exists', () => {
		const thisValue = {
			assessmentComponentRef: {
				current: {
					checkIfResponseIsValid: jest.fn().mockReturnValue('mock-return-value')
				}
			}
		}
		expect(Question.prototype.checkIfResponseIsValid.bind(thisValue)()).toBe('mock-return-value')
	})

	test('scoreResponse does nothing if in review mode', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)
		model.modelState.type = 'default'

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} isReview={true} />
		)
		const spy = jest.spyOn(QuestionUtil, 'setScore')

		component.getInstance().scoreResponse()

		expect(spy).not.toHaveBeenCalled()

		spy.mockRestore()
	})

	test('scoreResponse calls QuestionUtil.setScore when assessment has no details to return', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)
		model.modelState.type = 'default'

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} isReview={false} />
		)
		const spy = jest.spyOn(QuestionUtil, 'setScore')
		component.getInstance().assessmentComponentRef = {
			current: {
				calculateScore: () => ({ score: 0, details: 'mock-details' }),
				getDetails: () => null
			}
		}

		component.getInstance().scoreResponse()

		expect(spy).toHaveBeenCalledWith(
			'id',
			0,
			'mock-details',
			'mock-incorrect-labels',
			null,
			'mockContext'
		)

		spy.mockRestore()
	})

	test('scoreResponse calls QuestionUtil.setScore when assessment has details to return', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)
		model.modelState.type = 'default'

		const component = renderer.create(
			<Question model={model} moduleData={moduleData} isReview={false} />
		)
		const spy = jest.spyOn(QuestionUtil, 'setScore')
		component.getInstance().assessmentComponentRef = {
			current: {
				calculateScore: () => ({ score: 100, details: 'mock-details' }),
				getDetails: () => 'mock-assessment-details'
			}
		}

		component.getInstance().scoreResponse()

		expect(spy).toHaveBeenCalledWith(
			'id',
			100,
			'mock-details',
			'mock-correct-labels',
			'mock-assessment-details',
			'mockContext'
		)

		spy.mockRestore()
	})

	test('onClickReset prevents event default, updates nextFocus and calls retry', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const spy = jest.spyOn(Question.prototype, 'retry')

		const event = { preventDefault: jest.fn() }
		component.getInstance().onClickReset(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(spy).toHaveBeenCalled()
		expect(component.getInstance().nextFocus).toBe('question')

		spy.mockRestore()
	})

	test('onClickReveal prevents default, does not score response if not needed, calls reveal and updates nextFocus', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const revealSpy = jest.spyOn(Question.prototype, 'reveal')
		const scoreRespSpy = jest.spyOn(Question.prototype, 'scoreResponse')
		const hasUnscoredSpy = jest.spyOn(QuestionUtil, 'hasUnscoredResponse').mockReturnValue(false)

		const event = { preventDefault: jest.fn() }
		component.getInstance().onClickReveal(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(revealSpy).toHaveBeenCalled()
		expect(scoreRespSpy).not.toHaveBeenCalled()
		expect(component.getInstance().nextFocus).toBe('answers')

		revealSpy.mockRestore()
		scoreRespSpy.mockRestore()
		hasUnscoredSpy.mockRestore()
	})

	test('onClickReveal prevents default, scores response if needed, calls reveal and updates nextFocus', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		const revealSpy = jest.spyOn(Question.prototype, 'reveal')
		const scoreRespSpy = jest.spyOn(Question.prototype, 'scoreResponse')
		const hasUnscoredSpy = jest.spyOn(QuestionUtil, 'hasUnscoredResponse').mockReturnValue(true)

		const event = { preventDefault: jest.fn() }
		component.getInstance().onClickReveal(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(revealSpy).toHaveBeenCalled()
		expect(scoreRespSpy).toHaveBeenCalled()
		expect(component.getInstance().nextFocus).toBe('answers')

		revealSpy.mockRestore()
		scoreRespSpy.mockRestore()
		hasUnscoredSpy.mockRestore()
	})

	test('retry calls QuestionUtil.retryQuestion with expected params', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const spy = jest.spyOn(QuestionUtil, 'retryQuestion')
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)

		component.getInstance().retry()

		expect(spy).toHaveBeenCalledWith('id', 'mockContext')

		spy.mockRestore()
	})

	test('reveal calls QuestionUtil.revealAnswer with expected params', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const spy = jest.spyOn(QuestionUtil, 'revealAnswer')
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)

		component.getInstance().reveal()

		expect(spy).toHaveBeenCalledWith('id', 'mockContext')

		spy.mockRestore()
	})

	test.each`
		isAnswerRevealed | context               | mode
		${false}         | ${'practice'}         | ${'practice'}
		${false}         | ${'assessment'}       | ${'assessment'}
		${false}         | ${'assessmentReview'} | ${'review'}
		${true}          | ${'practice'}         | ${'review'}
		${true}          | ${'assessment'}       | ${'review'}
		${true}          | ${'assessmentReview'} | ${'review'}
	`(
		'getMode() with isAnswerRevealed="$isAnswerRevealed", context="$context" results in "$mode"',
		({ isAnswerRevealed, context, mode }) => {
			const moduleData = {
				questionState: 'mockQuestionState',
				navState: {
					context
				},
				focusState: 'mockFocus'
			}
			const model = OboModel.create(questionJSON)

			const spy = jest.spyOn(QuestionUtil, 'isAnswerRevealed').mockReturnValue(isAnswerRevealed)
			const component = renderer.create(<Question model={model} moduleData={moduleData} />)

			expect(component.getInstance().getMode()).toBe(mode)

			spy.mockRestore()
		}
	)

	test('onClickShowExplanation prevents event default, updates nextFocus and calls QuestionUtil.showExplanation', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const spy = jest.spyOn(QuestionUtil, 'showExplanation')
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)

		const event = { preventDefault: jest.fn() }
		component.getInstance().onClickShowExplanation(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(component.getInstance().nextFocus).toBe('explanation')
		expect(spy).toHaveBeenCalledWith('id', 'mockContext')

		spy.mockRestore()
	})

	test('hideExplanation calls QuestionUtil.hideExplanation', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const spy = jest.spyOn(QuestionUtil, 'hideExplanation')
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)

		component.getInstance().hideExplanation()

		expect(spy).toHaveBeenCalledWith('id', 'mockContext', 'user')

		spy.mockRestore()
	})

	test('onClickHideExplanation prevents event default, calls hideExplanation', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const spy = jest.spyOn(Question.prototype, 'hideExplanation')
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)

		const event = { preventDefault: jest.fn() }
		component.getInstance().onClickHideExplanation(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(spy).toHaveBeenCalled()

		spy.mockRestore()
	})

	test('getFeedbackText returns QuestionUtil.getFeedbackTextForModel if it returns text', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const spy = jest
			.spyOn(QuestionUtil, 'getFeedbackTextForModel')
			.mockReturnValue('mock-feedback-text')
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)

		expect(component.getInstance().getFeedbackText()).toBe('mock-feedback-text')

		spy.mockRestore()
	})

	test('getFeedbackText returns getLabel if QuestionUtil.getFeedbackTextForModel does not return text', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const spy = jest.spyOn(QuestionUtil, 'getFeedbackTextForModel').mockReturnValue(null)
		const component = renderer.create(<Question model={model} moduleData={moduleData} />)

		expect(component.getInstance().getFeedbackText()).toBe('mock-incorrect-labels')

		spy.mockRestore()
	})

	test.each`
		assessmentComponentRef                                         | instructions
		${null}                                                        | ${null}
		${{ current: null }}                                           | ${null}
		${{ current: { getInstructions: () => 'mock-instructions' } }} | ${'mock-instructions'}
	`(
		'getInstructions() with assessmentComponentRef="$assessmentComponentRef" = "$instructions"',
		({ assessmentComponentRef, instructions }) => {
			const moduleData = {
				questionState: 'mockQuestionState',
				navState: {
					context: 'mockContext'
				},
				focusState: 'mockFocus'
			}
			const model = OboModel.create(questionJSON)

			const component = renderer.create(<Question model={model} moduleData={moduleData} />)
			component.getInstance().assessmentComponentRef = assessmentComponentRef

			expect(component.getInstance().getInstructions()).toBe(instructions)
		}
	)

	test.each`
		mode            | type         | revealAnswerMode    | score   | getRevealAnswerDefault | result
		${'practice'}   | ${'default'} | ${'always'}         | ${0}    | ${null}                | ${true}
		${'assessment'} | ${'default'} | ${'always'}         | ${0}    | ${null}                | ${false}
		${'review'}     | ${'default'} | ${'always'}         | ${0}    | ${null}                | ${false}
		${'practice'}   | ${'default'} | ${'always'}         | ${100}  | ${null}                | ${false}
		${'assessment'} | ${'default'} | ${'always'}         | ${100}  | ${null}                | ${false}
		${'review'}     | ${'default'} | ${'always'}         | ${100}  | ${null}                | ${false}
		${'practice'}   | ${'default'} | ${'when-incorrect'} | ${0}    | ${null}                | ${true}
		${'assessment'} | ${'default'} | ${'when-incorrect'} | ${0}    | ${null}                | ${false}
		${'review'}     | ${'default'} | ${'when-incorrect'} | ${0}    | ${null}                | ${false}
		${'practice'}   | ${'default'} | ${'when-incorrect'} | ${100}  | ${null}                | ${false}
		${'assessment'} | ${'default'} | ${'when-incorrect'} | ${100}  | ${null}                | ${false}
		${'review'}     | ${'default'} | ${'when-incorrect'} | ${100}  | ${null}                | ${false}
		${'practice'}   | ${'default'} | ${'never'}          | ${0}    | ${null}                | ${false}
		${'assessment'} | ${'default'} | ${'never'}          | ${0}    | ${null}                | ${false}
		${'review'}     | ${'default'} | ${'never'}          | ${0}    | ${null}                | ${false}
		${'practice'}   | ${'default'} | ${'never'}          | ${100}  | ${null}                | ${false}
		${'assessment'} | ${'default'} | ${'never'}          | ${100}  | ${null}                | ${false}
		${'review'}     | ${'default'} | ${'never'}          | ${100}  | ${null}                | ${false}
		${'practice'}   | ${'default'} | ${'always'}         | ${null} | ${null}                | ${true}
		${'assessment'} | ${'default'} | ${'always'}         | ${null} | ${null}                | ${false}
		${'review'}     | ${'default'} | ${'always'}         | ${null} | ${null}                | ${false}
		${'practice'}   | ${'default'} | ${'when-incorrect'} | ${null} | ${null}                | ${false}
		${'assessment'} | ${'default'} | ${'when-incorrect'} | ${null} | ${null}                | ${false}
		${'review'}     | ${'default'} | ${'when-incorrect'} | ${null} | ${null}                | ${false}
		${'practice'}   | ${'default'} | ${'never'}          | ${null} | ${null}                | ${false}
		${'assessment'} | ${'default'} | ${'never'}          | ${null} | ${null}                | ${false}
		${'review'}     | ${'default'} | ${'never'}          | ${null} | ${null}                | ${false}
		${'practice'}   | ${'survey'}  | ${'always'}         | ${0}    | ${null}                | ${false}
		${'assessment'} | ${'survey'}  | ${'always'}         | ${0}    | ${null}                | ${false}
		${'review'}     | ${'survey'}  | ${'always'}         | ${0}    | ${null}                | ${false}
		${'practice'}   | ${'survey'}  | ${'always'}         | ${100}  | ${null}                | ${false}
		${'assessment'} | ${'survey'}  | ${'always'}         | ${100}  | ${null}                | ${false}
		${'review'}     | ${'survey'}  | ${'always'}         | ${100}  | ${null}                | ${false}
		${'practice'}   | ${'survey'}  | ${'when-incorrect'} | ${0}    | ${null}                | ${false}
		${'assessment'} | ${'survey'}  | ${'when-incorrect'} | ${0}    | ${null}                | ${false}
		${'review'}     | ${'survey'}  | ${'when-incorrect'} | ${0}    | ${null}                | ${false}
		${'practice'}   | ${'survey'}  | ${'when-incorrect'} | ${100}  | ${null}                | ${false}
		${'assessment'} | ${'survey'}  | ${'when-incorrect'} | ${100}  | ${null}                | ${false}
		${'review'}     | ${'survey'}  | ${'when-incorrect'} | ${100}  | ${null}                | ${false}
		${'practice'}   | ${'survey'}  | ${'never'}          | ${0}    | ${null}                | ${false}
		${'assessment'} | ${'survey'}  | ${'never'}          | ${0}    | ${null}                | ${false}
		${'review'}     | ${'survey'}  | ${'never'}          | ${0}    | ${null}                | ${false}
		${'practice'}   | ${'survey'}  | ${'never'}          | ${100}  | ${null}                | ${false}
		${'assessment'} | ${'survey'}  | ${'never'}          | ${100}  | ${null}                | ${false}
		${'review'}     | ${'survey'}  | ${'never'}          | ${100}  | ${null}                | ${false}
		${'practice'}   | ${'survey'}  | ${'always'}         | ${null} | ${null}                | ${false}
		${'assessment'} | ${'survey'}  | ${'always'}         | ${null} | ${null}                | ${false}
		${'review'}     | ${'survey'}  | ${'always'}         | ${null} | ${null}                | ${false}
		${'practice'}   | ${'survey'}  | ${'when-incorrect'} | ${null} | ${null}                | ${false}
		${'assessment'} | ${'survey'}  | ${'when-incorrect'} | ${null} | ${null}                | ${false}
		${'review'}     | ${'survey'}  | ${'when-incorrect'} | ${null} | ${null}                | ${false}
		${'practice'}   | ${'survey'}  | ${'never'}          | ${null} | ${null}                | ${false}
		${'assessment'} | ${'survey'}  | ${'never'}          | ${null} | ${null}                | ${false}
		${'review'}     | ${'survey'}  | ${'never'}          | ${null} | ${null}                | ${false}
		${'practice'}   | ${'default'} | ${'default'}        | ${0}    | ${'always'}            | ${true}
		${'assessment'} | ${'default'} | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'review'}     | ${'default'} | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'practice'}   | ${'default'} | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'assessment'} | ${'default'} | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'review'}     | ${'default'} | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'practice'}   | ${'default'} | ${'default'}        | ${0}    | ${'always'}            | ${true}
		${'assessment'} | ${'default'} | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'review'}     | ${'default'} | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'practice'}   | ${'default'} | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'assessment'} | ${'default'} | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'review'}     | ${'default'} | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'practice'}   | ${'default'} | ${'default'}        | ${0}    | ${'always'}            | ${true}
		${'assessment'} | ${'default'} | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'review'}     | ${'default'} | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'practice'}   | ${'default'} | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'assessment'} | ${'default'} | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'review'}     | ${'default'} | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'practice'}   | ${'default'} | ${'default'}        | ${null} | ${'always'}            | ${true}
		${'assessment'} | ${'default'} | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'review'}     | ${'default'} | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'practice'}   | ${'default'} | ${'default'}        | ${null} | ${'always'}            | ${true}
		${'assessment'} | ${'default'} | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'review'}     | ${'default'} | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'practice'}   | ${'default'} | ${'default'}        | ${null} | ${'always'}            | ${true}
		${'assessment'} | ${'default'} | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'review'}     | ${'default'} | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'practice'}   | ${'survey'}  | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'assessment'} | ${'survey'}  | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'review'}     | ${'survey'}  | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'practice'}   | ${'survey'}  | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'assessment'} | ${'survey'}  | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'review'}     | ${'survey'}  | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'practice'}   | ${'survey'}  | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'assessment'} | ${'survey'}  | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'review'}     | ${'survey'}  | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'practice'}   | ${'survey'}  | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'assessment'} | ${'survey'}  | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'review'}     | ${'survey'}  | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'practice'}   | ${'survey'}  | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'assessment'} | ${'survey'}  | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'review'}     | ${'survey'}  | ${'default'}        | ${0}    | ${'always'}            | ${false}
		${'practice'}   | ${'survey'}  | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'assessment'} | ${'survey'}  | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'review'}     | ${'survey'}  | ${'default'}        | ${100}  | ${'always'}            | ${false}
		${'practice'}   | ${'survey'}  | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'assessment'} | ${'survey'}  | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'review'}     | ${'survey'}  | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'practice'}   | ${'survey'}  | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'assessment'} | ${'survey'}  | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'review'}     | ${'survey'}  | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'practice'}   | ${'survey'}  | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'assessment'} | ${'survey'}  | ${'default'}        | ${null} | ${'always'}            | ${false}
		${'review'}     | ${'survey'}  | ${'default'}        | ${null} | ${'always'}            | ${false}
	`(
		'getShouldShowRevealAnswerButton() mode="$mode", type="$type", revealAnswer="$revealAnswerMode", score="$score", getRevealAnswerDefault="$getRevealAnswerDefault" -> $result',
		({ mode, type, revealAnswerMode, score, getRevealAnswerDefault, result }) => {
			const moduleData = {
				questionState: 'mockQuestionState',
				navState: {
					context: 'mockContext'
				},
				focusState: 'mockFocus'
			}
			const model = OboModel.create(questionJSON)
			model.modelState.type = type
			model.modelState.revealAnswer = revealAnswerMode
			const modeSpy = jest.spyOn(Question.prototype, 'getMode').mockReturnValue(mode)
			const scoreSpy = jest.spyOn(Question.prototype, 'getScore').mockReturnValue(score)

			const component = renderer.create(<Question model={model} moduleData={moduleData} />)
			if (getRevealAnswerDefault !== null) {
				component.getInstance().assessmentComponentRef = {
					current: {
						revealAnswerDefault: getRevealAnswerDefault
					}
				}
			}

			expect(component.getInstance().getShouldShowRevealAnswerButton()).toBe(result)

			modeSpy.mockRestore()
			scoreSpy.mockRestore()
		}
	)

	test('componentDidUpdate calls focusOnExplanation if nextFocus is "explanation"', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const focusUtilSpy = jest.spyOn(FocusUtil, 'focusComponent')

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		component.getInstance().explanationRef = {
			focusOnExplanation: jest.fn()
		}
		component.getInstance().resultsRef = {
			current: jest.fn()
		}
		component.getInstance().nextFocus = 'explanation'

		component.getInstance().componentDidUpdate()

		expect(component.getInstance().explanationRef.focusOnExplanation).toHaveBeenCalled()
		expect(focus).not.toHaveBeenCalled()
		expect(focusUtilSpy).not.toHaveBeenCalled()
		expect(component.getInstance().nextFocus).not.toBeDefined()

		focusUtilSpy.mockRestore()
	})

	test('componentDidUpdate calls focus if nextFocus is "results" and score is non-null', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const scoreSpy = jest.spyOn(Question.prototype, 'getScore').mockReturnValue(0)
		const focusUtilSpy = jest.spyOn(FocusUtil, 'focusComponent')

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		component.getInstance().explanationRef = {
			focusOnExplanation: jest.fn()
		}
		component.getInstance().resultsRef = {
			current: jest.fn()
		}
		component.getInstance().nextFocus = 'results'

		component.getInstance().componentDidUpdate()

		expect(component.getInstance().explanationRef.focusOnExplanation).not.toHaveBeenCalled()
		expect(focus).toHaveBeenCalled()
		expect(focusUtilSpy).not.toHaveBeenCalled()
		expect(component.getInstance().nextFocus).not.toBeDefined()

		focusUtilSpy.mockRestore()
		scoreSpy.mockRestore()
	})

	test('componentDidUpdate does nothing if nextFocus is "results" and score is null', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const scoreSpy = jest.spyOn(Question.prototype, 'getScore').mockReturnValue(null)
		const focusUtilSpy = jest.spyOn(FocusUtil, 'focusComponent')

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		component.getInstance().explanationRef = {
			focusOnExplanation: jest.fn()
		}
		component.getInstance().resultsRef = {
			current: jest.fn()
		}
		component.getInstance().nextFocus = 'results'

		component.getInstance().componentDidUpdate()

		expect(component.getInstance().explanationRef.focusOnExplanation).not.toHaveBeenCalled()
		expect(focus).not.toHaveBeenCalled()
		expect(focusUtilSpy).not.toHaveBeenCalled()
		expect(component.getInstance().nextFocus).toBe('results')

		focusUtilSpy.mockRestore()
		scoreSpy.mockRestore()
	})

	test('componentDidUpdate calls FocusUtil.focusComponent if nextFocus is "question"', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const focusUtilSpy = jest.spyOn(FocusUtil, 'focusComponent')

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		component.getInstance().explanationRef = {
			focusOnExplanation: jest.fn()
		}
		component.getInstance().resultsRef = {
			current: jest.fn()
		}
		component.getInstance().nextFocus = 'question'

		component.getInstance().componentDidUpdate()

		expect(component.getInstance().explanationRef.focusOnExplanation).not.toHaveBeenCalled()
		expect(focus).not.toHaveBeenCalled()
		expect(focusUtilSpy).toHaveBeenCalledWith('id', { preventScroll: true })
		expect(component.getInstance().nextFocus).not.toBeDefined()

		focusUtilSpy.mockRestore()
	})

	test('componentDidUpdate calls FocusUtil.focusComponent if nextFocus is "answers"', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}
		const model = OboModel.create(questionJSON)

		const focusUtilSpy = jest.spyOn(FocusUtil, 'focusComponent')

		const component = renderer.create(<Question model={model} moduleData={moduleData} />)
		component.getInstance().explanationRef = {
			focusOnExplanation: jest.fn()
		}
		component.getInstance().resultsRef = {
			current: jest.fn()
		}
		component.getInstance().nextFocus = 'answers'

		component.getInstance().componentDidUpdate()

		expect(component.getInstance().explanationRef.focusOnExplanation).not.toHaveBeenCalled()
		expect(focus).not.toHaveBeenCalled()
		expect(focusUtilSpy).toHaveBeenCalledWith('mc-assessment-id', {
			preventScroll: true,
			region: 'answers'
		})
		expect(component.getInstance().nextFocus).not.toBeDefined()

		focusUtilSpy.mockRestore()
	})
})
