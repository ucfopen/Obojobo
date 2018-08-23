const Util = require('../../server/util')
const logger = oboRequire('logger')

describe('Util', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('getRandom calls Math.random', () => {
		jest.spyOn(Math, 'random')
		Util.getRandom()
		expect(Math.random).toHaveBeenCalled()
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
