let registration = {
	title: 'ObojoboDraft.Chunks.Question',
	instance: {
		listeners: {
			'ObojoboDraft.Sections.Assessment:attemptEnd': function(req, res, assessment, responseHistory, currentAttempt) {
				if(!assessment.contains(this.node)) return

				for(let i in responseHistory)
				{
					let responseRecord = responseHistory[i]

					if(responseRecord.question_id === this.node.id)
					{
						this.yell('ObojoboDraft.Chunks.Question:calculateScore', req.app, this, responseRecord, function(score) {
							currentAttempt.addScore(score)
						})
					}
				}
			}
		}
	}
}


module.exports = registration