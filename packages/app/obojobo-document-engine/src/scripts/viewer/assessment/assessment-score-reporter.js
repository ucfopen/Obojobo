import getScoreComparisionData from './assessment-score-reporter/get-score-comparision-data'
import getReportDetailsForAttempt from './assessment-score-reporter/get-report-details-for-attempt'
import getReportDisplayValuesForAttempt from './assessment-score-reporter/get-report-display-values-for-attempt'
import getScoreChangeDescription from './assessment-score-reporter/get-score-change-description'
import getTextItems from './assessment-score-reporter/get-text-items'

class AssessmentScoreReporter {
	constructor({ assessmentRubric, allAttempts, totalNumberOfAttemptsAllowed }) {
		this.assessmentRubric = assessmentRubric
		this.totalNumberOfAttemptsAllowed = totalNumberOfAttemptsAllowed
		this.allAttempts = allAttempts
	}

	getReportFor(attemptNumber) {
		if (attemptNumber === 0) {
			throw new Error(
				'getReportFor parameter is not zero-indexed - Use "1" for first attempt'
			)
		}

		const assessScoreInfoToReport = this.allAttempts[attemptNumber - 1].scoreDetails

		return {
			textItems: getTextItems(
				getReportDetailsForAttempt(this.assessmentRubric, assessScoreInfoToReport),
				getReportDisplayValuesForAttempt(assessScoreInfoToReport, this.totalNumberOfAttemptsAllowed)
			),
			scoreChangeDescription: getScoreChangeDescription(
				getScoreComparisionData(this.allAttempts, attemptNumber)
			)
		}
	}
}

export default AssessmentScoreReporter
