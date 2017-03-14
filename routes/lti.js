var express = require('express');
var router = express.Router();
var db = oboRequire('db.js')
var User = oboRequire('models/user')

router.get('/whoami', (req, res, next) => {
	req.session.gunk = 5
	if (req.session.currentUser) {
		res.send(`Hello ${req.session.currentUser.username}!`);
	}
	else{
		res.send("I have no idea who you are");
	}
	next()
});

router.get('/config.xml', (req, res, next) => {
	res.type('xml')
	let viewParams = {
		title:'Obojobo 3',
		description:'description_value',
		launch_url:'launch_url_value',
		platform:'platform_value',
		domain:'domain_value',
		grade_passback:'grade_passback_value',
		privacy_level:'privacy_level_value',
		picker_url:'picker_url_value'
	}
	res.render('lti_config_xml.pug', viewParams);
	next()
});

router.get('/launch', (req, res, next) => {
	let baseUrl = `${req.protocol}://${req.host}:${req.app.get('port')}`
	res.render('lti_launch_static.pug', {launch_url: `${baseUrl}/lti/launch`, xml_url: `${baseUrl}/lti/config.xml`});
	next()
})

router.post('/launch', (req, res, next) => {
	console.log('LAAAUNCH')
	if(!req.lti){
		// we attempted to launch again and failed, so clear the lti data from the session
		if (req.session.lti) {
			req.session.lti = null
		}
		res.status(401).render('error.pug', {message: 'Access Denied', error: {status: 'Invalid LTI launch request'}, stack:null });
		next()
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
	.then( result => {
		res.render('lti_launch.pug', user);
		next()
	})
	.catch( error => {
		console.log('new, failure', error)
		res.render('error.pug', {message: 'ERROR', error: {status: 'There was a problem storing your new account.'}});
		next()
	})

})

module.exports = router;
