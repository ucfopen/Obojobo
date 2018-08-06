jest.mock('../../../models/draft')
jest.mock('../../../db')

jest.unmock('express') // we'll use supertest + express for this

// override requireCurrentUser to provide our own
let mockCurrentUser
jest.mock('../../../express_current_user', () => (req, res, next) => {
	req.requireCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
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

const validEvent = {
	event: {
		actor_time: '2016-09-22T16:57:14.500Z',
		payload: 'none',
		action: 'none',
		draft_id: validUUID(),
		event_version: '1.0.0'
	},
	draftId: validUUID()
}
// setup express server
const db = oboRequire('db')
const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(oboRequire('express_current_user'))
app.use(oboRequire('express_current_document'))
app.use('', oboRequire('express_response_decorator'))
app.use('/api/events', oboRequire('routes/api/events')) // mounting under api so response_decorator assumes json content type

describe('api draft events route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		db.one.mockReset()
		db.none.mockReset()
		mockCurrentUser = { id: 99 }
		mockCurrentDocument = { draftId: 'mock-id', contentId: 'mock-content-id' }
	})
	afterEach(() => {})

	test('requires current user', () => {
		expect.assertions(5)
		mockCurrentUser = null // shouldn't meet auth requirements

		return request(app)
			.post('/api/events')
			.send(validEvent)
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('type', 'notAuthorized')
			})
	})

	test('inserts event', () => {
		expect.assertions(4)
		db.one.mockResolvedValueOnce('inserted created_at') // mocks insertEvent

		return request(app)
			.post('/api/events')
			.send(validEvent)
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body).toHaveProperty('value', null)
			})
	})

	test('new event when insert fails as with unexpected type', () => {
		expect.assertions(6)

		db.one.mockRejectedValueOnce('rejected') // mocks insertEvent

		return request(app)
			.post('/api/events')
			.send(validEvent)
			.then(response => {
				expect(response.statusCode).toBe(500)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('message', 'rejected')
				expect(response.body.value).toHaveProperty('type', 'unexpected')
			})
	})

	test('new event requires actor_time iso string', () => {
		expect.assertions(7)

		return request(app)
			.post('/api/events')
			.send({
				event: {
					actor_time: 'some-bad-date-format',
					action: 'none',
					payload: 'none',
					draft_id: validUUID(),
					event_version: '1.0.0'
				},
				draftId: validUUID()
			})
			.then(response => {
				expect(response.statusCode).toBe(422)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('message')
				expect(response.body.value.message).toContain(
					'event.actor_time must be a valid ISO8601 date string, got '
				)
				expect(response.body.value).toHaveProperty('type', 'badInput')
			})
	})

	test('new event requires action not be empty', () => {
		expect.assertions(6)

		return request(app)
			.post('/api/events')
			.send({
				event: {
					actor_time: '2016-09-22T16:57:14.500Z',
					action: '',
					payload: 'none',
					draft_id: validUUID(),
					event_version: '1.0.0'
				},
				draftId: validUUID()
			})
			.then(response => {
				expect(response.statusCode).toBe(422)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty(
					'message',
					'event.action must not be empty, got '
				)
				expect(response.body.value).toHaveProperty('type', 'badInput')
			})
	})

	test('new event requires action exists', () => {
		expect.assertions(6)
		return request(app)
			.post('/api/events')
			.send({
				event: {
					actor_time: '2016-09-22T16:57:14.500Z',
					payload: 'none',
					draft_id: validUUID(),
					event_version: '1.0.0'
				},
				draftId: validUUID()
			})
			.then(response => {
				expect(response.statusCode).toBe(422)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty(
					'message',
					'event.action must not be empty, got undefined'
				)
				expect(response.body.value).toHaveProperty('type', 'badInput')
			})
	})

	test('new event requires valid draft id', () => {
		expect.assertions(6)

		return request(app)
			.post('/api/events')
			.send({
				event: {
					actor_time: '2016-09-22T16:57:14.500Z',
					payload: 'none',
					action: 'none',
					draft_id: '55',
					event_version: '1.0.0'
				},
				draftId: '55'
			})
			.then(response => {
				expect(response.statusCode).toBe(422)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty(
					'message',
					'event.draft_id must be a valid UUID, got 55'
				)
				expect(response.body.value).toHaveProperty('type', 'badInput')
			})
	})

	test('new event requires semver event_version', () => {
		expect.assertions(6)

		return request(app)
			.post('/api/events')
			.send({
				event: {
					actor_time: '2016-09-22T16:57:14.500Z',
					payload: 'none',
					action: 'none',
					draft_id: validUUID(),
					event_version: '1'
				},
				draftId: validUUID()
			})
			.then(response => {
				expect(response.statusCode).toBe(422)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty(
					'message',
					'event.event_version must match a valid semVer string, got 1'
				)
				expect(response.body.value).toHaveProperty('type', 'badInput')
			})
	})
})
