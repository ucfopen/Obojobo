jest.mock('fs')
jest.mock('../dev_nonce_store')
jest.mock('../logger')
jest.mock('express-ims-lti', () => {
	return jest.fn()
})

import fs from 'fs'
import ltiMiddleware from 'express-ims-lti'
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

		ltiMiddleware.mockImplementationOnce(obj => {
			return key => {
				obj.credentials(key, jest.fn())
			}
		})
		oboLtiMiddleware = require('../obo_ims_lti')
	})
	afterAll(() => {
		delete global.EXPIRE_IN_SEC
	})
	beforeEach(() => {
		logger.error.mockReset()
	})

	test('Middleware loads as expected', () => {
		oboLtiMiddleware('mockKey')

		expect(logger.error).not.toHaveBeenCalled()
	})

	test('Middleware loads with no secret', () => {
		oboLtiMiddleware('mockNotKey')

		expect(logger.error).toHaveBeenCalledWith('LTI unable to find secret for key')
	})
})
