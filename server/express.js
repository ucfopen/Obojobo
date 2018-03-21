const express = require('express')
const app = express()
const oboEvents = oboRequire('obo_events')
const DraftModel = oboRequire('models/draft')
const db = oboRequire('db')
const Assessment = require('./assessment')
const lti = oboRequire('lti')
const insertEvent = oboRequire('insert_event')
const logger = oboRequire('logger')
const createCaliperEvent = oboRequire('routes/api/events/create_caliper_event') //@TODO
const startAttempt = require('./attempt-start').startAttempt
const endAttempt = require('./attempt-end').endAttempt
const logAndRespondToUnexpected = require('./util').logAndRespondToUnexpected

app.get('/api/lti/state/draft/:draftId', (req, res, next) => {
	let currentUser

	req
		.requireCurrentUser()
		.then(user => {
			currentUser = user

			return lti.getLTIStatesByAssessmentIdForUserAndDraft(currentUser.id, req.params.draftId)
		})
		.then(result => {
			res.success(result)
		})
})

app.post('/api/lti/sendAssessmentScore', (req, res, next) => {
	logger.info('API sendAssessmentScore', req.body)

	let currentUser
	let ltiScoreResult
	let assessmentScoreId
	let draftId = req.body.draftId
	let assessmentId = req.body.assessmentId

	req
		.requireCurrentUser()
		.then(user => {
			currentUser = user

			logger.info(
				`API sendAssessmentScore with userId="${
					user.id
				}", draftId="${draftId}", assessmentId="${assessmentId}"`
			)

			return lti.sendHighestAssessmentScore(currentUser.id, draftId, assessmentId)
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
	req
		.requireCurrentUser()
		.then(currentUser => {
			let isPreviewing = currentUser.canViewEditor
			return endAttempt(req, res, currentUser, req.params.attemptId, isPreviewing)
		})
		.then(resp => {
			res.success(resp)
		})
		.catch(error => {
			logAndRespondToUnexpected('Unexpected error completing your attempt', res, req, e)
		})
})

app.post('/api/assessments/clear-preview-scores', (req, res, next) => {
	let assessmentScoreIds
	let attemptIds

	req
		.requireCurrentUser()
		.then(currentUser => {
			let isPreviewing = currentUser.canViewEditor

			if (!isPreviewing) {
				return res.notAuthorized('Not in preview mode')
			}

			return db
				.manyOrNone(
					`
						SELECT id
						FROM assessment_scores
						WHERE user_id = $[userId]
						AND draft_id = $[draftId]
						AND preview = true
					`,
					{
						userId: currentUser.id,
						draftId: req.body.draftId
					}
				)
				.then(assessmentScoreIdsResult => {
					assessmentScoreIds = assessmentScoreIdsResult

					return db.manyOrNone(
						`
							SELECT id
							FROM attempts
							WHERE user_id = $[userId]
							AND draft_id = $[draftId]
							AND preview = true
						`,
						{
							userId: currentUser.id,
							draftId: req.body.draftId
						}
					)
				})
				.then(attemptIdsResult => {
					attemptIds = attemptIdsResult

					return db.tx(t => {
						let queries = []

						if (assessmentScoreIds.length > 0) {
							queries.push(
								t.none(
									`
									DELETE FROM lti_assessment_scores
									WHERE assessment_score_id IN ($1:csv)
								`,
									assessmentScoreIds.map(i => i.id)
								)
							)
						}

						if (attemptIds.length > 0) {
							queries.push(
								t.none(
									`
									DELETE FROM attempts_question_responses
									WHERE attempt_id IN ($1:csv)
								`,
									attemptIds.map(i => i.id)
								)
							)
						}

						queries.push(
							t.none(
								`
									DELETE FROM assessment_scores
									WHERE user_id = $[userId]
									AND draft_id = $[draftId]
									AND preview = true
								`,
								{
									userId: currentUser.id,
									draftId: req.body.draftId
								}
							)
						)

						queries.push(
							t.none(
								`
									DELETE FROM attempts
									WHERE user_id = $[userId]
									AND draft_id = $[draftId]
									AND preview = true
								`,
								{
									userId: currentUser.id,
									draftId: req.body.draftId
								}
							)
						)

						return t.batch(queries)
					})
				})

				.then(() => {
					return res.success()
				})
		})

		.catch(error => {
			logAndRespondToUnexpected('Unexpected error clearing preview scores', res, req, error)
		})
})

app.get('/api/assessments/:draftId/:assessmentId/attempt/:attemptId', (req, res, next) => {
	// check perms
	req
		.requireCurrentUser()
		.then(currentUser => {
			// check input
			// select
			return Assessment.getAttempt(
				currentUser.id,
				req.params.draftId,
				req.params.assessmentId,
				req.params.attemptId
			)
		})
		.then(result => {
			res.success(result)
		})
		.catch(error => {
			logAndRespondToUnexpected('Unexpected Error Loading attempt "${:attemptId}"', res, req, error)
		})
})

app.get('/api/assessments/:draftId/attempts', (req, res, next) => {
	// check perms
	req
		.requireCurrentUser()
		.then(currentUser => {
			// check input
			// select
			return Assessment.getAttempts(currentUser.id, req.params.draftId)
		})
		.then(result => {
			res.success(result)
		})
		.catch(error => {
			switch (error.message) {
				case 'Login Required':
					res.notAuthorized(error.message)
					return next()

				default:
					logAndRespondToUnexpected('Unexpected error loading attempts', res, req, error)
			}
		})
})

app.get('/api/assessment/:draftId/:assessmentId/attempts', (req, res, next) => {
	// check perms
	req
		.requireCurrentUser()
		.then(currentUser => {
			// check input
			// select
			return Assessment.getAttempts(currentUser.id, req.params.draftId, req.params.assessmentId)
		})
		.then(result => {
			res.success(result)
		})
		.catch(error => {
			switch (error.message) {
				case 'Login Required':
					res.notAuthorized(error.message)
					return next()

				default:
					logAndRespondToUnexpected('Unexpected error loading attempts', res, req, error)
			}
		})
})

oboEvents.on('client:assessment:setResponse', (event, req) => {
	let eventRecordResponse = 'client:assessment:setResponse'

	// check perms
	// check input
	if (!event.payload.attemptId)
		return logger.error(eventRecordResponse, 'Missing Attempt ID', req, event)
	if (!event.payload.questionId)
		return logger.error(eventRecordResponse, 'Missing Question ID', req, event)
	if (!event.payload.response)
		return logger.error(eventRecordResponse, 'Missing Response', req, event)

	return db
		.none(
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
		.catch(error => {
			logger.error(eventRecordResponse, 'DB UNEXPECTED', req, error, error.toString())
		})
})

module.exports = app
