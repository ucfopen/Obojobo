const DraftNode = require('obojobo-express/server/models/draft_node')

class MateriaAssessmentNodeAssessment extends DraftNode {
	static get nodeName() {
		return 'ObojoboDraft.Chunks.MateriaAssessment'
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

module.exports = MateriaAssessmentNodeAssessment
