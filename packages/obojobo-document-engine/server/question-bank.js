const DraftNode = oboRequire('models/draft_node')
const _ = require('underscore')
const logger = oboRequire('logger')
const { getRandom } = require('./util')

const SELECT_SEQUENTIAL = 'sequential'
const SELECT_RANDOM = 'random'
const SELECT_RANDOM_UNSEEN = 'random_unseen'

const CHOOSE_ALL = 'all'

class QuestionBank extends DraftNode {
	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)

		const { choose, select } = this.getContentValues()

		this.choose = choose
		this.select = select
	}

	buildAssessment(questionUsesMap) {
		let chosenIds
		switch (this.select) {
			case SELECT_SEQUENTIAL:
				chosenIds = this.createChosenArraySequentially(questionUsesMap)
				break
			case SELECT_RANDOM:
				chosenIds = this.createChosenArrayRandomly()
				break
			case SELECT_RANDOM_UNSEEN:
				chosenIds = this.createChosenArrayUnseenRandomly(questionUsesMap)
				break
			default:
				logger.error('Invalid Select Type for QuestionBank: ' + this.select)
				chosenIds = this.createChosenArraySequentially(questionUsesMap)
		}

		const chosenChildren = this.buildFromArray(chosenIds, questionUsesMap)

		const tree = this.toObject()
		tree.children = chosenChildren

		return tree
	}

	getContentValues() {
		let choose = this.node.content.choose
		if (!choose || choose === CHOOSE_ALL) {
			choose = Infinity
		}

		let select = this.node.content.select
		if (!select) {
			select = SELECT_SEQUENTIAL
		}

		return { choose, select }
	}

	// sends buildAssessment call to chosen children, and gathers responses
	buildFromArray(chosenIds, questionUsesMap) {
		const chosenChildren = []

		for (const id of chosenIds) {
			const childNode = this.draftTree.getChildNodeById(id)
			if (childNode.buildAssessment) {
				chosenChildren.push(childNode.buildAssessment(questionUsesMap))
			}
		}

		return chosenChildren
	}

	// Choose questions in order, Prioritizing less used questions first
	// questions are first grouped by number of uses
	// but within those groups, questions are kept in order
	// only return up to the desired amount of questions per attempt.
	createChosenArraySequentially(questionUsesMap) {
		return (
			// convert this questionBank's set of direct children *IDs* to an array
			[...this.immediateChildrenSet]
				// sort those ids based on the number of times they've been used
				.sort((id1, id2) => questionUsesMap.get(id1) - questionUsesMap.get(id2))
				// reduce the array to the number of questions in attempt
				.slice(0, this.choose)
		)
	}

	// Randomly choose from all questions
	// Ignores the number of times a question is used
	// only return up to the desired amount of questions per attempt.
	createChosenArrayRandomly() {
		// convert this questionBank's set of direct children *IDs* to an array
		const oboNodeQuestionIds = [...this.immediateChildrenSet]
		// shuffle the array
		return (
			_.shuffle(oboNodeQuestionIds)
				// reduce the array to the number of questions in attempt
				.slice(0, this.choose)
		)
	}

	// Randomly chooses unseen questions to display.
	// prioritizes questions that have been seen less
	// will still return questions that have been seen
	createChosenArrayUnseenRandomly(questionUsesMap) {
		// convert this questionBank's (via rootId) set of direct children *IDs* to an array
		return (
			[...this.immediateChildrenSet]
				// sort, prioritizing unseen questions
				.sort((id1, id2) => {
					// these questsions have been seen the same number of times
					// randomize their order reletive to each other [a, b] or [b, a]
					if (questionUsesMap.get(id1) === questionUsesMap.get(id2)) {
						return getRandom() - 0.5
					}
					// these questions have not been seen the same number of times
					// place the lesser seen one first
					return questionUsesMap.get(id1) - questionUsesMap.get(id2)
				})
				// reduce the array to the number of questions in attempt
				.slice(0, this.choose)
		)
	}
}

module.exports = QuestionBank
