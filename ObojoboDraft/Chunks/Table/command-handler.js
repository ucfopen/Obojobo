const { Editor } = window
import Common from 'Common'

const { TextGroupCommandHandler } = Editor.chunk.textChunk
const { TextGroupSelection } = Common.textGroup

class CommandHandler extends TextGroupCommandHandler {
	deleteSelection(selection, chunk) {
		chunk.markDirty()

		const tgs = new TextGroupSelection(chunk, selection.virtual)

		chunk.modelState.textGroup.clearSpan(
			tgs.start.groupIndex,
			tgs.start.offset,
			tgs.end.groupIndex,
			tgs.end.offset
		)

		if (tgs.position === 'start' || tgs.position === 'contains') {
			return selection.virtual.setCaret(chunk, {
				offset: tgs.start.offset,
				groupIndex: tgs.start.groupIndex
			})
		}
	}

	deleteText(selection, chunk, deleteForwards) {
		const tgs = new TextGroupSelection(chunk, selection.virtual)
		const caret = tgs.start
		if ((caret.isTextStart && !deleteForwards) || (caret.isTextEnd && deleteForwards)) {
			return false
		}

		return super.deleteText(selection, chunk, deleteForwards)
	}

	onSelectAll(selection, chunk) {
		chunk.selectAll()
		return true
	}

	paste(selection, chunk, text) {
		return this.insertText(selection, chunk, text)
	}

	canRemoveSibling() {
		return false
	}
}

export default CommandHandler
