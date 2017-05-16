// Chrome sometimes has range startContainer / endContainer as an element node
// so we need to dig down in this case to find the first text node

import DOMUtil from 'ObojoboDraft/Common/page/dom-util';

class DOMSelection {
	constructor() {
		this.domSelection = window.getSelection();
		this.domRange = null;

		if (this.domSelection.rangeCount > 0) {
			this.domRange = this.domSelection.getRangeAt(0);
		}
	}

	getType() {
		if (this.domSelection.type != null) {
			return this.domSelection.type.toLowerCase();
		}

		if (this.domSelection.isCollapsed != null) {
			if (this.domSelection.isCollapsed) {
				return 'caret';
			} else {
				return 'range';
			}
		}

		if ((this.domSelection.focusNode === this.domSelection.anchorNode) && (this.domSelection.focusOffset === this.domSelection.anchorOffset)) {
			return 'caret';
		}

		return 'range';
	}

	getClientRects() {
		if ((this.domRange == null)) { return []; }
		return this.domRange.getClientRects();
	}

	set(startNode, startOffset, endNode, endOffset) {
		// console.log 'DS.set', startNode, startOffset, endNode, endOffset

		let r = document.createRange();

		r.setStart(startNode, startOffset);
		r.setEnd(endNode, endOffset);

		this.domSelection.removeAllRanges();
		this.domSelection.addRange(r);

		this.domRange = r;

		return this;
	}

	setStart(node, offset) {
		return this.domRange.setStart(node, offset);
	}

	setEnd(node, offset) {
		return this.domRange.setEnd(node, offset);
	}

	includes(node) {
		// console.log 'asking if', node, 'contains', @startText, 'and', @endText
		if ((node == null)) { return false; }
		return node.contains(this.startText) && node.contains(this.endText);
	}
}


DOMSelection.set = (startNode, startOffset, endNode, endOffset) =>
	// console.log 'DS.set', startNode, startOffset, endNode, endOffset
	(new DOMSelection).set(startNode, startOffset, endNode, endOffset)
;

DOMSelection.includes = node => (new DOMSelection).includes(node);

DOMSelection.get = () => new DOMSelection;


Object.defineProperties(DOMSelection.prototype, {
	startContainer: {
		get() {
			if ((this.domRange == null)) { return null; }
			if (this.domRange.startContainer.nodeType === Node.TEXT_NODE) { return this.domRange.startContainer.parentElement; } else { return this.domRange.startContainer; }
		}
	},
	startText: {
		get() {
			if ((this.domRange == null)) { return null; }
			return DOMUtil.getFirstTextNodeOfElement(this.domRange.startContainer);
		}
	},
	startOffset: {
		get() {
			if ((this.domRange == null)) { return null; }
			return this.domRange.startOffset;
		}
	},
	endContainer: {
		get() {
			if ((this.domRange == null)) { return null; }
			if (this.domRange.endContainer.nodeType === Node.TEXT_NODE) { return this.domRange.endContainer.parentElement; } else { return this.domRange.endContainer; }
		}
	},
	endText: {
		get() {
			if ((this.domRange == null)) { return null; }
			return DOMUtil.getFirstTextNodeOfElement(this.domRange.endContainer);
		}
	},
	endOffset: {
		get() {
			if ((this.domRange == null)) { return null; }
			return this.domRange.endOffset;
		}
	}
});

//@TODO
window.__ds = () => DOMSelection.get();


export default DOMSelection;