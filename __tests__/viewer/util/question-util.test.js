jest.mock('../../../src/scripts/common/flux/dispatcher', () => ({
	trigger: jest.fn(),
	on: jest.fn(),
	off: jest.fn()
}))

const QuestionUtil = require('../../../src/scripts/viewer/util/question-util').default
const Dispatcher = require('../../../src/scripts/common/flux/dispatcher')

const testModel = {
	get: () => 'testId'
}

describe('QuestionUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	it('should trigger question:setResponse', () => {
		QuestionUtil.setResponse('testId', { response: 'A Response' })

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:setResponse', {
			value: {
				id: 'testId',
				response: { response: 'A Response' }
			}
		})
	})

	it('should trigger question:clearResponse', () => {
		QuestionUtil.clearResponse('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:clearResponse', {
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

	it('should trigger question:viewQuestion', () => {
		QuestionUtil.viewQuestion('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:view', {
			value: {
				id: 'testId'
			}
		})
	})

	it('should trigger question:hideQuestion', () => {
		QuestionUtil.hideQuestion('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:hide', {
			value: {
				id: 'testId'
			}
		})
	})

	it('should trigger question:showExplanation', () => {
		QuestionUtil.showExplanation('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:showExplanation', {
			value: {
				id: 'testId'
			}
		})
	})

	it('should trigger question:hideExplanation', () => {
		QuestionUtil.hideExplanation('testId', 'testActor')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:hideExplanation', {
			value: {
				id: 'testId',
				actor: 'testActor'
			}
		})
	})

	it('should trigger question:retryQuestion', () => {
		QuestionUtil.retryQuestion('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:retry', {
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

	it('should report if it is showing an explanation', () => {
		expect(
			QuestionUtil.isShowingExplanation(
				{
					data: {
						'testId:showingExplanation': false
					}
				},
				testModel
			)
		).toBe(false)

		expect(
			QuestionUtil.isShowingExplanation(
				{
					data: {
						'otherId:showingExplanation': true
					}
				},
				testModel
			)
		).toBe(false)

		expect(
			QuestionUtil.isShowingExplanation(
				{
					data: {
						'testId:showingExplanation': true
					}
				},
				testModel
			)
		).toBe(true)
	})

	test('checkAnswer', () => {
		QuestionUtil.checkAnswer('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:checkAnswer', {
			value: {
				id: 'testId'
			}
		})
	})
})
