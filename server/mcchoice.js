let DraftNode = oboRequire('models/draft_node')

class MCChoice extends DraftNode{
	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Sections.Assessment:sendToAssessment': this.onSendToAssessment
		})
	}

	onSendToAssessment(req, res){
		this.node.content.score = 0
	}

}

module.exports = MCChoice
