const mockGetAssessmentScoreInfoForAttempt = jest.fn()

class AssessmentRubric {
	constructor(rubric) {
		this.getAssessmentScoreInfoForAttempt = mockGetAssessmentScoreInfoForAttempt
	}
}

AssessmentRubric.mockGetAssessmentScoreInfoForAttempt = mockGetAssessmentScoreInfoForAttempt

module.exports = AssessmentRubric
