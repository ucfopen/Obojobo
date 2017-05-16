import Chunk from 'ObojoboDraft/Common/models/obo-model';

class BaseSelectionHandler {
	getCopyOfSelection(selection, chunk, cloneId) { if (cloneId == null) { cloneId = false; } return chunk.clone(cloneId); }
	selectStart(selection, chunk, asRange) { return false; }
	selectEnd(selection, chunk, asRange) { return false; }
	selectAll(selection, chunk) {
		this.selectStart(selection, chunk, true);
		return this.selectEnd(selection, chunk, true);
	}
	getVirtualSelectionStartData(selection, chunk) { return null; }
	getDOMSelectionStart(selection, chunk) { return null; }
	getVirtualSelectionEndData(selection, chunk) { return null; }
	getDOMSelectionEnd(selection, chunk) { return null; }
	areCursorsEquivalent(selection, chunk, thisCursorData, otherCursorData) { return false; }
}


export default BaseSelectionHandler;