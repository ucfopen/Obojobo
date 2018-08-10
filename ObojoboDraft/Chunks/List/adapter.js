import ListStyles from './list-styles'

import Common from 'Common'

const { TextGroupAdapter } = Common.chunk.textChunk

const Adapter = {
	construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs)

		if (attrs && attrs.content && attrs.content.listStyles) {
			model.modelState.listStyles = ListStyles.fromDescriptor(attrs.content.listStyles)
		} else {
			model.modelState.listStyles = new ListStyles('unordered')
		}
	},

	clone(model, clone) {
		TextGroupAdapter.clone(model, clone)
		clone.modelState.listStyles = model.modelState.listStyles.clone()
	},

	toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json)
		json.content.listStyles = model.modelState.listStyles.toDescriptor()
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
