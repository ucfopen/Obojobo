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
				attrs.content.correctFeedbacks === undefined ? '' : attrs.content.correctFeedbacks
			model.modelState.incorrectfeedbacks =
				attrs.content.incorrectfeedbacks === undefined ? '' : attrs.content.incorrectfeedbacks
		} else {
			model.modelState.correctFeedbacks = ''
			model.modelState.incorrectFeedbacks = ''
		}
	},

	clone(model, clone) {
		clone.modelState.responseType = model.modelState.responseType
		clone.modelState.correctFeedbacks = model.modelState.correctFeedbacks
		clone.modelState.incorrectFeedbacks = model.modelState.incorrectFeedbacks
	},

	toJSON(model, json) {
		json.content.responseType = model.modelState.responseType
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
