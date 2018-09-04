jest.mock('../../../models/draft')
jest.mock('../../../models/user')
jest.mock('../../../db')
jest.mock('../../../logger')
jest.mock('obojobo-draft-xml-parser/xml-to-draft-object')

import DraftModel from '../../../models/draft'
const xml = require('obojobo-draft-xml-parser/xml-to-draft-object')

// don't use our existing express mock, we're using supertest
jest.unmock('express')
// Load an example default Obojobo middleware
const request = require('supertest')
const express = require('express')
const app = express()

const basicXML = `<ObojoboDraftDoc>
	<Module title="My Module">
	    <Content>
	      <Page>
	        <p>Hello World!</p>
	      </Page>
	    </Content>
	  </Module>
	</ObojoboDraftDoc>`

const mockInsertNewDraft = mockVirtual('./routes/api/drafts/insert_new_draft')
const db = oboRequire('db')
const drafts = oboRequire('routes/api/drafts')

let mockCurrentUser

const mockGetCurrentUser = jest.fn().mockImplementation(req => {
	req.currentUser = mockCurrentUser
	return Promise.resolve(mockCurrentUser)
})

jest.mock('../../../express_current_user', () => (req, res, next) => {
	req.getCurrentUser = mockGetCurrentUser.bind(this, req)
	req.requireCurrentUser = mockGetCurrentUser.bind(this, req)
	next()
})

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(oboRequire('express_current_user'))
app.use('/', oboRequire('express_response_decorator'))
app.use('/api/drafts', drafts)

describe('api draft route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockInsertNewDraft.mockReset()
		DraftModel.findDuplicateIds.mockReset()
		db.none.mockReset()
		db.any.mockReset()
		xml.mockReset()
	})
	afterEach(() => {})

	// get draft

	test('get draft returns success', () => {
		expect.assertions(5)
		// mock a yell function that returns a document
		const mockYell = jest.fn()
		// mock the document returned by fetchById
		DraftModel.fetchById.mockResolvedValueOnce({
			root: { yell: mockYell },
			document: 'mock-document'
		})
		return request(app)
			.get('/api/drafts/00000000-0000-0000-0000-000000000000')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(200)
				expect(mockYell).toHaveBeenCalledWith(
					'internal:sendToClient',
					expect.anything(),
					expect.anything()
				)
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body).toHaveProperty('value', 'mock-document')
			})
	})

	test('get draft returns 404 when no items found', () => {
		expect.assertions(5)
		// mock a failure to find the draft
		const mockError = new db.errors.QueryResultError(db.errors.queryResultErrorCode.noData)
		DraftModel.fetchById.mockRejectedValueOnce(mockError)
		return request(app)
			.get('/api/drafts/00000000-0000-0000-0000-000000000000')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(404)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body.value).toHaveProperty('type', 'missing')
				expect(response.body.value).toHaveProperty('message', 'Draft not found')
			})
	})

	test('get draft returns 500 when an unkown error occurs', () => {
		expect.assertions(5)
		// mock a failure to find the draft
		DraftModel.fetchById.mockRejectedValueOnce('mock-other-error')
		return request(app)
			.get('/api/drafts/00000000-0000-0000-0000-000000000000')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(500)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body.value).toHaveProperty('type', 'unexpected')
				expect(response.body.value).toHaveProperty('message', 'mock-other-error')
			})
	})

	// new draft

	test('new draft returns success', () => {
		expect.assertions(4)
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
		return request(app)
			.post('/api/drafts/new')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(200)
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body).toHaveProperty('value', { id: 'mockDraftId' })
			})
	})

	test('new draft requires a login', () => {
		expect.assertions(5)
		mockCurrentUser = { id: 99, canCreateDrafts: false } // mock current logged in user
		return request(app)
			.post('/api/drafts/new')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(401)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'notAuthorized')
			})
	})

	test('new draft 500s when createWithContent fails', () => {
		expect.assertions(5)
		DraftModel.createWithContent.mockRejectedValueOnce()
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
		return request(app)
			.post('/api/drafts/new')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(500)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'unexpected')
			})
	})

	// update draft

	test('updating a draft with xml returns successfully', () => {
		expect.assertions(5)
		xml.mockReturnValueOnce({})
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
		DraftModel.findDuplicateIds.mockReturnValueOnce(null) // no errors
		return request(app)
			.post('/api/drafts/00000000-0000-0000-0000-000000000000')
			.type('text/plain')
			.accept('text/plain')
			.send(basicXML)
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(200)
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body).toHaveProperty('value', { id: 'mockUpdatedContentId' })
				expect(xml).toHaveBeenCalledWith(basicXML, true)
			})
	})

	test('updating a draft with json returns successfully', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
		DraftModel.findDuplicateIds.mockReturnValueOnce(null) // no errors
		return request(app)
			.post('/api/drafts/00000000-0000-0000-0000-000000000000')
			.type('application/json')
			.send('{"test":true}')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body).toHaveProperty('value', { id: 'mockUpdatedContentId' })
			})
	})

	test('updating a draft errors when xmlToDraftObject returns invalid object', () => {
		expect.assertions(6)
		xml.mockImplementationOnce(null)
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
		return request(app)
			.post('/api/drafts/00000000-0000-0000-0000-000000000000')
			.type('text/plain')
			.accept('text/plain')
			.send(basicXML)
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(422)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'badInput')
				expect(response.body.value).toHaveProperty(
					'message',
					'Posting draft failed - format unexpected'
				)
			})
	})

	test('updating a draft errors when xmlToDraftObject throws error', () => {
		expect.assertions(6)
		xml.mockImplementationOnce(() => {
			throw 'some-error'
		})
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
		return request(app)
			.post('/api/drafts/00000000-0000-0000-0000-000000000000')
			.type('text/plain')
			.accept('text/plain')
			.send(basicXML)
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(422)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'badInput')
				expect(response.body.value).toHaveProperty(
					'message',
					'Posting draft failed - format unexpected'
				)
			})
	})

	test('updating a draft requires canCreateDrafts', () => {
		expect.assertions(5)
		mockCurrentUser = { id: 99, canCreateDrafts: false } // mock current logged in user
		return request(app)
			.post('/api/drafts/00000000-0000-0000-0000-000000000000')
			.type('text/plain')
			.accept('text/plain')
			.send(basicXML)
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(401)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'notAuthorized')
			})
	})

	test('update draft detects duplicate ids', () => {
		expect.assertions(5)
		xml.mockReturnValueOnce({})
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
		DraftModel.findDuplicateIds.mockReturnValueOnce('duplicate-id') // mock the findDuplicateIds method
		return request(app)
			.post('/api/drafts/00000000-0000-0000-0000-000000000000')
			.type('text/plain')
			.accept('text/plain')
			.send(basicXML)
			.then(response => {
				expect(response.statusCode).toBe(422)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'badInput')
				expect(response.body.value).toHaveProperty(
					'message',
					'Posting draft failed - duplicate id "duplicate-id"'
				)
			})
	})

	test('updating 500s when findDuplicateIds errors', () => {
		expect.assertions(5)
		xml.mockReturnValueOnce({})
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
		DraftModel.findDuplicateIds.mockImplementationOnce(() => {
			throw 'oh no'
		}) // mock the findDuplicateIds method
		return request(app)
			.post('/api/drafts/00000000-0000-0000-0000-000000000000')
			.type('text/plain')
			.accept('text/plain')
			.send(basicXML)
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(500)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'unexpected')
			})
	})

	// delete draft

	test('delete errors with permissions before draftID validation', () => {
		expect.assertions(4)
		mockCurrentUser = { id: 99, canDeleteDrafts: false }
		return request(app)
			.delete('/api/drafts/6')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(401)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value', { type: 'notAuthorized' })
			})
	})

	test('delete rejects draft ids that arent UUIDs', () => {
		expect.assertions(6)
		mockCurrentUser = { id: 99, canDeleteDrafts: true }
		return request(app)
			.delete('/api/drafts/6')
			.type('application/json')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(422)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'badInput')
				expect(response.body.value).toHaveProperty('message', 'draftId must be a valid UUID, got 6')
			})
	})

	test('delete draft returns successfully', () => {
		expect.assertions(4)
		db.none.mockResolvedValueOnce('mock-db-result')
		mockCurrentUser = { id: 99, canDeleteDrafts: true } // mock current logged in user
		return request(app)
			.delete('/api/drafts/00000000-0000-0000-0000-000000000000')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(200)
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body).toHaveProperty('value', 'mock-db-result')
			})
	})

	test('delete 500s when the database errors', () => {
		expect.assertions(5)
		db.none.mockRejectedValueOnce('oh no')
		mockCurrentUser = { id: 99, canDeleteDrafts: true } // mock current logged in user
		return request(app)
			.delete('/api/drafts/00000000-0000-0000-0000-000000000000')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(500)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'unexpected')
			})
	})

	// list drafts
	test('list drafts exits when user cant view drafts', () => {
		expect.assertions(4)
		db.any.mockResolvedValueOnce('mock-db-result')
		mockCurrentUser = { id: 99, canViewDrafts: false } // mock current logged in user
		return request(app)
			.get('/api/drafts')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(401)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value', { type: 'notAuthorized' })
			})
	})

	test('list drafts renders results', () => {
		expect.assertions(4)
		mockCurrentUser = { id: 99, canViewDrafts: true } // mock current logged in user
		db.any.mockResolvedValueOnce('mock-db-result') // mock result of query to get all my drafts
		return request(app)
			.get('/api/drafts')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(200)
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body).toHaveProperty('value', 'mock-db-result')
			})
	})

	test('delete 500s when the database errors', () => {
		expect.assertions(5)
		mockCurrentUser = { id: 99, canViewDrafts: true } // mock current logged in user
		db.any.mockRejectedValueOnce('rejected value') // mock result of query to get all my drafts
		return request(app)
			.get('/api/drafts')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(500)
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'unexpected')
			})
	})
})
