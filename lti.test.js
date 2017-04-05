let originalConsole = console
global.console = {warn: jest.fn(), log: jest.fn(), error: jest.fn()}
let lti



describe('lti', () => {

	beforeAll(() => {
		jest.mock('fs');
		jest.mock('./db');
		jest.mock('http')
		jest.mock('https')

		let fs = require('fs')
		let dbJson = JSON.stringify({
			test:{
				host: 'hostVal',
				port: 555,
				database: 'databaseVal',
				user: 'userVal',
				password: 'pwVal'
			}
		})

		fs.__setMockFileContents('./config/db.json', dbJson);
		fs.__setMockFileContents('./config/lti.json', '{"test":{"keys":{"testkey":"testsecret"}}}');
		fs.__setMockFileContents('./config/permission_groups.json', '{"test":{"key":"value"}}');
		fs.__setMockFileContents('./config/general.json', '{"test":{"key":"value"}}');

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

	it('should send the correct xml request for an lti replace result call', () => {
		expect.assertions(12);

		// this is the request sent to the lms for sending the score back
		// it's split it two because the value of imsx_messageIdentifier is random
		// so we'll just make sure all the xml around that value exists
		let ltiReplaceResultReqTop = `<?xml version="1.0" encoding="UTF-8"?>
<imsx_POXEnvelopeRequest xmlns="http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
  <imsx_POXHeader>
    <imsx_POXRequestHeaderInfo>
      <imsx_version>V1.0</imsx_version>
      <imsx_messageIdentifier>`

		let ltiReplaceResultReqBottom = `</imsx_messageIdentifier>
    </imsx_POXRequestHeaderInfo>
  </imsx_POXHeader>
  <imsx_POXBody>
    <replaceResultRequest>
      <resultRecord>
        <sourcedGUID>
          <sourcedId>test-sourcedid</sourcedId>
        </sourcedGUID>
        <result>
          <resultScore>
            <language>en</language>
            <textString>0.85</textString>
          </resultScore>
        </result>
      </resultRecord>
    </replaceResultRequest>
  </imsx_POXBody>
</imsx_POXEnvelopeRequest>`

		let ltiReplaceResultResp = `<?xml version="1.0" encoding="UTF-8"?>
<imsx_POXEnvelopeResponse xmlns="http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
  <imsx_POXHeader>
    <imsx_POXResponseHeaderInfo>
      <imsx_version>V1.0</imsx_version>
      <imsx_messageIdentifier>4560</imsx_messageIdentifier>
      <imsx_statusInfo>
        <imsx_codeMajor>success</imsx_codeMajor>
        <imsx_severity>status</imsx_severity>
        <imsx_description>Score for 3124567 is now 0.85</imsx_description>
        <imsx_messageRefIdentifier>999999123</imsx_messageRefIdentifier>
        <imsx_operationRefIdentifier>replaceResult</imsx_operationRefIdentifier>
      </imsx_statusInfo>
    </imsx_POXResponseHeaderInfo>
  </imsx_POXHeader>
  <imsx_POXBody>
    <replaceResultResponse />
  </imsx_POXBody>
</imsx_POXEnvelopeResponse>`

		db = require('./db')
		let http = require('http')
		// mock the query to get lti data
		db.one.mockImplementationOnce((query, vars) => {
			let sampleLTIRequestData = {
				id: 2,
				data: {
					lis_outcome_service_url: 'http://test.test.test',
					lis_result_sourcedid: 'test-sourcedid'
				},
				lti_key: 'testkey'
			}
			return Promise.resolve(sampleLTIRequestData)
		})
		// mock the query to insert an event
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.resolve(null)
		})

		http.request = jest.fn()
		http.request.mockImplementationOnce((options, callback) => {
			expect(options.hostname).toBe('test.test.test')
			expect(options.method).toBe('POST')
			expect(options.path).toBe('/')
			expect(options.headers.Authorization).toEqual(expect.stringContaining('OAuth'))
			expect(options.headers.Authorization).toEqual(expect.stringContaining('oauth_signature_method="HMAC-SHA1"'))
			expect(options.headers.Authorization).toEqual(expect.stringContaining('oauth_consumer_key="testkey"'))
			expect(options.headers.Authorization).toEqual(expect.stringContaining('oauth_signature'))
			expect(options.headers['Content-Type']).toEqual('application/xml')

			let end = jest.fn()
			end.mockImplementationOnce(() => {
				let res = jest.fn()
				res.setEncoding = jest.fn()
				res.statusCode = 200
				res.on = jest.fn().mockImplementation((e,callback) => {
					if(e === 'data') callback(ltiReplaceResultResp)
					if(e === 'end') callback()
				})

				callback(res)
			})

			let on = jest.fn()
			on.mockImplementation((e, callback)=>{
				if(e === 'end') callback()
			})

			let write = jest.fn()
			write.mockImplementation((xml) => {
				expect(xml).toEqual(expect.stringContaining(ltiReplaceResultReqTop))
				expect(xml).toEqual(expect.stringContaining(ltiReplaceResultReqBottom))
			})
			return {
				on: on,
				write: write,
				end: end
			}
		})

		return lti.replaceResult(1, 2, .85)
		.then((result) => {
			expect(console.log).toBeCalledWith('SETTING LTI OUTCOME SCORE SET to 0.85 for user: 1 on sourcedid: test-sourcedid using key: testkey')
			expect(result).toBe(true)
		})
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

	it('should fail to replace result with bogus lms response', () => {
		expect.assertions(4);

		db = require('./db')
		let http = require('http')
		// mock the query to get lti data
		db.one.mockImplementationOnce((query, vars) => {
			let sampleLTIRequestData = {
				id: 2,
				data: {
					lis_outcome_service_url: 'http://test.test.test',
					lis_result_sourcedid: 'test-sourcedid'
				},
				lti_key: 'testkey'
			}
			return Promise.resolve(sampleLTIRequestData)
		})
		// mock the query to insert an event
		db.one.mockImplementationOnce((query, vars) => {
			return Promise.resolve(null)
		})

		http.request = jest.fn()
		http.request.mockImplementationOnce((options, callback) => {
			let end = jest.fn()
			end.mockImplementationOnce(() => {
				let res = jest.fn()
				res.setEncoding = jest.fn()
				res.statusCode = 200
				res.on = jest.fn().mockImplementation((e,callback) => {
					if(e === 'data') callback('THIS SHOULD CAUSE FAILURE')
					if(e === 'end') callback()
				})

				callback(res)
			})
			let on = jest.fn()
			on.mockImplementation((e, callback)=>{
				if(e === 'end') callback()
			})
			return {
				on: on,
				write: jest.fn(),
				end: end
			}
		})

		return lti.replaceResult(1, 2, 1)
		.catch((err) => {
			// expect(console.log).toBeCalledWith('No Relevent LTI Request found for user 1, on 2')
			expect(err).toBeInstanceOf(Error)
			expect(err.message).toBe('Unable to send score to LMS')
			expect(console.log).toBeCalledWith('SETTING LTI OUTCOME SCORE SET to 1 for user: 1 on sourcedid: test-sourcedid using key: testkey')
			expect(console.log).toBeCalledWith('replaceResult error!', new Error('The server responsed with an invalid XML document'))

		})
	})

	it('reject with an error when score is invalid', () => {
		expect.assertions(4);

		db = require('./db')
		let http = require('http')
		// mock the query to get lti data
		db.one.mockImplementationOnce((query, vars) => {
			let sampleLTIRequestData = {
				id: 2,
				data: {
					lis_outcome_service_url: '',
					lis_result_sourcedid: 'test-sourcedid'
				},
				lti_key: 'testkey'
			}
			return Promise.resolve(sampleLTIRequestData)
		})

		return lti.replaceResult(1, 2, 2)
		.catch(err => {
			expect(err).toBeInstanceOf(Error)
			expect(err.message).toBe('Unable to send score to LMS')
			expect(console.log).toBeCalledWith('SETTING LTI OUTCOME SCORE SET to 2 for user: 1 on sourcedid: test-sourcedid using key: testkey')
			expect(console.log).toBeCalledWith('replaceResult error!', new Error('Score must be a floating point number >= 0 and <= 1'))
		})
	})

})
