class VirtualCursor {
	constructor(chunk, data) {
		this.chunk = chunk;
		this.data = data;
	}

	isEquivalentTo(otherCursor) {
		return this.chunk.areCursorsEquivalent(this, otherCursor);
	}

	clone() {
		// @chunk.cloneVirtualCaret @
		return new VirtualCursor(this.chunk, Object.assign({}, this.data));
	}
}


export default VirtualCursor;