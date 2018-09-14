const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const { requireCanViewEditor } = oboRequire('express_validators')

const displayEditor = (req, res) => {
	return db
		.any(
			`
				SELECT DISTINCT draft_id as "draftId",
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
				ORDER BY "draftId" desc
			`,
			{
				userId: req.currentUser.id
			}
		)
		.then(drafts => {
			res.render('editor', { drafts: drafts })
		})
		.catch(res.unexpected)
}

// Display the Document Editor
// mounted as /editor
router
	.route('/')
	.get(requireCanViewEditor)
	.get(displayEditor)

module.exports = router
