import API from './api'

const AssessmentAPI = {
	importScore({ draftId, assessmentId, visitId, importedAssessmentScoreId }) {
		return API.post(`/api/assessments/${draftId}/${assessmentId}/import-score`, {
			visitId,
			importedAssessmentScoreId
		}).then(API.processJsonResults)
	},
	resumeAttempt({ draftId, attemptId, visitId }) {
		return API.post(`/api/assessments/attempt/${attemptId}/resume`, {
			draftId,
			attemptId,
			visitId
		}).then(API.processJsonResults)
	},
	getAttemptHistory({ draftId, visitId }) {
		return API.get(`/api/assessments/${draftId}/attempts?visitId=${visitId}`).then(
			API.processJsonResults
		)
	},
	startAttempt({ draftId, assessmentId, visitId }) {
		return API.post('/api/assessments/attempt/start', {
			draftId,
			assessmentId,
			visitId
		}).then(API.processJsonResults)
	},
	saveAttempt({ draftId, draftContentId, assessmentId, attemptId, state, visitId }) {
		return API.post(`/api/assessments/attempt/${attemptId}/save`, {
			draftId,
			draftContentId,
			assessmentId,
			state,
			visitId
		}).then(API.processJsonResults)
	},
	endAttempt({ attemptId, draftId, visitId }) {
		return API.post(`/api/assessments/attempt/${attemptId}/end`, { draftId, visitId }).then(
			API.processJsonResults
		)
	},
	resendLTIAssessmentScore({ draftId, assessmentId, visitId }) {
		return API.post('/api/lti/send-assessment-score', {
			draftId,
			assessmentId,
			visitId
		}).then(API.processJsonResults)
	},
	reviewAttempt(attemptIds) {
		return API.post(`/api/assessments/attempt/review`, { attemptIds })
			.then(API.processJsonResults)
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
	}
}

export default AssessmentAPI
