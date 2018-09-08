let express = require('express')
let router = express.Router()
let config = oboRequire('config')

// LTI Instructions
// mounted as /lti/
router.get('/', (req, res, next) => {
	let protocol = req.protocol
	let hostname = req.get('host')
	// let hostname = config.general.hostname
	res.render('lti_launch_static', {
		title: 'Obojobo LTI Launch',
		xml_url: `${protocol}://${hostname}/lti/config.xml`,
		launch_url: `${protocol}://${hostname}/lti`,
		course_navigation_url: `${protocol}://${hostname}/lti/canvas/course_navigation`,
		assignment_selection_url: `${protocol}://${hostname}/lti/canvas/assignment_selection`,
		keys: Object.keys(config.lti.keys)
	})
})

// LTI Configuration
// mounted as /lti/config.xml
router.get('/config.xml', (req, res, next) => {
	res.type('xml')

	let protocol = req.protocol
	let hostname = req.get('host')
	let viewParams = {
		title: 'Obojobo Next',
		description: 'Advanced Learning Modules',
		domain: hostname.split(':')[0],
		launch_url: `${protocol}://${hostname}/lti`,
		icon: `${protocol}://${hostname}/picker/obojobo-editor-icon.png`,
		canvas_course_navigation_url: `${protocol}://${hostname}/lti/canvas/course_navigation`,
		canvas_resource_selection_url: `${protocol}://${hostname}/lti/canvas/resource_selection`,
		canvas_editor_button_url: `${protocol}://${hostname}/lti/canvas/editor_button`
	}
	res.render('lti_config_xml', viewParams)
})

// Canvas LMS Course Navigation launch
// mounted as /lti/canvas/course_navigation
router.post('/canvas/course_navigation', (req, res, next) => {
	return req
		.getCurrentUser(true)
		.then(user => {
			if (!user.canViewEditor) {
				res.status(403).send('Unauthorized') //@TODO
				return
			}

			res.redirect('/editor')
		})
		.catch(error => {
			next(error)
		})
})

let showModuleSelector = (req, res, next) => {
	return req
		.getCurrentUser(true)
		.then(user => {
			if (!user.canViewEditor) {
				res.status(403).send('Unauthorized') //@TODO
				return
			}

			let returnUrl = null
			let isAssignment = false
			if (req.lti && req.lti.body) {
				returnUrl = req.lti.body.content_item_return_url
					? req.lti.body.content_item_return_url
					: null
				returnUrl = req.lti.body.ext_content_return_url
					? req.lti.body.ext_content_return_url
					: returnUrl

				if (req.lti.body.ext_lti_assignment_id) {
					isAssignment = true
				}
			}

			if (returnUrl === null) {
				throw 'Unknown return url for assignment selection'
			}

			res.render('lti_picker', { returnUrl, isAssignment })
		})
		.catch(error => {
			next(error)
		})
}

router.post('/canvas/resource_selection', showModuleSelector)
router.post('/canvas/editor_button', showModuleSelector)
router.post('/canvas/assignment_selection', showModuleSelector)

module.exports = router
