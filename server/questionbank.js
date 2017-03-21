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
		let allQuestions = currentAttempt.getQuestions()
		let newQuestions = getQuestions(this, attemptHistory)

		let insertionIndex = allQuestions.length
		if(allQuestions.indexOf(this.node) > -1)
		{
			insertionIndex = allQuestions.indexOf(this.node)
			allQuestions.splice(insertionIndex, 1)
		}

		allQuestions = allQuestions
			.slice(0, insertionIndex)
			.concat(newQuestions)
			.concat(allQuestions.slice(insertionIndex))

		currentAttempt.setQuestions(allQuestions)
	}

}


module.exports = QuestionBank
