jest.mock('../../models/visit')
jest.mock('../../insert_event')
jest.mock('../../db')
// make sure all Date objects use a static date
mockStaticDate()

// we'll use supertest + express for this
jest.unmock('express')

// override requireCurrentUser to provide our own
let mockCurrentUser
let mockSaveSessionSuccess = true
let mockSaveSessionRejectValue
jest.mock('../../express_current_user', () => (req, res, next) => {
	req.requireCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	req.saveSessionPromise = () => {
		if (mockSaveSessionSuccess) return Promise.resolve()
		return Promise.reject(mockSaveSessionRejectValue)
	}
	next()
})

// override requireCurrentDocument to provide our own
let mockCurrentDocument
jest.mock('../../express_current_document', () => (req, res, next) => {
	req.requireCurrentDocument = () => {
		req.currentDocument = mockCurrentDocument
		return Promise.resolve(mockCurrentDocument)
	}
	next()
})

// setup express server
const db = oboRequire('db')
const request = require('supertest')
const express = require('express')
const app = express()
app.use(oboRequire('express_current_user'))
app.use(oboRequire('express_current_document'))
app.use('/', oboRequire('express_response_decorator'))
app.use('/', oboRequire('routes/preview'))

describe('preview route', () => {
	const Visit = oboRequire('models/visit')
	const insertEvent = oboRequire('insert_event')

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockCurrentUser = { id: 66, canViewDrafts: true }
		Visit.createPreviewVisit.mockResolvedValueOnce({
			visitId: 'mocked-visit-id',
			deactivatedVisitId: 'mocked-deactivated-visit-id'
		})
	})
	afterEach(() => {})

	test('preview requires user with canViewDrafts permission', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 66, canViewDrafts: false }
		return request(app)
			.get(`/${validUUID()}/`)
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(401)
				expect(response.text).toBe('Not Authorized')
			})
	})

	test('preview requires a currentDocument', () => {
		expect.assertions(3)
		return request(app)
			.get(`/${validUUID()}/`)
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(422)
				expect(response.text).toBe('Bad Input: currentDocument missing from request, got undefined')
			})
	})

	test('preview creates a preview visit', () => {
		expect.assertions(3)
		mockCurrentDocument = {
			draftId: 3,
			contentId: 5
		}
		return request(app)
			.get(`/${validUUID()}/`)
			.then(response => {
				expect(response.header['content-type']).toContain('text/plain')
				expect(response.statusCode).toBe(302)
				expect(response.text).toBe('Found. Redirecting to /view/3/visit/mocked-visit-id')
			})
	})

	test('preview 500s when saveSessionPromise rejects', () => {
		expect.assertions(3)
		mockSaveSessionSuccess = false
		mockCurrentDocument = {
			draftId: 3,
			contentId: 5
		}
		return request(app)
			.get(`/${validUUID()}/`)
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(500)
				expect(response.text).toContain('Server Error')
			})
	})

	test('preview 500s when saveSessionPromise rejects', () => {
		expect.assertions(3)
		mockSaveSessionSuccess = false
		mockSaveSessionRejectValue = 'some-error'
		mockCurrentDocument = {
			draftId: 3,
			contentId: 5
		}
		return request(app)
			.get(`/${validUUID()}/`)
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(500)
				expect(response.text).toContain('some-error')
			})
	})
})
