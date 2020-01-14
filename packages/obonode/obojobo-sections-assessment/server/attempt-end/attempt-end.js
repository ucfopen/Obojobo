const helpers = require('./attempt-end-helpers')
const logger = require('obojobo-express/server/logger')

const endAttempt = async (req, res) => {
	const logSuccess = name => logger.info(`End attempt "${req.params.attemptId}" - ${name} success`)

	logger.info(
		`End attempt "${req.params.attemptId}" begin for user "${req.currentUser.id}" (Preview="${req.isPreview}")`
	)

	await helpers.getAttempt(req, res)
	logSuccess('getAttempt')

	await helpers.getAttemptHistory(req, res)
	logSuccess('getAttemptHistory')

	await helpers.getResponsesForAttempt(req, res)
	logSuccess('getResponsesForAttempt')

	await helpers.getCalculatedScores(req, res)
	logSuccess('getCalculatedScores')

	await helpers.completeAttempt(req, res)
	logSuccess('completeAttempt')

	await helpers.insertAttemptEndEvents(req, res)
	logSuccess('insertAttemptEndEvent')

	await helpers.sendHighestAssessmentScore(req, res)
	logSuccess('sendLTIScore')

	await helpers.insertAttemptScoredEvents(req, res)
	logSuccess('sendLTIScore')

	// return attempts
	return await helpers.getAttempts(req, res)
}

module.exports = endAttempt
