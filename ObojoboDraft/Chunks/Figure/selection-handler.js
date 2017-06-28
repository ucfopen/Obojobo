let SelectionHandler
import Common from 'Common'

let { TextGroupSelectionHandler } = Common.chunk.textChunk
let { FocusableSelectionHandler } = Common.chunk.focusableChunk

let { Chunk } = Common.models

export default (SelectionHandler = class SelectionHandler extends TextGroupSelectionHandler {
	selectStart(selection, chunk) {
		return FocusableSelectionHandler.prototype.selectStart(selection, chunk)
	}
})
