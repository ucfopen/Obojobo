import ListStyles from './list-styles'

import Common from 'Common'

const { TextGroup } = Common.textGroup
const { TextGroupAdapter } = Common.chunk.textChunk

const Adapter = {
	construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs)

		if (__guard__(attrs != null ? attrs.content : undefined, x => x.listStyles) != null) {
			return (model.modelState.listStyles = ListStyles.fromDescriptor(attrs.content.listStyles))
		} else {
			return (model.modelState.listStyles = new ListStyles('unordered'))
		}
	},

	clone(model, clone) {
		TextGroupAdapter.clone(model, clone)
		return (clone.modelState.listStyles = model.modelState.listStyles.clone())
	},

	toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json)
		return (json.content.listStyles = model.modelState.listStyles.toDescriptor())
	},

	toText(model) {
		let text = ''
		for (const textItem of Array.from(model.modelState.textGroup.items)) {
			text += `  * ${textItem.text.value}\n`
		}

		return text
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
