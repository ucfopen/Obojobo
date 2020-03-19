const { MODE_DASHBOARD, MODE_MODULES, MODE_COLLECTION } = require('../repository-constants')

// =================== API =======================

const defaultOptions = () => ({
	method: 'GET',
	credentials: 'include',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
})

const defaultModuleModeOptions = {
	mode: null
}

const apiSearchForUser = searchString => {
	return fetch(`/api/users/search?q=${searchString}`, defaultOptions()).then(res => res.json())
}

const apiAddPermissionsToModule = (draftId, userId) => {
	const options = { ...defaultOptions(), method: 'POST', body: `{"userId":${userId}}` }
	return fetch(`/api/drafts/${draftId}/permission`, options).then(res => res.json())
}

const apiGetPermissionsForModule = draftId => {
	return fetch(`/api/drafts/${draftId}/permission`, defaultOptions()).then(res => res.json())
}

const apiGetCollectionsForModule = draftId => {
	return fetch(`/api/drafts/${draftId}/collections`, defaultOptions()).then(res => res.json())
}

const apiAddModuleToCollection = (draftId, collectionId) => {
	const options = { ...defaultOptions(), method: 'POST', body: `{"draftId":"${draftId}"}` }
	return fetch(`/api/collections/${collectionId}/module/add`, options).then(res => res.json())
}
const apiRemoveModuleFromCollection = (draftId, collectionId) => {
	const options = { ...defaultOptions(), method: 'DELETE', body: `{"draftId":"${draftId}"}` }
	return fetch(`/api/collections/${collectionId}/module/remove`, options).then(res => res.json())
}

const apiDeletePermissionsToModule = (draftId, userId) => {
	const options = { ...defaultOptions(), method: 'DELETE' }
	return fetch(`/api/drafts/${draftId}/permission/${userId}`, options).then(res => res.json())
}

const apiDeleteModule = (draftId, collectionId = null) => {
	const body = JSON.stringify({ collectionId })
	const options = { ...defaultOptions(), method: 'DELETE', body }
	return fetch(`/api/drafts/${draftId}`, options).then(res => res.json())
}

const apiGetMyCollections = () => {
	return fetch('/api/collections', defaultOptions()).then(res => res.json())
}

const apiGetMyModules = () => {
	return fetch('/api/drafts', defaultOptions()).then(res => res.json())
}

const apiGetMyRecentModules = () => {
	return fetch('/api/recent/drafts', defaultOptions()).then(res => res.json())
}

const apiCreateNewCollection = () => {
	const url = '/api/collections/new'
	const options = { ...defaultOptions(), method: 'POST' }
	return fetch(url, options).then(res => res.json())
}

const apiGetModulesForCollection = collectionId => {
	return fetch(`/api/collections/${collectionId}/modules`, defaultOptions()).then(res => res.json())
}

const apiSearchForModuleNotInCollection = (searchString, collectionId) => {
	return fetch(
		`/api/collections/${collectionId}/modules/search?q=${searchString}`,
		defaultOptions()
	).then(res => res.json())
}

const apiRenameCollection = (id, title) => {
	const url = '/api/collections/rename'
	const body = JSON.stringify({ id, title })
	const options = { ...defaultOptions(), method: 'POST', body }
	return fetch(url, options).then(res => res.json())
}

const apiDeleteCollection = collection => {
	const options = { ...defaultOptions(), method: 'DELETE' }
	return fetch(`/api/collections/${collection.id}`, options).then(res => res.json())
}

const apiCreateNewModule = (useTutorial, collectionId = null) => {
	const url = useTutorial ? '/api/drafts/tutorial' : '/api/drafts/new'
	const body = JSON.stringify({ collectionId })
	const options = { ...defaultOptions(), method: 'POST', body }
	return fetch(url, options).then(res => res.json())
}

// ================== ACTIONS ===================

const SHOW_MODULE_PERMISSIONS = 'SHOW_MODULE_PERMISSIONS'
const showModulePermissions = module => ({
	type: SHOW_MODULE_PERMISSIONS,
	module
})

const CLOSE_MODAL = 'CLOSE_MODAL'
const closeModal = () => ({ type: CLOSE_MODAL })

const CLEAR_PEOPLE_SEARCH_RESULTS = 'CLEAR_PEOPLE_SEARCH_RESULTS'
const clearPeopleSearchResults = () => ({ type: CLEAR_PEOPLE_SEARCH_RESULTS })

const LOAD_USER_SEARCH = 'LOAD_USER_SEARCH'
const searchForUser = searchString => ({
	type: LOAD_USER_SEARCH,
	meta: {
		searchString
	},
	promise: apiSearchForUser(searchString)
})

const ADD_USER_TO_MODULE = 'ADD_USER_TO_MODULE'
const addUserToModule = (draftId, userId) => ({
	type: ADD_USER_TO_MODULE,
	promise: apiAddPermissionsToModule(draftId, userId).then(() =>
		apiGetPermissionsForModule(draftId)
	)
})

const DELETE_MODULE_PERMISSIONS = 'DELETE_MODULE_PERMISSIONS'
const deleteModulePermissions = (draftId, userId, options = { ...defaultModuleModeOptions }) => {
	let apiModuleGetCall

	switch (options.mode) {
		case MODE_COLLECTION:
			apiModuleGetCall = () => {
				return apiGetModulesForCollection(options.collectionId)
			}
			break
		case MODE_DASHBOARD:
			apiModuleGetCall = apiGetMyRecentModules
			break
		case MODE_MODULES:
		default:
			apiModuleGetCall = apiGetMyModules
			break
	}

	return {
		type: DELETE_MODULE_PERMISSIONS,
		promise: apiDeletePermissionsToModule(draftId, userId)
			.then(() => {
				return Promise.all([apiModuleGetCall(), apiGetPermissionsForModule(draftId)])
			})
			.then(results => ({
				value: results[1].value,
				modules: results[0].value
			}))
	}
}

const LOAD_USERS_FOR_MODULE = 'LOAD_USERS_FOR_MODULE'
const loadUsersForModule = draftId => ({
	type: LOAD_USERS_FOR_MODULE,
	promise: apiGetPermissionsForModule(draftId)
})

const DELETE_MODULE = 'DELETE_MODULE'
const deleteModule = (draftId, options = { ...defaultModuleModeOptions }) => {
	let apiModuleGetCall
	let collectionId = null

	switch (options.mode) {
		case MODE_COLLECTION:
			collectionId = options.collectionId
			apiModuleGetCall = () => {
				return apiGetModulesForCollection(options.collectionId)
			}
			break
		case MODE_DASHBOARD:
			apiModuleGetCall = apiGetMyRecentModules
			break
		case MODE_MODULES:
		default:
			apiModuleGetCall = apiGetMyModules
			break
	}

	return {
		type: DELETE_MODULE,
		promise: apiDeleteModule(draftId, collectionId).then(apiModuleGetCall)
	}
}

const CREATE_NEW_COLLECTION = 'CREATE_NEW_COLLECTION'
const createNewCollection = () => ({
	type: CREATE_NEW_COLLECTION,
	promise: apiCreateNewCollection().then(apiGetMyCollections)
})

const CREATE_NEW_MODULE = 'CREATE_NEW_MODULE'
const createNewModule = (useTutorial = false, options = { ...defaultModuleModeOptions }) => {
	let apiModuleGetCall
	let collectionId = null

	switch (options.mode) {
		case MODE_COLLECTION:
			collectionId = options.collectionId
			apiModuleGetCall = () => {
				return apiGetModulesForCollection(options.collectionId)
			}
			break
		case MODE_DASHBOARD:
			apiModuleGetCall = apiGetMyRecentModules
			break
		case MODE_MODULES:
		default:
			apiModuleGetCall = apiGetMyModules
			break
	}
	return {
		type: CREATE_NEW_MODULE,
		promise: apiCreateNewModule(useTutorial, collectionId).then(apiModuleGetCall)
	}
}

const FILTER_MODULES = 'FILTER_MODULES'
const filterModules = searchString => ({
	type: FILTER_MODULES,
	searchString
})

const SHOW_MODULE_MORE = 'SHOW_MODULE_MORE'
const showModuleMore = module => ({
	type: SHOW_MODULE_MORE,
	module
})

const SHOW_MODULE_MANAGE_COLLECTIONS = 'SHOW_MODULE_MANAGE_COLLECTIONS'
const showModuleManageCollections = module => ({
	type: SHOW_MODULE_MANAGE_COLLECTIONS,
	module
})

const LOAD_MODULE_COLLECTIONS = 'LOAD_MODULE_COLLECTIONS'
const loadModuleCollections = draftId => ({
	type: LOAD_MODULE_COLLECTIONS,
	promise: apiGetCollectionsForModule(draftId)
})

const MODULE_ADD_TO_COLLECTION = 'MODULE_ADD_TO_COLLECTION'
const moduleAddToCollection = (draftId, collectionId) => ({
	type: MODULE_ADD_TO_COLLECTION,
	promise: apiAddModuleToCollection(draftId, collectionId).then(() => {
		return apiGetCollectionsForModule(draftId)
	})
})

const MODULE_REMOVE_FROM_COLLECTION = 'MODULE_REMOVE_FROM_COLLECTION'
const moduleRemoveFromCollection = (draftId, collectionId) => ({
	type: MODULE_REMOVE_FROM_COLLECTION,
	promise: apiRemoveModuleFromCollection(draftId, collectionId).then(() => {
		return apiGetCollectionsForModule(draftId)
	})
})

const SHOW_COLLECTION_MANAGE_MODULES = 'SHOW_COLLECTION_MANAGE_MODULES'
const showCollectionManageModules = collection => ({
	type: SHOW_COLLECTION_MANAGE_MODULES,
	collection
})

const LOAD_COLLECTION_MODULES = 'LOAD_COLLECTION_MODULES'
const loadCollectionModules = collectionId => ({
	type: LOAD_COLLECTION_MODULES,
	promise: apiGetModulesForCollection(collectionId)
})

const COLLECTION_ADD_MODULE = 'COLLECTION_ADD_MODULE'
const collectionAddModule = (draftId, collectionId, options = { ...defaultModuleModeOptions }) => {
	return {
		type: COLLECTION_ADD_MODULE,
		meta: {
			changedCollectionId: collectionId,
			currentCollectionId: options.collectionId
		},
		promise: apiAddModuleToCollection(draftId, collectionId).then(() => {
			return apiGetModulesForCollection(collectionId)
		})
	}
}

const COLLECTION_REMOVE_MODULE = 'COLLECTION_REMOVE_MODULE'
const collectionRemoveModule = (
	draftId,
	collectionId,
	options = { ...defaultModuleModeOptions }
) => {
	return {
		type: COLLECTION_REMOVE_MODULE,
		meta: {
			changedCollectionId: collectionId,
			currentCollectionId: options.collectionId
		},
		promise: apiRemoveModuleFromCollection(draftId, collectionId).then(() => {
			return apiGetModulesForCollection(collectionId)
		})
	}
}

const LOAD_MODULE_SEARCH = 'LOAD_MODULE_SEARCH'
const searchForModuleNotInCollection = (searchString, collectionId) => ({
	type: LOAD_MODULE_SEARCH,
	meta: {
		searchString
	},
	promise: apiSearchForModuleNotInCollection(searchString, collectionId)
})

const CLEAR_MODULE_SEARCH_RESULTS = 'CLEAR_MODULE_SEARCH_RESULTS'
const clearModuleSearchResults = () => ({ type: CLEAR_MODULE_SEARCH_RESULTS })

const SHOW_COLLECTION_RENAME = 'SHOW_COLLECTION_RENAME'
const showCollectionRename = collection => ({
	type: SHOW_COLLECTION_RENAME,
	collection
})

const RENAME_COLLECTION = 'RENAME_COLLECTION'
const renameCollection = (collectionId, newTitle, options = { ...defaultModuleModeOptions }) => {
	return {
		type: RENAME_COLLECTION,
		meta: {
			changedCollectionTitle: newTitle,
			changedCollectionId: collectionId,
			currentCollectionId: options.collectionId
		},
		promise: apiRenameCollection(collectionId, newTitle).then(apiGetMyCollections)
	}
}

const DELETE_COLLECTION = 'DELETE_COLLECTION'
const deleteCollection = id => ({
	type: DELETE_COLLECTION,
	promise: apiDeleteCollection(id).then(apiGetMyCollections)
})

module.exports = {
	SHOW_MODULE_PERMISSIONS,
	LOAD_USER_SEARCH,
	CLOSE_MODAL,
	ADD_USER_TO_MODULE,
	LOAD_USERS_FOR_MODULE,
	CREATE_NEW_MODULE,
	CLEAR_PEOPLE_SEARCH_RESULTS,
	DELETE_MODULE_PERMISSIONS,
	DELETE_MODULE,
	FILTER_MODULES,
	SHOW_MODULE_MORE,
	CREATE_NEW_COLLECTION,
	SHOW_MODULE_MANAGE_COLLECTIONS,
	LOAD_MODULE_COLLECTIONS,
	MODULE_ADD_TO_COLLECTION,
	MODULE_REMOVE_FROM_COLLECTION,
	SHOW_COLLECTION_MANAGE_MODULES,
	LOAD_COLLECTION_MODULES,
	COLLECTION_ADD_MODULE,
	COLLECTION_REMOVE_MODULE,
	LOAD_MODULE_SEARCH,
	CLEAR_MODULE_SEARCH_RESULTS,
	SHOW_COLLECTION_RENAME,
	RENAME_COLLECTION,
	DELETE_COLLECTION,
	filterModules,
	deleteModule,
	closeModal,
	deleteModulePermissions,
	searchForUser,
	addUserToModule,
	createNewCollection,
	createNewModule,
	showModulePermissions,
	loadUsersForModule,
	clearPeopleSearchResults,
	showModuleMore,
	showCollectionManageModules,
	loadCollectionModules,
	collectionAddModule,
	collectionRemoveModule,
	searchForModuleNotInCollection,
	clearModuleSearchResults,
	showCollectionRename,
	showModuleManageCollections,
	loadModuleCollections,
	moduleAddToCollection,
	moduleRemoveFromCollection,
	renameCollection,
	deleteCollection
}
