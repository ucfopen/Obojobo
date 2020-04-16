const Assessment = require('./assessment')
const DraftModel = require('obojobo-express/server/models/draft')
const { getFullQuestionsFromDraftTree } = require('./util')
const logger = require('obojobo-express/server/logger')

const getQuestionModelsFromAttempt = async (attemptId, userId) => {
	try {
		const attempt = await Assessment.fetchAttemptByIdAndUserId(attemptId, userId)

		if (!attempt) throw Error(`Unable to load attempt ${attemptId} for user ${userId}`)

		// @TODO: memoize or cache this
		const draftDocument = await DraftModel.fetchDraftByVersion(
			attempt.draft_id,
			attempt.draft_content_id
		)

		const attemptQuestionModels = getFullQuestionsFromDraftTree(draftDocument, attempt.state.chosen)
		const attemptQuestionModelsMap = {}
		for (const questionModel of attemptQuestionModels) {
			attemptQuestionModelsMap[questionModel.id] = questionModel
		}

		return attemptQuestionModelsMap
	} catch (error) {
		logger.error('getQuestionModelsFromAttempt Error')
		logger.error(error)
		return {}
	}
}

const reviewAttempt = async (attemptIds, userId) => {
	// aysnc, let's get all the attmpts
	const promises = []
	for (const attemptId of attemptIds) {
		promises.push(getQuestionModelsFromAttempt(attemptId, userId))
	}
	const results = await Promise.all(promises)
	// now build an object
	// { <attemptId>: questionModels }
	let n = 0
	const questionModels = {}
	for (const attemptId of attemptIds) {
		questionModels[attemptId] = results[n]
		n++
	}

	return questionModels
}

module.exports = {
	reviewAttempt
}
