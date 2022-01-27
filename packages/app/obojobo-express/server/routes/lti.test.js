jest.mock('../../server/models/draft')
jest.mock('../../server/db')
jest.unmock('express') // we'll use supertest + express for this
jest.unmock('fs') // need fs working for view rendering

jest.mock('../../server/config', () => ({
	general: { hostname: 'mock-hostname' },
	lti: { keys: [{ 'mock-lti-key': 'mock-lti-key-value' }] }
}))

// ovveride requireCurrentDocument to provide our own
jest.mock('../../server/express_lti_launch', () => ({
	assignmentSelection: (req, res, next) => {
		next()
	},
	courseNavlaunch: (req, res, next) => {
		next()
	}
}))

// ovveride requireCurrentDocument to provide our own
let mockCurrentDocument
let mockCurrentUser
let mockReqProps

const addMockPropsToReq = (req, res, next) => {
	for (const prop in mockReqProps) {
		req[prop] = mockReqProps[prop]
	}
	req.requireCurrentDocument = () => {
		req.currentDocument = mockCurrentDocument
		return Promise.resolve(mockCurrentDocument)
	}
	req.requireCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	req.getCurrentUser = jest.fn()
	req.get = () => 'mock-hostname' // used to mock req.get('host')
	next()
}

// setup express server
const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '../../../server/views/')
app.use(bodyParser.json())
app.use(addMockPropsToReq)
app.use('', oboRequire('server/express_response_decorator'))
app.use('/', oboRequire('server/routes/lti')) // mounting under api so response_decorator assumes json content type

describe('lti route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockReqProps = {}
	})
	afterEach(() => {})

	test('index renders template', () => {
		expect.assertions(4)
		mockCurrentUser = null
		mockCurrentDocument = null
		return request(app)
			.get('/')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(response.header['content-type']).toContain('text/html')
				expect(response.text).toContain('Obojobo LTI Launch')
				expect(response.text).toContain('http://mock-hostname/lti/config.xml')
			})
	})

	test('config.xml renders template', () => {
		expect.assertions(5)
		mockCurrentUser = null
		mockCurrentDocument = null
		return request(app)
			.get('/config.xml')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(response.header['content-type']).toContain('application/xml; charset=utf-8')
				expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>')
				expect(response.text).toContain(
					'<blti:launch_url>http://mock-hostname/lti</blti:launch_url>'
				)
				expect(response.text).toContain(
					'<lticm:property name="domain">mock-hostname</lticm:property>'
				)
			})
	})

	test('course_navigation redirects users with canViewEditor', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, hasPermission: perm => perm === 'canViewEditor' }

		return request(app)
			.post('/canvas/course_navigation')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/plain')
				expect(response.statusCode).toBe(302)
				expect(response.text).toBe('Found. Redirecting to /dashboard')
			})
	})

	test('course_navigation rejects when the user is invalid', () => {
		expect.assertions(3)
		mockCurrentUser = null

		return request(app)
			.post('/canvas/course_navigation')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(401)
				expect(response.text).toBe('Not Authorized')
			})
	})
})
