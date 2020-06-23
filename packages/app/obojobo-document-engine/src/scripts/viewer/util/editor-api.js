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

	// If `content` and `format` are not specified, the default draft will be created
	createNewDraft(content, format) {
		return API.post(`/api/drafts/new`, {
			content,
			format
		}).then(API.processJsonResults)
	},

	deleteDraft(draftId) {
		return API.delete(`/api/drafts/${draftId}`).then(API.processJsonResults)
	},

	copyDraft(draftId, newTitle) {
		return API.post(`/api/drafts/${draftId}/copy`, { title: newTitle }).then(API.processJsonResults)
	},

	getDraftRevision(draftId, revisionId) {
		return API.get(`/api/drafts/${draftId}/revisions/${revisionId}`).then(API.processJsonResults)
	}
}

export default EditorAPI
