let express = require('express');
let router = express.Router();
let ltiLaunch = oboRequire('lti_launch')

router.get('/whoami', (req, res, next) => {
	req.getCurrentUser(false)
	.then(currentuser => {
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
	let baseUrl = `${req.protocol}://${req.host}:${req.app.get('port')}`
	res.render('lti_launch_static.pug', {launch_url: `${baseUrl}/lti/launch`, xml_url: `${baseUrl}/lti/config.xml`});
	next()
})

router.post('/launch', (req, res, next) => {
	ltiLaunch.handle(req)
	.then(user => {
		res.render('lti_launch.pug', {title: 'LTI Authorized', user: user});
		next()
	})
	.catch(err => {
		next(err)
	})
})

module.exports = router;
