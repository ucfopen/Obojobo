var express = require('express')
var router = express.Router()
var oboEvents = oboRequire('obo_events')
var insertEvent = oboRequire('insert_event')
var createCaliperEvent = require('./events/create_caliper_event')
let logger = oboRequire('logger')
const { checkValidation, requireEvent, requireCurrentUser } = oboRequire('express_validators')

// Create A New Event
// mounted as /api/events
router
	.route('/')
	.post([requireEvent, checkValidation, requireCurrentUser])
	.post((req, res, next) => {
		// add data to the event
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
			draftId: event.draft_id,
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
				// @TODO change to call next(err)
				res.unexpected(err)
			})
	})

module.exports = router
