const processJsonResults = res => {
	return Promise.resolve(res.json()).then(json => {
		if (json.status === 'error') console.log(json.value)
		return json
	})
}

var APIUtil = {
	get(endpoint) {
		return fetch(endpoint, {
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
	},

	post(endpoint, body) {
		if (body == null) {
			body = {}
		}
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

	postEvent({ action, eventVersion, payload = {}, visitId }) {
		return (
			APIUtil.post('/api/events', {
				event: {
					action,
					actor_time: new Date().toISOString(),
					event_version: eventVersion,
					payload
				},
				visitId
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
		return fetch(`/api/drafts/${id}`).then(processJsonResults)
	},

	requestStart({ visitId }) {
		return APIUtil.post('/api/visits/start', {
			visitId
		}).then(processJsonResults)
	},

	startAttempt({ visitId, assessmentId }) {
		return APIUtil.post('/api/assessments/attempt/start', {
			visitId,
			assessmentId
		}).then(processJsonResults)
	},

	endAttempt({ visitId, attemptId }) {
		return APIUtil.post(`/api/assessments/attempt/${attemptId}/end`, {
			visitId
		}).then(processJsonResults)
	},

	resendLTIAssessmentScore({ visitId, assessmentId }) {
		return APIUtil.post('/api/lti/sendAssessmentScore', {
			visitId,
			assessmentId
		}).then(processJsonResults)
	},

	clearPreviewScores(visitId) {
		return APIUtil.post('/api/assessments/clear-preview-scores', { visitId }).then(
			processJsonResults
		)
	}
}

export default APIUtil
