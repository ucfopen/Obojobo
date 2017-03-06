let getQuestions = require('./questionselector')

let registration = {
	title: 'ObojoboDraft.Chunks.QuestionBank',
	instance: {
		listeners: {
			'ObojoboDraft.Sections.Assessment:sendToClient': function(req, res) {
				this.children = []
			},
			'ObojoboDraft.Sections.Assessment:attemptStart': function(req, res, assessment, attemptHistory, currentAttempt) {
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
	}
}


module.exports = registration