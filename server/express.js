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
const logAndRespondToUnexpected = require('./util').logAndRespondToUnexpected

app.post('/api/assessments/attempt/start', (req, res) => startAttempt(req, res))

app.post('/api/assessments/attempt/:attemptId/end', (req, res, next) => {
	// check perms

	// references to hold on to from various responses (so we don't have to nest thens)
	let updateResult
	let draftTree
	let attemptState
	let draftId
	let assessmentId
	let attemptScore
	let highestAttemptScore
	let attemptHistory
	let numAttempts
	let state
	let currentUser
	let isPreviewing

	req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			isPreviewing = user.canViewEditor
			// check input
			// insert
			// get draft and assessment ids for this attempt
			return db.one(
				`
				SELECT drafts.id AS draft_id, attempts.assessment_id, attempts.state as attempt_state
				FROM drafts
				JOIN attempts
				ON drafts.id = attempts.draft_id
				WHERE attempts.id = $1
			`,
				[req.params.attemptId]
			)
		})
		.then(result => {
			assessmentId = result.assessment_id
			attemptState = result.attempt_state
			draftId = result.draft_id

			return DraftModel.fetchById(draftId)
		})
		.then(draft => {
			draftTree = draft
			return db.any(
				`
			SELECT *
			FROM attempts_question_responses
			WHERE attempt_id = $1
			`,
				[req.params.attemptId]
			)
		})
		.then(responseHistory => {
			var assessment = draftTree.getChildNodeById(assessmentId)
			state = {
				scores: [0],
				questions: attemptState.questions,
				scoresByQuestionId: {}
			}

			let promises = assessment.yell(
				'ObojoboDraft.Sections.Assessment:attemptEnd',
				req,
				res,
				assessment,
				responseHistory,
				{
					getQuestions: () => {
						return state.questions
					},
					addScore: (questionId, score) => {
						state.scores.push(score)
						state.scoresByQuestionId[questionId] = score
					}
				}
			)

			return Promise.all(promises)
		})
		.then(() => {
			attemptScore =
				state.scores.reduce((a, b) => {
					return a + b
				}) / state.questions.length

			let scores = state.questions.map(question => {
				return {
					id: question.id,
					score: state.scoresByQuestionId[question.id] || 0
				}
			})

			let result = {
				attemptScore: attemptScore,
				scores: scores
			}
			return Assessment.updateAttempt(result, req.params.attemptId)
		})
		.then(updateAttemptResult => {
			updateResult = updateAttemptResult

			return Assessment.getCompletedAssessmentAttemptHistory(
				currentUser.id,
				draftId,
				assessmentId,
				false
			)
		})
		.then(attemptHistoryResult => {
			attemptHistory = attemptHistoryResult

			return Assessment.getNumberAttemptsTaken(currentUser.id, draftId, assessmentId)
		})
		.then(numAttemptsResult => {
			numAttempts = numAttemptsResult
			let { createAssessmentAttemptSubmittedEvent } = createCaliperEvent(null, req.hostname)
			insertEvent({
				action: 'assessment:attemptEnd',
				actorTime: new Date().toISOString(),
				payload: {
					attemptId: req.params.attemptId,
					attemptCount: isPreviewing ? -1 : numAttempts
				},
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: draftId,
				eventVersion: '1.1.0',
				caliperPayload: createAssessmentAttemptSubmittedEvent({
					actor: { type: 'user', id: currentUser.id },
					draftId,
					assessmentId,
					attemptId: req.params.attemptId,
					isPreviewMode: isPreviewing
				})
			})

			if (isPreviewing) return Promise.resolve(false)

			let allScores = attemptHistory.map(attempt => {
				return parseFloat(attempt.result.attemptScore)
			})
			highestAttemptScore = Math.max(0, ...allScores) / 100

			return lti.replaceResult(currentUser.id, draftId, highestAttemptScore)
		})
		.then(isScoreSent => {
			updateResult.ltiOutcomes = {
				sent: isScoreSent
			}
			res.success(updateResult)
			let { createAssessmentAttemptScoredEvent } = createCaliperEvent(null, req.hostname)
			insertEvent({
				action: 'assessment:attemptScored',
				actorTime: new Date().toISOString(),
				payload: {
					attemptId: req.params.attemptId,
					attemptCount: isPreviewing ? -1 : numAttempts,
					attemptScore: attemptScore,
					highestAttemptScore: isPreviewing ? -1 : highestAttemptScore,
					didSendLtiOutcome: isScoreSent
				},
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: draftId,
				eventVersion: '1.1.0',
				caliperPayload: createAssessmentAttemptScoredEvent({
					actor: { type: 'serverApp' },
					draftId,
					assessmentId,
					attemptId: req.params.attemptId,
					attemptScore,
					isPreviewMode: isPreviewing,
					extensions: {
						attemptCount: isPreviewing ? -1 : numAttempts,
						attemptScore: attemptScore,
						highestAttemptScore: isPreviewing ? -1 : highestAttemptScore,
						didSendLtiOutcome: isScoreSent
					}
				})
			})
		})
		.catch(error => {
			logger.error('error', error, error.toString())
			logAndRespondToUnexpected(
				'Unexpected error',
				res,
				req,
				Error('Unexpected Error Completing your attempt.')
			)
		})
})

// gets the current user's attempts for all assessments for a specific draft
app.get('/api/drafts/:draftId/attempts', (req, res, next) => {
	// check perms
	req
		.requireCurrentUser()
		.then(currentUser => {
			// check input
			// select
			return db.manyOrNone(
				`
				SELECT
					id AS "attemptId",
					created_at as "startDate",
					completed_at as "endDate",
					assessment_id,
					state,
					score
				FROM attempts
				WHERE user_id = $[userId]
					AND draft_id = $[draftId]
				ORDER BY completed_at DESC`,
				{ userId: currentUser.id, draftId: req.params.draftId }
			)
		})
		.then(result => {
			res.success({ attempts: result })
		})
		.catch(error => {
			logger.error('error', error, error.toString())
			logAndRespondToUnexpected(
				'Unexpected error',
				res,
				req,
				Error('Unexpected Error Loading attempts.')
			)
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
