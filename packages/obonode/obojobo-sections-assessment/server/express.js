const router = require('express').Router() //eslint-disable-line new-cap
const Assessment = require('./assessment')
const lti = require('obojobo-express/server/lti')
const logger = require('obojobo-express/server/logger')
const { startAttempt } = require('./attempt-start')
const resumeAttempt = require('./attempt-resume')
const endAttempt = require('./attempt-end/attempt-end')
const { reviewAttempt } = require('./attempt-review')
const { logAndRespondToUnexpected } = require('./util')
const { deletePreviewState } = require('./services/preview')
const {
	requireCurrentDocument,
	requireCurrentVisit,
	requireAttemptId,
	requireCurrentUser,
	requireAssessmentId,
	checkValidationRules
} = require('obojobo-express/server/express_validators')

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
	.post([
		requireCurrentVisit,
		requireCurrentUser,
		requireCurrentDocument,
		requireAssessmentId,
		checkValidationRules
	])
	.post(async (req, res) => {
		try {
			logger.info(
				`API sendAssessmentScore with userId="${req.currentUser.id}", draftId="${req.currentDocument.draftId}", assessmentId="${req.body.assessmentId}"`
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
	.post([
		requireCurrentUser,
		requireCurrentVisit,
		requireCurrentDocument,
		requireAssessmentId,
		checkValidationRules
	])
	.post(startAttempt)

router
	.route('/api/assessments/attempt/:attemptId/resume')
	.post([
		requireCurrentUser,
		requireCurrentDocument,
		requireCurrentVisit,
		requireAttemptId,
		checkValidationRules
	])
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
	.post([
		requireCurrentVisit,
		requireCurrentUser,
		requireCurrentDocument,
		requireAttemptId,
		checkValidationRules
	])
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
	.post([requireCurrentUser, requireAttemptId, checkValidationRules])
	.post(async (req, res) => {
		const questionModels = await reviewAttempt(req.body.attemptIds)
		res.send(questionModels)
	})

router
	.route('/api/assessments/clear-preview-scores')
	.post([requireCurrentUser, requireCurrentVisit, requireCurrentDocument])
	.post(async (req, res) => {
		if (!req.currentVisit.is_preview) return res.notAuthorized('Not in preview mode')

		try {
			await deletePreviewState(
				req.currentUser.id,
				req.currentDocument.draftId,
				req.currentVisit.resource_link_id
			)
			res.success()
		} catch (error) {
			logAndRespondToUnexpected('Unexpected error clearing preview scores', res, req, error)
		}
	})

// @TODO NOT USED
// update getAttempt to take isPreview
router
	.route('/api/assessments/:draftId/:assessmentId/attempt/:attemptId')
	.get([
		requireCurrentUser,
		requireCurrentDocument,
		requireAttemptId,
		requireAssessmentId,
		checkValidationRules
	])
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
	.get([
		requireCurrentDocument,
		requireCurrentUser,
		requireCurrentVisit,
		requireAssessmentId,
		checkValidationRules
	])
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

// register the event listeners
require('./events')

module.exports = router
