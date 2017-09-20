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

		if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.label) != null) {
			model.modelState.label = attrs.content.label
		} else {
			model.modelState.label = ''
		}
	},

	clone(model, clone) {
		clone.modelState.latex = model.modelState.latex
		clone.modelState.align = model.modelState.align
		clone.modelState.label = model.modelState.label
	},

	toJSON(model, json) {
		json.content.latex = model.modelState.latex
		json.content.align = model.modelState.align
		json.content.label = model.modelState.label
	},

	toText(model) {
		return model.modelState.latex
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
