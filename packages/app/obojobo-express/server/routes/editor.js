const express = require('express')
const router = express.Router()
const mediaConfig = oboRequire('server/config').media
const { requireCanViewEditor, requireCurrentDocument } = oboRequire('server/express_validators')
const { assetForEnv, webpackAssetPath } = oboRequire('server/asset_resolver')
const allowedUploadTypes = mediaConfig.allowedMimeTypesRegex
	.split('|')
	.map(i => `.${i}`)
	.join(',')
// Display the visual editor
// mounted as /editor/draftId/page
router
	.route('/visual|classic/:draftId/:page?')
	.get([requireCanViewEditor, requireCurrentDocument])
	.get((req, res) => {
		res.render('editor', { settings: { allowedUploadTypes }, assetForEnv, webpackAssetPath })
	})

module.exports = router
