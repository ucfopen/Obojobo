jest.mock('../../models/draft')
const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')

describe('lti route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		oboRequire('routes/viewer')
		expect(mockRouterMethods.all).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.all).toBeCalledWith('/example', expect.any(Function))
		expect(mockRouterMethods.all).toBeCalledWith('/:draftId*', expect.any(Function))
	})

	test('example in dev redirects to view', () => {
		expect.assertions(1)
		oboRequire('routes/viewer')
		let User = oboRequire('models/user')
		let routeFunction = mockRouterMethods.all.mock.calls[0][1]

		//  mock app.get('env') to return 'development'
		let mockReq = {
			app: {
				get: jest.fn().mockImplementationOnce(() => {
					return 'development'
				})
			}
		}

		let mockRes = {
			redirect: jest.fn()
		}

		let mockNext = jest.fn()

		routeFunction(mockReq, mockRes, mockNext)
		expect(mockRes.redirect).toBeCalledWith('/view/00000000-0000-0000-0000-000000000000')
	})

	test('view draft rejects guest', () => {
		expect.assertions(2)

		oboRequire('routes/viewer')
		let GuestUser = oboRequire('models/guest_user')
		let routeFunction = mockRouterMethods.all.mock.calls[1][1]
		let mockReq = {
			getCurrentUser: () => {
				return Promise.resolve(new GuestUser())
			}
		}

		let mockRes = { render: jest.fn() }

		let mockNext = jest.fn()

		return routeFunction(mockReq, mockRes, mockNext)
			.then(result => {
				expect(mockRes.render).not.toBeCalled()
				expect(mockNext).toBeCalledWith(Error('Login Required'))
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('view draft rejects non-logged in users', () => {
		expect.assertions(2)

		oboRequire('routes/viewer')
		let routeFunction = mockRouterMethods.all.mock.calls[1][1]

		let mockReq = {
			getCurrentUser: val => {
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

	test('view draft calls render', () => {
		expect.assertions(2)

		oboRequire('routes/viewer')
		let DraftModel = oboRequire('models/draft')
		let User = oboRequire('models/user')
		let routeFunction = mockRouterMethods.all.mock.calls[1][1]

		let mockReq = {
			getCurrentUser: () => {
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
				expect(mockRes.render).toBeCalledWith(
					expect.any(String),
					expect.objectContaining({
						oboGlobals: expect.objectContaining({
							entries: {
								draft: `"{\"json\":\"value\"}"`,
								draftId: 555,
								ltiLaunch: '{}'
							}
						})
					})
				)
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})
})
