// Turns a StyleableText item into a mock DOM tree, which can then be used to render out in React

import katex from 'katex'

import StyleableText from '../../common/text/styleable-text'
import StyleRange from '../../common/text/style-range'
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

var getTextNodeFragmentDescriptorsAtHelper = function(stateObj, targetStartIndex, targetEndIndex) {
	if (stateObj.curNode.nodeType === 'element') {
		return Array.from(stateObj.curNode.children).map(
			child => (
				(stateObj.curNode = child),
				getTextNodeFragmentDescriptorsAtHelper(stateObj, targetStartIndex, targetEndIndex)
			)
		)
	} else {
		let charsRead = stateObj.charsRead + stateObj.curNode.text.length

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

let getTextNodeFragmentDescriptorsAt = function(rootNode, startIndex, endIndex) {
	let stateObj = {
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

	let fragmentDescriptors = stateObj.inbetween

	if (stateObj.start !== null) {
		fragmentDescriptors.unshift(stateObj.start)
	}
	if (stateObj.end !== null) {
		fragmentDescriptors.push(stateObj.end)
	}

	return fragmentDescriptors
}

let wrapElement = function(styleRange, nodeToWrap, text) {
	let newChild, node, root
	switch (styleRange.type) {
		case 'sup':
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

		case '_comment':
			newChild = new MockElement('span', Object.assign({ class: 'comment' }, styleRange.data))
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild)
			newChild.addChild(nodeToWrap)
			nodeToWrap.text = text
			return newChild

		case '_latex':
			newChild = new MockElement('span', Object.assign({ class: 'latex' }, styleRange.data))
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild)
			newChild.addChild(nodeToWrap)
			let html = katex.renderToString(text)
			nodeToWrap.html = html
			nodeToWrap.text = text
			return newChild

		default:
			newChild = new MockElement(styleRange.type, Object.assign({}, styleRange.data))
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild)
			newChild.addChild(nodeToWrap)
			nodeToWrap.text = text
			return newChild
	}
}

let wrap = function(styleRange, nodeFragmentDescriptor) {
	let newChild
	let nodeToWrap = nodeFragmentDescriptor.node
	let { text } = nodeToWrap
	let fromPosition = nodeFragmentDescriptor.startIndex
	let toPosition = nodeFragmentDescriptor.endIndex

	let leftText = text.substring(0, fromPosition)
	let wrappedText = text.substring(fromPosition, toPosition)
	let rightText = text.substring(toPosition)

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

let applyStyle = function(el, styleRange) {
	let fragmentDescriptors = getTextNodeFragmentDescriptorsAt(el, styleRange.start, styleRange.end)
	return (() => {
		let result = []
		for (let i = fragmentDescriptors.length - 1; i >= 0; i--) {
			let fragmentDescriptor = fragmentDescriptors[i]
			result.push(wrap(styleRange, fragmentDescriptor))
		}
		return result
	})()
}

let getMockElement = function(styleableText) {
	// console.time 'getMockElement'
	let root = new MockElement('span')
	root.addChild(new MockTextNode(styleableText.value))

	for (let styleType of Array.from(ORDER)) {
		for (let styleRange of Array.from(styleableText.styleList.styles)) {
			if (styleRange.type === styleType) {
				applyStyle(root, styleRange)
			}
		}
	}

	// console.timeEnd 'getMockElement'

	return root
}

// __debugPrintFragments = (fragments) ->
// 	s = ''
// 	for fragment in fragments
// 		s += fragment.node.text + '(' + fragment.startIndex + ':' + fragment.endIndex + ') '

// 	console.log 'Fragments=', fragments, s

var __debugPrintNode = function(node, indent) {
	if (indent == null) {
		indent = ''
	}
	if (node.nodeType === 'element') {
		console.log(indent + node.type)
		return Array.from(node.children).map(child => __debugPrintNode(child, indent + '  '))
	} else {
		return console.log(indent + '[' + node.text + ']')
	}
}

var __getHTML = function(node) {
	if (node.nodeType === 'text') {
		return node.text
	}

	return `<${node.type}>${node.children.map(child => __getHTML(child)).join('')}</${node.type}>`
}

window.__getMockElement = getMockElement
window.__debugPrintNode = __debugPrintNode
window.__getHTML = __getHTML

export default getMockElement
