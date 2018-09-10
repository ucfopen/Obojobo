class MockTextNode {
	constructor(text = '') {
		this.text = text
		this.html = null
		this.nodeType = 'text'
		this.parent = null
	}
}

export default MockTextNode
