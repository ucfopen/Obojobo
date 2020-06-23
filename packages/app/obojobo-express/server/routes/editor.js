const express = require('express')
const router = express.Router()
const { general: generalConfig, media: mediaConfig } = oboRequire('server/config')
const { idleMinutes, warnMinutes, autoExpireMinutes } = generalConfig.editLocks
const { assetForEnv, webpackAssetPath } = oboRequire('server/asset_resolver')
const { check, requireCanViewEditor, requireCurrentDocument, checkValidationRules } = oboRequire(
	'server/express_validators'
)
const allowedUploadTypes = mediaConfig.allowedMimeTypesRegex
	.split('|')
	.map(i => `.${i}`)
	.join(',')

// Display the visual editor
// mounted as /editor/draftId/page
router
	.route('/visual/:draftId/:page?')
	.get([
		requireCanViewEditor,
		requireCurrentDocument,
		check('revision_id')
			.optional()
			.isUUID(4),
		checkValidationRules
	])
	.get((req, res) => {
		const readOnly = req.query.read_only && '' + req.query.read_only.toLowerCase()
		const options = {
			settings: {
				allowedUploadTypes,
				readOnly: readOnly === '1' || readOnly === 'true',
				revisionId: req.query.revision_id || '',
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
