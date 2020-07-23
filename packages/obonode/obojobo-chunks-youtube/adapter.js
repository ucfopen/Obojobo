const Adapter = {
	construct(model) {
		model.setStateProp('videoId', null)
		model.setStateProp('videoUrl', null)
		model.setStateProp('startTime', null)
		model.setStateProp('endTime', null)
	},

	clone(model, clone) {
		clone.modelState.videoId = model.modelState.videoId
		clone.modelState.videoUrl = model.modelState.videoUrl
		clone.modelState.startTime = model.modelState.startTime
		clone.modelState.endTime = model.modelState.endTime
	},

	toJSON(model, json) {
		json.content.videoId = model.modelState.videoId
		json.content.videoUrl = model.modelState.videoUrl
		json.content.startTime = model.modelState.startTime
		json.content.endTime = model.modelState.endTime
	},

	toText(model) {
		return `https://www.youtube.com/watch?v=${model.modelState.videoId}`
	}
}

export default Adapter
