jest.mock('redux-pack', () => {
	return {
		handle: jest.fn((prevState, action, steps) => ({ prevState, action, steps }))
	}
})
const Pack = require('redux-pack')

const { LOAD_USER_SEARCH } = require('../actions/admin-actions')

const adminReducer = require('./admin-reducer')

const handleStart = handler => {
	return handler.steps.start(handler.prevState)
}
const handleSuccess = handler => {
	return handler.steps.success(handler.prevState)
}

describe('Admin Reducer', () => {
	const defaultSearchResultsState = {
		isFetching: false,
		hasFetched: false,
		items: []
	}

	beforeEach(() => {
		Pack.handle.mockClear()
	})

	test('LOAD_USER_SEARCH action modifies state correctly', () => {
		const initialState = {
			userSearchString: 'oldSearchString',
			searchUsers: { ...defaultSearchResultsState }
		}

		const mockUserList = [
			{
				id: 0,
				displayName: 'firstName lastName'
			},
			{
				id: 1,
				displayName: 'firstName2 lastName2'
			}
		]
		const action = {
			type: LOAD_USER_SEARCH,
			meta: {
				searchString: 'newSearchString'
			},
			payload: {
				value: mockUserList
			}
		}

		// asynchronous action - state changes on success
		const handler = adminReducer(initialState, action)
		let newState

		newState = handleStart(handler)
		expect(newState.userSearchString).toEqual('newSearchString')
		expect(newState.searchUsers).toEqual(initialState.searchUsers)

		newState = handleSuccess(handler)
		expect(newState.searchUsers).not.toEqual(initialState.searchUsers)
		expect(newState.searchUsers).toEqual({
			items: mockUserList
		})
	})

	test('unrecognized action types just return the current state', () => {
		const initialState = {
			key: 'initialValue'
		}

		const action = {
			type: 'UNSUPPORTED_TYPE',
			key: 'someOtherValue'
		}

		const newState = adminReducer(initialState, action)
		expect(newState.key).toEqual(initialState.key)
	})
})
