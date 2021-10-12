jest.mock('redux-pack', () => {
	return {
		//TODO: FIGURE OUT WHAT TO DO WITH THIS TO MAKE UNIT TESTS WORK
		handle: jest.fn((prevState, action, steps) => ({ prevState, action, steps }))
	}
})

const dashboardReducer = require('./dashboard-reducer')

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
	SHOW_ASSESSMENT_SCORE_DATA,
	RESTORE_VERSION,
	GET_MODULES,
	GET_DELETED_MODULES,
	BULK_RESTORE_MODULES
} = require('../actions/dashboard-actions')

const Pack = require('redux-pack')

const handleStart = handler => {
	return handler.steps.start(handler.prevState)
}
const handleSuccess = handler => {
	return handler.steps.success(handler.prevState)
}

describe('Dashboard Reducer', () => {
	const defaultSearchResultsState = {
		isFetching: false,
		hasFetched: false,
		items: []
	}

	beforeEach(() => {
		Pack.handle.mockClear()
	})

	const runCreateOrDeleteModuleActionTest = testAction => {
		const isDeleteModuleTest = testAction === DELETE_MODULE
		const mockModuleList = [
			{
				draftId: 'mockDraftId',
				title: '' // filtering logic has a branch for empty titles that needs covering
			},
			{
				draftId: 'mockDraftId2',
				title: 'B Mock Module'
			}
		]

		const initialState = {
			dialog: 'module-options',
			moduleSearchString: isDeleteModuleTest ? 'B' : '',
			myModules: [
				{
					draftId: 'oldMockDraftId',
					title: 'Old Mock Module'
				}
			],
			filteredModules: [
				{
					draftId: 'oldMockDraftId',
					title: 'Old Mock Module'
				}
			]
		}
		const action = {
			type: testAction,
			// this action occurs after the current user's modules are
			//  queried - so it will contain a list of modules
			payload: {
				value: mockModuleList
			}
		}

		const handler = dashboardReducer(initialState, action)

		// DELETE_MODULE changes state on start AND success, CREATE_MODULE just on success
		let newState
		if (isDeleteModuleTest) {
			newState = handleStart(handler)
			expect(newState.dialog).toBe(null)
			// no module list changes should have happened yet
			expect(newState.myModules).toEqual(initialState.myModules)
			expect(newState.filteredModules).toEqual(initialState.filteredModules)
		}

		newState = handleSuccess(handler)
		expect(newState.myModules).not.toEqual(initialState.myModules)
		expect(newState.myModules).toEqual(mockModuleList)
		if (isDeleteModuleTest) {
			expect(newState.filteredModules).not.toEqual(initialState.filteredModules)
			expect(newState.moduleSearchString).toEqual(initialState.moduleSearchString)
			expect(newState.filteredModules).toEqual([{ ...mockModuleList[1] }])
		} else {
			expect(newState.moduleSearchString).toBe('')
			expect(newState.filteredModules).toBe(null)
		}
	}

	const runModuleUserActionTest = (testAction, testModules = false) => {
		const mockModule = {
			draftId: 'mockDraftId',
			title: 'Mock Module Title'
		}
		const mockInitialDraftPermissions = {
			...defaultSearchResultsState,
			items: [
				{
					id: 0,
					displayName: 'firstName lastName'
				}
			]
		}
		const mockModuleList = [mockModule]
		const mockUserList = [
			{
				id: 1,
				displayName: 'firstName2 lastName2'
			},
			{
				id: 2,
				displayName: 'firstName3 lastName3'
			}
		]

		const initialState = {
			shareSearchString: 'oldSearchString',
			searchPeople: null,
			selectedModule: mockModule,
			draftPermissions: {
				mockDraftId: mockInitialDraftPermissions
			},
			myModules: [
				...mockModuleList,
				{
					draftId: 'mockSomeOtherDraftId',
					title: 'Some Other Mock Module Title'
				}
			]
		}

		const modulePayload = mockModuleList

		const action = {
			type: testAction,
			payload: {
				// eslint-disable-next-line no-undefined
				modules: testModules ? modulePayload : undefined,
				value: mockUserList
			}
		}

		const handler = dashboardReducer(initialState, action)

		let newState

		newState = handleStart(handler)
		expect(newState.draftPermissions).not.toEqual(initialState.draftPermissions)
		expect(newState.draftPermissions['mockDraftId']).toEqual({
			...defaultSearchResultsState,
			isFetching: true
		})

		newState = handleSuccess(handler)
		expect(newState.draftPermissions).not.toEqual(initialState.draftPermissions)
		expect(newState.draftPermissions['mockDraftId']).toEqual({
			...defaultSearchResultsState,
			hasFetched: true,
			items: mockUserList
		})
		if (testModules) {
			expect(newState.myModules).not.toEqual(initialState.myModules)
			expect(newState.myModules).toEqual(mockModuleList)
		}
	}

	test('CREATE_NEW_MODULE action modifies state correctly', () => {
		runCreateOrDeleteModuleActionTest(CREATE_NEW_MODULE)
	})

	//DELETE_MODULE is more or less the same as CREATE_MODULE, but will auto-filter new modules
	test('DELETE_MODULE action modifies state correctly', () => {
		runCreateOrDeleteModuleActionTest(DELETE_MODULE)
	})

	test('BULK_DELETE_MODULES action modifies state correctly', () => {
		const mockModuleList = [
			{
				draftId: 'mockDraftId',
				title: 'A Mock Module'
			},
			{
				draftId: 'mockDraftId2',
				title: 'B Mock Module'
			}
		]

		const initialState = {
			multiSelectMode: true,
			moduleSearchString: '',
			selectedModules: ['mockDraftId', 'mockDraftId3'],
			myModules: [
				{
					draftId: 'oldMockDraftId',
					title: 'Old Mock Module'
				}
			],
			filteredModules: [
				{
					draftId: 'oldMockDraftId',
					title: 'Old Mock Module'
				}
			]
		}

		const action = {
			type: BULK_DELETE_MODULES,
			payload: {
				value: mockModuleList
			}
		}

		const handler = dashboardReducer(initialState, action)

		const newState = handleSuccess(handler)
		expect(newState.myModules).not.toEqual(initialState.myModules)
		expect(newState.myModules).toEqual(mockModuleList)
		expect(newState.filteredModules).toEqual(mockModuleList)
		expect(newState.selectedModules).toEqual([])
		expect(newState.multiSelectMode).toBe(false)
	})

	test('SHOW_MODULE_MORE action modifies state correctly', () => {
		const initialState = {
			dialog: null,
			selectedModule: {
				draftId: 'someMockDraftId',
				title: 'Some Mock Module Title'
			}
		}
		const mockSelectedModule = {
			draftId: 'otherMockDraftId',
			title: 'Some Other Mock Module Title'
		}
		const action = {
			type: SHOW_MODULE_MORE,
			module: mockSelectedModule
		}

		// SHOW_MODULE_MORE is a synchronous action - state changes immediately
		const newState = dashboardReducer(initialState, action)
		expect(newState.dialog).toBe('module-more')
		expect(newState.selectedModule).not.toEqual(initialState.selectedModule)
		expect(newState.selectedModule).toEqual(mockSelectedModule)
	})

	test('SHOW_MODULE_PERMISSIONS action modifies state correctly', () => {
		const initialState = {
			dialog: null,
			selectedModule: {
				draftId: 'someMockDraftId',
				title: 'Some Mock Module Title'
			},
			searchPeople: null
		}
		const mockSelectedModule = {
			draftId: 'otherMockDraftId',
			title: 'Some Other Mock Module Title'
		}
		const action = {
			type: SHOW_MODULE_PERMISSIONS,
			module: mockSelectedModule
		}

		// SHOW_MODULE_PERMISSIONS is a synchronous action - state changes immediately
		const newState = dashboardReducer(initialState, action)
		expect(newState.dialog).toBe('module-permissions')
		expect(newState.selectedModule).not.toEqual(initialState.selectedModule)
		expect(newState.selectedModule).toEqual(mockSelectedModule)
		// searchPeople is a little odd - it contains the fetch status of the people search
		//  and also the results of that search, at any given time
		expect(newState.searchPeople).toEqual(defaultSearchResultsState)
	})

	test('CLOSE_MODAL action modifies state correctly', () => {
		const initialState = {
			dialog: 'some-dialog'
		}
		const action = {
			type: CLOSE_MODAL
		}

		// CLOSE_MODAL is a synchronous action - state changes immediately
		const newState = dashboardReducer(initialState, action)
		expect(newState.dialog).toBe(null)
	})

	test('FILTER_MODULES action modifies state correctly', () => {
		const initialState = {
			moduleSearchString: 'oldSearchString',
			myModules: [
				{
					draftId: 'mockDraftId',
					title: 'A Mock Module'
				},
				{
					draftId: 'mockDraftId2',
					title: 'B Mock Module'
				}
			],
			filteredModules: [
				{
					draftId: 'oldMockDraftId',
					title: 'Old Mock Module'
				}
			]
		}
		const action = {
			type: FILTER_MODULES,
			searchString: 'B'
		}

		// FILTER_MODULES is a synchronous action - state changes immediately
		const newState = dashboardReducer(initialState, action)
		expect(newState.myModules).toEqual(initialState.myModules)
		expect(newState.filteredModules).toEqual([{ ...initialState.myModules[1] }])
		expect(newState.moduleSearchString).toBe('B')
	})

	test('SELECT_MODULES action modifies state correctly', () => {
		const initialState = {
			multiSelectMode: false,
			myModules: [
				{
					draftId: 'mockDraftId',
					title: 'A Mock Module'
				},
				{
					draftId: 'mockDraftId2',
					title: 'B Mock Module'
				},
				{
					draftId: 'mockDraftId3',
					title: 'C Mock Module'
				}
			],
			selectedModules: []
		}
		const action = {
			type: SELECT_MODULES,
			draftIds: ['mockDraftId', 'mockDraftId3']
		}

		// SELECT_MODULES is a synchronous action - state changes immediately
		const newState = dashboardReducer(initialState, action)
		expect(newState.myModules).toEqual(initialState.myModules)
		expect(newState.selectedModules).toEqual(['mockDraftId', 'mockDraftId3'])
		expect(newState.multiSelectMode).toBe(true)
	})

	test('DESELECT_MODULES action modifies state correctly', () => {
		const initialState = {
			multiSelectMode: true,
			myModules: [
				{
					draftId: 'mockDraftId',
					title: 'A Mock Module'
				},
				{
					draftId: 'mockDraftId2',
					title: 'B Mock Module'
				},
				{
					draftId: 'mockDraftId3',
					title: 'C Mock Module'
				}
			],
			selectedModules: ['mockDraftId', 'mockDraftId3']
		}
		const action = {
			type: DESELECT_MODULES,
			draftIds: ['mockDraftId']
		}

		// DESELECT_MODULES is a synchronous action - state changes immediately
		const newState = dashboardReducer(initialState, action)
		expect(newState.myModules).toEqual(initialState.myModules)
		expect(newState.selectedModules).toEqual(['mockDraftId3'])
		expect(newState.multiSelectMode).toBe(true)
	})

	test('CLEAR_PEOPLE_SEARCH_RESULTS action modifies state correctly', () => {
		const initialState = {
			shareSearchString: 'oldSearchString',
			searchPeople: null
		}

		const action = { type: CLEAR_PEOPLE_SEARCH_RESULTS }

		// CLEAR_PEOPLE_SEARCH_RESULTS is a synchronous action - state changes immediately
		const newState = dashboardReducer(initialState, action)
		expect(newState.searchPeople).toEqual(defaultSearchResultsState)
		expect(newState.shareSearchString).toBe('')
	})

	test('DELETE_MODULE_PERMISSIONS action modifies state correctly', () => {
		// DELETE_MODULE_PERMISSIONS will also return a list of modules since it's
		//  possible to remove your own access to every module you have
		runModuleUserActionTest(DELETE_MODULE_PERMISSIONS, true)
	})
	test('LOAD_USERS_FOR_MODULE action modifies state correctly', () => {
		runModuleUserActionTest(LOAD_USERS_FOR_MODULE)
	})
	test('ADD_USER_TO_MODULE action modifies state correctly', () => {
		runModuleUserActionTest(ADD_USER_TO_MODULE)
	})

	test('LOAD_USER_SEARCH action modifies state correctly', () => {
		const initialState = {
			shareSearchString: 'oldSearchString',
			searchPeople: { ...defaultSearchResultsState }
		}

		const mockUserList = [
			{
				id: 0,
				displayName: 'firstName lastName'
			},
			{
				id: 1,
				displayName: 'firstName2 lastName2'
			}
		]
		const action = {
			type: LOAD_USER_SEARCH,
			meta: {
				searchString: 'newSearchString'
			},
			payload: {
				value: mockUserList
			}
		}

		// asynchronous action - state changes on success
		const handler = dashboardReducer(initialState, action)
		let newState

		newState = handleStart(handler)
		expect(newState.shareSearchString).toEqual('newSearchString')
		expect(newState.searchPeople).toEqual(initialState.searchPeople)

		newState = handleSuccess(handler)
		expect(newState.searchPeople).not.toEqual(initialState.searchPeople)
		expect(newState.searchPeople).toEqual({
			items: mockUserList
		})
	})

	test('SHOW_VERSION_HISTORY action modifies state correctly', () => {
		const initialState = {
			dialog: null,
			dialogProps: null,
			versionHistory: {
				isFetching: false,
				hasFetched: false,
				items: []
			},
			selectedModule: {
				draftId: 'someMockDraftId',
				title: 'Some Mock Module Title'
			}
		}

		const mockModule = {
			draftId: 'someOtherMockDraftId',
			title: 'Some Other Mock Module Title'
		}

		const mockHistoryItems = [
			{
				id: 'mockHistoryId1',
				createdAtDisplay: 'mockCreatedAtDisplay1',
				username: 'mockUserName1',
				versionNumber: 'mockVersionNumber1',
				isRestored: false
			},
			{
				id: 'mockHistoryId2',
				createdAtDisplay: 'mockCreatedAtDisplay2',
				username: 'mockUserName1',
				versionNumber: 'mockVersionNumber1',
				isRestored: false
			},
			{
				id: 'mockHistoryId3',
				createdAtDisplay: 'mockCreatedAtDisplay3',
				username: 'mockUserName2',
				versionNumber: 'mockVersionNumber1',
				isRestored: false
			}
		]
		const action = {
			type: SHOW_VERSION_HISTORY,
			meta: {
				module: mockModule
			},
			payload: mockHistoryItems
		}

		// asynchronous action - state changes on success
		const handler = dashboardReducer(initialState, action)
		let newState

		newState = handleStart(handler)
		expect(newState.dialog).toEqual('module-version-history')
		expect(newState.selectedModule).toEqual(mockModule)
		expect(newState.versionHistory).toEqual({
			isFetching: true,
			hasFetched: false,
			items: []
		})

		newState = handleSuccess(handler)
		expect(newState.versionHistory).not.toEqual(initialState.versionHistory)
		expect(newState.versionHistory).toEqual({
			isFetching: false,
			hasFetched: true,
			items: mockHistoryItems
		})
	})

	test('RESTORE_VERSION action modifies state correctly', () => {
		const initialState = {
			dialog: null,
			dialogProps: null,
			versionHistory: {
				isFetching: false,
				hasFetched: false,
				items: []
			},
			selectedModule: {
				draftId: 'someMockDraftId',
				title: 'Some Mock Module Title'
			}
		}

		const mockModule = {
			draftId: 'someOtherMockDraftId',
			title: 'Some Other Mock Module Title'
		}

		const mockHistoryItems = [
			{
				id: 'mockHistoryId1',
				createdAtDisplay: 'mockCreatedAtDisplay1',
				username: 'mockUserName1',
				versionNumber: 'mockVersionNumber1',
				isRestored: false
			},
			{
				id: 'mockHistoryId2',
				createdAtDisplay: 'mockCreatedAtDisplay2',
				username: 'mockUserName1',
				versionNumber: 'mockVersionNumber1',
				isRestored: false
			},
			{
				id: 'mockHistoryId3',
				createdAtDisplay: 'mockCreatedAtDisplay3',
				username: 'mockUserName2',
				versionNumber: 'mockVersionNumber1',
				isRestored: false
			}
		]
		const action = {
			type: RESTORE_VERSION,
			meta: {
				module: mockModule
			},
			payload: mockHistoryItems
		}

		// asynchronous action - state changes on success
		const handler = dashboardReducer(initialState, action)
		let newState

		newState = handleStart(handler)
		expect(newState.versionHistory).toEqual({
			isFetching: true,
			hasFetched: false,
			items: []
		})

		newState = handleSuccess(handler)
		expect(newState.versionHistory).not.toEqual(initialState.versionHistory)
		expect(newState.versionHistory).toEqual({
			isFetching: false,
			hasFetched: true,
			items: mockHistoryItems
		})
	})

	test('SHOW_ASSESSMENT_SCORE_DATA action modifies state correctly', () => {
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
			type: SHOW_ASSESSMENT_SCORE_DATA,
			payload: mockAttemptItems,
			meta: {
				module: jest.fn()
			}
		}

		// asynchronous action - state changes on success
		const handler = dashboardReducer(initialState, action)
		let newState

		newState = handleStart(handler)
		expect(newState.attempts).toEqual({
			isFetching: true,
			hasFetched: false,
			items: []
		})

		newState = handleSuccess(handler)
		expect(newState.attempts).not.toEqual(initialState.attempts)
		expect(newState.attempts).toEqual({
			isFetching: false,
			hasFetched: true,
			items: mockAttemptItems
		})
	})

	test('GET_MODULES action modifies state correctly', () => {
		// With user currently looking at "My Deleted Modules" page
		const initialState = {
			myModules: [
				{
					draftId: 'mockDraftId',
					title: 'A Mock Module'
				},
				{
					draftId: 'mockDraftId2',
					title: 'B Mock Module'
				},
				{
					draftId: 'mockDraftId3',
					title: 'C Mock Module'
				}
			],
			selectedModules: [],
			showDeletedModules: true
		}

		const undeletedModules = [
			{
				draftId: 'mockDraftId4',
				title: 'D Mock Module'
			},
			{
				draftId: 'mockDraftId5',
				title: 'E Mock Module'
			}
		]

		const action = {
			type: GET_MODULES,
			payload: {
				value: undeletedModules,
				showDeletedModules: false
			}
		}

		const handler = dashboardReducer(initialState, action)
		const newState = handleSuccess(handler)
		expect(newState.myModules).toEqual(undeletedModules)
		expect(newState.showDeletedModules).toBe(false)
	})

	test('GET_DELETED_MODULES action modifies state correctly', () => {
		// With user currently looking at "My Modules" page
		const initialState = {
			myModules: [
				{
					draftId: 'mockDraftId',
					title: 'A Mock Module'
				},
				{
					draftId: 'mockDraftId2',
					title: 'B Mock Module'
				},
				{
					draftId: 'mockDraftId3',
					title: 'C Mock Module'
				}
			],
			selectedModules: [],
			showDeletedModules: true
		}

		const deletedModules = [
			{
				draftId: 'mockDraftId4',
				title: 'D Mock Module'
			},
			{
				draftId: 'mockDraftId5',
				title: 'E Mock Module'
			}
		]

		const action = {
			type: GET_DELETED_MODULES,
			payload: {
				value: deletedModules,
				showDeletedModules: true
			}
		}

		const handler = dashboardReducer(initialState, action)
		const newState = handleSuccess(handler)
		expect(newState.myModules).toEqual(deletedModules)
		expect(newState.showDeletedModules).toBe(true)
	})

	test('BULK_RESTORE_MODULES action modifies state correctly', () => {
		const mockModuleList = [
			{
				draftId: 'mockDraftId',
				title: 'A Mock Module'
			},
			{
				draftId: 'mockDraftId2',
				title: 'B Mock Module'
			},
			{
				draftId: 'mockDraftId3',
				title: 'C Mock Module'
			}
		]

		const initialState = {
			multiSelectMode: true,
			showDeletedModules: true,
			selectedModules: ['mockDraftId'],
			myModules: [
				{
					draftId: 'mockDraftId3',
					title: 'C Mock Module'
				}
			]
		}

		const action = {
			type: BULK_RESTORE_MODULES,
			payload: {
				value: mockModuleList
			}
		}

		const handler = dashboardReducer(initialState, action)
		const newState = handleSuccess(handler)

		expect(newState.myModules).not.toEqual(initialState.myModules)
		expect(newState.myModules).toEqual(mockModuleList)
		expect(newState.selectedModules).toEqual([])
		expect(newState.multiSelectMode).toBe(false)
		expect(newState.showDeletedModules).toBe(false)
	})

	test('unrecognized action types just return the current state', () => {
		const initialState = {
			key: 'initialValue'
		}

		const action = {
			type: 'UNSUPPORTED_TYPE',
			key: 'someOtherValue'
		}

		const newState = dashboardReducer(initialState, action)
		expect(newState.key).toEqual(initialState.key)
	})
})
