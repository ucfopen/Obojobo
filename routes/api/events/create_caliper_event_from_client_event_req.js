const { ACTOR_USER, ACTOR_VIEWER_CLIENT, ACTOR_SERVER_APP } = require('./caliper_constants')
const { getSessionIds } = require('./caliper_utils')

module.exports = req => {
	const caliperEvents = require('./create_caliper_event')(req, null, true)
	const currentUser = req.currentUser || { id: null }
	const currentDocument = req.currentDocument || { draftId: null, contentId: null }
	const clientEvent = req.body.event
	let sessionId, launchId
	const sessionIds = getSessionIds(req.session)

	const actorFromType = type => {
		const actor = { type }
		if (type === ACTOR_USER) actor.id = currentUser.id
		return actor
	}

	switch (clientEvent.action) {
		case 'nav:goto':
		case 'nav:gotoPath':
		case 'nav:prev':
		case 'nav:next':
			return caliperEvents.createNavigationEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				from: clientEvent.payload.from,
				to: clientEvent.payload.to,
				sessionIds,
				extensions: {
					navType: clientEvent.action.split(':')[1],
					internalName: clientEvent.action
				}
			})

		case 'nav:open':
			return caliperEvents.createNavMenuShowedEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds,
				extensions: {
					navType: clientEvent.action.split(':')[1],
					internalName: clientEvent.action
				}
			})

		case 'nav:close':
			return caliperEvents.createNavMenuHidEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds,
				extensions: {
					navType: clientEvent.action.split(':')[1],
					internalName: clientEvent.action
				}
			})

		case 'nav:toggle':
			return caliperEvents.createNavMenuToggledEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds,
				extensions: {
					navType: clientEvent.action.split(':')[1],
					internalName: clientEvent.action,
					isOpen: clientEvent.payload.open
				}
			})

		case 'nav:lock':
			return caliperEvents.createNavMenuDeactivatedEvent({
				actor: actorFromType(ACTOR_VIEWER_CLIENT),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds,
				extensions: {
					navType: clientEvent.action.split(':')[1],
					internalName: clientEvent.action
				}
			})

		case 'nav:unlock': {
			return caliperEvents.createNavMenuActivatedEvent({
				actor: actorFromType(ACTOR_VIEWER_CLIENT),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds,
				extensions: {
					navType: clientEvent.action.split(':')[1],
					internalName: clientEvent.action
				}
			})
		}

		case 'question:view':
			return caliperEvents.createViewEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				itemId: clientEvent.payload.questionId,
				sessionIds
			})

		case 'question:hide':
			return caliperEvents.createHideEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				itemId: clientEvent.payload.questionId,
				sessionIds
			})

		case 'question:checkAnswer':
			return caliperEvents.createPracticeQuestionSubmittedEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				questionId: clientEvent.payload.questionId,
				sessionIds
			})

		case 'question:showExplanation':
			return caliperEvents.createViewEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				itemId: clientEvent.payload.questionId,
				frameName: 'explanation',
				sessionIds
			})

		case 'question:hideExplanation':
			return caliperEvents.createHideEvent({
				actor: actorFromType(clientEvent.payload.actor),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				itemId: clientEvent.payload.questionId,
				frameName: 'explanation',
				sessionIds
			})

		case 'question:setResponse':
		case 'assessment:setResponse':
			return caliperEvents.createAssessmentItemEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				questionId: clientEvent.payload.questionId,
				assessmentId: clientEvent.payload.assessmentId,
				attemptId: clientEvent.payload.attemptId,
				selectedTargets: clientEvent.payload.response,
				targetId: clientEvent.payload.targetId,
				sessionIds
			})

		case 'score:set':
			return caliperEvents.createPracticeGradeEvent({
				actor: actorFromType(ACTOR_VIEWER_CLIENT),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				questionId: clientEvent.payload.itemId,
				scoreId: clientEvent.payload.id,
				score: clientEvent.payload.score,
				sessionIds
			})

		case 'score:clear':
			return caliperEvents.createPracticeUngradeEvent({
				actor: actorFromType(ACTOR_SERVER_APP),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				questionId: clientEvent.payload.itemId,
				scoreId: clientEvent.payload.id,
				sessionIds
			})

		case 'question:retry':
			return caliperEvents.createPracticeQuestionResetEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				questionId: clientEvent.payload.questionId,
				sessionIds
			})

		case 'media:show':
			return caliperEvents.createViewEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				itemId: clientEvent.payload.id,
				sessionIds
			})

		case 'media:hide':
			return caliperEvents.createHideEvent({
				actor: actorFromType(clientEvent.payload.actor),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				itemId: clientEvent.payload.id,
				sessionIds
			})

		case 'media:setZoom':
			return caliperEvents.createMediaChangedSizeEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				mediaId: clientEvent.payload.id,
				sessionIds,
				extensions: {
					type: 'setZoom',
					zoom: clientEvent.payload.zoom,
					previousZoom: clientEvent.payload.previousZoom
				}
			})

		case 'media:resetZoom':
			return caliperEvents.createMediaChangedSizeEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				mediaId: clientEvent.payload.id,
				sessionIds,
				extensions: {
					type: 'resetZoom',
					previousZoom: clientEvent.payload.previousZoom
				}
			})

		case 'viewer:inactive':
			return caliperEvents.createViewerAbandonedEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds,
				extensions: {
					type: 'inactive',
					lastActiveTime: clientEvent.payload.lastActiveTime,
					inactiveDuration: clientEvent.payload.inactiveDuration
				}
			})

		case 'viewer:returnFromInactive':
			return caliperEvents.createViewerResumedEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds,
				extensions: {
					type: 'returnFromInactive',
					lastActiveTime: clientEvent.payload.lastActiveTime,
					inactiveDuration: clientEvent.payload.inactiveDuration,
					relatedEventId: clientEvent.payload.relatedEventId
				}
			})

		case 'viewer:close':
			return caliperEvents.createViewerSessionLoggedOutEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds
			})

		case 'viewer:leave':
			return caliperEvents.createViewerAbandonedEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds,
				extensions: {
					type: 'leave'
				}
			})

		case 'viewer:return':
			return caliperEvents.createViewerResumedEvent({
				actor: actorFromType(ACTOR_USER),
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
				sessionIds,
				extensions: {
					type: 'return',
					relatedEventId: clientEvent.payload.relatedEventId
				}
			})
	}
	return null
}
