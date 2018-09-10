const { Editor } = window
import Common from 'Common'

const { TextGroupCommandHandler } = Editor.chunk.textChunk
const { Chunk } = Common.models
const { TextGroupSelection } = Common.textGroup

export default class CommandHandler extends TextGroupCommandHandler {
	onEnter(selection, chunk, shiftKey) {
		chunk.markDirty()

		if (!shiftKey) {
			chunk.splitText()
			return
		}

		const newChunk = Chunk.create()
		chunk.addChildAfter(newChunk)
		return newChunk.selectStart()
	}

	onSelectAll(selection, chunk) {
		chunk.selectAll()
		return true
	}

	deleteText(selection, chunk, deleteForwards) {
		chunk.markDirty()

		const tgs = new TextGroupSelection(chunk, selection.virtual)

		const s = tgs.start

		if (s.isTextStart && s.textGroupItem.data.indent > 0) {
			s.textGroupItem.data.indent--
			return
		}

		return super.deleteText(selection, chunk, deleteForwards)
	}

	indent(selection, chunk, decreaseIndent) {
		chunk.markDirty()

		const tgs = new TextGroupSelection(chunk, selection.virtual)

		const all = tgs.getAllSelectedTexts()

		return (() => {
			const result = []
			for (const textItem of Array.from(all)) {
				let item
				if (
					textItem.data.indent !== null &&
					typeof textItem.data.indent !== 'undefined' &&
					!isNaN(textItem.data.indent)
				) {
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
}
