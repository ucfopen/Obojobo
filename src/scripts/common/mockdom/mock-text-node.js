class MockTextNode {
	constructor(text) {
		if (text == null) {
			text = ''
		}
		this.text = text
		this.html = null
		this.nodeType = 'text'
		this.parent = null
	}
}

export default MockTextNode
