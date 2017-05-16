let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.responseType) != null) {
			return model.modelState.responseType = attrs.content.responseType;
		} else {
			return model.modelState.responseType = '';
		}
	},

	clone(model, clone) {
		return clone.modelState.responseType = model.modelState.responseType;
	},

	toJSON(model, json) {
		return json.content.responseType = model.modelState.responseType;
	}
};


export default Adapter;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}