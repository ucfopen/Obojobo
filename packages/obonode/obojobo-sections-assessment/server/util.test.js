
jest.mock('obojobo-express/logger')

const Util = require('./util')
const logger = require('obojobo-express/logger')

describe('Util', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('logAndRespondToUnexpected calls res.unexpected and logs error', () => {
		const res = {
			unexpected: jest.fn()
		}
		const req = {}
		const mockError = new Error('mockUnexpectedError')

		Util.logAndRespondToUnexpected(mockError.message, res, req, mockError)
		expect(res.unexpected).toHaveBeenCalledWith('mockUnexpectedError')
		expect(logger.error).toHaveBeenCalledWith(
			'logAndRespondToUnexpected',
			'mockUnexpectedError',
			mockError
		)
	})
})
