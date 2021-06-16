const Adapter = {
	construct(model, attrs) {
		const content = attrs && attrs.content ? attrs.content : {}

		model.modelState.responseType = content.responseType || 'pick-one'
		model.modelState.shuffle = content.shuffle !== false
	},

	clone(model, clone) {
		clone.modelState.responseType = model.modelState.responseType
		clone.modelState.shuffle = model.modelState.shuffle
	},

	toJSON(model, json) {
		json.content.responseType = model.modelState.responseType
		json.content.shuffle = model.modelState.shuffle
	}
}

export default Adapter
