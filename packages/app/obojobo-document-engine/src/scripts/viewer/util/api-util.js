import API from './api'

const processJsonResults = res => {
	return Promise.resolve(res.json()).then(json => {
		if (json.status === 'error') {
			console.error(json.value) //eslint-disable-line no-console
		}

		return json
	})
}

const APIUtil = {
	processJsonResults,
	postEvent({ draftId, action, eventVersion, visitId, payload = {} }) {
		return (
			API.post('/api/events', {
				draftId,
				visitId,
				event: {
					action,
					draft_id: draftId,
					actor_time: new Date().toISOString(),
					event_version: eventVersion,
					visitId,
					payload
				}
			})
				.then(processJsonResults)
				// TODO: Send Caliper event to client host.
				.then(res => {
					if (res && res.status === 'ok' && res.value) {
						parent.postMessage(res.value, '*')
					}

					return res
				})
		)
	},

	getDraft(id) {
		return API.get(`/api/drafts/${id}`, 'json').then(processJsonResults)
	},

	getFullDraft(id, format = 'json') {
		return API.get(`/api/drafts/${id}/full`, format).then(res => res.text())
	},

	getVisitSessionStatus(draftId) {
		return API.get(`/api/visits/${draftId}/status`, 'json').then(processJsonResults)
	},

	requestStart(visitId, draftId) {
		return API.post('/api/visits/start', {
			visitId,
			draftId
		}).then(processJsonResults)
	},

	// @TODO: make this more generic named
	// and fire an event on the server
	// and have assessment listening to do what it do
	clearPreviewScores({ draftId, visitId }) {
		return API.post('/api/assessments/clear-preview-scores', {
			draftId,
			visitId
		}).then(processJsonResults)
	},

	postDraft(draftId, draftString, format='application/json') {
		return APIUtil.postWithFormat(`/api/drafts/${draftId}`, draftString, format).then(processJsonResults)
	},

	createNewDraft() {
		return API.post(`/api/drafts/new`).then(processJsonResults)
	},

	deleteDraft(draftId) {
		return API.delete(`/api/drafts/${draftId}`).then(processJsonResults)
	},

	getAllDrafts() {
		return API.get(`/api/drafts`, 'json').then(processJsonResults)
	}
}

export default APIUtil
