TextCursor = require './textcursor'
DOMSelection = require '../../dom/domselection'
DOMUtil = require '../../dom/domutil'

domType = null

class TextSelection
	constructor: (@module) ->
		s = new DOMSelection()

		start = @getChunkForDomNode s.startContainer
		end   = @getChunkForDomNode s.endContainer

		@start     = new TextCursor(start, s.startContainer, s.startOffset)
		@end       = new TextCursor(end, s.endContainer, s.endOffset)
		@calculateAllNodes()

		domType = s.getType()

	calculateAllNodes: ->
		@inbetween   = []

		if @start?.chunk?
			@all = [@start.chunk]

		n = @start.chunk
		while n? and n isnt @end.chunk
			if n isnt @start.chunk
				@inbetween.push n
				@all.push n
			n = n.nextSibling()

		if @end?.chunk? and @all[@all.length - 1] isnt @end.chunk
			@all.push @end.chunk

	getChunkForDomNode: (domNode) ->
		index = @getIndex domNode
		@module.chunks.at index

	getRange: (parentElement) ->
		# IE 10 doesn't support contains for text nodes, so we have to query their parentNodes (https://connect.microsoft.com/IE/feedback/details/780874/node-contains-is-incorrect)
		hasStart = parentElement.contains @start.node.parentNode
		hasEnd   = parentElement.contains @end.node.parentNode

		if not hasStart and not hasEnd then return 'insideOrOutside'
		if     hasStart and not hasEnd then return 'start'
		if not hasStart and     hasEnd then return 'end'
		'both'

	getIndex: (node) ->
		DOMUtil.findParentAttr node, 'data-component-index'

	setStart: (node, offset) ->
		@start.node = node
		@start.offset = offset
		@start.chunk = @getChunkForDomNode node
		@calculateAllNodes()

	setEnd: (node, offset) ->
		@end.node = node
		@end.offset = offset
		@end.chunk = @getChunkForDomNode node
		@calculateAllNodes()

	setCaret: (node, offset) ->
		@setStart node, offset
		@collapse()

	select: ->
		return if not @start.node? or not @end.node?

		s = new DOMSelection()
		s.set @start.node, @start.offset, @end.node, @end.offset

	collapse: ->
		@end = @start.clone()





Object.defineProperties TextSelection.prototype, {
	"type": {
		get: ->
			if not @start.chunk? or not @end.chunk?
				return 'none'
			else if @start.chunk.cid is @end.chunk.cid
				if domType is 'caret'
					return 'caret'
				else
					return 'textSpan'
			else
				return 'nodeSpan'
	}
}


TextSelection.createDescriptor = (startIndex, startData, endIndex, endData) ->
	start:
		index: startIndex
		data:  startData
	end:
		index: endIndex
		data:  endData



module.exports = TextSelection