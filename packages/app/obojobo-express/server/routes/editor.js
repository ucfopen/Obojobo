const express = require('express')
const router = express.Router()
const { general: generalConfig, media: mediaConfig } = oboRequire('server/config')
const { idleMinutes, warnMinutes, autoExpireMinutes } = generalConfig.editLocks
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
		const options = {
			settings: {
				allowedUploadTypes,
				editLocks: {
					idleMinutes: parseFloat(idleMinutes),
					warnMinutes: parseFloat(warnMinutes),
					autoExpireMinutes: parseFloat(autoExpireMinutes)
				}
			},
			assetForEnv,
			webpackAssetPath
		}
		res.render('editor', options)
	})

module.exports = router
