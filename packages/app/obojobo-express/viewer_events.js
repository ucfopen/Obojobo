const oboEvents = oboRequire('obo_events')
const viewerState = oboRequire('viewer/viewer_state')
const db = require('obojobo-express/db')
const logger = require('obojobo-express/logger')

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

oboEvents.on('client:nav:redAlert', (event, req) => {
	const eventRecordResponse = 'client:nav:redAlert'
	return Promise.resolve()
		.then(() => {

			if (!event.payload.redAlert) throw Error('Missing Red Alert Status')

			return db.none(
				`
			INSERT INTO red_alert_status
			(user_id, draft_id, red_alert)
			VALUES($[user_id], $[draft_id], $[red_alert])
			ON CONFLICT (user_id, draft_id) DO
				UPDATE
				SET
					red_alert = $[red_alert],
					created_at = now()
				WHERE red_alert_status.user_id = $[user_id]
					AND red_alert_status.draft_id = $[draft_id]`,
				{
					user_id: event.userId,
					draft_id: event.draftId,
					red_alert: event.payload.redAlert
				}
			)
		})
		.catch(error => {
			logger.error(eventRecordResponse, req, event, error, error.toString())
		})
})

const setNavOpen = (userId, draftId, contentId, value) => {
	viewerState.set(userId, draftId, contentId, 'nav:isOpen', 1, value)
}

const setNavRedAlert = (userId, draftId, value) => {
	viewerState.set(userId, draftId, 'nav:redAlert', value)
}

// @TODO: Enable this when we're able to restore the user to their last page
// function setNavLocked(userId, draftId, value) {
// 	viewerState.set(userId, draftId, 'nav:isLocked', 1, value)
// }

module.exports = (req, res, next) => {
	next()
}
