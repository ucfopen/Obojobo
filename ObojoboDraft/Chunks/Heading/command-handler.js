let CommandHandler
const { Editor } = window
import Common from 'Common'

const { TextGroupCommandHandler } = Editor.chunk.textChunk
const { TextGroupSelection } = Common.textGroup
const { Chunk } = Common.models

export default (CommandHandler = class CommandHandler extends TextGroupCommandHandler {
	splitText(selection, chunk, shiftKey) {
		chunk.markDirty()

		const tgs = new TextGroupSelection(chunk, selection.virtual)

		if (tgs.start.isGroupStart) {
			// super selection, chunk, shiftKey
			const newChunk = Chunk.create()
			chunk.addChildBefore(newChunk)
			return
		}

		const newText = tgs.start.text.split(tgs.start.offset)

		const newNode = Chunk.create()
		newNode.modelState.textGroup.first.text = newText
		chunk.addChildAfter(newNode)

		// selection.setFutureCaret newNode, { offset: 0, groupIndex: 0 }
		// TextGroupSelection.setCaretToGroupStart newNode, selection.virtual
		return newNode.selectStart()
	}
})
