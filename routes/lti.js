var express = require('express');
var router = express.Router();
var db = require('../db.js')

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
    res.status(401).render('error.pug', {message: 'Access Denied', error: {status: 'Invalid LTI launch request'}, stack:null });
    return
  }

  let user = {
    consumer: req.lti.body.tool_consumer_instance_guid,
    username: req.lti.body.lis_person_sourcedid,
    email: req.lti.body.lis_person_contact_email_primary,
    first_name: req.lti.body.lis_person_name_given,
    last_name: req.lti.body.lis_person_name_family,
    roles: req.lti.body.roles
  }

  db.none(`
    INSERT INTO users
      (consumer, username, email, first_name, last_name, roles)
      VALUES($[consumer], $[username], $[email], $[first_name], $[last_name], $[roles])
    ON CONFLICT (consumer, username) DO UPDATE SET
      email = $[email],
      first_name = $[first_name],
      last_name = $[last_name],
      roles = $[roles]
    `, user)
  .then( result =>  res.render('lti_launch.pug', user) )
  .catch( error => {
    console.log('new, failure', error)
    res.render('error.pug', {message: 'ERROR', error: {status: 'There was a problem storing your new account.'}});
  })

})

module.exports = router;
