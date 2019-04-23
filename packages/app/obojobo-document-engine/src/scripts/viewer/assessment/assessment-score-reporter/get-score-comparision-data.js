import AssessmentUtil from '../../util/assessment-util'

const getScoreComparisionData = (allAttempts, attemptNumberToGenerateReportFor) => {
	if (allAttempts.length === 0) {
		return {
			prevHighestInfo: null,
			newInfo: null
		}
	}

	const prevAttempts = allAttempts.slice(0, attemptNumberToGenerateReportFor - 1)
	const highestAttempts = AssessmentUtil.findHighestAttempts(prevAttempts, 'assessmentScore')
	const prevHighestAttempt = highestAttempts.length === 0 ? null : highestAttempts[0]

	return {
		prevHighestInfo: prevHighestAttempt ? prevHighestAttempt.assessmentScoreDetails : null,
		newInfo: allAttempts[attemptNumberToGenerateReportFor - 1].assessmentScoreDetails
	}
}

export default getScoreComparisionData
