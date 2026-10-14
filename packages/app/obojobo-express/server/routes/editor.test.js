jest.mock('../db')
jest.unmock('fs') // need fs working for view rendering
jest.unmock('express') // we'll use supertest + express for this
jest.mock(
	'../asset_resolver',
	() => ({
		assetForEnv: path => path,
		webpackAssetPath: path => path
	}),
	{ virtual: true }
)
// override requireCurrentUser for tests to provide our own user
let mockCurrentUser

// override requireCurrentDocument for tests to provide our own document
let mockCurrentDocument

jest.mock('../express_current_user', () => (req, res, next) => {
	req.requireCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	req.getCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	next()
})

jest.mock('../express_current_document', () => (req, res, next) => {
	req.requireCurrentDocument = () => {
		req.currentDocument = mockCurrentDocument
		return Promise.resolve(mockCurrentDocument)
	}
	next()
})

// setup express server
const db = oboRequire('server/db')
const request = require('supertest')
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/../views/')
app.use(oboRequire('server/express_current_user'))
app.use(oboRequire('server/express_current_document'))
app.use('/', oboRequire('server/express_response_decorator'))
app.use('/', oboRequire('server/routes/editor'))

describe('editor route', () => {
	beforeEach(() => {
		db.any.mockReset()
		mockCurrentUser = { id: 99, hasPermission: perm => perm === 'canViewEditor' } // should meet auth requirements
		mockCurrentDocument = {}
	})

	test('get editor/draftId returns the expected response', () => {
		expect.hasAssertions()
		mockCurrentUser.isGuest = () => false

		// mock the list of drafts
		db.any.mockResolvedValueOnce([])

		return request(app)
			.get('/visual/draft/mockId')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain('Obojobo Visual Editor')
				expect()
			})
	})

	test('get visual editor rejects users without canViewEditor permission', () => {
		expect.hasAssertions()
		mockCurrentUser = { id: 99, hasPermission: () => false } // shouldn't meet auth requirements
		mockCurrentUser.isGuest = () => false
		return request(app)
			.get('/visual/draft/mockId')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('text/html')
				expect(response.text).toBe('Not Authorized')
			})
	})

	test('get visual editor rejects without canViewEditor access', () => {
		expect.hasAssertions()
		mockCurrentUser = { id: 99, hasPermission: () => false } // shouldn't meet auth requirements
		mockCurrentUser.isGuest = () => false
		return request(app)
			.get('/visual/draft/mockId')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('text/html')
				expect(response.text).toBe('Not Authorized')
			})
	})

	test('get visual editor handles readOnly setting', () => {
		expect.hasAssertions()
		mockCurrentUser = { id: 99, hasPermission: perm => perm === 'canViewEditor' } // should meet auth requirements
		mockCurrentUser.isGuest = () => false

		return request(app)
			.get('/visual/draft/mockId')
			.query({ read_only: '1' })
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(response.header['content-type']).toContain('text/html')
				expect(response.text).toContain('"readOnly":true')
			})
	})
})
