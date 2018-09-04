let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.score) != null) {
			model.modelState.score = attrs.content.score
			model.modelState._score = attrs.content.score
		} else {
			model.modelState.score = ''
		}
	},

	clone(model, clone) {
		clone.modelState.score = model.modelState.score
	},

	toJSON(model, json) {
		json.content.score = model.modelState.score
	}
}

export default Adapter
let __guard__ = (value, transform) => {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
