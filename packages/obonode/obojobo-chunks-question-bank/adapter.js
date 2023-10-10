const Adapter = {
	construct(model) {
		model.setStateProp('choose', Infinity, p => parseInt(p, 10) || Infinity)
		model.setStateProp('select', 'sequential', p => p, ['sequential', 'random', 'random-unseen'])
		model.setStateProp('collapsed', false)
	},

	clone(model, clone) {
		clone.modelState.choose = model.modelState.choose
		clone.modelState.select = model.modelState.select
		clone.modelState.collapsed = model.modelState.collapsed
	},

	toJSON(model, json) {
		json.content.choose = model.modelState.choose
		json.content.select = model.modelState.select
		json.content.collapsed = model.modelState.collapsed
	}
}

export default Adapter
