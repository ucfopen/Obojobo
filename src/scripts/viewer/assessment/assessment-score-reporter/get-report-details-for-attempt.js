import getDisplayFriendlyScore from './get-display-friendly-score'
import getStatusResult from './get-status-result'

let getReportDetailsForAttempt = (assessmentRubric, scoreInfo) => {
	let statusResult = getStatusResult(assessmentRubric, scoreInfo.status)

	return {
		rubricType: assessmentRubric.type,
		mods: scoreInfo.rewardedMods.map(modIndex => assessmentRubric.mods[modIndex]),
		status: scoreInfo.status,
		statusResult,
		passingAttemptScore:
			typeof assessmentRubric.passingAttemptScore !== 'undefined'
				? assessmentRubric.passingAttemptScore
				: 100,
		isAttemptScore100: scoreInfo.attemptScore === 100,
		isAssessScoreOver100:
			scoreInfo.status === 'passed' &&
			scoreInfo.assessmentScore !== null &&
			scoreInfo.assessmentScore + scoreInfo.rewardTotal > 100
	}
}

export default getReportDetailsForAttempt
