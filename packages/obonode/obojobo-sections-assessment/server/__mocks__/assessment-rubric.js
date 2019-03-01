const mockGetAssessmentScoreInfoForAttempt = jest.fn()

class AssessmentRubric {
	constructor() {
		this.getAssessmentScoreInfoForAttempt = mockGetAssessmentScoreInfoForAttempt
	}
}

AssessmentRubric.mockGetAssessmentScoreInfoForAttempt = mockGetAssessmentScoreInfoForAttempt

module.exports = AssessmentRubric
