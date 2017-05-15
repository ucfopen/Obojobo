import BaseSelectionHandler from 'ObojoboDraft/Common/chunk/base-selection-handler';

import FocusableSelectionHandler from './focusable-selection-handler';

class ToggleSelectionHandler extends BaseSelectionHandler {
	constructor(textSelectionHandler, focusSelectionHandler) {
		if (focusSelectionHandler == null) { focusSelectionHandler = new FocusableSelectionHandler(); }
		super();

		this.textSelectionHandler = textSelectionHandler;
		this.focusSelectionHandler = focusSelectionHandler;
	}

	getCopyOfSelection(selection, chunk, cloneId) {
		if (chunk.isEditing()) {
			return this.textSelectionHandler.getCopyOfSelection.apply(this, arguments);
		} else {
			return this.focusSelectionHandler.getCopyOfSelection.apply(this, arguments);
		}
	}

	selectAll(selection, chunk) {
		if (chunk.isEditing()) {
			return this.textSelectionHandler.selectAll.apply(this, arguments);
		} else {
			return this.focusSelectionHandler.selectAll.apply(this, arguments);
		}
	}

	selectStart(selection, chunk, asRange) {
		if (asRange == null) { asRange = false; }
		if (chunk.isEditing()) {
			return this.textSelectionHandler.selectStart.apply(this, arguments);
		} else {
			return this.focusSelectionHandler.selectStart.apply(this, arguments);
		}
	}

	selectEnd(selection, chunk, asRange) {
		if (asRange == null) { asRange = false; }
		if (chunk.isEditing()) {
			return this.textSelectionHandler.selectEnd.apply(this, arguments);
		} else {
			return this.focusSelectionHandler.selectEnd.apply(this, arguments);
		}
	}

	getVirtualSelectionStartData(selection, chunk, text, html) {
		if (chunk.isEditing()) {
			return this.textSelectionHandler.getVirtualSelectionStartData.apply(this, arguments);
		} else {
			return this.focusSelectionHandler.getVirtualSelectionStartData.apply(this, arguments);
		}
	}

	getVirtualSelectionEndData(selection, chunk, text, html) {
		if (chunk.isEditing()) {
			return this.textSelectionHandler.getVirtualSelectionEndData.apply(this, arguments);
		} else {
			return this.focusSelectionHandler.getVirtualSelectionEndData.apply(this, arguments);
		}
	}

	getDOMSelectionStart(selection, chunk, text, html) {
		if (chunk.isEditing()) {
			return this.textSelectionHandler.getDOMSelectionStart.apply(this, arguments);
		} else {
			return this.focusSelectionHandler.getDOMSelectionStart.apply(this, arguments);
		}
	}

	getDOMSelectionEnd(selection, chunk, text, html) {
		if (chunk.isEditing()) {
			return this.textSelectionHandler.getDOMSelectionEnd.apply(this, arguments);
		} else {
			return this.focusSelectionHandler.getDOMSelectionEnd.apply(this, arguments);
		}
	}

	areCursorsEquivalent(selection, chunk, text, html) {
		if (chunk.isEditing()) {
			return this.textSelectionHandler.areCursorsEquivalent.apply(this, arguments);
		} else {
			return this.focusSelectionHandler.areCursorsEquivalent.apply(this, arguments);
		}
	}
}


export default ToggleSelectionHandler;