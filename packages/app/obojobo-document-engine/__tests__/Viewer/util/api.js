const processJsonResults = res => {
	return Promise.resolve(res.json()).then(json => {
		if (json.status === 'error') {
			console.error(json.value) //eslint-disable-line no-console
		}

		return json
	})
}

const API = {
	processJsonResults,
	get(endpoint, format) {
		return fetch(endpoint, {
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: `application/${format}`,
				'Content-Type': `application/${format}`
			}
		})
	},

	post(endpoint, body) {
		if (!body) body = {}

		return fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(body),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
	},

	postWithFormat(endpoint, body, format) {
		if (!body) body = '{}'

		return fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			body: body,
			headers: {
				Accept: format,
				'Content-Type': format
			}
		})
	},

	delete(endpoint) {
		return fetch(endpoint, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
	},

	postMultiPart(endpoint, formData = new FormData()) {
		return fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			body: formData
		}).then(processJsonResults)
	}
}

module.exports = API
