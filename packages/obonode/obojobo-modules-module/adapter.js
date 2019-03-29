const Adapter = {
	construct(model) {
		model.setStateProp('start', null)
	},

	clone(model, clone) {
		clone.modelState.start = model.modelState.start
	},

	toJSON(model, json) {
		json.content.start = model.modelState.start
	}
}

export default Adapter
