import AssessmentUtil from '../util/assessment-util'

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

	getReportFor(attemptNumberToGenerateReportFor) {
		if (attemptNumberToGenerateReportFor === 0) {
			throw new Error(
				'attemptNumberToGenerateReportFor parameter is not zero-indexed - Use "1" for first attempt'
			)
		}

		let assessScoreInfoToReport = this.allAttempts[attemptNumberToGenerateReportFor - 1]
			.assessmentScoreDetails

		return {
			textItems: getTextItems(
				getReportDetailsForAttempt(this.assessmentRubric, assessScoreInfoToReport),
				getReportDisplayValuesForAttempt(assessScoreInfoToReport, this.totalNumberOfAttemptsAllowed)
			),
			scoreChangeDescription: getScoreChangeDescription(
				getScoreComparisionData(this.allAttempts, attemptNumberToGenerateReportFor)
			)
		}
	}
}

export default AssessmentScoreReporter
