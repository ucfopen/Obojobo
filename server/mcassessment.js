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
				console.log('response records', responseRecords)
				let selectedItems = responseRecords.filter( (record) => { return record.response.set === true })
				console.log('selectedItems', selectedItems)
				//@TODO - Check to make sure there isn't more than one responseRecord (there shouldn't be for these type of questions)
				if(selectedItems.length > 1) throw 'Impossible response to non pick-all MCAssessment response'

				if(selectedItems.length === 0) return setScore(0)

				let mcChoice = this.draftTree.findNodeClass(selectedItems[0].responder_id)
				setScore(mcChoice.node.content.score)
				break

			case 'pick-all':
				// console.log('RESPONSE RECORDs');
				// console.log(responseRecords);

				let correctIds = new Set([...this.immediateChildrenSet]
					.filter( (id) => {
						return this.draftTree.findNodeClass(id).node.content.score === 100
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

				console.log('correct ids', Array.from(correctIds))
				console.log('response ids', Array.from(responseIds))

				if(correctIds.size !== responseIds.size) return setScore(0)
				correctIds.forEach( (id) => { if(!responseIds.has(id)) return setScore(0) } )
				return setScore(100)
		}
	}
}


module.exports = MCAssessment
