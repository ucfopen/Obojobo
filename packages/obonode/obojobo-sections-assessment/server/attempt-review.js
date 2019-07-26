const Assessment = require('./assessment')
const attemptStart = require('./attempt-start')
const DraftModel = require('obojobo-express/models/draft')
const { getFullQuestionsFromDraftTree } = require('./util')
const logger = require('obojobo-express/logger')

const getQuestionModelsFromAttempt = async (attemptId) => {
	const attempt = await Assessment.getAttempt(attemptId)

	// @TODO: memoize or cache this
	const draftDocument = await DraftModel.fetchDraftByVersion(
		attempt.draft_id,
		attempt.draft_content_id
	)

	const assessmentNode = draftDocument.getChildNodeById(attempt.assessment_id)

	if (assessmentNode.node.content.review !== 'always') {
		// @TODO: are res & req needed for OboModel.yell()?!
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

const reviewAttempt = async (attemptIds) => {
	try {

		// aysnc, let's get all the attmpts
		const promises = []
		for (const attemptId of attemptIds) {
			promises.push(getQuestionModelsFromAttempt(attemptId))
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

		res.send(questionModels)
	} catch (error) {
		logger.error('reviewAttempt Error')
		logger.error(error)
	}
}

module.exports = {
	reviewAttempt
}
