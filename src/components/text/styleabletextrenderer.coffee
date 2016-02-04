# Turns a StyleableText item into a mock DOM tree, which can then be used to render out in React

ObjectAssign = require 'object-assign'

StyleableText = require '../../text/styleabletext'
StyleRange = require '../../text/stylerange'
StyleType = require '../../text/styletype'
MockElement = require './mockelement'
MockTextNode = require './mocktextnode'


ORDER = [StyleType.COMMENT, StyleType.LINK, StyleType.QUOTE, StyleType.BOLD, StyleType.STRIKETHROUGH, StyleType.MONOSPACE, StyleType.SUPERSCRIPT, StyleType.ITALIC]

getTextNodeFragmentDescriptorsAtHelper = (stateObj, targetStartIndex, targetEndIndex) ->
	if stateObj.curNode.nodeType is 'element'
		for child in stateObj.curNode.children
			stateObj.curNode = child

			getTextNodeFragmentDescriptorsAtHelper stateObj, targetStartIndex, targetEndIndex
	else
		charsRead = stateObj.charsRead + stateObj.curNode.text.length

		if charsRead >= targetEndIndex and stateObj.end is null
			stateObj.end =
				node: stateObj.curNode
				startIndex: 0
				endIndex: targetEndIndex - stateObj.charsRead
		else if stateObj.start isnt null and stateObj.end is null
			stateObj.inbetween.push
				node: stateObj.curNode
				startIndex: 0
				endIndex: Infinity

		if charsRead >= targetStartIndex and stateObj.start is null
			stateObj.start =
				node: stateObj.curNode
				startIndex: targetStartIndex - stateObj.charsRead
				endIndex: Infinity

		stateObj.last =
			node: stateObj.curNode
			startIndex: 0
			endIndex: Infinity

		stateObj.charsRead = charsRead

getTextNodeFragmentDescriptorsAt = (rootNode, startIndex, endIndex) ->
	stateObj =
		charsRead: 0
		start: null
		inbetween: []
		end: null
		curNode: rootNode

	getTextNodeFragmentDescriptorsAtHelper stateObj, startIndex, endIndex
	if stateObj.end is null
		stateObj.end = stateObj.last

	# If start and end are equal just modify start and delete end
	if stateObj.start.node is stateObj.end.node
		stateObj.start.endIndex = stateObj.end.endIndex
		stateObj.end = null

	fragmentDescriptors = stateObj.inbetween

	if stateObj.start isnt null then fragmentDescriptors.unshift stateObj.start
	if stateObj.end isnt null then fragmentDescriptors.push stateObj.end

	return fragmentDescriptors

wrapElement = (styleRange, nodeToWrap, text) ->
	switch styleRange.type
		when 'sup'
			level = styleRange.data
			if level > 0
				node = root = new MockElement 'sup'
				while level > 1
					newChild = new MockElement 'sup'
					node.addChild newChild
					node = newChild
					level--
			else
				level = Math.abs level
				node = root = new MockElement 'sub'
				while level > 1
					newChild = new MockElement 'sub'
					node.addChild newChild
					node = newChild
					level--

			nodeToWrap.parent.replaceChild nodeToWrap, root
			node.addChild nodeToWrap
			nodeToWrap.text = text
			root

		when '_comment'
			newChild = new MockElement('span', ObjectAssign({ 'class':'comment' }, styleRange.data))
			nodeToWrap.parent.replaceChild nodeToWrap, newChild
			newChild.addChild nodeToWrap
			nodeToWrap.text = text
			newChild

		else
			newChild = new MockElement(styleRange.type, ObjectAssign({}, styleRange.data))
			nodeToWrap.parent.replaceChild nodeToWrap, newChild
			newChild.addChild nodeToWrap
			nodeToWrap.text = text
			newChild

wrap = (styleRange, nodeFragmentDescriptor) ->
	nodeToWrap = nodeFragmentDescriptor.node
	text = nodeToWrap.text
	fromPosition = nodeFragmentDescriptor.startIndex
	toPosition = nodeFragmentDescriptor.endIndex

	leftText = text.substring 0, fromPosition
	wrappedText = text.substring fromPosition, toPosition
	rightText = text.substring toPosition

	return if wrappedText.length is 0

	# add in left text
	if leftText.length > 0
		newChild = new MockTextNode(leftText)
		nodeToWrap.parent.addBefore newChild, nodeToWrap

	# add in wrapped text
	nodeToWrap = wrapElement styleRange, nodeToWrap, wrappedText

	# add in right text
	if rightText.length > 0
		newChild = new MockTextNode(rightText)
		nodeToWrap.parent.addAfter newChild, nodeToWrap

applyStyle = (el, styleRange) ->
	fragmentDescriptors = getTextNodeFragmentDescriptorsAt el, styleRange.start, styleRange.end
	for i in [fragmentDescriptors.length - 1..0] by -1
		fragmentDescriptor = fragmentDescriptors[i]
		wrap styleRange, fragmentDescriptor

getMockElement = (styleableText) ->
	# console.time 'getMockElement'
	root = new MockElement 'span'
	root.addChild new MockTextNode(styleableText.value)

	for styleType in ORDER
		for styleRange in styleableText.styleList.styles
			if styleRange.type is styleType
				applyStyle root, styleRange

	# console.timeEnd 'getMockElement'

	root

# __debugPrintFragments = (fragments) ->
# 	s = ''
# 	for fragment in fragments
# 		s += fragment.node.text + '(' + fragment.startIndex + ':' + fragment.endIndex + ') '

# 	console.log 'Fragments=', fragments, s

__debugPrintNode = (node, indent = '') ->
	if node.nodeType is 'element'
		console.log indent + node.type
		for child in node.children
			__debugPrintNode child, indent + '  '
	else
		console.log indent + '[' + node.text + ']'


__getHTML = (node) ->
	if node.nodeType is 'text'
		return node.text

	"<#{node.type}>#{node.children.map((child) -> __getHTML(child)).join('')}</#{node.type}>"



window.__getMockElement = getMockElement
window.__debugPrintNode = __debugPrintNode
window.__getHTML = __getHTML

module.exports = getMockElement