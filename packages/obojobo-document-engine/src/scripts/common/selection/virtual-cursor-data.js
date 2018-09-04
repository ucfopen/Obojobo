class VirtualCursorData {
	constructor(content) {
		this.content = content
	}

	clone() {
		return new VirtualCursorData(Object.assign({}, this.content))
	}
}

// toObject: () ->
// Object.assign({}, @content)

export default VirtualCursorData
