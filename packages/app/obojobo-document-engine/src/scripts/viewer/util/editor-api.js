import API from './api'

const EditorAPI = {
	processJsonResults: API.processJsonResults,

	getDraft(id) {
		return API.get(`/api/drafts/${id}`, 'json').then(API.processJsonResults)
	},

	getFullDraft(id, format = 'json') {
		return API.get(`/api/drafts/${id}/full`, format).then(res => res.text())
	},

	postDraft(id, draftString, format = 'application/json') {
		return API.postWithFormat(`/api/drafts/${id}`, draftString, format).then(API.processJsonResults)
	},

	createNewDraft() {
		return API.post(`/api/drafts/new`).then(API.processJsonResults)
	},

	deleteDraft(draftId) {
		return API.delete(`/api/drafts/${draftId}`).then(API.processJsonResults)
	}
}

export default EditorAPI
