let DraftNode = oboRequire('models/draft_node')
let db = oboRequire('db')
let express = require('express')
let app = express()

class Assessment extends DraftNode {
	static getCompletedAssessmentAttemptHistory(
		userId,
		draftId,
		assessmentId,
		includePreviewAttempts
	) {
		let previewSql = includePreviewAttempts ? '' : 'AND preview = FALSE'

		return db.manyOrNone(
			`
				SELECT
					id AS "attemptId",
					created_at as "startTime",
					completed_at as "endTime",
					assessment_id as "assessmentId",
					state,
					result
				FROM attempts
				WHERE
					user_id = $[userId]
					AND draft_id = $[draftId]
					AND assessment_id = $[assessmentId]
					AND completed_at IS NOT NULL
					${previewSql}
				ORDER BY completed_at DESC`,
			{ userId: userId, draftId: draftId, assessmentId: assessmentId }
		)
	}

	static getNumberAttemptsTaken(userId, draftId, assessmentId) {
		return db
			.one(
				`
				SELECT
					COUNT(*)
				FROM attempts
				WHERE
					user_id = $[userId]
					AND draft_id = $[draftId]
					AND assessment_id = $[assessmentId]
					AND completed_at IS NOT NULL
					AND preview = false
			`,
				{ userId: userId, draftId: draftId, assessmentId: assessmentId }
			)
			.then(result => {
				return parseInt(result.count, 10)
			})
	}

	// @TODO: most things touching the db should end up in models. figure this out
	static getAttemptHistory(userId, draftId) {
		return db.manyOrNone(
			`
				SELECT
					id AS "attemptId",
					created_at as "startTime",
					completed_at as "endTime",
					assessment_id as "assessmentId",
					state,
					result
				FROM attempts
				WHERE
					user_id = $[userId]
					AND draft_id = $[draftId]
					AND preview = FALSE
				ORDER BY completed_at DESC`,
			{ userId: userId, draftId: draftId }
		)
	}

	static insertNewAttempt(userId, draftId, assessmentId, state, isPreview) {
		return db.one(
			`
				INSERT INTO attempts (user_id, draft_id, assessment_id, state, preview)
				VALUES($[userId], $[draftId], $[assessmentId], $[state], $[isPreview])
				RETURNING
				id AS "attemptId",
				created_at as "startTime",
				completed_at as "endTime",
				assessment_id as "assessmentId",
				state,
				result
			`,
			{
				userId: userId,
				draftId: draftId,
				assessmentId: assessmentId,
				state: state,
				isPreview: isPreview
			}
		)
	}

	// @TODO: most things touching the db should end up in models. figure this out
	static updateAttempt(result, attemptId) {
		return db.one(
			`
				UPDATE attempts
				SET
					completed_at = now(),
					result = $[result]
				WHERE id = $[attemptId]
				RETURNING
					id AS "attemptId",
					created_at as "startTime",
					completed_at as "endTime",
					assessment_id as "assessmentId",
					state,
					result
			`,
			{ result: result, attemptId: attemptId }
		)
	}

	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'internal:sendToClient': this.onSendToClient,
			'internal:renderViewer': this.onRenderViewer
		})
	}

	onSendToClient(req, res) {
		return this.yell('ObojoboDraft.Sections.Assessment:sendToClient', req, res)
	}

	onRenderViewer(req, res, oboGlobals) {
		return req
			.requireCurrentUser()
			.then(currentUser => {
				return this.constructor.getAttemptHistory(currentUser.id, req.params.draftId)
			})
			.then(attemptHistory => {
				oboGlobals.set('ObojoboDraft.Sections.Assessment:attemptHistory', attemptHistory)
				return Promise.resolve()
			})
			.catch(err => {
				return Promise.reject(err)
			})
	}
}

module.exports = Assessment
