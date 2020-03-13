const { handle } = require('redux-pack')

const whitespaceRegex = /\s+/g

const {
	SHOW_MODULE_PERMISSIONS,
	CLOSE_MODAL,
	LOAD_USER_SEARCH,
	LOAD_USERS_FOR_MODULE,
	ADD_USER_TO_MODULE,
	CLEAR_PEOPLE_SEARCH_RESULTS,
	DELETE_MODULE_PERMISSIONS,
	DELETE_MODULE,
	CREATE_NEW_MODULE,
	FILTER_MODULES,
	SHOW_MODULE_MORE,
	CREATE_NEW_COLLECTION,
	SHOW_MODULE_MANAGE_COLLECTIONS,
	LOAD_MODULE_COLLECTIONS,
	ADD_MODULE_TO_COLLECTION,
	REMOVE_MODULE_FROM_COLLECTION,
	SHOW_COLLECTION_MANAGE_MODULES,
	SHOW_COLLECTION_RENAME,
	RENAME_COLLECTION,
	DELETE_COLLECTION
} = require('../actions/dashboard-actions')

const searchPeopleResultsState = (isFetching = false, hasFetched = false, items = []) => ({
	items,
	hasFetched,
	isFetching
})

const closedDialogState = () => ({
	dialog: null,
	dialogProps: null
})

function filterModules(modules, searchString) {
	searchString = ('' + searchString).replace(whitespaceRegex, '').toLowerCase()

	return modules.filter(m =>
		((m.title || '') + m.draftId)
			.replace(whitespaceRegex, '')
			.toLowerCase()
			.includes(searchString)
	)
}

function DashboardReducer(state, action) {
	switch (action.type) {
		case CREATE_NEW_COLLECTION:
		case RENAME_COLLECTION:
		case DELETE_COLLECTION:
			return handle(state, action, {
				success: prevState => ({
					...prevState,
					myCollections: action.payload.value
				})
			})

		case CREATE_NEW_MODULE:
			return handle(state, action, {
				// update my modules list & remove filtering because the new module could be filtered
				success: prevState => ({
					...prevState,
					myModules: action.payload.value,
					moduleSearchString: '',
					filteredModules: null
				})
			})

		case DELETE_MODULE:
			return handle(state, action, {
				// close the dialog containing the delete button
				start: () => ({ ...state, ...closedDialogState() }),
				// update myModules and re-apply the filter if one exists
				success: prevState => {
					const filteredModules = filterModules(action.payload.value, state.moduleSearchString)
					return { ...prevState, myModules: action.payload.value, filteredModules }
				}
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
				searchPeople: searchPeopleResultsState()
			}

		case CLOSE_MODAL:
			return {
				...state,
				...closedDialogState()
			}

		case FILTER_MODULES:
			return {
				...state,
				filteredModules: filterModules(state.myModules, action.searchString),
				moduleSearchString: action.searchString
			}

		case CLEAR_PEOPLE_SEARCH_RESULTS:
			return { ...state, searchPeople: searchPeopleResultsState(), shareSearchString: '' }

		case DELETE_MODULE_PERMISSIONS:
		case LOAD_USERS_FOR_MODULE:
		case ADD_USER_TO_MODULE:
			return handle(state, action, {
				// update the permissions and re-populate the search state
				start: prevState => {
					const searchPeople = searchPeopleResultsState(true)
					const newState = { ...prevState }
					newState.draftPermissions = { ...newState.draftPermissions }
					newState.draftPermissions[newState.selectedModule.draftId] = searchPeople
					return newState
				},
				// update the permissions and repopulate search state
				// update the modules if the payload contains them
				success: prevState => {
					const searchPeople = searchPeopleResultsState(false, true, action.payload.value)
					const newState = { ...prevState }
					newState.draftPermissions = { ...newState.draftPermissions }
					newState.draftPermissions[newState.selectedModule.draftId] = searchPeople
					if (action.payload.modules) newState.myModules = action.payload.modules
					return newState
				}
			})

		case LOAD_MODULE_COLLECTIONS:
		case ADD_MODULE_TO_COLLECTION:
		case REMOVE_MODULE_FROM_COLLECTION:
			return handle(state, action, {
				success: prevState => {
					const newState = { ...prevState }
					newState.draftCollections = action.payload.value
					return newState
				}
			})

		case LOAD_USER_SEARCH:
			return handle(state, action, {
				start: prevState => ({ ...prevState, shareSearchString: action.meta.searchString }),
				success: prevState => ({ ...prevState, searchPeople: { items: action.payload.value } })
			})

		case SHOW_MODULE_MANAGE_COLLECTIONS:
			return {
				...state,
				dialog: 'module-manage-collections',
				selectedModule: action.module
			}

		case SHOW_COLLECTION_MANAGE_MODULES:
			return {
				...state,
				dialog: 'collection-manage-modules',
				collection: action.collection
			}

		case SHOW_COLLECTION_RENAME:
			return {
				...state,
				dialog: 'collection-rename',
				collection: action.collection
			}

		default:
			return state
	}
}

module.exports = DashboardReducer
