jest.mock('../../models/draft')
jest.mock('../../models/visit')
jest.mock('../../models/user')
jest.mock('../../viewer/viewer_state')
jest.mock('../../logger')
jest.mock('../../insert_event')
jest.mock('../../routes/api/events/create_caliper_event')

// make sure all Date objects use a static date
mockStaticDate()

describe('viewer route', () => {
	const insertEvent = oboRequire('insert_event')
	const caliperEvent = oboRequire('routes/api/events/create_caliper_event')
	const logger = oboRequire('logger')
	const Draft = oboRequire('models/draft')
	const Visit = oboRequire('models/visit')
	const User = oboRequire('models/user')
	const GuestUser = oboRequire('models/guest_user')
	const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')
	const mockReq = {
		requireCurrentUser: jest.fn(),
		params: {
			draftId: 555,
			visitId: 'mocked-visit-id'
		},
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
		},
		connection: {
			remoteAddress: 'remoteAddress'
		}
	}
	const mockRes = {
		render: jest.fn(),
		redirect: jest.fn()
	}
	const mockNext = jest.fn()

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockReq.requireCurrentUser.mockReset()
		mockReq.app.get.mockReset()
		mockRes.render.mockReset()
		mockNext.mockReset()
		Visit.createVisit.mockReturnValueOnce({
			visitId: 'mocked-visit-id',
			deactivatedVisitId: 'mocked-deactivated-visit-id'
		})
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

	test('view/draft/visit inserts viewer:open event and calls createViewerOpenEvent', () => {
		expect.assertions(2)
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(insertEvent).toBeCalledWith({
				action: 'viewer:open',
				actorTime: '2016-09-22T16:57:14.500Z',
				caliperPayload: undefined,
				draftId: 555,
				eventVersion: '1.1.0',
				ip: 'remoteAddress',
				metadata: {},
				payload: { visitId: 'mocked-visit-id' },
				userId: 1
			})
			expect(caliperEvent().createViewerOpenEvent).toBeCalledWith({
				actor: { id: 1, type: 'user' },
				isPreviewMode: undefined,
				sessionIds: { launchId: undefined, sessionId: undefined },
				visitId: 'mocked-visit-id'
			})
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

	test('POST view/:draftId/:page? redirects to a visit', () => {
		expect.assertions(2)

		let routeFunction = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(Visit.createVisit).toBeCalledWith(
				1,
				555,
				'mocked-resource-link-id',
				'mocked-launch-id'
			)
			expect(mockRes.redirect).toBeCalledWith('/view/555/visit/mocked-visit-id')
		})
	})

	test('POST view/:draftId/:page? inserts visit:create event and calls createVisitCreateEvent', () => {
		expect.assertions(2)
		let routeFunction = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(insertEvent).toBeCalledWith({
				action: 'visit:create',
				actorTime: '2016-09-22T16:57:14.500Z',
				caliperPayload: undefined,
				draftId: 555,
				eventVersion: '1.0.0',
				ip: 'remoteAddress',
				metadata: {},
				payload: { deactivatedVisitId: 'mocked-deactivated-visit-id', visitId: 'mocked-visit-id' },
				userId: 1
			})
			expect(caliperEvent().createVisitCreateEvent).toBeCalledWith({
				actor: { id: 1, type: 'user' },
				isPreviewMode: undefined,
				sessionIds: { launchId: undefined, sessionId: undefined },
				visitId: 'mocked-visit-id',
				extensions: { deactivatedVisitId: 'mocked-deactivated-visit-id' }
			})
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
