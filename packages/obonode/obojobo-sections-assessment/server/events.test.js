describe('Assessment server Events', () => {
	jest.mock('obojobo-express/server/obo_events')
	jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/config')
	jest.mock('obojobo-express/server/logger')
	jest.mock('obojobo-express/server/models/draft')

	let oboEvents
	let db
	let logger

	const getListenerFor = eventName => {
		// locate the call with the given event name
		const matchingCall = oboEvents.on.mock.calls.find(args => args[0] === eventName)
		// error if not found
		if (!matchingCall) throw Error(`event listener ${eventName} not found`)
		// return the callbackFn
		return matchingCall[1]
	}

	beforeEach(() => {
		jest.resetAllMocks()
		jest.resetModules()
		oboEvents = require('obojobo-express/server/obo_events')
		db = require('obojobo-express/server/db')
		logger = require('obojobo-express/server/logger')
		require('./events')
	})

	test('registers expected listeners', () => {
		expect(oboEvents.on).toHaveBeenCalledTimes(2)
		expect(oboEvents.on).toHaveBeenCalledWith('client:question:setResponse', expect.any(Function))
		expect(oboEvents.on).toHaveBeenCalledWith('EVENT_BEFORE_NEW_VISIT', expect.any(Function))
	})

	test('setResponse listener resolves if event has no questionId', () => {
		const eventListener = getListenerFor('client:question:setResponse')
		const eventObj = { payload: { assessmentId: 9, attemptId: 1, response: 3 } }
		const mockReq = { mockReq: true }
		return expect(eventListener(eventObj, mockReq)).resolves.toBe(undefined) //eslint-disable-line no-undefined
	})

	test('setResponse returns if event has no attemptId', () => {
		const eventListener = getListenerFor('client:question:setResponse')
		const eventObj = { payload: { assessmentId: 9, questionId: 1, response: 3 } }
		const mockReq = { mockReq: true }
		return expect(eventListener(eventObj, mockReq)).resolves.toBe(undefined) //eslint-disable-line no-undefined
	})

	test('setResponse returns if event has no assessmentId', () => {
		const eventListener = getListenerFor('client:question:setResponse')
		const eventObj = { payload: { attemptId: 1, questionId: 1, response: 3 } }
		const mockReq = { mockReq: true }
		return expect(eventListener(eventObj, mockReq)).resolves.toBe(undefined) //eslint-disable-line no-undefined
	})

	test('setResponse returns if event has no response', () => {
		const eventListener = getListenerFor('client:question:setResponse')
		const eventObj = { payload: { assessmentId: 22, attemptId: 1, questionId: 1 } }
		const mockReq = { mockReq: true }
		return expect(eventListener(eventObj, mockReq)).resolves.toBe(undefined) //eslint-disable-line no-undefined
	})

	test('setResponse logs error when missing questionId', () => {
		const eventListener = getListenerFor('client:question:setResponse')
		const eventObj = { payload: { assessmentId: 22, attemptId: 1, response: 3 } }
		const mockReq = { mockReq: true }
		return eventListener(eventObj, mockReq).then(() => {
			expect(logger.error).toHaveBeenCalledTimes(1)
			expect(logger.error.mock.calls).toMatchInlineSnapshot(`
			Array [
			  Array [
			    "client:question:setResponse",
			    Object {
			      "mockReq": true,
			    },
			    Object {
			      "payload": Object {
			        "assessmentId": 22,
			        "attemptId": 1,
			        "response": 3,
			      },
			    },
			    [Error: Missing Question Id],
			    "Error: Missing Question Id",
			  ],
			]
		`)
		})
	})

	test('setResponse inserts responses into the database', () => {
		const eventListener = getListenerFor('client:question:setResponse')
		const eventObj = { payload: { assessmentId: 22, attemptId: 1, questionId: 5, response: 3 } }
		const mockReq = { mockReq: true }
		return eventListener(eventObj, mockReq).then(() => {
			expect(logger.error).toHaveBeenCalledTimes(0)
			expect(db.none).toHaveBeenCalledTimes(1)
			expect(db.none).toHaveBeenCalledWith(
				expect.stringContaining('INSERT INTO attempts_question_responses'),
				{
					assessmentId: 22,
					attemptId: 1,
					questionId: 5,
					response: 3
				}
			)
		})
	})

	test('EVENT_BEFORE_NEW_VISIT uses config allowImportDefault true', () => {
		require('obojobo-express/server/config').general.allowImportDefault = true
		const eventListener = getListenerFor('EVENT_BEFORE_NEW_VISIT')
		const mockReq = {
			body: {},
			params: {}
		}
		eventListener({ req: mockReq })
		expect(mockReq).toHaveProperty('visitOptions')
		expect(mockReq).toHaveProperty('visitOptions.isScoreImportable', true)
	})

	test('EVENT_BEFORE_NEW_VISIT uses config allowImportDefault false', () => {
		require('obojobo-express/server/config').general.allowImportDefault = false
		const eventListener = getListenerFor('EVENT_BEFORE_NEW_VISIT')
		const mockReq = {
			body: {},
			params: {}
		}
		eventListener({ req: mockReq })
		expect(mockReq).toHaveProperty('visitOptions')
		expect(mockReq).toHaveProperty('visitOptions.isScoreImportable', false)
	})

	test('EVENT_BEFORE_NEW_VISIT uses body variable', () => {
		require('obojobo-express/server/config').general.allowImportDefault = false
		const eventListener = getListenerFor('EVENT_BEFORE_NEW_VISIT')
		const mockReq = {
			body: {
				score_import: true
			},
			params: {}
		}
		eventListener({ req: mockReq })
		expect(mockReq).toHaveProperty('visitOptions')
		expect(mockReq).toHaveProperty('visitOptions.isScoreImportable', true)
	})

	test('EVENT_BEFORE_NEW_VISIT uses params variable', () => {
		require('obojobo-express/server/config').general.allowImportDefault = false
		const eventListener = getListenerFor('EVENT_BEFORE_NEW_VISIT')
		const mockReq = {
			body: {},
			params: {
				score_import: true
			}
		}
		eventListener({ req: mockReq })
		expect(mockReq).toHaveProperty('visitOptions')
		expect(mockReq).toHaveProperty('visitOptions.isScoreImportable', true)
	})

	test('EVENT_BEFORE_NEW_VISIT reuses existing req.visitOptions', () => {
		const eventListener = getListenerFor('EVENT_BEFORE_NEW_VISIT')
		const mockReq = {
			body: {},
			params: {},
			visitOptions: {
				['its-a-me']: 'mario'
			}
		}
		eventListener({ req: mockReq })
		expect(mockReq).toHaveProperty('visitOptions')
		expect(mockReq).toHaveProperty('visitOptions.its-a-me', 'mario')
	})

	test('EVENT_BEFORE_NEW_VISIT handles score_import "true" ', () => {
		require('obojobo-express/server/config').general.allowImportDefault = false
		const eventListener = getListenerFor('EVENT_BEFORE_NEW_VISIT')
		const mockReq = {
			body: {},
			params: {
				score_import: 'true'
			}
		}
		eventListener({ req: mockReq })
		expect(mockReq).toHaveProperty('visitOptions')
		expect(mockReq).toHaveProperty('visitOptions.isScoreImportable', true)
	})

	test('EVENT_BEFORE_NEW_VISIT handles score_import 1 ', () => {
		require('obojobo-express/server/config').general.allowImportDefault = false
		const eventListener = getListenerFor('EVENT_BEFORE_NEW_VISIT')
		const mockReq = {
			body: {},
			params: {
				score_import: 1
			}
		}
		eventListener({ req: mockReq })
		expect(mockReq).toHaveProperty('visitOptions')
		expect(mockReq).toHaveProperty('visitOptions.isScoreImportable', true)
	})

	test('EVENT_BEFORE_NEW_VISIT handles score_import "1" ', () => {
		require('obojobo-express/server/config').general.allowImportDefault = false
		const eventListener = getListenerFor('EVENT_BEFORE_NEW_VISIT')
		const mockReq = {
			body: {},
			params: {
				score_import: '1'
			}
		}
		eventListener({ req: mockReq })
		expect(mockReq).toHaveProperty('visitOptions')
		expect(mockReq).toHaveProperty('visitOptions.isScoreImportable', true)
	})

	test('EVENT_BEFORE_NEW_VISIT ignores errors gracefully', () => {
		expect.hasAssertions()
		require('obojobo-express/server/config').general.allowImportDefault = false
		const eventListener = getListenerFor('EVENT_BEFORE_NEW_VISIT')
		const mockReq = {}
		eventListener({ req: mockReq })
		expect(mockReq).not.toHaveProperty('visitOptions')
	})
})
