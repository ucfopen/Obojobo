let DraftNode = oboRequire('models/draft_node')

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
		console.log('hear', responseHistory)
		if(!assessment.contains(this.node)) return

		for(let i in responseHistory)
		{
			let responseRecord = responseHistory[i]

			if(responseRecord.question_id === this.node.id)
			{
				this.yell('ObojoboDraft.Chunks.Question:calculateScore', req.app, this, responseRecord, (function(score) {
					currentAttempt.addScore(this.node.id, score)
					console.log('gonna add a question', score, this.node.id)
				}).bind(this))
			}
		}
	}

}

module.exports = MCChoice
