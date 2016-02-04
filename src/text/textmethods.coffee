Text = require '../components/text'
TextGroup = require './textgroup'
linkify = require './linkify'

POS = require './textpositionmethods'

mergeDataFn = (consumer, digested) -> consumer

methods =
	# STATE QUERIES
	# ================================================
	getCaretEdge: (selection, chunk) ->
		info = POS.getCaretInfo selection.sel.start, chunk
		data = chunk.componentContent

		console.log 'getCaretEdge', info
		console.log '@TODO getCaretEdge not working with empty char'

		if info.textIndex is 0 and info.offset <= 0
			if data.textGroup.length is 1 and info.text.length is 0 then return 'startAndEnd'
			return 'start'
		if info.textIndex is data.textGroup.length - 1 and info.offset >= data.textGroup.last.text.length then return 'end'
		'inside'

	canRemoveSibling: (selection, chunk) -> true

	# CARET OPERATIONS
	# ================================================
	insertText: (selection, chunk, textToInsert, stylesToApply = null, stylesToRemove = null) ->
		chunk.markDirty()

		# stylesToApply = null
		# stylesToRemove = null
		# console.log '@TODO - broke this to test stuff'

		info = POS.getCaretInfo selection.sel.start, chunk
		info.text.insertText info.offset, textToInsert

		if stylesToApply?
			for style in stylesToApply
				info.text.styleText info.offset, info.offset + 1, style

		if stylesToRemove?
			for style in stylesToRemove
				info.text.unstyleText info.offset, info.offset + 1, style

		if textToInsert is ' ' and not info.text.getStyles(info.offset - 1, info.offset)['a']?
			linkify info.text

		selection.sel.setFutureCaret selection.sel.start.chunk, { offset: info.offset + textToInsert.length, childIndex: info.textIndex }

	deleteText: (selection, chunk, deleteForwards) ->
		chunk.markDirty()

		info = POS.getCaretInfo selection.sel.start, chunk
		data = chunk.componentContent

		# If backspacing at the start and the chunk is indented...
		if not deleteForwards and info.offset is 0 and data.indent? and ~~data.indent > 0
			# ...decrease indent
			data.indent--
			return true

		# If backspacing and the start of a text that's not the first text...
		if not deleteForwards and info.offset is 0 and info.text isnt data.textGroup.first.text
			# ...merge that text with the previous one
			selection.sel.setFutureCaret chunk, { offset: data.textGroup.get(info.textIndex - 1).text.length, childIndex: info.textIndex - 1}
			data.textGroup.merge info.textIndex - 1, mergeDataFn
			return true

		# If using delete key on the end of a text that's not the last text...
		if deleteForwards and info.offset is info.text.length and info.text isnt data.textGroup.last.text and data.textGroup.length > 1
			# ...merge that text with the next one
			selection.sel.setFutureCaret chunk, { offset: info.offset, childIndex: info.textIndex }
			data.textGroup.merge info.textIndex, mergeDataFn
			return true

		# If backspacing at the start of the first text nothing to delete, so unsuccessful
		if not deleteForwards and info.offset is 0 and info.text is data.textGroup.first.text
			return false

		# Likewise, if using delete key at the end of the last text then nothing to delete, so unsuccessful
		if deleteForwards and info.offset is info.text.length and info.text is data.textGroup.last.text
			return false

		# Otherwise, delete the text
		[start, end] = if not deleteForwards then [info.offset - 1, info.offset] else [info.offset, info.offset + 1]

		info.text.deleteText start, end

		# console.log 'deleteText'
		# info.text.__debug_print()

		selection.sel.setFutureCaret chunk, { offset: start, childIndex: info.textIndex }
		true

	splitText: (selection, chunk, shiftKey) ->
		chunk.markDirty()

		info = POS.getCaretInfo selection.sel.start, chunk

		newText = info.text.split info.offset

		clonedNode = chunk.clone()
		clonedNode.componentContent.textGroup.first.text = newText
		chunk.addAfter clonedNode

		selection.sel.setFutureCaret clonedNode, { offset: 0, childIndex: 0 }

	# MODIFY SELECTION OPERATIONS
	# ================================================

	deleteSelection: (selection, chunk) ->
		chunk.markDirty()

		span = POS.getSelSpanInfo selection.sel, chunk

		chunk.componentContent.textGroup.deleteSpan span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, @mergeTextGroups

		range = selection.sel.getRange(chunk.getDomEl())
		if range is 'start' or range is 'both'
			selection.sel.setFutureCaret chunk, { offset: span.start.offset, childIndex: span.start.textIndex }

	styleSelection: (selection, chunk, styleType, styleData) ->
		chunk.markDirty()

		span = POS.getSelSpanInfo selection.sel, chunk
		data = chunk.componentContent

		data.textGroup.styleText span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, styleType, styleData

		POS.reselectSpan selection.sel, chunk, span

	unstyleSelection: (selection, chunk, styleType, styleData) ->
		chunk.markDirty()

		span = POS.getSelSpanInfo selection.sel, chunk
		data = chunk.componentContent

		data.textGroup.unstyleText span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset, styleType, styleData

		POS.reselectSpan selection.sel, chunk, span

	getSelectionStyles: (selection, chunk) ->
		# console.log 'getSelectionStyles', arguments, chunk.get('index')

		span = POS.getSelSpanInfo selection.sel, chunk
		data = chunk.componentContent

		data.textGroup.getStyles span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset

	# NO SELECTION OPERATIONS
	# ================================================

	# acceptMerge: (selection, digestedChunk, consumerChunk) -> true

	# Allows the chunk to be merged to do what it needs to
	# willBeMergedDelete: (selection, digestedChunk, consumerChunk) ->
	# 	console.log 'willBeMergedDelete', arguments
	# 	digestedChunk.remove()
	# 	false

	# willBeMergedAccept: (selection, digestedChunk, consumerChunk) ->
	# 	console.log 'willBeMergedAccept'
	# 	true

	# willBeMergedReject: (selection, digestedChunk, consumerChunk) ->
	# 	false

	canMergeWith: (selection, digestedChunk, consumerChunk) ->
		digestedChunk.componentContent.textGroup? and consumerChunk.componentContent.textGroup?

	# mergeDelete: (selection, consumerChunk, digestedChunk) ->
		# consumerChunk.replaceWith digestedChunk

		# startInfo = POS.getStartInfo digestedChunk
		# selection.sel.setFutureCaret digestedChunk, { childIndex:startInfo.textIndex, offset:startInfo.offset }

	merge: (selection, consumerChunk, digestedChunk) ->
		consumerChunk.markDirty()

		consumerData = consumerChunk.componentContent
		digestedData = digestedChunk.componentContent

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

		selection.sel.setFutureCaret consumerChunk, { offset: oldTextLength, childIndex: oldIndex }

	# insertTab: (selection, chunk, untab) ->
	# 	chunk.markDirty()

	# 	if selection.sel.type is 'nodeSpan'
	# 		return @indent selection, chunk, untab



	indent: (selection, chunk, decreaseIndent) ->
		chunk.markDirty()

		# if selection.sel.type is 'caret'
		# 	info = POS.getCaretInfo selection.sel.start, chunk
		# 	if info.textIndex isnt 0 or info.offset isnt 0
		# 		return @insertText selection, chunk, "\t"

		data = chunk.componentContent

		if data.indent?
			if not decreaseIndent
				data.indent++
			else if data.indent > 0
				data.indent--

	onTab: (selection, chunk, untab) ->
		@deleteSelection selection, chunk
		@insertText selection, chunk, ["\t"]

	#@TODO - GET RID OF THIS
	init: (selection, chunk) ->
		chunk.componentContent.textGroup.init 0

	# Return true if chunkToBeDigested is OK with its contents being absorbed by consumerChunk
	acceptAbsorb: (selection, chunkToBeDigested, consumerChunk) ->
		chunkToBeDigested.componentContent.textGroup? and consumerChunk.componentContent.textGroup?

	# consumerChunk will absorb the contents of digestedChunk
	# returns the newly created chunks
	absorb: (selection, consumerChunk, digestedChunk) ->
		return [] if not digestedChunk.callComponentFn 'acceptAbsorb', selection, [consumerChunk]

		addedChunks = []
		digestedTextGroup = digestedChunk.componentContent.textGroup

		while not digestedTextGroup.isEmpty
			newChunk = consumerChunk.clone()
			newTextGroup = newChunk.componentContent.textGroup
			newTextGroup.clear()

			while not newTextGroup.isFull and not digestedTextGroup.isEmpty
				item = digestedTextGroup.remove(0)
				newTextGroup.add item.text, item.data

			addedChunks.push newChunk
			digestedChunk.addBefore newChunk

		digestedChunk.remove()

		addedChunks

	# The selection will be transformed into one or more newChunk chunks
	transformSelection: (selection, newChunk) ->
		data = newChunk.componentContent

		if selection.sel.type isnt 'nodeSpan'
			selection.sel.start.chunk.callComponentFn 'split', selection
			newChunks = newChunk.callComponentFn 'absorb', selection, [selection.sel.start.chunk]

			firstChunk = newChunks[0]
			lastChunk = newChunks[newChunks.length - 1]
		else
			selection.sel.start.chunk.callComponentFn 'split', selection
			newTopChunks = newChunk.callComponentFn 'absorb', selection, [selection.sel.start.chunk]

			for digestableChunk in selection.sel.inbetween
				newChunk.callComponentFn 'absorb', selection, [digestableChunk]

			selection.sel.end.chunk.callComponentFn 'split', selection
			newBottomChunks = newChunk.callComponentFn 'absorb', selection, [selection.sel.end.chunk]

			firstChunk = newTopChunks[0]
			lastChunk = newBottomChunks[newBottomChunks.length - 1]

		startInfo = POS.getStartInfo firstChunk
		endInfo = POS.getEndInfo lastChunk
		selection.sel.setFutureStart firstChunk, { childIndex:startInfo.textIndex, offset:startInfo.offset }
		selection.sel.setFutureEnd lastChunk, { childIndex:endInfo.textIndex, offset:endInfo.offset }

	# split chunk into a possible total of three new chunks - one before the selection, one containing the selection and one after the selection
	split: (selection, chunk) ->
		chunk.markDirty()

		span = POS.getSelSpanInfo selection.sel, chunk
		data = chunk.componentContent

		allTextSelected = span.start.textIndex is 0 and span.end.textIndex is data.textGroup.length - 1
		return if allTextSelected

		top = chunk.clone()
		middle = chunk
		bottom = chunk.clone()

		top.componentContent.textGroup.slice    0,                      span.start.textIndex
		middle.componentContent.textGroup.slice span.start.textIndex,   span.end.textIndex + 1
		bottom.componentContent.textGroup.slice span.end.textIndex + 1, Infinity

		if top.componentContent.textGroup.length > 0
			middle.addBefore top

		if bottom.componentContent.textGroup.length > 0
			middle.addAfter bottom

	# absorb: (selection, chunk, chunksToAbsorb) ->
	# 	console.log 'split', arguments

	# 	span = POS.getSelSpanInfo selection.sel, chunk
	# 	range = selection.sel.getRange(chunk.getDomEl())
	# 	data = chunk.componentContent

	# 	allTextSelected = span.start.textIndex is 0 and span.end.textIndex is data.textGroup.length - 1

	# 	console.log allTextSelected

	# 	return if allTextSelected

	# 	top = chunk.clone()
	# 	middle = chunk
	# 	bottom = chunk.clone()

	# 	top.componentContent.textGroup.slice    0,                      span.start.textIndex
	# 	middle.componentContent.textGroup.slice span.start.textIndex,   span.end.textIndex + 1
	# 	bottom.componentContent.textGroup.slice span.end.textIndex + 1, Infinity

	# 	console.log top, middle, bottom

	# 	if top.componentContent.textGroup.length > 0
	# 		middle.addBefore top

	# 	if bottom.componentContent.textGroup.length > 0
	# 		middle.addAfter bottom

	# 		middle.callComponentFn 'transformSelf', sel, [newChunk]

	# transformSelf: (selection, chunk, newChunk) ->
	# 	oldTextGroup = chunk.componentContent.textGroup
	# 	newTextGroup = newChunk.componentContent.textGroup

	# 	# oldTextGroup.clear()

	# 	curChunk = false
	# 	while not newTextGroup.isFull
	# 		newTextGroup.add
	# 	oldTextGroup.addGroup newTextGroup

	# STORING SELECTION OPERATIONS
	# ================================================

	saveSelection: (selection, chunk, cursor) ->
		info = POS.getCaretInfo cursor, chunk

		childIndex: info.textIndex
		offset:     info.offset

	# Take descriptor at savedSelData and turn it into selection.sel.*
	restoreSelection: (selection, chunk, type, savedSelData) ->
		node = POS.getTextNode chunk, savedSelData.childIndex
		return null if not node?

		domPos = Text.getDomPosition savedSelData.offset, node

		if type is 'start'
			selection.sel.setStart domPos.textNode, domPos.offset
		else if type is 'end'
			selection.sel.setEnd domPos.textNode, domPos.offset

	# # Take selection.sel.future* and turn it into selection.sel.*
	# updateSelection: (selection, chunk, type) ->
	# 	if type is 'start' or type is 'inside'
	# 		node = POS.getTextNode chunk, selection.sel.futureStart.data.childIndex
	# 		o = Text.getDomPosition selection.sel.futureStart.data.offset, node
	# 		selection.sel.setStart o.textNode, o.offset

	# 	if type is 'end' or type is 'inside'
	# 		node = POS.getTextNode chunk, selection.sel.futureEnd.data.childIndex
	# 		o = Text.getDomPosition selection.sel.futureEnd.data.offset, node
	# 		selection.sel.setEnd o.textNode, o.offset

	selectStart: (selection, chunk) ->
		info = POS.getStartInfo chunk
		selection.sel.setFutureCaret chunk, { childIndex:info.textIndex, offset:info.offset }

	selectEnd: (selection, chunk) ->
		info = POS.getEndInfo chunk
		selection.sel.setFutureCaret chunk, { childIndex:info.textIndex, offset:info.offset }

	# TEXT MENU OPERATIONS
	# ================================================

	getTextMenuCommands: (selection, chunk) ->
		[
			{
				label: 'Bold'
				image: '/img/editor/textmenu/bold.svg'
				fn: (selection, chunk) ->
					if selection.styles['b']
						chunk.callComponentFn 'unstyleSelection', selection, ['b']
					else
						chunk.callComponentFn 'styleSelection', selection, ['b']

			},
			{
				label: 'Italic'
				image: '/img/editor/textmenu/italic.svg'
				fn: (selection, chunk) ->
					if selection.styles['i']
						chunk.callComponentFn 'unstyleSelection', selection, ['i']
					else
						chunk.callComponentFn 'styleSelection', selection, ['i']
			},
			{
				label: 'Link...'
				image: '/img/editor/textmenu/link.svg'
				pre: -> { href: prompt('Href?') }
				fn: (selection, chunk, data) ->
					return if not data?.href?
					chunk.callComponentFn 'styleSelection', selection, ['a', { href:data.href }]
			},
			{
				label: 'Sup'
				image: '/img/editor/textmenu/sup.svg'
				fn: (selection, chunk) ->
					chunk.callComponentFn 'styleSelection', selection, ['sup', 1]
			},
			{
				label: 'Sub'
				image: '/img/editor/textmenu/sub.svg'
				fn: (selection, chunk) ->
					chunk.callComponentFn 'styleSelection', selection, ['sup', -1]
			},
		]

	# decorate: (component) ->
	# 	console.log 'DECORATE', methods, component
	# 	for method, methodName in methods
	# 		console.log method, methodName
	# 		continue if methodName is 'decorate'
	# 		component[methodName] = method

module.exports = methods