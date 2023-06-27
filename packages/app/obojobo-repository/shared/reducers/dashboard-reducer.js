const { handle } = require('redux-pack')

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
	BULK_ADD_MODULES_TO_COLLECTIONS,
	BULK_REMOVE_MODULES_FROM_COLLECTION,
	CREATE_NEW_MODULE,
	FILTER_MODULES,
	FILTER_COLLECTIONS,
	SELECT_MODULES,
	DESELECT_MODULES,
	SHOW_MODULE_MORE,
	CREATE_NEW_COLLECTION,
	SHOW_MODULE_MANAGE_COLLECTIONS,
	LOAD_MODULE_COLLECTIONS,
	MODULE_ADD_TO_COLLECTION,
	MODULE_REMOVE_FROM_COLLECTION,
	SHOW_COLLECTION_BULK_ADD_MODULES_DIALOG,
	SHOW_COLLECTION_MANAGE_MODULES,
	LOAD_COLLECTION_MODULES,
	COLLECTION_ADD_MODULE,
	COLLECTION_REMOVE_MODULE,
	LOAD_MODULE_SEARCH,
	CLEAR_MODULE_SEARCH_RESULTS,
	SHOW_COLLECTION_RENAME,
	RENAME_COLLECTION,
	DELETE_COLLECTION,
	SHOW_VERSION_HISTORY,
	RESTORE_VERSION,
	SHOW_ASSESSMENT_SCORE_DATA,
	SHOW_COURSES_BY_DRAFT,
	GET_DELETED_MODULES,
	GET_MODULES,
	BULK_RESTORE_MODULES
} = require('../actions/dashboard-actions')

const { filterModules, filterCollections } = require('../util/filter-functions')

const searchPeopleResultsState = (isFetching = false, hasFetched = false, items = []) => ({
	items,
	hasFetched,
	isFetching
})

const searchModuleResultsState = (isFetching = false, hasFetched = false, items = []) => ({
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

function DashboardReducer(state, action) {
	switch (action.type) {
		case CREATE_NEW_COLLECTION:
		case DELETE_COLLECTION:
			return handle(state, action, {
				success: prevState => {
					const filteredCollections = filterCollections(
						action.payload.value,
						state.collectionSearchString
					)
					return {
						...prevState,
						collectionSearchString: '',
						myCollections: action.payload.value,
						filteredCollections
					}
				}
			})
		case RENAME_COLLECTION:
			return handle(state, action, {
				success: prevState => {
					const newState = { ...prevState }
					newState.myCollections = action.payload.value
					newState.filteredCollections = filterCollections(
						action.payload.value,
						state.collectionSearchString
					)
					if (
						action.meta.currentCollectionId &&
						action.meta.changedCollectionId === action.meta.currentCollectionId
					) {
						newState.collection.title = action.meta.changedCollectionTitle
					}
					return newState
				}
			})

		case CREATE_NEW_MODULE:
			return handle(state, action, {
				// update my modules list & remove filtering because the new module could be filtered
				success: prevState => ({
					...prevState,
					moduleCount: action.payload.value.allCount,
					myModules: action.payload.value.modules,
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
					const filteredModules = filterModules(
						action.payload.value.modules,
						state.moduleSearchString
					)
					return {
						...prevState,
						moduleCount: action.payload.value.allCount,
						myModules: action.payload.value.modules,
						filteredModules
					}
				}
			})

		case BULK_DELETE_MODULES:
			return handle(state, action, {
				// update myModules, re-apply the filter, and exit multi-select mode
				success: prevState => {
					const filteredModules = filterModules(
						action.payload.value.modules,
						state.moduleSearchString
					)
					return {
						...prevState,
						myModules: action.payload.value.modules,
						moduleCount: action.payload.value.allCount,
						filteredModules,
						selectedModules: [],
						multiSelectMode: false
					}
				}
			})

		case BULK_ADD_MODULES_TO_COLLECTIONS:
			return {
				...state,
				selectedModules: [],
				multiSelectMode: false,
				dialog: 'bulk-add-successful'
			}

		case BULK_REMOVE_MODULES_FROM_COLLECTION:
			return handle(state, action, {
				success: prevState => {
					return {
						...prevState,
						myModules: action.payload.value.modules,
						collectionModules: action.payload.value.modules,
						moduleCount: action.payload.value.allCount,
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
		case FILTER_COLLECTIONS:
			return {
				...state,
				filteredCollections: filterCollections(state.myCollections, action.searchString),
				collectionSearchString: action.searchString
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
					if (action.payload.modules) {
						newState.moduleCount = action.payload.modules.allCount
						newState.myModules = action.payload.modules.modules
					}
					return newState
				}
			})

		case LOAD_MODULE_COLLECTIONS:
		case MODULE_ADD_TO_COLLECTION:
		case MODULE_REMOVE_FROM_COLLECTION:
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

		case SHOW_COLLECTION_BULK_ADD_MODULES_DIALOG:
			return {
				...state,
				dialog: 'collection-bulk-add-modules',
				selectedModules: action.selectedModules
			}

		case SHOW_COLLECTION_MANAGE_MODULES:
			return {
				...state,
				dialog: 'collection-manage-modules',
				selectedCollection: action.collection,
				searchModules: searchModuleResultsState()
			}

		case LOAD_MODULE_SEARCH:
			return handle(state, action, {
				start: prevState => ({
					...prevState,
					collectionModuleSearchString: action.meta.searchString
				}),
				success: prevState => ({
					...prevState,
					searchModules: {
						items: action.payload.value.modules
					}
				})
			})

		case CLEAR_MODULE_SEARCH_RESULTS:
			return { ...state, searchModules: searchModuleResultsState(), shareSearchString: '' }

		case COLLECTION_ADD_MODULE:
		case COLLECTION_REMOVE_MODULE:
		case LOAD_COLLECTION_MODULES:
			return handle(state, action, {
				success: prevState => {
					const newState = { ...prevState }
					newState.collectionModules = action.payload.value.modules
					if (
						action.meta.currentCollectionId &&
						action.meta.changedCollectionId === action.meta.currentCollectionId
					) {
						newState.myModules = action.payload.value.modules
					}
					return newState
				}
			})

		case SHOW_COLLECTION_RENAME:
			return {
				...state,
				dialog: 'collection-rename',
				selectedCollection: action.collection
			}

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

		case SHOW_COURSES_BY_DRAFT:
			return handle(state, action, {
				start: prevState => ({
					...prevState,
					dialog: 'module-course-score-data',
					selectedModule: action.meta.module,
					courses: {
						isFetching: true,
						hasFetched: false,
						items: []
					}
				}),
				success: prevState => ({
					...prevState,
					courses: {
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

		case GET_MODULES:
			return handle(state, action, {
				success: prevState => ({
					...prevState,
					myModules: action.payload.value
				})
			})

		case GET_DELETED_MODULES:
			return handle(state, action, {
				success: prevState => ({
					...prevState,
					myModules: action.payload.value
				})
			})

		case BULK_RESTORE_MODULES:
			return handle(state, action, {
				success: prevState => ({
					...prevState,
					selectedModules: [],
					myModules: action.payload.value,
					multiSelectMode: false
				})
			})
		default:
			return state
	}
}

module.exports = DashboardReducer
