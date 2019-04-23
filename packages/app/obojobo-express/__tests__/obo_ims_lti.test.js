jest.mock('fs')
jest.mock('../dev_nonce_store')
jest.mock('../logger')
jest.mock('ims-lti')

import fs from 'fs'
import logger from '../logger'

let oboLtiMiddleware

describe('Middleware Abstraction', () => {
	beforeAll(() => {
		fs.readFileSync = jest.fn().mockReturnValue(`{
			"test":{
				"driver": "postgres",
				"user": "postgres",
				"password": "mysecretpassword",
				"host": "127.0.0.1",
				"database": "postgres",
				"port": 5432,
				"schema": "",
				"keys": {
					"mockKey":"mockSecret"
				}
			}
		}`)
		global.EXPIRE_IN_SEC = ''

		oboLtiMiddleware = require('../obo_ims_lti')
	})
	afterAll(() => {
		delete global.EXPIRE_IN_SEC
	})
	beforeEach(() => {
		logger.error.mockReset()
	})

	test('Middleware loads as expected', () => {
		const mockNext = jest.fn()
		const mockReq = {
			method: 'POST',
			body: {
				lti_message_type: 'basic-lti-launch-request',
				oauth_consumer_key: 'mockKey'
			}
		}
		oboLtiMiddleware(mockReq, {}, mockNext)

		expect(logger.error).not.toHaveBeenCalled()
	})

	test('Middleware loads with no secret', () => {
		const mockNext = jest.fn()
		const mockReq = {
			method: 'POST',
			body: {
				lti_message_type: 'basic-lti-launch-request',
				oauth_consumer_key: 'mockNotKey'
			}
		}
		oboLtiMiddleware(mockReq, {}, mockNext)

		expect(logger.error).toHaveBeenCalled()
	})
})
