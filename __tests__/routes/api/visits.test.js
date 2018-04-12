jest.mock('../../../models/draft')
jest.mock('../../../models/user')
jest.mock('../../../db')
jest.mock('../../../logger')
mockVirtual('../../../lti')
mockVirtual('../../../viewer/viewer_state')

describe('api visits route', () => {
	const Draft = oboRequire('models/draft')
	const viewerState = oboRequire('viewer/viewer_state')
	const db = oboRequire('db')
	const User = oboRequire('models/user')
	const logger = oboRequire('logger')
	const ltiUtil = oboRequire('lti')
	const { mockExpressMethods, mockRouterMethods } = require('../../../__mocks__/__mock_express')
	const mockReq = {
		requireCurrentUser: jest.fn(),
		params: { draftId: 555 },
		app: {
			locals: {
				paths: 'paths',
				modules: 'modules'
			}
		}
	}
	const mockRes = {
		render: jest.fn(),
		reject: jest.fn(),
		success: jest.fn()
	}
	const mockNext = jest.fn()

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		oboRequire('routes/api/visits')
		mockReq.requireCurrentUser.mockReset()
		delete mockReq.body
		mockRes.render.mockReset()
		mockRes.reject.mockReset()
		mockRes.success.mockReset()
		logger.error.mockReset()
		db.one.mockReset()
		ltiUtil.retrieveLtiLaunch = jest.fn()
		viewerState.get = jest.fn()
	})
	afterEach(() => {})

	test('registers the expected routes', () => {
		expect(mockRouterMethods.post).toBeCalledWith('/start', expect.any(Function))
		expect(mockRouterMethods.get).not.toBeCalled()
		expect(mockRouterMethods.delete).not.toBeCalled()
		expect(mockRouterMethods.put).not.toBeCalled()
	})

	test('start fails without current user', () => {
		expect.assertions(3)
		let startVisitRoute = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockReturnValueOnce(Promise.reject('not logged in'))

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith('not logged in')
			expect(mockRes.reject).toBeCalledWith('not logged in')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('start fails when theres no visit id in the request', () => {
		expect.assertions(3)
		let startVisitRoute = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockReturnValueOnce(Promise.resolve(new User()))
		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith(expect.any(Error))
			expect(mockRes.reject).toBeCalledWith("Cannot read property 'visitId' of undefined")
			expect(mockNext).not.toBeCalled()
		})
	})

	test('start fails when theres no matching visit', () => {
		expect.assertions(3)
		let startVisitRoute = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockReturnValueOnce(Promise.resolve(new User()))
		mockReq.body = { visitId: 9 }

		// reject db.one lookup of visit
		db.one.mockReturnValueOnce(Promise.reject('no record found'))
		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith('no record found')
			expect(mockRes.reject).toBeCalledWith('no record found')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('start fails when theres no linked lti launch', () => {
		expect.assertions(3)
		let startVisitRoute = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockReturnValueOnce(Promise.resolve(new User()))
		mockReq.body = { visitId: 9 }

		// resolve db.one lookup of visit
		db.one.mockReturnValueOnce(Promise.resolve())

		// reject launch lookup
		ltiUtil.retrieveLtiLaunch.mockReturnValueOnce(Promise.reject('no launch found'))

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith('no launch found')
			expect(mockRes.reject).toBeCalledWith('no launch found')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('start fails when theres no outcome service url', () => {
		expect.assertions(3)
		let startVisitRoute = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockReturnValueOnce(Promise.resolve(new User()))
		mockReq.body = { visitId: 9 }

		// resolve db.one lookup of visit
		db.one.mockReturnValueOnce(Promise.resolve())

		// resolve ltiLaunch lookup
		ltiUtil.retrieveLtiLaunch.mockReturnValueOnce(Promise.resolve({}))

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith(expect.any(Error))
			expect(mockRes.reject).toBeCalledWith(
				"Cannot read property 'lis_outcome_service_url' of undefined"
			)
			expect(mockNext).not.toBeCalled()
		})
	})

	test('start fails when theres no draft', () => {
		expect.assertions(3)
		let startVisitRoute = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockReturnValueOnce(Promise.resolve(new User()))
		mockReq.body = { visitId: 9 }

		// resolve db.one lookup of visit
		db.one.mockReturnValueOnce(Promise.resolve())

		// resolve ltiLaunch lookup
		let launch = {
			reqVars: {
				lis_outcome_service_url: 'howtune.com'
			}
		}
		ltiUtil.retrieveLtiLaunch.mockReturnValueOnce(Promise.resolve(launch))

		// resolve viewerState.get
		viewerState.get.mockReturnValueOnce(Promise.resolve())

		// reject fetchById
		Draft.fetchById.mockReturnValueOnce(Promise.reject('no draft'))
		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith('no draft')
			expect(mockRes.reject).toBeCalledWith('no draft')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('start yells internal:startVisit and respond with success', () => {
		expect.assertions(5)
		let startVisitRoute = mockRouterMethods.post.mock.calls[0][1]
		mockReq.requireCurrentUser.mockReturnValueOnce(Promise.resolve(new User()))
		mockReq.body = { draftId: 8, visitId: 9 }

		// resolve db.one lookup of visit
		db.one.mockReturnValueOnce(Promise.resolve())

		// resolve ltiLaunch lookup
		let launch = {
			reqVars: {
				lis_outcome_service_url: 'howtune.com'
			}
		}
		ltiUtil.retrieveLtiLaunch.mockReturnValueOnce(Promise.resolve(launch))

		// resolve viewerState.get
		viewerState.get.mockReturnValueOnce(Promise.resolve('view state'))

		// resolve fetchById
		let mockDraft = new Draft()
		Draft.fetchById.mockReturnValueOnce(Promise.resolve(mockDraft))

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(mockDraft.yell).toBeCalledWith(
				'internal:startVisit',
				mockReq,
				mockRes,
				8,
				9,
				expect.any(Object)
			)
			expect(mockRes.success).toBeCalledWith(
				expect.objectContaining({
					visitId: 9,
					isPreviewing: false,
					lti: {
						lis_outcome_service_url: 'howtune.com'
					},
					viewState: 'view state',
					extensions: {}
				})
			)
			expect(logger.error).not.toBeCalled()
			expect(mockRes.reject).not.toBeCalled()
			expect(mockNext).not.toBeCalled()
		})
	})
})
