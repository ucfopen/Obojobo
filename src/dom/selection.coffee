# Chrome sometimes has range startContainer / endContainer as an element node
# so we need to dig down in this case to find the first text node
getTextNode = (node) ->
	while node? and node.nodeType isnt Node.TEXT_NODE
		node = node.childNodes[0]

	node

class Selection
	constructor: ->
		@domSelection = window.getSelection()
		@domRange = null

		if @domSelection.rangeCount > 0
			@domRange = @domSelection.getRangeAt 0

	getType: ->
		if @domSelection.type?
			return @domSelection.type.toLowerCase()

		if @domSelection.isCollapsed?
			if @domSelection.isCollapsed
				return 'caret'
			else
				return 'range'

		if @domSelection.focusNode is @domSelection.anchorNode and @domSelection.focusOffset is @domSelection.anchorOffset
			return 'caret'

		'range'

	getClientRects: ->
		if not @domRange? then return []
		@domRange.getClientRects()

	set: (startNode, startOffset, endNode, endOffset) ->
		r = document.createRange()

		r.setStart startNode, startOffset
		r.setEnd endNode, endOffset

		@domSelection.removeAllRanges()
		@domSelection.addRange r


Object.defineProperties Selection.prototype, {
	startContainer:
		get: -> getTextNode @domRange.startContainer
	startOffset:
		get: -> @domRange.startOffset
	endContainer:
		get: -> getTextNode @domRange.endContainer
	endOffset:
		get: -> @domRange.endOffset
}


module.exports = Selection