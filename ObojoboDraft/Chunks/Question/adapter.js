import Common from 'Common'

let { OboModel } = Common.models

let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x2 => x2.practice) != null) {
			model.modelState.practice = attrs.content.practice
		} else {
			model.modelState.practice = true
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x3 => x3.solution) != null) {
			model.modelState.solution = OboModel.create(attrs.content.solution)
		} else {
			model.modelState.solution = null
		}
	},

	clone(model, clone) {
		clone.modelState.type = model.modelState.type
		clone.modelState.practice = model.modelState.practice
		clone.modelState.solution = null

		if (model.modelState.solution != null) {
			clone.modelState.solution = Object.assign({}, model.modelState.solution)
		}
	},

	toJSON(model, json) {
		json.content.type = model.modelState.type
		json.content.solution = null

		if (model.modelState.solution != null) {
			json.content.solution = model.modelState.solution.toJSON()
		}
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
