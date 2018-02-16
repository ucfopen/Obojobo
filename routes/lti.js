let express = require('express')
let router = express.Router()
let config = oboRequire('config')

// LTI Instructions
router.get('/', (req, res, next) => {
	let hostname = config.general.hostname
	res.render('lti_launch_static', {
		title: 'Obojobo LTI Launch',
		xml_url: `https://${hostname}/lti/config.xml`,
		launch_url: `https://${hostname}/lti`,
		course_navigation_url: `https://${hostname}/lti/canvas/course_navigation`,
		assignment_selection_url: `https://${hostname}/lti/canvas/assignment_selection`,
		consumer_key: Object.keys(config.lti.keys)[0]
	})
})

// LTI Configuration
router.get('/config.xml', (req, res, next) => {
	res.type('xml')

	let hostname = config.general.hostname
	let viewParams = {
		title: 'Obojobo Next',
		description: 'Advanced Learning Modules',
		domain: hostname.split(":")[0],
		launch_url: `https://${hostname}/lti`,
		course_navigation_url: `https://${hostname}/lti/canvas/course_navigation`,
		assignment_selection_url: `https://${hostname}/lti/canvas/assignment_selection`
	}
	res.render('lti_config_xml', viewParams)
})

router.post('/canvas/course_navigation', (req, res, next) => {
	return req.getCurrentUser(true)
	.then(user => {
		if(user.canViewEditor){
			res.redirect('/editor')
		}
		else{
			res.redirect('/')
		}
	})
	.catch(error => {
		next(error)
	})
})

router.post('/canvas/assignment_selection', (req, res, next) => {
	return req.getCurrentUser(true)
	.then(user => {
		let returnUrl = (req.lti && req.lti.body && req.lti.body.content_item_return_url ? req.lti.body.content_item_return_url : null)
		res.render('lti_picker', { returnUrl })
	})
	.catch(error => {
		next(error)
	})
})

module.exports = router
