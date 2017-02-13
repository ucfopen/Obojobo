var rp = require('request-promise');
var db = require('./db.js')

module.exports = {
  register: (app) => {
    // THIS SHOULD PROBABLY BE MOVED
    app.on('client:saveState', event => {
      event._id = event.user + ':' + event.draft_id + ':' + event.draft_rev

      // upsert, created_at, updated_at
      db.none("INSERT INTO view_state(user_id, metadata, payload) VALUES(${userId}, ${metadata}, ${payload})", event)
      .then( (result) => {
        return true
      })
      .catch( (error) => {
        console.log(error);
        res.error(404).json({error:'Draft not found'})
      })
    });
  }
}
