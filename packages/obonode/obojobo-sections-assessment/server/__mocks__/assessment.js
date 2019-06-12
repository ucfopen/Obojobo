const Assessment = {
	completeAttempt: jest.fn(),
	getAttempt: jest.fn().mockResolvedValue({
		id: 'mockAttemptId',
		user_id: 'mockUserId',
		draft_id: 'mockDraftId',
		assessment_id: 'mockAssessmentId',
		state: 'mockState'
	}),
	getAttempts: jest.fn(),
	getAttemptNumber: jest.fn().mockResolvedValue('mockAttemptNumber'),
	getCompletedAssessmentAttemptHistory: jest.fn(),
	getResponsesForAttempt: jest.fn()
}

module.exports = Assessment
