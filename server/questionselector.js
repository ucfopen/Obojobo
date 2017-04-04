let getQuestionHistory = (attemptHistory, questionBank) => {
	console.log('   GET QUESTION HISTORY', questionBank.node.id)

	let attempt, question
	let questionHistory = new Map(
		[...questionBank.immediateChildrenSet]
			.filter( (id) => {
				console.log('TEST', id, questionBank.draftTree.findNodeClass(id).node.type !== 'ObojoboDraft.Chunks.QuestionBank')
				return questionBank.draftTree.findNodeClass(id).node.type !== 'ObojoboDraft.Chunks.QuestionBank'
			} )
			.map( (id) => { return [id, 0] })
	)

	for(let i in attemptHistory)
	{
		attempt = attemptHistory[i]

		for(let j in attempt.state.questions)
		{
			question = attempt.state.questions[j]

			if(questionHistory.has(question.id))
			{
				questionHistory.set(question.id, questionHistory.get(question.id) + 1)
			}
		}
	}

	return questionHistory
}

let getQuestionHistoryArray = (questionHistory) => {
	return [...questionHistory.entries()].map( (item) => { return { id:item[0], timesUsed:item[1] } } )
}

let getRandomUnseenQuestions = (questionHistory, questionBank) => {
	let opts = getBankOptions(questionBank.node)
	let questionHistoryArray = getQuestionHistoryArray(questionHistory)

	// randomize
	questionHistoryArray = shuffleArray(questionHistoryArray)

	// sort so that the most unseen items are in the first array, the more seen items in the next, and so on
	questionHistoryArray.sort( (a, b) => {
		return a.timesUsed - b.timesUsed
	})

	return getQuestions(questionHistoryArray, questionBank, opts.choose)
}

let getRandomAllQuestions = (questionHistory, questionBank) => {
	let opts = getBankOptions(questionBank.node)
	let questionHistoryArray = getQuestionHistoryArray(questionHistory)

	// randomize
	questionHistoryArray = shuffleArray(questionHistoryArray)

	return getQuestions(questionHistoryArray, questionBank, opts.choose)
}

let getSequentialQuestions = (questionHistory, questionBank) => {
	console.log('   GET SEQ', questionBank.node.id, questionBank.node.content)
	let opts = getBankOptions(questionBank.node)
	let questionHistoryArray = getQuestionHistoryArray(questionHistory)
	console.log('   QH ARRAY', questionBank.node.id, questionHistoryArray)

	questionHistoryArray.sort( (a, b) => {
		if(a.timesUsed === b.timesUsed)
		{
			let children = [...questionBank.immediateChildrenSet]
			return children.indexOf(a.id) - children.indexOf(b.id)
		}

		return a.timesUsed - b.timesUsed
	})

	return getQuestions(questionHistoryArray, questionBank, opts.choose)
}

let getQuestions = (questionHistoryArray, questionBank, choose) => {
	console.log('   GET QUESTIONS', choose)

	let result = questionHistoryArray
		.filter( (questionItem) => {
			let question = questionBank.draftTree.findNodeClass(questionItem.id)
			let content = question.node.content
			let limitExceeded = content.limit && content.limit !== 0 && questionItem.timesUsed >= content.limit

			return !limitExceeded
		} )
		.slice(0, choose)
		.map( (questionItem) => {
			return questionBank.draftTree.findNodeClass(questionItem.id)
		} )

	console.log('   result')
	for(let i in result)
	{
		console.log('      ', result[i].node.id)
	}
	console.log('   ---------')

	return result
}

let shuffleArray = function(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

let getBankOptions = (questionBankNode) => {
	let content = questionBankNode.content

	return ({
		choose: content.choose    || Infinity,
		select: content.select    || 'sequential',
	})
}

module.exports = function(questionBank, attemptHistory) {
	let questionHistory = getQuestionHistory(attemptHistory, questionBank)
	console.log('QHISTORY', questionBank.node.id, questionHistory)
	let opts = getBankOptions(questionBank.node)

	switch(opts.select) {
		case 'random-all':          return getRandomAllQuestions(questionHistory, questionBank)
		case 'random-unseen':       return getRandomUnseenQuestions(questionHistory, questionBank)
		case 'sequential': default: return getSequentialQuestions(questionHistory, questionBank)
			break
	}
}
