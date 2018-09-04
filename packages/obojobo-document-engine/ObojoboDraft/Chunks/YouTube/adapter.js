let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.videoId) != null) {
			model.modelState.videoId = attrs.content.videoId
		} else {
			model.modelState.videoId = null
		}
	},

	clone(model, clone) {
		clone.modelState.videoId = model.modelState.videoId
	},

	toJSON(model, json) {
		json.content.videoId = model.modelState.videoId
	},

	toText(model) {
		return `https://www.youtube.com/watch?v=${model.modelState.videoId}`
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
