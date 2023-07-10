// =================== API =======================

const {
	apiGetAssessmentDetailsForMultipleDrafts,
	apiGetAssessmentDetailsForCourse
} = require('./shared-api-methods')

// ================== ACTIONS ===================

const apiGetStatsPageModules = () => {
	const JSON_MIME_TYPE = 'application/json'
	const fetchOptions = {
		method: 'GET',
		credentials: 'include',
		headers: {
			Accept: JSON_MIME_TYPE,
			'Content-Type': JSON_MIME_TYPE
		}
	}
	return fetch('/api/drafts-stats', fetchOptions).then(res => res.json())
}

const LOAD_STATS_PAGE_MODULES_FOR_USER = 'LOAD_STATS_PAGE_MODULES_FOR_USER'
const loadUserModuleList = () => ({
	type: LOAD_STATS_PAGE_MODULES_FOR_USER,
	promise: apiGetStatsPageModules()
})

const LOAD_MODULE_ASSESSMENT_DETAILS = 'LOAD_MODULE_ASSESSMENT_DETAILS'
const loadModuleAssessmentDetails = draftIds => ({
	type: LOAD_MODULE_ASSESSMENT_DETAILS,
	promise: apiGetAssessmentDetailsForMultipleDrafts(draftIds)
})

const LOAD_COURSE_ASSESSMENT_DATA = 'LOAD_COURSE_ASSESSMENT_DATA'
const loadCourseAssessmentData = params => ({
	type: LOAD_COURSE_ASSESSMENT_DATA,
	promise: apiGetAssessmentDetailsForCourse(params)
})

module.exports = {
	LOAD_STATS_PAGE_MODULES_FOR_USER,
	LOAD_MODULE_ASSESSMENT_DETAILS,
	LOAD_COURSE_ASSESSMENT_DATA,
	loadUserModuleList,
	loadModuleAssessmentDetails,
	loadCourseAssessmentData
}
