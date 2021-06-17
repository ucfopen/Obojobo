const parseAttemptReport = require('./parse-attempt-report')

describe('parseAtttemptReport', () => {
	test('parseAttemptReport returns modified attempt objects', () => {
		expect(parseAttemptReport([])).toEqual([])
		expect(
			parseAttemptReport([
				{ attemptId: 'mock-id', userRoles: ['A', 'B'] },
				{
					attemptId: 'mock-id-2',
					userRoles: ['C'],
					attemptResult: {},
					scoreDetails: {},
					state: {}
				},
				{
					attemptId: 'mock-id-3',
					userRoles: ['D', 'E', 'F'],
					attemptResult: { attemptScore: 50 },
					scoreDetails: { status: 'passed', rewardTotal: 10 },
					state: { invalid: false }
				},
				{
					attemptId: 'mock-id-4',
					userRoles: [],
					attemptResult: { attemptScore: 60 },
					scoreDetails: { status: 'failed', rewardTotal: 0 },
					state: { invalid: true }
				}
			])
		).toEqual([
			{
				attemptId: 'mock-id',
				userRoles: 'A,B',
				attemptScore: null,
				assessmentStatus: null,
				modRewardTotal: null,
				isInvalid: false
			},
			{
				attemptId: 'mock-id-2',
				userRoles: 'C',
				attemptScore: null,
				assessmentStatus: null,
				modRewardTotal: null,
				isInvalid: false,
				attemptResult: {},
				scoreDetails: {},
				state: {}
			},
			{
				attemptId: 'mock-id-3',
				userRoles: 'D,E,F',
				attemptScore: 50,
				assessmentStatus: 'passed',
				modRewardTotal: 10,
				isInvalid: false,
				attemptResult: { attemptScore: 50 },
				scoreDetails: { status: 'passed', rewardTotal: 10 },
				state: { invalid: false }
			},
			{
				attemptId: 'mock-id-4',
				userRoles: '',
				attemptScore: 60,
				assessmentStatus: 'failed',
				modRewardTotal: 0,
				isInvalid: true,
				attemptResult: { attemptScore: 60 },
				scoreDetails: { status: 'failed', rewardTotal: 0 },
				state: { invalid: true }
			}
		])
	})
})
