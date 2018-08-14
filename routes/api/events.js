const express = require('express')
const router = express.Router()
const oboEvents = oboRequire('obo_events')
const insertEvent = oboRequire('insert_event')
const VisitModel = oboRequire('models/visit')
const createCaliperEvent = require('./events/create_caliper_event')
const logger = oboRequire('logger')

// Create A New Event
// mounted as /api/events
router.post('/', (req, res, next) => {
	let currentUser = null
	let currentDocument = null
	let currentVisit = null

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			return VisitModel.fetchById(req.body.visitId)
		})
		.then(visit => {
			currentVisit = visit
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument

			// add data to the event
			const event = req.body.event

			const caliperEvent = createCaliperEvent(req)

			const insertObject = {
				actorTime: event.actor_time,
				action: event.action,
				userId: currentUser.id,
				eventVersion: event.event_version,
				ip: req.connection.remoteAddress,
				metadata: {},
				isPreview: currentVisit.is_preview,
				payload: event.payload,
				draftId: currentDocument.draftId,
				contentId: currentDocument.contentId,
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
		.catch(err => {
			logger.error(err)
			res.notAuthorized(err)
		})
})

module.exports = router
