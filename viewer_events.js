let oboEvents = oboRequire('obo_events')
let viewerState = oboRequire('viewer/viewer_state')

// @TODO: Enable this when we're able to restore the user to their last page
// oboEvents.on('client:nav:lock', (event, req) => {
// 	setNavLocked(event.userId, event.draftId, true)
// })

// oboEvents.on('client:nav:unlock', (event, req) => {
// 	setNavLocked(event.userId, event.draftId, false)
// })

oboEvents.on('client:nav:open', (event, req) => {
	setNavOpen(event.userId, event.draftId, true)
})

oboEvents.on('client:nav:close', (event, req) => {
	setNavOpen(event.userId, event.draftId, false)
})

oboEvents.on('client:nav:toggle', (event, req) => {
	setNavOpen(event.userId, event.draftId, event.payload.open)
})

const setNavOpen = (userId, draftId, value) => {
	viewerState.set(userId, draftId, 'nav:isOpen', 1, value)
}

// @TODO: Enable this when we're able to restore the user to their last page
// function setNavLocked(userId, draftId, value) {
// 	viewerState.set(userId, draftId, 'nav:isLocked', 1, value)
// }

module.exports = (req, res, next) => {
	next()
}
