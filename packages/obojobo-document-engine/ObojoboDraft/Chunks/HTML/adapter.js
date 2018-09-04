let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.html) != null) {
			model.modelState.html = attrs.content.html
		} else {
			model.modelState.html = null
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.align) != null) {
			return (model.modelState.align = attrs.content.align)
		} else {
			return (model.modelState.align = 'left')
		}
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
		let node = document.createElement('p')
		node.innerHTML = model.modelState.html

		return node.textContent
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
