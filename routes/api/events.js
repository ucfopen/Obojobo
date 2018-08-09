const express = require('express')
const router = express.Router()
const oboEvents = oboRequire('obo_events')
const insertEvent = oboRequire('insert_event')
const VisitModel = oboRequire('models/visit')
const createCaliperEvent = require('./events/create_caliper_event')
const logger = oboRequire('logger')
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
			isPreview: req.currentVisit.is_preview,
			payload: event.payload,
			draftId: req.currentDocument.draftId,
			contentId: req.currentDocument.contentId,
			caliperPayload: caliperEvent
		}

		return insertEvent(insertObject)
			.then(result => {
				insertObject.createdAt = result.created_at
				oboEvents.emit(`client:${event.action}`, insertObject, req)
				res.success(caliperEvent)
			})
			.catch(res.unexpected)
	})

module.exports = router
