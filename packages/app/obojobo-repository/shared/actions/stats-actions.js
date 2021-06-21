// =================== API =======================

const { apiGetAssessmentAnalyticsForMultipleDrafts } = require('./shared-api-methods')

// ================== ACTIONS ===================

const LOAD_MODULE_ASSESSMENT_ANALYTICS = 'LOAD_MODULE_ASSESSMENT_ANALYTICS'
const loadModuleAssessmentAnalytics = draftIds => ({
	type: LOAD_MODULE_ASSESSMENT_ANALYTICS,
	promise: apiGetAssessmentAnalyticsForMultipleDrafts(draftIds)
})

module.exports = {
	LOAD_MODULE_ASSESSMENT_ANALYTICS,
	loadModuleAssessmentAnalytics
}
