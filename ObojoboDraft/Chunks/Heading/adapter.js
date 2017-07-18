import Common from 'Common'

let { TextGroupAdapter } = Common.chunk.textChunk

let Adapter = {
	construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs)
		model.modelState.textGroup.maxItems = 1

		if (__guard__(attrs != null ? attrs.content : undefined, x => x.headingLevel)) {
			model.modelState.headingLevel = attrs.content.headingLevel
		} else {
			model.modelState.headingLevel = 1
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.align)) {
			model.modelState.align = attrs.content.align
		} else {
			model.modelState.align = 'left'
		}
	},

	clone(model, clone) {
		TextGroupAdapter.clone(model, clone)
		clone.modelState.headingLevel = model.modelState.headingLevel
		clone.modelState.align = model.modelState.align
	},

	toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json)
		json.content.headingLevel = model.modelState.headingLevel
		json.content.align = model.modelState.align
	},

	toText(model) {
		return TextGroupAdapter.toText(model)
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
