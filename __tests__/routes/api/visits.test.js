jest.mock('../../../models/draft')
jest.mock('../../../models/visit')
jest.mock('../../../models/user')
jest.mock('../../../db')
jest.mock('../../../logger')
jest.mock('../../../insert_event')
jest.mock('../../../routes/api/events/create_caliper_event')
mockVirtual('../../../lti')
mockVirtual('../../../viewer/viewer_state')

// make sure all Date objects use a static date
mockStaticDate()

describe('api visits route', () => {
	const insertEvent = oboRequire('insert_event')
	const caliperEvent = oboRequire('routes/api/events/create_caliper_event')
	const Draft = oboRequire('models/draft')
	const Visit = oboRequire('models/visit')
	const viewerState = oboRequire('viewer/viewer_state')
	const db = oboRequire('db')
	const User = oboRequire('models/user')
	const logger = oboRequire('logger')
	const ltiUtil = oboRequire('lti')
	const { mockExpressMethods, mockRouterMethods } = require('../../../__mocks__/__mock_express')
	const mockReq = {
		requireCurrentUser: jest.fn(),
		requireCurrentDocument: jest.fn(),
		params: { draftId: 555 },
		app: {
			locals: {
				paths: 'paths',
				modules: 'modules'
			}
		},
		session: {
			save: cb => cb()
		},
		connection: {
			remoteAddress: 'remoteAddress'
		}
	}
	const mockRes = {
		render: jest.fn(),
		reject: jest.fn(),
		success: jest.fn()
	}
	const mockNext = jest.fn()
	const mockYell = jest.fn().mockResolvedValue(undefined)
	let startVisitRoute

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		oboRequire('routes/api/visits')
		mockReq.requireCurrentUser.mockReset()
		mockReq.requireCurrentDocument.mockResolvedValue({
			draftId: 555,
			contentId: 'draft-content-id',
			yell: mockYell,
			root: {
				node: {
					_rev: 'draft-content-id'
				}
			}
		})
		mockReq.body = {}
		mockRes.render.mockReset()
		mockRes.reject.mockReset()
		mockRes.success.mockReset()
		logger.error.mockReset()
		db.one.mockReset()
		insertEvent.mockReset()
		caliperEvent().createViewerSessionLoggedInEvent.mockReset()
		ltiUtil.retrieveLtiLaunch = jest.fn()
		viewerState.get = jest.fn()
		startVisitRoute = mockRouterMethods.post.mock.calls[0][1]
	})
	afterEach(() => {})

	test('registers the expected routes', () => {
		expect(mockRouterMethods.post).toBeCalledWith('/start', expect.any(Function))
		expect(mockRouterMethods.get).not.toBeCalled()
		expect(mockRouterMethods.delete).not.toBeCalled()
		expect(mockRouterMethods.put).not.toBeCalled()
	})

	test('/start fails without current user', () => {
		expect.assertions(3)
		mockReq.requireCurrentUser.mockRejectedValueOnce('not logged in')

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith('not logged in')
			expect(mockRes.reject).toBeCalledWith('not logged in')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('/start fails when theres no visit id in the request', () => {
		expect.assertions(3)
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith(expect.any(Error))
			expect(mockRes.reject).toBeCalledWith('Missing visit and/or draft id!')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('/start fails when theres no matching visit', () => {
		expect.assertions(3)
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		mockReq.body = { draftId: 1, visitId: 9 }

		// reject db.one lookup of visit
		Visit.fetchById.mockRejectedValueOnce('no record found')
		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith('no record found')
			expect(mockRes.reject).toBeCalledWith('no record found')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('/start fails when theres no linked lti launch (when not in preview mode)', () => {
		expect.assertions(3)
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		mockReq.body = { draftId: 1, visitId: 9 }

		Visit.fetchById.mockResolvedValueOnce(
			new Visit({
				is_preview: false,
				draft_content_id: 'draft-content-id'
			})
		)

		// reject launch lookup
		ltiUtil.retrieveLtiLaunch.mockRejectedValueOnce('no launch found')

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith('no launch found')
			expect(mockRes.reject).toBeCalledWith('no launch found')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('/start fails when draft_content_ids do not match', () => {
		expect.assertions(3)
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		mockReq.body = { visitId: 9, draftId: 1 }

		// resolve ltiLaunch lookup
		let launch = {
			reqVars: {
				lis_outcome_service_url: 'howtune.com'
			}
		}
		ltiUtil.retrieveLtiLaunch.mockResolvedValueOnce(launch)

		Visit.fetchById.mockResolvedValueOnce(
			new Visit({
				is_preview: false,
				draft_content_id: 'mocked-old-draft-content-id'
			})
		)

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith(new Error('Visit for older draft version!'))
			expect(mockRes.reject).toBeCalledWith('Visit for older draft version!')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('/start fails when draft_content_ids do not match in preview mode', () => {
		expect.assertions(4)
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		mockReq.body = { visitId: 9, draftId: 1 }

		// resolve ltiLaunch lookup
		let launch = {
			reqVars: {
				lis_outcome_service_url: 'howtune.com'
			}
		}
		ltiUtil.retrieveLtiLaunch.mockResolvedValueOnce(launch)

		Visit.fetchById.mockResolvedValueOnce(
			new Visit({
				is_preview: true,
				draft_content_id: 'mocked-old-draft-content-id'
			})
		)

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(mockRes.success).toBeCalled()
			expect(logger.error).not.toBeCalled()
			expect(mockRes.reject).not.toBeCalled()
			expect(mockNext).not.toBeCalled()
		})
	})

	test('/start fails when theres no outcome service url', () => {
		expect.assertions(3)
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		mockReq.body = { visitId: 9, draftId: 1 }

		// resolve db.one lookup of visit
		Visit.fetchById.mockResolvedValueOnce(
			new Visit({
				is_active: true,
				is_preview: false,
				draft_content_id: 'draft-content-id'
			})
		)

		// resolve ltiLaunch lookup
		ltiUtil.retrieveLtiLaunch.mockResolvedValueOnce({})

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith(expect.any(Error))
			expect(mockRes.reject).toBeCalledWith(
				"Cannot read property 'lis_outcome_service_url' of undefined"
			)
			expect(mockNext).not.toBeCalled()
		})
	})

	test('/start fails when theres no draft', () => {
		expect.assertions(3)
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		mockReq.body = { visitId: 9, draftId: 1 }

		// reject fetchById
		mockReq.requireCurrentDocument.mockRejectedValueOnce('no draft')
		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(logger.error).toBeCalledWith('no draft')
			expect(mockRes.reject).toBeCalledWith('no draft')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('/start yells internal:startVisit and respond with success', () => {
		expect.assertions(5)
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User())
		mockReq.body = { draftId: 555, visitId: 9 }

		// resolve db.one lookup of visit
		Visit.fetchById.mockResolvedValueOnce(
			new Visit({
				is_active: true,
				is_preview: false,
				draft_content_id: 'draft-content-id'
			})
		)

		// resolve ltiLaunch lookup
		let launch = {
			reqVars: {
				lis_outcome_service_url: 'howtune.com'
			}
		}
		ltiUtil.retrieveLtiLaunch.mockResolvedValueOnce(launch)

		// resolve viewerState.get
		viewerState.get.mockResolvedValueOnce('view state')

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(mockYell).toBeCalledWith(
				'internal:startVisit',
				mockReq,
				mockRes,
				555,
				9,
				expect.any(Object)
			)
			expect(mockRes.success).toBeCalledWith({
				visitId: 9,
				isPreviewing: false,
				lti: {
					lis_outcome_service_url: 'howtune.com'
				},
				viewState: 'view state',
				extensions: {}
			})
			expect(logger.error).not.toBeCalled()
			expect(mockRes.reject).not.toBeCalled()
			expect(mockNext).not.toBeCalled()
		})
	})

	test('/start is also successful for a preview visit', () => {
		expect.assertions(5)
		let user = new User()
		user.canViewEditor = true
		mockReq.requireCurrentUser.mockResolvedValueOnce(user)
		mockReq.body = { draftId: 555, visitId: 9 }

		// resolve db.one lookup of visit
		Visit.fetchById.mockResolvedValueOnce(
			new Visit({
				is_active: true,
				is_preview: true,
				draft_content_id: 'draft-content-id'
			})
		)

		// resolve viewerState.get
		viewerState.get.mockResolvedValueOnce('view state')

		// resolve fetchById
		let mockDraft = new Draft({
			_rev: 'draft-content-id'
		})
		Draft.fetchById.mockResolvedValueOnce(mockDraft)

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(mockYell).toBeCalledWith(
				'internal:startVisit',
				mockReq,
				mockRes,
				555,
				9,
				expect.any(Object)
			)
			expect(mockRes.success).toBeCalledWith({
				visitId: 9,
				isPreviewing: true,
				lti: {
					lis_outcome_service_url: null
				},
				viewState: 'view state',
				extensions: {}
			})
			expect(logger.error).not.toBeCalled()
			expect(mockRes.reject).not.toBeCalled()
			expect(mockNext).not.toBeCalled()
		})
	})

	test('visit:start event and createViewerSessionLoggedInEvent created', () => {
		expect.assertions(2)
		mockReq.requireCurrentUser.mockResolvedValueOnce(new User({ id: 2 }))
		mockReq.body = { draftId: 99, visitId: 42 }

		return startVisitRoute(mockReq, mockRes, mockNext).then(result => {
			expect(insertEvent).toBeCalledWith({
				action: 'visit:start',
				actorTime: '2016-09-22T16:57:14.500Z',
				caliperPayload: undefined,
				draftId: 555,
				contentId: 'draft-content-id',
				eventVersion: '1.0.0',
				ip: 'remoteAddress',
				metadata: {},
				payload: { visitId: 42 },
				userId: 2
			})
			expect(caliperEvent().createViewerSessionLoggedInEvent).toBeCalledWith({
				actor: { id: 2, type: 'user' },
				draftId: 555,
				contentId: 'draft-content-id',
				isPreviewMode: undefined,
				sessionIds: { launchId: undefined, sessionId: undefined }
			})
		})
	})
})
