describe('Dashboard Actions', () => {
	let DashboardActions
	let mockFileReader

	const { MODE_RECENT, MODE_ALL, MODE_COLLECTION } = require('../repository-constants')

	const originalFetch = global.fetch
	const originalCreateElement = document.createElement
	const originalFileReader = global.FileReader
	const originalWindowLocationReload = window.location.reload

	// this is lifted straight out of dashboard-actions, for ease of comparison
	//  barring any better ways of using it
	const defaultFetchOptions = {
		method: 'GET',
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	}

	let standardFetchResponse
	let createElementCopy

	beforeAll(() => {
		global.fetch = jest.fn()
	})

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		jest.useFakeTimers()

		delete window.location
		window.location = {
			reload: jest.fn()
		}

		standardFetchResponse = {
			ok: true,
			json: jest.fn(() => ({ value: 'mockVal' }))
		}

		document.createElement = jest.fn(() => {
			createElementCopy = {
				setAttribute: jest.fn(),
				onchange: jest.fn(),
				click: jest.fn()
			}
			return createElementCopy
		})

		global.FileReader = jest.fn(() => {
			mockFileReader = {
				readAsText: jest.fn()
			}
			return mockFileReader
		})

		DashboardActions = require('./dashboard-actions')
	})

	afterAll(() => {
		global.fetch = originalFetch
		document.createElement = originalCreateElement
		global.FileReader = originalFileReader
		window.location.reload = originalWindowLocationReload
	})

	const expectGetMyCollectionsCalled = () => {
		expect(global.fetch).toHaveBeenCalledWith('/api/collections', defaultFetchOptions)
	}

	const expectGetCollectionsForModuleCalled = () => {
		expect(global.fetch).toHaveBeenCalledWith(
			`/api/drafts/mockDraftId/collections`,
			defaultFetchOptions
		)
	}

	const expectGetModulesForCollectionCalled = () => {
		expect(global.fetch).toHaveBeenCalledWith(
			'/api/collections/mockCollectionId/modules',
			defaultFetchOptions
		)
	}

	test('showModulePermissions returns the expected output', () => {
		const mockModule = { draftId: 'mockDraftId' }
		const actionReply = DashboardActions.showModulePermissions(mockModule)

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.SHOW_MODULE_PERMISSIONS,
			module: mockModule
		})
	})

	test('closeModal returns the expected output', () => {
		const actionReply = DashboardActions.closeModal()

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.CLOSE_MODAL
		})
	})

	test('clearPeopleSearchResults returns the expected output', () => {
		const actionReply = DashboardActions.clearPeopleSearchResults()

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.CLEAR_PEOPLE_SEARCH_RESULTS
		})
	})

	test('searchForUser returns the expected output and calls other functions correctly - server ok', () => {
		global.fetch.mockResolvedValueOnce({ ...standardFetchResponse, ok: true })

		const actionReply = DashboardActions.searchForUser('mockSearchString')
		jest.runAllTimers()

		expect(global.fetch).toHaveBeenCalledWith(
			'/api/users/search?q=mockSearchString',
			defaultFetchOptions
		)

		expect(actionReply).toEqual({
			type: DashboardActions.LOAD_USER_SEARCH,
			meta: {
				searchString: 'mockSearchString'
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(() => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
		})
	})
	test('searchForUser returns the expected output and calls other functions correctly - server error', () => {
		const mockFetchUrl = '/api/users/search?q=mockSearchString'
		global.fetch.mockResolvedValueOnce({
			ok: false,
			url: mockFetchUrl,
			status: 500
		})

		const actionReply = DashboardActions.searchForUser('mockSearchString')

		expect(actionReply).toEqual({
			type: DashboardActions.LOAD_USER_SEARCH,
			meta: {
				searchString: 'mockSearchString'
			},
			promise: expect.any(Object)
		})

		jest.runAllTimers()
		return actionReply.promise.catch(error => {
			expect(error).toBeInstanceOf(Error)
			expect(error.message).toBe(
				'Error requesting /api/users/search?q=mockSearchString, status code: 500'
			)

			expect(global.fetch).toHaveBeenCalledWith(
				'/api/users/search?q=mockSearchString',
				defaultFetchOptions
			)
		})
	})

	test('addUserToModule returns the expected output and calls other functions correctly', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const actionReply = DashboardActions.addUserToModule('mockDraftId', 99)

		expect(global.fetch).toHaveBeenCalledWith('/api/drafts/mockDraftId/permission', {
			...defaultFetchOptions,
			method: 'POST',
			body: '{"userId":99}'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryPermissionsVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.ADD_USER_TO_MODULE,
			promise: expect.any(Object)
		})

		// should get draft permissions after changing them
		return actionReply.promise.then(finalResponse => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(global.fetch).toHaveBeenCalledWith(
				'/api/drafts/mockDraftId/permission',
				defaultFetchOptions
			)
			expect(finalResponse).toEqual({ value: 'mockSecondaryPermissionsVal' })
		})
	})

	// three (plus one default) ways of calling deleteModulePermissions
	const assertDeleteModulePermissionsRunsWithOptions = (secondaryLookupUrl, options) => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)
		const actionReply = DashboardActions.deleteModulePermissions('mockDraftId', 99, options)

		expect(global.fetch).toHaveBeenCalledWith('/api/drafts/mockDraftId/permission/99', {
			...defaultFetchOptions,
			method: 'DELETE'
		})
		global.fetch.mockReset()
		// two additional API calls are made following the first
		global.fetch
			.mockResolvedValueOnce({
				json: () => ({ value: 'mockSecondVal1' })
			})
			.mockResolvedValueOnce({
				json: () => ({ value: 'mockSecondVal2' })
			})

		expect(actionReply).toEqual({
			type: DashboardActions.DELETE_MODULE_PERMISSIONS,
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResponse => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(global.fetch).toHaveBeenCalledWith(secondaryLookupUrl, defaultFetchOptions)
			expect(global.fetch).toHaveBeenCalledWith(
				'/api/drafts/mockDraftId/permission',
				defaultFetchOptions
			)

			expect(finalResponse).toEqual({
				value: 'mockSecondVal2',
				modules: 'mockSecondVal1'
			})
		})
	}
	//options will contain mode: MODE_COLLECTION and collectionId
	test('deleteModulePermissions returns expected output and calls other functions, mode MODE_COLLECTION', () => {
		const options = {
			mode: MODE_COLLECTION,
			collectionId: 'mockCollectionId'
		}
		return assertDeleteModulePermissionsRunsWithOptions(
			'/api/drafts/mockDraftId/permission',
			options
		)
	})
	//options will contain mode: MODE_RECENT
	test('deleteModulePermissions returns expected output and calls other functions, mode MODE_RECENT', () => {
		return assertDeleteModulePermissionsRunsWithOptions('/api/recent/drafts', { mode: MODE_RECENT })
	})
	//options will contain mode: MODE_ALL
	test('deleteModulePermissions returns expected output and calls other functions, mode MODE_ALL', () => {
		return assertDeleteModulePermissionsRunsWithOptions('/api/drafts', { mode: MODE_ALL })
	})
	// no options, default should be equivalent to MODE_ALL
	test('deleteModulePermissions returns expected output and calls other functions, default', () => {
		return assertDeleteModulePermissionsRunsWithOptions('/api/drafts')
	})

	test('loadUsersForModule returns the expected output', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)
		const actionReply = DashboardActions.loadUsersForModule('mockDraftId')

		expect(global.fetch).toHaveBeenCalledWith(
			'/api/drafts/mockDraftId/permission',
			defaultFetchOptions
		)
		expect(actionReply).toEqual({
			type: DashboardActions.LOAD_USERS_FOR_MODULE,
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResponse => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(finalResponse).toEqual({ value: 'mockVal' })
		})
	})

	// three (plus one default) ways of calling deleteModule
	const assertDeleteModuleRunsWithOptions = (secondaryLookupUrl, fetchBody, options) => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)
		const actionReply = DashboardActions.deleteModule('mockDraftId', options)

		expect(global.fetch).toHaveBeenCalledWith('/api/drafts/mockDraftId', {
			...defaultFetchOptions,
			method: 'DELETE',
			body: fetchBody
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryResponse' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.DELETE_MODULE,
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResponse => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(global.fetch).toHaveBeenCalledWith(secondaryLookupUrl, defaultFetchOptions)

			expect(finalResponse).toEqual({
				value: 'mockSecondaryResponse'
			})
		})
	}
	//options will contain mode: MODE_COLLECTION and collectionId
	test('deleteModule returns expected output and calls other functions, mode MODE_COLLECTION', () => {
		const options = {
			mode: MODE_COLLECTION,
			collectionId: 'mockCollectionId'
		}
		return assertDeleteModuleRunsWithOptions(
			'/api/collections/mockCollectionId/modules',
			'{"collectionId":"mockCollectionId"}',
			options
		)
	})
	//options will contain mode: MODE_RECENT
	test('deleteModule returns expected output and calls other functions, mode MODE_RECENT', () => {
		return assertDeleteModuleRunsWithOptions('/api/recent/drafts', '{"collectionId":null}', {
			mode: MODE_RECENT
		})
	})
	//options will contain mode: MODE_ALL
	test('deleteModule returns expected output and calls other functions, mode MODE_ALL', () => {
		return assertDeleteModuleRunsWithOptions('/api/drafts', '{"collectionId":null}', {
			mode: MODE_ALL
		})
	})
	// no options, default should be equivalent to MODE_ALL
	test('deleteModule returns expected output and calls other functions, default', () => {
		return assertDeleteModuleRunsWithOptions('/api/drafts', '{"collectionId":null}')
	})

	test('createNewCollection returns the expected output', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)
		const actionReply = DashboardActions.createNewCollection()

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/new', {
			...defaultFetchOptions,
			method: 'POST'
		})

		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockCollectionList' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.CREATE_NEW_COLLECTION,
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResponse => {
			expectGetMyCollectionsCalled()

			expect(finalResponse).toEqual({ value: 'mockCollectionList' })
		})
	})

	// three (plus one default) ways of calling createNewModule plus tutorial/normal module
	const assertCreateNewModuleRunsWithOptions = (
		createUrl,
		fetchBody,
		secondaryLookupUrl,
		isTutorial,
		options
	) => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)
		const actionReply = DashboardActions.createNewModule(isTutorial, options)

		expect(global.fetch).toHaveBeenCalledWith(createUrl, {
			...defaultFetchOptions,
			method: 'POST',
			body: fetchBody
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryResponse' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.CREATE_NEW_MODULE,
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResponse => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(global.fetch).toHaveBeenCalledWith(secondaryLookupUrl, defaultFetchOptions)

			expect(finalResponse).toEqual({
				value: 'mockSecondaryResponse'
			})
		})
	}
	//options will contain mode: MODE_COLLECTION and collectionId
	test('createNewModule returns expected output and calls other functions, mode MODE_COLLECTION', () => {
		const options = {
			mode: MODE_COLLECTION,
			collectionId: 'mockCollectionId'
		}
		return assertCreateNewModuleRunsWithOptions(
			'/api/drafts/new',
			'{"collectionId":"mockCollectionId","moduleContent":{}}',
			'/api/collections/mockCollectionId/modules',
			false,
			options
		)
	})
	//options will contain mode: MODE_RECENT
	test('createNewModule returns expected output and calls other functions, mode MODE_RECENT', () => {
		const options = { mode: MODE_RECENT }
		return assertCreateNewModuleRunsWithOptions(
			'/api/drafts/new',
			'{"collectionId":null,"moduleContent":{}}',
			'/api/recent/drafts',
			false,
			options
		)
	})
	//options will contain mode: MODE_ALL
	test('createNewModule returns expected output and calls other functions, mode MODE_ALL', () => {
		const options = { mode: MODE_ALL }
		return assertCreateNewModuleRunsWithOptions(
			'/api/drafts/new',
			'{"collectionId":null,"moduleContent":{}}',
			'/api/drafts',
			false,
			options
		)
	})
	// no options, default should be equivalent to MODE_ALL
	test('createNewModule returns expected output and calls other functions, mode MODE_ALL', () => {
		return assertCreateNewModuleRunsWithOptions(
			'/api/drafts/new',
			'{"collectionId":null,"moduleContent":{}}',
			'/api/drafts'
			//no argument indicating tutorial - should default to false
		)
	})
	// same as above, but making a tutorial
	test('createNewModule returns expected output and calls other functions, mode MODE_ALL, tutorial', () => {
		return assertCreateNewModuleRunsWithOptions(
			'/api/drafts/tutorial',
			'{"collectionId":null,"moduleContent":{}}',
			'/api/drafts',
			true
		)
	})

	test('filterModules returns the expected output', () => {
		const actionReply = DashboardActions.filterModules('mockSearchString')

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.FILTER_MODULES,
			searchString: 'mockSearchString'
		})
	})

	test('filterCollections returns the expected output', () => {
		const actionReply = DashboardActions.filterCollections('mockSearchString')

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.FILTER_COLLECTIONS,
			searchString: 'mockSearchString'
		})
	})

	test('showModuleMore returns the expected output', () => {
		const mockModule = {
			draftId: 'mockDraftId',
			title: 'Mock Draft Title'
		}
		const actionReply = DashboardActions.showModuleMore(mockModule)

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.SHOW_MODULE_MORE,
			module: mockModule
		})
	})

	test('showModuleManageCollections returns the expected output', () => {
		const mockModule = {
			draftId: 'mockDraftId',
			title: 'Mock Draft Title'
		}
		const actionReply = DashboardActions.showModuleManageCollections(mockModule)

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.SHOW_MODULE_MANAGE_COLLECTIONS,
			module: mockModule
		})
	})

	test('loadModuleCollections returns the expected output', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const actionReply = DashboardActions.loadModuleCollections('mockDraftId')

		expectGetCollectionsForModuleCalled()

		expect(actionReply).toEqual({
			type: DashboardActions.LOAD_MODULE_COLLECTIONS,
			promise: expect.any(Object)
		})

		return actionReply.promise.then(() => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
		})
	})

	test('moduleAddToCollection returns the expected output and calls other functions correctly', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const actionReply = DashboardActions.moduleAddToCollection('mockDraftId', 'mockCollectionId')

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/mockCollectionId/module/add', {
			...defaultFetchOptions,
			method: 'POST',
			body: '{"draftId":"mockDraftId"}'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryPermissionsVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.MODULE_ADD_TO_COLLECTION,
			promise: expect.any(Object)
		})

		// should get draft permissions after changing them
		return actionReply.promise.then(finalResponse => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expectGetCollectionsForModuleCalled()
			expect(finalResponse).toEqual({ value: 'mockSecondaryPermissionsVal' })
		})
	})

	test('moduleRemoveFromCollection returns the expected output and calls other functions correctly', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const actionReply = DashboardActions.moduleRemoveFromCollection(
			'mockDraftId',
			'mockCollectionId'
		)

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/mockCollectionId/module/remove', {
			...defaultFetchOptions,
			method: 'DELETE',
			body: '{"draftId":"mockDraftId"}'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryPermissionsVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.MODULE_REMOVE_FROM_COLLECTION,
			promise: expect.any(Object)
		})

		// should get draft permissions after changing them
		return actionReply.promise.then(finalResponse => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expectGetCollectionsForModuleCalled()
			expect(finalResponse).toEqual({ value: 'mockSecondaryPermissionsVal' })
		})
	})

	test('showCollectionManageModules returns the expected output', () => {
		const mockCollection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		const actionReply = DashboardActions.showCollectionManageModules(mockCollection)

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.SHOW_COLLECTION_MANAGE_MODULES,
			collection: mockCollection
		})
	})

	test('loadCollectionModules returns the expected output, no options', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const actionReply = DashboardActions.loadCollectionModules('mockCollectionId')

		expectGetModulesForCollectionCalled()

		expect(actionReply).toEqual({
			type: DashboardActions.LOAD_COLLECTION_MODULES,
			meta: {
				changedCollectionId: 'mockCollectionId',
				currentCollectionId: null
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(() => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
		})
	})
	test('loadCollectionModules returns the expected output, options', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const options = { collectionId: 'otherMockCollectionId' }
		const actionReply = DashboardActions.loadCollectionModules('mockCollectionId', options)

		expectGetModulesForCollectionCalled()

		expect(actionReply).toEqual({
			type: DashboardActions.LOAD_COLLECTION_MODULES,
			meta: {
				changedCollectionId: 'mockCollectionId',
				currentCollectionId: 'otherMockCollectionId'
			},
			promise: expect.any(Object)
		})
	})

	test('collectionAddModule returns the expected output and calls other functions, no options', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const actionReply = DashboardActions.collectionAddModule('mockDraftId', 'mockCollectionId')

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/mockCollectionId/module/add', {
			...defaultFetchOptions,
			method: 'POST',
			body: '{"draftId":"mockDraftId"}'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryPermissionsVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.COLLECTION_ADD_MODULE,
			meta: {
				changedCollectionId: 'mockCollectionId',
				currentCollectionId: undefined // eslint-disable-line no-undefined
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResponse => {
			expectGetModulesForCollectionCalled()
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(finalResponse).toEqual({ value: 'mockSecondaryPermissionsVal' })
		})
	})
	test('collectionAddModule returns the expected output and calls other functions with options', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const options = { collectionId: 'otherMockCollectionId' }
		const actionReply = DashboardActions.collectionAddModule(
			'mockDraftId',
			'mockCollectionId',
			options
		)

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/mockCollectionId/module/add', {
			...defaultFetchOptions,
			method: 'POST',
			body: '{"draftId":"mockDraftId"}'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryPermissionsVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.COLLECTION_ADD_MODULE,
			meta: {
				changedCollectionId: 'mockCollectionId',
				currentCollectionId: 'otherMockCollectionId'
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResponse => {
			expectGetModulesForCollectionCalled()
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(finalResponse).toEqual({ value: 'mockSecondaryPermissionsVal' })
		})
	})

	test('collectionRemoveModule returns the expected output and calls other functions, no options', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const actionReply = DashboardActions.collectionRemoveModule('mockDraftId', 'mockCollectionId')

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/mockCollectionId/module/remove', {
			...defaultFetchOptions,
			method: 'DELETE',
			body: '{"draftId":"mockDraftId"}'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryPermissionsVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.COLLECTION_REMOVE_MODULE,
			meta: {
				changedCollectionId: 'mockCollectionId',
				currentCollectionId: undefined // eslint-disable-line no-undefined
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResponse => {
			expectGetModulesForCollectionCalled()
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(finalResponse).toEqual({ value: 'mockSecondaryPermissionsVal' })
		})
	})
	test('collectionRemoveModule returns the expected output and calls other functions with options', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const options = { collectionId: 'otherMockCollectionId' }
		const actionReply = DashboardActions.collectionRemoveModule(
			'mockDraftId',
			'mockCollectionId',
			options
		)

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/mockCollectionId/module/remove', {
			...defaultFetchOptions,
			method: 'DELETE',
			body: '{"draftId":"mockDraftId"}'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryPermissionsVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.COLLECTION_REMOVE_MODULE,
			meta: {
				changedCollectionId: 'mockCollectionId',
				currentCollectionId: 'otherMockCollectionId'
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResponse => {
			expectGetModulesForCollectionCalled()
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(finalResponse).toEqual({ value: 'mockSecondaryPermissionsVal' })
		})
	})

	test('searchForModuleNotInCollection returns the expected output and calls other functions', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const actionReply = DashboardActions.searchForModuleNotInCollection(
			'searchString',
			'mockCollectionId'
		)

		expect(global.fetch).toHaveBeenCalledWith(
			'/api/collections/mockCollectionId/modules/search?q=searchString',
			defaultFetchOptions
		)
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondaryPermissionsVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.LOAD_MODULE_SEARCH,
			meta: {
				searchString: 'searchString'
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(() => {
			expect(standardFetchResponse.json).toHaveBeenCalled()
		})
	})

	test('clearModuleSearchResults returns the expected output', () => {
		const actionReply = DashboardActions.clearModuleSearchResults()

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.CLEAR_MODULE_SEARCH_RESULTS
		})
	})

	test('showCollectionRename returns the expected output', () => {
		const mockCollection = {
			id: 'mockCollectionId',
			title: 'Mock Collection Title'
		}
		const actionReply = DashboardActions.showCollectionRename(mockCollection)

		expect(global.fetch).not.toHaveBeenCalled()
		expect(actionReply).toEqual({
			type: DashboardActions.SHOW_COLLECTION_RENAME,
			collection: mockCollection
		})
	})

	test('renameCollection returns the expected output and calls other functions correctly, no options', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const actionReply = DashboardActions.renameCollection('mockCollectionId', 'New Title')

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/rename', {
			...defaultFetchOptions,
			method: 'POST',
			body: '{"id":"mockCollectionId","title":"New Title"}'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondReturnVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.RENAME_COLLECTION,
			meta: {
				changedCollectionTitle: 'New Title',
				changedCollectionId: 'mockCollectionId',
				currentCollectionId: undefined //eslint-disable-line no-undefined
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResult => {
			expectGetMyCollectionsCalled()
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(finalResult).toEqual({ value: 'mockSecondReturnVal' })
		})
	})
	test('renameCollection returns the expected output and calls other functions correctly with options', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)
		const options = { collectionId: 'otherMockCollectionId' }
		const actionReply = DashboardActions.renameCollection('mockCollectionId', 'New Title', options)

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/rename', {
			...defaultFetchOptions,
			method: 'POST',
			body: '{"id":"mockCollectionId","title":"New Title"}'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondReturnVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.RENAME_COLLECTION,
			meta: {
				changedCollectionTitle: 'New Title',
				changedCollectionId: 'mockCollectionId',
				currentCollectionId: 'otherMockCollectionId'
			},
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResult => {
			expectGetMyCollectionsCalled()
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(finalResult).toEqual({ value: 'mockSecondReturnVal' })
		})
	})

	test('deleteCollection returns the expected output and calls other functions correctly', () => {
		global.fetch.mockResolvedValueOnce(standardFetchResponse)

		const mockCollection = { id: 'mockCollectionId', title: 'Mock Collection Title' }
		const actionReply = DashboardActions.deleteCollection(mockCollection)

		expect(global.fetch).toHaveBeenCalledWith('/api/collections/mockCollectionId', {
			...defaultFetchOptions,
			method: 'DELETE'
		})
		global.fetch.mockReset()
		global.fetch.mockResolvedValueOnce({
			json: () => ({ value: 'mockSecondReturnVal' })
		})

		expect(actionReply).toEqual({
			type: DashboardActions.DELETE_COLLECTION,
			promise: expect.any(Object)
		})

		return actionReply.promise.then(finalResult => {
			expectGetMyCollectionsCalled()
			expect(standardFetchResponse.json).toHaveBeenCalled()
			expect(finalResult).toEqual({ value: 'mockSecondReturnVal' })
		})
	})

	test('importModuleFile returns the expected output and calls other functions correctly - no file', () => {
		const actionReply = DashboardActions.importModuleFile()
		expect(actionReply).toEqual({
			type: DashboardActions.IMPORT_MODULE_FILE,
			promise: expect.any(Object)
		})

		expect(document.createElement).toHaveBeenCalledTimes(1)
		expect(document.createElement).toHaveBeenCalledWith('input')
		expect(createElementCopy.setAttribute).toHaveBeenCalledTimes(2)
		expect(createElementCopy.setAttribute.mock.calls).toEqual([
			['type', 'file'],
			['accept', 'application/json, application/xml']
		])
		expect(createElementCopy.click).toHaveBeenCalledTimes(1)

		const mockEvent = {
			target: {
				files: []
			}
		}
		createElementCopy.onchange(mockEvent)

		return actionReply.promise.then(() => {
			expect(global.fetch).not.toHaveBeenCalled()
			expect(global.FileReader).not.toHaveBeenCalled()
			expect(window.location.reload).not.toHaveBeenCalled()
		})
	})

	test('importModuleFile returns the expected output and calls other functions correctly - valid file, json', () => {
		global.fetch.mockResolvedValueOnce({ ...standardFetchResponse, ok: true })

		const actionReply = DashboardActions.importModuleFile()
		expect(actionReply).toEqual({
			type: DashboardActions.IMPORT_MODULE_FILE,
			promise: expect.any(Object)
		})

		expect(document.createElement).toHaveBeenCalledTimes(1)
		expect(document.createElement).toHaveBeenCalledWith('input')
		expect(createElementCopy.setAttribute).toHaveBeenCalledTimes(2)
		expect(createElementCopy.setAttribute.mock.calls).toEqual([
			['type', 'file'],
			['accept', 'application/json, application/xml']
		])
		expect(createElementCopy.click).toHaveBeenCalledTimes(1)

		const mockChangeEvent = {
			target: {
				files: [{ type: 'application/json' }]
			}
		}
		createElementCopy.onchange(mockChangeEvent)
		expect(global.FileReader).toHaveBeenCalledTimes(1)

		const mockLoadEvent = {
			target: {
				result: 'fileContent'
			}
		}
		mockFileReader.onload(mockLoadEvent)

		return actionReply.promise.then(() => {
			expect(global.fetch).toHaveBeenCalledTimes(1)
			expect(global.fetch).toHaveBeenCalledWith('/api/drafts/new', {
				...defaultFetchOptions,
				method: 'POST',
				body: JSON.stringify({
					collectionId: null,
					moduleContent: {
						content: 'fileContent',
						format: 'application/json'
					}
				})
			})
			expect(window.location.reload).toHaveBeenCalledTimes(1)
		})
	})

	test('importModuleFile returns the expected output and calls other functions correctly - valid file, non-json', () => {
		global.fetch.mockResolvedValueOnce({ ...standardFetchResponse, ok: true })

		const actionReply = DashboardActions.importModuleFile()
		expect(actionReply).toEqual({
			type: DashboardActions.IMPORT_MODULE_FILE,
			promise: expect.any(Object)
		})

		expect(document.createElement).toHaveBeenCalledTimes(1)
		expect(document.createElement).toHaveBeenCalledWith('input')
		expect(createElementCopy.setAttribute).toHaveBeenCalledTimes(2)
		expect(createElementCopy.setAttribute.mock.calls).toEqual([
			['type', 'file'],
			['accept', 'application/json, application/xml']
		])
		expect(createElementCopy.click).toHaveBeenCalledTimes(1)

		const mockChangeEvent = {
			target: {
				files: [{ type: 'fileType' }]
			}
		}
		createElementCopy.onchange(mockChangeEvent)
		expect(global.FileReader).toHaveBeenCalledTimes(1)

		const mockLoadEvent = {
			target: {
				result: 'fileContent'
			}
		}
		mockFileReader.onload(mockLoadEvent)

		return actionReply.promise.then(() => {
			expect(global.fetch).toHaveBeenCalledTimes(1)
			expect(global.fetch).toHaveBeenCalledWith('/api/drafts/new', {
				...defaultFetchOptions,
				method: 'POST',
				body: JSON.stringify({
					collectionId: null,
					moduleContent: {
						content: 'fileContent',
						format: 'application/xml' //defaults to this unless file type is 'application/json'
					}
				})
			})
			expect(window.location.reload).toHaveBeenCalledTimes(1)
		})
	})

	test('importModuleFile returns the expected output and calls other functions correctly - api failure', () => {
		global.fetch.mockRejectedValueOnce(null)

		const actionReply = DashboardActions.importModuleFile()
		expect(actionReply).toEqual({
			type: DashboardActions.IMPORT_MODULE_FILE,
			promise: expect.any(Object)
		})

		expect(document.createElement).toHaveBeenCalledTimes(1)
		expect(document.createElement).toHaveBeenCalledWith('input')
		expect(createElementCopy.setAttribute).toHaveBeenCalledTimes(2)
		expect(createElementCopy.setAttribute.mock.calls).toEqual([
			['type', 'file'],
			['accept', 'application/json, application/xml']
		])
		expect(createElementCopy.click).toHaveBeenCalledTimes(1)

		const mockChangeEvent = {
			target: {
				files: [{ type: 'fileType' }]
			}
		}
		createElementCopy.onchange(mockChangeEvent)
		expect(global.FileReader).toHaveBeenCalledTimes(1)

		const mockLoadEvent = {
			target: {
				result: 'fileContent'
			}
		}
		mockFileReader.onload(mockLoadEvent)

		return actionReply.promise.catch(() => {
			expect(global.fetch).toHaveBeenCalledTimes(1)
			expect(global.fetch).toHaveBeenCalledWith('/api/drafts/new', {
				...defaultFetchOptions,
				method: 'POST',
				body: JSON.stringify({
					collectionId: null,
					moduleContent: {
						content: 'fileContent',
						format: 'application/xml' //defaults to this unless file type is 'application/json'
					}
				})
			})
			expect(window.location.reload).not.toHaveBeenCalled()
		})
	})
})
