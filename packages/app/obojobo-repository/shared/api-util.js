const API = require('obojobo-document-engine/src/scripts/viewer/util/api')

const APIUtil = {
	copyModule(draftId) {
		return API.post(`/api/drafts/${draftId}/copy`).then(result => {
			if (result.status === 200) {
				window.location = '/dashboard'
			} else if (result.status === 401) {
				window.alert('You are not authorized to copy this module') //eslint-disable-line no-alert
			} else {
				window.alert('Something went wrong while copying') //eslint-disable-line no-alert
			}
		})
	},
	getAllDraftRevisions(draftId) {
		return API.get(`/api/drafts/${draftId}/revisions/all`)
			.then(res => res.json())
			.then(json => json.value)
			.catch(err => console.error(err)) // eslint-disable-line no-console
	},
	getDraftRevision(draftId, revisionId) {
		return API.get(`/api/drafts/${draftId}/revisions/${revisionId}`)
			.then(res => res.json())
			.then(json => json.value)
			.catch(err => console.error(err)) // eslint-disable-line no-console
	},
	postDraft(id, draftString, format = 'application/json') {
		return API.postWithFormat(`/api/drafts/${id}`, draftString, format)
	}
}

module.exports = APIUtil
