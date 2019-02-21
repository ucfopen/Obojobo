import { mount, shallow } from 'enzyme'

import DOMUtil from 'obojobo-document-engine/src/scripts/common/page/dom-util'
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
import MCAssessment from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'
import React from 'react'
import _ from 'underscore'
import renderer from 'react-test-renderer'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/question-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/focus-util')
jest.mock('obojobo-document-engine/src/scripts/common/flux/dispatcher')
jest.mock('obojobo-document-engine/src/scripts/common/page/dom-util')

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

describe('MCAssessment', () => {
	beforeAll(() => {
		_.shuffle = a => a
	})
	beforeEach(() => {
		jest.resetAllMocks()
	})

	// MCAssessment component tests
	test('MCAssessment component', () => {
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
		const model = parent.children.models[0]

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render
		QuestionUtil.getData.mockReturnValueOnce(['choice1', 'choice2'])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component review mode', () => {
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
		const model = parent.children.models[0]

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render
		QuestionUtil.getData.mockReturnValueOnce(['choice1', 'choice2'])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with labels', () => {
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
		const model = parent.children.models[0]
		model.modelState.correctLabels = ['mockCorrectLabels']
		model.modelState.incorrectLabels = ['mockIncorrectLabels']

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render
		QuestionUtil.getData.mockReturnValueOnce(['choice1', 'choice2'])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component not shuffled', () => {
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
		const model = parent.children.models[0]
		model.modelState.shuffle = false

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render
		QuestionUtil.getData.mockReturnValueOnce(['choice1', 'choice2'])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with sortedIds', () => {
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
		const model = parent.children.models[0]

		// mock for constructor
		// false meaning call to sort will be made
		QuestionUtil.getData.mockReturnValueOnce(false)
		// mock for render
		QuestionUtil.getData.mockReturnValueOnce(['choice2', 'choice1'])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with feedback in sortedIds', () => {
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
		const model = parent.children.models[0]

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render
		QuestionUtil.getData.mockReturnValueOnce(['choice2', 'choice1', 'choice2-feedback'])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with one response', () => {
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
		const model = parent.children.models[0]

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render
		QuestionUtil.getData.mockReturnValueOnce(['choice2', 'choice1', 'choice2-feedback'])

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with incorrect response in review mode', () => {
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
		const model = parent.children.models[0]

		// Only one label to prevent Math.random from altering the snapshot
		model.modelState.incorrectLabels = ['mockIncorrectLabels']

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore() - answer was incorrect
		QuestionUtil.getScoreForModel.mockReturnValue(0)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with incorrect response in review mode - pick-all', () => {
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
		const model = parent.children.models[0]

		// Only one label to prevent Math.random from altering the snapshot
		model.modelState.incorrectLabels = ['mockIncorrectLabels']
		model.modelState.responseType = TYPE_PICK_ALL

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore() - answer was incorrect
		QuestionUtil.getScoreForModel.mockReturnValue(0)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with correct response in review mode', () => {
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
		const model = parent.children.models[0]

		// Only one label to prevent Math.random from altering the snapshot
		model.modelState.correctLabels = ['mockCorrectLabels']

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore() - answer was correct
		QuestionUtil.getScoreForModel.mockReturnValue(100)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with correct response in review mode - multiple-correct', () => {
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
		const model = parent.children.models[0]
		// Only one label to prevent Math.random from altering the snapshot
		model.modelState.correctLabels = ['mockCorrectLabels']
		model.modelState.responseType = TYPE_MULTI_CORRECT

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)

		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore() - answer was correct
		QuestionUtil.getScoreForModel.mockReturnValue(100)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with one response in practice mode', () => {
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
		const model = parent.children.models[0]

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render() - no ids sorted
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore - unscored
		QuestionUtil.getScoreForModel.mockReturnValue(null)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="practice" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with incorrect response in practice mode', () => {
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
		const model = parent.children.models[0]
		// Only one label to prevent Math.random from altering the snapshot
		model.modelState.incorrectLabels = ['mockIncorrectLabels']

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render() - no ids sorted
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore - incorrect
		QuestionUtil.getScoreForModel.mockReturnValue(0)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="practice" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component with multiple responses', () => {
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
		const model = parent.children.models[0]

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// Mock for isAnswerSelected - choice1 and choice 2 were selected
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1', 'choice2'] })
		// Mock for feedback
		QuestionUtil.getResponse.mockReturnValue({ ids: ['choice1', 'choice2'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component question with visible explanation', () => {
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
		const model = parent.children.models[0]

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		QuestionUtil.isShowingExplanation.mockReturnValueOnce(true)

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCAssessment component question with no solution page', () => {
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
		const model = parent.children.models[0]
		model.parent.modelState.solution = null

		// mock for constructor
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	///////

	// MCAssessment function tests
	test('getQuestionModel gets the parent question', () => {
		const moduleData = {
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const score = component.instance().calculateScore()

		expect(score).toEqual(100)
	})

	test('isShowingExplanation calls QuestionUtil', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.isShowingExplanation.mockReturnValueOnce('mockShowing')

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		const showing = component.instance().isShowingExplanation()

		expect(QuestionUtil.isShowingExplanation).toHaveBeenCalledWith('mockQuestionState', parent)
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().hideExplanation()

		expect(QuestionUtil.hideExplanation).toHaveBeenCalledWith('parent', 'user')
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onFormSubmit(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(QuestionUtil.setScore).toHaveBeenCalledWith('parent', 100, 'mockContext')
		expect(QuestionUtil.checkAnswer).toHaveBeenCalledWith('parent')
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		expect(component.instance().nextFocus).not.toBeDefined()

		component.instance().onClickShowExplanation(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(component.instance().nextFocus).toBe('explanation')
		expect(QuestionUtil.showExplanation).toHaveBeenCalledWith('parent')
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClickHideExplanation(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(QuestionUtil.hideExplanation).toHaveBeenCalledWith('parent', 'user')
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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

		mount(<MCAssessment model={model} moduleData={moduleData} mode="assessment" />)

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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		// clear out mock data from the componentOnMount() call
		QuestionUtil.getData.mockReset()
		// Retrieves a list of the children - already sorted
		QuestionUtil.getData.mockReturnValueOnce([])

		component.instance().sortIds()

		expect(QuestionUtil.getData).toHaveBeenCalledWith(
			'mockQuestionState',
			expect.any(OboModel),
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		// clear out mock data from the componentOnMount() call
		QuestionUtil.getData.mockReset()
		// Retrieves a list of the children - not yet sorted
		QuestionUtil.getData.mockReturnValueOnce(null)

		component.instance().sortIds()

		expect(QuestionUtil.getData).toHaveBeenCalledWith(
			'mockQuestionState',
			expect.any(OboModel),
			'sortedIds'
		)
		expect(QuestionUtil.setData).toHaveBeenCalledWith('id', 'sortedIds', ['choice1', 'choice2'])
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		// clear out mock data from the componentOnMount() call
		QuestionUtil.getData.mockReset()
		// Retrieves a list of the children - not yet sorted
		QuestionUtil.getData.mockReturnValueOnce(null)

		component.instance().sortIds()

		expect(QuestionUtil.getData).toHaveBeenCalledWith(
			'mockQuestionState',
			expect.any(OboModel),
			'sortedIds'
		)
		expect(QuestionUtil.setData).toHaveBeenCalledWith('id', 'sortedIds', ['choice1', 'choice2'])
	})

	test('updateFeedbackLabels gets random values for labels', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const correctLabels = ['mockCorrectLabel', 'mockAnotherCorrectLabel']
		const incorrectLabels = ['mockIncorrectLabel', 'mockAnotherIncorrectLabel']

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		const object = component.instance()
		object.correctLabels = correctLabels
		object.incorrectLabels = incorrectLabels
		object.updateFeedbackLabels()

		expect(correctLabels).toContain(object.correctLabelToShow)
		expect(incorrectLabels).toContain(object.incorrectLabelToShow)
	})

	test('getRandomItem gets random values from array', () => {
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
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

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		const mockFocusOnResults = jest.fn()
		component.instance().refs = {
			answerChoices: {
				focusOnResults: mockFocusOnResults
			}
		}
		component.instance().nextFocus = 'results'
		component.instance().componentDidUpdate()
		expect(component.instance().nextFocus).not.toBeDefined()
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

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		const mockFocusOnResults = jest.fn()
		component.instance().refs = {
			answerChoices: {
				focusOnResults: mockFocusOnResults
			}
		}
		component.instance().nextFocus = 'results'
		component.instance().componentDidUpdate()
		expect(component.instance().nextFocus).toBe('results')
		expect(mockFocusOnResults).toHaveBeenCalledTimes(0)
	})

	test('componentDidUpdate calls FocusUtil.focusOnContent on the question if nextFocus="question"', () => {
		const moduleData = {
			questionState: 'mockQuestionState',
			navState: {},
			focusState: {}
		}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]

		QuestionUtil.getData.mockReturnValueOnce(false)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		FocusUtil.focusOnContent = jest.fn()

		component.instance().nextFocus = 'question'
		component.instance().componentDidUpdate()
		expect(component.instance().nextFocus).not.toBeDefined()
		expect(FocusUtil.focusOnContent).toHaveBeenCalledWith('parent', false)
	})
})
