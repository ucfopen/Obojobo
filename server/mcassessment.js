let DraftNode = oboRequire('models/draft_node')

class MCAssessment extends DraftNode {

	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Chunks.Question:calculateScore': this.onCalculateScore
		})
	}

	onCalculateScore(app, question, responseRecords, setScore){
		if(!question.contains(this.node)) return

		// console.log('RES RECS', responseRecords)

		switch(this.node.content.responseType)
		{
			case 'pick-one':
			case 'pick-one-multiple-correct':
				let selectedItems = responseRecords.filter( (record) => { return record.response.set === true })
				//@TODO - Check to make sure there isn't more than one responseRecord (there shouldn't be for these type of questions)
				if(selectedItems.length > 1) throw 'Impossible response to non pick-all MCAssessment response'

				if(selectedItems.length === 0) return setScore(0)

				let mcChoice = this.draftTree.getChildNodeById(selectedItems[0].responder_id)
				setScore(mcChoice.node.content.score)
				break

			case 'pick-all':
				let correctIds = new Set([...this.immediateChildrenSet]
					.filter( (id) => {
						return this.draftTree.getChildNodeById(id).node.content.score === 100
					}))

				let responseIds = new Set(
					responseRecords.filter(
						(record) => {
							return record.response.set === true
						}
					)
					.map(
						(record) => {
							return record.responder_id
						}
					)
				)

				if(correctIds.size !== responseIds.size) return setScore(0)

				let score = 100
				correctIds.forEach( (id) => { if(!responseIds.has(id)) score = 0 })
				return setScore(score)
		}
	}
}


module.exports = MCAssessment
