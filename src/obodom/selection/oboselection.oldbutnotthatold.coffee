# ComponentMap = require '../../components/componentmap'

# getSelectionDescriptor = (node, type, index = -1) ->
# 	id: node.getAttribute('data-comp-id')
# 	type: node.getAttribute('data-comp-type')
# 	component: ComponentMap.getComponentOfElement node
# 	type: type
# 	index: index

# class OboSelection
# 	constructor: () ->
# 		@update()

# 	update: ->


# 		@sel =
# 			start: @getOboTextPos(r.startContainer, r.startOffset, React.findDOMNode(@))
# 			end:   @getOboTextPos(r.endContainer, r.endOffset, React.findDOMNode(@))


# 		# EditableText1
# 		# |               |              |
# 		# ParagraphA      ParagraphB     ListA
# 		# |               |              |
# 		# a*[**           b****          ParagraphC
# 		#                                |
# 		#                                c*]**

# 		# EditableText1(  ParagraphA(  a(  *[**  )  )  ParagraphB(  b(  ****  )  )  ListA(  ParagraphC(  c(  *]**  )  )  )  )
# 		# ctnBoth         ctnStart     starting        inside       inside          ctnEnd  ctnEnd       ending

# 		# EditableText1 ()
# 		#  ParagraphA (Contains)
# 		#    a (Start)
# 		#  ParagraphB (Contains)
# 		#  ListA (Contains)
# 		#    ParagraphC (Contains)
# 		#      c (End)

# 		# OboSelection.CONTAINS_BOTH = 'containsBoth'
# 		# OboSelection.STARTING = 'starting'
# 		# OboSelection.CONTAINS_START = 'containsStart'
# 		# OboSelection.INSIDE = 'inside'
# 		# OboSelection.CONTAINS_END = 'containsEnd'
# 		# OboSelection.ENDING = 'ending'

# 		# MERGE
# 		# INSERT
# 		# SPLIT
# 		# DELETE
# 		#



# 		range = window.getSelection().getRangeAt(0)

# 		@start =
# 			domContainer: r.startContainer
# 			domOffset: r.startOffset
# 			entry: null
# 			path: []

# 		@end =
# 			domContainer: r.endContainer
# 			domOffset: r.endOffset
# 			entry: null
# 			path: []

# 		node = r.startContainer
# 		type = 'start'
# 		while node isnt document.body
# 			if node.getAttribute?('data-comp-id')
# 				o = getSelectionDescriptor node, type
# 				@start.path.push o
# 				@start.entry = o
# 				type = 'full'
# 			node = node.parentElement

# 		node = r.endContainer
# 		while node isnt document.body
# 			if node.getAttribute?('data-comp-id')
# 				o = getSelectionDescriptor node, 'full'
# 				@end.path.push o
# 				@end.entry = o
# 			node = node.parentElement
# 		sel.end.entry.type = 'end'





# 	select: ->
# 		@update()

# 		sel = window.getSelection()
# 		newRange = new Range

# 		newRange.setStart @domEnd.node, @domStart.offset
# 		newRange.setEnd @domEnd.node, @domEnd.offset

# 		sel.removeAllRanges()
# 		sel.addRange newRange

# 	getBounds: ->
# 		if not @spansMultipleChunks
# 			return OboSelectionRect.createFromSelection()

# 		OboSelectionRect.createFromChunks @chunks

# 	equivalentToObject: (selObject) ->
# 		same = true
# 		for k, v of @getExportedObject()
# 			if selObject[k] isnt v
# 				same = false
# 				break

# 		same

# 	getRangeType: (node) ->
# 		containsStart = node.contains @start.focus.oboNode
# 		containsEnd   = node.contains @end.focus.oboNode

# 		switch
# 			when containsStart and containsEnd then OboSelection.NODE_CONTAINS_FULL_SELECTION
# 			when containsStart then                 OboSelection.NODE_CONTAINS_SELECTION_START
# 			when containsEnd then                   OboSelection.NODE_CONTAINS_SELECTION_END
# 			else                                    OboSelection.NODE_OUTSIDE_SELECTION



# Object.defineProperties OboSelection.prototype,
# 	"valid":
# 		get: -> @start? and @end?
# 	"spansMultipleCharacters":
# 		get: -> @valid and (@spansMultipleChunks or (@start.focus.textPos isnt @end.focus.textPos))
# 	"spansMultipleChunks":
# 		get: -> @valid and @start.focus.oboNode isnt @end.focus.oboNode
# 	"chunks":
# 		get: ->
# 			console.log 'TRYING TO GET CHANKS'
# 			console.log @ancestor
# 			return [] if not @valid

# 			val = []
# 			cur = @start.focus.oboNode
# 			while cur isnt @end.focus.oboNode
# 				val.push cur
# 				# cur = cur.nextSibling
# 				cur = cur.next
# 			val.push cur

# 			val
# 	"inbetween":
# 		get: ->
# 			_chunks = @chunks
# 			_chunks.slice 1, _chunks.length - 1
# 	"ancestor":
# 		get: -> @start.getCommonAncestor @end


# # OboSelection.NODE_CONTAINS_FULL_SELECTION = 'containsFull'
# # OboSelection.NODE_CONTAINS_SELECTION_START = 'containsStart'
# # OboSelection.NODE_CONTAINS_SELECTION_END = 'containsEnd'
# # OboSelection.NODE_OUTSIDE_SELECTION = 'outside'
# # OboSelection.NODE_INSIDE_SELECTION = 'inside'


# OboSelection.CONTAINS_BOTH = 'containsBoth'
# OboSelection.STARTING = 'starting'
# OboSelection.CONTAINS_START = 'containsStart'
# OboSelection.INSIDE = 'inside'
# OboSelection.CONTAINS_END = 'containsEnd'
# OboSelection.ENDING = 'ending'

# module.exports = OboSelection