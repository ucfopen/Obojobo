jest.mock('redux-pack', () => {
	return {
		//TODO: FIGURE OUT WHAT TO DO WITH THIS TO MAKE UNIT TESTS WORK
		handle: jest.fn((prevState, action, steps) => ({ prevState, action, steps }))
	}
})

const statsReducer = require('./stats-reducer')

const {
	LOAD_STATS_PAGE_MODULES_FOR_USER,
	LOAD_MODULE_ASSESSMENT_DETAILS
} = require('../actions/stats-actions')

const Pack = require('redux-pack')

const handleStart = handler => {
	return handler.steps.start(handler.prevState)
}
const handleSuccess = handler => {
	return handler.steps.success(handler.prevState)
}

describe('Stats Reducer', () => {
	const mockModuleList = [
		{
			draftId: 'mock-draft-id-1',
			title: 'mock-title-1',
			createdAt: 'mock-created-at',
			updatedAt: 'mock-updated-at',
			latestVersion: 'mock-latest-version',
			revisionCount: 1
		},
		{
			draftId: 'mock-draft-id-2',
			title: 'mock-title-2',
			createdAt: 'mock-created-at',
			updatedAt: 'mock-updated-at',
			latestVersion: 'mock-latest-version',
			revisionCount: 1
		}
	]

	beforeEach(() => {
		Pack.handle.mockClear()
	})

	test('LOAD_STATS_PAGE_MODULES_FOR_USER action modifies state correctly', () => {
		const unalteredAssessmentStats = {
			isFetching: false,
			hasFetched: false,
			items: []
		}

		const initialState = {
			availableModules: {
				isFetching: false,
				hasFetched: false,
				items: []
			},
			assessmentStats: unalteredAssessmentStats
		}
		const action = {
			type: LOAD_STATS_PAGE_MODULES_FOR_USER,
			payload: {
				value: mockModuleList
			}
		}

		// asynchronous action - state changes on success
		const handler = statsReducer(initialState, action)
		let newState

		newState = handleStart(handler)
		expect(newState.assessmentStats).toEqual(unalteredAssessmentStats)
		expect(newState.availableModules).toEqual({
			isFetching: true,
			hasFetched: false,
			items: []
		})

		newState = handleSuccess(handler)
		expect(newState.assessmentStats).toEqual(unalteredAssessmentStats)
		expect(newState.availableModules).not.toEqual(initialState.availableModules)
		expect(newState.availableModules).toEqual({
			isFetching: false,
			hasFetched: true,
			items: mockModuleList
		})
	})

	test('LOAD_MODULE_ASSESSMENT_DETAILS action modifies state correctly', () => {
		const unalteredAvailableModules = {
			isFetching: false,
			hasFetched: false,
			items: mockModuleList
		}
		const initialState = {
			availableModules: unalteredAvailableModules,
			assessmentStats: {
				isFetching: false,
				hasFetched: false,
				items: []
			}
		}

		const mockAttemptItems = [
			{
				id: 'mockAttemptId1'
			},
			{
				id: 'mockAttemptId2'
			},
			{
				id: 'mockAttemptId3'
			}
		]
		const action = {
			type: LOAD_MODULE_ASSESSMENT_DETAILS,
			payload: mockAttemptItems
		}

		// asynchronous action - state changes on success
		const handler = statsReducer(initialState, action)
		let newState

		newState = handleStart(handler)
		expect(newState.availableModules).toEqual(unalteredAvailableModules)
		expect(newState.assessmentStats).toEqual({
			isFetching: true,
			hasFetched: false,
			items: []
		})

		newState = handleSuccess(handler)
		expect(newState.availableModules).toEqual(unalteredAvailableModules)
		expect(newState.assessmentStats).not.toEqual(initialState.assessmentStats)
		expect(newState.assessmentStats).toEqual({
			isFetching: false,
			hasFetched: true,
			items: mockAttemptItems
		})
	})

	test('Non-understood action just returns state', () => {
		const initialState = {}

		const action = {
			type: 'non-understood-action'
		}

		expect(statsReducer(initialState, action)).toBe(initialState)
	})
})
