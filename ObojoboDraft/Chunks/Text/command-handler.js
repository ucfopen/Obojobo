let CommandHandler
let { Editor } = window
import Common from 'Common'

let { TextGroupCommandHandler } = Editor.chunk.textChunk
let { TextGroupSelection } = Common.textGroup

export default (CommandHandler = class CommandHandler extends TextGroupCommandHandler {
	onEnter(selection, chunk, shiftKey) {
		chunk.markDirty()

		let tgs = new TextGroupSelection(chunk, selection.virtual)
		let { textGroup } = chunk.modelState

		if (tgs.start.text.length !== 0) {
			chunk.splitText()
			return
		}

		// If splitting an empty one item paragraph create a new paragraph below
		if (textGroup.length === 1) {
			let sibChunk = chunk.clone()
			sibChunk.modelState.textGroup.init(1)

			chunk.addChildAfter(sibChunk)

			// TextGroupSelection.setCaretToGroupStart sibChunk, selection.virtual
			return sibChunk.selectStart()

			// If splitting an empty textGroup item that's not a one item paragraph
			// then split into three paragraphs:
		} else {
			let splitChildren
			return (splitChildren = chunk.split())
		}
	}
})
