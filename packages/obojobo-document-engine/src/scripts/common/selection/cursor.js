import DOMUtil from '../../common/page/dom-util'

class Cursor {
	constructor(chunk = null, node = null, offset = null) {
		this.chunk = chunk
		this.node = node
		this.offset = offset
		this.textNode = DOMUtil.getFirstTextNodeOfElement(this.node)
		this.isValid = this.chunk !== null && this.offset !== null
		this.isText = this.isValid && this.textNode !== null
	}

	clone() {
		return new Cursor(this.chunk, this.node, this.offset)
	}
}

export default Cursor
