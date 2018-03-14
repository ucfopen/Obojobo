import Common from 'Common'

let { TextGroupAdapter } = Common.chunk.textChunk

let Adapter = {
	construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs)
		model.modelState.textGroup.maxItems = 1

		model.modelState.style = attrs.content.style ? attrs.content.style : 'default'
		model.modelState.workTitle = attrs.content.workTitle ? attrs.content.workTitle : null
		model.modelState.author = attrs.content.author ? attrs.content.author : null
	},

	clone(model, clone) {
		// TextGroupAdapter.clone(model, clone)
		// clone.modelState.headingLevel = model.modelState.headingLevel
		// clone.modelState.align = model.modelState.align
	},

	toJSON(model, json) {
		// TextGroupAdapter.toJSON(model, json)
		// json.content.headingLevel = model.modelState.headingLevel
		// json.content.align = model.modelState.align
	},

	toText(model) {
		return TextGroupAdapter.toText(model)
	}
}

export default Adapter
// function __guard__(value, transform) {
// 	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
// }
