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
				{ navType: clientEvent.action.split(':')[1] }
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
			console.log('how it goin')
			return caliperEvents.createHideEvent(
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
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.itemId,
				clientEvent.payload.id,
				clientEvent.payload.score
			)

		case 'score:clear':
			return caliperEvents.createPracticeUngradeEvent(
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.itemId,
				clientEvent.payload.id
			)

		case 'question:retry':
			return caliperEvents.createPracticeQuestionResetEvent(
				req,
				currentUser,
				clientEvent.draft_id,
				clientEvent.payload.id
			)

		// case 'viewer:inactive':
		// 	return caliperEvents.createViewerAbandonedEvent(req, currentUser, clientEvent.draft_id, {
		// 		type: 'inactive',
		// 		lastActiveTime: clientEvent.payload.lastActiveTime,
		// 		inactiveDuration: clientEvent.payload.inactiveDuration
		// 	})

		case 'viewer:returnFromInactive':
			return caliperEvents.createViewerResumedEvent(req, currentUser, clientEvent.draft_id, {
				type: 'returnFromInactive',
				lastActiveTime: clientEvent.payload.lastActiveTime,
				inactiveDuration: clientEvent.payload.inactiveDuration
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
				type: 'return'
			})
	}

	return null
}
