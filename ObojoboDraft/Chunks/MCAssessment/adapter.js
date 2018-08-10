const Adapter = {
	construct(model, attrs) {
		const content = attrs && attrs.content ? attrs.content : {}

		model.modelState.responseType = content.responseType || 'pick-one'
		model.modelState.correctLabels = content.correctLabels ? content.correctLabels.split('|') : null
		model.modelState.incorrectLabels = content.incorrectLabels
			? content.incorrectLabels.split('|')
			: null
		model.modelState.shuffle = content.shuffle !== false
	},

	clone(model, clone) {
		clone.modelState.responseType = model.modelState.responseType
		clone.modelState.correctLabels = model.modelState.correctLabels
			? model.modelState.correctLabels.slice(0)
			: null
		clone.modelState.incorrectLabels = model.modelState.incorrectLabels
			? model.modelState.incorrectLabels.slice(0)
			: null
		clone.modelState.shuffle = model.modelState.shuffle
	},

	toJSON(model, json) {
		json.content.responseType = model.modelState.responseType
		json.content.correctLabels = model.modelState.correctLabels
			? model.modelState.correctLabels.join('|')
			: null
		json.content.incorrectLabels = model.modelState.incorrectLabels
			? model.modelState.incorrectLabels.join('|')
			: null
		json.content.shuffle = model.modelState.shuffle
	}
}

export default Adapter
