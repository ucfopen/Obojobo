/* eslint no-undefined: 0 */

jest.mock('../../../src/scripts/common/util/uuid', () => jest.fn())

jest.mock('../../../src/scripts/common/flux/dispatcher', () => ({
	trigger: jest.fn(),
	on: jest.fn(),
	off: jest.fn()
}))

jest.mock('../../../src/scripts/viewer/util/api-util', () => ({
	postEvent: jest.fn()
}))

jest.mock('../../../src/scripts/viewer/util/question-util', () => ({
	setData: jest.fn(),
	clearData: jest.fn(),
	clearScore: jest.fn(),
	isShowingExplanation: jest.fn(),
	hideExplanation: jest.fn()
}))

jest.mock('../../../src/scripts/viewer/util/focus-util', () => ({
	clearFadeEffect: jest.fn()
}))

const Common = require('../../../src/scripts/common/index').default
const uuid = require('../../../src/scripts/common/util/uuid')
const Dispatcher = require('../../../src/scripts/common/flux/dispatcher')
const QuestionUtil = require('../../../src/scripts/viewer/util/question-util')
const OboModel = require('../../../__mocks__/_obo-model-with-chunks').default
const APIUtil = require('../../../src/scripts/viewer/util/api-util')
const FocusUtil = require('../../../src/scripts/viewer/util/focus-util')
const QuestionStore = require('../../../src/scripts/viewer/stores/question-store').default

let eventListeners // holds an array of Dispatcher.on.mock.calls created when QuestionStore is initiated

describe('QuestionStore', () => {
	// used to call event listener callbacks registered by Dispatcher.on
	const __mockTrigger = (eventName, payload) => {
		eventListeners[eventName](payload)
	}

	const __createModels = () => {
		OboModel.create({
			id: 'questionId',
			type: 'ObojoboDraft.Chunks.Question',
			children: [
				{
					id: 'text',
					type: 'ObojoboDraft.Chunks.Text',
					content: {
						textGroup: [
							{
								text: {
									value: 'Question Text'
								}
							}
						]
					}
				},
				{
					id: 'responderId',
					content: {
						score: 100
					},
					type: 'ObojoboDraft.Chunks.MCAssessment',
					children: [
						{
							id: 'c1-id',
							type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
							children: [
								{
									id: 'c1-a1-id',
									type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
								}
							]
						}
					]
				}
			]
		})
	}

	beforeAll(() => {
		// GET a copy of the call to Dispatcher.on that QuestionStore calls in it's constructor
		// before they're cleared in beforeEach...
		// the events we want to find are called when Common is loaded
		// making them sort of annoying to load cleanly. Other stores are initialized too,
		// so this is a liiiiitle fragile
		eventListeners = Dispatcher.on.mock.calls[3][0]
	})

	beforeEach(() => {
		jest.resetAllMocks()
		QuestionStore.init()
		QuestionStore.triggerChange = jest.fn()
		uuid.mockReturnValue('mock-uuid')
	})

	test('init builds state with a specific structure and return it', () => {
		QuestionStore.init()

		expect(QuestionStore.getState()).toEqual({
			contexts: {
				practice: {
					viewing: null,
					viewedQuestions: {},
					responses: {},
					scores: {},
					data: {}
				}
			}
		})
	})

	test('should set state', () => {
		QuestionStore.setState({ x: 1 })

		expect(QuestionStore.getState()).toEqual({ x: 1 })
	})

	test('registers the expected dispatch listeners', () => {
		// See where eventListeners is stored above ^
		expect(eventListeners).toMatchSnapshot()
	})

	test('question:setResponse calls triggerChange and postEvent', () => {
		const spy = jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce({
			get: () => 'mockDraftId'
		})

		__mockTrigger('question:setResponse', {
			value: {
				id: 'questionId',
				response: { customResponse: 'responseValue' }
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0][0]).toEqual({
			action: 'question:setResponse',
			draftId: 'mockDraftId',
			eventVersion: '2.1.0',
			payload: {
				assessmentId: undefined,
				attemptId: undefined,
				context: undefined,
				questionId: 'questionId',
				response: { customResponse: 'responseValue' },
				targetId: undefined
			},
			visitId: undefined
		})

		spy.mockRestore()
	})

	test('question:setResponse calls triggerChange and postEvent and updates state', () => {
		const spy = jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce({
			get: () => 'mockDraftId'
		})

		QuestionStore.setState({ contexts: { mockContext: { responses: {} } } })

		__mockTrigger('question:setResponse', {
			value: {
				id: 'questionId',
				response: { customResponse: 'responseValue' },
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0][0]).toEqual({
			action: 'question:setResponse',
			draftId: 'mockDraftId',
			eventVersion: '2.1.0',
			payload: {
				assessmentId: undefined,
				attemptId: undefined,
				context: 'mockContext',
				questionId: 'questionId',
				response: { customResponse: 'responseValue' },
				targetId: undefined
			},
			visitId: undefined
		})
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					responses: {
						questionId: {
							customResponse: 'responseValue'
						}
					}
				}
			}
		})

		spy.mockRestore()
	})

	test('question:setResponse creates a new context if one does not exist', () => {
		const spy = jest.spyOn(Common.models.OboModel, 'getRoot')
		Common.models.OboModel.getRoot.mockReturnValueOnce({
			get: () => 'mockDraftId'
		})

		QuestionStore.setState({ contexts: {} })

		__mockTrigger('question:setResponse', {
			value: {
				context: 'mockContext',
				id: 'questionId',
				response: { customResponse: 'responseValue' }
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					responses: {
						questionId: { customResponse: 'responseValue' }
					},
					data: {},
					scores: {},
					viewedQuestions: {},
					viewing: null
				}
			}
		})

		spy.mockRestore()
	})

	test('question:clearResponse calls triggerChange and updates state', () => {
		QuestionStore.setState({ contexts: { mockContext: { responses: { mockId: true } } } })

		__mockTrigger('question:clearResponse', {
			value: {
				context: 'mockContext',
				id: 'mockId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					responses: {}
				}
			}
		})
	})

	test('question:clearResponse does nothing with no context', () => {
		QuestionStore.setState({ contexts: { mockContext: { responses: { mockId: true } } } })

		__mockTrigger('question:clearResponse', {
			value: {
				context: 'mockContext2',
				id: 'mockId'
			}
		})

		expect(QuestionStore.triggerChange).not.toHaveBeenCalled()
		expect(QuestionStore.getState()).toEqual({
			contexts: { mockContext: { responses: { mockId: true } } }
		})
	})

	test("question:clearResponse calls triggerChange but doesn't change state", () => {
		QuestionStore.setState({ contexts: { mockContext: { responses: { mockId: true } } } })

		__mockTrigger('question:clearResponse', {
			value: {
				context: 'mockContext',
				id: 'otherMockId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: { mockContext: { responses: { mockId: true } } }
		})
	})

	test('assessment:endAttempt calls triggerChange and updates state', () => {
		QuestionStore.setState({ contexts: { mockContext: { responses: { mockId: true } } } })

		__mockTrigger('assessment:endAttempt', {
			value: {
				context: 'mockContext',
				id: 'mockId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: { mockContext: { responses: {} } }
		})
	})

	test('assessment:endAttempt does nothing with no context', () => {
		QuestionStore.setState({ contexts: { mockContext: { responses: {} } } })

		__mockTrigger('assessment:endAttempt', {
			value: {
				context: 'otherMockContext',
				id: 'mockId'
			}
		})

		expect(QuestionStore.triggerChange).not.toHaveBeenCalled()
		expect(QuestionStore.getState()).toEqual({
			contexts: { mockContext: { responses: {} } }
		})
	})

	test("assessment:endAttempt calls triggerChange but doesn't change state", () => {
		QuestionStore.setState({ contexts: { mockContext: { responses: { mockId: true } } } })

		__mockTrigger('assessment:endAttempt', {
			value: {
				context: 'mockContext',
				id: 'otherMockId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: { mockContext: { responses: { mockId: true } } }
		})
	})

	test('question:setData calls triggerChange and updates state', () => {
		QuestionStore.setState({
			contexts: {
				mockContext: {
					data: {}
				}
			}
		})

		__mockTrigger('question:setData', {
			value: {
				key: 'dataKey',
				value: 'dataValue',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					data: {
						dataKey: 'dataValue'
					}
				}
			}
		})
	})

	test('question:setData creates a new context if none exists', () => {
		QuestionStore.setState({
			contexts: {}
		})

		__mockTrigger('question:setData', {
			value: {
				key: 'dataKey',
				value: 'dataValue',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					data: {
						dataKey: 'dataValue'
					},
					responses: {},
					scores: {},
					viewedQuestions: {},
					viewing: null
				}
			}
		})
	})

	test('question:clearData calls triggerChange and updates state', () => {
		QuestionStore.setState({
			contexts: {
				mockContext: {
					data: {
						dataKey: 'dataValue',
						dataKey2: 'dataValue2'
					}
				}
			}
		})

		__mockTrigger('question:clearData', {
			value: {
				key: 'dataKey',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					data: {
						dataKey2: 'dataValue2'
					}
				}
			}
		})
	})

	test('question:clearData calls triggerChange even when theres no state change', () => {
		QuestionStore.setState({
			contexts: {
				mockContext: {
					data: {
						dataKey: 'dataValue'
					}
				}
			}
		})

		__mockTrigger('question:clearData', {
			value: {
				key: 'someOtherKey',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					data: {
						dataKey: 'dataValue'
					}
				}
			}
		})
	})

	test('question:clearData does nothing when the context does not exist', () => {
		QuestionStore.setState({
			contexts: {
				mockContext: {
					data: {
						dataKey: 'dataValue'
					}
				}
			}
		})

		__mockTrigger('question:clearData', {
			value: {
				key: 'dataKey',
				context: 'someOtherContext'
			}
		})

		expect(QuestionStore.triggerChange).not.toHaveBeenCalled()
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					data: {
						dataKey: 'dataValue'
					}
				}
			}
		})
	})

	test('question:view calls triggerChange and updates state', () => {
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {}
				}
			}
		})

		__mockTrigger('question:view', {
			value: {
				id: 'questionId',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					viewing: 'questionId',
					viewedQuestions: {
						questionId: true
					}
				}
			}
		})
	})

	test('question:view creates a new context if none exists', () => {
		__createModels()

		QuestionStore.setState({
			contexts: {}
		})

		__mockTrigger('question:view', {
			value: {
				id: 'questionId',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					viewing: 'questionId',
					viewedQuestions: {
						questionId: true
					},
					data: {},
					responses: {},
					scores: {}
				}
			}
		})
	})

	test('question:view updates state.viewing with the latest question', () => {
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {}
				}
			}
		})

		__mockTrigger('question:view', {
			value: {
				id: 'questionId',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					viewing: 'questionId',
					viewedQuestions: {
						questionId: true
					}
				}
			}
		})

		__mockTrigger('question:view', {
			value: {
				id: 'responderId',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(2)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					viewing: 'responderId',
					viewedQuestions: {
						responderId: true,
						questionId: true
					}
				}
			}
		})
	})

	test('question:view creates a new context if none exists', () => {
		__createModels()

		QuestionStore.setState({
			contexts: {}
		})

		__mockTrigger('question:view', {
			value: {
				id: 'questionId',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					viewing: 'questionId',
					viewedQuestions: {
						questionId: true
					},
					data: {},
					responses: {},
					scores: {}
				}
			}
		})
	})

	test('question:checkAnswer calls APIUtil.postEvent', () => {
		const spy = jest.spyOn(Common.models.OboModel.prototype, 'getRoot')
		Common.models.OboModel.prototype.getRoot.mockReturnValueOnce({
			get: () => 'mockDraftId'
		})
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					scores: {
						questionId: { id: 'mockScoreId', score: 'mockScore' }
					},
					responses: {
						questionId: 'mockResponse'
					}
				}
			}
		})

		__mockTrigger('question:checkAnswer', {
			value: {
				id: 'questionId',
				context: 'mockContext'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent).toHaveBeenCalledWith({
			action: 'question:checkAnswer',
			draftId: 'mockDraftId',
			eventVersion: '1.1.0',
			payload: {
				questionId: 'questionId',
				context: 'mockContext',
				response: 'mockResponse',
				scoreId: 'mockScoreId',
				score: 'mockScore'
			},
			visitId: undefined
		})

		spy.mockRestore()
	})

	test('question:checkAnswer does nothing if context does not exist', () => {
		const spy = jest.spyOn(Common.models.OboModel.prototype, 'getRoot')
		Common.models.OboModel.prototype.getRoot.mockReturnValueOnce({
			get: () => 'mockDraftId'
		})
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					scores: {
						questionId: { id: 'mockScoreId', score: 'mockScore' }
					},
					responses: {
						questionId: 'mockResponse'
					}
				}
			}
		})

		__mockTrigger('question:checkAnswer', {
			value: {
				id: 'questionId',
				context: 'someOtherContext'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(0)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					scores: {
						questionId: { id: 'mockScoreId', score: 'mockScore' }
					},
					responses: {
						questionId: 'mockResponse'
					}
				}
			}
		})

		spy.mockRestore()
	})

	test('question:submitResponse calls APIUtil.postEvent', () => {
		const spy = jest.spyOn(Common.models.OboModel.prototype, 'getRoot')
		Common.models.OboModel.prototype.getRoot.mockReturnValueOnce({
			get: () => 'mockDraftId'
		})
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					scores: {
						questionId: { id: 'mockScoreId', score: 'mockScore' }
					},
					responses: {
						questionId: 'mockResponse'
					}
				}
			}
		})

		__mockTrigger('question:submitResponse', {
			value: {
				id: 'questionId',
				context: 'mockContext'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent).toHaveBeenCalledWith({
			action: 'question:submitResponse',
			draftId: 'mockDraftId',
			eventVersion: '1.0.0',
			payload: {
				questionId: 'questionId',
				context: 'mockContext',
				response: 'mockResponse'
			},
			visitId: undefined
		})

		spy.mockRestore()
	})

	test('question:submitResponse does nothing if context does not exist', () => {
		const spy = jest.spyOn(Common.models.OboModel.prototype, 'getRoot')
		Common.models.OboModel.prototype.getRoot.mockReturnValueOnce({
			get: () => 'mockDraftId'
		})
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					scores: {
						questionId: { id: 'mockScoreId', score: 'mockScore' }
					},
					responses: {
						questionId: 'mockResponse'
					}
				}
			}
		})

		__mockTrigger('question:submitResponse', {
			value: {
				id: 'questionId',
				context: 'someOtherContext'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(0)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					scores: {
						questionId: { id: 'mockScoreId', score: 'mockScore' }
					},
					responses: {
						questionId: 'mockResponse'
					}
				}
			}
		})

		spy.mockRestore()
	})

	test('question:hide marks questions as hidden, and clears viewing if it matches', () => {
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: 'responderId',
					viewedQuestions: {
						questionId: true,
						responderId: true
					}
				}
			}
		})

		__mockTrigger('question:hide', {
			value: {
				id: 'responderId',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {
						questionId: true
					}
				}
			}
		})
	})

	test('question:hide marks questions as hidden, and does not clear viewing if it doesnt match', () => {
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: 'responderId',
					viewedQuestions: {
						questionId: true,
						responderId: true
					}
				}
			}
		})

		__mockTrigger('question:hide', {
			value: {
				id: 'questionId',
				context: 'mockContext'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			contexts: {
				mockContext: {
					viewing: 'responderId',
					viewedQuestions: {
						responderId: true
					}
				}
			}
		})
	})

	test('question:hide does nothing if given a bad context', () => {
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: 'responderId',
					viewedQuestions: {
						questionId: true,
						responderId: true
					}
				}
			}
		})

		__mockTrigger('question:hide', {
			value: {
				id: 'questionId',
				context: 'someOtherContext'
			}
		})

		expect(QuestionStore.triggerChange).not.toHaveBeenCalled()
		expect(APIUtil.postEvent).not.toHaveBeenCalled()
	})

	test('question:showExplanation calls postEvent and sets question data', () => {
		__createModels()

		__mockTrigger('question:showExplanation', {
			value: {
				id: 'questionId',
				context: 'mockContext'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()

		expect(QuestionUtil.setData).toHaveBeenCalledTimes(1)
		expect(QuestionUtil.setData).toHaveBeenCalledWith(
			'questionId',
			'mockContext',
			'showingExplanation',
			true
		)

		expect(QuestionUtil.clearData).not.toHaveBeenCalled()
	})

	test('question:hideExplanation calls triggerChange and updates state', () => {
		__createModels()

		__mockTrigger('question:hideExplanation', {
			value: {
				id: 'questionId',
				actor: 'testActor',
				context: 'mockContext'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()

		expect(QuestionUtil.clearData).toHaveBeenCalledTimes(1)
		expect(QuestionUtil.clearData).toHaveBeenCalledWith(
			'questionId',
			'mockContext',
			'showingExplanation'
		)

		expect(QuestionUtil.setData).not.toHaveBeenCalled()
	})

	test('question:scoreSet calls triggerChange', () => {
		__createModels()

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(0)
		QuestionStore.setState({ contexts: { mockContext: { scores: {} } } })

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('question:scoreSet initializes context if missing', () => {
		__createModels()

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(0)
		QuestionStore.setState({ contexts: {} })

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(QuestionStore.getState().contexts.mockContext.scores).toEqual({
			questionId: {
				id: 'mock-uuid',
				score: 100,
				itemId: 'questionId'
			}
		})
	})

	test('question:scoreSet blurs focus if correct (or score is "no-score")', () => {
		__createModels()

		expect(FocusUtil.clearFadeEffect).toHaveBeenCalledTimes(0)

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(FocusUtil.clearFadeEffect).toHaveBeenCalledTimes(1)

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 'no-score',
				itemId: 'questionId'
			}
		})

		expect(FocusUtil.clearFadeEffect).toHaveBeenCalledTimes(2)
	})

	test('question:scoreSet doesnt blur if incorrect', () => {
		__createModels()

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 99,
				itemId: 'questionId'
			}
		})

		expect(FocusUtil.clearFadeEffect).not.toHaveBeenCalled()
	})

	test('question:scoreSet updates the state', () => {
		__createModels()

		expect(QuestionStore.getState()).toMatchSnapshot()

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(QuestionStore.getState()).toMatchSnapshot()
	})

	test('question:scoreSet posts an event', () => {
		__createModels()

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('question:scoreClear calls triggerChange', () => {
		__createModels()
		QuestionStore.setState({
			contexts: {
				mockContext: {
					scores: {
						questionId: {
							itemId: 'questionId',
							score: 100
						}
					}
				}
			}
		})

		__mockTrigger('question:scoreClear', {
			value: {
				context: 'mockContext',
				itemId: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('question:scoreClear triggers an event', () => {
		__createModels()
		QuestionStore.setState({
			contexts: {
				mockContext: {
					scores: {
						questionId: {
							itemId: 'questionId',
							score: 100
						}
					}
				}
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(0)
		__mockTrigger('question:scoreClear', {
			value: {
				context: 'mockContext',
				itemId: 'questionId'
			}
		})
		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	test('question:scoreClear posts an event', () => {
		__createModels()
		QuestionStore.setState({
			contexts: {
				mockContext: {
					scores: {
						questionId: {
							itemId: 'questionId',
							score: 100
						}
					}
				}
			}
		})

		__mockTrigger('question:scoreClear', {
			value: {
				context: 'mockContext',
				itemId: 'questionId'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	test('question:scoreClear does nothing if no context exists', () => {
		__createModels()
		QuestionStore.setState({
			contexts: {
				mockContext: {
					scores: {
						questionId: {
							itemId: 'questionId',
							score: 100
						}
					}
				}
			}
		})

		__mockTrigger('question:scoreClear', {
			value: {
				context: 'someOtherContext',
				itemId: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).not.toHaveBeenCalled()
		expect(APIUtil.postEvent).not.toHaveBeenCalled()
	})

	test('question:scoreClear does not post event if a no-score score is being cleared', () => {
		__createModels()
		QuestionStore.setState({
			contexts: {
				mockContext: {
					scores: {
						questionId: {
							itemId: 'questionId',
							score: 'no-score'
						}
					}
				}
			}
		})

		__mockTrigger('question:scoreClear', {
			value: {
				context: 'mockContext',
				itemId: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalled()
		expect(APIUtil.postEvent).not.toHaveBeenCalled()
	})

	test('question:retry clears responses, hides explanations and clears scores', () => {
		__createModels()

		QuestionUtil.isShowingExplanation.mockReturnValue(true)

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: 'questionId',
					viewedQuestions: { questionId: true },
					responses: { questionId: 'response' }
				}
			}
		})

		__mockTrigger('question:retry', {
			value: {
				context: 'mockContext',
				id: 'questionId'
			}
		})

		// make sure clear score was called
		expect(QuestionUtil.clearScore).toHaveBeenCalledWith('questionId', 'mockContext')

		// make sure hideExplanation was called
		expect(QuestionUtil.hideExplanation).toHaveBeenCalledWith(
			'questionId',
			'mockContext',
			'viewerClient'
		)

		// make sure state.responses.mockContext.questionId is wiped out
		expect(QuestionStore.getState().contexts.mockContext.responses).not.toHaveProperty('questionId')
	})

	test('question:retry clears scores with no explanation', () => {
		__createModels()

		QuestionUtil.isShowingExplanation.mockReturnValue(false)

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: 'questionId',
					viewedQuestions: { questionId: true },
					responses: { questionId: 'response' }
				}
			}
		})

		__mockTrigger('question:retry', {
			value: {
				context: 'mockContext',
				id: 'questionId'
			}
		})

		// make sure clear score was called
		expect(QuestionUtil.clearScore).toHaveBeenCalledWith('questionId', 'mockContext')

		// make sure hideExplanation was not called
		expect(QuestionUtil.hideExplanation).not.toHaveBeenCalled()

		// make sure state.responses.mockContext.questionId is wiped out
		expect(QuestionStore.getState().contexts.mockContext.responses).not.toHaveProperty('questionId')
	})

	test('question:retry does nothing if no responses were cleared', () => {
		__createModels()

		QuestionStore.setState({
			contexts: {
				mockContext: {
					viewing: 'questionId',
					viewedQuestions: { questionId: true },
					responses: { questionId: 'response' }
				}
			}
		})

		__mockTrigger('question:retry', {
			value: {
				context: 'someOtherContext',
				id: 'questionId'
			}
		})

		expect(APIUtil.postEvent).not.toHaveBeenCalled()
		expect(QuestionUtil.clearScore).not.toHaveBeenCalled()
		expect(QuestionUtil.hideExplanation).not.toHaveBeenCalled()
		expect(QuestionUtil.isShowingExplanation).not.toHaveBeenCalled()
	})

	test('updateStateByContext adds items to a context object', () => {
		QuestionStore.setState({
			contexts: {}
		})

		QuestionStore.updateStateByContext({ a: 1, b: 2 }, 'mockContext')

		expect(
			QuestionStore.getState({
				contexts: {
					mockContext: {
						a: 1,
						b: 2
					}
				}
			})
		)

		QuestionStore.updateStateByContext({ b: 3, c: 4 }, 'mockContext')

		expect(
			QuestionStore.getState({
				contexts: {
					mockContext: {
						a: 1,
						b: 3,
						c: 4
					}
				}
			})
		)
	})
})
