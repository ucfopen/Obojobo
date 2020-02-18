import numericChoicesToScoreRuleConfigs from './numeric-choices-to-score-rule-configs'

const Adapter = {
	construct(model, attrs) {
		const content = attrs && attrs.content ? attrs.content : {}

		model.modelState.scoreRules = numericChoicesToScoreRuleConfigs(content.numericChoices || [])
	},

	clone(model, clone) {},

	toJSON(model, json) {}
}

export default Adapter
