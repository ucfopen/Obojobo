const express = require('express')
const router = express.Router()
const DraftSummary = require('../models/draft_summary')
const { requireCurrentUser, requireCanViewDrafts } = require('obojobo-express/express_validators')

// Home page
// mounted as /
router
	.route('/dashboard')
	.get([requireCurrentUser, requireCanViewDrafts])
	.get((req, res) => {
		return DraftSummary
			.fetchByUserId(req.currentUser.id)
			.then(drafts => {
				const props = {
					title: 'Dashboard',
					myModules: drafts,
					facts: [
						{ title: 'Modules', value: 12 },
						{ title: 'Students', value: 196 },
						{ title: 'Courses', value: 7 },
						{ title: 'Assignments', value: 23 },
					],
					currentUser: req.currentUser
				}
				res.render('dashboard-server-view.jsx', props)
			})

})

module.exports = router
