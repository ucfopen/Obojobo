const attrElementToAttrItem = node => {
	if (!node) return

	for (const prop in node) {
		if (typeof node[prop] === 'object') {
			attrElementToAttrItem(node[prop])
		}
	}

	if (node.elements) {
		for (let i = node.elements.length - 1; i >= 0; i--) {
			const childNode = node.elements[i]

			if (childNode.type === 'attribute') {
				if (!node.attributes) node.attributes = {}
				node.attributes[childNode.name] = childNode.value
				node.elements.splice(i, 1)
			}
		}
	}
}

module.exports = attrElementToAttrItem
