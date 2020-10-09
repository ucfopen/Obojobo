const express = require('express')
const router = express.Router()
const oboEvents = oboRequire('server/obo_events')
const insertEvent = oboRequire('server/insert_event')
const createCaliperEvent = require('./events/create_caliper_event')
const {
	checkValidationRules,
	requireCurrentDocument,
	requireEvent,
	requireCurrentUser,
	requireCurrentVisit
} = oboRequire('server/express_validators')

// Create A New Event
// mounted as /api/events
router
	.route('/')
	.post([
		requireCurrentUser,
		requireCurrentVisit,
		requireCurrentDocument,
		requireEvent,
		checkValidationRules
	])
	.post((req, res) => {
		const event = req.body.event
		const caliperEvent = createCaliperEvent(req)
		const insertObject = {
			actorTime: event.actor_time,
			action: event.action,
			userId: req.currentUser.id,
			eventVersion: event.event_version,
			ip: req.connection.remoteAddress,
			metadata: {},
			isPreview: req.currentVisit.is_preview,
			payload: event.payload,
			draftId: req.currentDocument.draftId,
			contentId: req.currentDocument.contentId,
			visitId: req.currentVisit.id,
			caliperPayload: caliperEvent
		}

		return insertEvent(insertObject)
			.then(result => {
				insertObject.createdAt = result.created_at
				oboEvents.emit(`client:${event.action}`, insertObject, req)
				if (event.action === 'question:setResponse') {
					// throw 'bugger!'
				}
				res.success(caliperEvent)
			})
			.catch(res.unexpected)
	})

module.exports = router
