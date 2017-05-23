var DOMUtil = {
	findParentWithAttr(node, targetAttribute, targetValue, rootParent) {
		if (targetValue == null) { targetValue = null; }
		if (rootParent == null) { rootParent = document.body; }
		while ((node != null) && (node !== rootParent)) {
			if (node.getAttribute != null) {
				let attr = node.getAttribute(targetAttribute);
				if ((attr != null) && ((targetValue === null) || (attr === targetValue))) { return node; }
			}
			node = node.parentNode;
		}

		return null;
	},

	findParentAttr(node, targetAttribute) {
		node = DOMUtil.findParentWithAttr(node, targetAttribute);
		if ((node == null)) { return null; }

		return node.getAttribute(targetAttribute);
	},

	findParentComponentElements(node) {
		let componentSet = new Set();

		let cur = node;
		while (cur !== null) {
			cur = DOMUtil.findParentWithAttr(cur, 'data-obo-component');

			if ((cur == null)) {
				break;
			}

			if (DOMUtil.elementLikeComponent(cur)) {
				componentSet.add(cur);
			}

			cur = cur.parentElement;
		}

		return componentSet;
	},

	findParentComponentIds(node) {
		let ids = new Set();
		DOMUtil.findParentComponentElements(node).forEach(el => ids.add(el.getAttribute('data-id')));

		return ids;
	},

	elementLikeComponent(node) {
		return node.getAttribute('data-obo-component') && node.classList.contains('component') && (node.getAttribute('data-id') != null) && (node.getAttribute('data-type') != null);
	},

	getFirstTextNodeOfElement(node) {
		while ((node != null) && (node.nodeType !== Node.TEXT_NODE)) {
			node = node.childNodes[0];
		}

		return node;
	},

	// getTextLengthBefore: (element, targetTextNode) ->
	// 	charsRead = 0
	// 	nodes = DOMUtil.getTextNodesInOrder element
	// 	for node in nodes
	// 		if node is targetTextNode then return charsRead
	// 		charsRead += node.nodeValue.length
	// getTextLengthBefore: (element, targetElement, indent = '') ->



	// 	console.log indent, 'getTextLengthBefore', element, targetElement

	// 	indent += '    '

	// 	totalCharactersFromStart = 0

	// 	# console.log 'so like element be all', element

	// 	# debugger;

	// 	console.log indent, 'childNodes is', element.childNodes
	// 	for child in element.childNodes
	// 		console.log indent, 'child is', child, 'target element is', targetElement
	// 		if child is targetElement
	// 			console.log indent, 'YASSSSS'
	// 			return totalCharactersFromStart

	// 		if child.nodeType is Node.ELEMENT_NODE
	// 			totalCharactersFromStart += DOMUtil.getTextLengthBefore child, targetElement, indent

	// 		if child.nodeType is Node.TEXT_NODE
	// 			# debugger;
	// 			totalCharactersFromStart += child.nodeValue.length

	// 	console.log indent, 'GUTTERBALL'
	// 	return 0





	// findTextNodeAtPosition: (offset, element) ->
	// 	console.log 'FIND TEXT NODE AT POSITION', offset, element

	// 	totalCharactersFromStart = 0

	// 	console.log 'so like element be all', element

	// 	# debugger;

	// 	for child in element.childNodes
	// 		console.log 'mah chil', child, child.nodeType, child.nodeValue
	// 		if child.nodeType is Node.ELEMENT_NODE
	// 			return DOMUtil.findTextNodeAtPosition offset - totalCharactersFromStart, child
	// 		else if child.nodeType is Node.TEXT_NODE and totalCharactersFromStart + child.nodeValue.length >= offset
	// 			return { textNode:child, offset:offset }

	// 		totalCharactersFromStart += child.nodeValue.length

	// 	return { textNode:null, offset:0 }
















	// #@TODO - delete all these
	getTextNodesInOrder(element) {
		let textNodes = [];
		DOMUtil.getTextNodesInOrderRecur(element, textNodes);
		// console.log 'GET TEXT NODES IN ORDER'
		// console.log textNodes
		return textNodes;
	},

	getTextNodesInOrderRecur(element, textNodes) {
		return Array.from(element.childNodes).map((node) =>
			node.nodeType === Node.TEXT_NODE ?
				textNodes.push(node)
			:
				DOMUtil.getTextNodesInOrderRecur(node, textNodes));
	}
};

	// getOboElementFromChild: (element, targetClass = null) ->
	// 	while element isnt document.body
	// 		return element if DOMUtil.isOboElement element, targetClass
	// 		element = element.parentElement

	// 	null

	// getOboElementIdFromChild: (element, targetClass = null) ->
	// 	oboElement = DOMUtil.getOboElementFromChild element, targetClass
	// 	return null if not oboElement

	// 	oboElement.getAttribute('data-oboid')

	// isOboElement: (element, targetClass = null) ->
	// 	element.getAttribute('data-oboid') isnt null and (targetClass is null or element.classList.contains(targetClass));

	// findElementFromChild: (element, targetElementTag) ->
	// 	chunkElement = DOMUtil.getOboElementFromChild element

	// 	return null if not chunkElement

	// 	targetElementTag = targetElementTag.toLowerCase()
	// 	while element isnt chunkElement
	// 		return element if element.tagName.toLowerCase() is targetElementTag
	// 		element = element.parentElement

	// 	null

	// getElementByOboId: (oboid) ->
	// 	document.querySelector '*[data-oboid="' + oboid + '"]'


export default DOMUtil;