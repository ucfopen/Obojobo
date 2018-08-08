const express = require('express')
const app = express()
const oboEvents = oboRequire('obo_events')
const db = oboRequire('db')
const Assessment = require('./assessment')
const VisitModel = oboRequire('models/visit')
const lti = oboRequire('lti')
const logger = oboRequire('logger')
const startAttempt = require('./attempt-start').startAttempt
const endAttempt = require('./attempt-end').endAttempt
const logAndRespondToUnexpected = require('./util').logAndRespondToUnexpected

app.get('/api/lti/state/draft/:draftId', (req, res, next) => {
	let currentUser
	let currentDocument

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			return lti.getLTIStatesByAssessmentIdForUserAndDraft(currentUser.id, currentDocument.draftId)
		})
		.then(result => {
			res.success(result)
		})
})

app.post('/api/lti/sendAssessmentScore', (req, res, next) => {
	logger.info('API sendAssessmentScore', req.body)

	let currentUser = null
	let currentDocument = null
	let ltiScoreResult
	const draftId = req.body.draftId
	const assessmentId = req.body.assessmentId

	return req
		.requireCurrentUser()
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

			return lti.sendHighestAssessmentScore(currentUser.id, currentDocument, assessmentId)
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

app.post('/api/assessments/attempt/start', (req, res) => startAttempt(req, res))

app.post('/api/assessments/attempt/:attemptId/end', (req, res, next) => {
	let currentUser = null
	let currentDocument = null
	let isPreview

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			return VisitModel.fetchById(req.body.visitId)
		})
		.then(visit => {
			isPreview = visit.is_preview
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			return endAttempt(req, res, currentUser, currentDocument, req.params.attemptId, isPreview)
		})
		.then(resp => {
			res.success(resp)
		})
		.catch(error => {
			logAndRespondToUnexpected('Unexpected error completing your attempt', res, req, error)
		})
})

app.post('/api/assessments/clear-preview-scores', (req, res, next) => {
	let assessmentScoreIds
	let attemptIds
	let currentUser = null
	let currentDocument = null
	let isPreview

	return req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			return VisitModel.fetchById(req.body.visitId)
		})
		.then(visit => {
			isPreview = visit.is_preview
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			if (!isPreview) throw 'Not in preview mode'

			return db.manyOrNone(
				`
						SELECT id
						FROM assessment_scores
						WHERE user_id = $[userId]
						AND draft_id = $[draftId]
						AND is_preview = true
					`,
				{
					userId: currentUser.id,
					draftId: currentDocument.draftId
				}
			)
		})
		.then(assessmentScoreIdsResult => {
			assessmentScoreIds = assessmentScoreIdsResult

			return db.manyOrNone(
				`
					SELECT id
					FROM attempts
					WHERE user_id = $[userId]
					AND draft_id = $[draftId]
					AND is_preview = true
				`,
				{
					userId: currentUser.id,
					draftId: currentDocument.draftId
				}
			)
		})
		.then(attemptIdsResult => {
			attemptIds = attemptIdsResult

			return db.tx(transaction => {
				const queries = []

				if (assessmentScoreIds.length > 0) {
					queries.push(
						transaction.none(
							`
							DELETE FROM lti_assessment_scores
							WHERE assessment_score_id IN ($[ids:csv])
						`,
							{ ids: assessmentScoreIds.map(i => i.id) }
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
							{ ids: attemptIds.map(i => i.id) }
						)
					)
				}

				queries.push(
					transaction.none(
						`
							DELETE FROM assessment_scores
							WHERE user_id = $[userId]
							AND draft_id = $[draftId]
							AND is_preview = true
						`,
						{
							userId: currentUser.id,
							draftId: currentDocument.draftId
						}
					),
					transaction.none(
						`
							DELETE FROM attempts
							WHERE user_id = $[userId]
							AND draft_id = $[draftId]
							AND is_preview = true
						`,
						{
							userId: currentUser.id,
							draftId: currentDocument.draftId
						}
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
app.get('/api/assessments/:draftId/:assessmentId/attempt/:attemptId', (req, res, next) => {
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

// @TODO NOT USED
// update getAttempts to take isPreview
app.get('/api/assessments/:draftId/attempts', (req, res, next) => {
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
			return Assessment.getAttempts(currentUser.id, currentDocument.draftId)
		})
		.then(result => {
			res.success(result)
		})
		.catch(error => {
			if (error.message == 'Login Required') {
				return res.notAuthorized(error.message)
			}

			logAndRespondToUnexpected('Unexpected error loading attempts', res, req, error)
		})
})

// @TODO NOT USED
// update getAttempts to take isPreview
app.get('/api/assessment/:draftId/:assessmentId/attempts', (req, res, next) => {
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
			return Assessment.getAttempts(
				currentUser.id,
				currentDocument.draftId,
				req.params.assessmentId
			)
		})
		.then(result => res.success(result))
		.catch(error => {
			if (error.message == 'Login Required') {
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

module.exports = app
