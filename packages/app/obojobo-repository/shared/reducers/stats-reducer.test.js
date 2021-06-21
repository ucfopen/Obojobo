jest.mock('redux-pack', () => {
	return {
		//TODO: FIGURE OUT WHAT TO DO WITH THIS TO MAKE UNIT TESTS WORK
		handle: jest.fn((prevState, action, steps) => ({ prevState, action, steps }))
	}
})

const statsReducer = require('./stats-reducer')

const { LOAD_MODULE_ASSESSMENT_ANALYTICS } = require('../actions/stats-actions')

const Pack = require('redux-pack')

const handleStart = handler => {
	return handler.steps.start(handler.prevState)
}
const handleSuccess = handler => {
	return handler.steps.success(handler.prevState)
}

describe('Stats Reducer', () => {
	beforeEach(() => {
		Pack.handle.mockClear()
	})

	test('LOAD_MODULE_ASSESSMENT_ANALYTICS action modifies state correctly', () => {
		const initialState = {
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
			type: LOAD_MODULE_ASSESSMENT_ANALYTICS,
			payload: mockAttemptItems
		}

		// asynchronous action - state changes on success
		const handler = statsReducer(initialState, action)
		let newState

		newState = handleStart(handler)
		expect(newState.assessmentStats).toEqual({
			isFetching: true,
			hasFetched: false,
			items: []
		})

		newState = handleSuccess(handler)
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
