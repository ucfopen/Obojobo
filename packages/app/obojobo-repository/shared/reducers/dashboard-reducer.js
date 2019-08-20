const { handle } = require('redux-pack');

const { SHOW_MODULE_PERMISSIONS,
	CLOSE_MODAL,
	LOAD_USER_SEARCH,
	LOAD_USERS_FOR_MODULE,
	ADD_USER_TO_MODULE,
	CLEAR_PEOPLE_SEARCH_RESULTS,
	DELETE_MODULE_PERMISSIONS,
	DELETE_MODULE,
	CREATE_NEW_MODULE,
	FILTER_MODULES,
	SHOW_MODULE_MORE
} = require('../actions/dashboard-actions')

const defaultResults = (isFetching = false, hasFetched = false, items = []) => ({
	items,
	hasFetched,
	isFetching
})


function filterModules(modules, searchString){
	return modules.filter(m => {
		return `${m.title.toLowerCase()}${m.draftId}`.includes(searchString)
	})
}

function DashboardReducer(state, action) {
	console.log(action)
	switch (action.type) {
		case CREATE_NEW_MODULE:
		case DELETE_MODULE:
			return handle(state, action, {
				success: prevState => ({...prevState, myModules: action.payload.value, dialog: null}),
			})

		case SHOW_MODULE_MORE:
			return {
				...state,
				dialog: 'module-more',
				selectedModule: action.module
			}

		case SHOW_MODULE_PERMISSIONS:
			return {
				...state,
				dialog: 'module-permissions',
				selectedModule: action.module,
				searchPeople: defaultResults()
			}

		case CLOSE_MODAL:
			return {
				...state,
				dialog: null,
				dialogProps: null
			}

		case FILTER_MODULES:
			const filteredModules = filterModules(state.myModules, action.searchString)
			return { ...state, filteredModules}

		case CLEAR_PEOPLE_SEARCH_RESULTS:
			return {...state, searchPeople: defaultResults()}

		case DELETE_MODULE_PERMISSIONS:
		case LOAD_USERS_FOR_MODULE:
		case ADD_USER_TO_MODULE:
			return handle(state, action, {
				start: prevState => {
					const newState = {...prevState}
					newState.draftPermissions = {...newState.draftPermissions}
					newState.draftPermissions[newState.selectedModule.draftId] = defaultResults(true)
					return newState
				},
				success: prevState => {
					const newState = {...prevState}
					newState.draftPermissions = {...newState.draftPermissions}
					newState.draftPermissions[newState.selectedModule.draftId] = defaultResults(false, true, action.payload.value.sort())
					// update the modules if the payload contains them
					if(action.payload.modules) newState.myModules = action.payload.modules
					return newState
				},
				// failure: prevState => ({...prevState}),
			})

		case LOAD_USER_SEARCH:
			return handle(state, action, {
				// start: prevState => ({...prevState}),
				success: prevState => ({...prevState, searchPeople: {items: action.payload.value.sort()}}),
				// failure: prevState => ({...prevState})
			})

		default:
			return state
	}
}

module.exports = DashboardReducer;
