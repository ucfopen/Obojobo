var router = require('../../router.js');
var db = require('../../db.js')

router.post('/', (req, res, next) => {
  // check perms

  // check input

  // add data to the event
  let event = req.body.event

  let insertObject = {
    actorTime: event.actor_time,
    action: event.action,
    userId: 4, // @TODO: set actor correctly
    ip: (req.headers['x-forwarded-for'] || req.connection.remoteAddress),
    metadata: {},
    payload: event.payload
  }

  console.log('INSERT OBJECT', insertObject, insertObject.actorTime)

  db
    .one(
      "INSERT INTO events(actor_time, action, actor, ip, metadata, payload) VALUES (${actorTime}, ${action}, ${userId}, ${ip}, ${metadata}, ${payload}) RETURNING created_at", insertObject
    , insertObject)
    .then( result => {
      insertObject.createdAt = result.created_at
      // console.log('>>>>>>>>APP EMIT', event.action)
      // console.log(req.app.eventNames())
      req.app.emit('client:' + event.action, insertObject, req, db);
      res.success({ createdAt:result.created_at })
    })
    .catch( error => res.unexpected(error.toString()))

})


module.exports = router;
