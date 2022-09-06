const insertEvent = require('obojobo-express/server/insert_event')
const lti = require('obojobo-express/server/lti')

const insertAttemptEndEvents = (
	userId,
	draftId,
	contentId,
	assessmentId,
	attemptId,
	attemptNumber,
	isPreview,
	hostname,
	remoteAddress,
	visitId,
	originalAttemptId = null,
	originalScoreId = null
) => {
	return insertEvent({
		action: 'assessment:attemptEnd',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId,
			attemptCount: attemptNumber,
			imported: originalAttemptId !== null,
			originalAttemptId,
			originalScoreId
		},
		visitId,
		userId,
		ip: remoteAddress,
		metadata: {},
		draftId,
		contentId,
		eventVersion: '1.3.0',
		isPreview: isPreview
	})
}

const insertAttemptScoredEvents = (
	user,
	draftDocument,
	assessmentId,
	assessmentScoreId,
	attemptId,
	attemptNumber,
	attemptScore,
	assessmentScore,
	isPreview,
	ltiScoreSent,
	ltiScoreStatus,
	ltiStatusDetails,
	ltiGradeBookStatus,
	ltiAssessmentScoreId,
	hostname,
	remoteAddress,
	scoreDetails,
	resourceLinkId,
	visitId,
	originalAttemptId = null,
	originalScoreId = null
) => {
	return lti
		.getLatestHighestAssessmentScoreRecord(
			user.id,
			draftDocument.draftId,
			assessmentId,
			resourceLinkId,
			isPreview
		)
		.then(highestAssessmentScoreRecord => {
			return insertEvent({
				action: 'assessment:attemptScored',
				actorTime: new Date().toISOString(),
				payload: {
					attemptId,
					attemptCount: attemptNumber,
					attemptScore,
					assessmentScore,
					highestAssessmentScore: highestAssessmentScoreRecord.score,
					ltiScoreSent,
					ltiScoreStatus,
					ltiStatusDetails,
					ltiGradeBookStatus,
					assessmentScoreId,
					ltiAssessmentScoreId,
					scoreDetails,
					imported: originalAttemptId !== null,
					originalAttemptId,
					originalScoreId
				},
				visitId,
				userId: user.id,
				ip: remoteAddress,
				metadata: {},
				draftId: draftDocument.draftId,
				contentId: draftDocument.contentId,
				eventVersion: '2.2.0',
				isPreview: isPreview
			})
		})
}

const insertAttemptInvalidatedEvent = (
	attemptId,
	userId,
	visitId,
	draftId,
	contentId,
	remoteAddress,
	isPreview
) => {
	insertEvent({
		action: 'assessment:attemptInvalidated',
		actorTime: new Date().toISOString(),
		payload: { attemptId },
		userId,
		ip: remoteAddress,
		visitId,
		metadata: {},
		draftId,
		contentId,
		eventVersion: '1.0.0',
		isPreview
	})
}

module.exports = {
	insertAttemptEndEvents,
	insertAttemptScoredEvents,
	insertAttemptInvalidatedEvent
}
