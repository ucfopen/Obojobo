let getQuestions = require('./questionselector')

let registration = {
	title: 'ObojoboDraft.Chunks.QuestionBank',
	instance: {
		listeners: {
			'internal:sendToClient': function(req, res) {
				// console.log('***************HEEARDDDDD=============================')
				console.log('@TODO, Memory leak?')
				this.children = []
			},
			'ObojoboDraft.Sections.Assessment:attemptStart': function(req, res, assessment, attemptHistory, currentAttempt) {
				let allQuestions = currentAttempt.getQuestions()
				let newQuestions = getQuestions(this, attemptHistory)
				// console.log('NEW QUSETIONS', newQuestions)

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

				// console.log('***************************SETTING QUESTIONS TO', allQuestions)

				currentAttempt.setQuestions(allQuestions)
			}
		}
	}
}


module.exports = registration