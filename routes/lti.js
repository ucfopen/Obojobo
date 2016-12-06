var express = require('express');
var router = express.Router();
var rp = require('request-promise');

var cdb = 'http://localhost:5984'

/* GET users listing. */
router.get('/', (req, res, next) => {
  req.session.gunk = 5
  console.log(req.session)
  if (req.session.currentUser) {
    res.send(req.session.currentUser.username + ", you've logged in with lti!");
  }
  else{
    res.send("I have no idea who you are");
  }
});

router.get('/config.xml', (req, res, next) => {
  res.type('xml')
  let viewParams = {
    title:'Obojobo 3',
    description:'value',
    launch_url:'value',
    platform:'value',
    domain:'value',
    grade_passback:'value',
    privacy_level:'value',
    picker_url:'value'
  }
  res.render('lti_config_xml.mustache', viewParams);
});

router.all('/launch', (req, res, next) => {
  if(!req.lti){
    // we attempted to launch again and failed, so clear the lti data from the session
    if (req.session.lti) {
      req.session.lti = null
    }
    res.status(401)
    res.render('error.pug', {message: 'Access Denied', error: {status: 'Invalid LTI launch request'}, stack:null });
    return
  }

  let user = {
    _id: req.lti.body.tool_consumer_instance_guid + ':' + req.lti.body.lis_person_sourcedid,
    consumerUserId: req.lti.body.lis_person_sourcedid,
    consumerId: req.lti.body.tool_consumer_instance_guid,
    username: req.lti.username,
    email: req.lti.lis_person_contact_email_primary,
    firstName: req.lti.lis_person_name_given,
    lastName: req.lti.lis_person_name_family,
    roles: req.lti.body.roles,
    created: new Date().toISOString()
  }

  let getRequest = {
    uri: cdb + '/users/' + user._id,
    method: 'GET',
    json: true
  }

  rp(getRequest) // user exists?
  .then( user => {
    req.session.currentUser = user
    req.session.lti = null
    res.render('lti_launch.pug', user)
  })
  .catch( () => {
    // couldnt get the user, make one!
    let insertRequest = {
      uri: cdb + '/users/',
      method: 'POST',
      json: true,
      body: user
    }

    rp(insertRequest)
    .then( body => {
      user._id = body.id
      user._rev = body.rev
      req.session.currentUser = user
      req.session.lti = null
      res.render('lti_launch.pug', user);
    })
    .catch( err => {
      console.log('new, failure', err)
      res.render('error.pug', {message: 'ERROR', error: {status: 'There was a problem storing your new account.'}});
    })
  })

})

module.exports = router;
