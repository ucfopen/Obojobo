let lti
let originalConsole = console
let mockLTIEvent = {
	id: 2,
	lti_key: 'testkey',
	data: {
		lis_outcome_service_url: 'http://test.test.test',
		lis_result_sourcedid: 'test-sourcedid'
	}
}

describe('lti', () => {

	beforeAll(() => {

		global.console = {warn: jest.fn(), log: jest.fn(), error: jest.fn()}

		jest.mock('./db');
		jest.mock('ims-lti/lib/extensions/outcomes')

		let fs = require('fs')
		fs.__setMockFileContents('./config/lti.json', '{"test":{"keys":{"testkey":"testsecret"}}}');

		lti = require('./lti')
	});

	afterAll(() => {
		global.console = originalConsole

	});

	beforeEach(() => {
		console.log.mockClear()
		console.warn.mockClear()
		console.error.mockClear()
	});

	afterEach(() => {
		let outcomes = require('ims-lti/lib/extensions/outcomes')
		outcomes.__resetCallbackForSend_replace_result()
		// originalConsole.log(console.log.mock.calls)
		// originalConsole.log(console.warn.mock.calls)
		// originalConsole.log(console.error.mock.calls)
	});


	it('should find the appropriate secret for a given key', () => {
		let secret = lti.findSecretForKey('testkey')
		expect(secret).toBe('testsecret')
	})

	it('should fail to find an unused key', () => {
		expect(() => {
			lti.findSecretForKey('fakekey')
		}).toThrow()
	})

	it('should fail to replace result when the lti data couldnt be found', () => {
		expect.assertions(2);

		db = require('./db')
		// mock the query to get lti data
		db.one.mockImplementationOnce((query, vars) => {return Promise.reject()})

		return lti.replaceResult(1, 2, 1)
		.then((result) => {
			expect(console.log).toBeCalledWith('No Relevent LTI Request found for user 1, on 2')
			expect(result).toBe(false)
		})
	})

	it('should send correct score to the outcome service', () => {
		expect.assertions(1);

		// bypass all the internals of outcomes, just returns true for success
		let outcomes = require('ims-lti/lib/extensions/outcomes')
		let send_replace_resultMock = jest.fn().mockImplementationOnce((score, callback) => {
			expect(score).toBe(0.85)
			callback(null, true)
		})
		outcomes.__registerCallbackForSend_replace_result(send_replace_resultMock)


		db = require('./db')
		db.one.mockImplementationOnce(() => {return Promise.resolve(mockLTIEvent)}) // mock the query to get lti data
		db.one.mockImplementationOnce(() => {return Promise.resolve(null)}) // mock insert event

		return lti.replaceResult(1, 2, 0.85)
	})

	it('should insert an event on success', () => {
		expect.assertions(13);

		// bypass all the internals of outcomes, just returns true for success
		let outcomes = require('ims-lti/lib/extensions/outcomes')
		db = require('./db')
		// mock the query to get lti data
		db.one.mockImplementationOnce(() => {return Promise.resolve(mockLTIEvent)})

		// mock the query to insert an event
		db.one.mockImplementationOnce((query, insertObject) => {
			expect(insertObject).toHaveProperty('actorTime')
			expect(insertObject).toHaveProperty('ip')
			expect(insertObject).toHaveProperty('metadata')
			expect(insertObject).toHaveProperty('draftId')
			expect(insertObject).toHaveProperty('payload.launchId')
			expect(insertObject).toHaveProperty('payload.launchKey')
			expect(insertObject).toHaveProperty('payload.error')

			expect(insertObject.payload.body.lis_outcome_service_url).toBe('http://test.test.test')
			expect(insertObject.payload.body.lis_result_sourcedid).toBe('test-sourcedid')
			expect(insertObject.payload.score).toBe(0.85)
			expect(insertObject.payload.result).toBe(true)
			expect(insertObject.userId).toBe(1)
			expect(insertObject.action).toBe('lti:replaceResult')

			return Promise.resolve(null)
		})

		return lti.replaceResult(1, 2, 0.85)
	})

	it('should insert an event on failure', () => {
		expect.assertions(7);

		// bypass all the internals of outcomes, just returns true for success
		let outcomes = require('ims-lti/lib/extensions/outcomes')
		let send_replace_resultMock = jest.fn().mockImplementationOnce((score, callback) => {
			callback('SOME_ERROR')
		})
		outcomes.__registerCallbackForSend_replace_result(send_replace_resultMock)


		db = require('./db')
		// mock the query to get lti data
		db.one.mockImplementationOnce(() => {return Promise.resolve(mockLTIEvent)})
		// mock the query to insert an event
		db.one.mockImplementationOnce((query, insertObject) => {
			expect(insertObject.payload.result).toBeUndefined()
			expect(insertObject.action).toBe('lti:replaceResult')
			expect(insertObject.payload.score).toBe(0.99)
			expect(insertObject.payload.error).toBe('SOME_ERROR')
			return Promise.resolve(null)
		})

		return lti.replaceResult(1, 2, 0.99)
		.catch(err => {
			expect(err).toBeInstanceOf(Error)
			expect(console.log).toBeCalledWith('SETTING LTI OUTCOME SCORE SET to 0.99 for user: 1 on sourcedid: test-sourcedid using key: testkey')
			expect(console.log).toBeCalledWith('replaceResult error!', 'SOME_ERROR')
		})
	})

})
