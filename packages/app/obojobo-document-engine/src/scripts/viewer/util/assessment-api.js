import APIUtil from './api-util'

const AssessmentAPIUtil = {
	importScore({draftId, assessmentId, visitId, importedAssessmentScoreId}) {
		return APIUtil.post(`/api/assessments/${draftId}/${assessmentId}/import-score`, {
			visitId,
			importedAssessmentScoreId
		}).then(APIUtil.processJsonResults)
	},
	resumeAttempt({ draftId, attemptId, visitId }) {
		return APIUtil.post(`/api/assessments/attempt/${attemptId}/resume`, {
			draftId,
			attemptId,
			visitId
		}).then(APIUtil.processJsonResults)
	},
	getAttemptHistory({ draftId, visitId }){
		return APIUtil.get(`/api/assessments/${draftId}/attempts?visitId=${visitId}`)
		.then(APIUtil.processJsonResults)
	},
	startAttempt({ draftId, assessmentId, visitId }) {
		return APIUtil.post('/api/assessments/attempt/start', {
			draftId,
			assessmentId,
			visitId
		}).then(APIUtil.processJsonResults)
	},

	endAttempt({ attemptId, draftId, visitId }) {
		return APIUtil.post(`/api/assessments/attempt/${attemptId}/end`, { draftId, visitId }).then(
			APIUtil.processJsonResults
		)
	},
	resendLTIAssessmentScore({ draftId, assessmentId, visitId }) {
		return APIUtil.post('/api/lti/send-assessment-score', {
			draftId,
			assessmentId,
			visitId
		}).then(APIUtil.processJsonResults)
	},
}

export default AssessmentAPIUtil
