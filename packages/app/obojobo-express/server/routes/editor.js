const express = require('express')
const router = express.Router()
const oboEvents = require('../obo_events')
const { general: generalConfig, media: mediaConfig } = oboRequire('server/config')
const { isTrueParam } = oboRequire('server/util/is_true_param')
const {
	idleTimeUntilReleaseLockMinutes,
	idleTimeUntilWarningMinutes,
	dbLockDurationMinutes
} = generalConfig.editLocks
const { assetForEnv, webpackAssetPath } = oboRequire('server/asset_resolver')
const {
	check,
	requireCanViewEditor,
	requireCurrentDocument,
	checkValidationRules,
	requireDraftWritable
} = oboRequire('server/express_validators')
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
		requireDraftWritable,
		requireCurrentDocument,
		check('revision_id')
			.optional()
			.isUUID(4),
		checkValidationRules
	])
	.get((req, res) => {
		// allow modules to provide editor settings
		// Example:
		// oboEvents.on('EDITOR_SETTINGS', event => { event.moduleSettings.obojoboChunksSample = {var: value}})
		const moduleSettings = {}
		oboEvents.emit('EDITOR_SETTINGS', { moduleSettings })

		const options = {
			settings: {
				allowedUploadTypes,
				readOnly: isTrueParam(req.query.read_only),
				revisionId: req.query.revision_id || '',
				moduleSettings,
				editLocks: {
					idleTimeUntilReleaseLockMinutes: parseFloat(idleTimeUntilReleaseLockMinutes),
					idleTimeUntilWarningMinutes: parseFloat(idleTimeUntilWarningMinutes),
					dbLockDurationMinutes: parseFloat(dbLockDurationMinutes)
				}
			},
			assetForEnv,
			webpackAssetPath
		}

		res.render('editor', options)
	})

module.exports = router
