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

jest.mock('../../../src/scripts/common/util/focus-util', () => ({
	unfocus: jest.fn()
}))

const UUID = require('../../../src/scripts/common/util/uuid')
const Dispatcher = require('../../../src/scripts/common/flux/dispatcher')
const QuestionUtil = require('../../../src/scripts/viewer/util/question-util')
const OboModel = require('../../../__mocks__/_obo-model-with-chunks').default
const APIUtil = require('../../../src/scripts/viewer/util/api-util')
const FocusUtil = require('../../../src/scripts/common/util/focus-util')
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
		// GET a copy of the call to Dispaterh.on that QuestionStore calls in it's constructor
		// before they're cleared in beforeEach...
		// the events we want to find are called when Common is loaded
		// making them sort of annoying to load cleanly. Other stores are initialized too,
		// so this is a liiiiitle fragile
		eventListeners = Dispatcher.on.mock.calls[4][0]
	})

	beforeEach(() => {
		jest.resetAllMocks()
		QuestionStore.init()
		QuestionStore.triggerChange = jest.fn()
		UUID.mockReturnValue('mock-uuid')
	})

	it('should init state with a specific structure and return it', () => {
		QuestionStore.init()

		expect(QuestionStore.getState()).toEqual({
			viewing: null,
			viewedQuestions: {},
			responses: {},
			scores: {},
			data: {}
		})
	})

	it('should set state', () => {
		QuestionStore.setState({ x: 1 })

		expect(QuestionStore.getState()).toEqual({ x: 1 })
	})

	it('registers the expected dispatch listeners', () => {
		// See where eventListeners is stored above ^
		expect(eventListeners).toMatchSnapshot()
	})

	it('question:setResponse calls triggerChange and postEvent', () => {
		__createModels()

		__mockTrigger('question:setResponse', {
			value: {
				id: 'questionId',
				response: { customResponse: 'responseValue' }
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0][0]).toBe(OboModel.models.questionId)
		expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('question:setResponse')
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual('2.1.0')
		expect(APIUtil.postEvent.mock.calls[0][3]).toEqual({
			questionId: 'questionId',
			response: { customResponse: 'responseValue' }
		})
	})

	it('question:clearResponse calls triggerChange and updates state', () => {
		QuestionStore.setState({ responses: { mockContext: { mockId: true } } })

		__mockTrigger('question:clearResponse', {
			value: {
				context: 'mockContext',
				id: 'mockId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			responses: {
				mockContext: {}
			}
		})
	})

	it("question:clearResponse calls triggerChange but doesn't change state", () => {
		QuestionStore.setState({ responses: { mockContext: { mockId: true } } })

		__mockTrigger('question:clearResponse', {
			value: {
				context: 'mockContext',
				id: 'otherMockId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			responses: {
				mockContext: { mockId: true }
			}
		})
	})

	it('question:setData calls triggerChange and updates state', () => {
		QuestionStore.setState({
			data: {}
		})

		__mockTrigger('question:setData', {
			value: {
				key: 'dataKey',
				value: 'dataValue'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			data: {
				dataKey: 'dataValue'
			}
		})
	})

	it('qquestion:clearData calls triggerChange and updates state', () => {
		QuestionStore.setState({
			data: {
				dataKey: 'dataValue'
			}
		})

		__mockTrigger('question:clearData', {
			value: {
				key: 'dataKey'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			data: {}
		})
	})

	it('question:clearData calls triggerChange even when theres no state change', () => {
		QuestionStore.setState({
			data: {
				dataKey: 'dataValue'
			}
		})

		__mockTrigger('question:clearData', {
			value: {
				key: 'someOtherKey'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			data: {
				dataKey: 'dataValue'
			}
		})
	})

	it('question:view calls triggerChange and updates state', () => {
		__createModels()

		QuestionStore.setState({
			viewing: null,
			viewedQuestions: {}
		})

		__mockTrigger('question:view', {
			value: {
				id: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			viewing: 'questionId',
			viewedQuestions: {
				questionId: true
			}
		})
	})

	it('question:view updates state.viewing with the latest question', () => {
		__createModels()

		QuestionStore.setState({
			viewing: null,
			viewedQuestions: {}
		})

		__mockTrigger('question:view', {
			value: {
				id: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			viewing: 'questionId',
			viewedQuestions: {
				questionId: true
			}
		})

		__mockTrigger('question:view', {
			value: {
				id: 'responderId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(2)
		expect(QuestionStore.getState()).toEqual({
			viewing: 'responderId',
			viewedQuestions: {
				responderId: true,
				questionId: true
			}
		})
	})

	it('question:hide marks questions as hidden, and clears viewing if it matches', () => {
		__createModels()

		QuestionStore.setState({
			viewing: 'responderId',
			viewedQuestions: {
				questionId: true,
				responderId: true
			}
		})

		__mockTrigger('question:hide', {
			value: {
				id: 'responderId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			viewing: null,
			viewedQuestions: {
				questionId: true
			}
		})
	})

	it('question:hide marks questions as hidden, and does not clear viewing if it doesnt match', () => {
		__createModels()

		QuestionStore.setState({
			viewing: 'responderId',
			viewedQuestions: {
				questionId: true,
				responderId: true
			}
		})

		__mockTrigger('question:hide', {
			value: {
				id: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			viewing: 'responderId',
			viewedQuestions: {
				responderId: true
			}
		})
	})

	it('question:showExplanation calls postEvent and sets question data', () => {
		__createModels()

		__mockTrigger('question:showExplanation', {
			value: {
				id: 'questionId'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()

		expect(QuestionUtil.setData).toHaveBeenCalledTimes(1)
		expect(QuestionUtil.setData).toHaveBeenCalledWith('questionId', 'showingExplanation', true)

		expect(QuestionUtil.clearData).not.toHaveBeenCalled()
	})

	it('question:hideExplanation calls triggerChange and updates state', () => {
		__createModels()

		__mockTrigger('question:hideExplanation', {
			value: {
				id: 'questionId',
				actor: 'testActor'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()

		expect(QuestionUtil.clearData).toHaveBeenCalledTimes(1)
		expect(QuestionUtil.clearData).toHaveBeenCalledWith('questionId', 'showingExplanation')

		expect(QuestionUtil.setData).not.toHaveBeenCalled()
	})

	it('question:scoreSet calls triggerChange', () => {
		__createModels()

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(0)

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	it('question:scoreSet initializes context if missing', () => {
		__createModels()

		expect(QuestionStore.getState().scores).not.toHaveProperty('mockContext')

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(QuestionStore.getState().scores).toHaveProperty('mockContext')
	})

	it('question:scoreSet blurs focus if correct', () => {
		__createModels()

		expect(FocusUtil.unfocus).toHaveBeenCalledTimes(0)

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(FocusUtil.unfocus).toHaveBeenCalledTimes(1)
	})

	it('question:scoreSet doesnt blur if incorrect', () => {
		__createModels()

		__mockTrigger('question:scoreSet', {
			value: {
				context: 'mockContext',
				score: 99,
				itemId: 'questionId'
			}
		})

		expect(FocusUtil.unfocus).not.toHaveBeenCalled()
	})

	it('question:scoreSet updates the state', () => {
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

	it('question:scoreSet posts an event', () => {
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

	it('question:scoreClear calls triggerChange', () => {
		__createModels()
		QuestionStore.setState({
			scores: {
				mockContext: {
					questionId: {
						itemId: 'questionId'
					}
				}
			}
		})

		__mockTrigger('question:scoreClear', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	it('question:scoreClear triggers an event', () => {
		__createModels()
		QuestionStore.setState({
			scores: {
				mockContext: {
					questionId: {
						itemId: 'questionId'
					}
				}
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(0)
		__mockTrigger('question:scoreClear', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})
		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	it('question:scoreClear posts an event', () => {
		__createModels()
		QuestionStore.setState({
			scores: {
				mockContext: {
					questionId: {
						itemId: 'questionId'
					}
				}
			}
		})

		__mockTrigger('question:scoreClear', {
			value: {
				context: 'mockContext',
				score: 100,
				itemId: 'questionId'
			}
		})

		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0]).toMatchSnapshot()
	})

	it('question:retry clears responses, hides explanations and clears scores', () => {
		__createModels()

		QuestionUtil.isShowingExplanation.mockReturnValue(true)

		QuestionStore.setState({
			viewing: 'questionId',
			viewedQuestions: { questionId: true },
			responses: { mockContext: { questionId: 'response' } }
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
		expect(QuestionUtil.hideExplanation).toHaveBeenCalledWith('questionId', 'viewerClient')

		// make sure state.responses.mockContext.questionId is wiped out
		expect(QuestionStore.getState().responses.mockContext).not.toHaveProperty('questionId')
	})
})
