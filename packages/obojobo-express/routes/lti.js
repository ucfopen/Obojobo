const express = require('express')
const router = express.Router()
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

const showModuleSelector = (req, res) => {
	try {
		let returnUrl = null
		let isAssignment = false
		if (req.lti && req.lti.body) {
			returnUrl = req.lti.body.content_item_return_url ? req.lti.body.content_item_return_url : null

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
		res.unexpected(error)
	}
}

// mounted as /lti/canvas/resource_selection
router
	.route('/canvas/resource_selection')
	.post([ltiLaunch.assignmentSelection, requireCanViewEditor])
	.post(showModuleSelector)

// mounted as /lti/canvas/editor_button
router
	.route('/canvas/editor_button')
	.post([ltiLaunch.assignmentSelection, requireCanViewEditor])
	.post(showModuleSelector)

module.exports = router
