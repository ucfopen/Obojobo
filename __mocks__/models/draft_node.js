let mockYell = jest.fn()

class DraftNode {
	constructor(draftTree, node, initFn = jest.fn()) {
		this.draftTree = draftTree
		this.node = Object.assign({}, node)
		delete this.node.children
		this.init = initFn
		this.children = []

		this.childrenSet = jest.fn()
		this.immediateChildrenSet = new Set()
		this.registerEvents = jest.fn()
		this.contains = jest.fn().mockReturnValue(true)
		this.yell = mockYell
	}

	toObject() {
		return {
			__toObject: true,
			id: this.id,
			type: this.type,
			content: this.content,
			children: this.children.map(c => c.toObject())
		}
	}
}

DraftNode.__setMockYell = newMock => {
	mockYell = newMock
}

module.exports = DraftNode
