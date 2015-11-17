Text = require '../../components/text'
TextGroup = require './textgroup'

POS = require './textpositionmethods'

methods =
	# SERIALIZATION/DECODE METHODS
	# ================================================
	createNodeDataFromDescriptor: (descriptor) ->
		textGroup: TextGroup.fromDescriptor descriptor.data.textGroup
		indent: 0

	getDataDescriptor: (oboNode) ->
		indent: oboNode.data.indent
		textGroup: oboNode.data.textGroup.toDescriptor()

	# STATE QUERIES
	# ================================================
	getCaretEdge: (sel, oboNode) ->
		info = POS.getCaretInfo sel.start, oboNode

		if info.textIndex is 0 and info.offset <= 0 then return 'start'
		if info.textIndex is oboNode.data.textGroup.length - 1 and info.offset >= oboNode.data.textGroup.last.text.length then return 'end'
		'inside'

	# CARET OPERATIONS
	# ================================================
	insertText: (sel, oboNode, textToInsert) ->
		info = POS.getCaretInfo sel.start, oboNode
		info.text.insertText info.offset, textToInsert

		sel.setFutureCaret sel.start.oboNode, { offset: info.offset + textToInsert.length, childIndex: info.textIndex }

	deleteText: (sel, oboNode, deleteForwards) ->
		info = POS.getCaretInfo sel.start, oboNode

		if not deleteForwards and info.offset is 0 and info.text isnt oboNode.data.textGroup.first
			sel.setFutureCaret oboNode, { offset: oboNode.data.textGroup.get(info.textIndex - 1).text.length, childIndex: info.textIndex - 1}
			oboNode.data.textGroup.merge info.textIndex - 1
			return

		if deleteForwards and info.offset is info.text.length and info.text isnt oboNode.data.textGroup.last and oboNode.data.textGroup.length > 1
			sel.setFutureCaret oboNode, { offset: info.offset, childIndex: info.textIndex }
			oboNode.data.textGroup.merge info.textIndex
			return

		[start, end] = if not deleteForwards then [info.offset - 1, info.offset] else [info.offset, info.offset + 1]

		info.text.deleteText start, end

		sel.setFutureCaret oboNode, { offset: start, childIndex: info.textIndex }

	splitText: (sel, oboNode, shiftKey) ->
		info = POS.getCaretInfo sel.start, oboNode

		newText = info.text.split info.offset

		clonedNode = oboNode.clone()
		clonedNode.data.textGroup.first.text = newText
		oboNode.addAfter clonedNode

		sel.setFutureCaret clonedNode, { offset: 0, childIndex: 0 }

	# MODIFY SELECTION OPERATIONS
	# ================================================

	deleteSelection: (sel, oboNode) ->
		span = POS.getSelSpanInfo sel, oboNode

		oboNode.data.textGroup.deleteSpan span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, @mergeTextGroups

		range = sel.getRange(oboNode.domEl)
		if range is 'start' or range is 'both'
			sel.setFutureCaret oboNode, { offset: span.start.offset, childIndex: span.start.textIndex }

	styleSelection: (sel, oboNode, styleType, styleData) ->
		span = POS.getSelSpanInfo sel, oboNode

		oboNode.data.textGroup.toggleStyleText span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, styleType, styleData

		POS.reselectSpan sel, oboNode, span

	# NO SELECTION OPERATIONS
	# ================================================

	merge: (sel, consumerNode, digestedNode) ->
		oldTextLength = consumerNode.data.textGroup.last.text.length

		consumerNode.data.textGroup.last.text.merge digestedNode.data.textGroup.first.text
		digestedNode.remove()

		sel.setFutureCaret consumerNode, { offset: oldTextLength, childIndex: consumerNode.data.textGroup.length - 1 }

	indent: (sel, oboNode, decreaseIndent) ->
		if sel.type is 'caret'
			info = POS.getCaretInfo sel.start, oboNode
			if info.textIndex isnt 0 or info.offset isnt 0
				return @insertText sel, oboNode, "\t"

		if not decreaseIndent
			oboNode.data.indent++
		else if oboNode.data.indent > 0
			oboNode.data.indent--

	# STORING SELECTION OPERATIONS
	# ================================================

	saveSelection: (sel, oboNode, cursor) ->
		info = POS.getCaretInfo cursor, oboNode
		childIndex: info.textIndex
		offset:     info.offset

	restoreSelection: (sel, oboNode, savedSelData) ->
		console.log '_____________________________restore selection', arguments
		node = POS.getTextNode oboNode, savedSelData.childIndex
		console.log node
		return null if not node?

		Text.getDomPosition savedSelData.offset, node

	updateSelection: (sel, oboNode, type) ->
		if type is 'start' or type is 'inside'
			node = POS.getTextNode oboNode, sel.futureStart.data.childIndex
			o = Text.getDomPosition sel.futureStart.data.offset, node
			sel.setStart o.textNode, o.offset

		if type is 'end' or type is 'inside'
			node = POS.getTextNode oboNode, sel.futureEnd.data.childIndex
			o = Text.getDomPosition sel.futureEnd.data.offset, node
			sel.setEnd o.textNode, o.offset

	# decorate: (component) ->
	# 	console.log 'DECORATE', methods, component
	# 	for method, methodName in methods
	# 		console.log method, methodName
	# 		continue if methodName is 'decorate'
	# 		component[methodName] = method

module.exports = methods