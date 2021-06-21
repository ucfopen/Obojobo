const parseAttemptReport = attempts =>
	attempts.map(attempt => {
		attempt.userRoles = attempt.userRoles.join(',')
		attempt.attemptScore =
			attempt.attemptResult && typeof attempt.attemptResult.attemptScore !== 'undefined'
				? attempt.attemptResult.attemptScore
				: null
		attempt.assessmentStatus =
			attempt.scoreDetails && typeof attempt.scoreDetails.status !== 'undefined'
				? attempt.scoreDetails.status
				: null
		attempt.modRewardTotal =
			attempt.scoreDetails && typeof attempt.scoreDetails.rewardTotal !== 'undefined'
				? attempt.scoreDetails.rewardTotal
				: null
		attempt.isInvalid = Boolean(attempt.state && attempt.state.invalid)

		return attempt
	})

module.exports = parseAttemptReport
