OboCursor = require './obocursor'
Selection = require '../../dom/selection'
DOMUtil = require '../../dom/domutil'

domType = null

class OboSelection
	constructor: (@module) ->
		s = new Selection()

		start = @getChunkForDomNode s.startContainer
		end   = @getChunkForDomNode s.endContainer

		@start     = new OboCursor(start, s.startContainer, s.startOffset)
		@end       = new OboCursor(end, s.endContainer, s.endOffset)
		@calculateAllNodes()

		domType = s.getType()

		@futureStart = @futureEnd = null

	calculateAllNodes: ->
		@inbetween   = []
		@all = [@start.chunk]

		n = @start.chunk
		while n? and n isnt @end.chunk
			if n isnt @start.chunk
				@inbetween.push n
				@all.push n
			n = n.nextSibling()

		if @all[@all.length - 1] isnt @end.chunk
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

		s = new Selection()
		s.set @start.node, @start.offset, @end.node, @end.offset

		# s = window.getSelection()
		# r = new Range

		# r.setStart @start.node, @start.offset
		# r.setEnd @end.node, @end.offset

		# s.removeAllRanges()
		# s.addRange r

	collapse: ->
		@end = @start.clone()

	setFutureStart: (chunkOrIndex, data) ->
		@futureStart =
			index: if not isNaN(chunkOrIndex) then chunkOrIndex else chunkOrIndex.get('index')
			data: data

	setFutureEnd: (chunkOrIndex, data) ->
		@futureEnd =
			index: if not isNaN(chunkOrIndex) then chunkOrIndex else chunkOrIndex.get('index')
			data: data

	setFutureCaret: (chunk, data) ->
		@setFutureStart chunk, data
		@setFutureEnd   chunk, data

	clearFuture: ->
		@futureStart = @futureEnd = null



Object.defineProperties OboSelection.prototype, {
	"type": {
		get: ->
			s = new Selection()

			if @start.chunk.cid is @end.chunk.cid
				if domType is 'caret'
					return 'caret'
				else
					return 'textSpan'
			else
				return 'nodeSpan'
	}
}


OboSelection.createDescriptor = (startIndex, startData, endIndex, endData) ->
	start:
		index: startIndex
		data:  startData
	end:
		index: endIndex
		data:  endData



module.exports = OboSelection