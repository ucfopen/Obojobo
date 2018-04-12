jest.mock('../../models/draft')
jest.mock('../../viewer/viewer_state')

describe('lti route', () => {
	const Draft = oboRequire('models/draft')
	const User = oboRequire('models/user')
	const GuestUser = oboRequire('models/guest_user')
	const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')
	const mockReq = {
		requireCurrentUser: jest.fn(),
		params: { draftId: 555 },
		app: {
			locals: {
				paths: 'paths',
				modules: 'modules'
			},
			get: jest.fn()
		}
	}
	const mockRes = { render: jest.fn() }
	const mockNext = jest.fn()

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockReq.requireCurrentUser.mockReset()
		mockReq.app.get.mockReset()
		mockRes.render.mockReset()
		mockNext.mockReset()
		oboRequire('routes/viewer')
	})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.post).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.post).toBeCalledWith('/:draftId/:page?', expect.any(Function))
		expect(mockRouterMethods.get).toBeCalledWith('/:draftId/visit/:visitId*', expect.any(Function))
	})

	test('view/draft/visit rejects guest', () => {
		expect.assertions(1)
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		mockReq.requireCurrentUser.mockResolvedValueOnce(new GuestUser())

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(mockNext).toBeCalledWith(Error('Login Required'))
		})
	})

	test('view/draft/visit rejects non-logged in users', () => {
		expect.assertions(1)
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		mockReq.requireCurrentUser.mockRejectedValueOnce('not logged in')

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(mockNext).toBeCalledWith('not logged in')
		})
	})

	test('view/draft/visit rejects non-logged in users', () => {
		expect.assertions(2)
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		mockReq.requireCurrentUser.mockRejectedValueOnce('not logged in')

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(mockRes.render).not.toBeCalled()
			expect(mockNext).toBeCalledWith('not logged in')
		})
	})

	test('view/draft/visit calls render', () => {
		expect.assertions(2)
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		let mockDoc = {} // no contents
		let mockYell = jest.fn().mockReturnValueOnce(mockDoc)
		Draft.fetchById.mockResolvedValueOnce({ yell: mockYell })

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(mockYell).toBeCalledWith('internal:sendToClient', mockReq, mockRes)

			expect(mockRes.render).toBeCalledWith('viewer', { draftTitle: '' })
		})
	})

	test('view/draft/visit calls render with the draft title', () => {
		expect.assertions(1)
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		let mockDoc = {
			root: {
				node: {
					content: {
						title: 'my expected title'
					}
				}
			}
		}

		let mockYell = jest.fn().mockReturnValueOnce(mockDoc)
		Draft.fetchById.mockResolvedValueOnce({ yell: mockYell })

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(mockRes.render).toBeCalledWith('viewer', { draftTitle: 'my expected title' })
		})
	})
})
