const Adapter = {
	construct(model) {
		model.setStateProp('html', null)
		model.setStateProp('align', 'left', p => p.toLowerCase(), ['left', 'center', 'right'])
	},

	clone(model, clone) {
		clone.modelState.html = model.modelState.html
		clone.modelState.align = model.modelState.align
	},

	toJSON(model, json) {
		json.content.html = model.modelState.html
		json.content.align = model.modelState.align
	},

	toText(model) {
		const node = document.createElement('p')
		node.innerHTML = model.modelState.html

		return node.textContent
	}
}

export default Adapter
