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

	startAttempt({ draftId, assessmentId, visitId }) {
		return API.post('/api/assessments/attempt/start', {
			draftId,
			assessmentId,
			visitId
		}).then(processJsonResults)
	},

	resumeAttempt({ draftId, attemptId, visitId }) {
		return API.post(`/api/assessments/attempt/${attemptId}/resume`, {
			draftId,
			attemptId,
			visitId
		}).then(processJsonResults)
	},

	endAttempt({ attemptId, draftId, visitId }) {
		return API.post(`/api/assessments/attempt/${attemptId}/end`, { draftId, visitId }).then(
			processJsonResults
		)
	},

	reviewAttempt(attemptIds) {
		return API.post(`/api/assessments/attempt/review`, { attemptIds }).then(processJsonResults)
	},

	resendLTIAssessmentScore({ draftId, assessmentId, visitId }) {
		return API.post('/api/lti/send-assessment-score', {
			draftId,
			assessmentId,
			visitId
		}).then(processJsonResults)
	},

	clearPreviewScores({ draftId, visitId }) {
		return API.post('/api/assessments/clear-preview-scores', {
			draftId,
			visitId
		}).then(processJsonResults)
	},

	postDraft(id, draftString, format = 'application/json') {
		return API.postWithFormat(`/api/drafts/${id}`, draftString, format).then(processJsonResults)
	},

	createNewDraft() {
		return API.post(`/api/drafts/new`).then(processJsonResults)
	},

	deleteDraft(draftId) {
		return API.delete(`/api/drafts/${draftId}`).then(processJsonResults)
	},

	getAllDrafts() {
		return API.get(`/api/drafts`, 'json').then(processJsonResults)
	},

	requestEditLock(draftId, contentId) {
		return API.post(`/api/locks/${draftId}`, {contentId}).then(processJsonResults)
	}
}

export default APIUtil
