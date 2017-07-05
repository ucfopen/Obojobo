export default {
	construct(model, attrs) {
		if (attrs && attrs.content && attrs.content.src) {
			return (model.modelState.src = attrs.content.src)
		} else {
			return (model.modelState.src = null)
		}
	},

	clone(model, clone) {
		return (clone.modelState.src = model.modelState.src)
	},

	toJSON(model, json) {
		return (json.content.src = model.modelState.src)
	},

	toText(model) {
		return model.modelState.src
	}
}
