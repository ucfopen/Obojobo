const express = require('express')
const router = express.Router()
const oboEvents = oboRequire('obo_events')
const insertEvent = oboRequire('insert_event')
const insertCaliperEvent = oboRequire('insert_caliper_event')
const createCaliperEvent = require('./events/create_caliper_event')
const {
	checkValidationRules,
	requireCurrentDocument,
	requireEvent,
	requireCurrentUser,
	requireCurrentVisit
} = oboRequire('express_validators')

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
	.post(async (req, res) => {
		const eventId = null
		const event = req.body.event
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
			contentId: req.currentDocument.contentId
		}

		try {
			const createdEvent = await insertEvent(insertObject)
			req.body.event = createdEvent
			console.log('ce', createdEvent)
			const caliperEvent = createCaliperEvent(req, createdEvent)
			if (caliperEvent) {
				await insertCaliperEvent({
					caliperPayload: caliperEvent,
					isPreview: req.currentVisit.is_preview
				})
			}

			oboEvents.emit(`client:${event.action}`, createdEvent, req)

			res.success(caliperEvent)
		} catch (e) {
			res.unexpected(e)
		}
	})

module.exports = router
