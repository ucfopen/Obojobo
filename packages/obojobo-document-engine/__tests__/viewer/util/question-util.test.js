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

	test('setResponse triggers question:setResponse', () => {
		QuestionUtil.setResponse('testId', { response: 'A Response' })

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:setResponse', {
			value: {
				id: 'testId',
				response: { response: 'A Response' }
			}
		})
	})

	test('clearResponse triggers question:clearResponse', () => {
		QuestionUtil.clearResponse('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:clearResponse', {
			value: {
				id: 'testId'
			}
		})
	})

	test('setData triggers question:setData', () => {
		QuestionUtil.setData('testId', 'theKey', 'theValue')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:setData', {
			value: {
				key: 'testId:theKey',
				value: 'theValue'
			}
		})
	})

	test('clearData triggers question:clearData', () => {
		QuestionUtil.clearData('testId', 'theKey')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:clearData', {
			value: {
				key: 'testId:theKey'
			}
		})
	})

	test('viewQuestion triggers question:viewQuestion', () => {
		QuestionUtil.viewQuestion('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:view', {
			value: {
				id: 'testId'
			}
		})
	})

	test('hideQuestion triggers question:hideQuestion', () => {
		QuestionUtil.hideQuestion('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:hide', {
			value: {
				id: 'testId'
			}
		})
	})

	test('checkAnswer calls question:checkAnswer', () => {
		QuestionUtil.checkAnswer('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:checkAnswer', {
			value: {
				id: 'testId'
			}
		})
	})

	test('showExplanation triggers question:showExplanation', () => {
		QuestionUtil.showExplanation('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:showExplanation', {
			value: {
				id: 'testId'
			}
		})
	})

	test('hideExplanation triggers question:hideExplanation', () => {
		QuestionUtil.hideExplanation('testId', 'testActor')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:hideExplanation', {
			value: {
				id: 'testId',
				actor: 'testActor'
			}
		})
	})

	test('retryQuestion triggers question:retryQuestion', () => {
		QuestionUtil.retryQuestion('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:retry', {
			value: {
				id: 'testId'
			}
		})
	})

	test('getViewState returns view states', () => {
		const active = QuestionUtil.getViewState(
			{
				viewing: 'testId',
				viewedQuestions: {
					testId: true
				}
			},
			testModel
		)
		const viewed = QuestionUtil.getViewState(
			{
				viewing: 'anotherId',
				viewedQuestions: {
					testId: true,
					anotherId: true
				}
			},
			testModel
		)
		const hidden = QuestionUtil.getViewState(
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

	test('getResponse gets a response from state with no matching context', () => {
		const res = QuestionUtil.getResponse(
			{
				responses: {
					mockContext: {
						testId: 'A Response'
					}
				}
			},
			testModel,
			'missingContext'
		)

		expect(res).toEqual(null)
	})

	test('getResponse gets a response from state with no matching id', () => {
		const res = QuestionUtil.getResponse(
			{
				responses: {
					mockContext: {}
				}
			},
			testModel,
			'mockContext'
		)

		expect(res).toEqual(null)
	})

	test('getResponse gets a response from state', () => {
		const res = QuestionUtil.getResponse(
			{
				responses: {
					mockContext: {
						testId: 'A Response'
					}
				}
			},
			testModel,
			'mockContext'
		)

		expect(res).toEqual('A Response')
	})

	test('getData gets data from state with no id match', () => {
		const data = QuestionUtil.getData(
			{
				data: {}
			},
			testModel,
			'theKey'
		)

		expect(data).toEqual(false)
	})

	test('getData gets data from state for a given model and key', () => {
		const data = QuestionUtil.getData(
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

	test('isShowingExplanation reports if it is showing an explanation', () => {
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

	test('getScoreForModel returns the score', () => {
		const state = {
			scores: {
				mockContext: {
					testId: { score: 100 }
				}
			}
		}
		const model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		const score = QuestionUtil.getScoreForModel(state, model, 'mockContext')

		expect(score).toEqual(100)
	})

	test('setScore calls question:scoreSet', () => {
		QuestionUtil.setScore('testId', 'mockScore', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:scoreSet', {
			value: {
				itemId: 'testId',
				score: 'mockScore',
				context: 'mockContext'
			}
		})
	})

	test('clearScore calls question:scoreClear', () => {
		QuestionUtil.clearScore('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:scoreClear', {
			value: {
				itemId: 'testId',
				context: 'mockContext'
			}
		})
	})
})
