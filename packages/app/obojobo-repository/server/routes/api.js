const router = require('express').Router()
const RepositoryGroup = require('../models/group')
const DraftSummary = require('../models/draft_summary')
const { requireCanViewDrafts, requireCurrentUser } = require('obojobo-express/express_validators')

// List public drafts
router
	.route('/drafts-public')
	.get((req, res) => {
		const publicLibGroupId = '00000000-0000-0000-0000-000000000000'
		return RepositoryGroup
			.fetchById(publicLibGroupId)
			.then(group => {
				return group.loadRelatedDrafts()
			})
			.then(group => {
				res.success(group.drafts)
			})
			.catch(res.unexpected)
	})

// List my drafts
// mounted as /api/drafts
router
	.route('/drafts')
	.get([requireCurrentUser, requireCanViewDrafts])
	.get((req, res) => {
		return DraftSummary
			.fetchWhere(`drafts.user_id = $[userId]`, { userId: req.currentUser.id })
			.then(res.success)
			.catch(res.unexpected)
	})

module.exports = router
