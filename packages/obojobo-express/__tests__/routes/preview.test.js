jest.mock('../../logger')
jest.mock('../../models/visit')
jest.mock('../../models/user')
jest.mock('../../insert_event', () => jest.fn())

const mockCreateVisitCreateEvent = jest.fn()
jest.mock('../../routes/api/events/create_caliper_event', () =>
	jest.fn().mockReturnValue({
		createVisitCreateEvent: mockCreateVisitCreateEvent
	})
)
// make sure all Date objects use a static date
mockStaticDate()

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
		},
		connection: {
			remoteAddress: 'remoteAddress'
		}
	}
	const mockRes = {
		redirect: jest.fn()
	}
	const mockNext = jest.fn()
	const Visit = oboRequire('models/visit')
	const insertEvent = oboRequire('insert_event')

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockReq.requireCurrentUser.mockReset()
		mockReq.app.get.mockReset()
		mockRes.redirect.mockReset()
		mockNext.mockReset()
		Visit.createPreviewVisit.mockReturnValueOnce({
			visitId: 'mocked-visit-id',
			deactivatedVisitId: 'mocked-deactivated-visit-id'
		})
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
			expect(Visit.createPreviewVisit).toBeCalledWith(1, 'mocked-draft-id')
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

	test('GET preview/:draftId calls visit:create insertEvent and createVisitEvent', () => {
		expect.assertions(2)
		let routeFunction = mockRouterMethods.get.mock.calls[0][1]
		let user = new User()
		user.canViewEditor = true
		mockReq.requireCurrentUser.mockResolvedValueOnce(user)

		return routeFunction(mockReq, mockRes, mockNext).then(result => {
			expect(insertEvent).toBeCalledWith({
				action: 'visit:create',
				actorTime: '2016-09-22T16:57:14.500Z',
				caliperPayload: undefined,
				draftId: 'mocked-draft-id',
				eventVersion: '1.0.0',
				ip: 'remoteAddress',
				metadata: {},
				payload: { visitId: 'mocked-visit-id', deactivatedVisitId: 'mocked-deactivated-visit-id' },
				userId: 1
			})
			expect(mockCreateVisitCreateEvent).toBeCalledWith({
				actor: { id: 1, type: 'user' },
				isPreviewMode: true,
				extensions: { deactivatedVisitId: 'mocked-deactivated-visit-id' },
				visitId: 'mocked-visit-id',
				sessionIds: { launchId: undefined, sessionId: undefined }
			})
		})
	})
})
