let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.videoId) != null) {
			return model.modelState.videoId = attrs.content.videoId;
		} else {
			return model.modelState.videoId = null;
		}
	},

	clone(model, clone) {
		return clone.modelState.videoId = model.modelState.videoId;
	},

	toJSON(model, json) {
		return json.content.videoId = model.modelState.videoId;
	},

	toText(model) {
		return `https://www.youtube.com/watch?v=${model.modelState.videoId}`;
	}
};


export default Adapter;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}