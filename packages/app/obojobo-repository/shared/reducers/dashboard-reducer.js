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
	BULK_DELETE_MODULES,
	CREATE_NEW_MODULE,
	FILTER_MODULES,
	SELECT_MODULES,
	DESELECT_MODULES,
	SHOW_MODULE_MORE,
	SHOW_VERSION_HISTORY,
	RESTORE_VERSION,
	SHOW_ASSESSMENT_SCORE_DATA
} = require('../actions/dashboard-actions')

const searchPeopleResultsState = (isFetching = false, hasFetched = false, items = []) => ({
	items,
	hasFetched,
	isFetching
})

const closedDialogState = () => ({
	dialog: null,
	dialogProps: null,
	versionHistory: {
		isFetching: false,
		hasFetched: false,
		items: []
	}
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

		case BULK_DELETE_MODULES:
			return handle(state, action, {
				// update myModules, re-apply the filter, and exit multi-select mode
				success: prevState => {
					const filteredModules = filterModules(action.payload.value, state.moduleSearchString)
					return {
						...prevState,
						myModules: action.payload.value,
						filteredModules,
						selectedModules: [],
						multiSelectMode: false
					}
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

		case SELECT_MODULES:
			return {
				...state,
				selectedModules: [...state.selectedModules, ...action.draftIds],
				multiSelectMode: true
			}

		case DESELECT_MODULES:
			return {
				...state,
				selectedModules: state.selectedModules.filter(m => !action.draftIds.includes(m)),
				multiSelectMode: state.selectedModules.length !== action.draftIds.length
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

		case LOAD_USER_SEARCH:
			return handle(state, action, {
				start: prevState => ({ ...prevState, shareSearchString: action.meta.searchString }),
				success: prevState => ({ ...prevState, searchPeople: { items: action.payload.value } })
			})

		case SHOW_VERSION_HISTORY:
			return handle(state, action, {
				start: prevState => ({
					...prevState,
					dialog: 'module-version-history',
					selectedModule: action.meta.module,
					versionHistory: {
						isFetching: true,
						hasFetched: false,
						items: []
					}
				}),
				success: prevState => ({
					...prevState,
					versionHistory: {
						isFetching: false,
						hasFetched: true,
						items: action.payload
					}
				})
			})

		case SHOW_ASSESSMENT_SCORE_DATA:
			return handle(state, action, {
				start: prevState => ({
					...prevState,
					dialog: 'module-assessment-score-data',
					selectedModule: action.meta.module,
					attempts: {
						isFetching: true,
						hasFetched: false,
						items: []
					}
				}),
				success: prevState => ({
					...prevState,
					attempts: {
						isFetching: false,
						hasFetched: true,
						items: action.payload
					}
				})
			})

		case RESTORE_VERSION:
			return handle(state, action, {
				start: prevState => ({
					...prevState,
					versionHistory: {
						isFetching: true,
						hasFetched: false,
						items: []
					}
				}),
				success: prevState => ({
					...prevState,
					versionHistory: {
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

module.exports = DashboardReducer
