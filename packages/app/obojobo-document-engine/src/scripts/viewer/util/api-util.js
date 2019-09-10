const processJsonResults = res => {
	return Promise.resolve(res.json()).then(json => {
		if (json.status === 'error') {
			console.error(json.value) //eslint-disable-line no-console
		}

		return json
	})
}

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

	post(endpoint, body) {
		if (!body) body = {}

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

	postWithFormat(endpoint, body, format) {
		if (!body) body = '{}'

		return fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			body: body,
			headers: {
				Accept: format,
				'Content-Type': format
			}
		})
	},

	delete(endpoint) {
		return fetch(endpoint, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
	},
	
	postMultiPart(endpoint, formData = new FormData()) {
		return fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			body: formData
		}).then(processJsonResults)
	},

	postEvent({ draftId, action, eventVersion, visitId, payload = {} }) {
		return (
			APIUtil.post('/api/events', {
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
		return APIUtil.get(`/api/drafts/${id}`, 'json').then(processJsonResults)
	},

	getFullDraft(id, format='json') {
		return APIUtil.get(`/api/drafts/${id}/full`, format).then(res => res.text())
	},

	getVisitSessionStatus(draftId) {
		return APIUtil.get(`/api/visits/${draftId}/status`, 'json').then(processJsonResults)
	},

	requestStart(visitId, draftId) {
		return APIUtil.post('/api/visits/start', {
			visitId,
			draftId
		}).then(processJsonResults)
	},

	startAttempt({ draftId, assessmentId, visitId }) {
		return APIUtil.post('/api/assessments/attempt/start', {
			draftId,
			assessmentId,
			visitId
		}).then(processJsonResults)
	},

	resumeAttempt({ draftId, attemptId, visitId }) {
		return APIUtil.post(`/api/assessments/attempt/${attemptId}/resume`, {
			draftId,
			attemptId,
			visitId
		}).then(processJsonResults)
	},

	endAttempt({ attemptId, draftId, visitId }) {
		return APIUtil.post(`/api/assessments/attempt/${attemptId}/end`, { draftId, visitId }).then(
			processJsonResults
		)
	},

	reviewAttempt(attemptIds) {
		return APIUtil.post(`/api/assessments/attempt/review`, { attemptIds }).then(processJsonResults)
	},

	resendLTIAssessmentScore({ draftId, assessmentId, visitId }) {
		return APIUtil.post('/api/lti/send-assessment-score', {
			draftId,
			assessmentId,
			visitId
		}).then(processJsonResults)
	},

	clearPreviewScores({ draftId, visitId }) {
		return APIUtil.post('/api/assessments/clear-preview-scores', {
			draftId,
			visitId
		}).then(processJsonResults)
	},

	postDraft(id, draftString, format='application/json') {
		return APIUtil.postWithFormat(`/api/drafts/${id}`, draftString, format).then(processJsonResults)
	},

	createNewDraft() {
		return APIUtil.post(`/api/drafts/new`).then(processJsonResults)
	},

	deleteDraft(draftId) {
		return APIUtil.delete(`/api/drafts/`+draftId).then(processJsonResults)
	},

	getAllDrafts() {
		return APIUtil.get(`/api/drafts`, 'json').then(processJsonResults)
	},
}

export default APIUtil
