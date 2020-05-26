const Adapter = {
	construct(model) {
		model.setStateProp('latex', '')
		model.setStateProp('align', 'center', p => p.toLowerCase(), ['left', 'center', 'right'])
		model.setStateProp('label', '')
		model.setStateProp('size', '1em', p => Math.min(20, Math.max(0.1, parseFloat(p) || 1)) + 'em')
		model.setStateProp('alt')
	},

	clone(model, clone) {
		clone.modelState.latex = model.modelState.latex
		clone.modelState.align = model.modelState.align
		clone.modelState.label = model.modelState.label
		clone.modelState.size = model.modelState.size
		clone.modelState.alt = model.modelState.alt
	},

	toJSON(model, json) {
		json.content.latex = model.modelState.latex
		json.content.align = model.modelState.align
		json.content.label = model.modelState.label
		json.content.size = model.modelState.size
		json.content.alt = model.modelState.alt
	},

	toText(model) {
		return model.modelState.latex
	}
}

export default Adapter
