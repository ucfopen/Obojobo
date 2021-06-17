const {
	apiGetAssessmentAnalyticsForMultipleDrafts,
	apiGetAssessmentAnalyticsForDraft
} = require('./shared-api-methods')

describe('sharedAPIMethods', () => {
	let originalFetch

	beforeEach(() => {
		originalFetch = global.fetch
		global.fetch = jest.fn()
		global.fetch.mockImplementation(url => {
			const draftId = url.split('/')[3]

			return Promise.resolve({
				json: () =>
					Promise.resolve({
						value: [
							{
								draftId,
								userRoles: ['A'],
								attemptId: 'mock-attempt-1'
							},
							{
								draftId,
								userRoles: ['A'],
								attemptId: 'mock-attempt-2'
							}
						]
					})
			})
		})
	})

	afterEach(() => {
		global.fetch = originalFetch
	})

	test('apiGetAssessmentAnalyticsForDraft returns expected object', async () => {
		const result = await apiGetAssessmentAnalyticsForDraft('draft-id-1')

		expect(global.fetch).toHaveBeenCalledTimes(1)
		expect(result).toEqual([
			{
				draftId: 'draft-id-1',
				userRoles: 'A',
				attemptId: 'mock-attempt-1',
				assessmentStatus: null,
				attemptScore: null,
				isInvalid: false,
				modRewardTotal: null
			},
			{
				draftId: 'draft-id-1',
				userRoles: 'A',
				attemptId: 'mock-attempt-2',
				assessmentStatus: null,
				attemptScore: null,
				isInvalid: false,
				modRewardTotal: null
			}
		])
	})

	test('apiGetAssessmentAnalyticsForMultipleDrafts returns expected object', async () => {
		const result = await apiGetAssessmentAnalyticsForMultipleDrafts(['draft-id-1', 'draft-id-2'])

		expect(global.fetch).toHaveBeenCalledTimes(2)
		expect(result).toEqual([
			{
				draftId: 'draft-id-1',
				userRoles: 'A',
				attemptId: 'mock-attempt-1',
				assessmentStatus: null,
				attemptScore: null,
				isInvalid: false,
				modRewardTotal: null
			},
			{
				draftId: 'draft-id-1',
				userRoles: 'A',
				attemptId: 'mock-attempt-2',
				assessmentStatus: null,
				attemptScore: null,
				isInvalid: false,
				modRewardTotal: null
			},
			{
				draftId: 'draft-id-2',
				userRoles: 'A',
				attemptId: 'mock-attempt-1',
				assessmentStatus: null,
				attemptScore: null,
				isInvalid: false,
				modRewardTotal: null
			},
			{
				draftId: 'draft-id-2',
				userRoles: 'A',
				attemptId: 'mock-attempt-2',
				assessmentStatus: null,
				attemptScore: null,
				isInvalid: false,
				modRewardTotal: null
			}
		])
	})
})
