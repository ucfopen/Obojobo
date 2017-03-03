let registration = {
	title: 'ObojoboDraft.Chunks.MCAssessment',
	instance: {
		listeners: {
			'ObojoboDraft.Chunks.Question:calculateScore': function(app, question, responseRecord, setScore) {
				if(!question.contains(this.node)) return

				console.log('RESPONSE RECORD');
				console.log(responseRecord);

				switch(this.node.content.responseType)
				{
					case 'pick-one':
					case 'pick-one-multiple-correct':
						let answers = responseRecord.response.answers

						let mcChoice = this.draftTree.findNodeClass(responseRecord.responder_id)
						setScore(mcChoice.node.content.score)
						break

					case 'pick-all':
						let mcChoiceIds = [...this.immediateChildrenSet]
						for(let i in mcChoiceIds)
						{
							let mcChoiceId = mcChoiceIds[i]
							let mcChoice = this.draftTree.findNodeClass(mcChoiceId)
							if(
								(mcChoice.node.content.score === 0 && responseRecord.response.answers[mcChoiceId])
								||
								(mcChoice.node.content.score === 100 && !responseRecord.response.answers[mcChoiceId])
							)
							{
								return setScore(0)
							}
						}

						setScore(100)
						break
				}
			}
		}
	}
}


module.exports = registration