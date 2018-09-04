const Util = require('../../server/util')
const logger = oboRequire('logger')

describe('Util', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('logAndRespondToUnexpected calls res.unexpected and logs error', () => {
		let res = {
			unexpected: jest.fn()
		}
		let req = {}
		let mockError = new Error('mockUnexpectedError')

		Util.logAndRespondToUnexpected(mockError.message, res, req, mockError)
		expect(res.unexpected).toHaveBeenCalledWith('mockUnexpectedError')
		expect(logger.error).toHaveBeenCalledWith(
			'logAndRespondToUnexpected',
			'mockUnexpectedError',
			mockError
		)
	})
})
