// TODO: Parse correct/incorrect feedbacks that will be able to come from the document.
// Example: <MCAssessment correctFeedbacks="Correct!|You did it!|Got 'em!" incorrectFeedbacks="Incorrect|Try again">
let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.responseType) != null) {
			model.modelState.responseType = attrs.content.responseType
		} else {
			model.modelState.responseType = ''
		}

		if (attrs && attrs.content) {
			model.modelState.correctFeedbacks =
				attrs.content.correctFeedbacks === undefined
					? null
					: attrs.content.correctFeedbacks.split('|')
			model.modelState.incorrectfeedbacks =
				attrs.content.incorrectfeedbacks === undefined
					? null
					: attrs.content.incorrectfeedbacks.split('|')
		} else {
			model.modelState.correctFeedbacks = null
			model.modelState.incorrectFeedbacks = null
		}
	},

	clone(model, clone) {
		clone.modelState.responseType = model.modelState.responseType

		clone.modelState.correctFeedbacks = model.modelState.correctFeedbacks
			? model.modelState.correctFeedbacks.slice(0)
			: null

		clone.modelState.incorrectFeedbacks = model.modelState.incorrectFeedbacks
			? model.modelState.incorrectFeedbacks.slice(0)
			: null
	},

	toJSON(model, json) {
		json.content.responseType = model.modelState.responseType

		json.content.correctFeedbacks = model.modelState.correctFeedbacks
			? model.modelState.correctFeedbacks.join('|')
			: null

		json.content.incorrectFeedbacks = model.modelState.incorrectFeedbacks
			? model.modelState.incorrectFeedbacks.join('|')
			: null
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
