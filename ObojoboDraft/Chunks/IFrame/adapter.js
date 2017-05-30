let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.src) != null) {
			return model.modelState.src = src;
		} else {
			return model.modelState.src = null;
		}
	},

	clone(model, clone) {
		return clone.modelState.src = model.modelState.src;
	},

	toJSON(model, json) {
		return json.content.src = model.modelState.src;
	},

	toText(model) {
		return model.modelState.src;
	}
};


export default Adapter;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}