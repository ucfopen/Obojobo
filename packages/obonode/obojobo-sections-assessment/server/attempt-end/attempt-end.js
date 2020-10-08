const AssessmentModel = require('../models/assessment')
const getCalculatedScores = require('./get-calculated-scores')
const insertEvents = require('./insert-events')
const logger = require('obojobo-express/server/logger')
const lti = require('obojobo-express/server/lti')

const endAttempt = async (req, res) => {
	// if (Math.random() > 0.5) {
	// 	throw 'Random error'
	// }

	const logSuccess = name => logger.info(`End attempt "${req.params.attemptId}" - ${name} success`)

	logger.info(
		`End attempt "${req.params.attemptId}" begin for user "${req.currentUser.id}" (Preview="${req.currentVisit.is_preview}")`
	)

	// get this attempt from the db
	const attempt = await AssessmentModel.fetchAttemptById(req.params.attemptId)

	// ensure the attempt is for the current module & version
	if (
		req.currentDocument.draftId !== attempt.draftId ||
		req.currentDocument.contentId !== attempt.draftContentId
	) {
		throw Error('Cannot end an attempt for a different module')
	}

	const attemptNumber = await AssessmentModel.getAttemptNumber(
		attempt.userId,
		attempt.draftId,
		req.params.attemptId
	)
	logSuccess('getAttempt')

	// load the completed attempt history from the database
	const attemptHistory = await AssessmentModel.getCompletedAssessmentAttemptHistory(
		req.currentUser.id,
		attempt.draftId,
		attempt.assessmentId,
		req.currentVisit.is_preview,
		req.currentVisit.resource_link_id
	)
	logSuccess('getAttemptHistory')

	// load all the responses for this attempt from the database
	const responsesForAttempt = await AssessmentModel.fetchResponsesForAttempts([
		req.params.attemptId
	])
	logSuccess('fetchResponsesForAttempt')

	// load the draft document to get the assessment model from the database
	const assessmentModel = req.currentDocument.getChildNodeById(attempt.assessmentId)
	// Run the assessment, responses, and history through the score calculator
	const calculatedScores = await getCalculatedScores(
		req,
		res,
		assessmentModel,
		attempt.state,
		attemptHistory,
		responsesForAttempt.values().next().value // return the first result. Note: can be undefined
	)
	logSuccess('getCalculatedScores')

	// Save the results and complete this attempt
	const { assessmentScoreId } = await AssessmentModel.completeAttempt(
		attempt.assessmentId,
		req.params.attemptId,
		req.currentUser.id,
		attempt.draftId,
		req.currentDocument.contentId,
		calculatedScores.attempt,
		calculatedScores.assessmentScoreDetails,
		req.currentVisit.is_preview,
		req.currentVisit.resource_link_id
	)
	logSuccess('completeAttempt')

	// save an event
	await insertEvents.insertAttemptEndEvents(
		req.currentUser.id,
		req.currentDocument.draftId,
		req.currentDocument.contentId,
		attempt.assessmentId,
		req.params.attemptId,
		attemptNumber || 1,
		req.currentVisit.is_preview,
		req.hostname,
		req.connection.remoteAddress,
		req.currentVisit.id
	)
	logSuccess('insertAttemptEndEvent')

	// send the lti score
	const ltiRequest = await lti.sendHighestAssessmentScore(
		req.currentUser.id,
		req.currentDocument,
		attempt.assessmentId,
		req.currentVisit.is_preview,
		req.currentVisit.resource_link_id
	)
	logSuccess('sendLTIScore')

	// save events for the lti scores
	await insertEvents.insertAttemptScoredEvents(
		req.currentUser,
		req.currentDocument,
		attempt.assessmentId,
		assessmentScoreId,
		req.params.attemptId,
		attemptNumber || 1,
		calculatedScores.attempt.attemptScore,
		calculatedScores.assessmentScoreDetails.assessmentModdedScore,
		req.currentVisit.is_preview,
		ltiRequest.scoreSent,
		ltiRequest.status,
		ltiRequest.statusDetails,
		ltiRequest.gradebookStatus,
		ltiRequest.ltiAssessmentScoreId,
		req.hostname,
		req.connection.remoteAddress,
		calculatedScores.assessmentScoreDetails,
		req.currentVisit.resource_link_id,
		req.currentVisit.id
	)
	logSuccess('insertAttemptScoredEvents')

	return {
		assessmentId: attempt.assessmentId,
		attemptId: req.params.attemptId,
		assessmentScoreId,
		...calculatedScores.assessmentScoreDetails
	}
}

module.exports = endAttempt
