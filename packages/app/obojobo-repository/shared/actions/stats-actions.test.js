const {
	loadUserModuleList,
	loadModuleAssessmentDetails,
	loadCourseAssessmentData
} = require('./stats-actions')

jest.mock('./shared-api-methods', () => ({
	apiGetAssessmentDetailsForMultipleDrafts: () => Promise.resolve(),
	apiGetAssessmentDetailsForCourse: () => Promise.resolve()
}))

describe('statsActions', () => {
	test('loadUserModuleList returns expected object', async () => {
		const apiGetStatsPageModulesJson = jest.fn()
		const originalFetch = global.fetch
		global.fetch = jest.fn()
		global.fetch.mockImplementation(() => {
			return Promise.resolve({
				json: apiGetStatsPageModulesJson
			})
		})

		const result = await loadUserModuleList()

		expect(result).toEqual({
			type: 'LOAD_STATS_PAGE_MODULES_FOR_USER',
			promise: expect.any(Promise)
		})
		expect(apiGetStatsPageModulesJson).toHaveBeenCalledTimes(1)

		global.fetch = originalFetch
	})

	test('loadModuleAssessmentDetails returns expected object', async () => {
		const result = await loadModuleAssessmentDetails(['draft-id-1', 'draft-id-2'])

		expect(result).toEqual({
			type: 'LOAD_MODULE_ASSESSMENT_DETAILS',
			promise: expect.any(Promise)
		})
	})

	test('loadCourseAssessmentData returns expected object', async () => {
		const result = await loadCourseAssessmentData({
			draftId: 'draft-id-1',
			contextId: 'context-id-2'
		})

		expect(result).toEqual({
			type: 'LOAD_COURSE_ASSESSMENT_DATA',
			promise: expect.any(Promise)
		})
	})
})
