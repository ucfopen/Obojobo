const express = require('express')
const router = express.Router()
const oboEvents = oboRequire('obo_events')
const insertEvent = oboRequire('insert_event')
const createCaliperEvent = require('./events/create_caliper_event')
const logger = oboRequire('logger')
const {
	checkValidationRules,
	requireCurrentDocument,
	requireEvent,
	requireCurrentUser
} = oboRequire('express_validators')

// Create A New Event
// mounted as /api/events
router
	.route('/')
	.post([requireCurrentUser, requireCurrentDocument, requireEvent, checkValidationRules])
	.post((req, res, next) => {
		const event = req.body.event
		const caliperEvent = createCaliperEvent(req)

		const insertObject = {
			actorTime: event.actor_time,
			action: event.action,
			userId: req.currentUser.id,
			eventVersion: event.event_version,
			ip: req.connection.remoteAddress,
			metadata: {},
			payload: event.payload,
			draftId: req.currentDocument.id,
			contentId: req.currentDocument.contentId,
			caliperPayload: caliperEvent
		}

		return insertEvent(insertObject)
			.then(result => {
				insertObject.createdAt = result.created_at
				oboEvents.emit(`client:${event.action}`, insertObject, req)
				res.success(caliperEvent)
			})
			.catch(err => {
				logger.error('Insert Event Failure:', err)
				res.unexpected(err)
			})
	})

module.exports = router
