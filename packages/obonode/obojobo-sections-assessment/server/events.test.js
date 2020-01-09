describe('Assessment server Events', () => {
	jest.setMock('obojobo-express/logger', require('obojobo-express/__mocks__/logger'))
	jest.setMock('obojobo-express/db', require('obojobo-express/__mocks__/db'))
	jest.mock('obojobo-express/obo_events')
	jest.mock('obojobo-express/db')
	jest.mock('obojobo-express/logger')
	jest.mock('obojobo-express/models/draft')

	let oboEvents
	let db
	let logger

	beforeEach(() => {
		jest.resetAllMocks()
		jest.resetModules()
		oboEvents = require('obojobo-express/obo_events')
		db = require('obojobo-express/db')
		logger = require('obojobo-express/logger')
		require('./events')
	})

	test('registers expected listeners', () => {
		expect(oboEvents.on).toHaveBeenCalledTimes(1)
		const [eventName, eventListener] = oboEvents.on.mock.calls[0]
		expect(eventName).toBe('client:question:setResponse')
		expect(eventListener).toEqual(expect.any(Function))
	})

	test('resolves if event has no questionId', () => {
		// verify we have the right callback
		const eventListener = oboEvents.on.mock.calls[0][1]
		const eventObj = { payload: { assessmentId: 9, attemptId: 1, response: 3 } }
		const mockReq = { mockReq: true }
		return expect(eventListener(eventObj, mockReq)).resolves.toBe(undefined) //eslint-disable-line no-undefined
	})

	test('returns if event has no attemptId', () => {
		// verify we have the right callback
		const eventListener = oboEvents.on.mock.calls[0][1]
		const eventObj = { payload: { assessmentId: 9, questionId: 1, response: 3 } }
		const mockReq = { mockReq: true }
		return expect(eventListener(eventObj, mockReq)).resolves.toBe(undefined) //eslint-disable-line no-undefined
	})

	test('returns if event has no assessmentId', () => {
		// verify we have the right callback
		const eventListener = oboEvents.on.mock.calls[0][1]
		const eventObj = { payload: { attemptId: 1, questionId: 1, response: 3 } }
		const mockReq = { mockReq: true }
		return expect(eventListener(eventObj, mockReq)).resolves.toBe(undefined) //eslint-disable-line no-undefined
	})

	test('returns if event has no response', () => {
		// verify we have the right callback
		const eventListener = oboEvents.on.mock.calls[0][1]
		const eventObj = { payload: { assessmentId: 22, attemptId: 1, questionId: 1 } }
		const mockReq = { mockReq: true }
		return expect(eventListener(eventObj, mockReq)).resolves.toBe(undefined) //eslint-disable-line no-undefined
	})

	test('logs error when missing questionId', () => {
		// verify we have the right callback
		const eventListener = oboEvents.on.mock.calls[0][1]

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
			    [Error: Missing Question ID],
			    "Error: Missing Question ID",
			  ],
			]
		`)
		})
	})

	test('inserts responses into the database', () => {
		// verify we have the right callback
		const eventListener = oboEvents.on.mock.calls[0][1]

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
})
