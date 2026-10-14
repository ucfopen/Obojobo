jest.mock('../../models/edit_lock', () => ({
	fetchByDraftId: jest.fn(),
	create: jest.fn(),
	deleteExpiredLocks: jest.fn(),
	deleteByDraftIdAndUser: jest.fn()
}))
jest.mock('obojobo-repository/server/models/draft_permissions')
jest.unmock('express') // needed to use supertest

const mockCurrentUser = { id: 'mock-current-user-id' }
const mockValidatorThatPasses = jest.fn().mockImplementation((req, res, next) => {
	req.currentUser = mockCurrentUser
	next()
})

jest.mock('../../express_validators', () => ({
	checkValidationRules: mockValidatorThatPasses,
	requireDraftId: mockValidatorThatPasses,
	requireContentId: mockValidatorThatPasses,
	requireCanViewEditor: mockValidatorThatPasses
}))

import { FULL, MINIMAL } from '../../../server/constants'

describe('Route api/locks', () => {
	let request
	let bodyParser
	let EditLock
	let app
	let DraftPermissions

	beforeEach(() => {
		jest.clearAllMocks()
		// jest.resetModules()
		global.oboJestMockConfig()
		DraftPermissions = require('obojobo-repository/server/models/draft_permissions')
		request = require('supertest')
		const express = require('express')
		bodyParser = require('body-parser')
		app = express()
		EditLock = require('../../models/edit_lock')
		app.use(bodyParser.json())
		app.use('', oboRequire('server/express_response_decorator'))
		app.use('/api/locks', oboRequire('server/routes/api/locks')) // mounting under api so response_decorator assumes json content type
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
		DraftPermissions.getUserAccessLevelToDraft.mockResolvedValueOnce(FULL)
		EditLock.fetchByDraftId.mockReturnValueOnce({ userId: mockCurrentUser.id })
		EditLock.create.mockReturnValueOnce({ userId: mockCurrentUser.id })
		expect(mockValidatorThatPasses).toHaveBeenCalledTimes(0)

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(mockValidatorThatPasses).toHaveBeenCalledTimes(4)
			})
	})

	test('post lock returns expected results', () => {
		expect.hasAssertions()
		DraftPermissions.getUserAccessLevelToDraft.mockResolvedValueOnce(FULL)
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

	test('post lock returns not authorized when user doesnt have "Full" or "Partial" access level to draft', () => {
		expect.hasAssertions()
		DraftPermissions.getUserAccessLevelToDraft.mockResolvedValueOnce(MINIMAL)

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty(
					'message',
					'You do not have the required access level to edit this module.'
				)
			})
	})

	test('post lock returns not authorized when a different user has a lock', () => {
		expect.hasAssertions()
		DraftPermissions.getUserAccessLevelToDraft.mockResolvedValueOnce(FULL)
		EditLock.fetchByDraftId.mockReturnValueOnce({ userId: 'someone-else' })

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty(
					'value.message',
					'Someone else is currently editing this module.'
				)
			})
	})

	test('post lock returns not authorized when creating a lock doesnt work', () => {
		expect.hasAssertions()
		DraftPermissions.getUserAccessLevelToDraft.mockResolvedValueOnce(FULL)
		EditLock.fetchByDraftId.mockReturnValueOnce({ userId: mockCurrentUser.id })
		EditLock.create.mockReturnValueOnce({ userId: 'some-other-user' })

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty(
					'value.message',
					'Someone else is currently editing this module.'
				)
			})
	})

	test('post lock returns a 403 when the contentId does not match', () => {
		expect.hasAssertions()
		DraftPermissions.getUserAccessLevelToDraft.mockImplementationOnce(() => {
			throw new Error('Current version of draft does not match requested lock.')
		})

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(403)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty(
					'message',
					'Draft has been updated by someone else.'
				)
			})
	})

	test('post lock returns a 500 when an unexpected error occurs', () => {
		expect.hasAssertions()
		DraftPermissions.getUserAccessLevelToDraft.mockImplementationOnce(() => {
			throw new Error('mock-error')
		})

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(500)
				expect(response.header['content-type']).toContain('application/json')
				expect(response.body).toHaveProperty('status', 'error')
				expect(response.body).toHaveProperty('value')
				expect(response.body.value).toHaveProperty(
					'message',
					'Unexpected error while creating edit lock.'
				)
			})
	})

	test('post lock calls EditLock.deleteExpiredLocks', () => {
		expect.hasAssertions()
		DraftPermissions.getUserAccessLevelToDraft.mockResolvedValueOnce(FULL)
		EditLock.fetchByDraftId.mockReturnValueOnce({ userId: mockCurrentUser.id })
		EditLock.create.mockReturnValueOnce({ userId: mockCurrentUser.id })

		return request(app)
			.post('/api/locks/mock-draft-id')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(EditLock.deleteExpiredLocks).toHaveBeenCalledTimes(1)
			})
	})

	test('post delete calls deleteByDraftIdAndUser', () => {
		expect.hasAssertions()

		return request(app)
			.post('/api/locks/mock-draft-id/delete')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(EditLock.deleteByDraftIdAndUser).toHaveBeenCalledTimes(1)
				expect(EditLock.deleteByDraftIdAndUser).toHaveBeenCalledWith(
					'mock-current-user-id',
					'mock-draft-id'
				)
			})
	})
})
