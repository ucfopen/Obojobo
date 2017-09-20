export default {
	construct(model, attrs) {
		if (attrs && attrs.content && attrs.content.src) {
			model.modelState.src = attrs.content.src
		} else {
			model.modelState.src = null
		}
	},

	clone(model, clone) {
		clone.modelState.src = model.modelState.src
	},

	toJSON(model, json) {
		json.content.src = model.modelState.src
	},

	toText(model) {
		return model.modelState.src
	}
}
