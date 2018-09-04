let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.start) != null) {
			if (attrs.content.start === 'unlimited') {
				return (model.modelState.start = null)
			} else {
				return (model.modelState.start = attrs.content.start)
			}
		}
	},

	clone(model, clone) {
		return (clone.modelState.start = model.modelState.start)
	},

	toJSON(model, json) {
		return (json.content.start = model.modelState.start)
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
