OboCursor = require './obocursor'

class OboSelection
	constructor: (@module) ->
		s = window.getSelection()
		r = s.getRangeAt(0)

		start = @getChunkForDomNode r.startContainer
		end   = @getChunkForDomNode r.endContainer

		@start     = new OboCursor(start, r.startContainer, r.startOffset)
		@end       = new OboCursor(end, r.endContainer, r.endOffset)
		@calculateAllNodes()

		@futureStart = @futureEnd = null

	calculateAllNodes: ->
		# console.log 'CAN'
		# console.log __lo.__debug_print()

		@inbetween   = []
		@all = [@start.chunk]

		n = @start.chunk
		while n? and n isnt @end.chunk
			# console.log 'LOOKING AT', n
			# console.log 'COMPARE   ', @end.chunk
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
		hasStart = parentElement.contains @start.node
		hasEnd   = parentElement.contains @end.node

		if not hasStart and not hasEnd then return 'insideOrOutside'
		if     hasStart and not hasEnd then return 'start'
		if not hasStart and     hasEnd then return 'end'
		'both'

	getIndex: (node) ->
		while node?
			if node.getAttribute? and node.getAttribute('data-component-index')?
				return node.getAttribute('data-component-index')
			node = node.parentElement

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

		s = window.getSelection()
		r = new Range

		r.setStart @start.node, @start.offset
		r.setEnd @end.node, @end.offset

		s.removeAllRanges()
		s.addRange r

	collapse: ->
		@end = @start.clone()

	setFutureStart: (chunk, data) ->
		@futureStart =
			index: chunk.getIndex()
			data: data

	setFutureEnd: (chunk, data) ->
		@futureEnd =
			index: chunk.getIndex()
			data: data

	setFutureCaret: (chunk, data) ->
		@setFutureStart chunk, data
		@setFutureEnd   chunk, data

	clearFuture: ->
		@futureStart = @futureEnd = null

	getDescriptor: ->
		@constructor.createDescriptor(
			@start.chunk.getIndex(),
			@start.chunk.callComponentFn('saveSelection', @, [@start]),
			@end.chunk.getIndex(),
			@end.chunk.callComponentFn('saveSelection', @, [@end])
		)

	getFutureDescriptor: ->
		if not @futureStart? or not @futureEnd? then return null

		@constructor.createDescriptor(
			@futureStart.index,
			@futureStart.data,
			@futureEnd.index,
			@futureEnd.data
		)



Object.defineProperties OboSelection.prototype, {
	"type": {
		get: ->
			s = window.getSelection()

			if @start.chunk.cid is @end.chunk.cid
				if s.type is 'Caret'
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