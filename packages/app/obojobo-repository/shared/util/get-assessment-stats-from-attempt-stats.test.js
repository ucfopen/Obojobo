const getAssessmentStatsFromAttemptStats = require('./get-assessment-stats-from-attempt-stats')

describe('getAssessmentStatsFromAttemptStats', () => {
	test('DataGridAssessments renders correctly', () => {
		expect(
			getAssessmentStatsFromAttemptStats([
				// Draft-A Version-1 Assessment-1 Resource-X User-Alpha:
				{
					draftId: 'Draft-A',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-A',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: 10,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-A',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: 0,
					completedAt: 'mock-date'
				},
				// Draft-A Version-1 Assessment-2 Resource-X User-Alpha:
				{
					draftId: 'Draft-A',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-2',
					userId: 'User-Alpha',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-A',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-2',
					userId: 'User-Alpha',
					assessmentScore: 20,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-A',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-2',
					userId: 'User-Alpha',
					assessmentScore: 0,
					completedAt: 'mock-date'
				},
				// Draft-A Version-2 Assessment-2 Resource-X User-Alpha:
				{
					draftId: 'Draft-A',
					draftContentId: 'Version-2',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-2',
					userId: 'User-Alpha',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-A',
					draftContentId: 'Version-2',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-2',
					userId: 'User-Alpha',
					assessmentScore: 30,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-A',
					draftContentId: 'Version-2',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-2',
					userId: 'User-Alpha',
					assessmentScore: 0,
					completedAt: 'mock-date'
				},
				// Draft-B Version-1 Assessment-1 Resource-X User-Alpha:
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: 40,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: 0,
					completedAt: 'mock-date'
				},
				// Draft-B Version-1 Assessment-1 Resource-Y User-Alpha:
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-Y',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-Y',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: 50,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-Y',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: 0,
					completedAt: 'mock-date'
				},
				// Draft-B Version-1 Assessment-1 Resource-Y User-Beta:
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-Y',
					assessmentId: 'Assessment-1',
					userId: 'User-Beta',
					assessmentScore: 60,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-Y',
					assessmentId: 'Assessment-1',
					userId: 'User-Beta',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-Y',
					assessmentId: 'Assessment-1',
					userId: 'User-Beta',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				// Draft-B Version-1 Assessment-1 Resource-Z User-Beta:
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-Z',
					assessmentId: 'Assessment-1',
					userId: 'User-Beta',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-Z',
					assessmentId: 'Assessment-1',
					userId: 'User-Beta',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				{
					draftId: 'Draft-B',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-Z',
					assessmentId: 'Assessment-1',
					userId: 'User-Beta',
					assessmentScore: null,
					completedAt: 'mock-date'
				},
				// Draft-C Version-1 Assessment-1 Resource-X User-Alpha:
				{
					draftId: 'Draft-C',
					draftContentId: 'Version-1',
					resourceLinkId: 'Resource-X',
					assessmentId: 'Assessment-1',
					userId: 'User-Alpha',
					assessmentScore: null,
					completedAt: null
				}
			])
		).toEqual([
			expect.objectContaining({
				draftId: 'Draft-A',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-X',
				assessmentId: 'Assessment-1',
				userId: 'User-Alpha',
				highestAssessmentScore: 10
			}),
			expect.objectContaining({
				draftId: 'Draft-A',
				draftContentId: 'Version-2',
				resourceLinkId: 'Resource-X',
				assessmentId: 'Assessment-2',
				userId: 'User-Alpha',
				highestAssessmentScore: 30
			}),
			expect.objectContaining({
				draftId: 'Draft-B',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-X',
				assessmentId: 'Assessment-1',
				userId: 'User-Alpha',
				highestAssessmentScore: 40
			}),
			expect.objectContaining({
				draftId: 'Draft-B',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-Y',
				assessmentId: 'Assessment-1',
				userId: 'User-Alpha',
				highestAssessmentScore: 50
			}),
			expect.objectContaining({
				draftId: 'Draft-B',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-Y',
				assessmentId: 'Assessment-1',
				userId: 'User-Beta',
				highestAssessmentScore: 60
			}),
			expect.objectContaining({
				draftId: 'Draft-B',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-Z',
				assessmentId: 'Assessment-1',
				userId: 'User-Beta',
				highestAssessmentScore: null
			}),
			expect.objectContaining({
				draftId: 'Draft-C',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-X',
				assessmentId: 'Assessment-1',
				userId: 'User-Alpha',
				highestAssessmentScore: null,
				completedAt: null
			})
		])
	})
})
