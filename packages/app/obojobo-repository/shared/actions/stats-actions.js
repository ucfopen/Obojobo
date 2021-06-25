// =================== API =======================

const { apiGetAssessmentDetailsForMultipleDrafts } = require('./shared-api-methods')

// ================== ACTIONS ===================

const LOAD_MODULE_ASSESSMENT_DETAILS = 'LOAD_MODULE_ASSESSMENT_DETAILS'
const loadModuleAssessmentDetails = draftIds => ({
	type: LOAD_MODULE_ASSESSMENT_DETAILS,
	promise: apiGetAssessmentDetailsForMultipleDrafts(draftIds)
})

module.exports = {
	LOAD_MODULE_ASSESSMENT_DETAILS,
	loadModuleAssessmentDetails
}
