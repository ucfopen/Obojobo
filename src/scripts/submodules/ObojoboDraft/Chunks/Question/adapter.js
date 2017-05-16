import ObojoboDraft from 'ObojoboDraft'

let { OboModel } = ObojoboDraft.models;

let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.shuffle) != null) {
			model.modelState.shuffle = attrs.content.shuffle;
		} else {
			model.modelState.shuffle = false;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.limit) != null) {
			model.modelState.limit = attrs.content.limit;
		} else {
			model.modelState.limit = 0;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x2 => x2.practice) != null) {
			model.modelState.practice = attrs.content.practice;
		} else {
			model.modelState.practice = true;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x3 => x3.solution) != null) {
			return model.modelState.solution = OboModel.create(attrs.content.solution);
		} else {
			return model.modelState.solution = null;
		}
	},

	clone(model, clone) {
		clone.modelState.shuffle = model.modelState.shuffle;
		clone.modelState.type = model.modelState.type;
		clone.modelState.solution = null;

		if (model.modelState.solution != null) {
			return clone.modelState.solution = model.modelState.solution.clone();
		}
	},

	toJSON(model, json) {
		json.content.shuffle = model.modelState.shuffle;
		json.content.type = model.modelState.type;
		json.content.solution = null;

		if (model.modelState.solution != null) {
			return json.content.solution = model.modelState.solution.toJSON();
		}
	}
};


export default Adapter;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}