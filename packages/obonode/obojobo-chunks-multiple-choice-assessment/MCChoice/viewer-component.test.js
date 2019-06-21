import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/question-util')

import MCChoice from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'

const TYPE_PICK_ONE = 'pick-one'
const TYPE_MULTI_CORRECT = 'pick-one-multiple-correct'
const TYPE_PICK_ALL = 'pick-all'
const MODE_REVIEW = 'review'

require('./viewer') // used to register this oboModel
require('../viewer') // // dependency on Obojobo.Chunks.MCAssessment
require('../MCAnswer/viewer') // // dependency on Obojobo.Chunks.MCAssessment.MCAnswer
require('../MCFeedback/viewer') // // dependency on Obojobo.Chunks.MCAssessment.MCFeedback
require('obojobo-chunks-question/viewer') // dependency on Obojobo.Chunks.Question
require('obojobo-pages-page/viewer') // dependency on Obojobo.Pages.Page
require('obojobo-chunks-text/viewer') // // dependency on Obojobo.Chunks.Text

const getQuestionJSON = () => ({
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
						},
						{
							id: 'invalid-item',
							type: 'ObojoboDraft.Chunks.MCAssessment'
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
						},
						{
							id: 'invalid-item',
							type: 'ObojoboDraft.Chunks.MCAssessment'
						}
					]
				}
			]
		}
	]
})

describe('MCChoice viewer-component', () => {
	test('MCChoice component', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: 'mockMode',
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			isShowingExplanation: false,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component in review mode with no score data', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: {
				// review mode has no score data for the current context
				scores: {}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component type pick-one-multiple-correct', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			key: 'mockKey',
			responseType: TYPE_MULTI_CORRECT,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component type pick-all', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			key: 'mockKey',
			responseType: TYPE_PICK_ALL,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice that is selected and submitted (Not Pick All, Correct)', () => {
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: ['choice1']
		})

		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: true,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice that is selected and submitted (Not Pick All, Incorrect)', () => {
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: ['choice2']
		})

		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		const model = mcassessment.children.models[1]
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: true,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice that is selected and submitted (Pick All, Correct)', () => {
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: ['choice1']
		})

		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			key: 'mockKey',
			responseType: TYPE_PICK_ALL,
			questionSubmitted: true,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice that is selected and submitted (Pick All, Incorrect)', () => {
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: ['choice2']
		})

		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		const model = mcassessment.children.models[1]
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			key: 'mockKey',
			responseType: TYPE_PICK_ALL,
			questionSubmitted: true,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice that is selected and submitted', () => {
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: ['choice1']
		})

		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			key: 'mockKey',
			responseType: TYPE_PICK_ALL,
			questionSubmitted: true,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component in review mode - could have chosen', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// A correct choice
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question correct
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)
		// The user did not select this choice
		QuestionUtil.getResponse.mockReturnValueOnce(null)

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component in review mode - should have chosen', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// A correct choice
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question correct
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)
		// The user did not select this choice
		QuestionUtil.getResponse.mockReturnValueOnce(null)

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component in review mode - chosen correctly', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// A correct choice
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question correct
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)
		// The user did select this choice
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component in review mode - unchosen correctly', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// An incorrect choice
		const model = mcassessment.children.models[1]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question correct
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)
		// The user did not select this choice
		QuestionUtil.getResponse.mockReturnValueOnce(null)

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component in review mode - should not have chosen', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// An incorrect choice
		const model = mcassessment.children.models[1]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question incorrect
		QuestionUtil.getScoreForModel.mockReturnValueOnce(0)
		// The user did select this choice
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component in review mode - survey question - this item selected', () => {
		const surveyQuestionJSON = getQuestionJSON()
		surveyQuestionJSON.content.type = 'survey'
		const question = OboModel.create(surveyQuestionJSON)
		const mcassessment = question.children.models[0]
		// This choice
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		QuestionUtil.getScoreForModel.mockReturnValueOnce('no-score')
		// The user did select this choice
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component in review mode - survey question - this item NOT selected', () => {
		const surveyQuestionJSON = getQuestionJSON()
		surveyQuestionJSON.content.type = 'survey'
		const question = OboModel.create(surveyQuestionJSON)
		const mcassessment = question.children.models[0]
		// Not this choice
		const model = mcassessment.children.models[1]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ONE,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		QuestionUtil.getScoreForModel.mockReturnValueOnce('no-score')
		// The user did not select this choice
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component pick-all in review mode - chosen correctly', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// A correct choice
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ALL,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question correct
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)
		// The user did select this choice
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component pick-all in review mode - should have chosen', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// A correct choice
		const model = mcassessment.children.models[0]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ALL,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question incorrect
		QuestionUtil.getScoreForModel.mockReturnValueOnce(0)
		// The user did not select this choice
		QuestionUtil.getResponse.mockReturnValueOnce(null)

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component pick-all in review mode - unchosen correctly', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// An incorrect choice
		const model = mcassessment.children.models[1]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ALL,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question incorrect
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)
		// The user did not select this choice
		QuestionUtil.getResponse.mockReturnValueOnce(null)

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice component pick-all in review mode - should not have chosen', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// An incorrect choice
		const model = mcassessment.children.models[1]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ALL,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question incorrect
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)
		// The user did select this choice
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice2'] })

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('MCChoice renders empty div if error is thrown', () => {
		const questionJSON = getQuestionJSON()
		const question = OboModel.create(questionJSON)
		const mcassessment = question.children.models[0]
		// An incorrect choice
		const model = mcassessment.children.models[1]
		const moduleData = {
			questionState: {
				scores: {
					// review mode needs score data for the current context
					mockContext: 'mockScore'
				}
			},
			navState: {
				context: 'mockContext'
			},
			focusState: 'mockFocus'
		}

		const props = {
			model,
			moduleData,
			mode: MODE_REVIEW,
			key: 'mockKey',
			responseType: TYPE_PICK_ALL,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		// The user got the question incorrect
		QuestionUtil.getScoreForModel.mockImplementationOnce(() => {
			throw new Error()
		})

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})
})
