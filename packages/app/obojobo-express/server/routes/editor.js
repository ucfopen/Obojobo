const express = require('express')
const router = express.Router()
const oboEvents = require('../obo_events')
const { check, requireCanViewEditor, requireCurrentDocument, checkValidationRules } = oboRequire(
	'server/express_validators'
)
const { assetForEnv, webpackAssetPath } = oboRequire('server/asset_resolver')

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

		// allow modules to provide editor settings
		// Example:
		// oboEvents.on('EDITOR_SETTINGS', event => { event.moduleSettings.obojoboChunksSample = {var: value}})
		const moduleSettings = {}
		oboEvents.emit('EDITOR_SETTINGS', { moduleSettings })

		res.render('editor', {
			settings: {
				allowedUploadTypes: '',
				readOnly: readOnly === '1' || readOnly === 'true',
				revisionId: req.query.revision_id || '',
				moduleSettings
			},
			assetForEnv,
			webpackAssetPath
		})
	})

module.exports = router
