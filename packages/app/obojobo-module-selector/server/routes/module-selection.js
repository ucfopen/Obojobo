const router = require('express').Router()
const ltiLaunch = require('obojobo-express/express_lti_launch')
const { requireCanViewEditor } = require('obojobo-express/express_validators')

const showModuleSelector = (req, res) => {
	try {
		let returnUrl = null // REQUIRED: will hold the return url sent via LTI
		let isAssignment = false // In Canvas, this can be an assignment or a content module
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
