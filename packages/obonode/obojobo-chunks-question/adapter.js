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

		// Older versions of the document put correctLabels and incorrectLabels
		// on MCAssessment. For compatibility we'll use those if they exist
		// and this node doesn't define them.
		// @deprecated
		const content = model.get('content')
		const children = model.get('children') // Need to pull the original children data
		const mcAssessmentContent =
			children &&
			children.length > 0 &&
			children[children.length - 1].type === 'ObojoboDraft.Chunks.MCAssessment'
				? children[children.length - 1].content || {}
				: {}
		if (!content.correctLabels && mcAssessmentContent.correctLabels) {
			content.correctLabels = mcAssessmentContent.correctLabels
		}
		if (!content.incorrectLabels && mcAssessmentContent.incorrectLabels) {
			content.incorrectLabels = mcAssessmentContent.incorrectLabels
		}

		model.setStateProp('correctLabels', null, p => p.split('|'))
		model.setStateProp('partialLabels', null, p => p.split('|'))
		model.setStateProp('incorrectLabels', null, p => p.split('|'))
	},

	clone(model, clone) {
		clone.modelState.type = model.modelState.type
		clone.modelState.correctLabels = model.modelState.correctLabels
			? model.modelState.correctLabels.slice(0)
			: null
		clone.modelState.partialLabels = model.modelState.partialLabels
			? model.modelState.partialLabels.slice(0)
			: null
		clone.modelState.incorrectLabels = model.modelState.incorrectLabels
			? model.modelState.incorrectLabels.slice(0)
			: null
		clone.modelState.solution = null
		clone.modelState.revealAnswer = model.modelState.revealAnswer

		if (model.modelState.solution) {
			clone.modelState.solution = Object.assign({}, model.modelState.solution)
		}
	},

	toJSON(model, json) {
		json.content.type = model.modelState.type
		json.content.correctLabels = model.modelState.correctLabels
			? model.modelState.correctLabels.join('|')
			: null
		json.content.partialLabels = model.modelState.partialLabels
			? model.modelState.partialLabels.join('|')
			: null
		json.content.incorrectLabels = model.modelState.incorrectLabels
			? model.modelState.incorrectLabels.join('|')
			: null
		json.content.solution = null
		json.content.revealAnswer = model.modelState.revealAnswer

		if (model.modelState.solution) {
			json.content.solution = model.modelState.solution.toJSON()
		}
	}
}

export default Adapter
