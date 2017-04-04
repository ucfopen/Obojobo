let DraftNode = oboRequire('models/draft_node')
let getQuestions = require('./questionselector')

class QuestionBank extends DraftNode{
	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Sections.Assessment:sendToClient': this.onSendToClient,
			'ObojoboDraft.Sections.Assessment:attemptStart': this.onAttemptStart
		})
	}

	onSendToClient(req, res){
		this.children = []
	}

	onAttemptStart(req, res, assessment, attemptHistory, currentAttempt) {
		console.log('OAS', this.node.id)
		let allQuestions = currentAttempt.getQuestions()
		console.log('allQuestions', this.node.id, allQuestions.map(function(q) { return q.id }))
		let newQuestions = getQuestions(this, attemptHistory)
		console.log('newQuestions', this.node.id, newQuestions.map(function(q) { return q.node.id }))

		// let insertionIndex = allQuestions.length
		let insertionIndex = null
		if(allQuestions.indexOf(this.node) > -1)
		{
			insertionIndex = allQuestions.indexOf(this.node)
			console.log('OK INSERTION INDEX IS NOW', insertionIndex)
			allQuestions.splice(insertionIndex, 1)
		}
		console.log('insertionIndex', this.node.id, insertionIndex)
		if(insertionIndex === null)
		{
			console.log('no insertion index, quit')
			return
		}

		console.log('KEEP IT UP')

		allQuestions = allQuestions
			.slice(0, insertionIndex)
			.concat(newQuestions)
			.concat(allQuestions.slice(insertionIndex))

		console.log('currentAttempt.setQuestions', this.node.id, allQuestions.map(function(q) { return q.node.id }))

		currentAttempt.setQuestions(allQuestions)
	}

}


module.exports = QuestionBank
