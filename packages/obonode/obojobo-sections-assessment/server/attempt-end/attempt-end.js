const getAttempt = require('./get-attempt')
const helpers = require('./attempt-end-helpers')
const logger = require('obojobo-express/logger')

const endAttempt = async state => {
	const logSuccess = name => logger.info(`End attempt "${state.attemptId}" - ${name} success`)

	logger.info(
		`End attempt "${state.attemptId}" begin for user "${state.user.id}" (Preview="${
			state.isPreview
		}")`
	)

	state.attempt = await getAttempt(state.attemptId)
	logSuccess('getAttempt')

	state.attemptHistory = await helpers.getAttemptHistory(state)
	logSuccess('getAttemptHistory')

	state.responsesForAttempt = await helpers.getResponsesForAttempt(state)
	logSuccess('getResponsesForAttempt')

	state.calculatedScores = await helpers.getCalculatedScores(state)
	logSuccess('getCalculatedScores')

	state.assessmentScoreId = await helpers.completeAttempt(state).assessmentScoreId
	logSuccess('completeAttempt')

	await helpers.insertAttemptEndEvents(state)
	logSuccess('insertAttemptEndEvent')

	state.ltiRequest = await helpers.sendHighestAssessmentScore(state)
	logSuccess('sendLTIScore')

	await helpers.insertAttemptScoredEvents(state)
	logSuccess('sendLTIScore')

	// return attempts
	return await helpers.getAttempts(state)
}

module.exports = endAttempt
