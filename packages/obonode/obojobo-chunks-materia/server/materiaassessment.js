const DraftNode = require('obojobo-express/server/models/draft_node')

class NumericAssessment extends DraftNode {
	static get nodeName() {
		return 'ObojoboDraft.Chunks.Materia'
	}

	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Chunks.Question:calculateScore': this.onCalculateScore
		})
	}

	onCalculateScore(app, question, responseRecord, setScore) {
		if (!question.contains(this.node)) return

		setScore(responseRecord.response.score)
	}
}

module.exports = NumericAssessment
