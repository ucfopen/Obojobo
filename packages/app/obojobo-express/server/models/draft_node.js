const VariableGenerator = require('./variable-generator')

// Collects all children DraftNodes into a Set() object
// optionally recursive
const collectChildrenNodes = (draftNode, set, recurse) => {
	for (const i of draftNode.children) {
		if (!i.node.id) {
			throw new Error('Unable to add child node with missing id')
		}
		set.add(i.node.id)
		if (recurse) collectChildrenNodes(i, set, true)
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
		this.registerEvents({
			'internal:generateVariables': this.generateVariable
		})
	}

	generateVariable(req, res, variableValues) {
		if (!this.node.content.variables) {
			return
		}

		this.node.content.variables.forEach(v => {
			try {
				variableValues.push({
					id: this.node.id + ':' + v.name,
					value: VariableGenerator.generateOne(v)
				})
			} catch (e) {
				//eslint-disable-next-line no-console
				console.error('Variable generation error: ', e)
				variableValues.push({
					id: this.node.id + ':' + v.name,
					value: ''
				})
			}
		})
	}

	get childrenSet() {
		return collectChildrenNodes(this, new Set(), true)
	}

	get immediateChildrenSet() {
		return collectChildrenNodes(this, new Set(), false)
	}

	registerEvents(events) {
		if (!this._listeners) this._listeners = new Map()

		for (const event in events) {
			this._listeners.set(event, events[event].bind(this))
		}
	}

	contains(oboNode) {
		return this.childrenSet.has(oboNode.id)
	}

	yell(event) {
		let promises = []

		// console.log(this.node, 'yell', this._listeners)

		if (this._listeners) {
			const eventListener = this._listeners.get(event)
			if (eventListener) {
				const rtn = eventListener.apply(this, Array.prototype.slice.call(arguments, 1))
				if (rtn) promises.push(rtn)
			}
		}

		for (const i in this.children) {
			promises = promises.concat(this.children[i].yell.apply(this.children[i], arguments))
		}

		return promises
	}

	toObject() {
		const o = Object.assign({}, this.node)
		o.children = []

		for (const i in this.children) {
			o.children.push(this.children[i].toObject())
		}

		return o
	}
}

module.exports = DraftNode
