#@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!


React = require 'react'

Text = require '../../components/text'
TextGroup = require '../../text/textgroup'
TextMethods = require '../../text/textmethods'

ListStyles = require './liststyles'

MockElement = require '../../components/text/mockelement'
MockTextNode = require '../../components/text/mocktextnode'

List = React.createClass
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.content.textGroup, Infinity, { indent:0 }
			indent: 0
			listStyles: ListStyles.fromDescriptor descriptor.content.listStyles

		saveSelection:    TextMethods.saveSelection
		restoreSelection: TextMethods.restoreSelection
		styleSelection:   TextMethods.styleSelection
		unstyleSelection: TextMethods.unstyleSelection

	createMockListElement: (data, indentLevel) ->
		style = data.listStyles.get indentLevel

		tag = if style.type is 'unordered' then 'ul' else 'ol'
		el = new MockElement tag
		el.start = style.start
		el.listStyleType = style.bulletStyle

		el

	render: ->
		data = @props.chunk.componentContent

		texts = data.textGroup

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


		React.createElement 'div', { style: { marginLeft: (data.indent * 20) + 'px' } }, @renderEl(rootUl, 0, 0)

	renderEl: (node, index, indent) ->
		# console.log 'renderEl', arguments

		key = @props.chunk.cid + '-' + indent + '-' + index

		# console.log key

		switch node.nodeType
			when 'text'    then Text.createElement node.text, @props.chunk, node.index
			# @TODO: KEY!!!!!1
			when 'element' then React.createElement node.type, { key:key, start:node.start, style: { listStyleType:node.listStyleType } }, @renderChildren(node.children, indent + 1)

	renderChildren: (children, indent) ->
		# console.log 'renderChildren', children
		els = []
		for child, index in children
			els.push @renderEl(child, index, indent)

		els


module.exports = List