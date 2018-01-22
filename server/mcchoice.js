let DraftNode = oboRequire('models/draft_node')

class MCChoice extends DraftNode {
	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			// this event not sent if assessment review
			'ObojoboDraft.Sections.Assessment:sendToAssessment': this.onSendToAssessment
		})
	}

	onSendToAssessment(req, res) {
		// @TODO put this back
		// this.node.content.score = 0
	}
}

module.exports = MCChoice
