const express = require('express')
const router = express.Router()
const { webpackAssetPath } = require('obojobo-express/server/asset_resolver')
const {
	requireCurrentUser,
	requireCanViewAdminPage
} = require('obojobo-express/server/express_validators')

// Admin page
// mounted as /admin
// NOTE: is an isomorphic react page
router
	.route('/admin')
	.get([requireCurrentUser, requireCanViewAdminPage])
	.get((req, res) => {
		const props = {
			title: 'Admin',
			currentUser: req.currentUser,
			// must use webpackAssetPath for all webpack assets to work in dev and production!
			appCSSUrl: webpackAssetPath('admin.css'),
			appJsUrl: webpackAssetPath('admin.js')
		}
		res.render('pages/page-admin-server.jsx', props)
	})

module.exports = router
