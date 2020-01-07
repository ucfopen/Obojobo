jest.mock('../../../models/edit_lock')
jest.mock('obojobo-repository/server/services/permissions')
jest.unmock('express') // needed to use supertest

const mockCurrentUser = { id: 'mock-current-user-id' }
const mockValidatorThatPasses = jest.fn().mockImplementation((req, res, next) => {
	req.currentUser = mockCurrentUser
	next()
})

jest.mock('../../../express_validators', () => ({
	checkValidationRules: mockValidatorThatPasses,
	requireDraftId: mockValidatorThatPasses,
	requireCanViewEditor: mockValidatorThatPasses
}))

// setup express serve
const { userHasPermissionToDraft } = require('obojobo-repository/server/services/permissions')
const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const EditLock = require('../../../models/edit_lock')

app.use(bodyParser.json())
app.use('', oboRequire('express_response_decorator'))
app.use('/api/locks', oboRequire('routes/api/locks')) // mounting under api so response_decorator assumes json content type

describe('Route api/locks', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		// jest.resetModules()
	})

	test('get lock calls expected validators', () => {
		expect.hasAssertions()
		EditLock.fetchByDraftId.mockReturnValueOnce('mockLockReturn')
		expect(mockValidatorThatPasses).toHaveBeenCalledTimes(0)

		return request(app)
			.get('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(mockValidatorThatPasses).toHaveBeenCalledTimes(3)
			})
	})

	test('get lock calls EditLock.fetchByDraftId', () => {
		expect.hasAssertions()
		EditLock.fetchByDraftId.mockReturnValueOnce('mockLockReturn')

		return request(app)
			.get('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'ok')
				expect(response.body).toHaveProperty('value', 'mockLockReturn')
				expect(EditLock.fetchByDraftId).toHaveBeenCalledTimes(1)
				expect(EditLock.fetchByDraftId).toHaveBeenCalledWith('mock-draft-id')
			})
	})

	test('post lock calls expected Validators', () => {
		expect.hasAssertions()
		userHasPermissionToDraft.mockResolvedValueOnce(true)
		EditLock.fetchByDraftId.mockReturnValueOnce({ userId: mockCurrentUser.id })
		EditLock.create.mockReturnValueOnce({ userId: mockCurrentUser.id })
		expect(mockValidatorThatPasses).toHaveBeenCalledTimes(0)

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(mockValidatorThatPasses).toHaveBeenCalledTimes(3)
			})
	})

	test('post lock returns expected results', () => {
		expect.hasAssertions()
		userHasPermissionToDraft.mockResolvedValueOnce(true)
		EditLock.fetchByDraftId.mockReturnValueOnce({ userId: mockCurrentUser.id })
		EditLock.create.mockReturnValueOnce({ userId: mockCurrentUser.id })
		expect(mockValidatorThatPasses).toHaveBeenCalledTimes(0)

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'ok')
			})
	})

	test('post lock returns not authorized when user doesnt have permission to draft', () => {
		expect.hasAssertions()
		userHasPermissionToDraft.mockResolvedValueOnce(false)

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty(
					'message',
					'Authoring permissions required to create a lock.'
				)
			})
	})

	test('post lock returns not authorized when a different user has a lock', () => {
		expect.hasAssertions()
		userHasPermissionToDraft.mockResolvedValueOnce(true)
		EditLock.fetchByDraftId.mockReturnValueOnce({ userId: 'someone-else' })

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty(
					'message',
					'Draft is already locked by someone else.'
				)
			})
	})

	test('post lock returns not authorized when creating a lock doesnt work', () => {
		expect.hasAssertions()
		userHasPermissionToDraft.mockResolvedValueOnce(true)
		EditLock.fetchByDraftId.mockReturnValueOnce({ userId: mockCurrentUser.id })
		EditLock.create.mockReturnValueOnce({ userId: 'some-other-user' })

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).not.toHaveProperty('message')
			})
	})

	test('post lock returns a 500 when an error occurs', () => {
		expect.hasAssertions()
		userHasPermissionToDraft.mockImplementationOnce(() => {
			throw new Error('mock-error')
		})

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(500)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty('message', 'mock-error')
			})
	})

	test('post lock calls EditLock.deleteExpiredLocks', () => {
		expect.hasAssertions()
		userHasPermissionToDraft.mockResolvedValueOnce(true)
		EditLock.fetchByDraftId.mockReturnValueOnce({ userId: mockCurrentUser.id })
		EditLock.create.mockReturnValueOnce({ userId: mockCurrentUser.id })

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(EditLock.deleteExpiredLocks).toHaveBeenCalledTimes(1)
			})
	})
})
