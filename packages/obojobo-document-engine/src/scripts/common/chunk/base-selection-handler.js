class BaseSelectionHandler {
	getCopyOfSelection(selection, chunk, cloneId = false) {
		return chunk.clone(cloneId)
	}
	selectStart() {
		return false
	}
	selectEnd() {
		return false
	}
	selectAll(selection, chunk) {
		this.selectStart(selection, chunk, true)
		return this.selectEnd(selection, chunk, true)
	}
	getVirtualSelectionStartData() {
		return null
	}
	getDOMSelectionStart() {
		return null
	}
	getVirtualSelectionEndData() {
		return null
	}
	getDOMSelectionEnd() {
		return null
	}
	areCursorsEquivalent() {
		return false
	}
}

export default BaseSelectionHandler
