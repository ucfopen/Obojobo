const express = require('express')
const router = express.Router()
const assetForEnv = require('obojobo-express/asset_resolver').assetForEnv
const RepositoryGroup = require('../models/group')

router.get('/library', (req, res) => {

	const facts = [
		{ title: 'Your Modules', value: 22 },
		{ title: 'Open Modules', value: 235 },
		{ title: 'Private Modules', value: 789 },
	]

	return RepositoryGroup
		.fetchById('00000000-0000-0000-0000-000000000000')
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

module.exports = router
