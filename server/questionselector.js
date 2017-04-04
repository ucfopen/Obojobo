// 1. create a tree structure from the assessment question bank
// 2. create another tree structure from the attempt history
// 3. use the attempt history and node settings to trim the tree,
//  leaving only the nodes to send to the client
// 4. flatten the tree to only questions

let getBankOptions = (questionBankNode) => {
	let content = questionBankNode.content

	return ({
		choose: content.choose    || Infinity,
		select: content.select    || 'sequential',
	})
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

let constructUses = function(uses, node)
{
	// console.log('CU', node)
	if(uses.has(node.id))
	{
		uses.set(node.id, uses.get(node.id) + 1)
	}

	for(let i in node.children)
	{
		constructUses(uses, node.children[i])
	}
}

let getDraftNodesFromIds = function(draftTree, ids) {
	return ids.map( (id) => {
		return draftTree.findNodeClass(id).toObject()
	})
}

let chooseChildren = function(uses, draftTree, choose, select, node)
{
	console.log('choose children-', choose, select, node.id)

	let draftNode = draftTree.findNodeClass(node.id)
	let myChildren = [...draftNode.immediateChildrenSet]
	let slice

	switch(select)
	{
		case 'sequential':
			myChildren.sort(function(a, b) {
				return uses.get(a) - uses.get(b)
			})

			slice = getDraftNodesFromIds(draftTree, myChildren).slice(0, choose)

			break

		case 'random-all':
			myChildren = shuffleArray(myChildren)

			slice = getDraftNodesFromIds(draftTree, myChildren).slice(0, choose)

			break

		case 'random-unseen':
			myChildren.sort(function(a, b) {
				if(uses.get(a) === uses.get(b))
				{
					return Math.random() < 0.5 ? -1 : 1;
				}
				return uses.get(a) - uses.get(b)
			})

			slice = myChildren.map( (id) => {
				return draftTree.findNodeClass(id).toObject()
			}).slice(0, choose)

			break
	}

	console.log('i chose', slice.map(function(dn) { return dn.id }))

	return slice
}

let trimTree = function(uses, draftTree, node)
{
	if(node.type === 'ObojoboDraft.Chunks.QuestionBank')
	{
		console.log('TEST', node.id, node.content, node.content.choose)
		let opts = getBankOptions(node)
		node.children = chooseChildren(uses, draftTree, opts.choose, opts.select, node)
	}

	for(let i in node.children)
	{
		trimTree(uses, draftTree, node.children[i])
	}
}

let flattenTree = function(questions, node)
{
	if(node.type === 'ObojoboDraft.Chunks.Question')
	{
		questions.push(assessment.draftTree.findNodeClass(node.id))
	}

	for(let i in node.children)
	{
		flattenTree(questions, node.children[i])
	}
}

let getQuiz = function(assessment, attemptHistory) {
	let childrenIds = assessment.children[1].childrenSet

	let uses = new Map()
		childrenIds.forEach( (id) => {
		let type = assessment.draftTree.findNodeClass(id).node.type
		if(type === 'ObojoboDraft.Chunks.QuestionBank' || type === 'ObojoboDraft.Chunks.Question')
		{
			uses.set(id, 0)
		}
	})

	for(let i in attemptHistory)
	{
		constructUses(uses, attemptHistory[i].state.qb)
	}


	console.log('uses___', uses)

	assessmentQBTree = assessment.children[1].toObject()
	// console.log('assessmentQBTree', assessmentQBTree)

	trimTree(uses, assessment.draftTree, assessmentQBTree)

	let questions = []

	flattenTree(questions, assessmentQBTree)

	return {
		qb: assessmentQBTree,
		questions: questions
	}
}

module.exports = getQuiz











