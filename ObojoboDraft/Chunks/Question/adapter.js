import Common from 'Common'

const { OboModel } = Common.models

const Adapter = {
	construct(model) {
		model.setStateProp('mode', 'practice')
		model.setStateProp('solution', null, p => OboModel.create(p))
	},

	clone(model, clone) {
		clone.modelState.type = model.modelState.type
		clone.modelState.mode = model.modelState.mode
		clone.modelState.solution = null

		if (model.modelState.solution) {
			clone.modelState.solution = Object.assign({}, model.modelState.solution)
		}
	},

	toJSON(model, json) {
		json.content.type = model.modelState.type
		json.content.mode = model.modelState.mode
		json.content.solution = null

		if (model.modelState.solution) {
			json.content.solution = model.modelState.solution.toJSON()
		}
	}
}

export default Adapter
