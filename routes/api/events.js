var express = require('express');
var router = express.Router();
var db = require('../../db.js')

router.post('/', (req, res, next) => {
  // check perms

  // check input

  // add data to the event
  let event = req.body.event

  let insertObject = {
    actorTime: event.actorTime,
    action: event.action,
    actor: 4, // @TODO: set actor correctly
    ip: (req.headers['x-forwarded-for'] || req.connection.remoteAddress),
    metadata: {},
    payload: event.payload
  }

  db.none("INSERT INTO events (actortime, action, actor, ip, metadata, payload) VALUES(${actorTime}, ${action}, ${actor}, ${ip}, ${metadata}, ${payload})", insertObject)
  .then( result => res.json({eventId:'body.id'}) )
  .catch( error => res.status(404).json({error:'Draft not found'}))

})


module.exports = router;
