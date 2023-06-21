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

const apiGetAssessmentDetailsForDraft = draftId => {
	return fetch(`/api/assessments/${draftId}/details`, defaultOptions())
		.then(res => res.json())
		.then(res => parseAttemptReport(res.value))
}

const apiGetAssessmentDetailsForMultipleDrafts = draftIds =>
	Promise.all(draftIds.map(id => apiGetAssessmentDetailsForDraft(id))).then(result => result.flat())

const apiGetCourseDetailsForDraft = draftId => {
	return fetch(`/api/courses/${draftId}`, defaultOptions())
		.then(res => res.json())
		.then(res => res.value)
}

module.exports = {
	apiGetAssessmentDetailsForMultipleDrafts,
	apiGetAssessmentDetailsForDraft,
	apiGetCourseDetailsForDraft
}
