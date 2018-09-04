export default {
	construct(model, attrs) {
		if (attrs && attrs.content && attrs.content.src) {
			model.modelState.src = attrs.content.src
		} else {
			model.modelState.src = null
		}

		if (attrs && attrs.content && attrs.content.allow) {
			model.modelState.allow = attrs.content.allow
		} else {
			model.modelState.allow = null
		}
	},

	clone(model, clone) {
		clone.modelState.src = model.modelState.src
		clone.modelState.allow = model.modelState.allow
	},

	toJSON(model, json) {
		json.content.src = model.modelState.src
		json.content.allow = model.modelState.allow
	},

	toText(model) {
		return model.modelState.src + ' ' + model.modelState.allow
	}
}
