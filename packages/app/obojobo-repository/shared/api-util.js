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
		return this.post(`/api/drafts/${draftId}/copy`)
			.then(result => {
				if (result.status === 200) {
					window.location.replace('/dashboard')
				} else {
					alert('You are not authorized to copy this module')
				}
			})
			.catch(err => {
				console.log(err)
			})
	}
}

module.exports = APIUtil
