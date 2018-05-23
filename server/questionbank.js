const DraftNode = oboRequire('models/draft_node')
const _ = require('underscore')
const logger = oboRequire('logger')

const SELECT_SEQUENTIAL = 'sequential'
const SELECT_RANDOM = 'random_all'
const SELECT_RANDOM_UNSEEN = 'random_unseen'

const CHOOSE_ALL = 'all'

class QuestionBank extends DraftNode {
	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
	}

	buildAssessment(questionUsesMap) {
		let { choose, select } = this.getContentValues()

		let chosenIds
		switch(select){
			case SELECT_SEQUENTIAL:
				chosenIds = this.createChosenArraySequentially(questionUsesMap, choose)
				break
			case SELECT_RANDOM:
				chosenIds = this.createChosenArrayRandomly(choose)
				break
			case SELECT_RANDOM_UNSEEN:
				chosenIds = this.createChosenArrayUnseenRandomly(questionUsesMap, choose)
			default:
				logger.error('Invalid Select Type for QuestionBank id='+this.id)
				chosenIds = this.createChosenArraySequentially(questionUsesMap, choose)
		}

		let chosenChildren = this.buildFromArray(chosenIds, questionUsesMap)

		let tree = this.toObject()
		tree.children = chosenChildren

		return tree
	}

	getContentValues(){
		let choose = this.node.content.choose
		if(!choose || choose == CHOOSE_ALL){
			choose = Infinity
		}

		let select = this.node.content.select
		if(!select){
			select = 'sequential'
		}

		return { choose, select }
	}

	// sends buildAssessment call to chosen children, and gathers responses
	buildFromArray(chosenIds, questionUsesMap){
		let chosenChildren = []

		for(let id of chosenIds){
			let childNode = this.draftTree.getChildNodeById(id)
			if(childNode.buildAssessment){
				chosenChildren.push(childNode.buildAssessment(questionUsesMap))
			}
		}

		return chosenChildren
	}

	// Choose questions in order, Prioritizing less used questions first
	// questions are first grouped by number of uses
	// but within those groups, questions are kept in order
	// only return up to the desired amount of questions per attempt.
	createChosenArraySequentially(questionUsesMap, choose) {
		return (
			// convert this questionBank's set of direct children *IDs* to an array
			[...this.immediateChildrenSet]
				// sort those ids based on the number of time's the've been used
				.sort((id1, id2) => questionUsesMap.get(id1) - questionUsesMap.get(id2))
				// reduce the array to the number of questions in attempt
				.slice(0, choose)
		)
	}

	// Randomly choose from all questions
	// Ignores the number of times a question is used
	// only return up to the desired amount of questions per attempt.
	createChosenArrayRandomly(choose) {
		// convert this questionBank's set of direct children *IDs* to an array
		const oboNodeQuestionIds = [...this.immediateChildrenSet]
		// shuffle the array
		return (
			_.shuffle(oboNodeQuestionIds)
				// reduce the array to the number of questions in attempt
				.slice(0, choose)
		)
	}

	// Randomly chooses unseen questions to display.
	// prioritizes questions that have been seen less
	// will still return questions that have been seen
	createChosenArrayUnseenRandomly(questionUsesMap, choose) {
		// convert this questionBank's (via rootId) set of direct children *IDs* to an array
		return (
			[...this.immediateChildrenSet]
				// sort, prioritizing unseen questions
				.sort((id1, id2) => {
					// these questsions have been seen the same number of times
					// randomize their order reletive to each other [a, b] or [b, a]
					if (questionUsesMap.get(id1) === questionUsesMap.get(id2)) {
						return Math.random() - 0.5
					}
					// these questions have not been seen the same number of times
					// place the lesser seen one first
					return questionUsesMap.get(id1) - questionUsesMap.get(id2)
				})
				// reduce the array to the number of questions in attempt
				.slice(0, choose)
		)
	}

}

module.exports = QuestionBank
