const router = require('express').Router()
const config = oboRequire('config')
const ltiLaunch = oboRequire('express_lti_launch')
const { requireCanViewEditor } = oboRequire('express_validators')

// LTI Instructions
// mounted as /lti/
router.route('/').get((req, res) => {
	const protocol = req.protocol
	const hostname = req.get('host')
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
router.route('/config.xml').get((req, res) => {
	res.type('xml')
	const protocol = req.protocol
	const hostname = req.get('host')
	const viewParams = {
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
router
	.route('/canvas/course_navigation')
	.post([ltiLaunch.courseNavlaunch, requireCanViewEditor])
	.post((req, res) => res.redirect('/editor'))

// route /lti/canvas/resource_selection moved to obojobo-module-selector
// route /lti/canvas/editor_button moved to obojobo-module-selector

module.exports = router
