const DraftDocument = require('obojobo-express/models/draft')
const Assessment = require('./assessment')
const AssessmentRubric = require('../assessment-rubric')
const createCaliperEvent = require('obojobo-express/routes/api/events/create_caliper_event')
const insertEvent = require('obojobo-express/insert_event')
const lti = require('obojobo-express/lti')
const logger = require('obojobo-express/logger')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const endAttempt = (req, res, user, draftDocument, attemptId, isPreview) => {
	let attempt
	let attemptHistory
	let calculatedScores
	let assessmentScoreId

	logger.info(`End attempt "${attemptId}" begin for user "${user.id}" (Preview="${isPreview}")`)

	return getAttempt(attemptId)
		.then(attemptResult => {
			logger.info(`End attempt "${attemptId}" - getAttempt success`)

			attempt = attemptResult
			return getAttemptHistory(user.id, attempt.draftId, attempt.assessmentId, isPreview)
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
		.then(calculatedScoresResult => {
			//
			// Update attempt and send event
			//
			logger.info(`End attempt "${attemptId}" - getCalculatedScores success`)

			calculatedScores = calculatedScoresResult

			return completeAttempt(
				attempt.assessmentId,
				attemptId,
				user.id,
				attempt.draftId,
				draftDocument.contentId,
				calculatedScores,
				isPreview
			)
		})
		.then(completeAttemptResult => {
			logger.info(`End attempt "${attemptId}" - completeAttempt success`)

			assessmentScoreId = completeAttemptResult.assessmentScoreId

			// return reloadAttemptStateIfReviewing(
			// 	attemptId,
			// 	attempt.draftId,
			// 	attempt,
			// 	draftDocument,
			// 	user,
			// 	isPreview,
			// 	attemptHistory
			// )
		})
		.then(() => {
			return insertAttemptEndEvents(
				user,
				draftDocument,
				attempt.assessmentId,
				attemptId,
				attempt.number,
				isPreview,
				req.hostname,
				req.connection.remoteAddress
			)
		})
		.then(() => {
			//
			// Send LTI score and send event
			//
			logger.info(`End attempt "${attemptId}" - insertAttemptEndEvent success`)

			return lti.sendHighestAssessmentScore(user.id, draftDocument, attempt.assessmentId, isPreview)
		})
		.then(ltiRequestResult => {
			logger.info(`End attempt "${attemptId}" - sendLTIScore was executed`)

			return insertAttemptScoredEvents(
				user,
				draftDocument,
				attempt.assessmentId,
				assessmentScoreId,
				attemptId,
				attempt.number,
				calculatedScores.attempt.attemptScore,
				calculatedScores.assessmentScoreDetails.assessmentModdedScore,
				isPreview,
				ltiRequestResult.scoreSent,
				ltiRequestResult.status,
				ltiRequestResult.statusDetails,
				ltiRequestResult.gradebookStatus,
				ltiRequestResult.ltiAssessmentScoreId,
				req.hostname,
				req.connection.remoteAddress,
				calculatedScores.assessmentScoreDetails
			)
		})
		.then(() => Assessment.getAttempts(user.id, attempt.draftId, isPreview, attempt.assessmentId))
}

const getAttempt = attemptId => {
	let result

	return Assessment.getAttempt(attemptId)
		.then(selectResult => {
			result = selectResult
			return Assessment.getAttemptNumber(result.user_id, result.draft_id, attemptId)
		})
		.then(attemptNumber => {
			result.attemptNumber = attemptNumber
			return DraftDocument.fetchById(result.draft_id)
		})
		.then(draftDocument => ({
			assessmentId: result.assessment_id,
			number: result.attemptNumber,
			attemptState: result.state,
			draftId: result.draft_id,
			model: draftDocument,
			assessmentModel: draftDocument.getChildNodeById(result.assessment_id)
		}))
}

const getAttemptHistory = (userId, draftId, assessmentId, isPreview) =>
	Assessment.getCompletedAssessmentAttemptHistory(userId, draftId, assessmentId, isPreview)

const getResponsesForAttempt = (userId, draftId) =>
	Assessment.getResponsesForAttempt(userId, draftId)

const getCalculatedScores = (
	req,
	res,
	assessmentModel,
	attemptState,
	attemptHistory,
	responseHistory
) => {
	const scoreInfo = {
		scores: [0],
		chosenAssessment: attemptState.chosen,
		scoresByQuestionId: {}
	}

	const promises = assessmentModel.yell(
		'ObojoboDraft.Sections.Assessment:attemptEnd',
		req,
		res,
		assessmentModel,
		responseHistory,
		{
			//getQuestions: () => scoreInfo.questions,
			// this is only called by questions because question banks do not listen for ObojoboDraft.Sections.Assessment:attemptEnd
			addScore: (questionId, score) => {
				scoreInfo.scores.push(score)
				scoreInfo.scoresByQuestionId[questionId] = score
			}
		}
	)

	return Promise.all(promises).then(() =>
		calculateScores(assessmentModel, attemptHistory, scoreInfo)
	)
}

const calculateScores = (assessmentModel, attemptHistory, scoreInfo) => {
	const questionScores = []
	let numQuestions = 0

	for (const node of scoreInfo.chosenAssessment) {
		if (node.type === QUESTION_NODE_TYPE) {
			numQuestions++
			questionScores.push({ id: node.id, score: scoreInfo.scoresByQuestionId[node.id] || 0 })
		}
	}

	const attemptScore = scoreInfo.scores.reduce((a, b) => a + b) / numQuestions

	const allScores = attemptHistory
		.map(attempt => parseFloat(attempt.result.attemptScore))
		.concat(attemptScore)

	const numAttempts =
		typeof assessmentModel.node.content.attempts === 'undefined' ||
		assessmentModel.node.content.attempts === 'unlimited'
			? Infinity
			: parseInt(assessmentModel.node.content.attempts, 10)

	const rubric = new AssessmentRubric(assessmentModel.node.content.rubric)
	const assessmentScoreDetails = rubric.getAssessmentScoreInfoForAttempt(numAttempts, allScores)

	return {
		attempt: {
			attemptScore,
			questionScores
		},
		assessmentScoreDetails
	}
}

const completeAttempt = (
	assessmentId,
	attemptId,
	userId,
	draftId,
	contentId,
	calculatedScores,
	isPreview
) =>
	Assessment.completeAttempt(
		assessmentId,
		attemptId,
		userId,
		draftId,
		contentId,
		calculatedScores.attempt,
		calculatedScores.assessmentScoreDetails,
		isPreview
	)

const insertAttemptEndEvents = (
	user,
	draftDocument,
	assessmentId,
	attemptId,
	attemptNumber,
	isPreview,
	hostname,
	remoteAddress
) => {
	const { createAssessmentAttemptSubmittedEvent } = createCaliperEvent(null, hostname)
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
		draftId: draftDocument.draftId,
		contentId: draftDocument.contentId,
		eventVersion: '1.1.0',
		isPreview: isPreview,
		caliperPayload: createAssessmentAttemptSubmittedEvent({
			actor: { type: 'user', id: user.id },
			draftId: draftDocument.draftId,
			contentId: draftDocument.contentId,
			assessmentId,
			attemptId: attemptId
		})
	})
}

const insertAttemptScoredEvents = (
	user,
	draftDocument,
	assessmentId,
	assessmentScoreId,
	attemptId,
	attemptNumber,
	attemptScore,
	assessmentScore,
	isPreview,
	ltiScoreSent,
	ltiScoreStatus,
	ltiStatusDetails,
	ltiGradeBookStatus,
	ltiAssessmentScoreId,
	hostname,
	remoteAddress,
	scoreDetails
) => {
	const { createAssessmentAttemptScoredEvent } = createCaliperEvent(null, hostname)

	return lti
		.getLatestHighestAssessmentScoreRecord(user.id, draftDocument.draftId, assessmentId)
		.then(highestAssessmentScoreRecord => {
			return insertEvent({
				action: 'assessment:attemptScored',
				actorTime: new Date().toISOString(),
				payload: {
					attemptId,
					attemptCount: attemptNumber,
					attemptScore,
					assessmentScore,
					highestAssessmentScore: highestAssessmentScoreRecord.score,
					ltiScoreSent,
					ltiScoreStatus,
					ltiStatusDetails,
					ltiGradeBookStatus,
					assessmentScoreId,
					ltiAssessmentScoreId,
					scoreDetails
				},
				userId: user.id,
				ip: remoteAddress,
				metadata: {},
				draftId: draftDocument.draftId,
				contentId: draftDocument.contentId,
				eventVersion: '2.0.0',
				isPreview: isPreview,
				caliperPayload: createAssessmentAttemptScoredEvent({
					actor: { type: 'serverApp' },
					draftId: draftDocument.draftId,
					contentId: draftDocument.contentId,
					assessmentId,
					attemptId: attemptId,
					attemptScore,
					extensions: {
						attemptCount: attemptNumber,
						attemptScore,
						assessmentScore,
						highestAssessmentScore: highestAssessmentScoreRecord.score,
						ltiScoreSent
					}
				})
			})
		})
}

// const reloadAttemptStateIfReviewing = (
// 	attemptId,
// 	draftId,
// 	attempt,
// 	draftDocument,
// 	user,
// 	isPreview,
// 	attemptHistory
// ) => {
// 	const assessmentNode = attempt.assessmentModel

// 	// Do not reload the state if reviews are never allowed
// 	if (assessmentNode.node.content.review === 'never') {
// 		return null
// 	}

// 	const isLastAttempt = attempt.number === assessmentNode.node.content.attempts

// 	// Do not reload the state if reviews are only allowed after the last
// 	// attempt and this is not the last attempt
// 	if (assessmentNode.node.content.review === 'no-attempts-remaining' && !isLastAttempt) {
// 		return null
// 	}

// 	const assessmentProperties = loadAssessmentProperties(
// 		draftDocument,
// 		attempt,
// 		user,
// 		isPreview,
// 		attemptHistory
// 	)

// 	const state = attemptStart.getState(assessmentProperties)
// 	// Not ideal, but attempt-start needs this as a recursive structure to send
// 	// client promises
// 	state.questions = state.questions.map(q => q.toObject())

// 	// If reviews are always allowed, reload the state for this attempt
// 	// Each attempt's state will be reloaded as it finishes
// 	if (assessmentNode.node.content.review === 'always') {
// 		return Assessment.updateAttemptState(attemptId, state)
// 	}

// 	// If reviews are allowed after last attempt and this is the last attempt,
// 	// reload the states for all attempts
// 	if (assessmentNode.node.content.review === 'no-attempts-remaining' && isLastAttempt) {
// 		// Reload state for all previous attempts
// 		return Assessment.getAttempts(
// 			assessmentProperties.user.id,
// 			draftId,
// 			isPreview,
// 			assessmentProperties.id
// 		).then(result => {
// 			result.attempts.map(attempt => {
// 				attempt.state.qb = recreateChosenQuestionTree(
// 					attempt.state.qb,
// 					assessmentProperties.draftTree
// 				)

// 				const newQuestions = []

// 				attempt.state.questions.forEach(question => {
// 					newQuestions.push(getNodeQuestion(question.id, assessmentProperties.draftTree))
// 				})

// 				attempt.state.questions = newQuestions

// 				return Assessment.updateAttemptState(attempt.attemptId, attempt.state)
// 			})
// 		})
// 	}

// 	logger.error(`Error: Reached exceptional state while reloading state for ${attemptId}`)
// 	return null
// }

// const recreateChosenQuestionTree = (node, assessmentNode) => {
// 	if (node.type === QUESTION_NODE_TYPE) {
// 		return getNodeQuestion(node.id, assessmentNode)
// 	}

// 	const newChildren = []

// 	for (const child of node.children) {
// 		newChildren.push(recreateChosenQuestionTree(child, assessmentNode))
// 	}

// 	node.children = newChildren
// 	return node
// }

// Pulls down a single question from the draft
const getNodeQuestion = (nodeId, assessmentNode) => {
	return assessmentNode.getChildNodeById(nodeId).toObject()
}

// Pulls assessment properties out of the promise flow
// const loadAssessmentProperties = (draftTree, attempt, user, isPreview, attemptHistory) => {
// 	const assessmentNode = draftTree.getChildNodeById(attempt.assessmentId)

// 	return {
// 		user: user,
// 		isPreview: isPreview,
// 		draftTree: draftTree,
// 		id: attempt.assessmentId,
// 		oboNode: assessmentNode,
// 		nodeChildrenIds: assessmentNode.children[1].childrenSet,
// 		questionBank: assessmentNode.children[1],
// 		assessmentQBTree: assessmentNode.children[1].toObject(),
// 		attemptHistory: attemptHistory,
// 		numAttemptsTaken: null,
// 		childrenMap: null
// 	}
// }

module.exports = {
	endAttempt,
	getAttempt,
	getAttemptHistory,
	getResponsesForAttempt,
	getCalculatedScores,
	calculateScores,
	completeAttempt,
	insertAttemptEndEvents,
	sendLTIHighestAssessmentScore: lti.sendHighestAssessmentScore,
	insertAttemptScoredEvents,
	// reloadAttemptStateIfReviewing,
	// recreateChosenQuestionTree,
	getNodeQuestion,
	// loadAssessmentProperties
}
