const express = require('express')
const router = express.Router()
const oboEvents = require('obojobo-express/obo_events')
const db = require('obojobo-express/db')
const Assessment = require('./assessment')
const VisitModel = require('obojobo-express/models/visit')
const lti = require('obojobo-express/lti')
const logger = require('obojobo-express/logger')
const { startAttempt } = require('./attempt-start')
const resumeAttempt = require('./attempt-resume')
const endAttempt = require('./attempt-end/attempt-end')
const { reviewAttempt } = require('./attempt-review')
const { logAndRespondToUnexpected } = require('./util')
const {
	checkValidationRules,
	requireCurrentDocument,
	requireCurrentVisit,
	requireVisitId,
	requireAttemptId,
	requireCurrentUser
} = require('obojobo-express/express_validators')
const ResponseDecorator = require('obojobo-express/express_response_decorator')

router.use('/', ResponseDecorator)

router.get('/api/lti/state/draft/:draftId', (req, res) =>
	req
		.getCurrentVisitFromRequest()
		.then(req.requireCurrentUser)
		.then(req.requireCurrentDocument)
		.then(() =>
			lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId(
				req.currentUser.id,
				req.currentDocument.draftId,
				req.currentVisit.resource_link_id
			)
		)
		.then(res.success)
)

router.post('/api/lti/sendAssessmentScore', (req, res) => {
	logger.info('API sendAssessmentScore', req.body)

	let currentUser = null
	let currentDocument = null
	let ltiScoreResult
	const assessmentId = req.body.assessmentId

	return req
		.getCurrentVisitFromRequest()
		.then(() => req.requireCurrentUser())
		.then(user => {
			currentUser = user
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			logger.info(
				`API sendAssessmentScore with userId="${currentUser.id}", draftId="${
					currentDocument.draftId
				}", assessmentId="${assessmentId}"`
			)

			return lti.sendHighestAssessmentScore(
				currentUser.id,
				currentDocument,
				assessmentId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id
			)
		})
		.then(result => {
			ltiScoreResult = result

			res.success({
				score: ltiScoreResult.scoreSent,
				status: ltiScoreResult.status,
				statusDetails: ltiScoreResult.statusDetails,
				dbStatus: ltiScoreResult.dbStatus,
				gradebookStatus: ltiScoreResult.gradebookStatus
			})
		})
		.catch(e => {
			logAndRespondToUnexpected('Unexpected error starting a new attempt', res, req, e)
		})
})

router
	.route('/api/assessments/attempt/start')
	.post(startAttempt)

router
	.route('/api/assessments/attempt/:attemptId/resume')
	.post([requireAttemptId])
	.post(async (req, res) => {
		try {
			await resumeAttempt(req, res)
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

router
	.route('/api/assessments/attempt/review')
	.post(reviewAttempt)

router
	.route('/api/assessments/clear-preview-scores')
	.post((req, res) => {
		let assessmentScoreIds
		let attemptIds
		let currentUser = null
		let currentDocument = null
		let isPreview
		let resourceLinkId

		return req
			.requireCurrentUser()
			.then(user => {
				currentUser = user
				return VisitModel.fetchById(req.body.visitId)
			})
			.then(visit => {
				isPreview = visit.is_preview
				resourceLinkId = visit.resource_link_id
				return req.requireCurrentDocument()
			})
			.then(draftDocument => {
				currentDocument = draftDocument
				if (!isPreview) throw 'Not in preview mode'

				return db.manyOrNone(
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
					{
						userId: currentUser.id,
						draftId: currentDocument.draftId,
						resourceLinkId
					}
				)
			})
			.then(assessmentScoreIdsResult => {
				assessmentScoreIds = assessmentScoreIdsResult.map(i => i.id)

				return db.manyOrNone(
					`
						SELECT id
						FROM attempts
						WHERE user_id = $[userId]
						AND draft_id = $[draftId]
						AND resource_link_id = $[resourceLinkId]
						AND is_preview = true
					`,
					{
						userId: currentUser.id,
						draftId: currentDocument.draftId,
						resourceLinkId
					}
				)
			})
			.then(attemptIdsResult => {
				attemptIds = attemptIdsResult.map(i => i.id)

				return db.tx(transaction => {
					const queries = []

					if (assessmentScoreIds.length > 0) {
						queries.push(
							transaction.none(
								`
								DELETE FROM lti_assessment_scores
								WHERE assessment_score_id IN ($[ids:csv])
							`,
								{ ids: assessmentScoreIds }
							)
						)
					}

					if (attemptIds.length > 0) {
						queries.push(
							transaction.none(
								`
								DELETE FROM attempts_question_responses
								WHERE attempt_id IN ($[ids:csv])
							`,
								{ ids: attemptIds }
							)
						)
					}

					queries.push(
						transaction.none(
							`
								DELETE FROM assessment_scores
								WHERE id IN ($[ids:csv])
							`,
							{ ids: assessmentScoreIds }
						),
						transaction.none(
							`
								DELETE FROM attempts
								WHERE id IN ($[ids:csv])
							`,
							{ ids: attemptIds }
						)
					)

					return transaction.batch(queries)
				})
			})
			.then(() => res.success())
			.catch(error => {
				if (error === 'Not in preview mode') {
					return res.notAuthorized(error)
				}

				logAndRespondToUnexpected('Unexpected error clearing preview scores', res, req, error)
			})
	})

// @TODO NOT USED
// update getAttempt to take isPreview
router
	.route('/api/assessments/:draftId/:assessmentId/attempt/:attemptId')
	.get((req, res) => {
		let currentUser = null
		let currentDocument = null

		return req
			.requireCurrentUser()
			.then(user => {
				currentUser = user
				return req.requireCurrentDocument()
			})
			.then(draftDocument => {
				currentDocument = draftDocument
				return Assessment.getAttempt(
					currentUser.id,
					currentDocument.draftId,
					req.params.assessmentId,
					req.params.attemptId
				)
			})
			.then(result => res.success(result))
			.catch(error => {
				logAndRespondToUnexpected('Unexpected Error Loading attempt "${:attemptId}"', res, req, error)
			})
	})

router.get('/api/assessments/:draftId/attempts', (req, res) => {
	let currentUser = null
	let currentDocument = null

	return req
		.getCurrentVisitFromRequest()
		.then(req.requireCurrentUser)
		.then(user => {
			currentUser = user
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			return Assessment.getAttempts(
				currentUser.id,
				currentDocument.draftId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id
			)
		})
		.then(result => {
			res.success(result)
		})
		.catch(error => {
			if (error.message === 'Login Required') {
				return res.notAuthorized(error.message)
			}

			logAndRespondToUnexpected('Unexpected error loading attempts', res, req, error)
		})
})

// @TODO NOT USED
// update getAttempts to take isPreview
router.get('/api/assessment/:draftId/:assessmentId/attempts', (req, res) => {
	let currentUser = null
	let currentDocument = null

	return req
		.getCurrentVisitFromRequest()
		.then(() => req.requireCurrentUser())
		.then(user => {
			currentUser = user
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			return Assessment.getAttempts(
				currentUser.id,
				currentDocument.draftId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id,
				req.params.assessmentId
			)
		})
		.then(result => res.success(result))
		.catch(error => {
			if (error.message === 'Login Required') {
				return res.notAuthorized(error.message)
			}

			logAndRespondToUnexpected('Unexpected error loading attempts', res, req, error)
		})
})

oboEvents.on('client:question:setResponse', (event, req) => {
	const eventRecordResponse = 'client:question:setResponse'

	return Promise.resolve()
		.then(() => {
			// If no attemptId is specified assume that we are in practice and
			// we don't need to store the response
			if (!event.payload.attemptId) return

			if (!event.payload.questionId) throw 'Missing Question ID'
			if (!event.payload.response) throw 'Missing Response'

			return db.none(
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
		})
		.catch(error => {
			logger.error(eventRecordResponse, req, event, error, error.toString())
		})
})

module.exports = router
