const { handle } = require('redux-pack')

const {
	LOAD_STATS_PAGE_MODULES_FOR_USER,
	LOAD_MODULE_ASSESSMENT_DETAILS,
	LOAD_COURSE_ASSESSMENT_DATA,
} = require('../actions/stats-actions')

function StatsReducer(state, action) {
	switch (action.type) {
		case LOAD_STATS_PAGE_MODULES_FOR_USER:
			return handle(state, action, {
				start: prevState => ({
					...prevState,
					availableModules: {
						isFetching: true,
						hasFetched: false,
						items: []
					}
				}),
				success: prevState => ({
					...prevState,
					availableModules: {
						isFetching: false,
						hasFetched: true,
						items: action.payload.value
					}
				})
			})

		case LOAD_MODULE_ASSESSMENT_DETAILS:
		case LOAD_COURSE_ASSESSMENT_DATA:
			return handle(state, action, {
				start: prevState => ({
					...prevState,
					assessmentStats: {
						isFetching: true,
						hasFetched: false,
						items: []
					}
				}),
				success: prevState => ({
					...prevState,
					assessmentStats: {
						isFetching: false,
						hasFetched: true,
						items: action.payload
					}
				})
			})

		default:
			return state
	}
}

module.exports = StatsReducer
