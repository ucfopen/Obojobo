let DraftNode = oboRequire('models/draft_node')

class Assessment extends DraftNode{
	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'internal:sendToClient' : this.onSendToClient
		})
	}

	onSendToClient(req, res){
		this.yell('ObojoboDraft.Sections.Assessment:sendToClient')
	}
}

module.exports = Assessment
