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
			logAndRespondToUnexpected(res, e, new Error('Unexpected error starting a new attempt'))
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
			logAndRespondToUnexpected(res, error, new Error('Unexpected error completing your attempt'))
		})
})

app.post('/api/assessments/clear-preview-scores', (req, res, next) => {
	req
		.requireCurrentUser()
		.then(currentUser => {
			let isPreviewing = currentUser.canViewEditor

			if (!isPreviewing) {
				return res.notAuthorized('Not in preview mode')
			}

			// delete from assessment_scores where user_id, draft_id, preview
			//	join lti_assessment_scores
			// delete from attempts where user_id, draft_id, preview,
			//	join attempts_question_responses
			//

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
				.then(assessmentScoreIds => {
					if (assessmentScoreIds.length === 0) return

					return db.none(
						`
					DELETE FROM lti_assessment_scores
					WHERE assessment_score_id IN ($1:csv)
				`,
						assessmentScoreIds.map(i => i.id)
					)
				})
				.then(() => {
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
				.then(attemptIds => {
					if (attemptIds.length === 0) return

					return db.none(
						`
					DELETE FROM attempts_question_responses
					WHERE attempt_id IN ($1:csv)
				`,
						attemptIds.map(i => i.id)
					)
				})
				.then(() => {
					return db.none(
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
				})
				.then(() => {
					return db.none(
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
				})
				.then(() => {
					return res.success()
				})

			// return endAttempt(req, res, currentUser, req.params.attemptId, isPreviewing)
			// return Assessment.getAttempts(currentUser.id, req.body.draftId)
		})

		.catch(error => {
			logAndRespondToUnexpected(res, error, new Error('Unexpected error completing your attempt'))
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
			console.log('error', error, error.toString())
			logAndRespondToUnexpected(
				res,
				error,
				new Error('Unexpected Error Loading attempt "${:attemptId}"')
			)
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
					logAndRespondToUnexpected(res, error, Error('Unexpected error loading attempts'))
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
					logAndRespondToUnexpected(res, error, Error('Unexpected error loading attempts'))
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
