jest.mock('../../../routes/api/events/create_caliper_event')
jest.mock('../../../models/visit')
jest.mock('../../../insert_event')

// make sure all Date objects use a static date
mockStaticDate()

jest.mock('../../../db')

jest.unmock('express') // we'll use supertest + express for this

// override requireCurrentUser to provide our own
/* eslint-disable no-undefined */

let mockCurrentUser
let mockCurrentVisit
const mockSaveSessionSuccess = true
jest.mock('../../../express_current_user', () => (req, res, next) => {
	req.requireCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	req.saveSessionPromise = () => {
		if (mockSaveSessionSuccess) return Promise.resolve()
		return Promise.reject()
	}
	req.getCurrentVisitFromRequest = () => {
		if (!mockCurrentVisit) return Promise.reject()
		if (mockCurrentVisit === 'mock-fetch-reject') return Promise.reject('mock-fetch-reject')
		req.currentVisit = mockCurrentVisit
		return Promise.resolve()
	}
	next()
})

// ovveride requireCurrentDocument to provide our own
let mockCurrentDocument
jest.mock('../../../express_current_document', () => (req, res, next) => {
	req.requireCurrentDocument = () => {
		req.currentDocument = mockCurrentDocument
		return Promise.resolve(mockCurrentDocument)
	}
	next()
})

// setup express server
const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(oboRequire('express_current_user'))
app.use(oboRequire('express_current_document'))
app.use('/', oboRequire('express_response_decorator'))
app.use('/api/', oboRequire('routes/api/visits'))

// make sure all Date objects use a static date
mockStaticDate()

describe('api visits route', () => {
	const VisitModel = oboRequire('models/visit')
	const insertEvent = oboRequire('insert_event')
	const caliperEvent = oboRequire('routes/api/events/create_caliper_event')
	const viewerState = oboRequire('viewer/viewer_state')
	const db = oboRequire('db')
	const ltiUtil = oboRequire('lti')

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		db.one.mockReset()
		insertEvent.mockReset()
		caliperEvent().createViewerSessionLoggedInEvent.mockReset()
		ltiUtil.retrieveLtiLaunch = jest.fn()
		viewerState.get = jest.fn()
		mockCurrentVisit = {
			id: validUUID(),
			is_preview: false,
			draft_content_id: validUUID(),
			resource_link_id: '12345'
		}
		VisitModel.fetchById.mockResolvedValue(mockCurrentVisit)
	})
	afterEach(() => {})

	test('/start fails without current user', () => {
		expect.assertions(4)
		mockCurrentUser = null
		return request(app)
			.post('/api/start')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(401)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body.value).toHaveProperty('type', 'notAuthorized')
			})
	})

	test('/start fails when theres no draftDocument loaded', () => {
		expect.assertions(5)
		mockCurrentUser = { id: 99 }
		return request(app)
			.post('/api/start')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(422)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body.value).toHaveProperty('type', 'badInput')
				expect(response.body.value.message).toContain(
					'currentDocument missing from request, got undefined'
				)
			})
	})

	test('/start fails when theres an invalid visitId', () => {
		expect.assertions(5)
		mockCurrentUser = { id: 99 }
		mockCurrentDocument = { draftId: 111 }
		return request(app)
			.post('/api/start')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(422)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body.value).toHaveProperty('type', 'badInput')
				expect(response.body.value).toHaveProperty(
					'message',
					'visitId must be a valid UUID, got undefined'
				)
			})
	})

	test('/start fails when theres no matching visit', () => {
		// reject db.one lookup of visit
		expect.assertions(5)
		mockCurrentUser = { id: 99 }
		mockCurrentDocument = {
			draftId: validUUID(),
			yell: jest.fn().mockResolvedValueOnce(),
			contentId: validUUID()
		}
		mockCurrentVisit = 'mock-fetch-reject'
		return request(app)
			.post('/api/start')
			.send({ visitId: validUUID() })
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(403)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body.value).toHaveProperty('type', 'reject')
				expect(response.body.value).toHaveProperty('message', 'mock-fetch-reject')
			})
	})

	test('/start fails when theres no linked lti launch (when not in preview mode)', () => {
		expect.assertions(5)
		// reject launch lookup
		ltiUtil.retrieveLtiLaunch.mockRejectedValueOnce('lti launch lookup rejection error')
		mockCurrentUser = { id: 99 }
		mockCurrentDocument = {
			draftId: validUUID(),
			yell: jest.fn().mockResolvedValueOnce(),
			contentId: validUUID()
		}
		return request(app)
			.post('/api/start')
			.send({ visitId: validUUID() })
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(403)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body.value).toHaveProperty('type', 'reject')
				expect(response.body.value).toHaveProperty('message', 'lti launch lookup rejection error')
			})
	})

	test('/start fails when draft_content_ids do not match', () => {
		expect.assertions(5)
		mockCurrentUser = { id: 99 }
		mockCurrentDocument = {
			draftId: validUUID(),
			yell: jest.fn().mockResolvedValueOnce(),
			contentId: 'some-invalid-content-id'
		}
		return request(app)
			.post('/api/start')
			.send({ visitId: validUUID() })
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(403)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body.value).toHaveProperty('type', 'reject')
				expect(response.body.value).toHaveProperty('message', 'Visit for older draft version!')
			})
	})

	test('/start in preview works and doesnt care about matching draft_content_ids', () => {
		expect.assertions(4)
		mockCurrentVisit.is_preview = true
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockCurrentDocument = {
			draftId: validUUID(),
			yell: jest.fn().mockResolvedValueOnce({ document: 'mock-document' }),
			contentId: validUUID()
		}
		return request(app)
			.post('/api/start')
			.send({ visitId: validUUID() })
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(200)
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body.value).toMatchSnapshot()
			})
	})

	test('/start fails when theres no outcome service url', () => {
		expect.assertions(5)
		// resolve ltiLaunch lookup
		ltiUtil.retrieveLtiLaunch.mockResolvedValueOnce({})
		mockCurrentUser = { id: 99 }
		mockCurrentDocument = {
			draftId: validUUID(),
			yell: jest.fn().mockResolvedValueOnce({ document: 'mock-document' }),
			contentId: validUUID()
		}
		return request(app)
			.post('/api/start')
			.send({ visitId: validUUID() })
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(403)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body.value).toHaveProperty('type', 'reject')
				expect(response.body.value).toHaveProperty(
					'message',
					"Cannot read property 'lis_outcome_service_url' of undefined"
				)
			})
	})

	test('/start yells internal:startVisit and respond with success', () => {
		expect.assertions(4)
		// resolve ltiLaunch lookup
		const launch = {
			reqVars: {
				lis_outcome_service_url: 'howtune.com'
			}
		}
		ltiUtil.retrieveLtiLaunch.mockResolvedValueOnce(launch)

		// resolve viewerState.get
		viewerState.get.mockResolvedValueOnce('view state')

		mockCurrentUser = { id: 99 }
		mockCurrentDocument = {
			draftId: validUUID(),
			yell: jest.fn().mockResolvedValueOnce({ document: 'mock-document' }),
			contentId: validUUID()
		}
		return request(app)
			.post('/api/start')
			.send({ visitId: validUUID() })
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(200)
				expect(mockCurrentDocument.yell).toHaveBeenCalledTimes(1)
				expect(mockCurrentDocument.yell.mock.calls[0][0]).toBe('internal:startVisit')
			})
	})

	test('visit:start event and createViewerSessionLoggedInEvent created', () => {
		expect.assertions(4)
		// resolve ltiLaunch lookup
		const launch = {
			reqVars: {
				lis_outcome_service_url: 'howtune.com'
			}
		}
		ltiUtil.retrieveLtiLaunch.mockResolvedValueOnce(launch)

		// resolve viewerState.get
		viewerState.get.mockResolvedValueOnce('view state')

		mockCurrentUser = { id: 99 }
		mockCurrentDocument = {
			draftId: validUUID(),
			yell: jest.fn().mockResolvedValueOnce({ document: 'mock-document' }),
			contentId: validUUID()
		}

		return request(app)
			.post('/api/start')
			.send({ visitId: validUUID() })
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(200)

				expect(insertEvent).toBeCalledWith({
					action: 'visit:start',
					actorTime: '2016-09-22T16:57:14.500Z',
					caliperPayload: undefined,
					draftId: validUUID(),
					contentId: validUUID(),
					eventVersion: '1.0.0',
					ip: '::ffff:127.0.0.1',
					isPreview: false,
					metadata: {},
					payload: { visitId: validUUID() },
					userId: 99,
					visitId: validUUID()
				})
				expect(caliperEvent().createViewerSessionLoggedInEvent).toBeCalledWith({
					actor: { id: 99, type: 'user' },
					draftId: validUUID(),
					contentId: validUUID(),
					isPreviewMode: undefined,
					sessionIds: { launchId: undefined, sessionId: undefined }
				})
			})
	})
})
