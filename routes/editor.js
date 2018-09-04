const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const { requireCanViewEditor, requireCurrentDocument } = oboRequire('express_validators')

const displayEditorPicker = (req, res) => {
	return db
		.any(
			`
			SELECT DISTINCT ON (draft_id)
				draft_id AS "draftId",
				id AS "latestVersion",
				created_at AS "createdAt",
				content,
				xml
			FROM drafts_content
			WHERE draft_id IN (
				SELECT id
				FROM drafts
				WHERE deleted = FALSE
				AND user_id = $[userId]
			)
			ORDER BY draft_id, created_at desc
			`,
			{
				userId: req.currentUser.id
			}
		)
		.then(drafts => {
			res.render('editor_picker', { drafts, draftTitle: 'Editor' })
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
	.post([requireCanViewEditor, requireCurrentDocument])
	.post(displayVisualEditor)
// .catch(e => console.log('what it ', e))

module.exports = router
