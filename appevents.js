var rp = require('request-promise');
var db = require('./db.js')

module.exports = {
  register: (app) => {
    // THIS SHOULD PROBABLY BE MOVED
    app.on('client:saveState', event => {
      // console.log('SAVE STATE');
      // console.log(event);
      event._id = event.user + ':' + event.draft_id + ':' + event.draft_rev

      // upsert, created_at, updated_at
      db.none("INSERT INTO view_state (actortime, action, actor, ip, metadata, payload) VALUES(${actorTime}, ${action}, ${actor}, ${ip}, ${metadata}, ${payload})", event)
      .then( result => res.json({eventId:'body.id'}) )
      .catch( error => res.status(404).json({error:'Draft not found'}))
    });

    // let eventSetResponse = 'oboevent:question:setResponse'
    // app.on(eventSetResponse, (event, req, res) => {
    //   // check perms
    //   // check input
    //   if(!event.payload.attemptId)  return app.logError(eventSetResponse, 'Missing Attempt ID', req, event)
    //   if(!event.payload.questionId) return app.logError(eventSetResponse, 'Missing Question ID', req, event)
    //   if(!event.payload.response)   return app.logError(eventSetResponse, 'Missing Response', req, event)

    //   // insert
    //   db
    //     .none(`
    //       INSERT INTO attempt_question_responses (attempt_id, question_id, response)
    //       VALUES($1, $2, $3)
    //       ON CONFLICT (attempt_id, question_id) DO
    //       UPDATE
    //       SET response = $3, updated_at = now()
    //       WHERE attempt_question_responses.attempt_id = $1
    //       AND attempt_question_responses.question_id = $2`
    //     , [event.payload.attemptId, event.payload.questionId, event.payload.response])
    //     .catch( error => {
    //       app.logError(eventSetResponse, 'DB UNEXPECTED', req, error, error.toString());
    //     })
    // });
  }
}
