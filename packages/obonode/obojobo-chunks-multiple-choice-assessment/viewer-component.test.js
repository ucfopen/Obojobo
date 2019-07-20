import { mount, shallow } from 'enzyme'

import Common from 'obojobo-document-engine/src/scripts/common'
import DOMUtil from 'obojobo-document-engine/src/scripts/common/page/dom-util'
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
import MCAssessment from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'
import React from 'react'
import _ from 'underscore'
import renderer from 'react-test-renderer'

const { getScoreClass } = require.requireActual(
	'obojobo-document-engine/src/scripts/viewer/util/question-util'
).default

jest.mock('obojobo-document-engine/src/scripts/viewer/util/question-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/focus-util')
jest.mock('obojobo-document-engine/src/scripts/common/flux/dispatcher')
jest.mock('obojobo-document-engine/src/scripts/common/page/dom-util')
jest.mock('obojobo-document-engine/src/scripts/common/page/focus')

const DEFAULT_CORRECT_PRACTICE_LABELS = ['Correct!', 'You got it!', 'Great job!', "That's right!"]
const DEFAULT_CORRECT_REVIEW_LABELS = ['Correct']
const DEFAULT_INCORRECT_LABELS = ['Incorrect']
const DEFAULT_INCORRECT_REVIEW_LABELS = ['Incorrect']
const DEFAULT_SURVEY_LABELS = ['Response recorded']
const DEFAULT_SURVEY_REVIEW_LABELS = ['Response recorded']
const DEFAULT_SURVEY_UNANSWERED_LABELS = ['No response given']

const MCCHOICE_NODE_TYPE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const TYPE_PICK_ONE = 'pick-one'
const TYPE_MULTI_CORRECT = 'pick-one-multiple-correct'
const TYPE_PICK_ALL = 'pick-all'
const ACTION_CHECK_ANSWER = 'question:checkAnswer'

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

const createComponent = ({
	type = 'default', //'default' | 'survey'
	mode = 'practice', //'practice' | 'assessment' | 'review'
	score = null, //null, 0 or 100
	hasSolution = true,
	sortedIds = ['choice1', 'choice2'],
	response = null, //null or { ids: [some array] }
	responseType = 'pick-one', //'pick-one', 'pick-one-multiple-correct' or 'pick-all'
	shuffle = true, //true or false or not set
	isShowingExplanation = null //true or false or not set
}) => {
	const moduleData = {
		questionState: 'mockQuestionState',
		navState: {
			context: 'mockContext'
		},
		focusState: {
			state: {
				focussedId: 'id'
			}
		}
	}
	const parent = OboModel.create(questionJSON)
	if (!hasSolution) parent.modelState.solution = null
	const model = parent.children.models[0]

	if (responseType) {
		model.modelState.responseType = responseType
	}
	if (shuffle) {
		model.modelState.shuffle = shuffle
	}
	if (isShowingExplanation) {
		QuestionUtil.isShowingExplanation.mockReturnValue(true)
	}

	QuestionUtil.getScoreForModel.mockReturnValue(score)
	QuestionUtil.isAnswered.mockReturnValue(score !== null)
	QuestionUtil.getResponse.mockReturnValue(response)
	QuestionUtil.getData.mockImplementation((state, model, context, key) => {
		switch (key) {
			case 'sortedIds':
				return sortedIds

			case 'feedbackLabelsToShow':
				return {
					correct: 'CORRECT_LABEL',
					incorrect: 'INCORRECT_LABEL'
				}
		}
	})

	return renderer.create(
		<MCAssessment model={model} moduleData={moduleData} mode={mode} type={type} />
	)
}

let originalGetRandomItem

describe('MCAssessment', () => {
	beforeAll(() => {
		_.shuffle = a => a
		QuestionUtil.getScoreClass = getScoreClass
	})
	beforeEach(() => {
		jest.resetAllMocks()

		// Override the getRandomItem method to be deterministic
		originalGetRandomItem = MCAssessment.prototype.getRandomItem
		MCAssessment.prototype.getRandomItem = a => a[0]
	})
	afterEach(() => {
		MCAssessment.prototype.getRandomItem = originalGetRandomItem
	})

	// MCAssessment component tests
	test('MCAssessment component', () => {
		expect(createComponent({}).toJSON()).toMatchSnapshot()
	})

	test('Component not shuffled', () => {
		expect(
			createComponent({
				shuffle: false
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with sortedIds', () => {
		expect(
			createComponent({
				sortedIds: ['choice2', 'choice1']
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-one-multiple-correct', () => {
		expect(
			createComponent({
				responseType: TYPE_MULTI_CORRECT
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-all', () => {
		expect(
			createComponent({
				responseType: TYPE_PICK_ALL
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 0
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score, pick-one-multiple-correct', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 0,
				responseType: TYPE_MULTI_CORRECT
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score, pick-one-multiple-correct', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				responseType: TYPE_MULTI_CORRECT
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score, pick-all', () => {
		expect(
			createComponent({
				response: { ids: ['choice1', 'choice2'] },
				score: 0,
				responseType: TYPE_PICK_ALL
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score, pick-all', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				responseType: TYPE_PICK_ALL
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score and showing explanation', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 0,
				isShowingExplanation: true
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score and showing explanation', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				isShowingExplanation: true
			}).toJSON()
		).toMatchSnapshot()
	})

	test('MCAssessment component question with no solution page', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				solution: null
			}).toJSON()
		).toMatchSnapshot()
	})

	test('MCAssessment component, review', () => {
		expect(
			createComponent({
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component not shuffled, review', () => {
		expect(
			createComponent({
				shuffle: false,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with sortedIds, review', () => {
		expect(
			createComponent({
				sortedIds: ['choice2', 'choice1'],
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-one-multiple-correct, review', () => {
		expect(
			createComponent({
				responseType: TYPE_MULTI_CORRECT,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-all, review', () => {
		expect(
			createComponent({
				responseType: TYPE_PICK_ALL,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score, review', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 0,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score, review', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score, pick-one-multiple-correct, review', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 0,
				responseType: TYPE_MULTI_CORRECT,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score, pick-one-multiple-correct, review', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				responseType: TYPE_MULTI_CORRECT,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score, pick-all, review', () => {
		expect(
			createComponent({
				response: { ids: ['choice1', 'choice2'] },
				score: 0,
				responseType: TYPE_PICK_ALL,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score, pick-all, review', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				responseType: TYPE_PICK_ALL,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score and showing explanation, review', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 0,
				isShowingExplanation: true,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score and showing explanation, review', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				isShowingExplanation: true,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('MCAssessment component question with no solution page, review', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				solution: null,
				mode: 'review'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('MCAssessment component, assessment', () => {
		expect(
			createComponent({
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component not shuffled, assessment', () => {
		expect(
			createComponent({
				shuffle: false,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with sortedIds, assessment', () => {
		expect(
			createComponent({
				sortedIds: ['choice2', 'choice1'],
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-one-multiple-correct, assessment', () => {
		expect(
			createComponent({
				responseType: TYPE_MULTI_CORRECT,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-all, assessment', () => {
		expect(
			createComponent({
				responseType: TYPE_PICK_ALL,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score, assessment', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 0,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score, assessment', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score, pick-one-multiple-correct, assessment', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 0,
				responseType: TYPE_MULTI_CORRECT,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score, pick-one-multiple-correct, assessment', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				responseType: TYPE_MULTI_CORRECT,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score, pick-all, assessment', () => {
		expect(
			createComponent({
				response: { ids: ['choice1', 'choice2'] },
				score: 0,
				responseType: TYPE_PICK_ALL,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score, pick-all, assessment', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				responseType: TYPE_PICK_ALL,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with incorrect score and showing explanation, assessment', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 0,
				isShowingExplanation: true,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with correct score and showing explanation, assessment', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				isShowingExplanation: true,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('MCAssessment component question with no solution page, assessment', () => {
		expect(
			createComponent({
				response: { ids: ['choice1'] },
				score: 100,
				solution: null,
				mode: 'assessment'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('MCAssessment component (survey)', () => {
		expect(
			createComponent({
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component not shuffled (survey)', () => {
		expect(
			createComponent({
				shuffle: false,
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with sortedIds (survey)', () => {
		expect(
			createComponent({
				sortedIds: ['choice2', 'choice1'],
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-one-multiple-correct (survey)', () => {
		expect(
			createComponent({
				responseType: TYPE_MULTI_CORRECT,
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-all (survey)', () => {
		expect(
			createComponent({
				responseType: TYPE_PICK_ALL,
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component submitted (survey)', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 'no-score',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component submitted, pick-one-multiple-correct (survey)', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 'no-score',
				responseType: TYPE_MULTI_CORRECT,
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component submitted, pick-all (survey)', () => {
		expect(
			createComponent({
				response: { ids: ['choice1', 'choice2'] },
				score: 'no-score',
				responseType: TYPE_PICK_ALL,
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('MCAssessment component, review (survey)', () => {
		expect(
			createComponent({
				mode: 'review',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component not shuffled, review (survey)', () => {
		expect(
			createComponent({
				shuffle: false,
				mode: 'review',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with sortedIds, review (survey)', () => {
		expect(
			createComponent({
				sortedIds: ['choice2', 'choice1'],
				mode: 'review',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-one-multiple-correct, review (survey)', () => {
		expect(
			createComponent({
				responseType: TYPE_MULTI_CORRECT,
				mode: 'review',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-all, review (survey)', () => {
		expect(
			createComponent({
				responseType: TYPE_PICK_ALL,
				mode: 'review',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component submitted, review (survey)', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 'no-score',
				mode: 'review',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component submitted, pick-one-multiple-correct, review (survey)', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 'no-score',
				responseType: TYPE_MULTI_CORRECT,
				mode: 'review',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component submitted, pick-all, review (survey)', () => {
		expect(
			createComponent({
				response: { ids: ['choice1', 'choice2'] },
				score: 'no-score',
				responseType: TYPE_PICK_ALL,
				mode: 'review',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('MCAssessment component, assessment (survey)', () => {
		expect(
			createComponent({
				mode: 'assessment',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component not shuffled, assessment (survey)', () => {
		expect(
			createComponent({
				shuffle: false,
				mode: 'assessment',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component with sortedIds, assessment (survey)', () => {
		expect(
			createComponent({
				sortedIds: ['choice2', 'choice1'],
				mode: 'assessment',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-one-multiple-correct, assessment (survey)', () => {
		expect(
			createComponent({
				responseType: TYPE_MULTI_CORRECT,
				mode: 'assessment',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component pick-all, assessment (survey)', () => {
		expect(
			createComponent({
				responseType: TYPE_PICK_ALL,
				mode: 'assessment',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component submitted, assessment (survey)', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 'no-score',
				mode: 'assessment',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component submitted, pick-one-multiple-correct, assessment (survey)', () => {
		expect(
			createComponent({
				response: { ids: ['choice2'] },
				score: 'no-score',
				responseType: TYPE_MULTI_CORRECT,
				mode: 'assessment',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	test('Component submitted, pick-all, assessment (survey)', () => {
		expect(
			createComponent({
				response: { ids: ['choice1', 'choice2'] },
				score: 'no-score',
				responseType: TYPE_PICK_ALL,
				mode: 'assessment',
				type: 'survey'
			}).toJSON()
		).toMatchSnapshot()
	})

	// MCAssessment function tests
	test('getQuestionModel gets the parent question', () => {
		const moduleData = {
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const retrivedParent = component.instance().getQuestionModel()

		expect(retrivedParent).toEqual(parent)
	})

	test('getResponseData builds the expected array with no responses', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		const correctSet = new Set()
		correctSet.add('choice1')
		const responseSet = new Set()

		// no MCChoice items were selected
		QuestionUtil.getResponse.mockReturnValue(null)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const data = component.instance().getResponseData()

		expect(QuestionUtil.getResponse).toHaveBeenCalledWith(
			'mockQuestionState',
			expect.anything(),
			'mockContext'
		)
		expect(data).toEqual({
			correct: correctSet,
			responses: responseSet
		})
	})

	test('getResponseData builds the expected array with responses', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		const correctSet = new Set()
		correctSet.add('choice1')
		const responseSet = new Set()
		responseSet.add('choice2')

		// choice2 was selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const data = component.instance().getResponseData()

		expect(QuestionUtil.getResponse).toHaveBeenCalledWith(
			'mockQuestionState',
			expect.anything(),
			'mockContext'
		)
		expect(data).toEqual({
			correct: correctSet,
			responses: responseSet
		})
	})

	// incorrect pick-one-multiple-correct functions the same way as pick-one
	test('calculateScore returns 0 with incorrect - pick-one', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		// choice2 was selected - not correct
		// choice1 is the correct answer
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const score = component.instance().calculateScore()

		expect(score).toEqual(0)
	})

	// correct pick-one-multiple-correct functions the same way as pick-one
	test('calculateScore returns 100 with correct - pick-one', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		// choice1 was selected - correct
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const score = component.instance().calculateScore()

		expect(score).toEqual(100)
	})

	test('calculateScore returns 0 with too many - pick-all', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		model.modelState.responseType = TYPE_PICK_ALL

		// choice1 and choice2 were selected - wrong answer
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1', 'choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const score = component.instance().calculateScore()

		expect(score).toEqual(0)
	})

	test('calculateScore returns 0 with wrong choices - pick-all', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		model.modelState.responseType = TYPE_PICK_ALL

		// choice2 was selected - incorrect
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const score = component.instance().calculateScore()

		expect(score).toEqual(0)
	})

	test('calculateScore returns 100 with correct choices - pick-all', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		model.modelState.responseType = TYPE_PICK_ALL

		// choice1 was selected - correct
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const score = component.instance().calculateScore()

		expect(score).toEqual(100)
	})

	test('calculateScore returns "no-score" with survey question', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		parent.modelState.type = 'survey'
		const model = parent.children.models[0]

		// choice1 was selected - correct
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const score = component.instance().calculateScore()

		expect(score).toEqual('no-score')
	})

	test('isShowingExplanation calls QuestionUtil', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.isShowingExplanation.mockReturnValue('mockShowing')

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const showing = component.instance().isShowingExplanation()

		expect(QuestionUtil.isShowingExplanation).toHaveBeenCalledWith(
			'mockQuestionState',
			parent,
			'mockContext'
		)
		expect(showing).toEqual('mockShowing')
	})

	test('retry calls QuestionUtil', () => {
		const moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().retry()

		expect(QuestionUtil.retryQuestion).toHaveBeenCalledWith('parent', 'mockContext')
	})

	test('hideExplanation calls QuestionUtil', () => {
		const moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().hideExplanation()

		expect(QuestionUtil.hideExplanation).toHaveBeenCalledWith('parent', 'mockContext', 'user')
	})

	test('onClickReset modifies event, updates nextFocus and calls retry', () => {
		const moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = { preventDefault: jest.fn() }

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		expect(component.instance().nextFocus).not.toBeDefined()
		component.instance().onClickReset(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(component.instance().nextFocus).toBe('question')
		expect(QuestionUtil.retryQuestion).toHaveBeenCalledWith('parent', 'mockContext')
	})

	test('onFormSubmit modifies event and calls QuestionUtil', () => {
		const moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = { preventDefault: jest.fn() }

		// mock for getResponses() (called by calculateScore)
		// choice1 is correct, so score will be 100
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().onFormSubmit(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(QuestionUtil.setScore).toHaveBeenCalledWith('parent', 100, 'mockContext')
		expect(QuestionUtil.checkAnswer).toHaveBeenCalledWith('parent', 'mockContext')
		expect(QuestionUtil.submitResponse).not.toHaveBeenCalled()
	})

	test('onFormSubmit calls QuestionUtil.submitResponse for survey question', () => {
		const moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		const parent = OboModel.create(questionJSON)
		parent.modelState.type = 'survey'
		const model = parent.children.models[0]
		const event = { preventDefault: jest.fn() }

		// mock for getResponses() (called by calculateScore)
		// choice1 is correct, so score will be 100
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().onFormSubmit(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(QuestionUtil.setScore).toHaveBeenCalledWith('parent', 'no-score', 'mockContext')
		expect(QuestionUtil.checkAnswer).not.toHaveBeenCalled()
		expect(QuestionUtil.submitResponse).toHaveBeenCalledWith('parent', 'mockContext')
	})

	test('onClickShowExplanation modifies event, calls QuestionUtil and updates nextFocus', () => {
		const moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = { preventDefault: jest.fn() }

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		expect(component.instance().nextFocus).not.toBeDefined()

		component.instance().onClickShowExplanation(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(component.instance().nextFocus).toBe('explanation')
		expect(QuestionUtil.showExplanation).toHaveBeenCalledWith('parent', 'mockContext')
	})

	test('onClickHideExplanation modifies event and calls QuestionUtil', () => {
		const moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = { preventDefault: jest.fn() }

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().onClickHideExplanation(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(QuestionUtil.hideExplanation).toHaveBeenCalledWith('parent', 'mockContext', 'user')
	})

	test('onFormChange terminates if clicked item was not an MCChoice', () => {
		const moduleData = {
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = {
			target: 'mockTarget'
		}

		// DOMUtil tries to find the clicked target
		DOMUtil.findParentWithAttr.mockReturnValueOnce(null)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().onFormChange(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
	})

	test('onFormChange terminates if clicked item does not have an id', () => {
		const moduleData = {
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = {
			target: 'mockTarget'
		}
		const mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce(null)
		}

		// DOMUtil tries to find the clicked target
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().onFormChange(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
		expect(mcChoiceEl.getAttribute).toHaveBeenCalledWith('data-id')
	})

	test('onFormChange retries question when already scored', () => {
		const moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		const mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - scored
		QuestionUtil.getScoreForModel.mockReturnValue(100)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		expect(component.instance().nextFocus).not.toBeDefined()

		component.instance().onFormChange(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
		expect(mcChoiceEl.getAttribute).toHaveBeenCalledWith('data-id')
		expect(QuestionUtil.retryQuestion).toHaveBeenCalled()
		expect(QuestionUtil.setResponse).toHaveBeenCalled()
		expect(component.instance().nextFocus).toBe('results')
	})

	// Pick-one-multiple-correct functions the same way as pick-one
	test('onFormChange adds clicked id to response - pick-one', () => {
		const moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		const mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - not scored
		QuestionUtil.getScoreForModel.mockReturnValue(null)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		expect(component.instance().nextFocus).not.toBeDefined()

		component.instance().onFormChange(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
		expect(mcChoiceEl.getAttribute).toHaveBeenCalledWith('data-id')
		expect(QuestionUtil.setResponse).toHaveBeenCalledWith(
			'parent',
			{ ids: ['choice1'] },
			'choice1',
			'mockContext:mockSecondContext:mockThirdContext',
			'mockSecondContext',
			'mockThirdContext'
		)
		expect(component.instance().nextFocus).toBe('results')
	})

	test('onFormChange adds clicked id to response when none are selected - pick-all', () => {
		const moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		const mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		model.modelState.responseType = TYPE_PICK_ALL

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - not scored
		QuestionUtil.getScoreForModel.mockReturnValue(null)

		// QuestionUtil gets the currently selected responses
		// choice1 has not been previously selected
		QuestionUtil.getResponse.mockReturnValue(null)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		expect(component.instance().nextFocus).not.toBeDefined()

		component.instance().onFormChange(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
		expect(mcChoiceEl.getAttribute).toHaveBeenCalledWith('data-id')
		expect(QuestionUtil.setResponse).toHaveBeenCalledWith(
			'parent',
			// choice1 is now selected
			{ ids: ['choice1'] },
			'choice1',
			'mockContext:mockSecondContext:mockThirdContext',
			'mockSecondContext',
			'mockThirdContext'
		)
		expect(component.instance().nextFocus).toBe('results')

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test('onFormChange adds clicked id to response when others are selected - pick-all', () => {
		const moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		const mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		model.modelState.responseType = TYPE_PICK_ALL

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - not scored
		QuestionUtil.getScoreForModel.mockReturnValue(null)

		// QuestionUtil gets the currently selected responses
		// choice2 is currently selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		expect(component.instance().nextFocus).not.toBeDefined()

		component.instance().onFormChange(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
		expect(mcChoiceEl.getAttribute).toHaveBeenCalledWith('data-id')
		expect(QuestionUtil.setResponse).toHaveBeenCalledWith(
			'parent',
			// both choice1 and choice2 are now selected
			{ ids: ['choice2', 'choice1'] },
			'choice1',
			'mockContext:mockSecondContext:mockThirdContext',
			'mockSecondContext',
			'mockThirdContext'
		)
		expect(component.instance().nextFocus).toBe('results')

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test('onFormChange removes clicked id from response when it is selected - pick-all', () => {
		const moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		const mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		model.modelState.responseType = TYPE_PICK_ALL

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - not scored
		QuestionUtil.getScoreForModel.mockReturnValue(null)

		// QuestionUtil gets the currently selected responses
		// choice1 and choice2 are currently selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1', 'choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		expect(component.instance().nextFocus).not.toBeDefined()

		component.instance().onFormChange(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
		expect(mcChoiceEl.getAttribute).toHaveBeenCalledWith('data-id')
		expect(QuestionUtil.setResponse).toHaveBeenCalledWith(
			'parent',
			// Only choice2 is now selected
			{ ids: ['choice2'] },
			'choice1',
			'mockContext:mockSecondContext:mockThirdContext',
			'mockSecondContext',
			'mockThirdContext'
		)
		expect(component.instance().nextFocus).toBe('results')

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test('getScore calls QuestionUtil', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().getScore()

		expect(QuestionUtil.getScoreForModel).toHaveBeenCalledWith(
			'mockQuestionState',
			parent,
			'mockContext'
		)
	})

	test('componentDidMount sets up the Dispatcher', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		// short circuits sortIds
		QuestionUtil.getData.mockReturnValueOnce(false)

		mount(<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />)

		expect(QuestionUtil.getData).toHaveBeenCalled()
		expect(Dispatcher.on).toHaveBeenCalledWith(ACTION_CHECK_ANSWER, expect.any(Function))
	})

	test('componentWillUnmount removes the Dispatcher', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		// short circuits sortIds
		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		component.unmount()

		expect(Dispatcher.off).toHaveBeenCalledWith(ACTION_CHECK_ANSWER, expect.any(Function))
	})

	test('onCheckAnswer does nothing if this is not the correct question', () => {
		const moduleData = {
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().onCheckAnswer({
			value: {
				id: 'mockDifferentId'
			}
		})

		expect(QuestionUtil.setScore).not.toHaveBeenCalled()
	})

	test('onCheckAnswer calls QuestionUtil for the correct question', () => {
		const moduleData = {
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		// mock for calculateScore - score is 0
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().onCheckAnswer({
			value: {
				id: 'parent'
			}
		})

		expect(QuestionUtil.setScore).toHaveBeenCalledWith('parent', 0, 'mockContext')
	})

	test('componentDidUpdate calls sortIds', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		// short circuits sortIds
		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.setProps({ model, moduleData })

		expect(QuestionUtil.getData).toHaveBeenCalled()
	})

	test('sortIds calls QuestionUtil, and does nothing if ids are sorted', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		// clear out mock data from the componentOnMount() call
		QuestionUtil.getData.mockReset()
		// Retrieves a list of the children - already sorted
		QuestionUtil.getData.mockReturnValueOnce([])

		component.instance().sortIds()

		expect(QuestionUtil.getData).toHaveBeenCalledWith(
			'mockQuestionState',
			expect.any(OboModel),
			'mockContext',
			'sortedIds'
		)
	})

	test('sortIds calls QuestionUtil, and sets ids if unsorted', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		// clear out mock data from the componentOnMount() call
		QuestionUtil.getData.mockReset()
		// Retrieves a list of the children - not yet sorted
		QuestionUtil.getData.mockReturnValueOnce(null)

		component.instance().sortIds()

		expect(QuestionUtil.getData).toHaveBeenCalledWith(
			'mockQuestionState',
			expect.any(OboModel),
			'mockContext',
			'sortedIds'
		)
		expect(QuestionUtil.setData).toHaveBeenCalledWith('id', 'mockContext', 'sortedIds', [
			'choice1',
			'choice2'
		])
	})

	test('sortIds calls QuestionUtil, and sets ids if unsorted', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		model.modelState.shuffle = false

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		// clear out mock data from the componentOnMount() call
		QuestionUtil.getData.mockReset()
		// Retrieves a list of the children - not yet sorted
		QuestionUtil.getData.mockReturnValueOnce(null)

		component.instance().sortIds()

		expect(QuestionUtil.getData).toHaveBeenCalledWith(
			'mockQuestionState',
			expect.any(OboModel),
			'mockContext',
			'sortedIds'
		)
		expect(QuestionUtil.setData).toHaveBeenCalledWith('id', 'mockContext', 'sortedIds', [
			'choice1',
			'choice2'
		])
	})

	test('getFeedbackLabels returns an object with two selected feedback labels', () => {
		const getRandomItemSpy = jest
			.spyOn(MCAssessment.prototype, 'getRandomItem')
			.mockImplementation(a => a[0])
		const getCorrectLabelsSpy = jest
			.spyOn(MCAssessment.prototype, 'getCorrectLabels')
			.mockReturnValue(['correct'])
		const getIncorrectLabelsSpy = jest
			.spyOn(MCAssessment.prototype, 'getIncorrectLabels')
			.mockReturnValue(['incorrect'])

		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		model.modelState.correctLabels = 'mock-correct-labels'
		model.modelState.incorrectLabels = 'mock-incorrect-labels'

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		expect(
			component.instance().getFeedbackLabels('mock-is-review', 'mock-is-survey', 'mock-is-answered')
		).toEqual({
			correct: 'correct',
			incorrect: 'incorrect'
		})

		expect(getCorrectLabelsSpy).toHaveBeenCalledWith(
			model.modelState.correctLabels,
			'mock-is-review',
			'mock-is-survey',
			'mock-is-answered'
		)
		expect(getIncorrectLabelsSpy).toHaveBeenCalledWith(
			model.modelState.incorrectLabels,
			'mock-is-review'
		)

		getRandomItemSpy.mockRestore()
		getCorrectLabelsSpy.mockRestore()
		getIncorrectLabelsSpy.mockRestore()
	})

	test.each([
		//clbl,review,survey,answrd,expected
		[null, false, false, false, DEFAULT_CORRECT_PRACTICE_LABELS],
		[null, false, false, true, DEFAULT_CORRECT_PRACTICE_LABELS],
		[null, false, true, false, DEFAULT_SURVEY_LABELS],
		[null, false, true, true, DEFAULT_SURVEY_LABELS],
		[null, true, false, false, DEFAULT_CORRECT_REVIEW_LABELS],
		[null, true, false, true, DEFAULT_CORRECT_REVIEW_LABELS],
		[null, true, true, false, DEFAULT_SURVEY_UNANSWERED_LABELS],
		[null, true, true, true, DEFAULT_SURVEY_REVIEW_LABELS],
		[['mock-correct-labels'], false, false, false, ['mock-correct-labels']],
		[['mock-correct-labels'], false, false, true, ['mock-correct-labels']],
		[['mock-correct-labels'], false, true, false, ['mock-correct-labels']],
		[['mock-correct-labels'], false, true, true, ['mock-correct-labels']],
		[['mock-correct-labels'], true, false, false, ['mock-correct-labels']],
		[['mock-correct-labels'], true, false, true, ['mock-correct-labels']],
		[['mock-correct-labels'], true, true, false, ['mock-correct-labels']],
		[['mock-correct-labels'], true, true, true, ['mock-correct-labels']]
	])(
		'getCorrectLabels(correctLabels=%s, isReview=%s, isSurvey=%s, isAnswered=%s) = %s',
		(correctLabels, isReview, isSurvey, isAnswered, expectedResult) => {
			expect(
				MCAssessment.prototype.getCorrectLabels(correctLabels, isReview, isSurvey, isAnswered)
			).toEqual(expectedResult)
		}
	)

	test.each([
		[null, false, DEFAULT_INCORRECT_LABELS],
		[null, true, DEFAULT_INCORRECT_REVIEW_LABELS],
		[['mock-incorrect-labels'], false, ['mock-incorrect-labels']],
		[['mock-incorrect-labels'], true, ['mock-incorrect-labels']]
	])(
		'getIncorrectLabels(incorrectLabels=%s, isReview=%s, isSurvey=%s, isAnswered=%s) = %s',
		(incorrectLabels, isReview, expectedResult) => {
			expect(MCAssessment.prototype.getIncorrectLabels(incorrectLabels, isReview)).toEqual(
				expectedResult
			)
		}
	)

	test('getRandomItem gets random values from array', () => {
		MCAssessment.prototype.getRandomItem = originalGetRandomItem

		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const array = ['mockRandomItem', 'mockAnotherRandomItem']

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		const item = component.instance().getRandomItem(array)

		expect(array).toContain(item)
	})

	test('getInstructions builds as expected for pick-one', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		const span = component.instance().getInstructions(TYPE_PICK_ONE)

		expect(span).toMatchSnapshot()
	})

	test('getInstructions builds as expected for pick-one-multiple-correct', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		const span = component.instance().getInstructions(TYPE_MULTI_CORRECT)

		expect(span).toMatchSnapshot()
	})

	test('getInstructions builds as expected for pick-all', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		const span = component.instance().getInstructions(TYPE_PICK_ALL)

		expect(span).toMatchSnapshot()
	})

	test('componentDidUpdate calls focusOnExplanation if nextFocus="explanation"', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		const mockFocusOnExplanation = jest.fn()
		component.instance().refExplanation = {
			focusOnExplanation: mockFocusOnExplanation
		}
		component.instance().nextFocus = 'explanation'
		component.instance().componentDidUpdate()
		expect(component.instance().nextFocus).not.toBeDefined()
		expect(mockFocusOnExplanation).toHaveBeenCalledTimes(1)
	})

	// TODO: should be in a new file called mc-assessment-explanation.test.js
	test('MCAssessmentExplanation::focusOnExplanation calls focusOnContent', () => {
		// setup the test
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		// get a reference to the solution Page
		const solutionClass = model.parent.modelState.solution.getComponentClass()
		// mock the function we're expecting focusOnExplanation to call
		solutionClass.focusOnContent = jest.fn()

		// after rendering - get use the component's ref to the MCAssessmentExplanation
		const explanationComponent = component.instance().refExplanation

		// make sure it hasn't been called
		expect(solutionClass.focusOnContent).toHaveBeenCalledTimes(0)

		// execute focusOnExplanation
		explanationComponent.focusOnExplanation()

		// make sure it's been called 1 time
		expect(solutionClass.focusOnContent).toHaveBeenCalledTimes(1)
		// make sure it was passed the modelState.solution
		expect(solutionClass.focusOnContent).toHaveBeenCalledWith(model.parent.modelState.solution)
	})

	// TODO: should be in a new file called mc-assessment-explanation.test.js
	test('MCAssessmentExplanation::focusOnExplanation calls falls back to the label', () => {
		// setup the test
		const { focus } = Common.page
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		// get a reference to the solution Page
		const solutionClass = model.parent.modelState.solution.getComponentClass()
		// mock the function we're expecting focusOnExplanation to call
		solutionClass.focusOnContent = jest.fn()

		// throw en error to force the code into the catch path within MCAssessmentExplanation.focusOnExplanation
		solutionClass.focusOnContent.mockImplementationOnce(() => {
			throw 'mock-error'
		})

		// make sure MCAssessmentExplanation.props.isShowingExplanation is true
		// so that the ref.label is rendered
		QuestionUtil.isShowingExplanation.mockReturnValueOnce(true)

		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		// after rendering - get use the component's ref to the MCAssessmentExplanation
		const explanationComponent = component.instance().refExplanation

		// make sure focus hasn't been called
		expect(focus).toHaveBeenCalledTimes(0)

		// execute focusOnExplanation
		explanationComponent.focusOnExplanation()

		// make sure focus was called with the MCAssessmentExplanation.ref.label
		expect(focus).toHaveBeenCalledTimes(1)
		expect(focus).toHaveBeenCalledWith(explanationComponent.solutionLabelRef.current)
	})

	test('componentDidUpdate calls focusOnResults if nextFocus="results"', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		QuestionUtil.getScoreForModel.mockReturnValue(0)

		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const componentInst = component.instance()
		const mockFocusOnResults = jest.fn()
		componentInst.answerChoicesRef.current.focusOnResults = mockFocusOnResults
		componentInst.nextFocus = 'results'
		componentInst.componentDidUpdate()
		expect(componentInst.nextFocus).not.toBeDefined()
		expect(mockFocusOnResults).toHaveBeenCalledTimes(1)
	})

	test('componentDidUpdate does not call focusOnResults if nextFocus="results" but there is no score', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		QuestionUtil.getScoreForModel.mockReturnValue(null)

		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		const componentInst = component.instance()
		const mockFocusOnResults = jest.fn()
		componentInst.answerChoicesRef.current.focusOnResults = mockFocusOnResults
		componentInst.nextFocus = 'results'
		componentInst.componentDidUpdate()
		expect(componentInst.nextFocus).toBe('results')
		expect(mockFocusOnResults).toHaveBeenCalledTimes(0)
	})

	test('componentDidUpdate calls FocusUtil.focusComponent on the question if nextFocus="question"', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)

		FocusUtil.focusComponent = jest.fn()

		component.instance().nextFocus = 'question'
		component.instance().componentDidUpdate()
		expect(component.instance().nextFocus).not.toBeDefined()
		expect(FocusUtil.focusComponent).toHaveBeenCalledWith('parent')
	})

	test('animationOnEntered sets solution container height', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		component.instance().solutionContainerRef = {
			getBoundingClientRect: () => ({
				height: 52
			})
		}
		component.instance().animationOnEntered()
		expect(component.instance().solutionContainerHeight).toBe('52px')
	})

	test('animationOnExit sets height of given element', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const el = { style: { height: null } }
		component.instance().solutionContainerHeight = '20px'
		component.instance().animationOnExit(el)

		expect(el.style.height).toBe('20px')
	})

	test('animationOnExiting sets height of given element to 0', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" type="default" />
		)
		const el = { style: { height: null } }
		component.instance().animationOnExiting(el)

		expect(el.style.height).toBe(0)
	})
})
