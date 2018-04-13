let db = oboRequire('db')
let DraftModel = oboRequire('models/draft')
let Assessment = require('./assessment')
let AssessmentRubric = require('./assessment-rubric')
let createCaliperEvent = oboRequire('routes/api/events/create_caliper_event') //@TODO
let insertEvent = oboRequire('insert_event')
let lti = oboRequire('lti')
let logger = oboRequire('logger')
let attemptStart = require('./attempt-start')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

let endAttempt = (req, res, user, attemptId, isPreviewing) => {
	let attempt
	let attemptHistory
	let responseHistory
	let calculatedScores
	let updateAttemptData
	let assessmentScoreId
	let assessmentProperties = {
		user: null,
		isPreviewing: null,
		draftTree: null,
		id: null,
		node: null,
		nodeChildrenIds: null,
		assessmentQBTree: null,
		attemptHistory: null,
		numAttemptsTaken: null,
		childrenMap: null
	}

	logger.info(`End attempt "${attemptId}" begin for user "${user.id}" (Preview="${isPreviewing}")`)

	return (
		//
		// Collect info
		//

		getAttempt(attemptId)
			.then(attemptResult => {
				logger.info(`End attempt "${attemptId}" - getAttempt success`)
				attempt = attemptResult
				return DraftModel.fetchById(attempt.draftId)
			})
			.then(draftTree => {
				const assessmentNode = draftTree.getChildNodeById(attempt.assessmentId)

				assessmentProperties.user = user
				assessmentProperties.isPreviewing = isPreviewing

				assessmentProperties.draftTree = draftTree
				assessmentProperties.id = attempt.assessmentId
				assessmentProperties.oboNode = assessmentNode
				assessmentProperties.nodeChildrenIds = assessmentNode.children[1].childrenSet
				assessmentProperties.assessmentQBTree = assessmentNode.children[1].toObject()

				return getAttemptHistory(user.id, attempt.draftId, attempt.assessmentId)
			})
			.then(attemptHistoryResult => {
				logger.info(`End attempt "${attemptId}" - getAttemptHistory success`)

				attemptHistory = attemptHistoryResult
				assessmentProperties.attemptHistory = attemptHistoryResult
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
			.then((completeAttemptResult) => {
				logger.info(`End attempt "${attemptId}" - completeAttempt success`)
				assessmentScoreId = completeAttemptResult.assessmentScoreId

				return reloadAttemptStateIfReviewing(attemptId, attempt.draftId, assessmentProperties, attempt)
			})
			.then(() => {

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
	return Assessment.getCompletedAssessmentAttemptHistory(userId, draftId, assessmentId)
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

	let allScores = attemptHistory
		.map(attempt => {
			return parseFloat(attempt.result.attemptScore)
		})
		.concat(attemptScore)

	let rubric = new AssessmentRubric(assessmentModel.node.content.rubric)
	let assessmentScoreDetails = rubric.getAssessmentScoreInfoForAttempt(
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
			attemptCount: attemptNumber
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
			attemptCount: attemptNumber,
			attemptScore,
			assessmentScore,
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
				attemptCount: attemptNumber,
				attemptScore,
				assessmentScore,
				ltiScoreSent
			}
		})
	})
}

let reloadAttemptStateIfReviewing = (attemptId, draftId, assessmentProperties, attempt) => {
	let assessmentNode = attempt.assessmentModel

	// Do not reload the state if reviews are never allowed
	if(assessmentNode.node.content.review == 'never'){
		return null
	}

	let isLastAttempt = (attempt.number == assessmentNode.node.content.attempts)

	// Do not reload the state if reviews are only allowed after the last
	// attempt and this is not the last attempt
	if(assessmentNode.node.content.review == 'afterAttempts' && !isLastAttempt){
		return null
	}

	assessmentProperties.childrenMap = attemptStart.loadChildren(assessmentProperties)

	attemptStart.createChosenQuestionTree(assessmentProperties.assessmentQBTree, assessmentProperties)

	let questionObjects = attemptStart.getNodeQuestions(
		assessmentProperties.assessmentQBTree,
		assessmentProperties.oboNode,
		[]
	).map(q => q.toObject())

	let state = {
		questions: questionObjects,
		data: {},
		qb: assessmentProperties.assessmentQBTree
	}

	// If reviews are always allowed, reload the state for this attempt
	// Each attempt's state will be reloaded as it finishes
	if(assessmentNode.node.content.review == 'always'){
		return Assessment.updateAttemptState(attemptId, state)
	}

	// If reviews are allowed after last attempt and this is the last attempt,
	// reload the states for all attempts
	if(assessmentNode.node.content.review == 'afterAttempts' && isLastAttempt){

		// Reload state for this attempt
		Assessment.updateAttemptState(attemptId, state);

		// Reload state for all previous attempts
		return Assessment.getAttempts(assessmentProperties.user.id, draftId, assessmentProperties.id)
		.then(result => {
			result.attempts.map(attempt => {
				attempt.state.qb = recreateChosenQuestionTree(attempt.state.qb, assessmentProperties.draftTree)
				let newQuestions = []

				attempt.state.questions.map(question => {
					newQuestions.push(getNodeQuestion(question.id, assessmentProperties.draftTree))
				})

				attempt.state.questions = newQuestions;

				Assessment.updateAttemptState(attempt.attemptId, attempt.state);
			})
		})
	}

	logger.info(`Error: Reached exceptional state while reloading state for ${attemptId}`)
	return null
}

let recreateChosenQuestionTree = (node, assessmentNode) => {
	if (node.type === QUESTION_NODE_TYPE) {
		return getNodeQuestion(node.id,assessmentNode)
	}

	let newChildren = [];

	for (let child of node.children) {
		newChildren.push(recreateChosenQuestionTree(child, assessmentNode))
	}

	node.children = newChildren;
	return node;
}
// Pulls down a single question from the draft
let getNodeQuestion = (nodeId, assessmentNode) => {
	return assessmentNode.getChildNodeById(nodeId).toObject()
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
	insertAttemptScoredEvents,
	reloadAttemptStateIfReviewing,
	recreateChosenQuestionTree,
	getNodeQuestion
}
