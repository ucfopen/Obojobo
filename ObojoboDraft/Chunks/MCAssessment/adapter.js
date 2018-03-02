// TODO: Parse correct/incorrect feedbacks that will be able to come from the document.
// Example: <MCAssessment correctFeedbacks="Correct!|You did it!|Got 'em!" incorrectFeedbacks="Incorrect|Try again">
let Adapter = {
	construct(model, attrs) {
		let content = attrs && attrs.content ? attrs.content : {}

		model.modelState.responseType = content.responseType || ''
		model.modelState.correctFeedbacks = content.correctFeedbacks
			? content.correctFeedbacks.split('|')
			: null
		model.modelState.incorrectFeedbacks = content.incorrectFeedbacks
			? content.incorrectFeedbacks.split('|')
			: null
		model.modelState.shuffle = content.shuffle !== false
	},

	clone(model, clone) {
		clone.modelState.responseType = model.modelState.responseType
		clone.modelState.correctFeedbacks = model.modelState.correctFeedbacks
			? model.modelState.correctFeedbacks.slice(0)
			: null
		clone.modelState.incorrectFeedbacks = model.modelState.incorrectFeedbacks
			? model.modelState.incorrectFeedbacks.slice(0)
			: null
		clone.modelState.shuffle = model.modelState.shuffle
	},

	toJSON(model, json) {
		json.content.responseType = model.modelState.responseType
		json.content.correctFeedbacks = model.modelState.correctFeedbacks
			? model.modelState.correctFeedbacks.join('|')
			: null
		json.content.incorrectFeedbacks = model.modelState.incorrectFeedbacks
			? model.modelState.incorrectFeedbacks.join('|')
			: null
		json.content.shuffle = model.modelState.shuffle
	}
}

export default Adapter
