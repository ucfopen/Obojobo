const Assessment = require('../assessment')
const lti = require('obojobo-express/server/lti')
const insertEvents = require('./insert-events')
const _getCalculatedScores = require('./get-calculated-scores')
const DraftDocument = require('obojobo-express/server/models/draft')

// functions are in execution order
module.exports = {
	getAttempt: async req => {
		const attempt = await Assessment.getAttempt(req.params.attemptId)
		const attemptNumber = await Assessment.getAttemptNumber(
			attempt.user_id,
			attempt.draft_id,
			req.params.attemptId
		)
		const draftDocument = await DraftDocument.fetchById(attempt.draft_id)

		req.attempt = {
			assessmentId: attempt.assessment_id,
			number: attemptNumber,
			attemptState: attempt.state,
			draftId: attempt.draft_id,
			model: draftDocument,
			assessmentModel: draftDocument.getChildNodeById(attempt.assessment_id)
		}
	},

	getAttemptHistory(req) {
		return Assessment.getCompletedAssessmentAttemptHistory(
			req.currentUser.id,
			req.attempt.draftId,
			req.attempt.assessmentId,
			req.currentVisit.is_preview,
			req.currentVisit.resource_link_id
		).then(attemptHistory => {
			req.attemptHistory = attemptHistory
		})
	},

	getResponsesForAttempt(req) {
		return Assessment.getResponsesForAttempt(req.params.attemptId).then(responsesForAttempt => {
			req.responsesForAttempt = responsesForAttempt
		})
	},

	getCalculatedScores(req, res) {
		return _getCalculatedScores(
			req,
			res,
			req.attempt.assessmentModel,
			req.attempt.attemptState,
			req.attemptHistory,
			req.responsesForAttempt
		).then(calculatedScores => {
			req.calculatedScores = calculatedScores
		})
	},

	completeAttempt(req) {
		return Assessment.completeAttempt(
			req.attempt.assessmentId,
			req.params.attemptId,
			req.currentUser.id,
			req.attempt.draftId,
			req.currentDocument.contentId,
			req.calculatedScores.attempt,
			req.calculatedScores.assessmentScoreDetails,
			req.currentVisit.is_preview,
			req.currentVisit.resource_link_id
		).then(result => {
			req.assessmentScoreId = result.assessmentScoreId
		})
	},

	insertAttemptEndEvents(req) {
		return insertEvents.insertAttemptEndEvents(
			req.currentUser,
			req.currentDocument,
			req.attempt.assessmentId,
			req.params.attemptId,
			req.attempt.number,
			req.currentVisit.is_preview,
			req.hostname,
			req.connection.remoteAddress,
			req.body.visitId
		)
	},

	sendHighestAssessmentScore(req) {
		return lti
			.sendHighestAssessmentScore(
				req.currentUser.id,
				req.currentDocument,
				req.attempt.assessmentId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id
			)
			.then(ltiRequest => {
				req.ltiRequest = ltiRequest
			})
	},

	insertAttemptScoredEvents(req) {
		return insertEvents.insertAttemptScoredEvents(
			req.currentUser,
			req.currentDocument,
			req.attempt.assessmentId,
			req.assessmentScoreId,
			req.params.attemptId,
			req.attempt.number,
			req.calculatedScores.attempt.attemptScore,
			req.calculatedScores.assessmentScoreDetails.assessmentModdedScore,
			req.currentVisit.is_preview,
			req.ltiRequest.scoreSent,
			req.ltiRequest.status,
			req.ltiRequest.statusDetails,
			req.ltiRequest.gradebookStatus,
			req.ltiRequest.ltiAssessmentScoreId,
			req.hostname,
			req.connection.remoteAddress,
			req.calculatedScores.assessmentScoreDetails,
			req.currentVisit.resource_link_id
		)
	},

	getAttempts(req) {
		return Assessment.getAttempts(
			req.currentUser.id,
			req.attempt.draftId,
			req.currentVisit.is_preview,
			req.currentVisit.resource_link_id,
			req.attempt.assessmentId
		)
	}
}
