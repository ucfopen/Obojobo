OboTextSelectionCaret = require './obotextselectioncaret'
OboSelectionDOMUtil = require './oboselectiondomutil'

OboNodeUtil = require '../obonodeutil'

Text = require '../../components/text'


getNodesFromNodeToNode = (startNode, endNode) ->
	nodes = []
	OboNodeUtil.getDFS nodes, startNode.root

	nodes.slice nodes.indexOf(startNode), nodes.indexOf(endNode) + 1


class OboSelection
	# new OboSelection(): Create from native selection (requires DOM)
	# new OboSelection(descriptorObject): Create from descriptor (requires DOM)
	# new OboSelection(id, number, id, number): Create from arguments
	constructor: (descriptorOrStartIndex = null, startTextIndex = null, endIndex = null, endTextIndex = null) ->
		descriptor = startIndex = descriptorOrStartIndex

		if descriptor? and typeof descriptor is 'object'
			startIndex = descriptor.start.index
			endIndex = descriptor.end.index
			startTextIndex = descriptor.start.textIndex
			endTextIndex = descriptor.end.textIndex
		else if not (startIndex and startTextIndex and endIndex and endTextIndex)
			range = window.getSelection().getRangeAt 0

			startNode = OboSelectionDOMUtil.findTextWithId(range.startContainer)
			endNode   = OboSelectionDOMUtil.findTextWithId(range.endContainer)

			startIndex = startNode.getAttribute('data-obo-index')
			endIndex = endNode.getAttribute('data-obo-index')
			startTextIndex = Text.getOboTextPos range.startContainer, range.startOffset, startNode
			endTextIndex = Text.getOboTextPos range.endContainer, range.endOffset, endNode

		@setStart startIndex, startTextIndex
		@setEnd   endIndex, endTextIndex

		@path = getNodesFromNodeToNode @start.oboNode, @end.oboNode

		window.__s

		console.log @, @.toDescriptor()

	setCaret: (textId, index) ->
		@setStart textId, index
		@collapse()

	setStart: (textId, index) ->
		@start = new OboTextSelectionCaret textId, index

	setEnd: (textId, index) ->
		@end = new OboTextSelectionCaret textId, index

	# Modifies selection to a caret
	collapse: ->
		@end = @start.clone()

	select: ->
		console.log 'SELECT', @
		return if not @start.domNode? or not @end.domNode?

		startDomPos = Text.getDomPosition @start.textIndex, @start.domNode
		endDomPos   = Text.getDomPosition @end.textIndex,   @end.domNode

		s = window.getSelection()
		r = new Range

		r.setStart startDomPos.textNode, startDomPos.offset
		r.setEnd endDomPos.textNode, endDomPos.offset

		s.removeAllRanges()
		s.addRange r

	toDescriptor: ->
		start: @start.toDescriptor()
		end: @end.toDescriptor()


Object.defineProperties OboSelection.prototype,
	"type":
		get: ->
			if @start.index isnt @end.index         then return 'nodeRange'
			if @start.textIndex isnt @end.textIndex then return 'textRange'
			return 'caret'


#@TODO
window.__s = OboSelection


module.exports = OboSelection