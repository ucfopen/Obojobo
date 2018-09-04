// Note that parent here includes the node itself

const getTextNodesInOrderRecur = (element, textNodes) => {
	return Array.from(element.childNodes).map(
		node =>
			node.nodeType === Node.TEXT_NODE
				? textNodes.push(node)
				: getTextNodesInOrderRecur(node, textNodes)
	)
}

const DOMUtil = {
	findParentWithAttr(node, targetAttribute, targetValue = null, rootParent = document.body) {
		while (node !== null && typeof node !== 'undefined' && node !== rootParent) {
			if (node.getAttribute) {
				const attr = node.getAttribute(targetAttribute)
				if (attr !== null && (targetValue === null || attr === targetValue)) {
					return node
				}
			}
			node = node.parentNode
		}

		return null
	},

	findParentAttr(node, targetAttribute) {
		node = DOMUtil.findParentWithAttr(node, targetAttribute)
		if (!node) {
			return null
		}

		return node.getAttribute(targetAttribute)
	},

	findParentComponentElements(node) {
		// return null
		const componentSet = new Set()

		let cur = node
		while (cur !== null) {
			cur = DOMUtil.findParentWithAttr(cur, 'data-obo-component')

			if (!cur) {
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

	getComponentElementById(oboId) {
		const el = document.getElementById('obo-' + oboId)
		if (!el || !DOMUtil.elementLikeComponent(el)) return null

		return el
	},

	elementLikeComponent(node) {
		return (
			node.hasAttribute('data-obo-component') &&
			node.classList.contains('component') &&
			node.getAttribute('data-id') !== null &&
			node.getAttribute('data-id') !== '' &&
			node.getAttribute('data-type') !== null &&
			node.getAttribute('data-type') !== ''
		)
	},

	getFirstTextNodeOfElement(node) {
		while (node !== null && typeof node !== 'undefined' && node.nodeType !== Node.TEXT_NODE) {
			node = node.childNodes[0]
		}

		return node
	},

	getTextNodesInOrder(element) {
		const textNodes = []
		getTextNodesInOrderRecur(element, textNodes)

		return textNodes
	}
}

export default DOMUtil
