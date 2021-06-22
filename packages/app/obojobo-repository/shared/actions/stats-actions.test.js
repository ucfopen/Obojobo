const { loadModuleAssessmentDetails } = require('./stats-actions')

jest.mock('./shared-api-methods', () => ({
	apiGetAssessmentDetailsForMultipleDrafts: () => Promise.resolve()
}))

describe('statsActions', () => {
	test('loadModuleAssessmentDetails returns expected object', async () => {
		const result = await loadModuleAssessmentDetails(['draft-id-1', 'draft-id-2'])

		expect(result).toEqual({
			type: 'LOAD_MODULE_ASSESSMENT_DETAILS',
			promise: expect.any(Promise)
		})
	})
})
