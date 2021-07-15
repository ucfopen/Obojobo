import ListStyles from './list-styles'

import Common from 'obojobo-document-engine/src/scripts/common'

const { TextGroupAdapter } = Common.chunk.textChunk

const Adapter = {
	construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs)
		model.setStateProp('spacing', 'compact', p => p.toLowerCase(), [
			'compact',
			'moderate',
			'generous'
		])
		if (attrs && attrs.content && attrs.content.listStyles) {
			model.modelState.listStyles = ListStyles.fromDescriptor(attrs.content.listStyles)
		} else {
			model.modelState.listStyles = new ListStyles(ListStyles.TYPE_UNORDERED)
		}
	},

	clone(model, clone) {
		TextGroupAdapter.clone(model, clone)
		clone.modelState.listStyles = model.modelState.listStyles.clone()
		clone.modelState.spacing = model.modelState.spacing
	},

	toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json)
		json.content.listStyles = model.modelState.listStyles.toDescriptor()
		json.content.spacing = model.modelState.spacing
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
