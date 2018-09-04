const Adapter = {
	construct(model) {
		model.setStateProp('latex', '')
		model.setStateProp('align', 'center', p => p.toLowerCase(), ['left', 'center', 'right'])
		model.setStateProp('label', '')
		model.setStateProp('size', '1em', p => (parseInt(p, 10) || 1) + 'em')
	},

	clone(model, clone) {
		clone.modelState.latex = model.modelState.latex
		clone.modelState.align = model.modelState.align
		clone.modelState.label = model.modelState.label
		clone.modelState.size = model.modelState.size
	},

	toJSON(model, json) {
		json.content.latex = model.modelState.latex
		json.content.align = model.modelState.align
		json.content.label = model.modelState.label
		json.content.size = model.modelState.size
	},

	toText(model) {
		return model.modelState.latex
	}
}

export default Adapter
