const router = require('express').Router() //eslint-disable-line new-cap
const oboEvents = require('obojobo-express/obo_events')
const db = require('obojobo-express/db')
const Assessment = require('./assessment')
const lti = require('obojobo-express/lti')
const logger = require('obojobo-express/logger')
const { startAttempt } = require('./attempt-start')
const resumeAttempt = require('./attempt-resume')
const endAttempt = require('./attempt-end/attempt-end')
const AssessmentScore = require('./models/assessment-score')
const { reviewAttempt } = require('./attempt-review')
const { logAndRespondToUnexpected } = require('./util')
const {
	requireCurrentDocument,
	requireCurrentVisit,
	requireAttemptId,
	requireCurrentUser,
	requireAssessmentId
} = require('obojobo-express/express_validators')

router
	.route('/api/lti/state/draft/:draftId')
	.get([requireCurrentDocument, requireCurrentVisit, requireCurrentUser])
	.get((req, res) =>
		lti
			.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId(
				req.currentUser.id,
				req.currentDocument.draftId,
				req.currentVisit.resource_link_id
			)
			.then(res.success)
	)

router
	.route('/api/lti/send-assessment-score')
	.post([requireCurrentVisit, requireCurrentUser, requireCurrentDocument, requireAssessmentId])
	.post(async (req, res) => {
		try {
			logger.info(
				`API sendAssessmentScore with userId="${req.currentUser.id}", draftId="${
					req.currentDocument.draftId
				}", assessmentId="${req.body.assessmentId}"`
			)
			const ltiScoreResult = await lti.sendHighestAssessmentScore(
				req.currentUser.id,
				req.currentDocument,
				req.body.assessmentId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id
			)

			res.success({
				score: ltiScoreResult.scoreSent,
				status: ltiScoreResult.status,
				statusDetails: ltiScoreResult.statusDetails,
				dbStatus: ltiScoreResult.dbStatus,
				gradebookStatus: ltiScoreResult.gradebookStatus
			})
		} catch (e) {
			logAndRespondToUnexpected('Unexpected error starting a new attempt', res, req, e)
		}
	})

// @TODO: break startAttempt out so it doesn't need req, res
router
	.route('/api/assessments/attempt/start')
	.post([requireCurrentUser, requireCurrentVisit, requireCurrentDocument, requireAssessmentId])
	.post(startAttempt)

router
	.route('/api/assessments/attempt/:attemptId/resume')
	.post([requireCurrentUser, requireCurrentDocument, requireCurrentVisit, requireAttemptId])
	.post(async (req, res) => {
		try {
			const attempt = await resumeAttempt(
				req.currentUser,
				req.currentVisit,
				req.currentDocument,
				req.params.attemptId,
				req.hostname,
				req.connection.remoteAddress
			)

			res.success(attempt)
		} catch (error) {
			logAndRespondToUnexpected('Unexpected error resuming your attempt', res, req, error)
		}
	})

router
	.route('/api/assessments/attempt/:attemptId/end')
	.post([requireCurrentVisit, requireCurrentUser, requireCurrentDocument, requireAttemptId])
	.post((req, res) => {
		return endAttempt(req, res)
			.then(res.success)
			.catch(error =>
				logAndRespondToUnexpected('Unexpected error completing your attempt', res, req, error)
			)
	})

// @TODO make sure i own
// seems like attemptid should be in the url and swithc to get?
router
	.route('/api/assessments/attempt/review')
	.post([requireCurrentUser, requireAttemptId])
	.post(async (req, res) => {
		const questionModels = await reviewAttempt(req.body.attemptIds)
		res.send(questionModels)
	})

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

router
	.route('/api/assessments/clear-preview-scores')
	.post([requireCurrentUser, requireCurrentVisit, requireCurrentDocument])
	.post((req, res) => {
		if (!req.currentVisit.is_preview) return res.notAuthorized('Not in preview mode')

		return db
			.tx(transaction => {
				const args = {
					transaction,
					userId: req.currentUser.id,
					draftId: req.currentDocument.draftId,
					resourceLinkId: req.currentVisit.resource_link_id
				}

				return Promise.all([deletePreviewScores(args), deletePreviewAttempts(args)]).then(
					([scoreQueries, attemptQueries]) => {
						return transaction.batch(scoreQueries.concat(attemptQueries))
					}
				)
			})
			.then(() => res.success())
			.catch(error => {
				logAndRespondToUnexpected('Unexpected error clearing preview scores', res, req, error)
			})
	})

router
	.route('/api/assessments/:draftId/:assessmentId/import-score')
	.post([requireCurrentUser, requireCurrentDocument, requireCurrentVisit, requireAssessmentId])
	.post(async (req, res) => {
		try{
			// load the AssessmentScore to import
			const originalScore = await AssessmentScore.fetchById(req.body.importedAssessmentScoreId)

			// verify the user can import it
			if(originalScore.userId !== req.currentUser.id) throw "Importable scores must be owned by the current user."
			if(originalScore.draftId !== req.currentDocument.draftId) throw "Scores can only be imported for the same module"
			if(originalScore.draftContentId !== req.currentDocument.contentId) throw "Scores can only be imported for the same version of a module"

			// check that the student has no attempts for this resource_link yet
			const attempts = await Assessment.getAttempts(
				req.currentUser.id,
				req.currentDocument.draftId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id
			)

			if(attempts.length !== 0) throw "Scores can only be imported if no assessment attempts have been made."

			const importedScore = await originalScore.importAsNewScore()

			const history = await Assessment.getCompletedAssessmentAttemptHistory(
				req.currentUser.id,
				req.currentDocument.draftId,
				req.body.assessmentId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id
			)

			res.success({history, importedScore})
		} catch(e){
			logAndRespondToUnexpected('Error importing score', res, req, e)
		}

	})

// @TODO NOT USED
// update getAttempt to take isPreview
router
	.route('/api/assessments/:draftId/:assessmentId/attempt/:attemptId')
	.get([requireCurrentUser, requireCurrentDocument, requireAttemptId, requireAssessmentId])
	.get((req, res) => {
		return Assessment.getAttempt(
			req.currentUser.id,
			req.currentDocument.draftId,
			req.params.assessmentId,
			req.params.attemptId
		)
			.then(res.success)
			.catch(error => {
				logAndRespondToUnexpected(
					'Unexpected Error Loading attempt "${:attemptId}"',
					res,
					req,
					error
				)
			})
	})

router
	.route('/api/assessments/:draftId/attempts')
	.get([requireCurrentUser, requireCurrentVisit, requireCurrentDocument])
	.get((req, res) => {
		return Assessment.getAttempts(
			req.currentUser.id,
			req.currentDocument.draftId,
			req.currentVisit.is_preview,
			req.currentVisit.resource_link_id
		)
			.then(res.success)
			.catch(error => {
				logAndRespondToUnexpected('Unexpected error loading attempts', res, req, error)
			})
	})

// @TODO NOT USED
// update getAttempts to take isPreview
router
	.route('/api/assessment/:draftId/:assessmentId/attempts')
	.get([requireCurrentDocument, requireCurrentUser, requireCurrentVisit, requireAssessmentId])
	.get((req, res) => {
		return Assessment.getAttempts(
			req.currentUser.id,
			req.currentDocument.draftId,
			req.currentVisit.is_preview,
			req.currentVisit.resource_link_id,
			req.params.assessmentId
		)
			.then(res.success)
			.catch(error => {
				logAndRespondToUnexpected('Unexpected error loading attempts', res, req, error)
			})
	})

oboEvents.on('client:question:setResponse', async (event, req) => {
	const eventRecordResponse = 'client:question:setResponse'

	try {
		if (!event.payload.attemptId) return // assume we're in practice
		if (!event.payload.questionId) throw 'Missing Question ID'
		if (!event.payload.response) throw 'Missing Response'

		await db.none(
			`
		INSERT INTO attempts_question_responses
		(attempt_id, question_id, response, assessment_id)
		VALUES($[attemptId], $[questionId], $[response], $[assessmentId])
		ON CONFLICT (attempt_id, question_id) DO
			UPDATE
			SET
				response = $[response],
				updated_at = now()
			WHERE attempts_question_responses.attempt_id = $[attemptId]
				AND attempts_question_responses.question_id = $[questionId]`,
			{
				assessmentId: event.payload.assessmentId,
				attemptId: event.payload.attemptId,
				questionId: event.payload.questionId,
				response: event.payload.response
			}
		)
	} catch (error) {
		logger.error(eventRecordResponse, req, event, error, error.toString())
	}
})

module.exports = router
