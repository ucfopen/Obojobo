const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')

jest.mock('./shared-api-methods', () => ({
	apiGetAssessmentDetailsForDraft: () => Promise.resolve()
}))

dayjs.extend(advancedFormat)

describe('Admin Actions', () => {
	let standardFetchResponse

	let AdminActions

	// this is lifted straight out of admin-actions, for ease of comparison
	//  barring any better ways of using it
	const defaultFetchOptions = {
		method: 'GET',
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	}

	const originalFetch = global.fetch

	beforeAll(() => {
		global.fetch = jest.fn()
	})

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		jest.useFakeTimers()

		global.alert = jest.fn()

		delete window.location
		window.location = {
			reload: jest.fn()
		}

		standardFetchResponse = {
			ok: true,
			json: jest.fn(() => ({ value: 'mockVal' }))
		}

		AdminActions = require('./admin-actions')
	})

	afterAll(() => {
		global.fetch = originalFetch
	})

	test('searchForUser returns the expected output and calls other functions correctly - server ok', () => {
		global.fetch.mockResolvedValueOnce({ ...standardFetchResponse, ok: true })

		const actionReply = AdminActions.searchForUser('mockSearchString')
		jest.runAllTimers()

		expect(global.fetch).toHaveBeenCalledWith(
			'/api/users/search?q=mockSearchString',
			defaultFetchOptions
		)

		expect(actionReply).toEqual({
			type: AdminActions.LOAD_USER_SEARCH,
			meta: {
				searchString: 'mockSearchString'
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(() => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
		})
	})
	test('searchForUser returns the expected output and calls other functions correctly - server error', () => {
		const mockFetchUrl = '/api/users/search?q=mockSearchString'
		global.fetch.mockResolvedValueOnce({
			ok: false,
			url: mockFetchUrl,
			status: 500
		})

		const actionReply = AdminActions.searchForUser('mockSearchString')

		expect(actionReply).toEqual({
			type: AdminActions.LOAD_USER_SEARCH,
			meta: {
				searchString: 'mockSearchString'
			},
			promise: expect.any(Object)
		})

		jest.runAllTimers()
		return actionReply.promise.catch(error => {
			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe(
				'Error requesting /api/users/search?q=mockSearchString, status code: 500'
			)

			expect(global.fetch).toHaveBeenCalledWith(
				'/api/users/search?q=mockSearchString',
				defaultFetchOptions
			)
		})
	})

	test('addUserPermission returns the expected output and calls other functions', () => {
		global.fetch.mockResolvedValueOnce({ ...standardFetchResponse, ok: true })

		const actionReply = AdminActions.addUserPermission(5, 'someNewPermission')
		jest.runAllTimers()

		expect(global.fetch).toHaveBeenCalledWith('/api/permissions/add', {
			...defaultFetchOptions,
			method: 'POST',
			body: JSON.stringify({ userId: 5, perm: 'someNewPermission' })
		})

		expect(actionReply).toEqual({
			type: AdminActions.ADD_USER_PERMISSION,
			promise: expect.any(Object)
		})

		return actionReply.promise.then(() => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
		})
	})

	test('removeUserPermission returns the expected output and calls other functions', () => {
		global.fetch.mockResolvedValueOnce({ ...standardFetchResponse, ok: true })

		const actionReply = AdminActions.removeUserPermission(5, 'someExistingPermission')
		jest.runAllTimers()

		expect(global.fetch).toHaveBeenCalledWith('/api/permissions/remove', {
			...defaultFetchOptions,
			method: 'POST',
			body: JSON.stringify({ userId: 5, perm: 'someExistingPermission' })
		})

		expect(actionReply).toEqual({
			type: AdminActions.REMOVE_USER_PERMISSION,
			promise: expect.any(Object)
		})

		return actionReply.promise.then(() => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
		})
	})

	test('clearPeopleSearchResults returns the expected output', () => {
		const actionReply = AdminActions.clearPeopleSearchResults()

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: AdminActions.CLEAR_PEOPLE_SEARCH_RESULTS
		})
	})
})
