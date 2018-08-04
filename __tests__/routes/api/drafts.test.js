jest.mock('../../../models/draft')
jest.mock('../../../models/user')
jest.mock('../../../db')
jest.mock('../../../logger')
// jest.mock('obojobo-draft-xml-parser/xml-to-draft-object')

import DraftModel from '../../../models/draft'
import User from '../../../models/user'
import logger from '../../../logger'
// import mockXMLParser from 'obojobo-draft-xml-parser/xml-to-draft-object'
let xml = require('obojobo-draft-xml-parser/xml-to-draft-object')

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

let mockInsertNewDraft = mockVirtual('./routes/api/drafts/insert_new_draft')
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

const config = oboRequire('config')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(oboRequire('express_current_user'))
app.use('/', oboRequire('api_response_decorator'))
app.use('/api/drafts', drafts)

describe('api draft route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockInsertNewDraft.mockReset()
		db.none.mockReset()
		db.any.mockReset()
	})
	afterEach(() => {})

	test('get draft returns success', () => {
		expect.assertions(4)
		// mock a yell function that returns a document
		let mockYell = jest.fn().mockResolvedValueOnce({ document: 'mock-document' })
		// mock the document returned by fetchById
		DraftModel.fetchById.mockResolvedValueOnce({ root: { yell: mockYell } })
		return request(app)
			.get('/api/drafts/00000000-0000-0000-0000-000000000000')
			.then(response => {
				expect(response.header['content-type']).toContain('application/json')
				expect(response.statusCode).toBe(200)
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body).toHaveProperty('value', 'mock-document')
			})
	})

	test('get draft returns 404 when no items found', () => {
		expect.assertions(5)
		// mock a failure to find the draft
		DraftModel.fetchById.mockRejectedValueOnce(5)
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

	test('updating a draft with xml returns successfully', () => {
		expect.assertions(4)
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
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
			})
	})

	test('updating a draft with json returns successfully', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
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

	test('updating a draft with malformed xml returns error', () => {
		expect.assertions(6)
		mockCurrentUser = { id: 99, canCreateDrafts: true } // mock current logged in user
		return request(app)
			.post('/api/drafts/00000000-0000-0000-0000-000000000000')
			.type('text/plain')
			.accept('text/plain')
			.send('<xml></xml>')
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
})
