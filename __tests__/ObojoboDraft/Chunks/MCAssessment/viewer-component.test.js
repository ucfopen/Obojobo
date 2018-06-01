import React from 'react'
import renderer from 'react-test-renderer'
import MCAssessment from '../../../../ObojoboDraft/Chunks/MCAssessment/viewer-component'

import { shallow, mount, unmount } from 'enzyme'

jest.mock('../../../../src/scripts/viewer/util/question-util')
jest.mock('../../../../src/scripts/common/flux/dispatcher')
jest.mock('../../../../src/scripts/common/page/dom-util')
import QuestionUtil from '../../../../src/scripts/viewer/util/question-util'
import Dispatcher from '../../../../src/scripts/common/flux/dispatcher'
import DOMUtil from '../../../../src/scripts/common/page/dom-util'

jest.mock('../../../../src/scripts/common/stores/focus-store', () => ({}))
jest.mock('../../../../src/scripts/viewer/stores/question-store', () => ({}))
jest.mock('../../../../src/scripts/viewer/stores/nav-store', () => ({}))
jest.mock('../../../../src/scripts/viewer/stores/assessment-store', () => ({}))
jest.mock('../../../../src/scripts/viewer/util/api-util', () => ({}))

import FocusStore from '../../../../src/scripts/common/stores/focus-store'
import QuestionStore from '../../../../src/scripts/viewer/stores/question-store'
import NavStore from '../../../../src/scripts/viewer/stores/nav-store'
import AssessmentStore from '../../../../src/scripts/viewer/stores/assessment-store'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import APIUtil from '../../../../src/scripts/viewer/util/api-util'

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const MCCHOICE_NODE_TYPE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const TYPE_PICK_ONE = 'pick-one'
const TYPE_MULTI_CORRECT = 'pick-one-multiple-correct'
const TYPE_PICK_ALL = 'pick-all'
const ACTION_CHECK_ANSWER = 'question:checkAnswer'

describe('MCAssessment', () => {
	beforeAll(() => {
		_.shuffle = a => a
		Math.random = jest.fn().mockReturnValue(0)
	})
	beforeEach(() => {
		jest.resetAllMocks()
	})

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
							}
						]
					}
				]
			}
		]
	})

	let model = OboModel.models.id

	// MCAssessment component tests
	test.skip('MCAssessment component', () => {
		let moduleData = {
			questionState: 'mockQuestionState'
		}

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component review mode', () => {
		let moduleData = {
			questionState: 'mockQuestionState'
		}

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with labels', () => {
		let moduleData = {
			questionState: 'mockQuestionState'
		}
		model.modelState.correctLabels = 'mockCorrectLabels'
		model.modelState.incorrectLabels = 'mockIncorrectLabels'

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component not shuffled', () => {
		let moduleData = {
			questionState: 'mockQuestionState'
		}
		model.modelState.shuffle = false

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with sortedIds', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with inverse sortedIds', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce(['choice2', 'choice1'])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with feedback in sortedIds', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce(['choice2', 'choice1', 'choice2-feedback'])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with one response', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })
		// Mock for feedback
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with incorrect response in review mode', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore() - answer was incorrect
		QuestionUtil.getScoreForModel.mockReturnValueOnce(0)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })
		// Mock for feedback
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with incorrect response in review mode - pick-all', () => {
		let moduleData = {
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

		model.modelState.responseType = TYPE_PICK_ALL

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore() - answer was incorrect
		QuestionUtil.getScoreForModel.mockReturnValueOnce(0)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })
		// Mock for feedback
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		// Reset model to pick-one
		model.modelState.responseType = TYPE_PICK_ONE
	})

	test.skip('MCAssessment component with correct response in review mode', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore() - answer was correct
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })
		// Mock for feedback
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with correct response in review mode - multiple-correct', () => {
		let moduleData = {
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

		model.modelState.responseType = TYPE_MULTI_CORRECT

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore() - answer was correct
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })
		// Mock for feedback
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="review" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test.skip('MCAssessment component with one response in practice mode', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render() - no ids sorted
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore - unscored
		QuestionUtil.getScoreForModel.mockReturnValueOnce(null)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })
		// Mock for feedback
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="practice" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with incorrect response in practice mode', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render() - no ids sorted
		QuestionUtil.getData.mockReturnValueOnce([])

		// mock for getScore - incorrect
		QuestionUtil.getScoreForModel.mockReturnValueOnce(0)

		// Mock for isAnswerSelected - choice1 was selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })
		// Mock for feedback
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="practice" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component with multiple responses', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		// Mock for isAnswerSelected - choice1 and choice 2 were selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1', 'choice2'] })
		// Mock for feedback
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1', 'choice2'] })

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component question with visible explanation', () => {
		let moduleData = {
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

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		QuestionUtil.isShowingExplanation.mockReturnValueOnce(true)

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.skip('MCAssessment component question with no solution page', () => {
		let moduleData = {
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

		model.parent.modelState.solution = null

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for render()
		QuestionUtil.getData.mockReturnValueOnce([])

		const component = renderer.create(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	// MCAssessment function tests
	test('getQuestionModel gets the parent question', () => {
		let moduleData = {}
		let model = {
			modelState: {},
			getParentOfType: jest.fn().mockReturnValueOnce('mockParent')
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let parent = component.instance().getQuestionModel()

		expect(model.getParentOfType).toHaveBeenCalledWith(QUESTION_NODE_TYPE)
		expect(parent).toEqual('mockParent')
	})

	test('getResponseData builds the expected array with no responses', () => {
		let moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			}
		}
		let correctSet = new Set()
		correctSet.add('choice1')
		let responseSet = new Set()

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// no MCChoice items were selected
		QuestionUtil.getResponse.mockReturnValueOnce(null)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let data = component.instance().getResponseData()

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
		let moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			}
		}
		let correctSet = new Set()
		correctSet.add('choice1')
		let responseSet = new Set()
		responseSet.add('choice2')

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// choice2 was selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let data = component.instance().getResponseData()

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
		let moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			}
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// choice2 was selected - not correct
		// choice1 is the correct answer
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let score = component.instance().calculateScore()

		expect(score).toEqual(0)
	})

	// correct pick-one-multiple-correct functions the same way as pick-one
	test('calculateScore returns 100 with correct - pick-one', () => {
		let moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			}
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// choice1 was selected - correct
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let score = component.instance().calculateScore()

		expect(score).toEqual(100)
	})

	test('calculateScore returns 0 with too many - pick-all', () => {
		let moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			}
		}

		model.modelState.responseType = TYPE_PICK_ALL

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// choice1 and choice2 were selected - wrong answer
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1', 'choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let score = component.instance().calculateScore()

		expect(score).toEqual(0)

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test('calculateScore returns 0 with wrong choices - pick-all', () => {
		let moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			}
		}

		model.modelState.responseType = TYPE_PICK_ALL

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// choice2 was selected - incorrect
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let score = component.instance().calculateScore()

		expect(score).toEqual(0)

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test('calculateScore returns 100 with correct choices - pick-all', () => {
		let moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			}
		}

		model.modelState.responseType = TYPE_PICK_ALL

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// choice1 was selected - correct
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let score = component.instance().calculateScore()

		expect(score).toEqual(100)

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test('isShowingExplanation calls QuestionUtil', () => {
		let moduleData = {
			questionState: 'mockQuestionState'
		}
		let model = {
			modelState: {},
			getParentOfType: jest.fn().mockReturnValueOnce('mockParent')
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		QuestionUtil.isShowingExplanation.mockReturnValueOnce('mockShowing')

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		let showing = component.instance().isShowingExplanation()

		expect(QuestionUtil.isShowingExplanation).toHaveBeenCalledWith(
			'mockQuestionState',
			'mockParent'
		)
		expect(showing).toEqual('mockShowing')
	})

	test('retry calls QuestionUtil', () => {
		let moduleData = {
			navState: {
				context: 'mockContext'
			}
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().retry()

		expect(QuestionUtil.retryQuestion).toHaveBeenCalledWith('parent', 'mockContext')
	})

	test('hideExplanation calls QuestionUtil', () => {
		let moduleData = {
			navState: {
				context: 'mockContext'
			}
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().hideExplanation()

		expect(QuestionUtil.hideExplanation).toHaveBeenCalledWith('parent', 'user')
	})

	test('onClickReset modifys event and calls retry', () => {
		let moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		let event = {
			preventDefault: jest.fn()
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClickReset(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(QuestionUtil.retryQuestion).toHaveBeenCalledWith('parent', 'mockContext')
	})

	test('onClickSubmit modifys event and calls QuestionUtil', () => {
		let moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		let event = {
			preventDefault: jest.fn()
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)
		// mock for getReponses() (called by calculateScore)
		// choice1 is correct, so score will be 100
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClickSubmit(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(QuestionUtil.setScore).toHaveBeenCalledWith('parent', 100, 'mockContext')
		expect(QuestionUtil.checkAnswer).toHaveBeenCalledWith('parent')
	})

	test('onClickShowExplanation modifys event and calls QuestionUtil', () => {
		let moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		let event = {
			preventDefault: jest.fn()
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClickShowExplanation(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(QuestionUtil.showExplanation).toHaveBeenCalledWith('parent')
	})

	test('onClickHideExplanation modifys event and calls QuestionUtil', () => {
		let moduleData = {
			navState: {
				context: 'mockContext'
			}
		}
		let event = {
			preventDefault: jest.fn()
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClickHideExplanation(event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(QuestionUtil.hideExplanation).toHaveBeenCalledWith('parent', 'user')
	})

	test('onClick terminates if clicked item was not an MCChoice', () => {
		let moduleData = {}
		let event = {
			target: 'mockTarget'
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// DOMUtil tries to find the clicked target
		DOMUtil.findParentWithAttr.mockReturnValueOnce(null)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClick(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
	})

	test('onClick terminates if clicked item does not have an id', () => {
		let moduleData = {}
		let event = {
			target: 'mockTarget'
		}
		let mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce(null)
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// DOMUtil tries to find the clicked target
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClick(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
		expect(mcChoiceEl.getAttribute).toHaveBeenCalledWith('data-id')
	})

	test('onClick retries question when already scored', () => {
		let moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			}
		}
		let event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		let mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - scored
		QuestionUtil.getScoreForModel.mockReturnValueOnce(100)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClick(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
		expect(mcChoiceEl.getAttribute).toHaveBeenCalledWith('data-id')
		expect(QuestionUtil.retryQuestion).toHaveBeenCalled()
		expect(QuestionUtil.setResponse).toHaveBeenCalled()
	})

	// Pick-one-multiple-correct functions the same way as pick-one
	test('onClick adds clicked id to response - pick-one', () => {
		let moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			}
		}
		let event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		let mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - not scored
		QuestionUtil.getScoreForModel.mockReturnValueOnce(null)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClick(event)

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
	})

	test('onClick adds clicked id to response when none are selected - pick-all', () => {
		let moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			}
		}
		let event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		let mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		model.modelState.responseType = TYPE_PICK_ALL

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - not scored
		QuestionUtil.getScoreForModel.mockReturnValueOnce(null)

		// QuestionUtil gets the currently selected responses
		// choice1 has not been previously selected
		QuestionUtil.getResponse.mockReturnValueOnce(null)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClick(event)

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

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test('onClick adds clicked id to response when others are selected - pick-all', () => {
		let moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			}
		}
		let event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		let mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		model.modelState.responseType = TYPE_PICK_ALL

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - not scored
		QuestionUtil.getScoreForModel.mockReturnValueOnce(null)

		// QuestionUtil gets the currently selected responses
		// choice2 is currently selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClick(event)

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

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test('onClick removes clicked id from response when it is selected - pick-all', () => {
		let moduleData = {
			navState: {
				context: 'mockContext:mockSecondContext:mockThirdContext'
			}
		}
		let event = {
			target: 'mockTarget'
		}
		// Simulate click of choice1
		let mcChoiceEl = {
			getAttribute: jest.fn().mockReturnValueOnce('choice1')
		}

		model.modelState.responseType = TYPE_PICK_ALL

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// DOMUtil tries to find the clicked target - choice1
		DOMUtil.findParentWithAttr.mockReturnValueOnce(mcChoiceEl)

		// mock for getScore() - not scored
		QuestionUtil.getScoreForModel.mockReturnValueOnce(null)

		// QuestionUtil gets the currently selected responses
		// choice1 and choice2 are currently selected
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice1', 'choice2'] })

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClick(event)

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

		model.modelState.responseType = TYPE_PICK_ONE
	})

	test('getScore calls QuestionUtil', () => {
		let moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			}
		}

		let model = {
			modelState: {},
			getParentOfType: jest.fn().mockReturnValueOnce('mockParent')
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().getScore()

		expect(QuestionUtil.getScoreForModel).toHaveBeenCalledWith(
			'mockQuestionState',
			'mockParent',
			'mockContext'
		)
	})

	test('componentWillRecieveProps calls sortIds', () => {
		let moduleData = {
			questionState: 'mockQuestionState'
		}

		// short circuits sortIds
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		// calls componentWillRecieveProps()
		component.setProps({})

		expect(QuestionUtil.getData).toHaveBeenCalled()
	})

	test('componentDidMount sets up the Dispatcher', () => {
		let moduleData = {
			questionState: 'mockQuestionState'
		}

		// short circuits sortIds
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		expect(QuestionUtil.getData).toHaveBeenCalled()
		expect(Dispatcher.on).toHaveBeenCalledWith(ACTION_CHECK_ANSWER, expect.any(Function))
	})

	test('componentWillUnmount removes the Dispatcher', () => {
		let moduleData = {
			questionState: 'mockQuestionState'
		}

		// short circuits sortIds
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		component.unmount()

		expect(Dispatcher.off).toHaveBeenCalledWith(ACTION_CHECK_ANSWER, expect.any(Function))
	})

	test('onCheckAnswer does nothing if this is not the correct question', () => {
		let moduleData = {
			navState: {
				context: 'mockContext'
			}
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

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
		let moduleData = {
			navState: {
				context: 'mockContext'
			}
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// mock for calculateScore - score is 0
		QuestionUtil.getResponse.mockReturnValueOnce({ ids: ['choice2'] })

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

	test('componentWillMount calls sortIds', () => {
		let moduleData = {
			questionState: 'mockQuestionState'
		}

		// short circuits sortIds
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = mount(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		expect(QuestionUtil.getData).toHaveBeenCalled()
	})

	test.skip('sortIds calls QuestionUtil, and does nothing if ids are sorted', () => {
		let moduleData = {
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			}
		}
		let model = {
			moduleState: {}
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)

		// clear out mock data from the componentOnMount() call
		questionUtil.getData.reset()
		// Retrieves a list of the sorted ids
		QuestionUtil.getData.mockReturnValueOnce([])

		component.instance().sortIds()

		expect(QuestionUtil.getData).toHaveBeenCalledWith('mockQuestionState', model, 'sortedIds')
	})
})
