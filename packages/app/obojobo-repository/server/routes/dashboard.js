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
			.then(myModules => {
				const props = {
					title: 'Dashboard',
					myModules,
					currentUser: req.currentUser
				}
				res.render('page-dashboard-server.jsx', props)
			})

})

module.exports = router
