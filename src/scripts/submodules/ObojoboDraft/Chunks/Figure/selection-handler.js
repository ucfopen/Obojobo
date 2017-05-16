let SelectionHandler;
import ObojoboDraft from 'ObojoboDraft'

let { TextGroupSelectionHandler } = ObojoboDraft.chunk.textChunk;
let { FocusableSelectionHandler } = ObojoboDraft.chunk.focusableChunk;

let { Chunk } = ObojoboDraft.models;

export default (SelectionHandler = class SelectionHandler extends TextGroupSelectionHandler {
	selectStart(selection, chunk) {
		return FocusableSelectionHandler.prototype.selectStart(selection, chunk);
	}
});