const express = require('express')
const router = express.Router()
const logger = oboRequire('logger')
const db = oboRequire('db')

router.get('/student/:userId', (req, res, next) => {
	logger.warn('data api has received request')

	return res.success({ butts: true })
})

router.get('/module/drafts/:userId', (req, res, next) => {
	if (!req.params.userId) return res.unexpected('draftId not defined')

	let userId = req.params.userId

	db
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
				userId: userId
			}
		)
		.then(drafts => {
			return res.success({ userId: drafts })
		})

	// db.any(`
	// 	SELECT
	// 		id,
	// 		user_id
	// 	FROM
	// 		drafts
	// 	WHERE
	// 		user_id = $[userId]
	// 	LEFT JOIN
	// 		drafts_content
	// 	ON
	// 		drafts.id = drafts_content.draft_id
	// `)
})

router.get('/module/score/details/:draftId', (req, res, next) => {
	if (!req.params.draftId) return res.unexpected('draftId not defined')

	let draftId = req.params.draftId

	db
		.any(
			`
		SELECT 
			user_id,
			score,
			score_details
		FROM
			assessment_scores
		WHERE
			draft_id = $[draftId]
	`,
			{
				draftId: draftId
			}
		)
		.then(scores => {
			return res.success({ draftId: scores })
		})
})

module.exports = router
