const attemptStart = require('./attempt-start')
const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'

const resumeAttempt = (req, res) => {
	const attempt = req.body
	let currentDocument = null
	let assessmentNode

	return req
		.requireCurrentUser()
		.then(() => {
			return req.requireCurrentDocument()
		})
		.then(draftDocument => {
			currentDocument = draftDocument
			assessmentNode = currentDocument.getChildNodeById(attempt.assessmentId)

			return Promise.all(
				attemptStart.getSendToClientPromises(assessmentNode, attempt.state, req, res)
			)
		})
		.then(() => {
			attempt.questions = []
			for (const node of attempt.state.chosen) {
				if (node.type === QUESTION_NODE_TYPE) {
					attempt.questions.push(assessmentNode.draftTree.getChildNodeById(node.id).toObject())
				}
			}

			res.success(attempt)
		})
}

module.exports = {
	resumeAttempt
}
