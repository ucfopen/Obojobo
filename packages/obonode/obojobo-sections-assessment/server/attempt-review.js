const AssessmentModel = require('./models/assessment')
const attemptStart = require('./attempt-start')
const DraftModel = require('obojobo-express/server/models/draft')
const { getFullQuestionsFromDraftTree } = require('./util')
const logger = require('obojobo-express/server/logger')

// Extract draft caching to another function?
const getQuestionModelsFromAttempt = async (attemptId, draftCache) => {

	const attempt = await AssessmentModel.fetchAttemptByID(attemptId)
	let draftDocument

	// @TODO: need to optimize here:
	// ideally we could mark this content id as in
	// the process of being fetched so that we don't
	// queued up N requests to load it while waiting for
	// the first request to load
	if(draftCache[attempt.draftContentId]){
		// already loaded, get from cache
		draftDocument = draftCache[attempt.draftContentId]
	} else {
		draftDocument = await DraftModel.fetchDraftByVersion(
			attempt.draftId,
			attempt.draftContentId
		)
		draftCache[attempt.draftContentId] = draftDocument
	}

	const assessmentNode = draftDocument.getChildNodeById(attempt.assessmentId)

	if (assessmentNode.node.content.review !== 'always') {
		const res = {}
		const req = {}
		await Promise.all(attemptStart.getSendToClientPromises(assessmentNode, attempt.state, req, res))
	}

	const attemptQuestionModels = getFullQuestionsFromDraftTree(draftDocument, attempt.state.chosen)
	const attemptQuestionModelsMap = {}
	for (const questionModel of attemptQuestionModels) {
		attemptQuestionModelsMap[questionModel.id] = questionModel
	}

	return attemptQuestionModelsMap
}

const attemptReview = async attemptIds => {
	try {
		const promises = []
		const draftCache = {} // a place to cache draftDocuments for reuse

		// aysnc, let's get all the attmpts
		for (const attemptId of attemptIds) {
			promises.push(getQuestionModelsFromAttempt(attemptId, draftCache))
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
	} catch (error) {
		logger.error('attemptReview Error')
		logger.error(error)
	}
}

module.exports = attemptReview
