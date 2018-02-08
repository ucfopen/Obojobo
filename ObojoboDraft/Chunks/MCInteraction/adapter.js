let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.responseType) != null) {
			model.modelState.responseType = attrs.content.responseType
		} else {
			model.modelState.responseType = ''
		}
	},

	clone(model, clone) {
		clone.modelState.responseType = model.modelState.responseType
	},

	toJSON(model, json) {
		json.content.responseType = model.modelState.responseType
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
