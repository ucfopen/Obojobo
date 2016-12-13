var express = require('express');
var router = express.Router();
var rp = require('request-promise');

var cdb = 'http://localhost:5984'

///

router.post('/', (req, res, next) => {
  // check perms

  // check input

  // add data to the event
  let event = req.body.event
  event.source = "client"
  event.serverTime = new Date().toISOString()
  event.user = "4",
  event.ip =  req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // store event
  let postRequest = {
    uri: cdb + '/events',
    method: 'POST',
    json: true,
    body: event
  }

  rp(postRequest)
  .then( body => {
    event._id = body.id
    req.app.emit('oboevent:' + event.action, event);
    res.json({eventId:body.id});
  })
  .catch( err => {
    console.log(err)
    res.status(500).json({error:'Error saving event'});
  })

});


module.exports = router;
