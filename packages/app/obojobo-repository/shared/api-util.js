const APIUtil = {
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

	post(endpoint, body = {}) {
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

	copyModule(draftId) {
		return this.post(`/api/drafts/${draftId}/copy`).then(result => {
			if (result.status === 200) {
				window.location('/dashboard')
			} else if (result.status === 401) {
				alert('You are not authorized to copy this module')
			} else {
				alert('Something went wrong while copying')
			}
		})
	}
}

module.exports = APIUtil
