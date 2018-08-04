jest.mock('../../db')
jest.unmock('fs') // need fs working for view rendering
jest.unmock('express') // we'll use supertest + express for this

// override requireCurrentUser for tests to provide our own user
let mockCurrentUser
jest.mock('../../express_current_user', () => (req, res, next) => {
	req.requireCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	next()
})

// setup express server
const db = oboRequire('db')
const request = require('supertest')
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '../../../views/')
app.use(oboRequire('express_current_user'))
app.use('/', oboRequire('api_response_decorator'))
app.use('/', oboRequire('routes/editor'))

describe('editor route', () => {
	beforeEach(() => {
		db.any.mockReset()
		mockCurrentUser = { id: 99, canViewEditor: true } // should meet auth requirements
	})

	test('get editor rejects users without canViewEditor permission', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canViewEditor: false } // shouldn't meet auth requirements

		return request(app)
			.get('/')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('text/html')
				expect(response.text).toBe('Not Authorized')
			})
	})

	test('get returns the expected response', () => {
		expect.assertions(3)

		// mock the list of drafts
		db.any.mockResolvedValueOnce([])

		return request(app)
			.get('/')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain('Obojobo Editor')
			})
	})

	test('get returns drafts sorted alphabetically', () => {
		expect.assertions(7)

		// mock the list of drafts in backwards order
		db.any.mockResolvedValueOnce([
			{ draftId: 99, xml: 'xml-1', content: { content: { title: 'b-mock-title' } } },
			{ draftId: 100, xml: 'xml-2', content: { content: { title: 'a-mock-title' } } }
		])

		return request(app)
			.get('/')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain('a-mock-title')
				expect(response.text).toContain('b-mock-title')
				expect(response.text).toContain('data-id="99"')
				expect(response.text).toContain('data-id="100"')
				expect(response.text.indexOf('a-mock-title')).toBeLessThan(
					response.text.indexOf('b-mock-title')
				)
			})
	})

	test('get editor sets data-content for drafts with xml as expected', () => {
		expect.assertions(3)

		// mock the list of drafts with xml content
		db.any.mockResolvedValueOnce([
			{ draftId: 99, xml: 'xml-1', content: { content: { title: 'b-mock-title' } } }
		])

		return request(app)
			.get('/')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain('data-content="xml-1"')
			})
	})

	test('get editor sets data-content for drafts without xml as expected', () => {
		expect.assertions(3)

		// mock the list of drafts with no xml content
		db.any.mockResolvedValueOnce([
			{ draftId: 99, xml: null, content: { content: { title: 'b-mock-title' } } }
		])

		return request(app)
			.get('/')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain(
					'{&#34;content&#34;:{&#34;title&#34;:&#34;b-mock-title&#34;}}'
				)
			})
	})
})
