const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const { requireCanViewEditor, requireCurrentDocument } = oboRequire('express_validators')

const displayEditorPicker = (req, res) => {
	return db
		.any(
			`   SELECT DISTINCT draft_id as "draftId",
					last_value(created_at) OVER wnd as "createdAt",
					last_value(id) OVER wnd as "latestVersion",
					last_value(content) OVER wnd as "content",
					last_value(xml) OVER wnd as "xml"
				FROM drafts_content
				WHERE draft_id IN (
					SELECT id
					FROM drafts
					WHERE deleted = FALSE
					AND user_id = $[userId]
				)
				WINDOW wnd AS (
					PARTITION BY draft_id ORDER BY created_at
					ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
				)
				ORDER BY "draftId" desc`,
			{
				userId: req.currentUser.id
			}
		)
		.then(drafts => {
			res.render('editor_picker', { drafts })
		})
		.catch(res.unexpected)
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
