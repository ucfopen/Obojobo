const oboEvents = oboRequire('obo_events')
const viewerState = oboRequire('viewer/viewer_state')
const VisitModel = require('obojobo-express/models/visit')
const { isPurgeEnabled, purgeData } = oboRequire('util/purge_data')

// @TODO: Enable this when we're able to restore the user to their last page
// oboEvents.on('client:nav:lock', (event, req) => {
// 	setNavLocked(event.userId, event.draftId, true)
// })

// oboEvents.on('client:nav:unlock', (event, req) => {
// 	setNavLocked(event.userId, event.draftId, false)
// })

oboEvents.on('client:nav:open', event => {
	return setNavOpen(event.userId, event.draftId, event.contentId, true, event.visitId)
})

oboEvents.on('client:nav:close', event => {
	return setNavOpen(event.userId, event.draftId, event.contentId, false, event.visitId)
})

oboEvents.on('client:nav:toggle', event => {
	return setNavOpen(event.userId, event.draftId, event.contentId, event.payload.open, event.visitId)
})

const setNavOpen = (userId, draftId, contentId, value, visitId) => {
	return VisitModel.fetchById(visitId).then(visit => {
		viewerState.set(userId, draftId, contentId, 'nav:isOpen', 1, value, visit.resource_link_id)
	})
}

// if purge data mode is enabled, add a listener to events for us to execute the purge
if(isPurgeEnabled()){
	oboEvents.on('server:lti:user_launch', event => {purgeData()})
}

// @TODO: Enable this when we're able to restore the user to their last page
// function setNavLocked(userId, draftId, value) {
// 	viewerState.set(userId, draftId, 'nav:isLocked', 1, value)
// }

module.exports = (req, res, next) => {
	next()
}
