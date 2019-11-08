const Assessment = require('../assessment')
const getCalculatedScores = require('./get-calculated-scores')
const insertEvents = require('./insert-events')
const logger = require('obojobo-express/logger')
const lti = require('obojobo-express/lti')

const endAttempt = async (req, res) => {
	const logSuccess = name => logger.info(`End attempt "${req.params.attemptId}" - ${name} success`)

	logger.info(
		`End attempt "${req.params.attemptId}" begin for user "${req.currentUser.id}" (Preview="${
			req.isPreview
		}")`
	)

	// get this attempt from the db
	const attempt = await Assessment.getAttempt(req.params.attemptId)

	// ensure the attempt is for the current module & version
	if(req.currentDocument.draftId !== attempt.draft_id || req.currentDocument.contentId !== attempt.draft_content_id) {
		throw "Cannot end an attempt for a different module"
	}

	const attemptNumber = await Assessment.getAttemptNumber(
		attempt.user_id,
		attempt.draft_id,
		req.params.attemptId
	)
	logSuccess('getAttempt')

	// load the completed attempt history from the database
	const attemptHistory = await Assessment.getCompletedAssessmentAttemptHistory(
		req.currentUser.id,
		attempt.draft_id,
		attempt.assessment_id,
		req.currentVisit.is_preview,
		req.currentVisit.resource_link_id
	)
	logSuccess('getAttemptHistory')

	// load all the responses for this attempt from the database
	const responsesForAttempt = await Assessment.getResponsesForAttempt(req.params.attemptId)
	logSuccess('getResponsesForAttempt')

	// load the draft document to get the assessment model from the database
	const assessmentModel = req.currentDocument.getChildNodeById(attempt.assessment_id)

	// Run the assessment, responses, and history through the score calculator
	const calculatedScores = await getCalculatedScores(
		req,
		res,
		assessmentModel,
		attempt.state,
		attemptHistory,
		responsesForAttempt
	)
	logSuccess('getCalculatedScores')

	// Save the results and complete this attempt
	const assessmentScoreId = await Assessment.completeAttempt(
		attempt.assessment_id,
		req.params.attemptId,
		req.currentUser.id,
		attempt.draft_id,
		req.currentDocument.contentId,
		calculatedScores.attempt,
		calculatedScores.assessmentScoreDetails,
		req.currentVisit.is_preview,
		req.currentVisit.resource_link_id
	)
	logSuccess('completeAttempt')

	// save an event
	await insertEvents.insertAttemptEndEvents(
		req.currentUser,
		req.currentDocument,
		attempt.assessment_id,
		req.params.attemptId,
		attemptNumber,
		req.currentVisit.is_preview,
		req.hostname,
		req.connection.remoteAddress
	)
	logSuccess('insertAttemptEndEvent')

	// send the lti score
	const ltiRequest = await lti.sendHighestAssessmentScore(
		req.currentUser.id,
		req.currentDocument,
		attempt.assessment_id,
		req.currentVisit.is_preview,
		req.currentVisit.resource_link_id
	)
	logSuccess('sendLTIScore')

	// save events for the lti scores
	await insertEvents.insertAttemptScoredEvents(
		req.currentUser,
		req.currentDocument,
		attempt.assessment_id,
		assessmentScoreId,
		req.params.attemptId,
		attemptNumber,
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
		req.currentVisit.resource_link_id
	)
	logSuccess('sendLTIScore')

	// return attempts
	return await Assessment.getAttempts(
		req.currentUser.id,
		attempt.draft_id,
		req.currentVisit.is_preview,
		req.currentVisit.resource_link_id,
		attempt.assessment_id
	)
}

module.exports = endAttempt
