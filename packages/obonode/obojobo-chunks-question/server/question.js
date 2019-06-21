const DraftNode = require('obojobo-express/models/draft_node')

class Question extends DraftNode {
	static get nodeName() {
		return 'ObojoboDraft.Chunks.Question'
	}

	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Sections.Assessment:attemptEnd': this.onAttemptEnd
		})
	}

	buildAssessment() {
		return this.toObject()
	}

	onAttemptEnd(req, res, assessment, responseHistory, currentAttempt) {
		if (!assessment.contains(this.node)) return

		// Survey type questions have no score:
		if (this.node.content.type && this.node.content.type.toLowerCase() === 'survey') {
			return
		}

		const questionResponses = responseHistory.filter(responseRecord => {
			return responseRecord.question_id === this.node.id
		})

		if (questionResponses.length > 1) throw 'Impossible response to MCAssessment question'

		// If there was no response to this question then set score to 0 by default
		if (questionResponses.length === 0) {
			currentAttempt.addScore(this.node.id, 0)
			return
		}

		// Otherwise, determine the score
		return this.yell(
			'ObojoboDraft.Chunks.Question:calculateScore',
			req.app,
			this,
			questionResponses[0],
			score => {
				currentAttempt.addScore(this.node.id, score)
			}
		)
	}
}

module.exports = Question
