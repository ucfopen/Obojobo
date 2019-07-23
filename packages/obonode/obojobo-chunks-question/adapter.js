import Common from 'obojobo-document-engine/src/scripts/common'

const { OboModel } = Common.models

const Adapter = {
	construct(model) {
		model.setStateProp('type', 'default', p => p.toLowerCase(), ['default', 'survey'])
		model.setStateProp('solution', null, p => OboModel.create(p))
		model.setStateProp('showSolutionLabel', null, p => '' + p)
		model.setStateProp('hideSolutionLabel', null, p => '' + p)
	},

	clone(model, clone) {
		clone.modelState.type = model.modelState.type
		clone.modelState.showSolutionLabel = model.modelState.showSolutionLabel
		clone.modelState.hideSolutionLabel = model.modelState.hideSolutionLabel
		clone.modelState.solution = null

		if (model.modelState.solution) {
			clone.modelState.solution = Object.assign({}, model.modelState.solution)
		}
	},

	toJSON(model, json) {
		json.content.type = model.modelState.type
		json.content.showSolutionLabel = model.modelState.showSolutionLabel
		json.content.hideSolutionLabel = model.modelState.hideSolutionLabel
		json.content.solution = null

		if (model.modelState.solution) {
			json.content.solution = model.modelState.solution.toJSON()
		}
	}
}

export default Adapter
