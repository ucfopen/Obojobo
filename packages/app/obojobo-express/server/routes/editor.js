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
	.route('/visual/:draftId/:page?')
	.get([requireCanViewEditor, requireCurrentDocument])
	.get((req, res) => {
		const readOnly = req.query.read_only && '' + req.query.read_only.toLowerCase()

		res.render('editor', {
			settings: {
				allowedUploadTypes,
				readOnly: readOnly === '1' || readOnly === 'true',
				revisionId: req.query.revision_id || ''
			},
			assetForEnv,
			webpackAssetPath
		})
	})

module.exports = router
