const composeKey = ({ draftId, userId, resourceLinkId, assessmentId }) =>
	draftId + ' ' + userId + ' ' + resourceLinkId + ' ' + assessmentId

const getAssessmentStatsFromAttemptStats = attempts => {
	const assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId = {}

	attempts.forEach(attemptRow => {
		const key = composeKey(attemptRow)

		if (!assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId[key]) {
			assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId[key] = {
				userId: attemptRow.userId,
				draftId: attemptRow.draftId,
				draftContentId: attemptRow.draftContentId,
				resourceLinkId: attemptRow.resourceLinkId,
				assessmentId: attemptRow.assessmentId,
				username: attemptRow.userUsername,
				userFirstName: attemptRow.userFirstName,
				userLastName: attemptRow.userLastName,
				studentName: `${attemptRow.userFirstName} ${attemptRow.userLastName}`,
				userRoles: attemptRow.userRoles,
				isPreview: attemptRow.isPreview,
				contextId: attemptRow.contextId,
				courseTitle: attemptRow.courseTitle,
				resourceLinkTitle: attemptRow.resourceLinkTitle,
				launchPresentationReturnUrl: attemptRow.launchPresentationReturnUrl,
				moduleTitle: attemptRow.moduleTitle,
				highestAssessmentScore: null,
				completedAt: attemptRow.completedAt ? attemptRow.completedAt : null
			}
		}

		const assessmentRow = assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId[key]

		if (
			assessmentRow.highestAssessmentScore === null ||
			attemptRow.assessmentScore > assessmentRow.highestAssessmentScore
		) {
			assessmentRow.highestAssessmentScore = attemptRow.assessmentScore
			assessmentRow.draftContentId = attemptRow.draftContentId
		}
	})

	return Object.values(assessmentScoresByDraftAndUserAndResourceLinkIdAndAssessmentId)
}

module.exports = getAssessmentStatsFromAttemptStats
