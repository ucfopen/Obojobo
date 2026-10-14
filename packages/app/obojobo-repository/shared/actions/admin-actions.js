const debouncePromise = require('debounce-promise')

const JSON_MIME_TYPE = 'application/json'
const defaultOptions = () => ({
	method: 'GET',
	credentials: 'include',
	headers: {
		Accept: JSON_MIME_TYPE,
		'Content-Type': JSON_MIME_TYPE
	}
})

const throwIfNotOk = res => {
	if (!res.ok) throw Error(`Error requesting ${res.url}, status code: ${res.status}`)
	return res
}

const apiSearchForUser = searchString => {
	return fetch(`/api/users/search?q=${searchString}`, defaultOptions())
		.then(throwIfNotOk)
		.then(res => res.json())
}

const apiSearchForUserDebounced = debouncePromise(apiSearchForUser, 300)

// =================== API =======================

// not using this yet
// const apiGetModules = () => {
// 	const JSON_MIME_TYPE = 'application/json'
// 	const fetchOptions = {
// 		method: 'GET',
// 		credentials: 'include',
// 		headers: {
// 			Accept: JSON_MIME_TYPE,
// 			'Content-Type': JSON_MIME_TYPE
// 		}
// 	}
// 	return fetch('/api/drafts', fetchOptions).then(res => res.json())
// }

const apiAddUserPermission = (userId, perm) => {
	const JSON_MIME_TYPE = 'application/json'
	const fetchOptions = {
		method: 'POST',
		credentials: 'include',
		headers: {
			Accept: JSON_MIME_TYPE,
			'Content-Type': JSON_MIME_TYPE
		},
		body: JSON.stringify({ userId, perm })
	}

	return fetch('/api/permissions/add', fetchOptions).then(res => res.json())
}

const apiRemoveUserPermission = (userId, perm) => {
	const JSON_MIME_TYPE = 'application/json'
	const fetchOptions = {
		method: 'POST',
		credentials: 'include',
		headers: {
			Accept: JSON_MIME_TYPE,
			'Content-Type': JSON_MIME_TYPE
		},
		body: JSON.stringify({ userId, perm })
	}

	return fetch('/api/permissions/remove', fetchOptions).then(res => res.json())
}

// ================== ACTIONS ===================

// const LOAD_ALL_MODULES = 'LOAD_ALL_MODULES'
// const loadModuleList = () => ({
// 	type: LOAD_ALL_MODULES,
// 	promise: apiGetModules()
// })

const LOAD_USER_SEARCH = 'LOAD_USER_SEARCH'
const searchForUser = searchString => ({
	type: LOAD_USER_SEARCH,
	meta: { searchString },
	promise: apiSearchForUserDebounced(searchString)
})

const ADD_USER_PERMISSION = 'ADD_USER_PERMISSION'
const addUserPermission = (userId, perm) => ({
	type: ADD_USER_PERMISSION,
	promise: apiAddUserPermission(userId, perm)
})

const REMOVE_USER_PERMISSION = 'REMOVE_USER_PERMISSION'
const removeUserPermission = (userId, perm) => ({
	type: REMOVE_USER_PERMISSION,
	promise: apiRemoveUserPermission(userId, perm)
})

const CLEAR_PEOPLE_SEARCH_RESULTS = 'CLEAR_PEOPLE_SEARCH_RESULTS'
const clearPeopleSearchResults = () => ({ type: CLEAR_PEOPLE_SEARCH_RESULTS })

module.exports = {
	// LOAD_ALL_MODULES,
	// loadModuleList,

	ADD_USER_PERMISSION,
	addUserPermission,

	REMOVE_USER_PERMISSION,
	removeUserPermission,

	LOAD_USER_SEARCH,
	searchForUser,

	CLEAR_PEOPLE_SEARCH_RESULTS,
	clearPeopleSearchResults
}
