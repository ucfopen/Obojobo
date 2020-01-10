const db = require('obojobo-express/db')

const deletePreviewScores = ({ transaction, userId, draftId, resourceLinkId }) => {
	return transaction
		.manyOrNone(
			`
			SELECT assessment_scores.id
			FROM assessment_scores
			JOIN attempts
				ON attempts.id = assessment_scores.attempt_id
			WHERE assessment_scores.user_id = $[userId]
			AND assessment_scores.draft_id = $[draftId]
			AND attempts.resource_link_id = $[resourceLinkId]
			AND assessment_scores.is_preview = true
		`,
			{ userId, draftId, resourceLinkId }
		)
		.then(assessmentScoreIdsResult => {
			const ids = assessmentScoreIdsResult.map(i => i.id)
			if (ids.length < 1) return []

			return [
				transaction.none(
					`
					DELETE FROM lti_assessment_scores
					WHERE assessment_score_id IN ($[ids:csv])
				`,
					{ ids }
				),
				transaction.none(
					`
					DELETE FROM assessment_scores
					WHERE id IN ($[ids:csv])
				`,
					{ ids }
				)
			]
		})
}

const deletePreviewAttempts = ({ transaction, userId, draftId, resourceLinkId }) => {
	return transaction
		.manyOrNone(
			`
			SELECT id
			FROM attempts
			WHERE user_id = $[userId]
			AND draft_id = $[draftId]
			AND resource_link_id = $[resourceLinkId]
			AND is_preview = true
		`,
			{ userId, draftId, resourceLinkId }
		)
		.then(attemptIdsResult => {
			const ids = attemptIdsResult.map(i => i.id)
			if (ids.length < 1) return []

			return [
				transaction.none(
					`
					DELETE FROM attempts_question_responses
					WHERE attempt_id IN ($[ids:csv])
				`,
					{ ids }
				),
				transaction.none(
					`
					DELETE FROM attempts
					WHERE id IN ($[ids:csv])
				`,
					{ ids }
				)
			]
		})
}

// deletes rows associated with this preview score from these tables:
//  attempts,
//  attempts_question_responses,
//  assessment_scores,
//  lti_assessment_scores
const deletePreviewState = (userId, draftId, resourceLinkId) => {
	return db.tx(transaction => {
		const args = {
			transaction,
			userId,
			draftId,
			resourceLinkId
		}

		return Promise.all([deletePreviewScores(args), deletePreviewAttempts(args)]).then(
			([scoreQueries, attemptQueries]) => {
				return transaction.batch(scoreQueries.concat(attemptQueries))
			}
		)
	})
}

module.exports = {
	deletePreviewState
}
