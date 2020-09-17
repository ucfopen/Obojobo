const createCaliperEvent = require('obojobo-express/server/routes/api/events/create_caliper_event')
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
	const { createAssessmentAttemptSubmittedEvent } = createCaliperEvent(null, hostname)
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
		isPreview: isPreview,
		caliperPayload: createAssessmentAttemptSubmittedEvent({
			actor: { type: 'user', id: userId },
			draftId,
			contentId,
			assessmentId,
			attemptId,
			extensions: {
				attemptCount: attemptNumber,
				imported: originalAttemptId !== null,
				originalAttemptId,
				originalScoreId
			}
		})
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
	const { createAssessmentAttemptScoredEvent } = createCaliperEvent(null, hostname)

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
				isPreview: isPreview,
				caliperPayload: createAssessmentAttemptScoredEvent({
					actor: { type: 'serverApp' },
					draftId: draftDocument.draftId,
					contentId: draftDocument.contentId,
					assessmentId,
					attemptId: attemptId,
					attemptScore,
					extensions: {
						attemptCount: attemptNumber,
						attemptScore,
						assessmentScore,
						highestAssessmentScore: highestAssessmentScoreRecord.score,
						ltiScoreSent,
						imported: originalAttemptId !== null,
						originalAttemptId,
						originalScoreId
					}
				})
			})
		})
}

module.exports = {
	insertAttemptEndEvents,
	insertAttemptScoredEvents
}
