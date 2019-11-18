const mockGetAssessmentScoreInfoForAttempt = jest.fn(() => 'mockAssessmentScoreDetails')

class AssessmentRubric {
	constructor() {
		this.getAssessmentScoreInfoForAttempt = mockGetAssessmentScoreInfoForAttempt
	}
}

AssessmentRubric.mockGetAssessmentScoreInfoForAttempt = mockGetAssessmentScoreInfoForAttempt

module.exports = AssessmentRubric
