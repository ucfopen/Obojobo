var express = require('express');
var app = express();

var db = require('../../db.js')

app.post('/', (req, res, next) => {
  // check perms
  let currentUser = req.requireCurrentUser();
  // check input

  // add data to the event
  let event = req.body.event

  let insertObject = {
    actorTime: event.actor_time,
    action: event.action,
    userId: currentUser.id, // @TODO: set actor correctly
    ip: (req.headers['x-forwarded-for'] || req.connection.remoteAddress),
    metadata: {},
    payload: event.payload
  }

  db.one(
    "INSERT INTO events(actor_time, action, actor, ip, metadata, payload) VALUES (${actorTime}, ${action}, ${userId}, ${ip}, ${metadata}, ${payload}) RETURNING created_at", insertObject
    , insertObject
  )
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

module.exports = app;
