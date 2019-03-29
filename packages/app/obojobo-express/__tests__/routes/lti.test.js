jest.mock('../../models/draft')
jest.mock('../../db')
jest.unmock('express') // we'll use supertest + express for this
jest.unmock('fs') // need fs working for view rendering

jest.mock('../../config', () => ({
	general: { hostname: 'mock-hostname' },
	lti: { keys: [{ 'mock-lti-key': 'mock-lti-key-value' }] }
}))

// ovveride requireCurrentDocument to provide our own
jest.mock('../../express_lti_launch', () => ({
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
app.set('views', __dirname + '../../../views/')
app.use(bodyParser.json())
app.use(addMockPropsToReq)
app.use('', oboRequire('express_response_decorator'))
app.use('/', oboRequire('routes/lti')) // mounting under api so response_decorator assumes json content type

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
				expect(response.header['content-type']).toContain('application/xml')
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
		mockCurrentUser = { id: 99, canViewEditor: true }

		return request(app)
			.post('/canvas/course_navigation')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/plain')
				expect(response.statusCode).toBe(302)
				expect(response.text).toBe('Found. Redirecting to /editor')
			})
	})

	test('course_navigation requires rejects when the user is invalid', () => {
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

	test('canvas resource_selection requires a user', () => {
		expect.assertions(3)
		mockCurrentUser = null

		return request(app)
			.post('/canvas/resource_selection')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(401)
				expect(response.text).toBe('Not Authorized')
			})
	})

	test('canvas resource_selection renders module selector when user canViewEditor', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: 'mock-return-url'
				}
			}
		}
		return request(app)
			.post('/canvas/resource_selection')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain('Pick a Learning Object')
			})
	})

	test('canvas resource_selection sets vars when NOT an assignment', () => {
		expect.assertions(4)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: 'mock-return-url'
				}
			}
		}
		return request(app)
			.post('/canvas/resource_selection')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain("window.__returnUrl = 'mock-return-url';")
				expect(response.text).toContain('window.__isAssignment = false')
			})
	})

	test('canvas resource_selection sets vars when IS an assignment', () => {
		expect.assertions(4)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: 'mock-return-url',
					ext_lti_assignment_id: 'mock-assignment-id'
				}
			}
		}
		return request(app)
			.post('/canvas/resource_selection')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain("window.__returnUrl = 'mock-return-url';")
				expect(response.text).toContain('window.__isAssignment = true')
			})
	})

	test('canvas resource_selection errors with no content_item_return_url', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: null
				}
			}
		}
		return request(app)
			.post('/canvas/resource_selection')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(500)
				expect(response.text).toContain('Unknown return url for assignment selection')
			})
	})

	test('canvas resource_selection overrides with ext_content_return_url', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: 'zombocom',
					ext_content_return_url: 'newgrounds'
				}
			}
		}
		return request(app)
			.post('/canvas/resource_selection')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain("window.__returnUrl = 'newgrounds';")
			})
	})
	//=========================

	test('canvas editor_button requires a user', () => {
		expect.assertions(3)
		mockCurrentUser = null

		return request(app)
			.post('/canvas/editor_button')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(401)
				expect(response.text).toBe('Not Authorized')
			})
	})

	test('canvas editor_button renders module selector when user canViewEditor', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: 'mock-return-url'
				}
			}
		}
		return request(app)
			.post('/canvas/editor_button')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain('Pick a Learning Object')
			})
	})

	test('canvas editor_button sets vars when NOT an assignment', () => {
		expect.assertions(4)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: 'mock-return-url'
				}
			}
		}
		return request(app)
			.post('/canvas/editor_button')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain("window.__returnUrl = 'mock-return-url';")
				expect(response.text).toContain('window.__isAssignment = false')
			})
	})

	test('canvas editor_button sets vars when IS an assignment', () => {
		expect.assertions(4)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: 'mock-return-url',
					ext_lti_assignment_id: 'mock-assignment-id'
				}
			}
		}
		return request(app)
			.post('/canvas/editor_button')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain("window.__returnUrl = 'mock-return-url';")
				expect(response.text).toContain('window.__isAssignment = true')
			})
	})

	test('canvas editor_button errors with no content_item_return_url', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: null
				}
			}
		}
		return request(app)
			.post('/canvas/editor_button')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(500)
				expect(response.text).toContain('Unknown return url for assignment selection')
			})
	})

	test('canvas editor_button overrides with ext_content_return_url', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {
				body: {
					content_item_return_url: 'zombocom',
					ext_content_return_url: 'newgrounds'
				}
			}
		}
		return request(app)
			.post('/canvas/editor_button')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toContain("window.__returnUrl = 'newgrounds';")
			})
	})

	test('canvas editor_button errors with no lti body', () => {
		expect.assertions(3)
		mockCurrentUser = { id: 99, canViewEditor: true }
		mockReqProps = {
			lti: {}
		}
		return request(app)
			.post('/canvas/editor_button')
			.type('application/x-www-form-urlencoded')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(500)
				expect(response.text).toContain('Unknown return url for assignment selection')
			})
	})
})
