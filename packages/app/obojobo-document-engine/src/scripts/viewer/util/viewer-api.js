import API from './api'

const ViewerApi = {
	processJsonResults: API.processJsonResults,
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
				.then(API.processJsonResults)
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
		return API.get(`/api/drafts/${id}`, 'json').then(API.processJsonResults)
	},

	getVisitSessionStatus(draftId) {
		return API.get(`/api/visits/${draftId}/status`, 'json').then(API.processJsonResults)
	},

	requestStart(visitId, draftId) {
		return API.post('/api/visits/start', {
			visitId,
			draftId
		}).then(API.processJsonResults)
	},

	// @TODO: make this more generic named
	// and fire an event on the server
	// and have assessment listening to do what it do
	clearPreviewScores({ draftId, visitId }) {
		return API.post('/api/assessments/clear-preview-scores', {
			draftId,
			visitId
		}).then(API.processJsonResults)
	},
}

export default ViewerApi
