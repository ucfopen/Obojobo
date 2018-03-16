jest.mock('../../models/draft')
jest.mock('../../viewer/viewer_state')

const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('lti route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		oboRequire('routes/viewer')
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.post).toHaveBeenCalledTimes(1)
		expect(mockRouterMethods.post).toBeCalledWith('/:draftId', expect.any(Function))
		expect(mockRouterMethods.get).toBeCalledWith('/:draftId/visit/:visitId*', expect.any(Function))
	})

	test('view/draft/visit rejects guest', () => {
		expect.assertions(1)

		oboRequire('routes/viewer')
		let GuestUser = oboRequire('models/guest_user')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			requireCurrentUser: () => {
				return Promise.resolve(new GuestUser())
			}
		}

		let mockRes = { render: jest.fn() }

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(result => {
				expect(mockNext).toBeCalledWith(Error('Login Required'))
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('view/draft/visit rejects non-logged in users', () => {
		expect.assertions(1)

		oboRequire('routes/viewer')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			requireCurrentUser: val => {
				return Promise.reject('not logged in')
			}
		}

		let mockRes = { render: jest.fn() }

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(result => {
				expect(mockNext).toBeCalledWith('not logged in')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('view/draft/visit rejects non-logged in users', () => {
		expect.assertions(2)

		oboRequire('routes/viewer')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			requireCurrentUser: val => {
				return Promise.reject('not logged in')
			}
		}

		let mockRes = { render: jest.fn() }

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(result => {
				expect(mockRes.render).not.toBeCalled()
				expect(mockNext).toBeCalledWith('not logged in')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('view/draft/visit calls render', () => {
		expect.assertions(2)

		oboRequire('routes/viewer')
		let DraftModel = oboRequire('models/draft')
		let User = oboRequire('models/user')
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]

		let mockReq = {
			requireCurrentUser: () => {
				return Promise.resolve(new User())
			},
			params: { draftId: 555 },
			app: {
				locals: {
					paths: 'paths',
					modules: 'modules'
				},
				get: jest.fn()
			}
		}

		let mockRes = {
			render: jest.fn()
		}

		let mockNext = jest.fn()
		let mockYell = jest.fn().mockImplementationOnce(() => {
			return {
				document: `{"json":"value"}`,
				yell: jest.fn().mockImplementationOnce(() => {
					return 'fake draft'
				})
			}
		})

		DraftModel.__setMockYell(mockYell)

		return routeFunction(mockReq, mockRes, mockNext)
			.then(result => {
				expect(mockYell).toBeCalledWith(
					'internal:sendToClient',
					expect.any(Object),
					expect.any(Object)
				)

				expect(mockRes.render).toBeCalledWith('viewer')
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})
})
