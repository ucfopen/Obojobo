const { Editor } = window
import Common from 'Common'

const { TextGroupCommandHandler } = Editor.chunk.textChunk
const { TextGroupSelection } = Common.textGroup

export default class CommandHandler extends TextGroupCommandHandler {
	onEnter(selection, chunk) {
		chunk.markDirty()

		const tgs = new TextGroupSelection(chunk, selection.virtual)
		const { textGroup } = chunk.modelState

		if (tgs.start.text.length !== 0) {
			chunk.splitText()
			return
		}

		// If splitting an empty one item paragraph create a new paragraph below
		if (textGroup.length === 1) {
			const sibChunk = chunk.clone()
			sibChunk.modelState.textGroup.init(1)

			chunk.addChildAfter(sibChunk)

			// TextGroupSelection.setCaretToGroupStart sibChunk, selection.virtual
			return sibChunk.selectStart()

			// If splitting an empty textGroup item that's not a one item paragraph
			// then split into three paragraphs:
		} else {
			return chunk.split()
		}
	}
}
