const API = require('obojobo-document-engine/src/scripts/viewer/util/api')

const ViewerAPI = {
	copyModule(draftId, readOnly = false) {
		return API.post(`/api/drafts/${draftId}/copy`, { readOnly }).then(result => {
			if (result.status === 200) {
				window.location.assign('/dashboard')
			} else if (result.status === 401) {
				window.alert('You are not authorized to copy this module') //eslint-disable-line no-alert
			} else {
				window.alert('Something went wrong while copying') //eslint-disable-line no-alert
			}
		})
	}

	// NOTE: The repository uses redux, unlike the viewer and editor
	// DO NOT add all your api calls here by default
	// this only exists for very simple pages that haven't adopted redux yet.
	// Make your API calls via redux actions please
}

module.exports = ViewerAPI
