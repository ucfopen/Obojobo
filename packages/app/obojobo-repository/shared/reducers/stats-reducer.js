const { handle } = require('redux-pack')

const { LOAD_MODULE_ASSESSMENT_DETAILS } = require('../actions/stats-actions')

function StatsReducer(state, action) {
	switch (action.type) {
		case LOAD_MODULE_ASSESSMENT_DETAILS:
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
