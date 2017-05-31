let DraftNode = oboRequire('models/draft_node')
// import DraftNode from '../../../models/draft_node'

class MCChoice extends DraftNode{
	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Sections.Assessment:sendToAssessment' : this.onSendToAssessment,
			'ObojoboDraft.Sections.Assessment:attemptEnd' : this.onAttemptEnd
		})
	}

	onSendToAssessment(req, res){
		this.node.content.practice = false
	}

	onAttemptEnd(req, res, assessment, responseHistory, currentAttempt) {
		if(!assessment.contains(this.node)) return

		let questionResponses = responseHistory.filter( (responseRecord) => {
			return responseRecord.question_id === this.node.id
		})

		if(questionResponses.length === 0) return

		return (
			this.yell('ObojoboDraft.Chunks.Question:calculateScore', req.app, this, questionResponses, (function(score) {
				currentAttempt.addScore(this.node.id, score)
			}).bind(this))
		)
	}
}

module.exports = MCChoice;