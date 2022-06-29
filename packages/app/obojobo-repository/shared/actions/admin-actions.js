// =================== API =======================

const { apiGetAssessmentDetailsForMultipleDrafts } = require('./shared-api-methods')

const JSON_MIME_TYPE = 'application/json'

const defaultOptions = () => ({
	method: 'GET',
	credentials: 'include',
	headers: {
		Accept: JSON_MIME_TYPE,
		'Content-Type': JSON_MIME_TYPE
	}
})

const apiAdminDoSomething = () => {
	console.log("apiAdminDoSomething function called")
	const url = '/admin-do-something'
	const options = { ...defaultOptions(), method: 'POST' }
	return fetch(url, options).then(res => res.json())
}

// ================== ACTIONS ===================

const DO_SOMETHING = 'DO_SOMETHING'
const doSomething = () => ({
	type: DO_SOMETHING,
	promise: apiAdminDoSomething()
})

module.exports = {
	DO_SOMETHING,
	doSomething
}