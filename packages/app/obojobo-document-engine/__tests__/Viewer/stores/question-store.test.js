import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'
import QuestionUtil from '../../../src/scripts/viewer/util/question-util'
import FocusUtil from '../../../src/scripts/viewer/util/focus-util'
import ViewerAPI from '../../../src/scripts/viewer/util/viewer-api'
import mockConsole from 'jest-mock-console'

jest.mock('../../../src/scripts/common/models/obo-model', () => {
	return {
		getRoot: () => {
			return {
				get: () => 'mockDraftId'
			}
		},
		models: {
			mockId: { mockOboModel: true }
		}
	}
})
jest.mock('../../../src/scripts/viewer/stores/nav-store', () => {
	return {
		getState: () => {
			return {
				visitId: 'mockVisitId'
			}
		}
	}
})
jest.mock('../../../src/scripts/viewer/util/viewer-api')
jest.mock('../../../src/scripts/viewer/util/question-util')
jest.mock('../../../src/scripts/viewer/util/focus-util')
jest.mock('../../../src/scripts/common/util/uuid', () => {
	return () => 'mockUuid'
})

describe('QuestionStore', () => {
	let QuestionStoreClass
	let restoreConsole

	beforeEach(() => {
		// Remove any added dispatcher events and create a brand new QuestionStore instance
		// since the imported QuestionStore is actually a class instance!
		Dispatcher.off()
		QuestionStoreClass = QuestionStore.constructor
		restoreConsole = mockConsole('error')
	})

	afterEach(() => {
		jest.resetAllMocks()
		restoreConsole()
	})

	test('constructor adds event listeners for the question events', () => {
		const dispatcherSpy = jest.spyOn(Dispatcher, 'on').mockImplementation(jest.fn())

		QuestionStore.constructor()

		expect(dispatcherSpy).toHaveBeenCalledWith({
			'question:forceSendAllResponses': expect.any(Function),
			'question:sendResponse': expect.any(Function),
			'question:setResponse': expect.any(Function),
			'question:clearResponse': expect.any(Function),
			'question:setData': expect.any(Function),
			'question:showExplanation': expect.any(Function),
			'question:hideExplanation': expect.any(Function),
			'question:clearData': expect.any(Function),
			'question:hide': expect.any(Function),
			'question:view': expect.any(Function),
			'question:checkAnswer': expect.any(Function),
			'question:submitResponse': expect.any(Function),
			'question:retry': expect.any(Function),
			'question:revealAnswer': expect.any(Function),
			'question:scoreSet': expect.any(Function),
			'question:scoreClear': expect.any(Function),
			'assessment:endAttempt': expect.any(Function),
			'nav:setContext': expect.any(Function)
		})

		dispatcherSpy.mockRestore()
	})

	test.each`
		event                               | method                       | callsTriggerChange
		${'question:forceSendAllResponses'} | ${'forceSendAllResponses'}   | ${'never'}
		${'question:setResponse'}           | ${'setResponse'}             | ${'when method returns true'}
		${'question:clearResponse'}         | ${'clearResponse'}           | ${'when method returns true'}
		${'question:setData'}               | ${'setData'}                 | ${'always'}
		${'question:showExplanation'}       | ${'showExplanation'}         | ${'always'}
		${'question:hideExplanation'}       | ${'hideExplanation'}         | ${'always'}
		${'question:clearData'}             | ${'clearData'}               | ${'when method returns true'}
		${'question:hide'}                  | ${'hide'}                    | ${'when method returns true'}
		${'question:view'}                  | ${'view'}                    | ${'always'}
		${'question:checkAnswer'}           | ${'checkAnswer'}             | ${'when method returns true'}
		${'question:submitResponse'}        | ${'submitResponse'}          | ${'when method returns true'}
		${'question:retry'}                 | ${'retry'}                   | ${'when method returns true'}
		${'question:revealAnswer'}          | ${'revealAnswer'}            | ${'when method returns true'}
		${'question:scoreSet'}              | ${'scoreSet'}                | ${'when method returns true'}
		${'question:scoreClear'}            | ${'scoreClear'}              | ${'when method returns true'}
		${'assessment:endAttempt'}          | ${'clearResponse'}           | ${'when method returns true'}
		${'nav:setContext'}                 | ${'getOrCreateContextState'} | ${'never'}
	`(
		'Triggering $event calls $method, $callsTriggerChange calls triggerChange',
		({ event, method, callsTriggerChange }) => {
			// Mock triggerChange and the internal method that the dispatcher will call
			const triggerSpy = jest
				.spyOn(QuestionStoreClass.prototype, 'triggerChange')
				.mockImplementation(jest.fn())
			const eventSpy = jest
				.spyOn(QuestionStoreClass.prototype, method)
				.mockImplementation(jest.fn())

			//eslint-disable-next-line no-unused-vars
			const questionStore = new QuestionStoreClass()

			// 1. Fire the event such that the mocked method returns true
			eventSpy.mockReturnValueOnce(true)
			Dispatcher.trigger(event, { value: {} })

			// Test if trigger change was called
			switch (callsTriggerChange) {
				case 'never':
					expect(triggerSpy).not.toHaveBeenCalled()
					break

				case 'always':
					expect(triggerSpy).toHaveBeenCalled()
					break

				case 'when method returns true':
					expect(triggerSpy).toHaveBeenCalled()
					break
			}

			// 2. Fire the event again, such that the mocked method returns false
			triggerSpy.mockReset()
			eventSpy.mockReturnValueOnce(false)
			Dispatcher.trigger(event, { value: {} })

			// Test if trigger change was called
			switch (callsTriggerChange) {
				case 'never':
					expect(triggerSpy).not.toHaveBeenCalled()
					break

				case 'always':
					expect(triggerSpy).toHaveBeenCalled()
					break

				case 'whenMethodReturnsTrue':
					expect(triggerSpy).not.toHaveBeenCalled()
					break
			}

			triggerSpy.mockRestore()
			eventSpy.mockRestore()
		}
	)

	test('init sets initial state', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.init()

		expect(questionStore.state).toEqual({
			contexts: {
				practice: {
					viewing: null,
					viewedQuestions: {},
					revealedQuestions: {},
					scores: {},
					responses: {},
					responseMetadata: {},
					sendingResponsePromises: {},
					data: {}
				}
			}
		})
	})

	test('onPostResponseSuccess returns false and does nothing if the response is not marked as being in a sending state', () => {
		const questionStore = new QuestionStoreClass()
		const dispatcherSpy = jest.spyOn(Dispatcher, 'trigger').mockImplementation(jest.fn())
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {
					sendingResponsePromises: {
						mockId: {}
					},
					responseMetadata: {
						mockId: {
							sendState: 'mockSendState'
						}
					}
				}
			}
		}
		expect(
			questionStore.onPostResponseSuccess('ok', questionStore.state.contexts.mockContext, 'mockId')
		).toBe(false)
		expect(questionStore.state.contexts.mockContext).toEqual({
			sendingResponsePromises: {
				mockId: {}
			},
			responseMetadata: {
				mockId: {
					sendState: 'mockSendState'
				}
			}
		})
		expect(dispatcherSpy).not.toHaveBeenCalled()
		expect(triggerSpy).not.toHaveBeenCalled()

		dispatcherSpy.mockRestore()
		triggerSpy.mockRestore()
	})

	test('onPostResponseSuccess returns true if response status is ok, updates state, fires event and calls triggerChange', () => {
		const questionStore = new QuestionStoreClass()
		const dispatcherSpy = jest.spyOn(Dispatcher, 'trigger').mockImplementation(jest.fn())
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {
					sendingResponsePromises: {
						mockId: {}
					},
					responseMetadata: {
						mockId: {
							sendState: 'sending'
						}
					}
				}
			}
		}
		expect(
			questionStore.onPostResponseSuccess('ok', questionStore.state.contexts.mockContext, 'mockId')
		).toBe(true)
		expect(questionStore.state.contexts.mockContext).toEqual({
			sendingResponsePromises: {},
			responseMetadata: {
				mockId: {
					sendState: 'recorded'
				}
			}
		})
		expect(dispatcherSpy).toHaveBeenCalledWith('question:responseSent', {
			success: true,
			id: 'mockId'
		})
		expect(triggerSpy).toHaveBeenCalled()

		dispatcherSpy.mockRestore()
		triggerSpy.mockRestore()
	})

	test('onPostResponseSuccess returns false if response status is not ok, updates state, fires event and calls triggerChange', () => {
		const questionStore = new QuestionStoreClass()
		const dispatcherSpy = jest.spyOn(Dispatcher, 'trigger').mockImplementation(jest.fn())
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {
					sendingResponsePromises: {
						mockId: {}
					},
					responseMetadata: {
						mockId: {
							sendState: 'sending'
						}
					}
				}
			}
		}
		expect(
			questionStore.onPostResponseSuccess(
				'error',
				questionStore.state.contexts.mockContext,
				'mockId'
			)
		).toBe(false)
		expect(questionStore.state.contexts.mockContext).toEqual({
			sendingResponsePromises: {},
			responseMetadata: {
				mockId: {
					sendState: 'error'
				}
			}
		})
		expect(dispatcherSpy).toHaveBeenCalledWith('question:responseSent', {
			success: false,
			id: 'mockId'
		})
		expect(triggerSpy).toHaveBeenCalled()

		dispatcherSpy.mockRestore()
		triggerSpy.mockRestore()
	})

	test('onPostResponseError updates state, fires event, triggers change, returns false', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					sendingResponsePromises: {
						mockId: 'mockPromise'
					},
					responseMetadata: {
						mockId: {
							sendState: 'mockSendState'
						}
					}
				}
			}
		}

		const spy = jest.spyOn(Dispatcher, 'trigger').mockImplementation(jest.fn())

		expect(
			questionStore.onPostResponseError(questionStore.state.contexts.mockContext, 'mockId')
		).toBe(false)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					sendingResponsePromises: {},
					responseMetadata: {
						mockId: {
							sendState: 'error'
						}
					}
				}
			}
		})
		expect(spy).toHaveBeenCalledWith('question:responseSent', { successful: false, id: 'mockId' })

		spy.mockRestore()
	})

	test('getPostResponsePromises returns null if no context state is found', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.getPostResponsePromises('mockContext2')).toBe(null)
	})

	test('getPostResponsePromises returns an array of promises to send unsent/errored responses', async () => {
		const questionStore = new QuestionStoreClass()

		const postResponseSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'getPostResponsePromise')
			.mockImplementation(id => new Promise(res => res(id)))

		const sendingQuestion2Promise = new Promise(res => res('mockQuestionId2'))

		questionStore.state = {
			contexts: {
				mockContext: {
					sendingResponsePromises: [sendingQuestion2Promise],
					responseMetadata: {
						mockQuestionId1: {
							sendState: 'error',
							details: {
								questionId: 'mockQuestionId1'
							}
						},
						mockQuestionId2: {
							sendState: 'sending',
							details: {
								questionId: 'mockQuestionId2'
							}
						},
						mockQuestionId3: {
							sendState: 'recorded',
							details: {
								questionId: 'mockQuestionId3'
							}
						},
						mockQuestionId4: {
							sendState: 'notSent',
							details: {
								questionId: 'mockQuestionId4'
							}
						}
					}
				}
			}
		}

		const promises = questionStore.getPostResponsePromises('mockContext')
		const values = await Promise.all(promises)

		expect(values).toEqual(['mockQuestionId2', 'mockQuestionId1', 'mockQuestionId4'])

		postResponseSpy.mockRestore()
	})

	test('forceSendAllResponses returns false if context not found', () => {
		const questionStore = new QuestionStoreClass()
		const dispatcherSpy = jest.spyOn(Dispatcher, 'trigger').mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		const result = questionStore.forceSendAllResponses({ context: 'mockContext2' })
		expect(result).toEqual(false)
		expect(dispatcherSpy).not.toHaveBeenCalled()

		dispatcherSpy.mockRestore()
	})

	test('forceSendAllResponses fires event (success = true) if nothing to send', async () => {
		const questionStore = new QuestionStoreClass()
		const dispatcherSpy = jest.spyOn(Dispatcher, 'trigger').mockImplementation(jest.fn())
		const getPostResponsePromisesSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'getPostResponsePromises')
			.mockImplementation(() => [])

		const result = await questionStore.forceSendAllResponses({ context: 'mockContext' })
		expect(result).toEqual(true)
		expect(dispatcherSpy).toHaveBeenCalledWith('question:forceSentAllResponses', {
			value: {
				context: 'mockContext',
				success: true,
				error: null
			}
		})

		getPostResponsePromisesSpy.mockRestore()
		dispatcherSpy.mockRestore()
	})

	test('forceSendAllResponses fires event (success = true) when all promises resolve', async () => {
		const questionStore = new QuestionStoreClass()
		const dispatcherSpy = jest.spyOn(Dispatcher, 'trigger').mockImplementation(jest.fn())
		const getPostResponsePromisesSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'getPostResponsePromises')
			.mockImplementation(() => [new Promise(res => res(true)), new Promise(res => res(true))])

		const result = await questionStore.forceSendAllResponses({ context: 'mockContext' })
		expect(result).toEqual(true)
		expect(dispatcherSpy).toHaveBeenCalledWith('question:forceSentAllResponses', {
			value: {
				context: 'mockContext',
				success: true,
				error: null
			}
		})

		getPostResponsePromisesSpy.mockRestore()
		dispatcherSpy.mockRestore()
	})

	test('forceSendAllResponses fires event (success = false) when not all promises resolve', async () => {
		const questionStore = new QuestionStoreClass()
		const dispatcherSpy = jest.spyOn(Dispatcher, 'trigger').mockImplementation(jest.fn())
		const getPostResponsePromisesSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'getPostResponsePromises')
			.mockImplementation(() => [new Promise(res => res(true)), new Promise(res => res(false))])

		const result = await questionStore.forceSendAllResponses({ context: 'mockContext' })
		expect(result).toEqual(true)
		expect(dispatcherSpy).toHaveBeenCalledWith('question:forceSentAllResponses', {
			value: {
				context: 'mockContext',
				success: false,
				error: null
			}
		})

		getPostResponsePromisesSpy.mockRestore()
		dispatcherSpy.mockRestore()
	})

	test('forceSendAllResponses fires event (success = false) when there is an error', async () => {
		const questionStore = new QuestionStoreClass()
		const dispatcherSpy = jest.spyOn(Dispatcher, 'trigger').mockImplementation(jest.fn())
		const getPostResponsePromisesSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'getPostResponsePromises')
			.mockImplementation(() => [
				new Promise(res => res(true)),
				new Promise(() => {
					throw new Error('mock-error')
				})
			])
		const result = await questionStore.forceSendAllResponses({ context: 'mockContext' })
		expect(result).toEqual(true)
		expect(dispatcherSpy).toHaveBeenCalledWith('question:forceSentAllResponses', {
			value: {
				context: 'mockContext',
				success: false,
				error: 'mock-error'
			}
		})
		//eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalledWith('Unable to send all responses', Error('mock-error'))

		getPostResponsePromisesSpy.mockRestore()
		dispatcherSpy.mockRestore()
	})

	test('question:sendResponse calls sendResponse', done => {
		const questionStore = new QuestionStoreClass()
		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		const spy = jest.spyOn(QuestionStoreClass.prototype, 'sendResponse').mockResolvedValueOnce({})
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())
		expect(spy).not.toHaveBeenCalled()
		expect(triggerSpy).not.toHaveBeenCalled()

		Dispatcher.trigger('question:sendResponse', { value: {} })

		setTimeout(() => {
			expect(spy).toHaveBeenCalled()
			expect(triggerSpy).toHaveBeenCalledTimes(2)

			spy.mockRestore()
			triggerSpy.mockRestore()

			done()
		}, 1)
	})

	test('sendResponse returns false if context not found', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.sendResponse({ context: 'mockContext2', id: 'mockId' })).toEqual(false)
	})

	test('sendResponse returns false if responseMetadata not found', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					responseMetadata: {
						mockId: {}
					}
				}
			}
		}

		expect(questionStore.sendResponse({ context: 'mockContext', id: 'mockId2' })).toEqual(false)
	})

	test('sendResponse updates state and returns a promise', async () => {
		const questionStore = new QuestionStoreClass()
		const mockPromise = new Promise(res => res('mock-success'))
		const postResponseSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'getPostResponsePromise')
			.mockImplementation(() => mockPromise)

		questionStore.state = {
			contexts: {
				mockContext: {
					sendingResponsePromises: {},
					responseMetadata: {
						mockId: {}
					}
				}
			}
		}

		const result = await questionStore.sendResponse({ context: 'mockContext', id: 'mockId' })

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					sendingResponsePromises: {
						mockId: mockPromise
					},
					responseMetadata: {
						mockId: {}
					}
				}
			}
		})
		expect(result).toEqual('mock-success')

		postResponseSpy.mockRestore()
	})

	test('sendResponse updates state and calls onPostResponseError if the call fails', async () => {
		const questionStore = new QuestionStoreClass()
		const mockPromise = new Promise(() => {
			throw new Error('mock-error')
		})
		const postResponseSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'getPostResponsePromise')
			.mockImplementation(() => mockPromise)
		const onPostResponseErrorSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'onPostResponseError')
			.mockImplementation(jest.fn())
		const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {
					sendingResponsePromises: {},
					responseMetadata: {
						mockId: {}
					}
				}
			}
		}

		await questionStore.sendResponse({ context: 'mockContext', id: 'mockId' })
		expect(onPostResponseErrorSpy).toHaveBeenCalledTimes(1)
		expect(consoleSpy).toHaveBeenCalledWith(new Error('mock-error'))

		postResponseSpy.mockRestore()
		onPostResponseErrorSpy.mockRestore()
		consoleSpy.mockRestore()
	})

	test('getPostResponsePromise updates state, fires an event and calls onPostReponseSuccess if the request succeeds', async () => {
		const questionStore = new QuestionStoreClass()
		const onPostResponseSuccessSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'onPostResponseSuccess')
			.mockImplementation(jest.fn())

		ViewerAPI.postEvent.mockResolvedValueOnce({ status: 'ok' })

		questionStore.state = {
			contexts: {
				mockContext: {
					responseMetadata: {
						mockId: {
							details: 'mock-details',
							time: 'mock-time'
						}
					}
				}
			}
		}

		await questionStore.getPostResponsePromise('mockId', 'mockContext')
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:setResponse',
			eventVersion: '2.2.0',
			visitId: 'mockVisitId',
			payload: 'mock-details',
			actorTime: 'mock-time'
		})
		expect(onPostResponseSuccessSpy).toHaveBeenCalledWith(
			'ok',
			questionStore.state.contexts.mockContext,
			'mockId'
		)
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					responseMetadata: {
						mockId: {
							details: 'mock-details',
							time: 'mock-time',
							sendState: 'sending'
						}
					}
				}
			}
		})

		onPostResponseSuccessSpy.mockRestore()
	})

	test('getPostResponsePromise calls onPostReponseError if the request fails', async () => {
		const questionStore = new QuestionStoreClass()
		const onPostResponseErrorSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'onPostResponseError')
			.mockImplementation(jest.fn())

		ViewerAPI.postEvent.mockRejectedValueOnce(Error('mock-error'))

		questionStore.state = {
			contexts: {
				mockContext: {
					responseMetadata: {
						mockId: {
							details: 'mock-details',
							time: 'mock-time'
						}
					}
				}
			}
		}

		await questionStore.getPostResponsePromise('mockId', 'mockContext')

		expect(onPostResponseErrorSpy).toHaveBeenCalledWith(
			Error('mock-error'),
			questionStore.state.contexts.mockContext,
			'mockId'
		)

		onPostResponseErrorSpy.mockRestore()
	})

	test('setResponse returns false and does nothing when context state does not exist', () => {
		const questionStore = new QuestionStoreClass()
		const questionUtilSpy = jest.spyOn(QuestionUtil, 'sendResponse').mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.setResponse({ context: 'mockContext2' })).toBe(false)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})

		expect(questionUtilSpy).not.toHaveBeenCalled()

		questionUtilSpy.mockRestore()
	})

	test('setResponse updates state and returns true', () => {
		const questionStore = new QuestionStoreClass()
		const questionUtilSpy = jest.spyOn(QuestionUtil, 'sendResponse').mockImplementation(jest.fn())
		// Override Date
		const originalDate = global.Date
		Object.defineProperty(global, 'Date', {
			value: () => ({ mockDate: true }),
			enumerable: true,
			configurable: true
		})

		questionStore.state = {
			contexts: {
				mockContext: {
					responses: {},
					responseMetadata: {}
				}
			}
		}

		expect(
			questionStore.setResponse({
				id: 'mockId',
				response: 'mockResponse',
				targetId: 'mockTargetId',
				context: 'mockContext',
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				sendResponseImmediately: false
			})
		).toBe(true)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					responses: {
						mockId: 'mockResponse'
					},
					responseMetadata: {
						mockId: {
							time: { mockDate: true },
							sendState: 'notSent',
							details: {
								questionId: 'mockId',
								response: 'mockResponse',
								targetId: 'mockTargetId',
								context: 'mockContext',
								assessmentId: 'mockAssessmentId',
								attemptId: 'mockAttemptId',
								sendResponseImmediately: false
							}
						}
					}
				}
			}
		})

		expect(questionUtilSpy).not.toHaveBeenCalled()

		questionUtilSpy.mockRestore()

		// Restore Date:
		Object.defineProperty(global, 'Date', {
			value: originalDate
		})
	})

	test('setResponse updates state, returns true, calls QuestionUtil.sendResponse if sendResponseImmediately=true', () => {
		const questionStore = new QuestionStoreClass()
		const questionUtilSpy = jest.spyOn(QuestionUtil, 'sendResponse').mockImplementation(jest.fn())
		// Override Date
		const originalDate = global.Date
		Object.defineProperty(global, 'Date', {
			value: () => ({ mockDate: true }),
			enumerable: true,
			configurable: true
		})

		questionStore.state = {
			contexts: {
				mockContext: {
					responses: {},
					responseMetadata: {}
				}
			}
		}

		expect(
			questionStore.setResponse({
				id: 'mockId',
				response: 'mockResponse',
				targetId: 'mockTargetId',
				context: 'mockContext',
				assessmentId: 'mockAssessmentId',
				attemptId: 'mockAttemptId',
				sendResponseImmediately: true
			})
		).toBe(true)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					responses: {
						mockId: 'mockResponse'
					},
					responseMetadata: {
						mockId: {
							time: { mockDate: true },
							sendState: 'notSent',
							details: {
								questionId: 'mockId',
								response: 'mockResponse',
								targetId: 'mockTargetId',
								context: 'mockContext',
								assessmentId: 'mockAssessmentId',
								attemptId: 'mockAttemptId',
								sendResponseImmediately: true
							}
						}
					}
				}
			}
		})

		expect(questionUtilSpy).toHaveBeenCalledWith('mockId', 'mockContext')

		questionUtilSpy.mockRestore()

		// Restore Date:
		Object.defineProperty(global, 'Date', {
			value: originalDate
		})
	})

	test('clearResponse does nothing and returns false if context state does not exist', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.clearResponse('mockId', 'mockContext2')).toBe(false)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})
	})

	test('clearResponse updates state and returns true', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					responses: {
						mockId: {}
					},
					responseMetadata: {
						mockId: {}
					}
				}
			}
		}

		expect(questionStore.clearResponse('mockId', 'mockContext')).toBe(true)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					responses: {},
					responseMetadata: {}
				}
			}
		})
	})

	test('setData updates state', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					data: {}
				}
			}
		}

		questionStore.setData({
			context: 'mockContext',
			key: 'key',
			value: 'value'
		})

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					data: {
						key: 'value'
					}
				}
			}
		})
	})

	test('showExplanation fires an event and sets data', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.showExplanation({
			id: 'mockId',
			context: 'mockContext'
		})

		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:showExplanation',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext'
			}
		})

		expect(QuestionUtil.setData).toHaveBeenCalledWith(
			'mockId',
			'mockContext',
			'showingExplanation',
			true
		)
	})

	test('hideExplanation fires an event and clears data', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.hideExplanation({
			id: 'mockId',
			context: 'mockContext',
			actor: 'mockActor'
		})

		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:hideExplanation',
			eventVersion: '1.2.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext',
				actor: 'mockActor'
			}
		})

		expect(QuestionUtil.clearData).toHaveBeenCalledWith(
			'mockId',
			'mockContext',
			'showingExplanation'
		)
	})

	test('clearData does nothing and returns false if context state does not exist', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.clearData({ context: 'mockContext2', key: 'key' })).toBe(false)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})
	})

	test('clearData updates state and returns true', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					data: {
						key: 'value'
					}
				}
			}
		}

		expect(questionStore.clearData({ context: 'mockContext', key: 'key' })).toBe(true)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					data: {}
				}
			}
		})
	})

	test('hide does nothing and returns false if context state does not exist', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.hide({ context: 'mockContext2', id: 'mockId' })).toBe(false)
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})
	})

	test('hide updates state, fires an event and returns true', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					viewing: 'mockId',
					viewedQuestions: {
						mockId: true
					},
					revealedQuestions: {
						mockId: true
					}
				}
			}
		}

		expect(questionStore.hide({ context: 'mockContext', id: 'mockId' })).toBe(true)
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:hide',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext'
			}
		})
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					revealedQuestions: {}
				}
			}
		})
	})

	test('hide updates state, fires an event and returns true (even when not viewing that question)', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					viewing: 'someOtherId',
					viewedQuestions: {
						mockId: true
					},
					revealedQuestions: {
						mockId: true
					}
				}
			}
		}

		expect(questionStore.hide({ context: 'mockContext', id: 'mockId' })).toBe(true)
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:hide',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext'
			}
		})
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					viewing: 'someOtherId',
					viewedQuestions: {},
					revealedQuestions: {}
				}
			}
		})
	})

	test('view updates state, fires event', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {}
		}

		questionStore.view({ context: 'mockContext', id: 'mockId' })
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:view',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext'
			}
		})
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					viewing: 'mockId',
					viewedQuestions: { mockId: true },
					revealedQuestions: {},
					scores: {},
					responses: {},
					responseMetadata: {},
					sendingResponsePromises: {},
					data: {}
				}
			}
		})

		questionStore.view({ context: 'mockContext', id: 'mockId2' })
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:view',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId2',
				context: 'mockContext'
			}
		})
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					viewing: 'mockId2',
					viewedQuestions: { mockId: true, mockId2: true },
					revealedQuestions: {},
					scores: {},
					responses: {},
					responseMetadata: {},
					sendingResponsePromises: {},
					data: {}
				}
			}
		})
	})

	test('checkAnswer does nothing and returns false if context state does not exist', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.checkAnswer({ context: 'mockContext2', id: 'mockId' })).toBe(false)
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})
	})

	test('checkAnswer fires an event and returns true', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					scores: {
						mockId: {
							id: 'mockScoreId',
							score: 'mockScore'
						}
					},
					responses: {
						mockId: 'mockResponse'
					}
				}
			}
		}

		expect(questionStore.checkAnswer({ context: 'mockContext', id: 'mockId' })).toBe(true)
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:checkAnswer',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext',
				response: 'mockResponse',
				scoreId: 'mockScoreId',
				score: 'mockScore'
			}
		})
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					scores: {
						mockId: {
							id: 'mockScoreId',
							score: 'mockScore'
						}
					},
					responses: {
						mockId: 'mockResponse'
					}
				}
			}
		})
	})

	test('submitResponse does nothing and returns false if context state does not exist', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.submitResponse({ context: 'mockContext2', id: 'mockId' })).toBe(false)
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})
	})

	test('submitResponse fires an event and returns true', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					responses: {
						mockId: 'mockResponse'
					}
				}
			}
		}

		expect(questionStore.submitResponse({ context: 'mockContext', id: 'mockId' })).toBe(true)
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:submitResponse',
			eventVersion: '1.0.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext',
				response: 'mockResponse'
			}
		})
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					responses: {
						mockId: 'mockResponse'
					}
				}
			}
		})
	})

	test('retry does nothing and returns false if context state does not exist', () => {
		const questionStore = new QuestionStoreClass()
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.retry({ context: 'mockContext2', id: 'mockId' })).toBe(false)
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(QuestionUtil.isShowingExplanation).not.toHaveBeenCalled()
		expect(QuestionUtil.hideExplanation).not.toHaveBeenCalled()
		expect(QuestionUtil.clearScore).not.toHaveBeenCalled()
		expect(triggerSpy).not.toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})

		triggerSpy.mockRestore()
	})

	test('retry updates state, fires an event, trigger change and returns true', () => {
		const questionStore = new QuestionStoreClass()
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())
		QuestionUtil.isShowingExplanation.mockReturnValueOnce(false)

		questionStore.state = {
			contexts: {
				mockContext: {
					responses: {
						mockId: 'mockResponse'
					},
					responseMetadata: {
						mockId: 'mockResponseMetadata'
					},
					revealedQuestions: {
						mockId: true
					}
				}
			}
		}

		expect(questionStore.retry({ context: 'mockContext', id: 'mockId' })).toBe(true)
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:retry',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext'
			}
		})
		expect(QuestionUtil.isShowingExplanation).toHaveBeenCalledWith(
			questionStore.state,
			{ mockOboModel: true },
			'mockContext'
		)
		expect(QuestionUtil.hideExplanation).not.toHaveBeenCalled()
		expect(QuestionUtil.clearScore).toHaveBeenCalledWith('mockId', 'mockContext')
		expect(triggerSpy).toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					responses: {},
					responseMetadata: {},
					revealedQuestions: {}
				}
			}
		})

		triggerSpy.mockRestore()
	})

	test('retry updates state, fires an event, trigger change and returns true (and hides explanation if it exists)', () => {
		const questionStore = new QuestionStoreClass()
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())
		QuestionUtil.isShowingExplanation.mockReturnValueOnce(true)

		questionStore.state = {
			contexts: {
				mockContext: {
					responses: {
						mockId: 'mockResponse'
					},
					responseMetadata: {
						mockId: 'mockResponseMetadata'
					},
					revealedQuestions: {
						mockId: true
					}
				}
			}
		}

		expect(questionStore.retry({ context: 'mockContext', id: 'mockId' })).toBe(true)
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:retry',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext'
			}
		})
		expect(QuestionUtil.isShowingExplanation).toHaveBeenCalledWith(
			questionStore.state,
			{ mockOboModel: true },
			'mockContext'
		)
		expect(QuestionUtil.hideExplanation).toHaveBeenCalledWith(
			'mockId',
			'mockContext',
			'viewerClient'
		)
		expect(QuestionUtil.clearScore).toHaveBeenCalledWith('mockId', 'mockContext')
		expect(triggerSpy).toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					responses: {},
					responseMetadata: {},
					revealedQuestions: {}
				}
			}
		})

		triggerSpy.mockRestore()
	})

	test('revealAnswer does nothing and returns false if no context state exists', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.revealAnswer({ context: 'mockContext2', id: 'mockId' })).toBe(false)
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})
	})

	test('revealAnswer fires an event, updates state and returns true', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					revealedQuestions: {}
				}
			}
		}

		expect(questionStore.revealAnswer({ context: 'mockContext', id: 'mockId' })).toBe(true)
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:revealAnswer',
			eventVersion: '1.0.0',
			visitId: 'mockVisitId',
			payload: {
				questionId: 'mockId',
				context: 'mockContext'
			}
		})
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					revealedQuestions: {
						mockId: true
					}
				}
			}
		})
	})

	test('scoreSet does nothing and returns false if no context state exists', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.scoreSet({ context: 'mockContext2' })).toBe(false)
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(FocusUtil.clearFadeEffect).not.toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})
	})

	test('scoreSet for "no-score" updates state, clears fade effect and returns true', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					scores: {}
				}
			}
		}

		expect(
			questionStore.scoreSet({
				itemId: 'mockItemId',
				context: 'mockContext',
				score: 'no-score',
				details: 'mockDetails',
				feedbackText: 'mockFeedbackText',
				detailedText: 'mockDetailedText'
			})
		).toBe(true)
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(FocusUtil.clearFadeEffect).toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					scores: {
						mockItemId: {
							id: 'mockUuid',
							score: 'no-score',
							details: 'mockDetails',
							feedbackText: 'mockFeedbackText',
							detailedText: 'mockDetailedText',
							itemId: 'mockItemId'
						}
					}
				}
			}
		})
	})

	test('scoreSet for "100" updates state, clears fade effect, fires an event and returns true', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					scores: {}
				}
			}
		}

		expect(
			questionStore.scoreSet({
				itemId: 'mockItemId',
				context: 'mockContext',
				score: 100,
				details: 'mockDetails',
				feedbackText: 'mockFeedbackText',
				detailedText: 'mockDetailedText'
			})
		).toBe(true)
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:scoreSet',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				id: 'mockUuid',
				itemId: 'mockItemId',
				score: 100,
				details: 'mockDetails',
				context: 'mockContext'
			}
		})
		expect(FocusUtil.clearFadeEffect).toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					scores: {
						mockItemId: {
							id: 'mockUuid',
							score: 100,
							details: 'mockDetails',
							feedbackText: 'mockFeedbackText',
							detailedText: 'mockDetailedText',
							itemId: 'mockItemId'
						}
					}
				}
			}
		})
	})

	test('scoreSet for "0" updates state, does not clear fade effect, fires an event and returns true', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					scores: {}
				}
			}
		}

		expect(
			questionStore.scoreSet({
				itemId: 'mockItemId',
				context: 'mockContext',
				score: 0,
				details: 'mockDetails',
				feedbackText: 'mockFeedbackText',
				detailedText: 'mockDetailedText'
			})
		).toBe(true)
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:scoreSet',
			eventVersion: '1.1.0',
			visitId: 'mockVisitId',
			payload: {
				id: 'mockUuid',
				itemId: 'mockItemId',
				score: 0,
				details: 'mockDetails',
				context: 'mockContext'
			}
		})
		expect(FocusUtil.clearFadeEffect).not.toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					scores: {
						mockItemId: {
							id: 'mockUuid',
							score: 0,
							details: 'mockDetails',
							feedbackText: 'mockFeedbackText',
							detailedText: 'mockDetailedText',
							itemId: 'mockItemId'
						}
					}
				}
			}
		})
	})

	test('scoreClear does nothing and returns false if no context state exists', () => {
		const questionStore = new QuestionStoreClass()
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.scoreClear({ context: 'mockContext2' })).toBe(false)
		expect(triggerSpy).not.toHaveBeenCalled()
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {}
			}
		})

		triggerSpy.mockRestore()
	})

	test('scoreClear updates state, calls triggerChange, and fires an event (if the score is not "no-score")', () => {
		const questionStore = new QuestionStoreClass()
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {
					scores: {
						mockId: {
							score: 100,
							mockData: true
						}
					}
				}
			}
		}

		expect(questionStore.scoreClear({ context: 'mockContext', itemId: 'mockId' })).toBe(true)
		expect(triggerSpy).toHaveBeenCalled()
		expect(ViewerAPI.postEvent).toHaveBeenCalledWith({
			draftId: 'mockDraftId',
			action: 'question:scoreClear',
			eventVersion: '1.0.0',
			visitId: 'mockVisitId',
			payload: {
				score: 100,
				mockData: true
			}
		})
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					scores: {}
				}
			}
		})

		triggerSpy.mockRestore()
	})

	test('scoreClear updates state, calls triggerChange but does not fire an event (if the score is "no-score")', () => {
		const questionStore = new QuestionStoreClass()
		const triggerSpy = jest
			.spyOn(QuestionStoreClass.prototype, 'triggerChange')
			.mockImplementation(jest.fn())

		questionStore.state = {
			contexts: {
				mockContext: {
					scores: {
						mockId: {
							score: 'no-score',
							mockData: true
						}
					}
				}
			}
		}

		expect(questionStore.scoreClear({ context: 'mockContext', itemId: 'mockId' })).toBe(true)
		expect(triggerSpy).toHaveBeenCalled()
		expect(ViewerAPI.postEvent).not.toHaveBeenCalled()
		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					scores: {}
				}
			}
		})

		triggerSpy.mockRestore()
	})

	test('getContextState returns null if that state does not exist', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.getContextState('mockContext2')).toBe(null)
	})

	test('getContextState returns the given context state', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.getContextState('mockContext')).toBe(
			questionStore.state.contexts.mockContext
		)
	})

	test('hasContextState returns if the context state exists', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {}
			}
		}

		expect(questionStore.hasContextState('mockContext')).toBe(true)
		expect(questionStore.hasContextState('mockContext2')).toBe(false)
	})

	test('getOrCreateContextState returns an existing context state if it exists and creates one if it does not', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					revealedQuestions: {},
					scores: {},
					responses: {},
					responseMetadata: {},
					sendingResponsePromises: {},
					data: {}
				}
			}
		}

		expect(questionStore.getOrCreateContextState('mockContext')).toBe(
			questionStore.state.contexts.mockContext
		)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					revealedQuestions: {},
					scores: {},
					responses: {},
					responseMetadata: {},
					sendingResponsePromises: {},
					data: {}
				}
			}
		})

		expect(questionStore.getOrCreateContextState('mockContext2')).toBe(
			questionStore.state.contexts.mockContext2
		)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					viewing: null,
					viewedQuestions: {},
					revealedQuestions: {},
					scores: {},
					responses: {},
					responseMetadata: {},
					sendingResponsePromises: {},
					data: {}
				},
				mockContext2: {
					viewing: null,
					viewedQuestions: {},
					revealedQuestions: {},
					scores: {},
					responses: {},
					responseMetadata: {},
					sendingResponsePromises: {},
					data: {}
				}
			}
		})
	})

	test('updateStateByContext updates mutliple values of a given context', () => {
		const questionStore = new QuestionStoreClass()

		questionStore.state = {
			contexts: {
				mockContext: {
					a: 1
				}
			}
		}

		questionStore.updateStateByContext(
			{
				b: 2,
				c: 3
			},
			'mockContext'
		)

		expect(questionStore.state).toEqual({
			contexts: {
				mockContext: {
					a: 1,
					b: 2,
					c: 3
				}
			}
		})
	})

	test('getState returns state', () => {
		const mockState = {}
		QuestionStore.state = mockState
		expect(QuestionStore.getState()).toBe(mockState)
	})

	test('setStates sets the state', () => {
		const mockState = {}
		QuestionStore.setState(mockState)
		expect(QuestionStore.state).toBe(mockState)
	})
})
