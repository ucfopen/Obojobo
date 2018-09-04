const Adapter = {
	construct(model) {
		model.setStateProp('choose', Infinity, p => parseInt(p, 10) || Infinity)
		model.setStateProp('select', 'sequential', p => p, [
			'sequential',
			'random-all',
			'random-unseen'
		])
	},

	clone(model, clone) {
		clone.modelState.choose = model.modelState.choose
		clone.modelState.select = model.modelState.select
	},

	toJSON(model, json) {
		json.content.choose = model.modelState.choose
		json.content.select = model.modelState.select
	}
}

export default Adapter
