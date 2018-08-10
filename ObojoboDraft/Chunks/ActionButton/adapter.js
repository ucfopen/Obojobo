import Common from 'Common'

const TextGroup = Common.textGroup.TextGroup

const TextGroupAdapter = {
	construct(model, attrs) {
		model.setStateProp('align', 'center', p => p.toLowerCase(), ['left', 'center', 'right'])

		if (attrs && attrs.content && attrs.content.textGroup) {
			model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, Infinity, {
				indent: 0
			})
		} else if (attrs && attrs.content && attrs.content.label) {
			model.modelState.label = attrs.content.label
		} else {
			model.modelState.label = ''
		}
	},

	clone(model, clone) {
		if (model.modelState.textGroup) clone.modelState.textGroup = model.modelState.textGroup.clone()
		if (typeof model.modelState.label !== 'undefined') {
			clone.modelState.label = model.modelState.label
		}
		clone.modelState.align = model.modelState.align
	},

	toJSON(model, json) {
		if (model.modelState.textGroup) {
			json.content.textGroup = model.modelState.textGroup.toDescriptor()
		}
		if (typeof model.modelState.label !== 'undefined') json.content.label = model.modelState.label
		json.content.align = model.modelState.align
	},

	toText(model) {
		return model.modelState.textGroup.first.text.value
	}
}

export default TextGroupAdapter
