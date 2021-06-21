const { loadModuleAssessmentAnalytics } = require('./stats-actions')

jest.mock('./shared-api-methods', () => ({
	apiGetAssessmentAnalyticsForMultipleDrafts: () => Promise.resolve()
}))

describe('statsActions', () => {
	test('loadModuleAssessmentAnalytics returns expected object', async () => {
		const result = await loadModuleAssessmentAnalytics(['draft-id-1', 'draft-id-2'])

		expect(result).toEqual({
			type: 'LOAD_MODULE_ASSESSMENT_ANALYTICS',
			promise: expect.any(Promise)
		})
	})
})
