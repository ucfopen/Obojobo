// Collects all children DraftNodes into a Set() object
// optionally recursive
collectChildrenNodes = (draftNode, set, recurse) => {
	for(let i in draftNode.children){
		set.add(draftNode.children[i].node.id)
		if(recurse) collectChildrenNodes(draftNode.children[i], set, true)
	}
	return set
}

// Generic class that represents each node in a Draft Document
class DraftNode {
	constructor(draftTree, node, initFn) {
		this.draftTree = draftTree
		this.node = Object.assign({}, node)
		delete this.node.children
		this.init = initFn
		this.children = []
	}

	get childrenSet() {
		return collectChildrenNodes(this, new Set(), true)
	}

	get immediateChildrenSet() {
		return collectChildrenNodes(this, new Set(), false)
	}

	registerEvents(events){
		if( ! this._listeners) this._listeners = new Map();

		let i = 0
		for(let event in events){

			this._listeners.set(event, events[event].bind(this))
			i++
		}
	}

	contains(oboNode) {
		return this.childrenSet.has(oboNode.id)
	}

	yell(event) {
		if(this._listeners){
			let eventListener = this._listeners.get(event)
			if(eventListener) eventListener.apply(this, Array.prototype.slice.call(arguments, 1))
		}

		for(let i in this.children){
			this.children[i].yell.apply(this.children[i], arguments)
		}
	}

	init() {
		this.init()
	}

	toObject() {
		let o = Object.assign({}, this.node)
		o.children = []

		for(let i in this.children){
			o.children.push(this.children[i].toObject())
		}

		return o
	}
}

module.exports = DraftNode
