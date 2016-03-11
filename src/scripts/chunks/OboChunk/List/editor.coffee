#@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!

OboDraft = require 'OboDraft'

TextMethods = OboDraft.text.TextMethods
POS = OboDraft.text.TextPositionMethods
StyleableText = OboDraft.text.StyleableText
TextGroup = OboDraft.text.TextGroup
Text = OboDraft.components.Text
Chunk = OboDraft.models.Chunk
MockElement = OboDraft.mockDOM.MockElement
MockTextNode = OboDraft.mockDOM.MockTextNode


ListStyles = require './liststyles'

List = React.createClass
	statics:
		consumableElements: ['ul', 'ol', 'menu', 'dir']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: TextGroup.create(Infinity, { indent:0 })
			indent: 0
			listStyles: new ListStyles('unordered')

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			indent: data.indent
			listStyles: data.listStyles.clone()

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.content.textGroup, Infinity, { indent:0 }
			indent: 0
			listStyles: ListStyles.fromDescriptor descriptor.content.listStyles

		getDataDescriptor: (chunk) ->
			data = chunk.componentContent

			indent: data.indent
			textGroup: data.textGroup.toDescriptor()
			listStyles: data.listStyles.toDescriptor()

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			console.log 'List::cNNFE', el

			# group =
			# group.first.text = StyleableText.createFromElement(el)

			chunk = Chunk.create @, {
				textGroup: new TextGroup(Infinity, { indent:0 })
				indent: 0
				listStyles: new ListStyles(if el.tagName.toLowerCase() is 'ol' then 'ordered' else 'unordered')
			}

			@processElement 0, chunk.componentContent, el

			# [
			# 	Chunk.create @, {
			# 		textGroup: group
			# 		indent: 0
			# 		listStyles: new ListStyles('unordered')
			# 	}
			# ]
			[chunk]

		processElement: (indentLevel, chunkData, el) ->
			console.log 'processElement', arguments

			if el.tagName.toLowerCase() is 'li'
				# create a cloned elment with further sub-lists having their content removed (so this text won't be found when creating it)
				cloneEl = el.cloneNode true
				Array.prototype.map.call cloneEl.querySelectorAll('ul, ol, menu, dir'), (e) -> e.parentElement.removeChild e
				document.body.appendChild cloneEl
				st = StyleableText.createFromElement(cloneEl)

				if st.length > 0
					chunkData.textGroup.add st, { indent:indentLevel }

				for node in Array.prototype.slice.call el.children
					@processElement indentLevel + 1, chunkData, node

				document.body.removeChild cloneEl
			else
				listStyles =
					type: if el.tagName.toLowerCase() is 'ol' then 'ordered' else 'unordered'

				if el.getAttribute('start')?
					listStyles.start = el.getAttribute('start')

				if el.style.listStyleType?
					listStyles.bulletStyle = el.style.listStyleType

				# console.log 'setting list styles', indentLevel, listStyles

				chunkData.listStyles.set indentLevel, listStyles

				for node in Array.prototype.slice.call el.children
					@processElement indentLevel, chunkData, node


		recalculateStartValues: (refTextGroup, listStyles) ->
			indents = {}

			for item in refTextGroup.items
				indentLevel = item.data.indent
				if not indents[indentLevel]?
					indents[indentLevel] = 1
				else
					indents[indentLevel]++

			for indentLevel, startAddition of indents
				style = listStyles.getSetStyles indentLevel
				if style.start isnt null
					style.start += startAddition

		splitText: (selection, chunk, shiftKey) ->
			chunk.markDirty()

			info = POS.getCaretInfo selection.text.start, chunk
			data = chunk.componentContent

			item = data.textGroup.get(info.textIndex)

			if item.text.length is 0
				if item.data.indent > 0
					item.data.indent--

					selection.setFutureCaret chunk, { offset:0, childIndex:info.textIndex }
					return

				caretInLastItem = info.text is data.textGroup.last.text

				if not caretInLastItem
					afterNode = chunk.clone()
					afterNode.componentContent.textGroup = data.textGroup.split info.textIndex

				inbetweenNode = Chunk.create()

				data.textGroup.remove info.textIndex

				chunk.addAfter inbetweenNode

				if not caretInLastItem
					@recalculateStartValues data.textGroup, afterNode.componentContent.listStyles
					inbetweenNode.addAfter afterNode

				selection.setFutureCaret inbetweenNode, { offset:0, childIndex:0 }
				return

			data.textGroup.splitText info.textIndex, info.offset

			selection.setFutureCaret chunk, { offset:0, childIndex:info.textIndex + 1}

		indent: (selection, chunk, decreaseIndent) ->
			chunk.markDirty()

			data = chunk.componentContent

			if selection.text.type is 'caret'
				info = POS.getCaretInfo selection.text.start, chunk

				# If the first list item has the cursor
				if info.textIndex is 0
					# Indent the whole list instead
					return TextMethods.indent selection, chunk, decreaseIndent

				# Else indent the list item with the cursor
				@applyIndent data.textGroup.get(info.textIndex).data, decreaseIndent
				return

			span = POS.getSelSpanInfo selection.text, chunk

			# If the first list item is in some way selected
			if span.start.textIndex is 0
				# Indent the whole list instead
				return TextMethods.indent selection, chunk, decreaseIndent

			# Else indent each list item in the selection
			curIndex = span.start.textIndex
			while curIndex <= span.end.textIndex
				@applyIndent data.textGroup.get(curIndex).data, decreaseIndent
				curIndex++

			# POS.reselectSpan selection.text, chunk, span

		onTab: (selection, chunk, unTab) ->
			chunk.markDirty()

			data = chunk.componentContent

			if selection.text.type is 'caret'
				info = POS.getCaretInfo selection.text.start, chunk
				if info.offset is 0
					@indent selection, chunk, unTab
				else
					TextMethods.onTab selection, chunk, unTab
				return

			span = POS.getSelSpanInfo selection.text, chunk
			if span.start.textIndex isnt span.end.textIndex or span.start.offset is 0
				@indent selection, chunk, unTab
			else
				TextMethods.onTab selection, chunk, unTab

		# indentWORKING: (selection, chunk, decreaseIndent) ->
		# 	chunk.markDirty()

		# 	# console.log 'indent', arguments, chunk.componentContent.textGroup
		# 	data = chunk.componentContent

		# 	if selection.text.type is 'caret'
		# 		info = POS.getCaretInfo selection.text.start, chunk

		# 		if info.offset is 0 and info.textIndex is 0
		# 			@applyIndent data.textGroup.get(info.textIndex).data, decreaseIndent
		# 			selection.setFutureCaret chunk, { offset:0, childIndex:0 }
		# 			return

		# 		if info.offset isnt 0
		# 			return @insertText sel, chunk, "\t"
		# 		else
		# 			@applyIndent data.textGroup.get(info.textIndex).data, decreaseIndent
		# 			selection.setFutureCaret chunk, { offset:0, childIndex:info.textIndex }
		# 			return

		# 	span = POS.getSelSpanInfo selection.text, chunk
		# 	curIndex = span.start.textIndex
		# 	while curIndex <= span.end.textIndex
		# 		@applyIndent data.textGroup.get(curIndex).data, decreaseIndent
		# 		curIndex++

		# 	POS.reselectSpan selection.text, chunk, span

		applyIndent: (data, decreaseIndent) ->
			if not decreaseIndent
				data.indent++
			else if data.indent > 0
				data.indent--

		getTextMenuCommands: (selection, chunk) ->
			commands = TextMethods.getTextMenuCommands selection, chunk
			commands.push {
				label: 'Indent'
				fn: (selection, chunk) ->
					chunk.callComponentFn 'indent', selection, [false]

			}
			commands.push {
				label: 'Unindent'
				fn: (selection, chunk) ->
					chunk.callComponentFn 'indent', selection, [true]
			}

			commands

		deleteText: (selection, chunk, deleteForwards) ->
			chunk.markDirty()

			info = POS.getCaretInfo selection.text.start, chunk
			data = chunk.componentContent

			# If backspacing at the start of one of the list items (that isn't the first)
			if not deleteForwards and info.textIndex > 0 and info.offset is 0 and data.textGroup.get(info.textIndex).data.indent > 0
				#...then unindent
				data.textGroup.get(info.textIndex).data.indent--
				return true

			# if backspacing at the start of an item that is at minimum indent (and we're not attempting to un-indent the whole list)
			if not deleteForwards and info.offset is 0 and data.textGroup.get(info.textIndex).data.indent is 0 and (info.textIndex > 0 or data.indent is 0)
				newChunk = Chunk.create()
				# consumed = chunk.clone()
				# consumed.componentContent.textGroup.slice info.textIndex, info.textIndex + 1
				# newChunk.callComponentFn 'absorb', selection, [newChunk, consumed]
				#@TODO - this assumes too much, should use 'absorb'
				newChunk.componentContent.textGroup.first.text = data.textGroup.get(info.textIndex).text

				if info.textIndex is 0
					top    = chunk
					bottom = chunk.clone()

					bottom.componentContent.textGroup.slice 1
					@recalculateStartValues bottom.componentContent.textGroup, top.componentContent.listStyles

					top.replaceWith newChunk
					newChunk.addAfter bottom

				else if info.textIndex is data.textGroup.length - 1
					top = chunk

					top.componentContent.textGroup.slice 0, data.textGroup.length - 1

					top.addAfter newChunk
				else
					top    = chunk
					middle = newChunk
					bottom = chunk.clone()

					top.componentContent.textGroup.slice 0, info.textIndex
					bottom.componentContent.textGroup.slice info.textIndex + 1
					@recalculateStartValues top.componentContent.textGroup, bottom.componentContent.listStyles

					top.addAfter middle
					middle.addAfter bottom





				selection.setFutureCaret newChunk, { offset:0, childIndex:0 }

				return true

			TextMethods.deleteText selection, chunk, deleteForwards


		getCaretEdge:                 TextMethods.getCaretEdge
		canRemoveSibling:             TextMethods.canRemoveSibling
		insertText:                   TextMethods.insertText
		# deleteText:                   TextMethods.deleteText
		deleteSelection:              TextMethods.deleteSelection
		styleSelection:               TextMethods.styleSelection
		unstyleSelection:             TextMethods.unstyleSelection
		getSelectionStyles:           TextMethods.getSelectionStyles
		canMergeWith:                    TextMethods.canMergeWith
		merge:                        TextMethods.merge
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		# updateSelection:              TextMethods.updateSelection
		selectStart:                  TextMethods.selectStart
		selectEnd:                    TextMethods.selectEnd
		acceptAbsorb:                 TextMethods.acceptAbsorb
		absorb:                       TextMethods.absorb
		transformSelection:           TextMethods.transformSelection
		split:                        TextMethods.split

	createMockListElement: (data, indentLevel) ->
		style = data.listStyles.get indentLevel

		tag = if style.type is 'unordered' then 'ul' else 'ol'
		el = new MockElement tag
		el.start = style.start
		el._listStyleType = style.bulletStyle

		el

	addItemToList: (ul, li, lis) ->
		ul.addChild li
		li.listStyleType = ul._listStyleType
		lis.push li

	getInitialState: ->
		{ chunk:@props.chunk }

	componentWillReceiveProps: (nextProps) ->
		@setState { chunk:nextProps.chunk }

	render: ->
		data = @state.chunk.componentContent

		texts = data.textGroup

		curIndentLevel = 0
		curIndex = 0
		rootUl = curUl = @createMockListElement(data, curIndentLevel)
		lis = []

		li = new MockElement 'li'
		@addItemToList curUl, li, lis

		for item, itemIndex in texts.items
			# if this item is lower than the current indent level...
			if item.data.indent < curIndentLevel
				# traverse up the tree looking for our curUl:
				while curIndentLevel > item.data.indent
					curUl = curUl.parent.parent
					curIndentLevel--

			# else, if this item is higher than the current indent level...
			else if item.data.indent > curIndentLevel
				# traverse down the tree...
				while curIndentLevel < item.data.indent
					curIndentLevel++

					# if the last LI's last child isn't a UL, create it
					if curUl.lastChild.lastChild?.type isnt 'ul' and curUl.lastChild.lastChild?.type isnt 'ol'
						newUl = @createMockListElement(data, curIndentLevel)
						newLi = new MockElement 'li'
						@addItemToList newUl, newLi, lis
						curUl.lastChild.addChild newUl
						curUl = newUl
					else
						curUl = curUl.lastChild.lastChild

			# if the lastChild is not an LI or it is an LI that already has text inside
			if not (curUl.lastChild?.type is 'li') or (curUl.lastChild?.lastChild?)
				li = new MockElement 'li'
				@addItemToList curUl, li, lis

			text = new MockTextNode item.text
			text.index = curIndex
			curIndex++

			curUl.lastChild.addChild text


		# console.log 'TREE'
		# console.log '==========================================='
		# @printTree '', rootUl, curUl

		# Remove bullets from nested LIs
		for li in lis
			if li.children?[0]?.nodeType isnt 'text'
				li.listStyleType = 'none'

		React.createElement 'div', { style: { marginLeft: (data.indent * 20) + 'px' } }, @renderEl(rootUl, 0, 0)

	# printTree: (indent = '', el, curUl) ->
	# 	if el.nodeType is 'element'
	# 		console.log indent, '<', el.type, '>', (if el is curUl then '***' else '')

	# 		for child in el.children
	# 			@printTree indent + '    ', child, curUl
	# 	else
	# 		console.log indent, '"', el.text.value, '"'

	renderEl: (node, index, indent) ->
		# console.log 'renderEl', arguments

		key = @state.chunk.cid + '-' + indent + '-' + index

		switch node.nodeType
			when 'text'    then Text.createElement node.text, @state.chunk, node.index
			when 'element' then React.createElement node.type, { key:key, start:node.start, style: { listStyleType:node.listStyleType } }, @renderChildren(node.children, indent + 1)

	renderChildren: (children, indent) ->
		# console.log 'renderChildren', children
		els = []
		for child, index in children
			els.push @renderEl(child, index, indent)

		els


module.exports = List