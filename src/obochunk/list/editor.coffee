#@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!


React = require 'react'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require '../../text/textgroup'

TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'

ListStyles = require './liststyles'

MockElement = require '../../components/text/mockelement'
MockTextNode = require '../../components/text/mocktextnode'

Chunk = require '../../models/chunk'

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
			# console.log 'List::cNNFE', el

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
			# console.log 'processElement', arguments

			if el.tagName.toLowerCase() is 'li'
				# console.log 'adding text', el, indentLevel
				# create a cloned elment with further sub-lists having their content removed (so this text won't be found when creating it)
				# console.log 'el is', el, el.outerHTML
				cloneEl = el.cloneNode true
				Array.prototype.map.call cloneEl.querySelectorAll('ul, ol, menu, dir'), (e) -> e.innerHTML = ''
				# console.log 'cloneEl is', cloneEl, cloneEl.outerHTML
				chunkData.textGroup.add StyleableText.createFromElement(cloneEl), { indent:indentLevel }

				for node in Array.prototype.slice.call el.children
					@processElement indentLevel + 1, chunkData, node
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
			console.log 'recalculateStartValues'
			indents = {}

			for item in refTextGroup.items
				indentLevel = item.data.indent
				if not indents[indentLevel]?
					indents[indentLevel] = 1
				else
					indents[indentLevel]++

			console.log indents

			for indentLevel, startAddition of indents
				console.log 'startAddition', startAddition, 'indentLevel', indentLevel
				style = listStyles.getSetStyles indentLevel
				console.log 'i spy', style
				if style.start isnt null
					style.start += startAddition

		splitText: (selection, chunk, shiftKey) ->
			chunk.markDirty()

			info = POS.getCaretInfo selection.sel.start, chunk
			data = chunk.componentContent

			item = data.textGroup.get(info.textIndex)

			if item.text.length is 0
				if item.data.indent > 0
					item.data.indent--

					selection.sel.setFutureCaret chunk, { offset:0, childIndex:info.textIndex }
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

				selection.sel.setFutureCaret inbetweenNode, { offset:0, childIndex:0 }
				return

			data.textGroup.splitText info.textIndex, info.offset

			selection.sel.setFutureCaret chunk, { offset:0, childIndex:info.textIndex + 1}

		indent: (selection, chunk, decreaseIndent) ->
			chunk.markDirty()

			data = chunk.componentContent

			if selection.sel.type is 'caret'
				info = POS.getCaretInfo selection.sel.start, chunk

				# If the first list item has the cursor
				if info.textIndex is 0
					# Indent the whole list instead
					return TextMethods.indent selection, chunk, decreaseIndent

				# Else indent the list item with the cursor
				@applyIndent data.textGroup.get(info.textIndex).data, decreaseIndent
				return

			span = POS.getSelSpanInfo selection.sel, chunk

			# If the first list item is in some way selected
			if span.start.textIndex is 0
				# Indent the whole list instead
				return TextMethods.indent selection, chunk, decreaseIndent

			# Else indent each list item in the selection
			curIndex = span.start.textIndex
			while curIndex <= span.end.textIndex
				@applyIndent data.textGroup.get(curIndex).data, decreaseIndent
				curIndex++

			POS.reselectSpan selection.sel, chunk, span

		onTab: (selection, chunk, unTab) ->
			chunk.markDirty()

			data = chunk.componentContent

			if selection.sel.type is 'caret'
				info = POS.getCaretInfo selection.sel.start, chunk
				if info.offset is 0
					@indent selection, chunk, unTab
				else
					TextMethods.onTab selection, chunk, unTab
				return

			span = POS.getSelSpanInfo selection.sel, chunk
			if span.start.textIndex isnt span.end.textIndex or span.start.offset is 0
				@indent selection, chunk, unTab
			else
				TextMethods.onTab selection, chunk, unTab

		# indentWORKING: (selection, chunk, decreaseIndent) ->
		# 	chunk.markDirty()

		# 	# console.log 'indent', arguments, chunk.componentContent.textGroup
		# 	data = chunk.componentContent

		# 	if selection.sel.type is 'caret'
		# 		info = POS.getCaretInfo selection.sel.start, chunk

		# 		if info.offset is 0 and info.textIndex is 0
		# 			@applyIndent data.textGroup.get(info.textIndex).data, decreaseIndent
		# 			selection.sel.setFutureCaret chunk, { offset:0, childIndex:0 }
		# 			return

		# 		if info.offset isnt 0
		# 			return @insertText sel, chunk, "\t"
		# 		else
		# 			@applyIndent data.textGroup.get(info.textIndex).data, decreaseIndent
		# 			selection.sel.setFutureCaret chunk, { offset:0, childIndex:info.textIndex }
		# 			return

		# 	span = POS.getSelSpanInfo selection.sel, chunk
		# 	curIndex = span.start.textIndex
		# 	while curIndex <= span.end.textIndex
		# 		@applyIndent data.textGroup.get(curIndex).data, decreaseIndent
		# 		curIndex++

		# 	POS.reselectSpan selection.sel, chunk, span

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


		getCaretEdge:                 TextMethods.getCaretEdge
		canRemoveSibling:             TextMethods.canRemoveSibling
		insertText:                   TextMethods.insertText
		deleteText:                   TextMethods.deleteText
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
		el.listStyleType = style.bulletStyle

		el

	getInitialState: ->
		{ chunk:@props.chunk }

	componentWillReceiveProps: (nextProps) ->
		@setState { chunk:nextProps.chunk }

	render: ->
		data = @state.chunk.componentContent

		texts = data.textGroup

		# console.log 'render list', data.listStyles

		# console.time 'computeUL'

		curIndentLevel = 0
		curIndex = 0
		rootUl = curUl = @createMockListElement(data, curIndentLevel)

		li = new MockElement 'li'
		curUl.addChild li

		for item in texts.items
			# if item.data.indent is curIndentLevel

			# if this item is lower than the current indent level...
			if item.data.indent < curIndentLevel
				# traverse up the tree looking for our curUl:
				while curIndentLevel > item.data.indent
					curUl = curUl.parent.parent
					curIndentLevel--
			# else, if this item is higher than the current indent level...
			else if item.data.indent > curIndentLevel
				# console.log 'BEFORE TRAVERSE'
				# @printTree '', rootUl, curUl
				# traverse down the tree...
				while curIndentLevel < item.data.indent
					# console.log 'BEFORE ITER'
					# @printTree '', rootUl, curUl

					curIndentLevel++

					# if the last LI's last child isn't a UL, create it
					if curUl.lastChild.lastChild?.type isnt 'ul' and curUl.lastChild.lastChild?.type isnt 'ol'
					# if curUl.lastChild.lastChild?.type is 'li'
						# console.log 'create mock list el for', curIndentLevel
						newUl = @createMockListElement(data, curIndentLevel)
						newLi = new MockElement 'li'
						newUl.addChild newLi
						curUl.lastChild.addChild newUl
						curUl = newUl
					else
						curUl = curUl.lastChild.lastChild



					# console.log 'AFTER ITER'
					# @printTree '', rootUl, curUl

			# if the lastChild is not an LI or it is an LI that already has text inside
			if not (curUl.lastChild?.type is 'li') or (curUl.lastChild?.lastChild?)
				li = new MockElement 'li'
				curUl.addChild li

			text = new MockTextNode item.text
			text.index = curIndex
			# text.indent = item.data.indent
			curIndex++

			curUl.lastChild.addChild text

			# if item.data.start
				# curUl.start = item.data.start

			# console.timeEnd 'computeUL'

		# console.log rootUl

			# console.log 'TREE'
			# console.log '==========================================='
			# @printTree '', rootUl, curUl

		# console.log 'DE ROOT TREE BE'
		# @printTree '', rootUl, curUl
		# console.log rootUl

		# console.log 'UL'
		# console.log rootUl


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

		# console.log key

		switch node.nodeType
			when 'text'    then Text.createElement node.text, @state.chunk, node.index
			# @TODO: KEY!!!!!1
			when 'element' then React.createElement node.type, { key:key, start:node.start, style: { listStyleType:node.listStyleType } }, @renderChildren(node.children, indent + 1)

	renderChildren: (children, indent) ->
		# console.log 'renderChildren', children
		els = []
		for child, index in children
			els.push @renderEl(child, index, indent)

		els


module.exports = List