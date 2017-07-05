// Note that parent here includes the node itself

let getTextNodesInOrderRecur = (element, textNodes) => {
	return Array.from(element.childNodes).map(
		node =>
			node.nodeType === Node.TEXT_NODE
				? textNodes.push(node)
				: getTextNodesInOrderRecur(node, textNodes)
	)
}

var DOMUtil = {
	findParentWithAttr(node, targetAttribute, targetValue = null, rootParent = document.body) {
		while (node != null && node !== rootParent) {
			if (node.getAttribute != null) {
				let attr = node.getAttribute(targetAttribute)
				if (attr != null && (targetValue === null || attr === targetValue)) {
					return node
				}
			}
			node = node.parentNode
		}

		return null
	},

	findParentAttr(node, targetAttribute) {
		node = DOMUtil.findParentWithAttr(node, targetAttribute)
		if (node == null) {
			return null
		}

		return node.getAttribute(targetAttribute)
	},

	findParentComponentElements(node) {
		// return null
		let componentSet = new Set()

		let cur = node
		while (cur !== null) {
			cur = DOMUtil.findParentWithAttr(cur, 'data-obo-component')

			if (cur == null) {
				break
			}

			if (DOMUtil.elementLikeComponent(cur)) {
				componentSet.add(cur)
			}

			cur = cur.parentElement
		}

		return componentSet
	},

	findParentComponentIds(node) {
		return new Set(
			[...DOMUtil.findParentComponentElements(node)].map(el => el.getAttribute('data-id'))
		)
	},

	elementLikeComponent(node) {
		return (
			node.hasAttribute('data-obo-component') &&
			node.classList.contains('component') &&
			node.getAttribute('data-id') != null &&
			node.getAttribute('data-type') != null
		)
	},

	getFirstTextNodeOfElement(node) {
		while (node != null && node.nodeType !== Node.TEXT_NODE) {
			node = node.childNodes[0]
		}

		return node
	},

	getTextNodesInOrder(element) {
		let textNodes = []
		getTextNodesInOrderRecur(element, textNodes)
		// console.log 'GET TEXT NODES IN ORDER'
		// console.log textNodes
		return textNodes
	}
}

export default DOMUtil
