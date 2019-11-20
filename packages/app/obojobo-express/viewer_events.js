const oboEvents = oboRequire('obo_events')
const viewerState = oboRequire('viewer/viewer_state')
const VisitModel = oboRequire('models/visit')

oboEvents.on('client:nav:open', event => {
	return setNavOpen(event.userId, event.draftId, event.contentId, true, event.visitId)
})

oboEvents.on('client:nav:close', event => {
	return setNavOpen(event.userId, event.draftId, event.contentId, false, event.visitId)
})

oboEvents.on('client:nav:redAlert', event => {
	return viewerState.setRedAlert(
		event.userId,
		event.draftId,
		event.contentId,
		event.createdAt,
		event.payload.redAlert
	)
})

const setNavOpen = (userId, draftId, contentId, value, visitId) => {
	return VisitModel.fetchById(visitId).then(visit => {
		viewerState.set(userId, draftId, contentId, 'nav:isOpen', 1, value, visit.resource_link_id)
	})
}

module.exports = (req, res, next) => {
	next()
}
