import numericChoicesToScoreRuleConfigs from './numeric-choices-to-score-rule-configs'
import Common from 'obojobo-document-engine/src/scripts/common'

const { TextGroup } = Common.textGroup

const Adapter = {
	construct(model, attrs) {
		const children = attrs && attrs.children ? attrs.children : []

		model.modelState.scoreRules = numericChoicesToScoreRuleConfigs(children || [])

		model.modelState.units = TextGroup.fromDescriptor(attrs.content.units, 1, {
			indent: 0,
			hangingIndent: false,
			align: 'left'
		})
	},

	clone(model, clone) {
		clone.modelState.scoreRules = { ...model.modelState.scoreRules }
		clone.modelState.units = model.modelState.units.clone()
	},

	toJSON(model, json) {
		json.content.units = model.modelState.units.toDescriptor()
	}
}

export default Adapter
