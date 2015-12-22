Text = require '../components/text'
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
		chunk.markChanged()

		info = POS.getCaretInfo sel.start, chunk
		info.text.insertText info.offset, textToInsert

		if styles?
			for style in styles
				info.text.styleText info.offset, info.offset + 1, style

		sel.setFutureCaret sel.start.chunk, { offset: info.offset + textToInsert.length, childIndex: info.textIndex }

	deleteText: (sel, chunk, deleteForwards) ->
		chunk.markChanged()

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

		console.log 'deleteText'
		info.text.__debug_print()

		sel.setFutureCaret chunk, { offset: start, childIndex: info.textIndex }

	splitText: (sel, chunk, shiftKey) ->
		chunk.markChanged()

		info = POS.getCaretInfo sel.start, chunk

		newText = info.text.split info.offset

		clonedNode = chunk.clone()
		clonedNode.get('data').textGroup.first.text = newText
		chunk.addAfter clonedNode

		sel.setFutureCaret clonedNode, { offset: 0, childIndex: 0 }

	# MODIFY SELECTION OPERATIONS
	# ================================================

	deleteSelection: (sel, chunk) ->
		chunk.markChanged()

		span = POS.getSelSpanInfo sel, chunk

		chunk.get('data').textGroup.deleteSpan span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, @mergeTextGroups

		range = sel.getRange(chunk.getDomEl())
		if range is 'start' or range is 'both'
			sel.setFutureCaret chunk, { offset: span.start.offset, childIndex: span.start.textIndex }

	styleSelection: (sel, chunk, styleType, styleData) ->
		chunk.markChanged()

		span = POS.getSelSpanInfo sel, chunk
		data = chunk.get('data')

		data.textGroup.styleText span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, styleType, styleData

		POS.reselectSpan sel, chunk, span

	unstyleSelection: (sel, chunk, styleType, styleData) ->
		chunk.markChanged()

		span = POS.getSelSpanInfo sel, chunk
		data = chunk.get('data')

		data.textGroup.unstyleText span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, styleType, styleData

		POS.reselectSpan sel, chunk, span

	getSelectionStyles: (sel, chunk) ->
		span = POS.getSelSpanInfo sel, chunk
		data = chunk.get('data')

		data.textGroup.getStyles span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset

	# NO SELECTION OPERATIONS
	# ================================================

	# acceptMerge: (sel, digestedChunk, consumerChunk) -> true

	# Allows the chunk to be merged to do what it needs to
	# willBeMergedDelete: (sel, digestedChunk, consumerChunk) ->
	# 	console.log 'willBeMergedDelete', arguments
	# 	digestedChunk.remove()
	# 	false

	# willBeMergedAccept: (sel, digestedChunk, consumerChunk) ->
	# 	console.log 'willBeMergedAccept'
	# 	true

	# willBeMergedReject: (sel, digestedChunk, consumerChunk) ->
	# 	false

	canMergeWith: (sel, digestedChunk, consumerChunk) ->
		digestedChunk.get('data').textGroup? and consumerChunk.get('data').textGroup?

	# mergeDelete: (sel, consumerChunk, digestedChunk) ->
		# consumerChunk.replaceWith digestedChunk

		# startInfo = POS.getStartInfo digestedChunk
		# sel.setFutureCaret digestedChunk, { childIndex:startInfo.textIndex, offset:startInfo.offset }

	merge: (sel, consumerChunk, digestedChunk) ->
		consumerChunk.markChanged()

		consumerData = consumerChunk.get 'data'
		digestedData = digestedChunk.get 'data'

		if not digestedData.textGroup?
			digestedChunk.remove()
			return

		oldTextLength = consumerData.textGroup.last.text.length
		oldIndex = consumerData.textGroup.length - 1

		consumerData.textGroup.last.text.merge digestedData.textGroup.first.text
		digestedData.textGroup.remove 0

		while not consumerData.textGroup.isFull and digestedData.textGroup.length > 0
			item = digestedData.textGroup.first
			consumerData.textGroup.add item.text, item.data
			digestedData.textGroup.remove 0

		if digestedData.textGroup.length is 0
			digestedChunk.remove()

		sel.setFutureCaret consumerChunk, { offset: oldTextLength, childIndex: oldIndex }

	indent: (sel, chunk, decreaseIndent) ->
		chunk.markChanged()

		if sel.type is 'caret'
			info = POS.getCaretInfo sel.start, chunk
			if info.textIndex isnt 0 or info.offset isnt 0
				return @insertText sel, chunk, "\t"

		data = chunk.get 'data'

		if not decreaseIndent
			data.indent++
		else if data.indent > 0
			data.indent--

	#@TODO - GET RID OF THIS
	init: (sel, chunk) ->
		chunk.get('data').textGroup.init 0

	# Return true if chunkToBeDigested is OK with its contents being absorbed by consumerChunk
	acceptAbsorb: (sel, chunkToBeDigested, consumerChunk) ->
		chunkToBeDigested.get('data').textGroup? and consumerChunk.get('data').textGroup?

	# consumerChunk will absorb the contents of digestedChunk
	# returns the newly created chunks
	absorb: (sel, consumerChunk, digestedChunk) ->
		return [] if not digestedChunk.callComponentFn 'acceptAbsorb', sel, [consumerChunk]

		addedChunks = []
		digestedTextGroup = digestedChunk.get('data').textGroup

		while not digestedTextGroup.isEmpty
			newChunk = consumerChunk.clone()
			newTextGroup = newChunk.get('data').textGroup
			newTextGroup.clear()

			while not newTextGroup.isFull and not digestedTextGroup.isEmpty
				item = digestedTextGroup.remove(0)
				newTextGroup.add item.text, item.data

			addedChunks.push newChunk
			digestedChunk.addBefore newChunk

		digestedChunk.remove()

		addedChunks

	# The selection will be transformed into one or more newChunk chunks
	transformSelection: (sel, newChunk) ->
		data = newChunk.get('data')

		if sel.type isnt 'nodeSpan'
			sel.start.chunk.callComponentFn 'split', sel
			newChunks = newChunk.callComponentFn 'absorb', sel, [sel.start.chunk]

			firstChunk = newChunks[0]
			lastChunk = newChunks[newChunks.length - 1]
		else
			sel.start.chunk.callComponentFn 'split', sel
			newTopChunks = newChunk.callComponentFn 'absorb', sel, [sel.start.chunk]

			for digestableChunk in sel.inbetween
				newChunk.callComponentFn 'absorb', sel, [digestableChunk]

			sel.end.chunk.callComponentFn 'split', sel
			newBottomChunks = newChunk.callComponentFn 'absorb', sel, [sel.end.chunk]

			firstChunk = newTopChunks[0]
			lastChunk = newBottomChunks[newBottomChunks.length - 1]

		startInfo = POS.getStartInfo firstChunk
		endInfo = POS.getEndInfo lastChunk
		sel.setFutureStart firstChunk, { childIndex:startInfo.textIndex, offset:startInfo.offset }
		sel.setFutureEnd lastChunk, { childIndex:endInfo.textIndex, offset:endInfo.offset }

	# split chunk into a possible total of three new chunks - one before the selection, one containing the selection and one after the selection
	split: (sel, chunk) ->
		chunk.markChanged()

		span = POS.getSelSpanInfo sel, chunk
		data = chunk.get('data')

		allTextSelected = span.start.textIndex is 0 and span.end.textIndex is data.textGroup.length - 1
		return if allTextSelected

		top = chunk.clone()
		middle = chunk
		bottom = chunk.clone()

		top.get('data').textGroup.slice    0,                      span.start.textIndex
		middle.get('data').textGroup.slice span.start.textIndex,   span.end.textIndex + 1
		bottom.get('data').textGroup.slice span.end.textIndex + 1, Infinity

		if top.get('data').textGroup.length > 0
			middle.addBefore top

		if bottom.get('data').textGroup.length > 0
			middle.addAfter bottom

	# absorb: (sel, chunk, chunksToAbsorb) ->
	# 	console.log 'split', arguments

	# 	span = POS.getSelSpanInfo sel, chunk
	# 	range = sel.getRange(chunk.getDomEl())
	# 	data = chunk.get('data')

	# 	allTextSelected = span.start.textIndex is 0 and span.end.textIndex is data.textGroup.length - 1

	# 	console.log allTextSelected

	# 	return if allTextSelected

	# 	top = chunk.clone()
	# 	middle = chunk
	# 	bottom = chunk.clone()

	# 	top.get('data').textGroup.slice    0,                      span.start.textIndex
	# 	middle.get('data').textGroup.slice span.start.textIndex,   span.end.textIndex + 1
	# 	bottom.get('data').textGroup.slice span.end.textIndex + 1, Infinity

	# 	console.log top, middle, bottom

	# 	if top.get('data').textGroup.length > 0
	# 		middle.addBefore top

	# 	if bottom.get('data').textGroup.length > 0
	# 		middle.addAfter bottom

	# 		middle.callComponentFn 'transformSelf', sel, [newChunk]

	# transformSelf: (sel, chunk, newChunk) ->
	# 	oldTextGroup = chunk.get('data').textGroup
	# 	newTextGroup = newChunk.get('data').textGroup

	# 	# oldTextGroup.clear()

	# 	curChunk = false
	# 	while not newTextGroup.isFull
	# 		newTextGroup.add
	# 	oldTextGroup.addGroup newTextGroup

	# STORING SELECTION OPERATIONS
	# ================================================

	saveSelection: (sel, chunk, cursor) ->
		info = POS.getCaretInfo cursor, chunk

		childIndex: info.textIndex
		offset:     info.offset

	# Take descriptor at savedSelData and turn it into sel.*
	restoreSelection: (sel, chunk, type, savedSelData) ->
		node = POS.getTextNode chunk, savedSelData.childIndex
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