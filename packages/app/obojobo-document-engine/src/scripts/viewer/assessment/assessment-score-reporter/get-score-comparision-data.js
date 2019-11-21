import AssessmentUtil from '../../util/assessment-util'
import findItemsWithMaxPropValue from '../../../common/util/find-items-with-max-prop-value'

const getScoreComparisionData = (allScoreDetails, attemptNumberToGenerateReportFor) => {
	if (allScoreDetails.length === 0) {
		return {
			prevHighestInfo: null,
			newInfo: null
		}
	}

	const prevDetails = allScoreDetails.slice(0, attemptNumberToGenerateReportFor - 1)
	const highestDetails = findItemsWithMaxPropValue(prevDetails, 'assessmentScore')

	return {
		prevHighestInfo: highestDetails.length === 0 ? null : highestDetails[0],
		newInfo: allScoreDetails[attemptNumberToGenerateReportFor - 1]
	}
}

export default getScoreComparisionData
