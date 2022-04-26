const parseAttemptReport = require('./parse-attempt-report')

describe('parseAttemptReport', () => {
	test('parseAttemptReport returns modified attempt objects', () => {
		expect(parseAttemptReport([])).toEqual([])
		expect(
			parseAttemptReport([
				{
					draftId: 'draft-id',
					userId: 'user-id',
					resourceLinkId: 'resource-id',
					assessmentId: 'assessment-id',
					attemptId: 'mock-id',
					userRoles: ['A', 'B']
				},
				{
					draftId: 'draft-id',
					userId: 'user-id',
					resourceLinkId: 'resource-id',
					assessmentId: 'assessment-id',
					attemptId: 'mock-id-2',
					userRoles: ['C'],
					attemptResult: {},
					assessmentScoreDetails: {},
					state: {}
				},
				{
					draftId: 'draft-id',
					userId: 'user-id',
					resourceLinkId: 'resource-id',
					assessmentId: 'assessment-id',
					attemptId: 'mock-id-3',
					userRoles: ['D', 'E', 'F'],
					attemptResult: { attemptScore: 50 },
					assessmentScore: 100,
					assessmentScoreDetails: { status: 'passed', rewardTotal: 10, assessmentScore: 90 },
					state: { invalid: false }
				},
				{
					draftId: 'draft-id',
					userId: 'user-id',
					resourceLinkId: 'resource-id-2',
					assessmentId: 'assessment-id',
					attemptId: 'mock-id-4',
					userRoles: [],
					attemptResult: { attemptScore: 60 },
					assessmentScore: 0,
					assessmentScoreDetails: { status: 'failed', rewardTotal: 0, assessmentScore: 0 },
					state: { invalid: true }
				}
			])
		).toEqual([
			{
				draftId: 'draft-id',
				userId: 'user-id',
				resourceLinkId: 'resource-id',
				assessmentId: 'assessment-id',
				attemptNumber: 1,
				attemptId: 'mock-id',
				userRoles: 'A,B',
				attemptScore: null,
				assessmentStatus: null,
				modRewardTotal: null,
				isInvalid: false,
				assessmentScore: null,
				unmoddedAssessmentScore: null
			},
			{
				draftId: 'draft-id',
				userId: 'user-id',
				resourceLinkId: 'resource-id',
				assessmentId: 'assessment-id',
				attemptNumber: 2,
				attemptId: 'mock-id-2',
				userRoles: 'C',
				attemptScore: null,
				assessmentStatus: null,
				modRewardTotal: null,
				isInvalid: false,
				attemptResult: {},
				assessmentScoreDetails: {},
				state: {},
				assessmentScore: null,
				unmoddedAssessmentScore: null
			},
			{
				draftId: 'draft-id',
				userId: 'user-id',
				resourceLinkId: 'resource-id',
				assessmentId: 'assessment-id',
				attemptNumber: 3,
				attemptId: 'mock-id-3',
				userRoles: 'D,E,F',
				attemptScore: 50,
				assessmentStatus: 'passed',
				modRewardTotal: 10,
				isInvalid: false,
				attemptResult: { attemptScore: 50 },
				assessmentScoreDetails: { status: 'passed', rewardTotal: 10, assessmentScore: 90 },
				state: { invalid: false },
				assessmentScore: 100,
				unmoddedAssessmentScore: 90
			},
			{
				draftId: 'draft-id',
				userId: 'user-id',
				resourceLinkId: 'resource-id-2',
				assessmentId: 'assessment-id',
				attemptNumber: 1,
				attemptId: 'mock-id-4',
				userRoles: '',
				attemptScore: 60,
				assessmentStatus: 'failed',
				modRewardTotal: 0,
				isInvalid: true,
				attemptResult: { attemptScore: 60 },
				assessmentScoreDetails: { status: 'failed', rewardTotal: 0, assessmentScore: 0 },
				state: { invalid: true },
				assessmentScore: 0,
				unmoddedAssessmentScore: 0
			}
		])
	})
})
