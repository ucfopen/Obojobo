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
const viewerState = oboRequire('viewer/viewer_state')

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
			logAndRespondToUnexpected('Unexpected error completing your attempt', res, req, e)
		})
})

app.post('/api/assessments/attempt/:attemptId/resume', (req, res, next) => {
	logger.log('resume attempt', req.params.attemptId)

	let draftId
	let user

	//@TODO: Error out if cant find attempt

	req
		.requireCurrentUser()
		.then(currentUser => {
			user = currentUser

			// Get the draft id from the attempt id
			return db.oneOrNone(
				`
				SELECT draft_id
				FROM attempts
				WHERE id = $[attemptId]
			`,
				{ attemptId: req.params.attemptId }
			)
		})
		.then(dbResult => {
			console.log('dbr', dbResult)
			draftId = dbResult.draft_id
			console.log('draftid', draftId)

			return Assessment.getResponsesForAttempt(req.params.attemptId)
		})
		.then(responses => {
			let responsesByQuestionId = {}

			for (let responseItem of responses) {
				console.log('respItem', responseItem)
				responsesByQuestionId[responseItem.question_id] = responseItem.response
			}

			// return res.success({
			// 	responses: responses.map(responseItem => {
			// 		return {
			// 			questionId: responseItem.question_id,
			// 			response: responseItem.response
			// 		}
			// 	})
			// })

			// let { createAssessmentAttemptSubmittedEvent } = createCaliperEvent(null, hostname)
			insertEvent({
				action: 'assessment:attemptResume',
				actorTime: new Date().toISOString(),
				payload: {
					attemptId: req.params.attemptId
				},
				userId: user.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: draftId,
				eventVersion: '1.0.0' //,
				// caliperPayload: createAssessmentAttemptSubmittedEvent({
				// 	actor: { type: 'user', id: user.id },
				// 	draftId,
				// 	assessmentId,
				// 	attemptId: attemptId,
				// 	isPreviewMode: isPreviewing
				// })
			})

			res.success({
				responses: responsesByQuestionId
			})
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

oboEvents.on('client:question:view', (event, req) => {
	console.log('question view', event)

	if (!event.payload.context) return
	let eventRecordResponse = 'client:question:view'

	req
		.requireCurrentUser()
		.then(currentUser => {
			return viewerState.get(currentUser.id, event.draft_id)
		})
		.then(viewerStateData => {
			let viewedQuestions = viewerStateData['question:viewedQuestions']
				? viewerStateData['question:viewedQuestions']
				: []

			if (viewedQuestions.indexOf(event.payload.question_id) === -1) {
				viewedQuestions.push(event.payload.questionId)
			}

			viewerState.set(
				currentUser.id,
				event.draft_id,
				'question:viewedQuestions',
				1,
				viewedQuestions
			)
		})

	// check perms
	// check input
	// if (!event.payload.attemptId)
	// 	return logger.error(eventRecordResponse, 'Missing Attempt ID', req, event)
	// if (!event.payload.questionId)
	// 	return logger.error(eventRecordResponse, 'Missing Question ID', req, event)
	// if (!event.payload.response)
	// 	return logger.error(eventRecordResponse, 'Missing Response', req, event)

	// return db
	// 	.none(
	// 		`
	// 		INSERT INTO attempts_question_responses
	// 		(attempt_id, question_id, response, assessment_id)
	// 		VALUES($[attemptId], $[questionId], $[response], $[assessmentId])
	// 		ON CONFLICT (attempt_id, question_id) DO
	// 			UPDATE
	// 			SET
	// 				response = $[response],
	// 				updated_at = now()
	// 			WHERE attempts_question_responses.attempt_id = $[attemptId]
	// 				AND attempts_question_responses.question_id = $[questionId]`,
	// 		{
	// 			assessmentId: event.payload.assessmentId,
	// 			attemptId: event.payload.attemptId,
	// 			questionId: event.payload.questionId,
	// 			response: event.payload.response
	// 		}
	// 	)
	// 	.catch(error => {
	// 		logger.error(eventRecordResponse, 'DB UNEXPECTED', req, error, error.toString())
	// 	})
})

oboEvents.on('client:question:setResponse', (event, req) => {
	console.log('client question setResponse')
	if (!event.payload.context) return
	let eventRecordResponse = 'client:question:setResponse'

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
