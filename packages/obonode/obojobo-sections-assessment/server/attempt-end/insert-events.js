const createCaliperEvent = require('obojobo-express/server/routes/api/events/create_caliper_event')
const insertEvent = require('obojobo-express/server/insert_event')
const lti = require('obojobo-express/server/lti')

const insertAttemptEndEvents = (
	user,
	draftDocument,
	assessmentId,
	attemptId,
	attemptNumber,
	isPreview,
	hostname,
	remoteAddress
) => {
	const { createAssessmentAttemptSubmittedEvent } = createCaliperEvent(null, hostname)
	return insertEvent({
		action: 'assessment:attemptEnd',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId,
			attemptCount: attemptNumber
		},
		userId: user.id,
		ip: remoteAddress,
		metadata: {},
		draftId: draftDocument.draftId,
		contentId: draftDocument.contentId,
		eventVersion: '1.1.0',
		isPreview,
		caliperPayload: createAssessmentAttemptSubmittedEvent({
			actor: { type: 'user', id: user.id },
			draftId: draftDocument.draftId,
			contentId: draftDocument.contentId,
			assessmentId,
			attemptId
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
	resourceLinkId
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
					scoreDetails
				},
				userId: user.id,
				ip: remoteAddress,
				metadata: {},
				draftId: draftDocument.draftId,
				contentId: draftDocument.contentId,
				eventVersion: '2.0.0',
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
						ltiScoreSent
					}
				})
			})
		})
}

const insertAttemptImportedEvents = (
	userId,
	draftId,
	contentId,
	assessmentId,
	attemptId,
	scoreId,
	originalAttemptId,
	originalScoreId,
	isPreview,
	ltiScoreSent,
	ltiScoreStatus,
	ltiStatusDetails,
	ltiGradeBookStatus,
	ltiAssessmentScoreId,
	hostname,
	remoteAddress,
	resourceLinkId
) => {
	const { createAssessmentAttemptImportedEvent } = createCaliperEvent(null, hostname)
	return insertEvent({
		action: 'assessment:attemptEnd',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId,
			attemptCount: 1,
			originalScoreId,
			originalAttemptId,
			resourceLinkId
		},
		userId,
		ip: remoteAddress,
		metadata: {},
		draftId,
		contentId,
		eventVersion: '1.1.0',
		isPreview,
		caliperPayload: createAssessmentAttemptImportedEvent({
			actor: { type: 'user', id: userId },
			draftId,
			contentId,
			assessmentId,
			attemptId,
			originalScoreId,
			originalAttemptId,
			resourceLinkId
		})
	})
}

module.exports = {
	insertAttemptEndEvents,
	insertAttemptScoredEvents,
	insertAttemptImportedEvents
}
