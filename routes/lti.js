let express = require('express');
let router = express.Router();
let db = oboRequire('db');
let User = oboRequire('models/user');
let ltiLaunch = oboRequire('lti_launch')

router.get('/whoami', (req, res, next) => {

	req.getCurrentUser(false)
	.then(currentuser => {
		console.log('__________________________', req.session.STUPID_VALUE)
		let msg = `Hello ${currentuser.username}!`
		res.send(msg);
		next()
	})
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
	req.session.STUPID_VALUE = 5
	let baseUrl = `${req.protocol}://${req.host}:${req.app.get('port')}`
	res.render('lti_launch_static.pug', {launch_url: `${baseUrl}/lti/launch`, xml_url: `${baseUrl}/lti/config.xml`});
	next()
})

router.post('/launch', (req, res, next) => {
	if(!req.lti){
		// we attempted to launch again and failed, so clear the lti data from the session
		if (req.session.lti) {
			req.session.lti = null
		}
		res.status(401).render('error.pug', {message: 'Access Denied', error: {status: 'Invalid LTI launch request'}, stack:null });
		return next()
	}

	let user = new User({
		username: req.lti.body.lis_person_sourcedid,
		email: req.lti.body.lis_person_contact_email_primary,
		firstName: req.lti.body.lis_person_name_given,
		lastName: req.lti.body.lis_person_name_family,
		roles: req.lti.body.roles
	});


	user.saveOrCreate()
	.then( result => {
		req.setCurrentUser(user)
		req.getCurrentUser()
		.then(currentUser => {
			res.render('lti_launch.pug', {title: 'go', user: currentUser});
			console.log('USER LOGGED IN', currentUser.username, req.session.currentUserId )
			next()
		})
	})
	.catch( error => {
		console.log('new, failure', error)
		res.render('error.pug', {message: 'ERROR', error: {status: 'There was a problem creating your account.'}});
		next()
	})

})

module.exports = router;
