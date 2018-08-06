const express = require('express')
const router = express.Router()
const logger = oboRequire('logger')
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
			ORDER BY draft_id, created_at desc
			`,
			{
				userId: req.currentUser.id
			}
		)
		.then(drafts => {
			res.render('editor', { drafts: drafts })
		})
		.catch(error => {
			// if the error is empty for some reason -
			// make sure we have a value so next() will cause a 500
			if (!error) error = 'Server Error'
			logger.error(error)
			next(error)
		})
}

// Display the Document Editor
// mounted as /editor
router
	.route('/')
	.get(requireCanViewEditor)
	.get(displayEditor)

module.exports = router
