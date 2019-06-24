const express = require('express')
const router = express.Router()
const RepositoryGroup = require('../models/group')
const DraftSummary = require('../models/draft_summary')
const {
	checkValidationRules,
	requireDraftId
} = require('obojobo-express/express_validators')


router.get('/library', (req, res) => {
	const publicLibGroupId = '00000000-0000-0000-0000-000000000000'
	const facts = [
		{ title: 'Your Modules', value: 22 },
		{ title: 'Open Modules', value: 235 },
		{ title: 'Private Modules', value: 789 },
	]

	return RepositoryGroup
		.fetchById(publicLibGroupId)
		.then(group => {
			return group.loadRelatedDrafts()
		})
		.then(group => {
			const props = {
				groups: [group],
				page: 1,
				pageCount: 1,
				facts
			}
			res.render('library.jsx', props)
		})
		.catch(res.unexpected)
})

router
	.route('/library/:draftId')
	.get([requireDraftId, checkValidationRules])
	.get((req, res) => {
		return DraftSummary.fetchById(req.params.draftId)
			.then(module => {
				const props = {
					module,
					user:{
						name: 'Ian Turgeon'
					},
					facts: [
						{title: 'Rating', value: 4.2},
						{title: 'Views', value: 102},
						{title: 'Revisions', value: module.revisionCount}
					]
				}
				res.render('module-page.jsx', props)
			})
			.catch(res.unexpected)
	})

module.exports = router
