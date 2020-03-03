const DraftNode = require('obojobo-express/server/models/draft_node')

class MCChoice extends DraftNode {
	static get nodeName() {
		return 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
	}

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
