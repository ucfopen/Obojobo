import GridTextGroup from './grid-text-group'

const Adapter = {
	construct(model, attrs) {
		model.setStateProp('header', true)

		if (attrs && attrs.content && attrs.content.textGroup) {
			model.modelState.textGroup = GridTextGroup.fromDescriptor(attrs.content.textGroup, Infinity, {
				indent: 0
			})
		} else {
			model.modelState.textGroup = GridTextGroup.create(3, 2)
		}
	},

	clone(model, clone) {
		clone.modelState.textGroup = model.modelState.textGroup.clone()
		return (clone.modelState.header = model.modelState.header)
	},

	toJSON(model, json) {
		json.content.textGroup = model.modelState.textGroup.toDescriptor()
		return (json.content.header = model.modelState.header)
	},

	toText(model) {
		let longestStringLength = 0
		for (const textItem of Array.from(model.modelState.textGroup.items)) {
			longestStringLength = Math.max(longestStringLength, textItem.text.value.length)
		}

		const pad = ' '.repeat(longestStringLength)
		const border = '-'.repeat(longestStringLength)

		let text = ''

		text += border + '\n'
		for (let row = 0, end = model.modelState.textGroup.numRows; row < end; row++) {
			const s = []
			for (let col = 0, end1 = model.modelState.textGroup.numCols; col < end1; col++) {
				const i = row * model.modelState.textGroup.numCols + col
				const item = model.modelState.textGroup.items[i]
				s.push((item.text.value + pad).substr(0, pad.length))
			}
			text += `| ${s.join(' | ')} |\n${border}\n`
		}

		return text
	}
}

export default Adapter
