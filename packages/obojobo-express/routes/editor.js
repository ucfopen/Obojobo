var express = require('express')
var router = express.Router()
var db = require('../db')

let displayEditor = (req, res, next) => {
	return req
		.getCurrentUser(true)
		.then(user => {
			if (user.isGuest()) {
				return Promise.reject(new Error('Login Required'))
			}
			if (!user.canViewEditor) {
				return next()
			}

			// query the latest drafts w/ content for this user
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
						userId: user.id
					}
				)
				.then(drafts => {
					res.render('editor', { drafts: drafts })
				})
		})
		.catch(error => {
			next(error)
		})
}

// Display the Document Editor
// mounted as /editor
router.post('/', displayEditor)
router.get('/', displayEditor)

module.exports = router
