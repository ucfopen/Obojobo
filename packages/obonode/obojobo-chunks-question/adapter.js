import Common from 'obojobo-document-engine/src/scripts/common'

const { OboModel } = Common.models

const Adapter = {
	construct(model) {
		model.setStateProp('type', 'default', p => p.toLowerCase(), ['default', 'survey'])
		model.setStateProp('solution', null, p => (p ? OboModel.create(p) : null))
		model.setStateProp('revealAnswer', 'default', p => p.toLowerCase(), [
			'default',
			'never',
			'always',
			'when-incorrect'
		])

		model.setStateProp('correctLabels', null, p => p.split('|'))
		model.setStateProp('incorrectLabels', null, p => p.split('|'))

		// Older versions of the document put correctLabels and incorrectLabels
		// on MCAssessment. For compatibility we'll use those if they exist
		// and this node doesn't define them.
		// @deprecated
		const child = model.children.at(model.children.models.length - 1)
		if (child && child.get('type') === 'ObojoboDraft.Chunks.MCAssessment') {
			if (!model.modelState.correctLabels && child.get('correctLabels')) {
				model.modelState.correctLabels = child.get('correctLabels')
			}
			if (!model.modelState.incorrectLabels && child.get('incorrectLabels')) {
				model.modelState.incorrectLabels = child.get('incorrectLabels')
			}
		}
	},

	clone(model, clone) {
		clone.modelState.type = model.modelState.type
		clone.modelState.correctLabels = model.modelState.correctLabels
			? model.modelState.correctLabels.slice(0)
			: null
		clone.modelState.incorrectLabels = model.modelState.incorrectLabels
			? model.modelState.incorrectLabels.slice(0)
			: null
		clone.modelState.solution = null

		if (model.modelState.solution) {
			clone.modelState.solution = Object.assign({}, model.modelState.solution)
		}
	},

	toJSON(model, json) {
		json.content.type = model.modelState.type
		json.content.correctLabels = model.modelState.correctLabels
			? model.modelState.correctLabels.join('|')
			: null
		json.content.incorrectLabels = model.modelState.incorrectLabels
			? model.modelState.incorrectLabels.join('|')
			: null
		json.content.solution = null

		if (model.modelState.solution) {
			json.content.solution = model.modelState.solution.toJSON()
		}
	}
}

export default Adapter
