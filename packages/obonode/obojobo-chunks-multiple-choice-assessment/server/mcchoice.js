const DraftNode = oboRequire('models/draft_node')

class MCChoice extends DraftNode {
	static nodeName = 'ObojoboDraft.Chunks.MCChoice'

	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Sections.Assessment:sendToAssessment': this.onSendToAssessment
		})
	}

	onSendToAssessment() {
		this.node.content.score = 0
	}
}

module.exports = MCChoice
