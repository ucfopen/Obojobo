let express = require('express');
let app = express();
let DraftModel = oboRequire('models/draft');
let db = oboRequire('db');
let Assessment = require('./assessment');

let logAndRespondToUnexpected = (errorMessage, res, req, jsError) => {
	res.unexpected(jsError)
}

app.post('/api/assessments/attempt/start', (req, res, next) => {
	// check perms
	let currentUser = req.requireCurrentUser();

	// check input

	// insert
	DraftModel.fetchById(req.body.draftId)
	.then( (draftTree) => {
		db
		.any(`
			SELECT *
			FROM attempts
			WHERE user_id = $[userId]
			AND draft_id = $[draftId]
			AND assessment_id = $[assessmentId]
			AND completed_at IS NOT NULL
			ORDER BY completed_at
			`, {userId: currentUser.id, draftId: req.body.draftId, assessmentId: req.body.assessmentId})
		.then( (attemptHistory) => {
			var assessment = draftTree.findNodeClass(req.body.assessmentId)

			if(assessment.node.content.attempts && (attemptHistory.length >= assessment.node.content.attempts))
			{
				return res.reject('Attempt limit reached')
			}

			var attemptState = {
				questions: [],
				data: {}
			}

			var questions = []
			var state = {} //@TODO Retrieve state

			let promises = assessment.yell('ObojoboDraft.Sections.Assessment:attemptStart', req, res, assessment, attemptHistory, {
				getQuestions: function() { return attemptState.questions },
				setQuestions: function(q) { attemptState.questions = q },
				getData:      function() { return attemptState.data },
				setData:      function(d) { attemptState.data = d },
			})
			Promise.all(promises).then( () => {
				// let questionObjects = attemptState.questions.map( (question) => { return question.toObject() } )
				let promises = []
				for(let i in attemptState.questions)
				{
					promises = promises.concat(attemptState.questions[i].yell('ObojoboDraft.Sections.Assessment:sendToAssessment', req, res))
				}

				Promise.all(promises)
				.then( () => {
					let questionObjects = attemptState.questions.map( (question) => { return question.toObject() } )
					Assessment.insertNewAttempt(currentUser.id, req.body.draftId, req.body.assessmentId, { questions:questionObjects, data:attemptState.data })
					.then( result => {
						res.success(result)
					})
					.catch( error => {
						logAndRespondToUnexpected('Unexpected DB error', res, req, error)
					})
				})
			})
		})
		.catch( error => {
			logAndRespondToUnexpected('Unexpected DB error', res, req, error)
		})
	})
	.catch( error => {
		res.missing(error.toString())
	})
})

app.post('/api/assessments/attempt/:attemptId/end', (req, res, next) => {
	// check perms
	let currentUser = req.requireCurrentUser();

	// check input

	// insert

	// get draft and assessment ids for this attempt
	db.one(`
		SELECT drafts.id AS draft_id, attempts.assessment_id, attempts.state as attempt_state
		FROM drafts
		JOIN attempts
		ON drafts.id = attempts.draft_id
		WHERE attempts.id = $1
	`, [req.params.attemptId])
	.then( (result) => {
		let assessmentId = result.assessment_id
		let draftId = result.draft_id
		let attemptState = result.attempt_state

		// res.success('ok')

		DraftModel.fetchById(draftId)
		.then( (draftTree) => {
			db.any(`
				SELECT *
				FROM attempts_question_responses
				WHERE attempt_id = $1
				`, [req.params.attemptId])
			.then( responseHistory => {
				var assessment = draftTree.findNodeClass(assessmentId)
				var state = {
					scores: [0],
					questions: attemptState.questions,
					scoresByQuestionId: {}
				}

				// res.success('ok')

				let promises = assessment.yell('ObojoboDraft.Sections.Assessment:attemptEnd', req, res, assessment, responseHistory, {
					getQuestions: function() { return state.questions },
					addScore: function(questionId, score) {
						console.log('addScore', questionId, score)
						state.scores.push(score);
						state.scoresByQuestionId[questionId] = score;
					}
				})
				Promise.all(promises).then( () => {
					let score = state.scores.reduce( (a, b) => { return a + b } ) / state.questions.length

					let scores = state.questions.map(function(question) {
						return {
							id: question.id,
							score: state.scoresByQuestionId[question.id] || 0
						}
					})

					let result = {
						attemptScore: score,
						scores: scores
					}

					Assessment.updateAttempt(result, req.params.attemptId)
					.then( result => {
						res.success(result)
					})
					.catch( error => {
						console.log('errora', error, error.toString());
						logAndRespondToUnexpected('Unexpected DB error', res, req, error)
					})
				})
			})
			.catch( error => {
				console.log('errorb', error, error.toString());
				logAndRespondToUnexpected('Unexpected DB error', res, req, error)
			})
		})
		.catch( error => {
			console.log('errorc', error, error.toString());
			logAndRespondToUnexpected('Unable to get draft', res, req, error)
		})
	})
	.catch( error => {
		console.log('errord', error, error.toString());
		logAndRespondToUnexpected('Unexpected DB error', res, req, error)
	})
})

// gets the current user's attempts for all assessments for a specific draft
app.get('/api/drafts/:draftId/attempts', (req, res, next) => {
	// check perms
	let currentUser = req.requireCurrentUser();

	// check input

	// select
	db.manyOrNone(`
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
		ORDER BY completed_at DESC`
		, {userId: currentUser.id, draftId: req.params.draftId})
	.then( result => {
		res.success({
			attempts: result
		})
	})
	.catch( error => {
		logAndRespondToUnexpected('Unexpected DB error', res, req, error)
	})
})

global.oboEvents.on('client:question:recordResponse', (event, req) => {
	let eventRecordResponse = 'client:question:recordResponse'


	// check perms
	// check input
	if(!event.payload.attemptId)   return app.logError(eventRecordResponse, 'Missing Attempt ID', req, event)
	if(!event.payload.questionId)  return app.logError(eventRecordResponse, 'Missing Question ID', req, event)
	if(!event.payload.responderId) return app.logError(eventRecordResponse, 'Missing Responder ID', req, event)
	if(!event.payload.response)    return app.logError(eventRecordResponse, 'Missing Response', req, event)

	db.none(`
		INSERT INTO attempts_question_responses
		(attempt_id, question_id, responder_id, response)
		VALUES($[attemptId], $[questionId], $[responderId], $[response])
		ON CONFLICT (attempt_id, question_id) DO
			UPDATE
			SET
				responder_id = $[responderId],
				response = $[response],
				updated_at = now()
			WHERE attempts_question_responses.attempt_id = $[attemptId]
				AND attempts_question_responses.question_id = $[questionId]`
		, {attemptId: event.payload.attemptId, questionId: event.payload.questionId, responderId: event.payload.responderId, response: event.payload.response})
	.catch( error => {
		console.log(error);
		app.logError(eventRecordResponse, 'DB UNEXPECTED', req, error, error.toString());
	})
});


module.exports = app
