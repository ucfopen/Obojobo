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

  db
    .one(
      "INSERT INTO events(actor_time, action, actor, ip, metadata, payload) VALUES (${actorTime}, ${action}, ${userId}, ${ip}, ${metadata}, ${payload}) RETURNING created_at", insertObject
    , insertObject)
    .then( result => {
      insertObject.createdAt = result.created_at
      req.app.emit('client:' + event.action, insertObject, req, db);
      res.success({ createdAt:result.created_at })
      next();
    })
    .catch( error => {
      res.unexpected(error)
      next()
    })

})


module.exports = router;
