const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const { requireCanViewEditor } = oboRequire('express_validators')

let displayEditor = (req, res, next) => {
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
			ORDER BY draft_id, id desc
			`,
			{
				userId: req.currentUser.id
			}
		)
		.then(drafts => {
			res.render('editor', { drafts: drafts })
		})
		.catch(error => {
			next(error)
		})
}

// Display the Document Editor
// mounted as /editor
router
	.route('/')
	.all(requireCanViewEditor)
	.post(displayEditor)
	.get(displayEditor)

module.exports = router
