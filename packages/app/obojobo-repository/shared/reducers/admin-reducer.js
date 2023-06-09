const { handle } = require('redux-pack')

const { LOAD_USER_SEARCH } = require('../actions/admin-actions')

function AdminReducer(state, action) {
	switch (action.type) {
		case LOAD_USER_SEARCH:
			return handle(state, action, {
				start: prevState => ({ ...prevState, userSearchString: action.meta.searchString }),
				success: prevState => ({ ...prevState, searchUsers: { items: action.payload.value } })
			})

		default:
			return state
	}
}

module.exports = AdminReducer
