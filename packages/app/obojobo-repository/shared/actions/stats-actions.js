// =================== API =======================

const JSON_MIME_TYPE = 'application/json'
const defaultOptions = () => ({
	method: 'GET',
	credentials: 'include',
	headers: {
		Accept: JSON_MIME_TYPE,
		'Content-Type': JSON_MIME_TYPE
	}
})

//@TODO - This is duplicated right now in dashboard actions
const apiGetAssessmentAnalytics = draftId => {
	return fetch(`/api/assessments/${draftId}/analytics`, defaultOptions)
		.then(res => res.json())
		.then(res => res.value)
		.then(attempts =>
			attempts.map(attempt => {
				attempt.userRoles = attempt.userRoles.join(',')
				attempt.attemptScore = attempt.attemptResult ? attempt.attemptResult.attemptScore : null
				attempt.assessmentStatus = attempt.scoreDetails ? attempt.scoreDetails.status : null
				attempt.modRewardTotal = attempt.scoreDetails ? attempt.scoreDetails.rewardTotal : null
				attempt.isInvalid = attempt.state && attempt.state.invalid

				return attempt
			})
		)
}

// ================== ACTIONS ===================

const LOAD_MODULE_ASSESSMENT_ANALYTICS = 'LOAD_MODULE_ASSESSMENT_ANALYTICS'
const loadModuleAssessmentAnalytics = draftIds => ({
	type: LOAD_MODULE_ASSESSMENT_ANALYTICS,
	promise: Promise.all(draftIds.map(id => apiGetAssessmentAnalytics(id))).then(result =>
		result.flat()
	)
})

module.exports = {
	LOAD_MODULE_ASSESSMENT_ANALYTICS,
	loadModuleAssessmentAnalytics
}
