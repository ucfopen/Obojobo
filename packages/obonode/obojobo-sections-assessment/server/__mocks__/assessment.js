const Assessment = {
	completeAttempt: jest.fn(),
	getAttempt: jest.fn().mockResolvedValue({
		id: 'mockAttemptId',
		number: 'mockAttemptNumber',
		user_id: 'mockUserId',
		draft_id: 'mockDraftId',
		assessment_id: 'mockAssessmentId',
		state: {
			chosen: []
		}
	}),
	getAttempts: jest.fn(),
	getAttemptNumber: jest.fn().mockResolvedValue('mockAttemptNumber'),
	getCompletedAssessmentAttemptHistory: jest.fn(),
	getResponsesForAttempt: jest.fn()
}

module.exports = Assessment
