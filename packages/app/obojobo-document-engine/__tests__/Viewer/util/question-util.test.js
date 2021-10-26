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
		QuestionUtil.setResponse(
			'testId',
			{ response: 'A Response' },
			'mockTargetId',
			'mockContext',
			'mockAssessmentId',
			'mockAttemptId'
		)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:setResponse', {
			value: {
				id: 'testId',
				response: { response: 'A Response' },
				targetId: 'mockTargetId',
				context: 'mockContext',
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId'
			}
		})
	})

	test('clearResponse triggers question:clearResponse', () => {
		QuestionUtil.clearResponse('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:clearResponse', {
			value: {
				id: 'testId',
				context: 'mockContext'
			}
		})
	})

	test('setData triggers question:setData', () => {
		QuestionUtil.setData('testId', 'mockContext', 'theKey', 'theValue')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:setData', {
			value: {
				key: 'testId:theKey',
				value: 'theValue',
				context: 'mockContext'
			}
		})
	})

	test('clearData triggers question:clearData', () => {
		QuestionUtil.clearData('testId', 'mockContext', 'theKey')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:clearData', {
			value: {
				key: 'testId:theKey',
				context: 'mockContext'
			}
		})
	})

	test('viewQuestion triggers question:viewQuestion', () => {
		QuestionUtil.viewQuestion('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:view', {
			value: {
				id: 'testId',
				context: 'mockContext'
			}
		})
	})

	test('hideQuestion triggers question:hideQuestion', () => {
		QuestionUtil.hideQuestion('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:hide', {
			value: {
				id: 'testId',
				context: 'mockContext'
			}
		})
	})

	test('submitResponse triggers question:submitResponse', () => {
		QuestionUtil.submitResponse('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:submitResponse', {
			value: {
				id: 'testId',
				context: 'mockContext'
			}
		})
	})

	test('checkAnswer calls question:checkAnswer', () => {
		QuestionUtil.checkAnswer('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:checkAnswer', {
			value: {
				id: 'testId',
				context: 'mockContext'
			}
		})
	})

	test('showExplanation triggers question:showExplanation', () => {
		QuestionUtil.showExplanation('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:showExplanation', {
			value: {
				id: 'testId',
				context: 'mockContext'
			}
		})
	})

	test('hideExplanation triggers question:hideExplanation', () => {
		QuestionUtil.hideExplanation('testId', 'mockContext', 'testActor')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:hideExplanation', {
			value: {
				id: 'testId',
				actor: 'testActor',
				context: 'mockContext'
			}
		})
	})

	test('retryQuestion triggers question:retryQuestion', () => {
		QuestionUtil.retryQuestion('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:retry', {
			value: {
				id: 'testId',
				context: 'mockContext'
			}
		})
	})

	test('getViewState returns view states', () => {
		const active = QuestionUtil.getViewState(
			{
				contexts: {
					mockContext: {
						viewing: 'testId',
						viewedQuestions: {
							testId: true
						}
					}
				}
			},
			testModel,
			'mockContext'
		)
		const viewed = QuestionUtil.getViewState(
			{
				contexts: {
					mockContext: {
						viewing: 'anotherId',
						viewedQuestions: {
							testId: true,
							anotherId: true
						}
					}
				}
			},
			testModel,
			'mockContext'
		)
		const hidden = QuestionUtil.getViewState(
			{
				contexts: {
					mockContext: {
						viewing: 'notTestId',
						viewedQuestions: {
							notTestId: true
						}
					}
				}
			},
			testModel,
			'mockContext'
		)

		expect(active).toEqual('active')
		expect(viewed).toEqual('viewed')
		expect(hidden).toEqual('hidden')
	})

	test('getViewState returns null if no context exists', () => {
		expect(
			QuestionUtil.getViewState(
				{
					contexts: {}
				},
				testModel,
				'mockContext'
			)
		).toBe(null)
	})

	test('getResponse gets null from state with no matching context', () => {
		const res = QuestionUtil.getResponse(
			{
				contexts: {
					mockContext: {
						responses: {
							testId: 'A Response'
						}
					}
				}
			},
			testModel,
			'missingContext'
		)

		expect(res).toEqual(null)
	})

	test('getResponse gets null from state with no matching id', () => {
		const res = QuestionUtil.getResponse(
			{
				contexts: {
					mockContext: {
						responses: {}
					}
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
				contexts: {
					mockContext: {
						responses: {
							testId: 'A Response'
						}
					}
				}
			},
			testModel,
			'mockContext'
		)

		expect(res).toEqual('A Response')
	})

	test('isAnswered returns boolean if a question has a response', () => {
		const spy = jest.spyOn(QuestionUtil, 'getResponse')

		spy.mockReturnValue(null)
		expect(QuestionUtil.isAnswered('mock-state', 'mock-model', 'mock-context')).toBe(false)
		expect(spy).toHaveBeenCalledWith('mock-state', 'mock-model', 'mock-context')

		spy.mockReturnValue({})
		expect(QuestionUtil.isAnswered('mock-state', 'mock-model', 'mock-context')).toBe(true)
		expect(spy).toHaveBeenCalledWith('mock-state', 'mock-model', 'mock-context')

		spy.mockRestore()
	})

	test('getData gets data from state with no id match', () => {
		const data = QuestionUtil.getData(
			{
				contexts: {
					mockContext: {
						data: {}
					}
				}
			},
			testModel,
			'mockContext',
			'theKey'
		)

		expect(data).toEqual(null)
	})

	test('getData gets data from state for a given model and key', () => {
		const data = QuestionUtil.getData(
			{
				contexts: {
					mockContext: {
						data: {
							'testId:theKey': { someData: true }
						}
					}
				}
			},
			testModel,
			'mockContext',
			'theKey'
		)

		expect(data).toEqual({ someData: true })
	})

	test('getData gets null if no data exists for a given context', () => {
		const data = QuestionUtil.getData(
			{
				contexts: {
					mockContext: {
						data: {
							'testId:theKey': { someData: true }
						}
					}
				}
			},
			testModel,
			'someOtherContext',
			'theKey'
		)

		expect(data).toEqual(null)
	})

	test('isShowingExplanation reports if it is showing an explanation', () => {
		expect(
			QuestionUtil.isShowingExplanation(
				{
					contexts: {
						mockContext: {
							data: {
								'testId:showingExplanation': false
							}
						}
					}
				},
				testModel,
				'mockContext'
			)
		).toBe(false)

		expect(
			QuestionUtil.isShowingExplanation(
				{
					contexts: {
						mockContext: {
							data: {
								'otherId:showingExplanation': true
							}
						}
					}
				},
				testModel,
				'mockContext'
			)
		).toBe(false)

		expect(
			QuestionUtil.isShowingExplanation(
				{
					contexts: {
						mockContext: {
							data: {
								'testId:showingExplanation': true
							}
						}
					}
				},
				testModel,
				'mockContext'
			)
		).toBe(true)

		expect(
			QuestionUtil.isShowingExplanation(
				{
					contexts: {
						mockContext: {
							data: {}
						}
					}
				},
				testModel,
				'mockContext'
			)
		).toBe(false)

		expect(
			QuestionUtil.isShowingExplanation(
				{
					contexts: {
						mockContext: {
							data: {
								'testId:showingExplanation': true
							}
						}
					}
				},
				testModel,
				'someOtherContext'
			)
		).toBe(false)
	})

	test('getScoreForModel returns the score', () => {
		const state = {
			contexts: {
				mockContext: {
					scores: {
						testId: { score: 100 }
					}
				}
			}
		}
		const model = {
			get: jest.fn().mockReturnValueOnce('testId')
		}

		let score = QuestionUtil.getScoreForModel(state, model, 'mockContext')
		expect(score).toEqual(100)

		score = QuestionUtil.getScoreForModel(state, model, 'nonExistentContext')
		expect(score).toEqual(null)
	})

	test('getScoreForModel returns null if no score item exists', () => {
		expect(
			QuestionUtil.getScoreForModel(
				{
					contexts: {
						mockContext: {
							scores: {}
						}
					}
				},
				{ get: () => 'some-id' },
				'mockContext'
			)
		).toBe(null)
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

	test('getScoreClass returns expected values', () => {
		expect(QuestionUtil.getScoreClass(null)).toBe('is-not-scored')
		expect(QuestionUtil.getScoreClass('no-score')).toBe('is-no-score')
		expect(QuestionUtil.getScoreClass(100)).toBe('is-correct')
		expect(QuestionUtil.getScoreClass(99)).toBe('is-not-correct')
		expect(QuestionUtil.getScoreClass(0)).toBe('is-not-correct')
		expect(QuestionUtil.getScoreClass('invalid-value')).toBe('is-not-correct')
	})
})
