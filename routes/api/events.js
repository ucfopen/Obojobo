var express = require('express')
var router = express.Router()
var oboEvents = oboRequire('obo_events')
var insertEvent = oboRequire('insert_event')
let logger = oboRequire('logger')

router.post('/', (req, res, next) => {
	return req
		.requireCurrentUser()
		.then(currentUser => {
			// check input

			// add data to the event
			let event = req.body.event

			let insertObject = {
				actorTime: event.actor_time,
				action: event.action,
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				payload: event.payload,
				draftId: event.draft_id
			}

			return insertEvent(insertObject)
				.then(result => {
					insertObject.createdAt = result.created_at
					oboEvents.emit(`client:${event.action}`, insertObject, req)
					res.success({ createdAt: result.created_at })
				})
				.catch(err => {
					logger.error('Insert Event Failure:', err)
					// @TODO change to call next(err)
					res.unexpected(err)
				})
		})
		.catch(err => {
			logger.error(err)
			// @TODO change to call next(err)
			res.notAuthorized(err)
		})
})

module.exports = router
