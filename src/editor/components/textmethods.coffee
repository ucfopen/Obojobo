Text = require '../../components/text'
TextGroup = require './textgroup'

POS = require './textpositionmethods'

mergeDataFn = (consumer, digested) -> consumer

methods =
	# STATE QUERIES
	# ================================================
	getCaretEdge: (sel, chunk) ->
		info = POS.getCaretInfo sel.start, chunk
		data = chunk.get 'data'

		if info.textIndex is 0 and info.offset <= 0 then return 'start'
		if info.textIndex is data.textGroup.length - 1 and info.offset >= data.textGroup.last.text.length then return 'end'
		'inside'

	# CARET OPERATIONS
	# ================================================
	insertText: (sel, chunk, textToInsert, styles = null) ->
		info = POS.getCaretInfo sel.start, chunk
		info.text.insertText info.offset, textToInsert

		if styles?
			for style in styles
				info.text.styleText info.offset, info.offset + 1, style

		sel.setFutureCaret sel.start.chunk, { offset: info.offset + textToInsert.length, childIndex: info.textIndex }

	deleteText: (sel, chunk, deleteForwards) ->
		info = POS.getCaretInfo sel.start, chunk
		data = chunk.get 'data'

		if not deleteForwards and info.offset is 0 and info.text isnt data.textGroup.first
			sel.setFutureCaret chunk, { offset: data.textGroup.get(info.textIndex - 1).text.length, childIndex: info.textIndex - 1}
			data.textGroup.merge info.textIndex - 1, mergeDataFn
			return

		if deleteForwards and info.offset is info.text.length and info.text isnt data.textGroup.last and data.textGroup.length > 1
			sel.setFutureCaret chunk, { offset: info.offset, childIndex: info.textIndex }
			data.textGroup.merge info.textIndex, mergeDataFn
			return

		[start, end] = if not deleteForwards then [info.offset - 1, info.offset] else [info.offset, info.offset + 1]

		info.text.deleteText start, end

		sel.setFutureCaret chunk, { offset: start, childIndex: info.textIndex }

	splitText: (sel, chunk, shiftKey) ->
		console.log 'splitText', arguments

		info = POS.getCaretInfo sel.start, chunk

		newText = info.text.split info.offset

		clonedNode = chunk.clone()
		clonedNode.get('data').textGroup.first.text = newText
		chunk.addAfter clonedNode

		sel.setFutureCaret clonedNode, { offset: 0, childIndex: 0 }

	# MODIFY SELECTION OPERATIONS
	# ================================================

	deleteSelection: (sel, chunk) ->
		span = POS.getSelSpanInfo sel, chunk

		chunk.get('data').textGroup.deleteSpan span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, @mergeTextGroups

		range = sel.getRange(chunk.getDomEl())
		if range is 'start' or range is 'both'
			sel.setFutureCaret chunk, { offset: span.start.offset, childIndex: span.start.textIndex }

	styleSelection: (sel, chunk, styleType, styleData) ->
		span = POS.getSelSpanInfo sel, chunk
		data = chunk.get('data')

		data.textGroup.toggleStyleText span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, styleType, styleData

		POS.reselectSpan sel, chunk, span

	getSelectionStyles: (sel, chunk) ->
		span = POS.getSelSpanInfo sel, chunk
		data = chunk.get('data')

		data.textGroup.getStyles span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset

	# NO SELECTION OPERATIONS
	# ================================================

	acceptMerge: (sel, digestedChunk, consumerChunk) -> true

	merge: (sel, consumerChunk, digestedChunk) ->
		console.clear()

		consumerData = consumerChunk.get 'data'
		digestedData = digestedChunk.get 'data'

		oldTextLength = consumerData.textGroup.last.text.length

		consumerData.textGroup.last.text.merge digestedData.textGroup.first.text
		digestedChunk.remove()

		sel.setFutureCaret consumerChunk, { offset: oldTextLength, childIndex: consumerData.textGroup.length - 1 }

	indent: (sel, chunk, decreaseIndent) ->
		if sel.type is 'caret'
			info = POS.getCaretInfo sel.start, chunk
			if info.textIndex isnt 0 or info.offset isnt 0
				return @insertText sel, chunk, "\t"

		data = chunk.get 'data'

		if not decreaseIndent
			data.indent++
		else if data.indent > 0
			data.indent--

	# STORING SELECTION OPERATIONS
	# ================================================

	saveSelection: (sel, chunk, cursor) ->
		info = POS.getCaretInfo cursor, chunk
		childIndex: info.textIndex
		offset:     info.offset

	# Take descriptor at savedSelData and turn it into sel.*
	restoreSelection: (sel, chunk, type, savedSelData) ->
		node = POS.getTextNode chunk, savedSelData.childIndex
		console.log node
		return null if not node?

		domPos = Text.getDomPosition savedSelData.offset, node

		if type is 'start'
			sel.setStart domPos.textNode, domPos.offset
		else if type is 'end'
			sel.setEnd domPos.textNode, domPos.offset

	# # Take sel.future* and turn it into sel.*
	# updateSelection: (sel, chunk, type) ->
	# 	if type is 'start' or type is 'inside'
	# 		node = POS.getTextNode chunk, sel.futureStart.data.childIndex
	# 		o = Text.getDomPosition sel.futureStart.data.offset, node
	# 		sel.setStart o.textNode, o.offset

	# 	if type is 'end' or type is 'inside'
	# 		node = POS.getTextNode chunk, sel.futureEnd.data.childIndex
	# 		o = Text.getDomPosition sel.futureEnd.data.offset, node
	# 		sel.setEnd o.textNode, o.offset

	selectStart: (sel, chunk) ->
		info = POS.getStartInfo chunk
		sel.setFutureCaret chunk, { childIndex:info.textIndex, offset:info.offset }

	selectEnd: (sel, chunk) ->
		info = POS.getEndInfo chunk
		sel.setFutureCaret chunk, { childIndex:info.textIndex, offset:info.offset }

	# TEXT MENU OPERATIONS
	# ================================================

	getTextMenuCommands: (sel, chunk) ->
		[
			{
				label: 'Bold',
				fn: (sel, chunk) -> chunk.callComponentFn 'styleSelection', sel, ['b']
			},
			{
				label: 'Italic',
				fn: (sel, chunk) -> chunk.callComponentFn 'styleSelection', sel, ['i']
			}
		]

	# decorate: (component) ->
	# 	console.log 'DECORATE', methods, component
	# 	for method, methodName in methods
	# 		console.log method, methodName
	# 		continue if methodName is 'decorate'
	# 		component[methodName] = method

module.exports = methods