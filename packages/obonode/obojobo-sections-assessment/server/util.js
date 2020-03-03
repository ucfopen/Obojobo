const logger = require('obojobo-express/server/logger')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const logAndRespondToUnexpected = (errorMessage, res, req, jsError) => {
	logger.error('logAndRespondToUnexpected', errorMessage, jsError)
	res.unexpected(errorMessage)
}

const getRandom = () => Math.random()

// An individual assessment's state only contains the id and type of each question chosen for the
// respective assessment. A question is either a question bank or a regular question. This
// function is used to take this metadata and return a list of full question data when
// a client requests to start an attempt, so the client can load the questions.
const getFullQuestionsFromDraftTree = (draftTree, questionMetadata) => {
	const questions = []

	for (const question of questionMetadata) {
		// the client does not need question bank nodes to render the assessment
		if (question.type === QUESTION_NODE_TYPE) {
			questions.push(draftTree.getChildNodeById(question.id).toObject())
		}
	}

	return questions
}

module.exports = {
	getFullQuestionsFromDraftTree,
	getRandom,
	logAndRespondToUnexpected
}
