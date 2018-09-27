const { Editor } = window
import Common from 'Common'

let { TextGroupCommandHandler } = Editor.chunk.textChunk
let { TextGroupSelection } = Common.textGroup
let { Chunk } = Common.models

export default class CommandHandler extends TextGroupCommandHandler {
	splitText(selection, chunk) {
		chunk.markDirty()

		let tgs = new TextGroupSelection(chunk, selection.virtual)

		if (tgs.start.isGroupStart) {
			const newChunk = Chunk.create()
			chunk.addChildBefore(newChunk)
			return
		}

		let newText = tgs.start.text.split(tgs.start.offset)

		let newNode = Chunk.create() //@TODO - assumes it has a textGroup
		newNode.modelState.textGroup.first.text = newText
		chunk.addChildAfter(newNode)

		// TextGroupSelection.setCaretToGroupStart newNode, selection.virtual
		return newNode.selectStart()
	}
}
