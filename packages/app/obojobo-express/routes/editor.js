const express = require('express')
const router = express.Router()
const mediaConfig = oboRequire('config').media
const { requireCanViewEditor, requireCurrentDocument } = oboRequire('express_validators')
const allowedUploadTypes = mediaConfig.allowedMimeTypesRegex
	.split('|')
	.map(i => `.${i}`)
	.join(',')

const displayEditorPicker = (req, res) => {
	return res.render('editor_picker')
}

const displayVisualEditor = (req, res) => {
	res.render('editor', { settings: { allowedUploadTypes } })
}

// Display the Editor Picker
// and XML Document Editor
// mounted as /editor
router
	.route('/')
	.get(requireCanViewEditor)
	.get(displayEditorPicker)

// Display the visual editor
// mounted as /editor/draftId/page
router
	.route('/:draftId/:page?')
	.get([requireCanViewEditor, requireCurrentDocument])
	.get(displayVisualEditor)

// Post to the visual editor
// mounted as /editor/draftId/page
router
	.route('/:draftId/:page?')
	.post([requireCanViewEditor, requireCurrentDocument])
	.post(displayVisualEditor)

module.exports = router
