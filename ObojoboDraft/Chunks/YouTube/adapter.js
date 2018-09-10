const Adapter = {
	construct(model) {
		model.setStateProp('videoId', null)
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
