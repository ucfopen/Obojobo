const DraftNode = oboRequire('models/draft_node')

class QuestionBank extends DraftNode {
	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Sections.Assessment:sendToClient': this.onSendToClient
		})
	}

	onSendToClient() {
		this.children = []
	}
}

module.exports = QuestionBank
