let RouterAPI = require('../routerapi')
let Util = require('./util')
let DraftModel = require('../models/draft')

module.exports = class AssessmentRouter extends RouterAPI {
	constructor(router, db)
	{
		super(router, db, {
			attemptStart: ['post', '/attempt/start'],
			attemptEnd:   ['post', '/attempt/:attemptId/end'],
			getAttempts:  ['get',  '/attempts/user/:userId/draft/:draftId']
		})
	}

	attemptStart(endpoint, req, res, next) {
		// check perms

		// check input

		// insert
		let userId = 4; //@TODO - Hardcoded

		DraftModel.fetchById(req.body.draftId)
			.then( (draftTree) => {
				this.db
					.any(`
						SELECT *
						FROM attempts
						WHERE user_id = $1
						AND draft_id = $2
						AND assessment_id = $3
						AND completed_at IS NOT NULL
						ORDER BY completed_at
					`, [userId, req.body.draftId, req.body.assessmentId])
					.then( (attemptHistory) => {
						var assessment = draftTree.findNodeClass(req.body.assessmentId)

						var attemptState = {
							questions: [],
							data: {}
						}

						var questions = []
						var state = {} //@TODO Retrieve state

						assessment.yell('ObojoboDraft.Sections.Assessment:attemptStart', req, res, assessment, attemptHistory, {
							getQuestions: function() { return attemptState.questions },
							setQuestions: function(q) { attemptState.questions = q },
							getData:      function() { return attemptState.data },
							setData:      function(d) { attemptState.data = d },
						})

						let questionObjects = attemptState.questions.map( (question) => { return question.toObject() } )

						this.db
							.one(`
								INSERT INTO attempts (user_id, draft_id, assessment_id, state)
								VALUES($1, $2, $3, $4)
								RETURNING id
							`, [userId, req.body.draftId, req.body.assessmentId, { questions:questionObjects, data:attemptState.data }])
							.then( result => {
								for(let i in attemptState.questions)
								{
									attemptState.questions[i].yell('internal:sendToClient', req, res)
								}
								let clientQuestionObjects = attemptState.questions.map( (question) => { return question.toObject() } )

								res.success({
									attemptId: result.id,
									questions: clientQuestionObjects
								})
							})
							.catch( error => {
								this.logAndRespondToUnexpected('Unexpected DB error', endpoint, req, error)
							})
					})
					.catch( error => {
						this.logAndRespondToUnexpected('Unexpected DB error', endpoint, req, error)
					})
			})
			.catch( error => {
				res.missing(error.toString())
			})
	}

	attemptEnd(endpoint, req, res, next) {
		// check perms

		// check input

		// insert

		this.db
			// get draft and assessment ids for this attempt
			.one(`
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
						this.db
							.any(`
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

								assessment.yell('ObojoboDraft.Sections.Assessment:attemptEnd', req, res, assessment, responseHistory, {
									getQuestions: function() { return state.questions },
									addScore: function(questionId, score) {
										console.log('addScore', questionId, score)
										state.scores.push(score);
										state.scoresByQuestionId[questionId] = score;
									}
								})

								let score = state.scores.reduce( (a, b) => { return a + b } ) / state.questions.length

								console.log('we here');
								console.log(score);
								console.log(state);

								let scores = state.questions.map(function(question) {
									return {
										id: question.id,
										score: state.scoresByQuestionId[question.id] || 0
									}
								})

								this.db
									.none(`
										UPDATE attempts
										SET completed_at = now(), score = $1
										WHERE id = $2
									`, [score, req.params.attemptId])
									.then( result => {
										res.success({
											attemptScore: score,
											scores: scores
										})
									})
									.catch( error => {
										console.log('errora', error, error.toString());
										this.logAndRespondToUnexpected('Unexpected DB error', endpoint, req, error)
									})
							})
							.catch( error => {
								console.log('errorb', error, error.toString());
								this.logAndRespondToUnexpected('Unexpected DB error', endpoint, req, error)
							})
					})
					.catch( error => {
						console.log('errorc', error, error.toString());
						this.logAndRespondToUnexpected('Unable to get draft', endpoint, req, error)
					})
			})
			.catch( error => {
				console.log('errord', error, error.toString());
				this.logAndRespondToUnexpected('Unexpected DB error', endpoint, req, error)
			})
	}

	getAttempts(endpoint, req, res, next) {
		// check perms

		// check input
		if(!req.params.userId) {
			app.logError(endpoint, 'Missing userId', req)
			return req.missing('userId')
		}
		if(!req.params.draftId) {
			app.logError(endpoint, 'Missing draftId', req)
			return req.missing('draftId')
		}

		// select
		this.db
			.manyOrNone(`
				SELECT
					id AS "attemptId",
					created_at as "startDate",
					completed_at as "endDate",
					state,
					score
				FROM attempts
				WHERE user_id = $1
				AND draft_id = $2`
			, [req.params.userId, req.params.draftId])
			.then( result => {
				res.success({
					attempts: result
				})
			})
			.catch( error => {
				this.logAndRespondToUnexpected('Unexpected DB error', endpoint, req, error)
			})
	}
}