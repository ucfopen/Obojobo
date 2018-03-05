let db = oboRequire('db')
let DraftModel = oboRequire('models/draft')
let Assessment = require('./assessment')
let AssessmentRubric = require('./assessment-rubric')
let createCaliperEvent = oboRequire('routes/api/events/create_caliper_event') //@TODO
let insertEvent = oboRequire('insert_event')
let lti = oboRequire('lti')
let logger = oboRequire('logger')

let endAttempt = (req, res, user, attemptId, isPreviewing) => {
	let attempt
	let attemptHistory
	let responseHistory
	let calculatedScores
	let updateAttemptData
	let assessmentScoreId

	logger.info(`End attempt "${attemptId}" begin for user "${user.id}" (Preview="${isPreviewing}")`)

	return (
		//
		// Collect info
		//

		getAttempt(attemptId)
			.then(attemptResult => {
				logger.info(`End attempt "${attemptId}" - getAttempt success`)
				attempt = attemptResult
				return getAttemptHistory(user.id, attempt.draftId, attempt.assessmentId)
			})
			.then(attemptHistoryResult => {
				logger.info(`End attempt "${attemptId}" - getAttemptHistory success`)

				attemptHistory = attemptHistoryResult
				return getResponsesForAttempt(attemptId)
			})
			.then(responsesForAttemptResult => {
				logger.info(`End attempt "${attemptId}" - getResponsesForAttempt success`)
				return getCalculatedScores(
					req,
					res,
					attempt.assessmentModel,
					attempt.attemptState,
					attemptHistory,
					responsesForAttemptResult
				)
			})
			//
			// Update attempt and send event
			//
			.then(calculatedScoresResult => {
				logger.info(`End attempt "${attemptId}" - getCalculatedScores success`)

				calculatedScores = calculatedScoresResult

				return completeAttempt(
					attempt.assessmentId,
					attemptId,
					user.id,
					attempt.draftId,
					calculatedScores,
					isPreviewing
				)
			})
			.then(completeAttemptResult => {
				logger.info(`End attempt "${attemptId}" - completeAttempt success`)

				assessmentScoreId = completeAttemptResult.assessmentScoreId

				return insertAttemptEndEvents(
					user,
					attempt.draftId,
					attempt.assessmentId,
					attemptId,
					attempt.number,
					isPreviewing,
					req.hostname,
					req.connection.remoteAddress
				)
			})
			//
			// Send LTI score and send event
			//
			.then(() => {
				logger.info(`End attempt "${attemptId}" - insertAttemptEndEvent success`)

				return sendLTIHighestAssessmentScore(user.id, attempt.draftId, attempt.assessmentId)
			})
			.then(ltiRequestResult => {
				logger.info(`End attempt "${attemptId}" - sendLTIScore was executed`)

				insertAttemptScoredEvents(
					user,
					attempt.draftId,
					attempt.assessmentId,
					assessmentScoreId,
					attemptId,
					attempt.number,
					calculatedScores.attemptScore,
					calculatedScores.assessmentScore,
					isPreviewing,
					ltiRequestResult.scoreSent,
					ltiRequestResult.status,
					ltiRequestResult.error,
					ltiRequestResult.errorDetails,
					ltiRequestResult.ltiAssessmentScoreId,
					req.hostname,
					req.connection.remoteAddress
				)
			})
			.then(() => {
				return Assessment.getAttempts(user.id, attempt.draftId, attempt.assessmentId)
			})
	)
}

let getAttempt = attemptId => {
	let result

	return Assessment.getAttempt(attemptId)
		.then(selectResult => {
			result = selectResult
			return Assessment.getAttemptNumber(result.user_id, result.draft_id, attemptId)
		})
		.then(attemptNumber => {
			result.attemptNumber = attemptNumber
			return DraftModel.fetchById(result.draft_id)
		})
		.then(draftModel => {
			return {
				assessmentId: result.assessment_id,
				number: result.attemptNumber,
				attemptState: result.state,
				draftId: result.draft_id,
				model: draftModel,
				assessmentModel: draftModel.getChildNodeById(result.assessment_id)
			}
		})
}

let getAttemptHistory = (userId, draftId, assessmentId) => {
	return Assessment.getCompletedAssessmentAttemptHistory(userId, draftId, assessmentId, false)
}

let getResponsesForAttempt = (userId, draftId) => {
	return Assessment.getResponsesForAttempt(userId, draftId)
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

	let rubric = new AssessmentRubric(assessmentModel.node.content.rubric)
	let assessmentScoreDetails = rubric.getAssessmentScoreInfoForLatestAttempt(
		assessmentModel.node.content.attempts,
		allScores
	)

	return {
		attempt: {
			attemptScore,
			questionScores
		},
		assessmentScoreDetails
	}
}

let completeAttempt = (assessmentId, attemptId, userId, draftId, calculatedScores, preview) => {
	return Assessment.completeAttempt(
		assessmentId,
		attemptId,
		userId,
		draftId,
		calculatedScores.attempt,
		calculatedScores.assessmentScoreDetails,
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

let sendLTIHighestAssessmentScore = (userId, draftId, assessmentId) => {
	return lti.sendHighestAssessmentScore(userId, draftId, assessmentId)
}

let insertAttemptScoredEvents = (
	user,
	draftId,
	assessmentId,
	assessmentScoreId,
	attemptId,
	attemptNumber,
	attemptScore,
	assessmentScore,
	isPreviewing,
	ltiScoreSent,
	ltiScoreStatus,
	ltiScoreError,
	ltiScoreErrorDetails,
	ltiAssessmentScoreId,
	hostname,
	remoteAddress
) => {
	let { createAssessmentAttemptScoredEvent } = createCaliperEvent(null, hostname)
	return insertEvent({
		action: 'assessment:attemptScored',
		actorTime: new Date().toISOString(),
		payload: {
			attemptId,
			attemptCount: isPreviewing ? -1 : attemptNumber,
			attemptScore,
			assessmentScore: isPreviewing ? -1 : assessmentScore,
			ltiScoreSent,
			ltiScoreStatus,
			ltiScoreError,
			ltiScoreErrorDetails,
			assessmentScoreId,
			ltiAssessmentScoreId
		},
		userId: user.id,
		ip: remoteAddress,
		metadata: {},
		draftId: draftId,
		eventVersion: '2.0.0',
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
				ltiScoreSent: ltiScoreSent
			}
		})
	})
}

module.exports = {
	endAttempt,
	getAttempt,
	getAttemptHistory,
	getResponsesForAttempt,
	getCalculatedScores,
	calculateScores,
	completeAttempt,
	insertAttemptEndEvents,
	sendLTIHighestAssessmentScore,
	insertAttemptScoredEvents
}
