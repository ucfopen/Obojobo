let express = require('express')
let router = express.Router()
let config = oboRequire('config')
const { requireCanViewEditor } = oboRequire('express_validators')
let ltiLaunch = oboRequire('express_lti_launch')

// LTI Instructions
// mounted as /lti/
router.get('/', (req, res, next) => {
	let hostname = config.general.hostname
	res.render('lti_launch_static', {
		title: 'Obojobo LTI Launch',
		xml_url: `https://${hostname}/lti/config.xml`,
		launch_url: `https://${hostname}/lti`,
		course_navigation_url: `https://${hostname}/lti/canvas/course_navigation`,
		assignment_selection_url: `https://${hostname}/lti/canvas/resource_selection`,
		keys: Object.keys(config.lti.keys)
	})
})

// LTI Configuration
// mounted as /lti/config.xml
router.get('/config.xml', (req, res, next) => {
	res.type('xml')

	let hostname = config.general.hostname
	let viewParams = {
		title: 'Obojobo Next',
		description: 'Advanced Learning Modules',
		domain: hostname.split(':')[0],
		launch_url: `https://${hostname}/lti`,
		icon: `https://${hostname}/picker/obojobo-editor-icon.png`,
		canvas_course_navigation_url: `https://${hostname}/lti/canvas/course_navigation`,
		canvas_resource_selection_url: `https://${hostname}/lti/canvas/resource_selection`,
		canvas_editor_button_url: `https://${hostname}/lti/canvas/editor_button`
	}
	res.render('lti_config_xml', viewParams)
})

// Canvas LMS Course Navigation launch
// mounted as /lti/canvas/course_navigation
router
	.route('/canvas/course_navigation')
	.post(ltiLaunch.courseNavlaunch)
	.post(requireCanViewEditor)
	.post((req, res, next) => res.redirect('/editor'))


// this is an array because we want to add
// the lit launch assignmentSelection middleware
// to all times this is executed
let showModuleSelector = [
	ltiLaunch.assignmentSelection,
	requireCanViewEditor,
	(req, res, next) => {
		try {
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
		} catch (error) {
			next(error)
		}
	}
]

// mounted as /lti/canvas/resource_selection
router.post('/canvas/resource_selection', showModuleSelector)
// mounted as /lti/canvas/editor_button
router.post('/canvas/editor_button', showModuleSelector)

module.exports = router
