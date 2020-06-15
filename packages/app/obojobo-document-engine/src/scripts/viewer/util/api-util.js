const API = require('./api')

const processJsonResults = res => {
	return Promise.resolve(res.json()).then(json => {
		if (json.status === 'error') {
			console.error(json.value) //eslint-disable-line no-console
		}

		return json
	})
}

const createEventObject = ({
	draftId,
	action,
	eventVersion,
	visitId,
	payload = {},
	actorTime = null
}) => {
	return {
		draftId,
		visitId,
		event: {
			action,
			draft_id: draftId,
			actor_time: (actorTime || new Date()).toISOString(),
			event_version: eventVersion,
			visitId,
			payload
		}
	}
}

const postEvent = eventObject => {
	return (
		API.post('/api/events', eventObject)
			.then(processJsonResults)
			// TODO: Send Caliper event to client host.
			.then(res => {
				if (res && res.status === 'ok' && res.value) {
					parent.postMessage(res.value, '*')
				}

				return {
					response: res,
					sent: eventObject
				}
			})
	)
}

const debouncedSendFnsByAction = {}

const APIUtil = {
	postEvent({ draftId, action, eventVersion, visitId, payload = {}, actorTime = null }) {
		return postEvent(
			createEventObject({ draftId, action, eventVersion, visitId, payload, actorTime })
		)
	},

	// Allows you to delay sending an event. Events with the same action will be cancelled
	// and overwritten with the newer event.
	// The event creation time is stored as `actor_time` in the event, so while the event
	// may be posted at a later date and out of order the actor_time can be used to determine
	// the correct sequence of events.
	debouncedPostEvent(
		debounceMs,
		beforeCallback,
		{ draftId, action, eventVersion, visitId, payload = {} },
		optionalCallback = null
	) {
		if (debouncedSendFnsByAction[action]) {
			debouncedSendFnsByAction[action].cancel()
		}

		const postEventFn = postEvent.bind(
			null,
			createEventObject({ draftId, action, eventVersion, visitId, payload })
		)

		debouncedSendFnsByAction[action] = debounce(debounceMs, () => {
			beforeCallback()
			postEventFn().then(res => {
				if (typeof optionalCallback === 'function') {
					optionalCallback(res)
				}
			})
		})

		debouncedSendFnsByAction[action]()
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
		return API.post(`/api/assessments/attempt/review`, { attemptIds })
			.then(processJsonResults)
			.then(attemptArray => {
				// quick fix - converts arrays sent by the api to expected object hash with ids as keys
				const attemptHash = {}
				attemptArray.forEach(attempt => {
					const questionHash = {}
					attempt.questions.forEach(question => {
						questionHash[question.id] = question
					})
					attemptHash[attempt.attemptId] = questionHash
				})

				return attemptHash
			})
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
		return API.post(`/api/drafts/${id}`, draftString, format).then(processJsonResults)
	},

	// If `content` and `format` are not specified, the default draft will be created
	createNewDraft(content, format) {
		return API.post(`/api/drafts/new`, {
			content,
			format
		}).then(processJsonResults)
	},

	deleteDraft(draftId) {
		return API.delete(`/api/drafts/${draftId}`).then(processJsonResults)
	},

	getAllDrafts() {
		return API.get(`/api/drafts`, 'json').then(processJsonResults)
	},

	copyDraft(draftId, newTitle) {
		return API.post(`/api/drafts/${draftId}/copy`, { title: newTitle }).then(processJsonResults)
	}
}

module.exports = APIUtil
