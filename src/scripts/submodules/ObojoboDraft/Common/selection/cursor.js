import DOMUtil from 'ObojoboDraft/Common/page/dom-util';

class Cursor {
	constructor(chunk, node, offset) {
		if (chunk == null) { chunk = null; }
		this.chunk = chunk;
		if (node == null) { node = null; }
		this.node = node;
		if (offset == null) { offset = null; }
		this.offset = offset;
		this.textNode = DOMUtil.getFirstTextNodeOfElement(this.node);
		this.isValid = (this.chunk !== null) && (this.offset !== null);
		this.isText = this.isValid && (this.textNode !== null);
	}

	clone() {
		return new Cursor(this.chunk, this.node, this.offset);
	}
}


export default Cursor;