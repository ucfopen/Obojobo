import QuestionUtil from '../../../src/scripts/viewer/util/question-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})

describe('QuestionUtil', () => {
	let testModel = {
		get: () => 'testId'
	}

	beforeEach(() => {
		jest.resetAllMocks()

		QuestionStore.init()
	})

	it('should trigger question:recordResponse', () => {
		QuestionUtil.recordResponse('testId', { response: 'A Response' })

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:recordResponse', {
			value: {
				id: 'testId',
				response: { response: 'A Response' }
			}
		})
	})

	it('should trigger question:resetResponse', () => {
		QuestionUtil.resetResponse('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:resetResponse', {
			value: {
				id: 'testId'
			}
		})
	})

	it('should trigger question:setData', () => {
		QuestionUtil.setData('testId', 'theKey', 'theValue')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:setData', {
			value: {
				key: 'testId:theKey',
				value: 'theValue'
			}
		})
	})

	it('should trigger question:clearData', () => {
		QuestionUtil.clearData('testId', 'theKey')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:clearData', {
			value: {
				key: 'testId:theKey'
			}
		})
	})

	it('should trigger question:view', () => {
		QuestionUtil.viewQuestion('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:view', {
			value: {
				id: 'testId'
			}
		})
	})

	it('should trigger question:hide', () => {
		QuestionUtil.hideQuestion('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:hide', {
			value: {
				id: 'testId'
			}
		})
	})

	it('should return view states', () => {
		let active = QuestionUtil.getViewState(
			{
				viewing: 'testId',
				viewedQuestions: {
					testId: true
				}
			},
			testModel
		)
		let viewed = QuestionUtil.getViewState(
			{
				viewing: 'anotherId',
				viewedQuestions: {
					testId: true,
					anotherId: true
				}
			},
			testModel
		)
		let hidden = QuestionUtil.getViewState(
			{
				viewing: 'notTestId',
				viewedQuestions: {
					notTestId: true
				}
			},
			testModel
		)

		expect(active).toEqual('active')
		expect(viewed).toEqual('viewed')
		expect(hidden).toEqual('hidden')
	})

	it('should get a response from state', () => {
		let res = QuestionUtil.getResponse(
			{
				responses: {
					testId: 'A Response'
				}
			},
			testModel
		)

		expect(res).toEqual('A Response')
	})

	it('should report if a response for a given model exists', () => {
		let has = QuestionUtil.hasResponse(
			{
				responses: {
					testId: false
				}
			},
			testModel
		)
		let notHas = QuestionUtil.hasResponse(
			{
				responses: {
					notTestId: false
				}
			},
			testModel
		)

		expect(has).toBe(true)
		expect(notHas).toBe(false)
	})

	it('should get data from state for a given model and key', () => {
		let data = QuestionUtil.getData(
			{
				data: {
					'testId:theKey': { someData: true }
				}
			},
			testModel,
			'theKey'
		)

		expect(data).toEqual({ someData: true })
	})
})
