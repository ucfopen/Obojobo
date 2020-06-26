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

		const scoreRuleConfigs = numericChoicesToScoreRuleConfigs(this.node.content.numericChoices)
		const evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs
		})

		const results = evaluator.evaluate(responseRecord.response.value)

		switch (results.status) {
			case 'inputInvalid':
				setScore(0)
				break

			default:
				setScore(results.details.score)
				break
		}

		// setScore(100)
	}
}

module.exports = NumericAssessment
