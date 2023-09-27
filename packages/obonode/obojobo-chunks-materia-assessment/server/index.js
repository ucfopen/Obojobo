const router = require('express').Router() //eslint-disable-line new-cap
const db = require('obojobo-express/server/db')
const oboEvents = require('obojobo-express/server/obo_events')

const {
	requireCurrentUser,
	requireCurrentVisit
} = require('obojobo-express/server/express_validators')

oboEvents.on('materia:ltiScorePassback', event => {
	db.none(
		`INSERT INTO external_tool_data
		(payload, user_id, visit_id, draft_content_id, node_id)
		VALUES ($[payload], $[userId], $[visitId], $[contentId], $[nodeId])`,
		event
	)
})

router
	.route('/materia-lti-score-verify')
	.get([requireCurrentUser, requireCurrentVisit])
	.get(async (req, res) => {
		await db
			.one(
				`SELECT payload
			FROM external_tool_data
			WHERE user_id = $[userId]
			AND draft_content_id = $[draftContentId]
			AND node_id = $[nodeId]
			ORDER BY created_at DESC
			LIMIT 1`,
				{
					userId: req.currentUser.id,
					draftContentId: req.currentVisit.draft_content_id,
					nodeId: req.query.nodeId
				}
			)
			.then(result => {
				res.send({
					score: result.payload.score,
					success: result.payload.success
				})
			})
	})

module.exports = router
