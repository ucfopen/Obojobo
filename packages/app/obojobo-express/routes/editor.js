const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const { requireCanViewEditor, requireCurrentDocument } = oboRequire('express_validators')

const displayEditorPicker = (req, res) => {
	return res.render('editor_picker')
}

const displayVisualEditor = (req, res) => {
	res.render('editor')
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
