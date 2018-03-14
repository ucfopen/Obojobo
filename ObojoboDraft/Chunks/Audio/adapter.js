import Common from 'Common'

// let { TextGroupAdapter } = Common.chunk.textChunk

let Adapter = {
	construct(model, attrs) {
		model.modelState.src = attrs.content.src
	},

	clone(model, clone) {
		// TextGroupAdapter.clone(model, clone)
		// clone.modelState.url = model.modelState.url
		// clone.modelState.size = model.modelState.size
		// clone.modelState.width = model.modelState.width
		// clone.modelState.height = model.modelState.height
		// clone.modelState.alt = model.modelState.alt
	},

	toJSON(model, json) {
		// TextGroupAdapter.toJSON(model, json)
		// json.content.url = model.modelState.url
		// json.content.size = model.modelState.size
		// json.content.width = model.modelState.width
		// json.content.height = model.modelState.height
		// json.content.alt = model.modelState.alt
	}

	// toText(model) {
	// 	// return `Image: ${model.modelState.url}\n Caption: ${TextGroupAdapter.toText(model) ||
	// 	// 	model.modelState.alt}`
	// }
}

export default Adapter
// function __guard__(value, transform) {
// 	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
// }
