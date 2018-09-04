import Common from 'Common'

let TextGroup = Common.textGroup.TextGroup

let TextGroupAdapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.textGroup) != null) {
			model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, Infinity, {
				indent: 0
			})
		} else if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.label)) {
			model.modelState.label = attrs.content.label
		} else {
			model.modelState.label = ''
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x2 => x2.align)) {
			return (model.modelState.align = attrs.content.align)
		} else {
			return (model.modelState.align = 'center')
		}
	},

	clone(model, clone) {
		if (clone.modelState.textGroup) clone.modelState.textGroup = model.modelState.textGroup.clone()
		clone.modelState.label = model.modelState.label
		clone.modelState.align = model.modelState.align
	},

	toJSON(model, json) {
		if (json.content.textGroup) json.content.textGroup = model.modelState.textGroup.toDescriptor()
		json.content.label = model.modelState.label
		json.content.align = model.modelState.align
	},

	toText(model) {
		return model.modelState.textGroup.first.text.value
	}
}

export default TextGroupAdapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
