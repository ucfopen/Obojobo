import Cursor from './cursor';
import DOMSelection from 'ObojoboDraft/Common/selection/dom-selection';
import DOMUtil from 'ObojoboDraft/Common/page/dom-util';

let domType = null;

class ChunkSelection {
	constructor(module) {
		this.module = module;
		this.clear();
	}

	clear() {
		this.start = (this.end = (domType = null));
		this.inbetween = [];
		return this.all = [];
	}

	calculateAllNodes() {
		this.inbetween = [];
		this.all = [];

		if ((this.start != null ? this.start.chunk : undefined) != null) {
			this.all = [this.start.chunk];
		}

		let n = this.start.chunk;
		while ((n != null) && (n !== this.end.chunk)) {
			if (n !== this.start.chunk) {
				this.inbetween.push(n);
				this.all.push(n);
			}
			n = n.nextSibling();
		}

		if (((this.end != null ? this.end.chunk : undefined) != null) && (this.all[this.all.length - 1] !== this.end.chunk)) {
			return this.all.push(this.end.chunk);
		}
	}

	getChunkForDomNode(domNode) {
		// console.log 'getChunkForDomNode', domNode
		let index = this.getIndex(domNode);
		return this.module.chunks.at(index);
	}

	getPosition(chunk) {
		// console.log 'get position', @
		if (((this.start != null ? this.start.chunk : undefined) == null) || ((this.end != null ? this.end.chunk : undefined) == null)) { return 'unknown'; }

		let chunkIndex = chunk.get('index');
		let startIndex = this.start.chunk.get('index');
		let endIndex = this.end.chunk.get('index');

		if (chunkIndex < startIndex) { return 'before'; }
		if ((chunkIndex === startIndex) && (chunkIndex === endIndex)) { return 'contains'; }
		if (chunkIndex === startIndex) { return 'start'; }
		if (chunkIndex < endIndex) { return 'inside'; }
		if (chunkIndex === endIndex) { return 'end'; }
		return 'after';
	}

	getIndex(node) {
		return DOMUtil.findParentAttr(node, 'data-component-index');
	}

	getFromDOMSelection(s) {
		if (s == null) { s = new DOMSelection; }
		this.clear();

		// s = new DOMSelection()
		domType = s.getType();

		if (domType === 'none') {
			this.start = null;
			this.end = null;
		} else {
			this.start = this.getCursor(s.startContainer, s.startOffset);
			this.end   = this.getCursor(s.endContainer, s.endOffset);
			this.calculateAllNodes();
		}

		return this;
	}

	getCursor(node, offset) {
		let chunk = this.getChunkForDomNode(node);
		return new Cursor(chunk, node, offset);
	}

	setTextStart(node, offset) {
		this.start = this.getCursor(node, offset);

		if (this.end === null) { this.end = this.start.clone(); }

		return this.calculateAllNodes();
	}

	setTextEnd(node, offset) {
		this.end = this.getCursor(node, offset);

		if (this.start === null) { this.start = this.end.clone(); }

		return this.calculateAllNodes();
	}

	setCaret(node, offset) {
		this.setTextStart(node, offset);
		return this.collapse();
	}

	select() {
		return DOMSelection.set(this.start.node, this.start.offset, this.end.node, this.end.offset);
	}

	collapse() {
		return this.end = this.start.clone();
	}
}





Object.defineProperties(ChunkSelection.prototype, {
	"type": {
		get() {
			if (((this.start != null ? this.start.chunk : undefined) == null) || ((this.end != null ? this.end.chunk : undefined) == null) || !this.start.isText || !this.end.isText) {
				return 'none';
			} else if ((this.start != null ? this.start.chunk.cid : undefined) === (this.end != null ? this.end.chunk.cid : undefined)) {
				if (domType === 'caret') {
					return 'caret';
				} else {
					return 'textSpan';
				}
			} else {
				return 'chunkSpan';
			}
		}
	}
});


ChunkSelection.createDescriptor = (startIndex, startData, endIndex, endData) =>
	({
		start: {
			index: startIndex,
			data:  startData
		},
		end: {
			index: endIndex,
			data:  endData
		}
	})
;


ChunkSelection.getFromDOMSelection = (module, domSelection) => (new ChunkSelection(module)).getFromDOMSelection(domSelection);


export default ChunkSelection;