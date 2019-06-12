const Assessment = require('../assessment')
const lti = require('obojobo-express/lti')
const insertEvents = require('./insert-events')
const _getCalculatedScores = require('./get-calculated-scores')

// functions are in execution order
module.exports = {
	getAttemptHistory(args) {
		return Assessment.getCompletedAssessmentAttemptHistory(
			args.user.id,
			args.attempt.draftId,
			args.attempt.assessmentId,
			args.isPreview
		)
	},

	getResponsesForAttempt(args) {
		return Assessment.getResponsesForAttempt(args.attemptId)
	},

	getCalculatedScores(args) {
		return _getCalculatedScores(
			args.req,
			args.res,
			args.attempt.assessmentModel,
			args.attempt.attemptState,
			args.attemptHistory,
			args.responsesForAttempt
		)
	},

	completeAttempt(args) {
		return Assessment.completeAttempt(
			args.attempt.assessmentId,
			args.attemptId,
			args.user.id,
			args.attempt.draftId,
			args.draftDocument.contentId,
			args.calculatedScores.attempt,
			args.calculatedScores.assessmentScoreDetails,
			args.isPreview
		)
	},

	insertAttemptEndEvents(args) {
		return insertEvents.insertAttemptEndEvents(
			args.user,
			args.draftDocument,
			args.attempt.assessmentId,
			args.attemptId,
			args.attempt.number,
			args.isPreview,
			args.req.hostname,
			args.req.connection.remoteAddress
		)
	},

	sendHighestAssessmentScore(args) {
		return lti.sendHighestAssessmentScore(
			args.user.id,
			args.draftDocument,
			args.attempt.assessmentId,
			args.isPreview
		)
	},

	insertAttemptScoredEvents(args) {
		return insertEvents.insertAttemptScoredEvents(
			args.user,
			args.draftDocument,
			args.attempt.assessmentId,
			args.assessmentScoreId,
			args.attemptId,
			args.attempt.number,
			args.calculatedScores.attempt.attemptScore,
			args.calculatedScores.assessmentScoreDetails.assessmentModdedScore,
			args.isPreview,
			args.ltiRequest.scoreSent,
			args.ltiRequest.status,
			args.ltiRequest.statusDetails,
			args.ltiRequest.gradebookStatus,
			args.ltiRequest.ltiAssessmentScoreId,
			args.req.hostname,
			args.req.connection.remoteAddress,
			args.calculatedScores.assessmentScoreDetails
		)
	},

	getAttempts(args) {
		return Assessment.getAttempts(
			args.user.id,
			args.attempt.draftId,
			args.isPreview,
			args.attempt.assessmentId
		)
	}
}
