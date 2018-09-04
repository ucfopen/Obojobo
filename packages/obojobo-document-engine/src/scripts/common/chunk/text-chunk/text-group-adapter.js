import TextGroup from '../../../common/text-group/text-group'

const TextGroupAdapter = {
	construct(model, attrs) {
		if (attrs && attrs.content && attrs.content.textGroup) {
			model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, Infinity, {
				indent: 0,
				align: 'left'
			})
		} else {
			model.modelState.textGroup = TextGroup.create(Infinity, { indent: 0, align: 'left' })
		}
	},

	clone(model, clone) {
		return (clone.modelState.textGroup = model.modelState.textGroup.clone())
	},

	toJSON(model, json) {
		return (json.content.textGroup = model.modelState.textGroup.toDescriptor())
	},

	toText(model) {
		return model.modelState.textGroup.first.text.value
	}
}

export default TextGroupAdapter
