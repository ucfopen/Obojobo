var express = require('express');
var app = express();

var insertEvent = oboRequire('insert_event')
var getIp = oboRequire('get_ip')

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
			ip: getIp(req),
			metadata: {},
			payload: event.payload
		}

		insertEvent(insertObject)
		.then( result => {
			insertObject.createdAt = result.created_at;
			global.oboEvents.emit(`client:${event.action}`, insertObject, req);
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
