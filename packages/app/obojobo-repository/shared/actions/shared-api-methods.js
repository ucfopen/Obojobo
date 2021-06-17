// =================== API =======================

const parseAttemptReport = require('../util/parse-attempt-report')

const JSON_MIME_TYPE = 'application/json'
const defaultOptions = () => ({
	method: 'GET',
	credentials: 'include',
	headers: {
		Accept: JSON_MIME_TYPE,
		'Content-Type': JSON_MIME_TYPE
	}
})

const apiGetAssessmentAnalyticsForDraft = draftId => {
	return fetch(`/api/assessments/${draftId}/analytics`, defaultOptions())
		.then(res => res.json())
		.then(res => parseAttemptReport(res.value))
}

const apiGetAssessmentAnalyticsForMultipleDrafts = draftIds =>
	Promise.all(draftIds.map(id => apiGetAssessmentAnalyticsForDraft(id))).then(result =>
		result.flat()
	)

module.exports = {
	apiGetAssessmentAnalyticsForMultipleDrafts,
	apiGetAssessmentAnalyticsForDraft
}
