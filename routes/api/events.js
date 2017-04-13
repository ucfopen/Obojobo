var express = require('express');
var app = express();
var oboEvents = oboRequire('obo_events')
var insertEvent = oboRequire('insert_event')

app.post('/', (req, res, next) => {
	req.requireCurrentUser()
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

		insertEvent(insertObject)
		.then( result => {
			insertObject.createdAt = result.created_at;
			oboEvents.emit(`client:${event.action}`, insertObject, req);
			res.success({ createdAt:result.created_at });
			next();
		})
		.catch( error => {
			res.unexpected(error);
			next();
		})
	})

})

module.exports = app;
