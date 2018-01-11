let db = oboRequire('db')
let DraftModel = oboRequire('models/draft')
let Assessment = require('./assessment')
let AssessmentScoreConditions = require('./assessment-score-conditions')
let createCaliperEvent = oboRequire('routes/api/events/create_caliper_event') //@TODO
let insertEvent = oboRequire('insert_event')
let lti = oboRequire('lti')

let endAttempt = (req, res, user, attemptId, isPreviewing) => {
	let attemptInfo
	let attemptHistory
	let responseHistory
	let calculatedScores
	let updateAttemptData
	let attemptNumber
	let assessmentScoreId
	let response

	/*
	let SCORE_SENT_STATUS_NOT_ATTEMPTED = 'not_attempted'
let SCORE_SENT_STATUS_SENT_BUT_UNVERIFIED = 'sent_but_unverified'
let SCORE_SENT_STATUS_SUCCESS = 'success'
let SCORE_SENT_STATUS_READ_MISMATCH = 'read_mismatch'
let SCORE_SENT_STATUS_ERROR = 'error'
	*/

	return (
		//
		// Collect info
		//
		getAttemptInfo(attemptId)
			.then(attemptInfoResult => {
				attemptInfo = attemptInfoResult
				return getAttemptHistory(user.id, attemptInfo.draftId, attemptInfo.assessmentId)
			})
			.then(attemptHistoryResult => {
				attemptHistory = attemptHistoryResult
				return getResponseHistory(attemptId)
			})
			.then(responseHistoryResult => {
				responseHistory = responseHistoryResult
				attemptNumber = responseHistory.length + 1
				return getCalculatedScores(
					req,
					res,
					attemptInfo.assessmentModel,
					attemptInfo.attemptState,
					attemptHistory,
					responseHistory
				)
			})
			//
			// Update attempt and send event
			//
			.then(calculatedScoresResult => {
				// calculatedScores.lti = ltiRequestResult
				calculatedScores = calculatedScoresResult

				return completeAttempt(
					attemptInfo.assessmentId,
					attemptId,
					user.id,
					attemptInfo.draftId,
					calculatedScores,
					isPreviewing
				)
			})
			.then(completeAttemptResult => {
				assessmentScoreId = completeAttemptResult.assessmentScoreId
				response = {
					attempt: completeAttemptResult.attemptData,
					assessmentScore: completeAttemptResult.attemptData.scores.assessmentScore,
					lti: null
				}

				return insertAttemptEndEvents(
					user,
					attemptInfo.draftId,
					attemptInfo.assessmentId,
					attemptId,
					attemptNumber,
					isPreviewing,
					req.hostname,
					req.connection.remoteAddress
				)
			})
			//
			// Update assessment, send LTI score and send event
			//
			// .then(updateAttemptResult => {
			// 	return Assessment.insertNewAssessmentScore(
			// 		user.id,
			// 		attemptInfo.draftId,
			// 		attemptInfo.assessmentId,
			// 		calculatedScores.assessmentScore,
			// 		isPreviewing
			// 	)
			// })
			.then(() => {
				return sendLTIScore(user, attemptInfo.draftId, calculatedScores.ltiScore, assessmentScoreId)
			})
			// .then(ltiRequestResult => {
			// 	calculatedScores.lti = ltiRequestResult
			// 	return updateAttempt(attemptId, calculatedScores)
			// })
			.then(ltiRequestResult => {
				response.lti = ltiRequestResult

				insertAttemptScoredEvents(
					user,
					attemptInfo.draftId,
					attemptInfo.assessmentId,
					attemptId,
					attemptNumber,
					calculatedScores.attemptScore,
					calculatedScores.assessmentScore,
					response.lti.scoreSent,
					response.lti.scoreRead,
					response.lti.status,
					req.hostname,
					req.connection.remoteAddress
				)

				return response
			})
	)
}

let getAttemptInfo = attemptId => {
	let result

	return db
		.one(
			`
		SELECT drafts.id AS draft_id, attempts.assessment_id, attempts.state as attempt_state
		FROM drafts
		JOIN attempts
		ON drafts.id = attempts.draft_id
		WHERE attempts.id = $1
	`,
			[attemptId]
		)
		.then(selectResult => {
			result = selectResult
			return DraftModel.fetchById(result.draft_id)
		})
		.then(draftModel => {
			return {
				assessmentId: result.assessment_id,
				attemptState: result.attempt_state,
				draftId: result.draft_id,
				model: draftModel,
				assessmentModel: draftModel.getChildNodeById(result.assessment_id)
			}
		})
}

let getAttemptHistory = (userId, draftId, assessmentId) => {
	return Assessment.getCompletedAssessmentAttemptHistory(userId, draftId, assessmentId, false)
}

let getResponseHistory = attemptId => {
	return db.any(
		`
	SELECT *
	FROM attempts_question_responses
	WHERE attempt_id = $1
	`,
		[attemptId]
	)
	// return Assessment.getResponseHistory([attemptId])
}

let getCalculatedScores = (
	req,
	res,
	assessmentModel,
	attemptState,
	attemptHistory,
	responseHistory
) => {
	let scoreInfo = {
		scores: [0],
		questions: attemptState.questions,
		scoresByQuestionId: {}
	}

	let promises = assessmentModel.yell(
		'ObojoboDraft.Sections.Assessment:attemptEnd',
		req,
		res,
		assessmentModel,
		responseHistory,
		{
			getQuestions: () => {
				return scoreInfo.questions
			},
			addScore: (questionId, score) => {
				console.log('ADD SCORE', questionId, score)
				scoreInfo.scores.push(score)
				scoreInfo.scoresByQuestionId[questionId] = score
			}
		}
	)

	return Promise.all(promises).then(() => {
		return calculateScores(assessmentModel, attemptHistory, scoreInfo)
	})
}

let calculateScores = (assessmentModel, attemptHistory, scoreInfo) => {
	console.log('calc scores', assessmentModel)
	console.log('2', attemptHistory)
	console.log('3', scoreInfo)

	let questionScores = scoreInfo.questions.map(question => {
		return {
			id: question.id,
			score: scoreInfo.scoresByQuestionId[question.id] || 0
		}
	})

	let attemptScore =
		scoreInfo.scores.reduce((a, b) => {
			return a + b
		}) / scoreInfo.questions.length

	let allScores = [attemptScore].concat(
		attemptHistory.map(attempt => {
			return parseFloat(attempt.result.attemptScore)
		})
	)

	console.log('questionScores', questionScores)
	console.log('allScores', allScores)

	let asc = new AssessmentScoreConditions(assessmentModel.node.content.scoreConditions)
	let assessmentScore = asc.getAssessmentScore(assessmentModel.node.content.attempts, allScores)

	return {
		attemptScore: attemptScore,
		assessmentScore: assessmentScore,
		ltiScore: assessmentScore === null ? null : assessmentScore / 100,
		questionScores: questionScores
	}
}

let completeAttempt = (assessmentId, attemptId, userId, draftId, calculatedScores, preview) => {
	console.log('complete attempt', calculatedScores)
	return Assessment.completeAttempt(
		assessmentId,
		attemptId,
		userId,
		draftId,
		calculatedScores,
		preview
	)
}

let insertAttemptEndEvents = (
	user,
	draftId,
	assessmentId,
	attemptId,
	attemptNumber,
	isPreviewing,
	hostname,
	remoteAddress
) => {
	let { createAssessmentAttemptSubmittedEvent } = createCaliperEvent(null, hostname)
	return insertEvent({
		action: 'assessment:attemptEnd',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId: attemptId,
			attemptCount: isPreviewing ? -1 : attemptNumber
		},
		userId: user.id,
		ip: remoteAddress,
		metadata: {},
		draftId: draftId,
		eventVersion: '1.1.0',
		caliperPayload: createAssessmentAttemptSubmittedEvent({
			actor: { type: 'user', id: user.id },
			draftId,
			assessmentId,
			attemptId: attemptId,
			isPreviewMode: isPreviewing
		})
	})
}

let sendLTIScore = (user, draftId, score, assessmentScoreId) => {
	return lti.sendAssessmentScore(user.id, draftId, score, assessmentScoreId)
}

// let insertAssessmentScore = (user, draftId, assessmentId,
// 	launchId,
// 	score,
// 	ltiScoreSent,
// 	ltiScoreRead,
// 	ltiStatus,
// 	ltiError,
// 	isPreviewing) => {
// 	return Assessment.insertAssessmentScore(
// 		user.id,
// 		draftId,
// 		assessmentId,
// 		launchId,
// 		score,
// 		ltiScoreSent,
// 		ltiScoreRead,
// 		ltiStatus,
// 		ltiError,
// 		isPreviewing
// 	)
// }

let insertAttemptScoredEvents = (
	user,
	draftId,
	assessmentId,
	attemptId,
	attemptNumber,
	attemptScore,
	assessmentScore,
	isPreviewing,
	ltiScoreSent,
	ltiScoreRead,
	ltiScoreStatus,
	hostname,
	remoteAddress
) => {
	let { createAssessmentAttemptScoredEvent } = createCaliperEvent(null, hostname)
	return insertEvent({
		action: 'assessment:attemptScored',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId: attemptId,
			attemptCount: isPreviewing ? -1 : attemptNumber,
			attemptScore: attemptScore,
			assessmentScore: isPreviewing ? -1 : assessmentScore,
			ltiScoreSent: ltiScoreSent,
			ltiScoreRead: ltiScoreRead,
			ltiScoreStatus: ltiScoreStatus
		},
		userId: user.id,
		ip: remoteAddress,
		metadata: {},
		draftId: draftId,
		eventVersion: '1.1.0',
		caliperPayload: createAssessmentAttemptScoredEvent({
			actor: { type: 'serverApp' },
			draftId,
			assessmentId,
			attemptId: attemptId,
			attemptScore,
			isPreviewMode: isPreviewing,
			extensions: {
				attemptCount: isPreviewing ? -1 : attemptNumber,
				attemptScore: attemptScore,
				assessmentScore: isPreviewing ? -1 : assessmentScore,
				ltiScoreSent: ltiScoreSent,
				ltiScoreRead: ltiScoreRead,
				ltiScoreStatus: ltiScoreStatus
			}
		})
	})
}

module.exports = {
	endAttempt,
	getAttemptInfo,
	getAttemptHistory,
	getResponseHistory,
	getCalculatedScores,
	calculateScores,
	completeAttempt,
	insertAttemptEndEvents,
	sendLTIScore,
	insertAttemptScoredEvents
}
