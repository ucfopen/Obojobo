const Adapter = {
	construct(model) {
		model.setStateProp('score', '')
	},

	clone(model, clone) {
		clone.modelState.score = model.modelState.score
	},

	toJSON(model, json) {
		json.content.score = model.modelState.score
	}
}

export default Adapter
