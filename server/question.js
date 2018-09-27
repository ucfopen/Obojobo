const DraftNode = oboRequire('models/draft_node')
// import DraftNode from '../../../models/draft_node'

class Question extends DraftNode {
	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Sections.Assessment:sendToAssessment': this.onSendToAssessment,
			'ObojoboDraft.Sections.Assessment:attemptEnd': this.onAttemptEnd
		})
	}

	onSendToAssessment() {
		this.node.content.mode = 'assessment'
	}

	onAttemptEnd(req, res, assessment, responseHistory, currentAttempt) {
		if (!assessment.contains(this.node)) return

		const questionResponses = responseHistory.filter(responseRecord => {
			return responseRecord.question_id === this.node.id
		})

		if (questionResponses.length === 0) return

		if (questionResponses.length > 1) throw 'Impossible response to MCAssessment question'

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
