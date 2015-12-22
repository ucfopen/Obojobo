class Selection
	constructor: ->
		@domSelection = window.getSelection()
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
		@domRange.getClientRects()

	set: (startNode, startOffset, endNode, endOffset) ->
		r = document.createRange()

		r.setStart startNode, startOffset
		r.setEnd endNode, endOffset

		@domSelection.removeAllRanges()
		@domSelection.addRange r


Object.defineProperties Selection.prototype, {
	startContainer:
		get: -> @domRange.startContainer
	startOffset:
		get: -> @domRange.startOffset
	endContainer:
		get: -> @domRange.endContainer
	endOffset:
		get: -> @domRange.endOffset
}


module.exports = Selection