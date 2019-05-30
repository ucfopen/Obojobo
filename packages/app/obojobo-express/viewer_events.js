const db = oboRequire('db')
const oboEvents = oboRequire('obo_events')
const viewerState = oboRequire('viewer/viewer_state')

// @TODO: Enable this when we're able to restore the user to their last page
// oboEvents.on('client:nav:lock', (event, req) => {
// 	setNavLocked(event.userId, event.draftId, true)
// })

// oboEvents.on('client:nav:unlock', (event, req) => {
// 	setNavLocked(event.userId, event.draftId, false)
// })

oboEvents.on('client:nav:open', event => {
	setNavOpen(event.userId, event.draftId, event.contentId, true)
})

oboEvents.on('client:nav:close', event => {
	setNavOpen(event.userId, event.draftId, event.contentId, false)
})

oboEvents.on('client:nav:toggle', event => {
	setNavOpen(event.userId, event.draftId, event.contentId, event.payload.open)
})

oboEvents.on('client:nav:redAlert', event => {
	db.none(
			`
			INSERT INTO red_alert_status
				(user_id, draft_id, red_alert)
				VALUES ($[userId], $[draftId], $[redAlert])
			ON CONFLICT (user_id, draft_id) DO
			UPDATE
			SET
				red_alert = $[redAlert]
			WHERE red_alert_status.user_id = $[userId]
				AND red_alert_status.draft_id = $[draftId]
			`,
			{
				userId: event.userId,
				draftId: event.draftId,
				redAlert: event.payload.redAlert,
			}
		)
		.catch(error => console.log('catch()', error))

})

const setNavOpen = (userId, draftId, contentId, value) => {
	viewerState.set(userId, draftId, contentId, 'nav:isOpen', 1, value)
}

// @TODO: Enable this when we're able to restore the user to their last page
// function setNavLocked(userId, draftId, value) {
// 	viewerState.set(userId, draftId, 'nav:isLocked', 1, value)
// }

module.exports = (req, res, next) => {
	next()
}
