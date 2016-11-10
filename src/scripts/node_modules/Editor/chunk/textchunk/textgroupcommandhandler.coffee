BaseCommandHandler = require 'Editor/chunk/basecommandhandler'

Common = window.ObojoboDraft.Common

TextGroup = Common.textGroup.TextGroup
TextGroupSelection = Common.textGroup.TextGroupSelection
TextGroupEl = Common.chunk.textChunk.TextGroupEl
Chunk = Common.models.Chunk
StyleableText = Common.text.StyleableText
HtmlUtil = Common.util.HtmlUtil

TEXTMENU_BOLD = require 'svg-url?noquotes!Editor/components/textmenu/assets/bold.svg'
TEXTMENU_ITALIC = require 'svg-url?noquotes!Editor/components/textmenu/assets/italic.svg'
TEXTMENU_LINK = require 'svg-url?noquotes!Editor/components/textmenu/assets/link.svg'
TEXTMENU_SUB = require 'svg-url?noquotes!Editor/components/textmenu/assets/sub.svg'
TEXTMENU_SUP = require 'svg-url?noquotes!Editor/components/textmenu/assets/sup.svg'

class TextGroupCommandHandler extends BaseCommandHandler
	getCaretEdge: (selection, chunk) ->
		tgs = new TextGroupSelection chunk, selection.virtual
		data = chunk.modelState

		s = tgs.start
		switch
			when s is null or not s.text?        then 'none'
			when s.isGroupStart and s.isGroupEnd then 'startAndEnd'
			when s.isGroupStart                  then 'start'
			when s.isGroupEnd                    then 'end'
			else                                      'none'

	isEmpty: (selection, chunk) ->
		chunk.modelState.textGroup.isBlank

	canRemoveSibling: (selection, chunk) -> true

	insertText: (selection, chunk, textToInsert, stylesToApply = null, stylesToRemove = null) ->
		chunk.markDirty()

		console.time 'insertText'

		sel = new TextGroupSelection chunk, selection.virtual

		return if not sel.start.text?

		sel.start.text.insertText sel.start.offset, textToInsert

		if stylesToApply?
			for style in stylesToApply
				sel.start.text.styleText style, sel.start.offset, sel.start.offset + textToInsert.length

		if stylesToRemove?
			for style in stylesToRemove
				sel.start.text.unstyleText style, sel.start.offset, sel.start.offset + textToInsert.length

		selection.virtual.start.data.offset += textToInsert.length
		selection.virtual.collapse()

		# chunk.module.editor.

		console.timeEnd 'insertText'

	deleteText: (selection, chunk, deleteForwards) ->
		chunk.markDirty()

		# info = POS.getCaretInfo selection.chunk.start, chunk
		tgs = new TextGroupSelection chunk, selection.virtual
		data = chunk.modelState

		return if not tgs.start.text?

		s = tgs.start
		tg = data.textGroup

		# If backspacing at the start of the first text so there's nothing to delete...
		if not deleteForwards and s.isGroupStart
			# If chunk is indented...
			if data.indent? and ~~data.indent > 0
				# ...decrease indent
				data.indent--
				return true

			# If this is an empty item, delete it and select the previous sibling
			if tg.isBlank and chunk.prevSibling()?
				chunk.prevSibling().selectEnd()
				chunk.remove()
				return true

			# Otherwise, delete unsuccessful
			return false

		# If using delete key at the end of the last text...
		if deleteForwards and s.isGroupEnd
			# ...and its blank then remove this chunk and let the item below it sit in it's place
			if tg.isBlank
				nextSibling = chunk.nextSibling()
				chunk.remove()
				nextSibling.selectStart()
				return true

			# else, unsuccessful
			return false

		# If backspacing and the start of a text that's not the first text...
		if not deleteForwards and s.isTextStart and not s.isFirstText
			# ...merge that text with the previous one
			# selection.setFutureCaret chunk, { offset: tg.get(s.groupIndex - 1).text.length, groupIndex: s.groupIndex - 1}
			# selection.virtual.start.data.offset  chunk, { offset: tg.get(s.groupIndex - 1).text.length, groupIndex: s.groupIndex - 1 }
			# end = TextGroupSelection.getTextEndCursor chunk, s.groupIndex - 1
			# selection.virtual.setCaret end.chunk, end.data
			tgs.setCaretToTextEnd s.groupIndex - 1

			tg.merge s.groupIndex - 1
			return true

		# If using delete key on the end of a text that's not the last text...
		if deleteForwards and s.isTextEnd and not s.isLastText and tg.length > 1
			# ...merge that text with the next one
			# selection.setFutureCaret chunk, { offset: s.offset, groupIndex: s.groupIndex }
			tg.merge s.groupIndex
			return true

		# Otherwise, delete the text
		[start, end] = if not deleteForwards then [s.offset - 1, s.offset] else [s.offset, s.offset + 1]

		tgs.start.text.deleteText start, end

		# selection.setFutureCaret chunk, { offset: start, groupIndex: sel.start.groupIndex }
		tgs.setCaret tgs.start.groupIndex, start
		true

	onEnter: (selection, chunk, shiftKey) ->
		chunk.splitText()

	splitText: (selection, chunk) ->
		chunk.markDirty()

		tgs = new TextGroupSelection chunk, selection.virtual

		return if not tgs.start.text?

		textGroup = chunk.modelState.textGroup
		textGroup.splitText tgs.start.groupIndex, tgs.start.offset
		# selection.setFutureCaret chunk, { offset:0, groupIndex:sel.start.groupIndex + 1}
		tgs.setCaretToTextStart tgs.start.groupIndex + 1

	deleteSelection: (selection, chunk) ->
		chunk.markDirty()

		tgs = new TextGroupSelection chunk, selection.virtual
		tg = chunk.modelState.textGroup

		tg.deleteSpan tgs.start.groupIndex, tgs.start.offset, tgs.end.groupIndex, tgs.end.offset, true, @mergeTextGroups

		pos = selection.virtual.getPosition chunk
		switch pos
			when 'start', 'contains'
				selection.virtual.collapse()
			when 'end'
				selection.virtual.end = TextGroupSelection.getGroupStartCursor(chunk).virtualCursor

	styleSelection: (selection, chunk, styleType, styleData) ->
		chunk.markDirty()

		sel = new TextGroupSelection chunk, selection.virtual

		chunk.modelState.textGroup.styleText sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset, styleType, styleData

	unstyleSelection: (selection, chunk, styleType, styleData) ->
		chunk.markDirty()

		# span = POS.getSelSpanInfo selection.chunk, chunk
		sel = new TextGroupSelection chunk, selection.virtual
		data = chunk.modelState

		data.textGroup.unstyleText sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset, styleType, styleData

	getSelectionStyles: (selection, chunk) ->
		sel = new TextGroupSelection chunk, selection.virtual
		data = chunk.modelState

		#@todo:
		if not sel.start? or not sel.end? then return {}

		data.textGroup.getStyles sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset

	canMergeWith: (selection, chunk, otherChunk) ->
		chunk.modelState.textGroup? and otherChunk.modelState.textGroup? and chunk isnt otherChunk

	merge: (selection, consumerChunk, digestedChunk, mergeText = true) ->
		consumerChunk.markDirty()

		consumerData = consumerChunk.modelState
		digestedData = digestedChunk.modelState

		if not digestedData.textGroup?
			digestedChunk.remove()
			return

		if consumerData.textGroup.isEmpty
			oldTextLength = 0
		else
			oldTextLength = consumerData.textGroup.last.text.length

		oldIndex = consumerData.textGroup.length - 1

		if mergeText
			consumerData.textGroup.last.text.merge digestedData.textGroup.first.text
			digestedData.textGroup.remove 0

		i = 0
		# console.clear()
		# console.log consumerData.textGroup is digestedData.textGroup
		while not consumerData.textGroup.isFull and digestedData.textGroup.length > 0
			# console.log consumerData.textGroup.length, digestedData.textGroup.length
			item = digestedData.textGroup.first
			consumerData.textGroup.add item.text, item.data
			digestedData.textGroup.remove 0

		if digestedData.textGroup.length is 0
			digestedChunk.remove()

		# selection.setFutureCaret consumerChunk, { offset: oldTextLength, groupIndex: oldIndex }
		selection.virtual.setCaret consumerChunk, { groupIndex:oldIndex, offset:oldTextLength }

	indent: (selection, chunk, decreaseIndent) ->
		chunk.markDirty()

		data = chunk.modelState
		tgs = new TextGroupSelection chunk, selection.virtual

		if tgs.end.isFirstText
			all = data.textGroup.items
		else
			all = tgs.getAllSelectedTexts()

		for textItem in all
			if textItem.data.indent? and not isNaN(textItem.data.indent)
				if not decreaseIndent
					textItem.data.indent++
				else if textItem.data.indent > 0
					textItem.data.indent--

	onTab: (selection, chunk, untab) ->
		sel = new TextGroupSelection chunk, selection.virtual

		if sel.type is 'caret' and not sel.start.isTextStart
			return chunk.insertText "\t"

		chunk.indent untab

	_insertTextGroup: (selection, chunk, textGroup) ->
		console.log 'INSERT TEXT GROUP', arguments

		chunk.markDirty()

		# alert 'splitText and onEnter must become a thing so that the splitText method on Texts doesnt mess this alg up'

		# Single chunk paste algorithm
		# 1. Split chunk text
		# 2. Insert pasted chunk's textGroup inbetween the split
		# 3. Merge the first and last pasted texts with the text above and below

		tgs = new TextGroupSelection chunk, selection.virtual

		console.log 'tgs', tgs.start

		ctg = tgs.start.textGroup
		ptg = textGroup
		groupIndex = tgs.start.groupIndex

		offset = tgs.start.offset

		chunk.splitText()

		ctg.addGroupAt ptg, groupIndex + 1
		ctg.merge groupIndex + ptg.length
		ctg.merge groupIndex

		if ptg.length is 1
			offset += ptg.last.text.length
		else
			offset = ptg.last.text.length

		console.log 'selvirt', offset, selection.virtual.toObject()

		selection.virtual.start.data.offset = offset
		selection.virtual.start.data.groupIndex = groupIndex + ptg.length - 1
		selection.virtual.start.chunk = chunk
		selection.virtual.collapse()

		console.log 'selvirt', offset, selection.virtual.toObject()

		# chunk.selectEnd()

	paste: (selection, chunk, text, html, chunks) ->
		console.log 'paste', arguments
		switch chunks.length
			when 0
				if html?.length > 0
					el = document.createElement 'div'
					el.innerHTML = html
					el = HtmlUtil.sanitize el

					document.body.appendChild(el)

					sts = StyleableText.createFromElement el

					if sts.length is 0 then return false

					ptg = TextGroup.create(Infinity, {}, 0);
					for st in sts
						ptg.add st

					@_insertTextGroup selection, chunk, ptg

					document.body.removeChild(el)

					return true
			when 1
				if not chunk.canMergeWith(chunks[0]) or not chunks[0].canMergeWith(chunk)
					return false

				@_insertTextGroup selection, chunk, chunks[0].modelState.textGroup

				return true
			else
				chunk.markDirty()

				# Multiple chunk paste algorithm (two or more)
				# 1. Split chunk --> prev, split and next
				# 2. Add pasted chunks after split chunk
				# 3. Merge prev and first pasted chunk
				# 4. Merge last pasted chunk and next
				# 5. Delete split chunk

				# Get a copy of the current caret state, need it to
				# calculate where to move the caret
				caret = selection.virtual.start.clone()

				splitChunks = chunk.split()

				for pastedChunk in chunks
					chunk.addChildBefore pastedChunk

				if splitChunks.prev? and splitChunks.prev.canMergeWith(chunks[0]) and chunks[0].canMergeWith(splitChunks.prev)
					splitChunks.prev.selectEnd()
					splitChunks.prev.merge chunks[0]

				lastPastedChunk = chunks[chunks.length - 1]
				if splitChunks.next? and lastPastedChunk.canMergeWith(splitChunks.next) and splitChunks.next.canMergeWith(lastPastedChunk)
					lastPastedChunk.selectEnd()
					lastPastedChunk.merge splitChunks.next
				else
					lastPastedChunk.selectEnd()

				chunk.remove()

				return true
		false

	# Return true if chunkToBeDigested is OK with its contents being absorbed by consumerChunk
	acceptAbsorb: (selection, chunkToBeDigested, consumerChunk) ->
		chunkToBeDigested.modelState.textGroup? and consumerChunk.modelState.textGroup? and chunkToBeDigested isnt consumerChunk

	# consumerChunk should absorb the contents of digestedChunk
	absorb: (selection, consumerChunk, digestedChunk) ->
		if not digestedChunk.acceptAbsorb consumerChunk
			digestedChunk.remove()
			consumerChunk.selectAll()
			return

		consumerChunk.markDirty()

		textGroup = consumerChunk.modelState.textGroup
		digestedTextGroup = digestedChunk.modelState.textGroup

		textGroup.clear()

		while not digestedTextGroup.isEmpty
			if not textGroup.isFull
				item = digestedTextGroup.remove(0)
				textGroup.add item.text, item.data
			else
				item = digestedTextGroup.remove(0)
				item.text.insertText 0, ' '
				textGroup.last.text.merge item.text

		digestedChunk.remove()
		textGroup.fill()

	# split chunk into a possible total of three new chunks - one before the selection, one containing the selection and one after the selection
	split: (selection, chunk) ->
		chunk.markDirty()

		result = {
			prev: null
			next: null
		}

		sel = new TextGroupSelection chunk, selection.virtual

		startOffset = sel.start.offset
		startGroupIndex = sel.start.groupIndex
		endOffset = sel.end.offset
		endGroupIndex = sel.end.groupIndex

		data = chunk.modelState

		allTextSelected = sel.start.isGroupStart and sel.end.isGroupEnd
		return result if allTextSelected

		top = chunk.clone()
		middle = chunk
		bottom = chunk.clone()

		ttg = top.modelState.textGroup
		mtg = middle.modelState.textGroup
		btg = bottom.modelState.textGroup

		ttg.toSlice    0,                 startGroupIndex + 1
		mtg.toSlice startGroupIndex, endGroupIndex + 1
		btg.toSlice endGroupIndex

		ttg.deleteSpan ttg.length - 1, startOffset, ttg.length - 1, ttg.last.text.length, false
		mtg.deleteSpan mtg.length - 1, endOffset, mtg.length - 1, mtg.last.text.length, false
		mtg.deleteSpan 0, 0, 0, startOffset, false
		btg.deleteSpan 0, 0, 0, endOffset, false

		if not ttg.isBlank
			middle.addChildBefore top
			result.prev = top

			if ttg.last.text.length is 0
				ttg.remove ttg.last.index

		if not btg.isBlank
			middle.addChildAfter bottom
			result.next = bottom

			if btg.first.text.length is 0
				btg.remove 0

		if mtg.isEmpty
			middle.revert()

		middle.selectAll()

		result

	getDOMStateBeforeInput: (selection, chunk) ->
		tgs = new TextGroupSelection chunk, selection.virtual

		charsFromStart: tgs.start.offset
		charsFromEnd:   tgs.start.text.length - tgs.end.offset

	getDOMModificationAfterInput: (selection, chunk, domStateBefore) ->
		el = TextGroupEl.getTextElementAtCursor selection.virtual.start
		newText = el.textContent

		text: newText.substring domStateBefore.charsFromStart, newText.length - domStateBefore.charsFromEnd

	applyDOMModification: (selection, chunk, domModifications) ->
		chunk.deleteSelection()
		chunk.insertText domModifications.text

	getTextMenuCommands: (selection, chunk) ->
		[
			{
				label: 'Bold'
				image: TEXTMENU_BOLD
				fn: (selection, chunk) ->
					if selection.styles['b']
						chunk.unstyleSelection 'b'
					else
						chunk.styleSelection 'b'

			},
			{
				label: 'Italic'
				image: TEXTMENU_ITALIC
				fn: (selection, chunk) ->
					if selection.styles['i']
						chunk.unstyleSelection 'i'
					else
						chunk.styleSelection 'i'
			},
			{
				label: 'Link...'
				image: TEXTMENU_LINK
				onBeforeFn: -> { href: prompt('Href?') }
				fn: (selection, chunk, data) ->
					return if not data?.href?
					chunk.styleSelection 'a', { href:data.href }
			}#,
			# {
			# 	label: 'Sup'
			# 	image: TEXTMENU_SUP
			# 	fn: (selection, chunk) ->
			# 		chunk.styleSelection 'sup', 1
			# },
			# {
			# 	label: 'Sub'
			# 	image: TEXTMENU_SUB
			# 	fn: (selection, chunk) ->
			# 		chunk.styleSelection 'sup', -1
			# }
		]


module.exports = TextGroupCommandHandler