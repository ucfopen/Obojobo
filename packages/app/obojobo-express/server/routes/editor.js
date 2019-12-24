const express = require('express')
const router = express.Router()
const mediaConfig = oboRequire('config').media
const { requireCanViewEditor, requireCurrentDocument } = oboRequire('express_validators')
const { assetForEnv, webpackAssetPath } = oboRequire('asset_resolver')
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
