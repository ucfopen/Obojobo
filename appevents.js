var rp = require('request-promise');

module.exports = {
  register: (app) => {
    let cdb = app.locals.cdb
    // THIS SHOULD PROBABLY BE MOVED
    app.on('oboevent:saveState', event => {
      event._id = event.user + ':' + event.draft_id + ':' + event.draft_rev

      let getRequest = {
        uri: cdb + '/view_state/'+event._id,
        method: 'GET',
        json: true
      }

      // create
      rp(getRequest)
      .then( body => {
        event._rev = body._rev
        let putRequest = {
          uri: cdb + '/view_state/'+event._id,
          method: 'PUT',
          json: true,
          body: event
        }

        // create
        rp(putRequest)
        .then( body => {
          console.log('state saved', body);
        })
        .catch( err => {
          console.log('ERROR', err)
        })

      })
      .catch( err => {

        let postRequest = {
          uri: cdb + '/view_state',
          method: 'POST',
          json: true,
          body: event
        }

        // create
        rp(postRequest)
        .then( body => {
          console.log('state saved', body);
        })
        .catch( err => {
          console.log('ERROR', err)
        })

      })

    });
  }
}
