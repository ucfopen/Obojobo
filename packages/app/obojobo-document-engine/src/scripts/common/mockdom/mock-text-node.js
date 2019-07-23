class MockTextNode {
	constructor(text = '') {
		this.text = text
		this.html = null
		this.nodeType = 'text'
		this.parent = null
	}
}

module.exports = MockTextNode
