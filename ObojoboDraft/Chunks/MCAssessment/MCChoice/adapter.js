let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.score) != null) {
			model.modelState.score = attrs.content.score;
			return model.modelState._score = attrs.content.score;
		} else {
			return model.modelState.score = '';
		}
	},

	clone(model, clone) {
		return clone.modelState.score = model.modelState.score;
	},

	toJSON(model, json) {
		return json.content.score = model.modelState.score;
	}
};


export default Adapter;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}