jest.unmock('express') // we'll use supertest + express for this

// override requireCurrentUser to provide our own
const mockCurrentUser = { username: 'GUEST' }
const mockResetCurrentUser = jest.fn()
jest.mock('../express_current_user', () => (req, res, next) => {
	req.getCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	req.resetCurrentUser = mockResetCurrentUser
	next()
})

// setup express server
const request = require('supertest')
const express = require('express')
const app = express()
app.use(oboRequire('server/express_current_user'))
app.use('/', oboRequire('server/routes/profile'))

describe('profile routes', () => {
	test('view profile renders current user', () => {
		expect.hasAssertions()
		return request(app)
			.get('/')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expect(response.text).toBe('Hello GUEST!')
			})
	})

	test('logout... logs out', () => {
		expect.hasAssertions()
		return request(app)
			.get('/logout')
			.then(() => {
				expect(mockResetCurrentUser).toHaveBeenCalledTimes(1)
			})
	})

	test('logout redirects', () => {
		expect.hasAssertions()
		return request(app)
			.get('/logout')
			.then(response => {
				expect(response.header['content-type']).toContain('text/plain; charset=utf-8')
				expect(response.statusCode).toBe(302)
				expect(response.text).toBe('Found. Redirecting to /')
			})
	})
})
