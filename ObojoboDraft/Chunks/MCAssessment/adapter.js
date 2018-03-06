let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.responseType) != null) {
			model.modelState.responseType = attrs.content.responseType
		} else {
			model.modelState.responseType = ''
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x => x.shuffle) == false) {
			model.modelState.shuffle = attrs.content.shuffle
		} else {
			model.modelState.shuffle = true
		}
	},

	clone(model, clone) {
		clone.modelState.responseType = model.modelState.responseType
		clone.modelState.shuffle = model.modelState.shuffle
	},

	toJSON(model, json) {
		json.content.responseType = model.modelState.responseType
		json.content.shuffle = model.modelState.shuffle
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
