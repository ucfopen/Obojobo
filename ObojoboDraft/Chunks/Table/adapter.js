import GridTextGroup from './grid-text-group'

let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.textGroup) != null) {
			model.modelState.textGroup = GridTextGroup.fromDescriptor(attrs.content.textGroup, Infinity, {
				indent: 0
			})
		} else {
			model.modelState.textGroup = GridTextGroup.create(3, 2)
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.header) != null) {
			return (model.modelState.header = attrs.content.header)
		} else {
			return (model.modelState.header = true)
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
		for (let textItem of Array.from(model.modelState.textGroup.items)) {
			longestStringLength = Math.max(longestStringLength, textItem.text.value.length)
		}

		let pad = ' '.repeat(longestStringLength)
		let border = '-'.repeat(longestStringLength)

		let text = ''

		text += border + '\n'
		for (
			let row = 0, end = model.modelState.textGroup.numRows, asc = 0 <= end;
			asc ? row < end : row > end;
			asc ? row++ : row--
		) {
			// console.log 'row', row
			let s = []
			for (
				let col = 0, end1 = model.modelState.textGroup.numCols, asc1 = 0 <= end1;
				asc1 ? col < end1 : col > end1;
				asc1 ? col++ : col--
			) {
				// console.log '  col', col
				let i = row * model.modelState.textGroup.numCols + col

				// console.log '    i', i
				let item = model.modelState.textGroup.items[i]
				s.push((item.text.value + pad).substr(0, pad.length))
			}
			text += `| ${s.join(' | ')} |\n${border}\n`
		}

		return text
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
