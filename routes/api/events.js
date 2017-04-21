var express = require('express');
var router = express.Router();
var oboEvents = oboRequire('obo_events')
var insertEvent = oboRequire('insert_event')

router.post('/', (req, res, next) => {
	let insertObject
	let event = req.body.event
	return req.requireCurrentUser()
	.then(currentUser => {
		// check input

		insertObject = {
			actorTime: event.actor_time,
			action: event.action,
			userId: currentUser.id,
			ip: req.connection.remoteAddress,
			metadata: {},
			payload: event.payload,
			draftId: event.draft_id
		}

		return insertEvent(insertObject)
	})
	.then(result => {
		insertObject.createdAt = result.created_at;
		oboEvents.emit(`client:${event.action}`, insertObject, req);
		res.success({ createdAt:result.created_at });
		return next();
	})
	.catch(err => {
		console.log(err)
		res.unexpected(err);
		next(); // dont pass error here
		return Promise.reject(err)
	})

})

module.exports = router;
