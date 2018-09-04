import Common from 'Common'

let { TextGroupAdapter } = Common.chunk.textChunk

let Adapter = {
	construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs)
		model.modelState.textGroup.maxItems = 1

		if (__guard__(attrs != null ? attrs.content : undefined, x => x.url)) {
			model.modelState.url = attrs.content.url
		} else {
			model.modelState.url = null
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.size)) {
			model.modelState.size = attrs.content.size
		} else {
			model.modelState.size = 'small'
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x2 => x2.width)) {
			model.modelState.width = attrs.content.width
		} else {
			model.modelState.width = null
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x3 => x3.height)) {
			model.modelState.height = attrs.content.height
		} else {
			model.modelState.height = null
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x4 => x4.alt)) {
			model.modelState.alt = attrs.content.alt
		} else {
			model.modelState.alt = null
		}
	},

	clone(model, clone) {
		TextGroupAdapter.clone(model, clone)
		clone.modelState.url = model.modelState.url
		clone.modelState.size = model.modelState.size
		clone.modelState.width = model.modelState.width
		clone.modelState.height = model.modelState.height
		clone.modelState.alt = model.modelState.alt
	},

	toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json)
		json.content.url = model.modelState.url
		json.content.size = model.modelState.size
		json.content.width = model.modelState.width
		json.content.height = model.modelState.height
		json.content.alt = model.modelState.alt
	},

	toText(model) {
		return `Image: ${model.modelState.url}\n Caption: ${TextGroupAdapter.toText(model) ||
			model.modelState.alt}`
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
