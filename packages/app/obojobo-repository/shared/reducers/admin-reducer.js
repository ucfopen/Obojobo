const { handle } = require('redux-pack')

const {
	LOAD_STATS_PAGE_MODULES_FOR_USER,
	LOAD_MODULE_ASSESSMENT_DETAILS
} = require('../actions/admin-actions')

function AdminReducer(state, action) {
    switch (action.type) {
        case LOAD_STATS_PAGE_MODULES_FOR_USER:
        case LOAD_MODULE_ASSESSMENT_DETAILS:
        default: 
            return state
    }
}

module.exports = AdminReducer