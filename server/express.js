let express = require('express');
let app = express();
let DraftModel = oboRequire('models/draft');
let db = oboRequire('db');
let Assessment = require('./assessment');
let lti = oboRequire('lti')

let logAndRespondToUnexpected = (errorMessage, res, req, jsError) => {
	res.unexpected(jsError)
}

app.post('/api/assessments/attempt/start', (req, res, next) => {
	let currentUser
	let draftId = req.body.draftId
	let draftTree
	let attemptState
	let isPreviewing
	let attemptHistory

	req.requireCurrentUser()
	.then(user => {
		currentUser = user
		isPreviewing = currentUser.canViewEditor

		return DraftModel.fetchById(draftId)
	})
	.then(draft => {
		draftTree = draft

		return Assessment.getCompletedAssessmentAttemptHistory(currentUser.id, req.body.draftId, req.body.assessmentId, true)
	})
	.then(result => {
		attemptHistory = result
		return Assessment.getNumberAttemptsTaken(currentUser.id, req.body.draftId, req.body.assessmentId)
	})
	.then(numAttempts => {
		var assessment = draftTree.findNodeClass(req.body.assessmentId)

		if(!isPreviewing && assessment.node.content.attempts && (numAttempts >= assessment.node.content.attempts))
		{
			throw new Error('Attempt limit reached')
		}

		attemptState = {
			questions: [],
			data: {}
		}

		let promises = assessment.yell('ObojoboDraft.Sections.Assessment:attemptStart', req, res, assessment, attemptHistory, {
			getQuestions: function() { return attemptState.questions },
			setQuestions: function(q) { attemptState.questions = q },
			getData:      function() { return attemptState.data },
			setData:      function(d) { attemptState.data = d },
		})
		return Promise.all(promises)
	})
	.then(() => {
		let promises = []
		for(let i in attemptState.questions)
		{
			promises = promises.concat(attemptState.questions[i].yell('ObojoboDraft.Sections.Assessment:sendToAssessment', req, res))
		}
		return Promise.all(promises)
	})
	.then(() => {
		let questionObjects = attemptState.questions.map( (question) => { return question.toObject() } )
		return Assessment.insertNewAttempt(
			currentUser.id,
			req.body.draftId,
			req.body.assessmentId,
			{
				questions: questionObjects,
				data: attemptState.data
			},
			isPreviewing
		)
	})
	.then(result => {
		res.success(result)
	})
	.catch(error => {
		switch(error.message)
		{
			case 'Attempt limit reached':
				return res.reject('Attempt limit reached')

			default:
				logAndRespondToUnexpected('Unexpected DB error', res, req, error)
		}
	})

})

app.post('/api/assessments/attempt/:attemptId/end', (req, res, next) => {
	// check perms

	// references to hold on to from various responses (so we don't have to nest thens)
	let updateResult
	let draftTree
	let attemptState
	let draftId
	let assessmentId
	let score
	let attemptHistory
	let maxAttemptScore
	let state
	let currentUser
	let isPreviewing

	req.requireCurrentUser()
	.then(user => {
		currentUser = user
		isPreviewing = user.canViewEditor
		// check input
		// insert
		// get draft and assessment ids for this attempt
		return db.one(`
			SELECT drafts.id AS draft_id, attempts.assessment_id, attempts.state as attempt_state
			FROM drafts
			JOIN attempts
			ON drafts.id = attempts.draft_id
			WHERE attempts.id = $1
		`, [req.params.attemptId])
	})
	.then(result => {
		assessmentId = result.assessment_id
		attemptState = result.attempt_state
		draftId = result.draft_id

		return DraftModel.fetchById(draftId)
	})
	.then(draft => {
		draftTree = draft
		return db.any(`
			SELECT *
			FROM attempts_question_responses
			WHERE attempt_id = $1
			`, [req.params.attemptId])
	})
	.then(responseHistory => {
		var assessment = draftTree.findNodeClass(assessmentId)
		state = {
			scores: [0],
			questions: attemptState.questions,
			scoresByQuestionId: {}
		}

		let promises = assessment.yell('ObojoboDraft.Sections.Assessment:attemptEnd', req, res, assessment, responseHistory, {
			getQuestions: () => { return state.questions },
			addScore: (questionId, score) => {
				state.scores.push(score);
				state.scoresByQuestionId[questionId] = score;
			}
		})

		return Promise.all(promises)
	})
	.then(() => {
		score = state.scores.reduce( (a, b) => { return a + b } ) / state.questions.length

		let scores = state.questions.map(question => {
			return {
				id: question.id,
				score: state.scoresByQuestionId[question.id] || 0
			}
		})

		let result = {
			attemptScore: score,
			scores: scores
		}
		return Assessment.updateAttempt(result, req.params.attemptId)
	})
	.then((updateAttemptResult) => {
		updateResult = updateAttemptResult
		return Assessment.getCompletedAssessmentAttemptHistory(currentUser.id, draftId, assessmentId, false)
	})
	.then((attemptHistory) => {
		if(isPreviewing) return Promise.resolve(false)

		let allScores = attemptHistory.map( attempt => { return parseFloat(attempt.result.attemptScore) } )
		maxAttemptScore = Math.max(0, ...allScores);

		return lti.replaceResult(currentUser.id, draftId, maxAttemptScore / 100)
	})
	.then(isScoreSent => {
		updateResult.ltiOutcomes = {
			sent: isScoreSent,
		}
		res.success(updateResult)
	})
	.catch(error => {
		console.log('error', error, error.toString());
		logAndRespondToUnexpected('Unexpected error', res, req, Error('Unexpected Error Completing your attempt.'))
	})
})

// gets the current user's attempts for all assessments for a specific draft
app.get('/api/drafts/:draftId/attempts', (req, res, next) => {
	// check perms
	req.requireCurrentUser()
	.then(currentUser => {
		// check input
		// select
		return db.manyOrNone(`
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
	})
	.then(result => {
		res.success({attempts: result})
	})
	.catch(error => {
		console.log('error', error, error.toString());
		logAndRespondToUnexpected('Unexpected error', res, req, Error('Unexpected Error Loading attempts.'))
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
		ON CONFLICT (attempt_id, question_id, responder_id) DO
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
