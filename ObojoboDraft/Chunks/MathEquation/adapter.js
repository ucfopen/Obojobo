let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.latex) != null) {
			model.modelState.latex = attrs.content.latex
		} else {
			model.modelState.latex = ''
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.align) != null) {
			model.modelState.align = attrs.content.align
		} else {
			model.modelState.align = 'center'
		}
	},

	clone(model, clone) {
		clone.modelState.latex = model.modelState.latex
		clone.modelState.align = model.modelState.align
	},

	toJSON(model, json) {
		json.content.latex = model.modelState.latex
		json.content.align = model.modelState.align
	},

	toText(model) {
		return model.modelState.latex
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
