// =================== API =======================

const apiGetModules = () => {
	const JSON_MIME_TYPE = 'application/json'
	const fetchOptions = {
		method: 'GET',
		credentials: 'include',
		headers: {
			Accept: JSON_MIME_TYPE,
			'Content-Type': JSON_MIME_TYPE
		}
	}
	return fetch('/api/drafts', fetchOptions).then(res => res.json())
}

const apiGetUsers = () => {
	const JSON_MIME_TYPE = 'application/json'
	const fetchOptions = {
		method: 'GET',
		credentials: 'include',
		headers: {
			Accept: JSON_MIME_TYPE,
			'Content-Type': JSON_MIME_TYPE
		}
	}
	return fetch('/api/users/all', fetchOptions).then(res => res.json())
}

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

const LOAD_ALL_MODULES = 'LOAD_ALL_MODULES'
const loadModuleList = () => ({
	type: LOAD_ALL_MODULES,
	promise: apiGetModules()
})

const LOAD_ALL_USERS = 'LOAD_ALL_USERS'
const loadUserList = () => ({
	type: LOAD_ALL_USERS,
	promise: apiGetUsers()
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

module.exports = {
	LOAD_ALL_MODULES,
	loadModuleList,

	LOAD_ALL_USERS,
	loadUserList,

	ADD_USER_PERMISSION,
	addUserPermission,

	REMOVE_USER_PERMISSION,
	removeUserPermission,
}