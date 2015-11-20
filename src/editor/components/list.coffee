#@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!


React = require 'react'

OboNodeComponentMixin = require '../../oboreact/OboNodecomponentmixin'
OboReact = require '../../oboreact/oboreact'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require './textgroup'

TextMethods = require './textmethods'
POS = require './textpositionmethods'

MockElement = require '../../components/text/mockelement'
MockTextNode = require '../../components/text/mocktextnode'

Chunk = require '../../models/chunk'

List = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		consumableElements: ['ul', 'ol']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup = new TextGroup()
			textGroup.get(0).data = { indent:0 }

			textGroup: textGroup
			indent: 0

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			indent: data.indent

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup
			indent: 0

		getDataDescriptor: (chunk) ->
			data = chunk.get 'data'

			indent: data.indent
			textGroup: data.textGroup.toDescriptor()

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			group = new TextGroup()
			group.first.text = StyleableText.createFromElement(el)

			[
				Chunk.create @, {
					textGroup: group
					indent: 0
				}
			]


		splitText: (sel, chunk, shiftKey) ->
			info = POS.getCaretInfo sel.start, chunk
			data = chunk.get 'data'

			item = data.textGroup.get(info.textIndex)

			if item.text.length is 0
				if item.data.indent > 0
					item.data.indent--

					sel.setFutureCaret chunk, { offset:0, childIndex:info.textIndex }
					return

				caretInLastItem = info.text is data.textGroup.last.text

				if not caretInLastItem
					afterNode = chunk.clone()
					afterNode.get('data').textGroup = data.textGroup.split info.textIndex

				inbetweenNode = Chunk.create()

				data.textGroup.remove info.textIndex

				chunk.addAfter inbetweenNode

				if not caretInLastItem
					inbetweenNode.addAfter afterNode

				sel.setFutureCaret inbetweenNode, { offset:0, childIndex:0 }
				return

			data.textGroup.splitText info.textIndex, info.offset

			sel.setFutureCaret chunk, { offset:0, childIndex:info.textIndex + 1}


		indent: (sel, chunk, decreaseIndent) ->
			console.log 'indent', arguments

			data = chunk.get 'data'

			if sel.type is 'caret'
				info = POS.getCaretInfo sel.start, chunk

				if info.offset is 0 and info.textIndex is 0
					@applyIndent data.textGroup.get(info.textIndex).data, decreaseIndent
					sel.setFutureCaret chunk, { offset:0, childIndex:0 }
					return

				if info.offset isnt 0
					return @insertText sel, chunk, "\t"
				else
					@applyIndent data.textGroup.get(info.textIndex).data, decreaseIndent
					sel.setFutureCaret chunk, { offset:0, childIndex:info.textIndex }
					return

			span = POS.getSelSpanInfo sel, chunk
			curIndex = span.start.textIndex
			while curIndex <= span.end.textIndex
				@applyIndent data.textGroup.get(curIndex).data, decreaseIndent
				curIndex++

			POS.reselectSpan sel, chunk, span

		applyIndent: (data, decreaseIndent) ->
			console.log 'APPLY INDENT', data
			if not decreaseIndent
				data.indent++
			else if data.indent > 0
				data.indent--


		getCaretEdge:                 TextMethods.getCaretEdge
		insertText:                   TextMethods.insertText
		deleteText:                   TextMethods.deleteText
		deleteSelection:              TextMethods.deleteSelection
		styleSelection:               TextMethods.styleSelection
		acceptMerge:                  TextMethods.acceptMerge
		merge:                        TextMethods.merge
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		updateSelection:              TextMethods.updateSelection



	render: ->
		data = @state.chunk.get 'data'

		texts = data.textGroup

		console.time 'computeUL'

		curIndentLevel = 0
		curIndex = 0
		rootUl = curUl = new MockElement 'ul'

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

					# if the last LI's last child isn't a UL, create it
					if curUl.lastChild.lastChild?.type isnt 'ul'
						newUl = new MockElement 'ul'
						newLi = new MockElement 'li'
						newUl.addChild newLi
						curUl.lastChild.addChild newUl
						curUl = newUl
					else
						curUl = curUl.lastChild.lastChild

					curIndentLevel++

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

			console.timeEnd 'computeUL'

			# console.log 'TREE'
			# console.log '==========================================='
			# @printTree '', rootUl, curUl

		# console.log 'DE ROOT TREE BE'
		# @printTree '', rootUl, curUl
		# console.log rootUl

		console.log 'UL'
		console.log rootUl


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
			when 'text'   then OboReact.createText node.text, @state.chunk, node.index, null
			# @TODO: KEY!!!!!1
			when 'element'then React.createElement node.type, { key:key }, @renderChildren(node.children, indent + 1)

	renderChildren: (children, indent) ->
		# console.log 'renderChildren', children
		els = []
		for child, index in children
			els.push @renderEl(child, index, indent)

		els


module.exports = List