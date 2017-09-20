import { Store } from '../../../src/scripts/common/store'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'
import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import APIUtil from '../../../src/scripts/viewer/util/api-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../src/scripts/viewer/util/api-util', () => {
	return {
		postEvent: jest.fn()
	}
})

describe('QuestionStore', () => {
	let __createModels = () => {
		return OboModel.create({
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

	beforeEach(done => {
		jest.resetAllMocks()

		QuestionStore.init()
		QuestionStore.triggerChange = jest.fn()

		// Need to make sure all the Obo components are loaded
		Store.getItems(items => {
			done()
		})
	})

	it('should init state with a specific structure and return it', () => {
		QuestionStore.init()

		expect(QuestionStore.getState()).toEqual({
			viewing: null,
			viewedQuestions: {},
			responses: {},
			data: {}
		})
	})

	it('should set state', () => {
		QuestionStore.setState({ x: 1 })

		expect(QuestionStore.getState()).toEqual({ x: 1 })
	})

	it.only('should record responses, trigger a change and post an event', () => {
		__createModels()

		Dispatcher.trigger('question:recordResponse', {
			value: {
				id: 'responderId',
				response: { customResponse: 'responseValue' }
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent.mock.calls[0][0]).toBe(OboModel.models.questionId)
		expect(APIUtil.postEvent.mock.calls[0][1]).toEqual('question:recordResponse')
		expect(APIUtil.postEvent.mock.calls[0][2]).toEqual({
			questionId: 'questionId',
			responderId: 'responderId',
			response: { customResponse: 'responseValue' }
		})
	})

	it('should reset a reponse and trigger a change for a response that has been set', () => {
		QuestionStore.setState({ responses: { example: 'response' } })

		Dispatcher.trigger('question:resetResponse', {
			value: {
				id: 'example'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			responses: {}
		})
	})

	it("shouldn't reset a reponse but still trigger a change for a response that hasn't been set", () => {
		QuestionStore.setState({ responses: { example: 'response' } })

		Dispatcher.trigger('question:resetResponse', {
			value: {
				id: 'someOtherId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(1)
		expect(QuestionStore.getState()).toEqual({
			responses: {
				example: 'response'
			}
		})
	})

	it('should set data and trigger a change', () => {
		QuestionStore.setState({
			data: {}
		})

		Dispatcher.trigger('question:setData', {
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

	it('should clear data it has and trigger a change', () => {
		QuestionStore.setState({
			data: {}
		})

		Dispatcher.trigger('question:setData', {
			value: {
				key: 'dataKey',
				value: 'dataValue'
			}
		})
		Dispatcher.trigger('question:clearData', {
			value: {
				key: 'dataKey'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(2)
		expect(QuestionStore.getState()).toEqual({
			data: {}
		})
	})

	it("shouldn't clear data it doesn't have but still trigger a change", () => {
		QuestionStore.setState({
			data: {}
		})

		Dispatcher.trigger('question:setData', {
			value: {
				key: 'dataKey',
				value: 'dataValue'
			}
		})
		Dispatcher.trigger('question:clearData', {
			value: {
				key: 'someOtherKey'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(2)
		expect(QuestionStore.getState()).toEqual({
			data: {
				dataKey: 'dataValue'
			}
		})
	})

	it('marks questions as viewed, keeps track of the last viewed question and triggers a change', () => {
		__createModels()

		QuestionStore.setState({
			viewing: null,
			viewedQuestions: {}
		})

		// typically a question and it's child wouldn't
		// be "viewed" but we simply use both the
		// "models" represented by questionId and
		// responderId as two different models here.
		// their relationship in this test is not
		// important and has no impact on test results
		Dispatcher.trigger('question:view', {
			value: {
				id: 'questionId'
			}
		})
		Dispatcher.trigger('question:view', {
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

	it('marks questions as hidden, keeps track of the last viewed question and triggers a change', () => {
		__createModels()

		QuestionStore.setState({
			viewing: null,
			viewedQuestions: {}
		})

		Dispatcher.trigger('question:view', {
			value: {
				id: 'questionId'
			}
		})
		Dispatcher.trigger('question:view', {
			value: {
				id: 'responderId'
			}
		})

		expect(QuestionStore.getState()).toEqual({
			viewing: 'responderId',
			viewedQuestions: {
				questionId: true,
				responderId: true
			}
		})

		Dispatcher.trigger('question:hide', {
			value: {
				id: 'responderId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(3)
		expect(QuestionStore.getState()).toEqual({
			viewing: null,
			viewedQuestions: {
				questionId: true
			}
		})
	})

	it('last viewed question is remembered if another question is hidden', () => {
		__createModels()

		QuestionStore.setState({
			viewing: null,
			viewedQuestions: {}
		})

		Dispatcher.trigger('question:view', {
			value: {
				id: 'questionId'
			}
		})
		Dispatcher.trigger('question:view', {
			value: {
				id: 'responderId'
			}
		})

		Dispatcher.trigger('question:hide', {
			value: {
				id: 'questionId'
			}
		})

		expect(QuestionStore.triggerChange).toHaveBeenCalledTimes(3)
		expect(QuestionStore.getState()).toEqual({
			viewing: 'responderId',
			viewedQuestions: {
				responderId: true
			}
		})
	})
})
