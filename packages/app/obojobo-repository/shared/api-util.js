const API = require('obojobo-document-engine/src/scripts/viewer/util/api')

const APIUtil = {
	copyModule(draftId) {
		return API.post(`/api/drafts/${draftId}/copy`).then(result => {
			if (result.status === 200) {
				window.location.assign('/dashboard')
			} else if (result.status === 401) {
				window.alert('You are not authorized to copy this module') //eslint-disable-line no-alert
			} else {
				window.alert('Something went wrong while copying') //eslint-disable-line no-alert
			}
		})
	}
}

module.exports = APIUtil
