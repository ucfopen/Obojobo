let CommandHandler
let { Editor } = window
import Common from 'Common'

let { TextGroupCommandHandler } = Editor.chunk.textChunk
let { Chunk } = Common.models
let { TextGroupSelection } = Common.textGroup

export default (CommandHandler = class CommandHandler extends TextGroupCommandHandler {
	onEnter(selection, chunk, shiftKey) {
		chunk.markDirty()

		if (!shiftKey) {
			chunk.splitText()
			return
		}

		let newChunk = Chunk.create()
		chunk.addChildAfter(newChunk)
		return newChunk.selectStart()
	}

	onSelectAll(selection, chunk) {
		chunk.selectAll()
		return true
	}

	indent(selection, chunk, decreaseIndent) {
		chunk.markDirty()

		let data = chunk.modelState
		let tgs = new TextGroupSelection(chunk, selection.virtual)

		let all = tgs.getAllSelectedTexts()

		return (() => {
			let result = []
			for (let textItem of Array.from(all)) {
				let item
				if (textItem.data.indent != null && !isNaN(textItem.data.indent)) {
					if (!decreaseIndent) {
						item = textItem.data.indent++
					} else if (textItem.data.indent > 0) {
						item = textItem.data.indent--
					}
				}
				result.push(item)
			}
			return result
		})()
	}
})
