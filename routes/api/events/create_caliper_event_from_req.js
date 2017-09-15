//@TODO
//Need a way to generate a Response from an assessment:setResponse but I don't know the ID of the insert on attempts_question_responses
//don't like the fact that there's question:setResponse and assessment:setResponse
//the setting of the actor seems very haphazard
//should all of these be in one file?

let caliperEvents = require('./create_caliper_event')

module.exports = (req, currentUser) => {
	let clientEvent = req.body.event

	console.log('hey so', clientEvent.action)

	switch (clientEvent.action) {
		case 'nav:goto':
		case 'nav:gotoPath':
		case 'nav:prev':
		case 'nav:next':
			return caliperEvents.createNavigationEvent(
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.from,
				clientEvent.payload.to,
				{ navType: clientEvent.action.split(':')[1], internalName: clientEvent.action }
			)

		case 'question:view':
			return caliperEvents.createViewEvent(
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.questionId
			)

		case 'question:hide':
			return caliperEvents.createHideEvent(
				caliperEvents.ACTOR_USER,
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.questionId
			)

		case 'question:checkAnswer':
			return caliperEvents.createPracticeQuestionSubmittedEvent(
				caliperEvents.ACTOR_USER,
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.questionId
			)

		case 'question:showExplanation':
			return caliperEvents.createViewEvent(
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.questionId,
				'explanation'
			)

		case 'question:hideExplanation':
			return caliperEvents.createHideEvent(
				caliperEvents.ACTOR_USER, //@TODO
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.questionId,
				'explanation'
			)

		case 'question:setResponse':
		case 'assessment:setResponse':
			return caliperEvents.createAssessmentItemEvent(
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.questionId,
				clientEvent.payload.assessmentId,
				clientEvent.payload.attemptId
			)

		case 'score:set':
			return caliperEvents.createPracticeGradeEvent(
				caliperEvents.ACTOR_VIEWER_CLIENT,
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.itemId,
				clientEvent.payload.id,
				clientEvent.payload.score
			)

		case 'score:clear':
			return caliperEvents.createPracticeUngradeEvent(
				caliperEvents.ACTOR_SERVER_APP,
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.itemId,
				clientEvent.payload.id
			)

		case 'question:retry':
			return caliperEvents.createPracticeQuestionResetEvent(
				caliperEvents.ACTOR_USER,
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.questionId
			)

		case 'viewer:inactive':
			return caliperEvents.createViewerAbandonedEvent(req, currentUser, clientEvent.draft_id, {
				type: 'inactive',
				lastActiveTime: clientEvent.payload.lastActiveTime,
				inactiveDuration: clientEvent.payload.inactiveDuration
			})

		case 'viewer:returnFromInactive':
			return caliperEvents.createViewerResumedEvent(req, currentUser, clientEvent.draft_id, {
				type: 'returnFromInactive',
				lastActiveTime: clientEvent.payload.lastActiveTime,
				inactiveDuration: clientEvent.payload.inactiveDuration,
				relatedEventId: clientEvent.payload.relatedEventId
			})

		case 'viewer:open':
			return caliperEvents.createViewerSessionLoggedInEvent(req, currentUser, clientEvent.draft_id)

		case 'viewer:close':
			return caliperEvents.createViewerSessionLoggedOutEvent(req, currentUser, clientEvent.draft_id)

		case 'viewer:leave':
			return caliperEvents.createViewerAbandonedEvent(req, currentUser, clientEvent.draft_id, {
				type: 'leave'
			})

		case 'viewer:return':
			return caliperEvents.createViewerResumedEvent(req, currentUser, clientEvent.draft_id, {
				type: 'return',
				relatedEventId: clientEvent.payload.relatedEventId
			})
	}

	return null
}
