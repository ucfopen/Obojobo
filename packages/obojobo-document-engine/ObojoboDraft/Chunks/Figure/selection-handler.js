import Common from 'Common'

const { TextGroupSelectionHandler } = Common.chunk.textChunk
const { FocusableSelectionHandler } = Common.chunk.focusableChunk

export default class SelectionHandler extends TextGroupSelectionHandler {
	selectStart(selection, chunk) {
		return FocusableSelectionHandler.prototype.selectStart(selection, chunk)
	}
}
