const composeKey = ({ draftId, userId, resourceLinkId, assessmentId }) =>
	draftId + ' ' + userId + ' ' + resourceLinkId + ' ' + assessmentId

const parseAttemptReport = attempts => {
	const attemptsNumberByDraftAndUserAndResourceLinkIdAndAssessmentId = {}

	return attempts.map(attempt => {
		const key = composeKey(attempt)
		if (!attemptsNumberByDraftAndUserAndResourceLinkIdAndAssessmentId[key]) {
			attemptsNumberByDraftAndUserAndResourceLinkIdAndAssessmentId[key] = { n: 0, attempts: [] }
		}
		attemptsNumberByDraftAndUserAndResourceLinkIdAndAssessmentId[key].n++
		attemptsNumberByDraftAndUserAndResourceLinkIdAndAssessmentId[key].attempts.push(attempt)

		attempt.attemptNumber = attemptsNumberByDraftAndUserAndResourceLinkIdAndAssessmentId[key].n

		attempt.userRoles = attempt.userRoles.join(',')
		attempt.assessmentScore = Number.isFinite(parseFloat(attempt.assessmentScore))
			? parseFloat(attempt.assessmentScore)
			: null
		attempt.attemptScore =
			attempt.attemptResult && typeof attempt.attemptResult.attemptScore !== 'undefined'
				? attempt.attemptResult.attemptScore
				: null
		attempt.assessmentStatus =
			attempt.assessmentScoreDetails && typeof attempt.assessmentScoreDetails.status !== 'undefined'
				? attempt.assessmentScoreDetails.status
				: null
		attempt.modRewardTotal =
			attempt.assessmentScoreDetails &&
			typeof attempt.assessmentScoreDetails.rewardTotal !== 'undefined'
				? attempt.assessmentScoreDetails.rewardTotal
				: null
		attempt.unmoddedAssessmentScore =
			attempt.assessmentScoreDetails &&
			typeof attempt.assessmentScoreDetails.assessmentScore !== 'undefined'
				? attempt.assessmentScoreDetails.assessmentScore
				: null
		attempt.isInvalid = Boolean(attempt.state && attempt.state.invalid)

		return attempt
	})
}

module.exports = parseAttemptReport
