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
			'mockAttemptId',
			'mockSendResponseImmediately'
		)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:setResponse', {
			value: {
				id: 'testId',
				response: { response: 'A Response' },
				targetId: 'mockTargetId',
				context: 'mockContext',
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				sendResponseImmediately: 'mockSendResponseImmediately'
			}
		})
	})

	test('setResponse triggers question:setResponse (with sendResponseImmediately default to true)', () => {
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
				attemptId: 'mockAttemptId',
				sendResponseImmediately: true
			}
		})
	})

	test('sendResponse triggers question:sendResponse', () => {
		QuestionUtil.sendResponse('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:sendResponse', {
			value: {
				id: 'testId',
				context: 'mockContext'
			}
		})
	})

	test('forceSendAllResponsesForContext triggers question:forceSendAllResponses', () => {
		QuestionUtil.forceSendAllResponsesForContext('mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:forceSendAllResponses', {
			value: {
				context: 'mockContext'
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
		QuestionUtil.setScore(
			'testId',
			'mockScore',
			'mockDetails',
			'mockFeedbackText',
			'mockDetailedText',
			'mockContext'
		)

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:scoreSet', {
			value: {
				itemId: 'testId',
				score: 'mockScore',
				details: 'mockDetails',
				feedbackText: 'mockFeedbackText',
				detailedText: 'mockDetailedText',
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

	test('revealAnswer calls question:revealAnswer', () => {
		QuestionUtil.revealAnswer('testId', 'mockContext')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('question:revealAnswer', {
			value: {
				id: 'testId',
				context: 'mockContext'
			}
		})
	})

	test('getScoreDataForModel returns null if no state for context', () => {
		expect(
			QuestionUtil.getScoreDataForModel(
				{
					contexts: {
						mockContext: {}
					}
				},
				{},
				'mockContext2'
			)
		).toBe(null)
	})

	test('getScoreDataForModel returns null if no score data for context', () => {
		expect(
			QuestionUtil.getScoreDataForModel(
				{
					contexts: {
						mockContext: {
							scores: {
								testId: { scoreData: true }
							}
						}
					}
				},
				{
					get: () => 'mockId2'
				},
				'mockContext'
			)
		).toBe(null)
	})

	test('getScoreDataForModel returns null if score data is falsy', () => {
		expect(
			QuestionUtil.getScoreDataForModel(
				{
					contexts: {
						mockContext: {
							scores: {
								mockId: false
							}
						}
					}
				},
				testModel,
				'mockContext'
			)
		).toBe(null)
	})

	test('getScoreDataForModel returns score data', () => {
		expect(
			QuestionUtil.getScoreDataForModel(
				{
					contexts: {
						mockContext: {
							scores: {
								testId: {
									score: 100
								}
							}
						}
					}
				},
				testModel,
				'mockContext'
			)
		).toEqual({ score: 100 })
	})

	test('getScoreForModel returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					scores: {
						testId: {
							score: 100
						}
					}
				}
			}
		}

		expect(QuestionUtil.getScoreForModel(state, testModel, 'mockContext2')).toBe(null)
		expect(QuestionUtil.getScoreForModel(state, { get: () => 'testId2' }, 'mockContext')).toBe(null)
		expect(QuestionUtil.getScoreForModel(state, testModel, 'mockContext')).toBe(100)
	})

	test('getFeedbackTextForModel returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					scores: {
						testId: {
							feedbackText: 'mockFeedbackText'
						}
					}
				}
			}
		}

		expect(QuestionUtil.getFeedbackTextForModel(state, testModel, 'mockContext2')).toBe(null)
		expect(
			QuestionUtil.getFeedbackTextForModel(state, { get: () => 'testId2' }, 'mockContext')
		).toBe(null)
		expect(QuestionUtil.getFeedbackTextForModel(state, testModel, 'mockContext')).toBe(
			'mockFeedbackText'
		)
	})

	test('getDetailedTextForModel returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					scores: {
						testId: {
							detailedText: 'mockDetailedText'
						}
					}
				}
			}
		}

		expect(QuestionUtil.getDetailedTextForModel(state, testModel, 'mockContext2')).toBe(null)
		expect(
			QuestionUtil.getDetailedTextForModel(state, { get: () => 'testId2' }, 'mockContext')
		).toBe(null)
		expect(QuestionUtil.getDetailedTextForModel(state, testModel, 'mockContext')).toBe(
			'mockDetailedText'
		)
	})

	test('getResponseSendState returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					responseMetadata: {
						testId: {
							sendState: 'mockSendState'
						}
					}
				}
			}
		}

		expect(QuestionUtil.getResponseSendState(state, testModel, 'mockContext2')).toBe(null)
		expect(QuestionUtil.getResponseSendState(state, { get: () => 'testId2' }, 'mockContext')).toBe(
			null
		)
		expect(QuestionUtil.getResponseSendState(state, testModel, 'mockContext')).toBe('mockSendState')
	})

	test('isResponseRecorded returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					responseMetadata: {
						testId1: {
							sendState: 'notSent'
						},
						testId2: {
							sendState: 'sending'
						},
						testId3: {
							sendState: 'error'
						},
						testId4: {
							sendState: 'recorded'
						}
					}
				}
			}
		}

		expect(QuestionUtil.isResponseRecorded(state, testModel, 'mockContext2')).toBe(false)
		expect(QuestionUtil.isResponseRecorded(state, { get: () => 'testId1' }, 'mockContext')).toBe(
			false
		)
		expect(QuestionUtil.isResponseRecorded(state, { get: () => 'testId2' }, 'mockContext')).toBe(
			false
		)
		expect(QuestionUtil.isResponseRecorded(state, { get: () => 'testId3' }, 'mockContext')).toBe(
			false
		)
		expect(QuestionUtil.isResponseRecorded(state, { get: () => 'testId4' }, 'mockContext')).toBe(
			true
		)
	})

	test('getResponseMetadata returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					responseMetadata: {
						testId: {
							mockData: true
						}
					}
				}
			}
		}

		expect(QuestionUtil.getResponseMetadata(state, testModel, 'mockContext2')).toBe(null)
		expect(QuestionUtil.getResponseMetadata(state, { get: () => 'testId2' }, 'mockContext')).toBe(
			null
		)
		expect(QuestionUtil.getResponseMetadata(state, testModel, 'mockContext')).toEqual({
			mockData: true
		})
	})

	test('isScored returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					scores: {
						testId2: {
							score: 0
						},
						testId3: {
							score: 100
						},
						testId4: {
							score: 'no-score'
						}
					}
				}
			}
		}

		expect(QuestionUtil.isScored(state, testModel, 'mockContext2')).toBe(false)
		expect(QuestionUtil.isScored(state, { get: () => 'testId1' }, 'mockContext')).toBe(false)
		expect(QuestionUtil.isScored(state, { get: () => 'testId2' }, 'mockContext')).toBe(true)
		expect(QuestionUtil.isScored(state, { get: () => 'testId3' }, 'mockContext')).toBe(true)
		expect(QuestionUtil.isScored(state, { get: () => 'testId4' }, 'mockContext')).toBe(true)
	})

	test('hasUnscoredResponse returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					scores: {
						testId1: {
							score: 100
						},
						testId3: {
							score: 0
						},
						testId5: {
							score: 'no-score'
						}
					},
					responses: {
						testId1: 'response1',
						testId2: 'response2',
						testId3: 'response3',
						testId4: 'response4',
						testId5: 'response5',
						testId6: 'response6'
					}
				}
			}
		}

		expect(QuestionUtil.hasUnscoredResponse(state, testModel, 'mockContext2')).toBe(false)
		expect(QuestionUtil.hasUnscoredResponse(state, { get: () => 'testId1' }, 'mockContext')).toBe(
			false
		)
		expect(QuestionUtil.hasUnscoredResponse(state, { get: () => 'testId2' }, 'mockContext')).toBe(
			true
		)
		expect(QuestionUtil.hasUnscoredResponse(state, { get: () => 'testId3' }, 'mockContext')).toBe(
			false
		)
		expect(QuestionUtil.hasUnscoredResponse(state, { get: () => 'testId4' }, 'mockContext')).toBe(
			true
		)
		expect(QuestionUtil.hasUnscoredResponse(state, { get: () => 'testId5' }, 'mockContext')).toBe(
			false
		)
		expect(QuestionUtil.hasUnscoredResponse(state, { get: () => 'testId6' }, 'mockContext')).toBe(
			true
		)
		expect(QuestionUtil.hasUnscoredResponse(state, { get: () => 'testId7' }, 'mockContext')).toBe(
			false
		)
		expect(QuestionUtil.hasUnscoredResponse(state, { get: () => 'testId8' }, 'mockContext')).toBe(
			false
		)
	})

	test('isAnswerRevealed returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					revealedQuestions: {
						testId: true
					}
				}
			}
		}

		expect(QuestionUtil.isAnswerRevealed(state, testModel, 'mockContext2')).toBe(false)
		expect(QuestionUtil.isAnswerRevealed(state, { get: () => 'testId2' }, 'mockContext')).toBe(
			false
		)
		expect(QuestionUtil.isAnswerRevealed(state, testModel, 'mockContext')).toBe(true)
	})

	test('isResponseEmpty returns false if no response is found', () => {
		const state = {
			contexts: {
				mockContext: {
					responses: {
						testId: 'mockResponse'
					}
				}
			}
		}

		expect(QuestionUtil.isResponseEmpty(state, testModel, 'mockContext2')).toBe(false)
		expect(QuestionUtil.isResponseEmpty(state, { get: () => 'testId2' }, 'mockContext')).toBe(false)
	})

	test('isResponseEmpty returns false if no comopnent class is found', () => {
		const state = {
			contexts: {
				mockContext: {
					responses: {
						testId: 'mockResponse'
					}
				}
			}
		}

		expect(
			QuestionUtil.isResponseEmpty(
				state,
				{
					get: () => 'testId',
					children: {
						at: () => ({
							getComponentClass: () => false
						})
					}
				},
				'mockContext'
			)
		).toBe(false)
	})

	test('isResponseEmpty returns the value of the component classes isResponseEmpty method', () => {
		const state = {
			contexts: {
				mockContext: {
					responses: {
						testId: 'mockResponse'
					}
				}
			}
		}

		expect(
			QuestionUtil.isResponseEmpty(
				state,
				{
					get: () => 'testId',
					children: {
						at: () => ({
							getComponentClass: () => ({
								isResponseEmpty: () => 'mockIsResponseEmptyReturnValue'
							})
						})
					}
				},
				'mockContext'
			)
		).toBe('mockIsResponseEmptyReturnValue')
	})

	test('hasResponse returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {
					responses: {
						testId: true
					}
				}
			}
		}

		expect(QuestionUtil.hasResponse(state, testModel, 'mockContext2')).toBe(false)
		expect(QuestionUtil.hasResponse(state, { get: () => 'testId2' }, 'mockContext')).toBe(false)
		expect(QuestionUtil.hasResponse(state, testModel, 'mockContext')).toBe(true)
	})

	test('getStateForContext returns expected values', () => {
		const state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(QuestionUtil.getStateForContext(state, 'mockContext2')).toBe(null)
		expect(QuestionUtil.getStateForContext(state, 'mockContext')).toBe(state.contexts.mockContext)
	})
})
