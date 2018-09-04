// Turns a StyleableText item into a mock DOM tree, which can then be used to render out in React

import katex from 'katex'

import StyleType from '../../common/text/style-type'
import MockElement from '../../common/mockdom/mock-element'
import MockTextNode from '../../common/mockdom/mock-text-node'

const ORDER = [
	StyleType.COMMENT,
	StyleType.LATEX,
	StyleType.LINK,
	StyleType.QUOTE,
	StyleType.BOLD,
	StyleType.STRIKETHROUGH,
	StyleType.MONOSPACE,
	StyleType.SUPERSCRIPT,
	StyleType.ITALIC
]

const getTextNodeFragmentDescriptorsAtHelper = function(
	stateObj,
	targetStartIndex,
	targetEndIndex
) {
	if (stateObj.curNode.nodeType === 'element') {
		return Array.from(stateObj.curNode.children).map(
			child => (
				(stateObj.curNode = child),
				getTextNodeFragmentDescriptorsAtHelper(stateObj, targetStartIndex, targetEndIndex)
			)
		)
	} else {
		const charsRead = stateObj.charsRead + stateObj.curNode.text.length

		if (charsRead >= targetEndIndex && stateObj.end === null) {
			stateObj.end = {
				node: stateObj.curNode,
				startIndex: 0,
				endIndex: targetEndIndex - stateObj.charsRead
			}
		} else if (stateObj.start !== null && stateObj.end === null) {
			stateObj.inbetween.push({
				node: stateObj.curNode,
				startIndex: 0,
				endIndex: Infinity
			})
		}

		if (charsRead >= targetStartIndex && stateObj.start === null) {
			stateObj.start = {
				node: stateObj.curNode,
				startIndex: targetStartIndex - stateObj.charsRead,
				endIndex: Infinity
			}
		}

		stateObj.last = {
			node: stateObj.curNode,
			startIndex: 0,
			endIndex: Infinity
		}

		return (stateObj.charsRead = charsRead)
	}
}

const getTextNodeFragmentDescriptorsAt = function(rootNode, startIndex, endIndex) {
	const stateObj = {
		charsRead: 0,
		start: null,
		inbetween: [],
		end: null,
		curNode: rootNode
	}

	getTextNodeFragmentDescriptorsAtHelper(stateObj, startIndex, endIndex)
	if (stateObj.end === null) {
		stateObj.end = stateObj.last
	}

	// If start and end are equal just modify start and delete end
	if (stateObj.start.node === stateObj.end.node) {
		stateObj.start.endIndex = stateObj.end.endIndex
		stateObj.end = null
	}

	const fragmentDescriptors = stateObj.inbetween

	fragmentDescriptors.unshift(stateObj.start)

	if (stateObj.end !== null) {
		fragmentDescriptors.push(stateObj.end)
	}

	return fragmentDescriptors
}

const wrapElement = function(styleRange, nodeToWrap, text) {
	let newChild, node, root
	switch (styleRange.type) {
		case 'sup': {
			let level = styleRange.data
			if (level > 0) {
				node = root = new MockElement('sup')
				while (level > 1) {
					newChild = new MockElement('sup')
					node.addChild(newChild)
					node = newChild
					level--
				}
			} else {
				level = Math.abs(level)
				node = root = new MockElement('sub')
				while (level > 1) {
					newChild = new MockElement('sub')
					node.addChild(newChild)
					node = newChild
					level--
				}
			}

			nodeToWrap.parent.replaceChild(nodeToWrap, root)
			node.addChild(nodeToWrap)
			nodeToWrap.text = text
			return root
		}

		case '_comment':
			newChild = new MockElement('span', Object.assign({ class: 'comment' }, styleRange.data))
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild)
			newChild.addChild(nodeToWrap)
			nodeToWrap.text = text
			return newChild

		case '_latex': {
			newChild = new MockElement('span', Object.assign({ class: 'latex' }, styleRange.data))
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild)
			newChild.addChild(nodeToWrap)
			const html = katex.renderToString(text)
			nodeToWrap.html = html
			nodeToWrap.text = text
			return newChild
		}

		case StyleType.MONOSPACE:
			styleRange.type = 'code'
		// Intentional fallthrough

		default:
			newChild = new MockElement(styleRange.type, Object.assign({}, styleRange.data))
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild)
			newChild.addChild(nodeToWrap)
			nodeToWrap.text = text
			return newChild
	}
}

const wrap = function(styleRange, nodeFragmentDescriptor) {
	let newChild
	let nodeToWrap = nodeFragmentDescriptor.node
	const { text } = nodeToWrap
	const fromPosition = nodeFragmentDescriptor.startIndex
	const toPosition = nodeFragmentDescriptor.endIndex

	const leftText = text.substring(0, fromPosition)
	const wrappedText = text.substring(fromPosition, toPosition)
	const rightText = text.substring(toPosition)

	if (wrappedText.length === 0) {
		return
	}

	// add in left text
	if (leftText.length > 0) {
		newChild = new MockTextNode(leftText)
		nodeToWrap.parent.addBefore(newChild, nodeToWrap)
	}

	// add in wrapped text
	nodeToWrap = wrapElement(styleRange, nodeToWrap, wrappedText)

	// add in right text
	if (rightText.length > 0) {
		newChild = new MockTextNode(rightText)
		return nodeToWrap.parent.addAfter(newChild, nodeToWrap)
	}
}

const applyStyle = function(el, styleRange) {
	const fragmentDescriptors = getTextNodeFragmentDescriptorsAt(el, styleRange.start, styleRange.end)
	return (() => {
		const result = []
		for (let i = fragmentDescriptors.length - 1; i >= 0; i--) {
			const fragmentDescriptor = fragmentDescriptors[i]
			result.push(wrap(styleRange, fragmentDescriptor))
		}
		return result
	})()
}

const getMockElement = function(styleableText) {
	const root = new MockElement('span')
	root.addChild(new MockTextNode(styleableText.value))

	for (const styleType of Array.from(ORDER)) {
		for (const styleRange of Array.from(styleableText.styleList.styles)) {
			if (styleRange.type === styleType) {
				applyStyle(root, styleRange)
			}
		}
	}

	return root
}

export default getMockElement
