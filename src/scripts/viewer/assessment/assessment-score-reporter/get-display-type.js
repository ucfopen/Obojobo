import {
	TYPE_ATTEMPT_WITHOUT_MODS_REWARDED,
	TYPE_ATTEMPT_WITH_MODS_REWARDED,
	TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITHOUT_MODS_REWARDED,
	TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITH_MODS_REWARDED,
	TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_LESS_THAN_100,
	TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_NO_MODS_REWARDED,
	TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_MODS_REWARDED,
	TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE,
	TYPE_PASSFAIL_FAILED_GIVEN_SCORE,
	TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE,
	TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE,
	TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE,
	ERROR_UNKNOWN_DISPLAY_TYPE
} from './display-types'

let getDisplayType = ({ rubricType, mods, status, statusResult, isAttemptScore100 }) => {
	let passed = status === 'passed'
	let failed = status === 'failed'
	let unableToPass = status === 'unableToPass'
	let isAttemptRubric = rubricType === 'attempt'
	let isPassFailRubric = rubricType === 'pass-fail'
	let isRewardedMods = mods.length > 0
	let isResultNumeric = Number.isFinite(parseFloat(statusResult))
	let isResultNoScore = statusResult === 'no-score'
	let isResultAttemptScore = statusResult === '$attempt_score'
	let isResultHighestAttemptScore = statusResult === '$highest_attempt_score'

	let items = []

	if (isAttemptRubric && passed && isResultAttemptScore && !isRewardedMods) {
		return TYPE_ATTEMPT_WITHOUT_MODS_REWARDED
	}
	if (isAttemptRubric && passed && isResultAttemptScore && isRewardedMods) {
		return TYPE_ATTEMPT_WITH_MODS_REWARDED
	}
	if (isPassFailRubric && passed && isResultAttemptScore && !isRewardedMods) {
		return TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITHOUT_MODS_REWARDED
	}
	if (isPassFailRubric && passed && isResultAttemptScore && isRewardedMods) {
		return TYPE_PASSFAIL_PASSED_GIVEN_ATTEMPT_SCORE_WITH_MODS_REWARDED
	}
	if (isPassFailRubric && passed && isResultNumeric && !isAttemptScore100) {
		return TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_LESS_THAN_100
	}
	if (isPassFailRubric && passed && isResultNumeric && isAttemptScore100 && !isRewardedMods) {
		return TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_NO_MODS_REWARDED
	}
	if (isPassFailRubric && passed && isResultNumeric && isAttemptScore100 && isRewardedMods) {
		return TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_MODS_REWARDED
	}
	if (isPassFailRubric && failed && isResultNoScore && !isRewardedMods) {
		return TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE
	}
	if (isPassFailRubric && failed && isResultNumeric && !isRewardedMods) {
		return TYPE_PASSFAIL_FAILED_GIVEN_SCORE
	}
	if (isPassFailRubric && unableToPass && isResultNoScore && !isRewardedMods) {
		return TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE
	}
	if (isPassFailRubric && unableToPass && isResultHighestAttemptScore && !isRewardedMods) {
		return TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE
	}
	if (isPassFailRubric && unableToPass && isResultNumeric && !isRewardedMods) {
		return TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE
	}

	return ERROR_UNKNOWN_DISPLAY_TYPE
}

export default getDisplayType
