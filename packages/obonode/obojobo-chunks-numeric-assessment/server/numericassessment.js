const DraftNode = require('obojobo-express/server/models/draft_node')
const NumericAnswerEvaluator = require('../evaluation/numeric-answer-evaluator')
const numericChoicesToScoreRuleConfigs = require('../numeric-choices-to-score-rule-configs')

class NumericAssessment extends DraftNode {
	static get nodeName() {
		return 'ObojoboDraft.Chunks.NumericAssessment'
	}

	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'ObojoboDraft.Chunks.Question:calculateScore': this.onCalculateScore
		})
	}

	onCalculateScore(app, question, responseRecord, setScore) {
		if (!question.contains(this.node)) return

		// Construct the original JSON from the DraftNode objects
		const numericChoices = [...this.immediateChildrenSet].map(id => {
			const choiceDraftNode = this.draftTree.getChildNodeById(id)
			const choiceNode = choiceDraftNode.node

			choiceNode.children = [...choiceDraftNode.immediateChildrenSet].map(
				id => this.draftTree.getChildNodeById(id).node
			)

			return choiceNode
		})

		const scoreRuleConfigs = numericChoicesToScoreRuleConfigs(numericChoices)
		const evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs
		})

		const results = evaluator.evaluate(responseRecord.response.value)

		switch (results.status) {
			case 'passed':
			case 'failed':
				setScore(results.details.score)
				break

			default:
				setScore(0)
				break
		}
	}
}

module.exports = NumericAssessment
