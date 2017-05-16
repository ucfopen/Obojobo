import TextGroup from 'ObojoboDraft/Common/text-group/text-group';

let TextGroupAdapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.textGroup) != null) {
			return model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, Infinity, { indent:0, align:'left' });
		} else {
			return model.modelState.textGroup = TextGroup.create(Infinity, { indent:0, align:'left' });
		}
	},

	clone(model, clone) {
		return clone.modelState.textGroup = model.modelState.textGroup.clone();
	},

	toJSON(model, json) {
		return json.content.textGroup = model.modelState.textGroup.toDescriptor();
	},

	toText(model) {
		return model.modelState.textGroup.first.text.value;
	}
};


export default TextGroupAdapter;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}