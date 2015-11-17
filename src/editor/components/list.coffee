#@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!


React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboComponentTextStatics = require './statics/obocomponenttextstatics'
OboTextCommandHandlers = require '../commands/obotextcommandhandlers'
OboReact = require '../../oboreact/oboreact'
OboNode = require '../../obodom/obonode'

ViewerParagraph = require '../../viewer/components/paragraph'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require './textgroup'

TextMethods = require './textmethods'
POS = require './textpositionmethods'

MockElement = require '../../components/text/mockelement'
MockTextNode = require '../../components/text/mocktextnode'

List = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		consumableElements: ['p']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: new TextGroup()
			indent: 0

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			indent: data.indent

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			group = new TextGroup()
			group.first.text = StyleableText.createFromElement(el)

			[
				OboNode.create @, {
					textGroup: group
					indent: 0
				}
			]


		splitText: (sel, oboNode, shiftKey) ->
			info = POS.getCaretInfo sel.start, oboNode

			item = oboNode.data.textGroup.get(info.textIndex)

			if item.text.length is 0
				if item.data.indent > 0
					item.data.indent--

					sel.setFutureCaret oboNode, { offset:0, childIndex:info.textIndex }
					return

				caretInLastItem = info.text is oboNode.data.textGroup.last.text

				if not caretInLastItem
					afterNode = oboNode.clone()
					afterNode.data.textGroup = oboNode.data.textGroup.split info.textIndex

				inbetweenNode = OboNode.create()

				oboNode.data.textGroup.remove info.textIndex

				oboNode.addAfter inbetweenNode

				if not caretInLastItem
					inbetweenNode.addAfter afterNode

				sel.setFutureCaret inbetweenNode, { offset:0, childIndex:0 }
				return

			oboNode.data.textGroup.splitText info.textIndex, info.offset

			sel.setFutureCaret oboNode, { offset:0, childIndex:info.textIndex + 1}


		indent: (sel, oboNode, decreaseIndent) ->
			if sel.type is 'caret'
				info = POS.getCaretInfo sel.start, oboNode

				if info.offset is 0 and info.textIndex is 0
					@applyIndent oboNode.data, decreaseIndent
					sel.setFutureCaret oboNode, { offset:0, childIndex:0 }
					return

				if info.offset isnt 0
					return @insertText sel, oboNode, "\t"
				else
					@applyIndent oboNode.data.textGroup.get(info.textIndex).data, decreaseIndent
					sel.setFutureCaret oboNode, { offset:0, childIndex:info.textIndex }
					return

			console.log 'c'
			span = POS.getSelSpanInfo sel, oboNode
			curIndex = span.start.textIndex
			while curIndex <= span.end.textIndex
				@applyIndent oboNode.data.textGroup.get(curIndex).data, decreaseIndent
				curIndex++

			POS.reselectSpan sel, oboNode, span

		applyIndent: (data, decreaseIndent) ->
			if not decreaseIndent
				data.indent++
			else if data.indent > 0
				data.indent--


		createNodeDataFromDescriptor: TextMethods.createNodeDataFromDescriptor
		getDataDescriptor:            TextMethods.getDataDescriptor
		getCaretEdge:                 TextMethods.getCaretEdge
		insertText:                   TextMethods.insertText
		deleteText:                   TextMethods.deleteText
		deleteSelection:              TextMethods.deleteSelection
		styleSelection:               TextMethods.styleSelection
		merge:                        TextMethods.merge
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		updateSelection:              TextMethods.updateSelection


	# printTree: (indent = '', el, curUl) ->
	# 	if el.nodeType is 'element'
	# 		console.log indent, '<', el.type, '>', (if el is curUl then '***' else '')

	# 		for child in el.children
	# 			@printTree indent + '    ', child, curUl
	# 	else
	# 		console.log indent, '"', el.text.value, '"'

	render: ->
		indent = @state.oboNode.data.indent

		texts = @state.oboNode.data.textGroup
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
			curIndex++

			curUl.lastChild.addChild text

			# console.log 'TREE'
			# console.log '==========================================='
			# @printTree '', rootUl, curUl

		# console.log 'DE ROOT TREE BE'
		# @printTree '', rootUl, curUl
		# console.log rootUl

		OboReact.createElement 'div', @state.oboNode, @props.index, { style: { marginLeft: (@state.oboNode.data.indent * 20) + 'px' } }, @renderEl(rootUl)


	renderEl: (node) ->
		# console.log 'renderEl', node
		switch node.nodeType
			when 'text'   then OboReact.createText node.text, @state.oboNode, node.index, null, @props.index
			# @TODO: KEY!!!!!1
			when 'element'then React.createElement node.type, { key:Math.random() }, @renderChildren(node.children)

	renderChildren: (children) ->
		# console.log 'renderChildren', children
		els = []
		for child in children
			els.push @renderEl(child)

		els

	# renderOLD: ->





	# 	texts = []
	# 	for item, index in @state.oboNode.data.textGroup.items
	# 		console.log item
	# 		console.log item.text
	# 		texts.push React.createElement 'li', null, OboReact.createText(item.text, @state.oboNode, index, null, @props.index)

	# 	OboReact.createElement 'ul', @state.oboNode, @props.index, null, texts


module.exports = List