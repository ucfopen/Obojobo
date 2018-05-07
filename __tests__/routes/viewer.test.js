jest.mock('../../models/draft')
jest.mock('../../models/visit')
jest.mock('../../viewer/viewer_state')
jest.mock('../../logger')

describe('viewer route', () => {
	const logger = oboRequire('logger')
	const Draft = oboRequire('models/draft')
	const Visit = oboRequire('models/visit')
	const User = oboRequire('models/user')
	const GuestUser = oboRequire('models/guest_user')
	const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')
	const mockReq = {
		requireCurrentUser: jest.fn(),
		requireCurrentDraft: jest.fn(),
		params: { draftId: 555 },
		app: {
			locals: {
				paths: 'paths',
				modules: 'modules'
			},
			get: jest.fn()
		},
		session: {
			save: cb => cb()
		},
		lti: {
			body: {
				resource_link_id: 'mocked-resource-link-id'
			}
		},
		oboLti: {
			launchId: 'mocked-launch-id'
		}
	}
	const mockRes = {
		render: jest.fn(),
		redirect: jest.fn()
	}
	const mockNext = jest.fn()

	const mockYell = jest.fn()

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockReq.requireCurrentUser.mockReset()
		mockReq.requireCurrentDraft.mockReset()
		mockReq.requireCurrentDraft.mockReturnValue({
			draftId: 555,
			contentId: 12,
			yell: mockYell
		})
		mockReq.app.get.mockReset()
		mockRes.render.mockReset()
		mockNext.mockReset()
		Visit.createVisit.mockReturnValueOnce({ id: 'mocked-visit-id' })
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
		mockYell.mockReturnValueOnce(mockDoc)

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

		mockYell.mockReturnValueOnce(mockDoc)

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(mockRes.render).toBeCalledWith('viewer', { draftTitle: 'my expected title' })
		})
	})

	test('POST view/:draftId/:page? redirects to a visit', () => {
		expect.assertions(2)

		let routeFunction = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(Visit.createVisit).toBeCalledWith(
				0,
				555,
				'mocked-resource-link-id',
				'mocked-launch-id'
			)
			expect(mockRes.redirect).toBeCalledWith('/view/555/visit/mocked-visit-id')
		})
	})

	test('POST view/:draftId/:page? onlogs error and calls next if error', () => {
		expect.assertions(2)

		let routeFunction = mockRouterMethods.post.mock.calls[0][1]
		let mockedError = new Error('mocked-error')

		mockReq.requireCurrentUser.mockRejectedValueOnce(mockedError)

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith(mockedError)
			expect(mockNext).toBeCalledWith(mockedError)
		})
	})
})
