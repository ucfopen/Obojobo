const debouncePromise = require('debounce-promise')
const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
const { apiGetAssessmentDetailsForDraft } = require('./shared-api-methods')

dayjs.extend(advancedFormat)
// =================== API =======================

const JSON_MIME_TYPE = 'application/json'
const XML_MIME_TYPE_APPLICATION = 'application/xml'
const XML_MIME_TYPE_TEXT = 'text/xml'

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

const apiAddPermissionsToModule = (draftId, userId) => {
	const options = { ...defaultOptions(), method: 'POST', body: `{"userId":${userId}}` }
	return fetch(`/api/drafts/${draftId}/permission`, options).then(res => res.json())
}

const apiGetPermissionsForModule = draftId => {
	return fetch(`/api/drafts/${draftId}/permission`, defaultOptions()).then(res => res.json())
}

const apiSaveDraft = async (draftId, draftJSON) => {
	if (typeof draftJSON !== 'string') draftJSON = JSON.stringify(draftJSON)
	const options = { ...defaultOptions(), method: 'POST', body: draftJSON }
	const result = await fetch(`/api/drafts/${draftId}`, options)
	const data = await result.json()
	return data
}

const apiGetVersionHistory = async draftId => {
	// limit to keep this from running away accidentally
	const emergencyLimit = 100
	const options = { ...defaultOptions() }

	// load all the history, can be multiple api calls
	let nextUrl = `/api/drafts/${draftId}/revisions`
	let count = 0
	const history = []

	while (nextUrl) {
		if (count > emergencyLimit) break
		const res = await fetch(nextUrl, options)
		nextUrl = false
		// are there more to load in the response headers?
		const linkHeader = res.headers.get('link')
		if (linkHeader) {
			const match = linkHeader.match(/<(.+?)>;\s+rel="next"/)
			nextUrl = match ? match[1] : false
		}
		const data = await res.json()
		// append to list
		history.push(...data.value)
		count++
	}

	// convert the result to what we need
	return history.map((draft, index) => ({
		createdAt: new Date(draft.createdAt),
		createdAtDisplay: dayjs(draft.createdAt).format('MMM Do YYYY - h:mm A'),
		id: draft.revisionId,
		username: draft.userFullName,
		selected: index === 0,
		versionNumber: history.length - index
	}))
}

const apiRestoreVersion = async (draftId, versionId) => {
	const options = { ...defaultOptions() }
	// get a revision
	const res = await fetch(`/api/drafts/${draftId}/revisions/${versionId}`, options)
	const data = await res.json()
	const fullDraft = data.value.json
	// save the revision on top
	const saveResult = await apiSaveDraft(draftId, fullDraft)
	if (saveResult.status !== 'ok') throw Error('Failed restoring draft.')
	const newVersionId = saveResult.value.id
	// load history
	const history = await apiGetVersionHistory(draftId)
	// mark the restored item
	const restoredVersion = history.find(data => data.id === newVersionId)
	restoredVersion.isRestored = true
	return history
}

const apiDeletePermissionsToModule = (draftId, userId) => {
	const options = { ...defaultOptions(), method: 'DELETE' }
	return fetch(`/api/drafts/${draftId}/permission/${userId}`, options).then(res => res.json())
}

const apiDeleteModule = draftId => {
	const options = { ...defaultOptions(), method: 'DELETE' }
	return fetch(`/api/drafts/${draftId}`, options).then(res => res.json())
}

const apiGetMyModules = () => {
	return fetch('/api/drafts', defaultOptions()).then(res => res.json())
}

const apiCreateNewModule = (useTutorial, body = {}) => {
	const url = useTutorial ? '/api/drafts/tutorial' : '/api/drafts/new'
	const options = { ...defaultOptions(), method: 'POST', body: JSON.stringify(body) }
	return fetch(url, options).then(res => res.json())
}

const apiGetModuleLock = async draftId => {
	const res = await fetch(`/api/locks/${draftId}`, defaultOptions())
	const data = await res.json()

	if (data.status !== 'ok') {
		throw Error(`Failed to check lock for module with id ${draftId}.`)
	}

	return data.value
}

// ================== ACTIONS ===================

const SHOW_MODULE_PERMISSIONS = 'SHOW_MODULE_PERMISSIONS'
const showModulePermissions = module => ({
	type: SHOW_MODULE_PERMISSIONS,
	module
})

const SHOW_VERSION_HISTORY = 'SHOW_VERSION_HISTORY'
const showVersionHistory = module => ({
	type: SHOW_VERSION_HISTORY,
	meta: { module },
	promise: apiGetVersionHistory(module.draftId)
})

const SHOW_ASSESSMENT_SCORE_DATA = 'SHOW_ASSESSMENT_SCORE_DATA'
const showAssessmentScoreData = module => ({
	type: SHOW_ASSESSMENT_SCORE_DATA,
	meta: { module },
	promise: apiGetAssessmentDetailsForDraft(module.draftId)
})

const RESTORE_VERSION = 'RESTORE_VERSION'
const restoreVersion = (draftId, versionId) => ({
	type: RESTORE_VERSION,
	meta: {
		draftId,
		versionId
	},
	promise: apiRestoreVersion(draftId, versionId)
})

const CHECK_MODULE_LOCK = 'CHECK_MODULE_LOCK'
const checkModuleLock = draftId => ({
	type: CHECK_MODULE_LOCK,
	promise: apiGetModuleLock(draftId)
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
	promise: apiSearchForUserDebounced(searchString)
})

const ADD_USER_TO_MODULE = 'ADD_USER_TO_MODULE'
const addUserToModule = (draftId, userId) => ({
	type: ADD_USER_TO_MODULE,
	promise: apiAddPermissionsToModule(draftId, userId).then(() =>
		apiGetPermissionsForModule(draftId)
	)
})

const DELETE_MODULE_PERMISSIONS = 'DELETE_MODULE_PERMISSIONS'
const deleteModulePermissions = (draftId, userId) => ({
	type: DELETE_MODULE_PERMISSIONS,
	promise: apiDeletePermissionsToModule(draftId, userId)
		.then(() => {
			return Promise.all([apiGetMyModules(), apiGetPermissionsForModule(draftId)])
		})
		.then(results => ({
			value: results[1].value,
			modules: results[0].value
		}))
})

const LOAD_USERS_FOR_MODULE = 'LOAD_USERS_FOR_MODULE'
const loadUsersForModule = draftId => ({
	type: LOAD_USERS_FOR_MODULE,
	promise: apiGetPermissionsForModule(draftId)
})

const DELETE_MODULE = 'DELETE_MODULE'
const deleteModule = draftId => ({
	type: DELETE_MODULE,
	promise: apiDeleteModule(draftId).then(apiGetMyModules)
})

const BULK_DELETE_MODULES = 'BULK_DELETE_MODULES'
const bulkDeleteModules = draftIds => ({
	type: BULK_DELETE_MODULES,
	promise: Promise.all(draftIds.map(id => apiDeleteModule(id))).then(apiGetMyModules)
})

const CREATE_NEW_MODULE = 'CREATE_NEW_MODULE'
const createNewModule = (useTutorial = false) => ({
	type: CREATE_NEW_MODULE,
	promise: apiCreateNewModule(useTutorial).then(apiGetMyModules)
})

const FILTER_MODULES = 'FILTER_MODULES'
const filterModules = searchString => ({
	type: FILTER_MODULES,
	searchString
})

const SELECT_MODULES = 'SELECT_MODULES'
const selectModules = draftIds => ({
	type: SELECT_MODULES,
	draftIds
})

const DESELECT_MODULES = 'DESELECT_MODULES'
const deselectModules = draftIds => ({
	type: DESELECT_MODULES,
	draftIds
})

const SHOW_MODULE_MORE = 'SHOW_MODULE_MORE'
const showModuleMore = module => ({
	type: SHOW_MODULE_MORE,
	module
})

const IMPORT_MODULE_FILE = 'IMPORT_MODULE_FILE'
const importModuleFile = searchString => ({
	type: IMPORT_MODULE_FILE,
	promise: promptUserForModuleFileUpload(searchString)
})

const promptUserForModuleFileUpload = async () => {
	return new Promise((resolve, reject) => {
		const fileSelector = document.createElement('input')
		fileSelector.setAttribute('type', 'file')
		fileSelector.setAttribute('accept', `${JSON_MIME_TYPE}, ${XML_MIME_TYPE_APPLICATION}`)
		fileSelector.onchange = moduleUploadFileSelected.bind(this, resolve, reject)
		fileSelector.click()
	})
}

const moduleUploadFileSelected = (boundResolve, boundReject, event) => {
	const file = event.target.files[0]
	if (!file) return boundResolve()
	// avoid usage in case a browser allows file upload despite invalid mime type
	if (
		file.type !== `${XML_MIME_TYPE_APPLICATION}` &&
		file.type !== `${JSON_MIME_TYPE}` &&
		file.type !== `${XML_MIME_TYPE_TEXT}`
	) {
		// eslint-disable-next-line no-alert
		window.alert('Invalid file, acceptable file types are JSON and XML.')
		return boundResolve()
	}

	const reader = new global.FileReader()
	reader.readAsText(file, 'UTF-8')
	reader.onload = moduleUploadFileLoaded.bind(this, boundResolve, boundReject, file.type)
}

const moduleUploadFileLoaded = async (boundResolve, boundReject, fileType, e) => {
	try {
		const body = {
			content: e.target.result,
			format: fileType === JSON_MIME_TYPE ? JSON_MIME_TYPE : XML_MIME_TYPE_APPLICATION
		}

		await apiCreateNewModule(false, body)
		window.location.reload()
		boundResolve()
	} catch (e) {
		boundReject()
	}
}

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
	BULK_DELETE_MODULES,
	FILTER_MODULES,
	SELECT_MODULES,
	DESELECT_MODULES,
	SHOW_MODULE_MORE,
	SHOW_VERSION_HISTORY,
	RESTORE_VERSION,
	IMPORT_MODULE_FILE,
	CHECK_MODULE_LOCK,
	SHOW_ASSESSMENT_SCORE_DATA,
	filterModules,
	selectModules,
	deselectModules,
	deleteModule,
	bulkDeleteModules,
	closeModal,
	deleteModulePermissions,
	searchForUser,
	addUserToModule,
	createNewModule,
	showModulePermissions,
	loadUsersForModule,
	clearPeopleSearchResults,
	showModuleMore,
	showVersionHistory,
	restoreVersion,
	importModuleFile,
	checkModuleLock,
	showAssessmentScoreData
}
