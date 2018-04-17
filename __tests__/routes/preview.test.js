jest.mock('../../logger')
jest.mock('../../routes/create-visit', () => ({
	createPreviewVisit: jest.fn()
}))

describe('preview route', () => {
	const logger = oboRequire('logger')
	const User = oboRequire('models/user')
	const { mockRouterMethods } = require('../../__mocks__/__mock_express')
	const mockReq = {
		requireCurrentUser: jest.fn(),
		params: { draftId: 'mocked-draft-id' },
		app: {
			locals: {
				paths: 'paths',
				modules: 'modules'
			},
			get: jest.fn()
		},
		session: {
			save: cb => cb()
		}
	}
	const mockRes = {
		redirect: jest.fn()
	}
	const mockNext = jest.fn()
	const { createPreviewVisit } = require('../../routes/create-visit')

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockReq.requireCurrentUser.mockReset()
		mockReq.app.get.mockReset()
		mockRes.redirect.mockReset()
		mockNext.mockReset()
		createPreviewVisit.mockReturnValueOnce({ id: 'mocked-visit-id' })
		oboRequire('routes/preview')
	})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.post).toHaveBeenCalledTimes(0)
		expect(mockRouterMethods.get).toBeCalledWith('/:draftId', expect.any(Function))
	})

	test('GET preview/:draftId redirects to a visit (if user can view the editor)', () => {
		expect.assertions(2)

		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		let user = new User()
		user.canViewEditor = () => true

		mockReq.requireCurrentUser.mockResolvedValueOnce(user)

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(createPreviewVisit).toBeCalledWith(0, 'mocked-draft-id')
			expect(mockRes.redirect).toBeCalledWith('/view/mocked-draft-id/visit/mocked-visit-id')
		})
	})

	test('GET preview/:draftId fails if user cannot view the editor', () => {
		expect.assertions(2)

		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		let user = new User()
		let error = new Error('Not authorized to preview')

		mockReq.requireCurrentUser.mockResolvedValueOnce(user)

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith(error)
			expect(mockNext).toBeCalledWith(error)
		})
	})

	test('GET preview/:draftId logs error and calls next if error thrown', () => {
		expect.assertions(2)

		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		let mockedError = new Error('mocked-error')

		mockReq.requireCurrentUser.mockRejectedValueOnce(mockedError)

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith(mockedError)
			expect(mockNext).toBeCalledWith(mockedError)
		})
	})
})
