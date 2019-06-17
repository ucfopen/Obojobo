const express = require('express')
const router = express.Router()
const assetForEnv = require('obojobo-express/asset_resolver').assetForEnv

router.get('/library', (req, res) => {
	const props = {
		popularModules: [
			{ id: 'sports', title: 'Sports Therapy' },
			{ id: 'pottery', title: 'Advanced 3d Pottery' },
			{ id: 'gravity', title: 'Gravitational Forces' },
			{ id: 'religion', title: 'World Religions' },
			{ id: 'hacker', title: 'Computer Science' },
			{ id: 'sports', title: 'Sports Therapy' },
			{ id: 'pottery', title: 'Advanced 3d Pottery' },
			{ id: 'gravity', title: 'Gravitational Forces' },
			{ id: 'religion', title: 'World Religions' },
			{ id: 'hacker', title: 'Computer Science' },
		],
		newModules: [
			{ id: 'sports', title: 'Sports Therapy' },
			{ id: 'pottery', title: 'Advanced 3d Pottery' },
			{ id: 'gravity', title: 'Gravitational Forces' },
		],
		updatedModules: [
			{ id: 'pottery', title: 'Advanced 3d Pottery' },
			{ id: 'gravity', title: 'Gravitational Forces' },
			{ id: 'religion', title: 'World Religions' },
			{ id: 'hacker', title: 'Computer Science' },
			{ id: 'sports', title: 'Sports Therapy' },
		],
		facts: [
			{ title: 'Your Modules', value: 22 },
			{ title: 'Open Modules', value: 235 },
			{ title: 'Private Modules', value: 789 },
		]
	}
	res.render('library.jsx', props)
})

module.exports = router
