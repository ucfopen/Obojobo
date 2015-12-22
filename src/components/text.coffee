React = require 'react'
StyleableText = require '../text/styleabletext'
StyleableTextRenderer = require './text/styleabletextrenderer'
TextElement = require './text/textelement'

DOMUtil = require '../dom/domutil'


Text = React.createClass
	statics:
		computeIndex: (node, sel) ->
			sel.text.id = node.id
			sel.text.domNode = node
			sel.text.index = @getOboTextPos sel.domContainer, sel.domIndex, node

		getOboTextInfo: (targetTextNode, offset) ->
			totalCharactersFromStart = 0
			# element ?= DOMUtil.getOboElementFromChild targetTextNode.parentElement, 'chunk'

			oboTextNode = DOMUtil.findParentWithAttr targetTextNode, 'data-obo-text'
			textIndex = oboTextNode.getAttribute 'data-text-index'

			for textNode in DOMUtil.getTextNodesInOrder(oboTextNode)
				break if textNode is targetTextNode
				totalCharactersFromStart += textNode.nodeValue.length

			offset: totalCharactersFromStart + offset
			textIndex: parseInt textIndex, 10

		#@TODO - Delete me!!!
		getOboTextPos: (targetTextNode, offset, element) ->
			console.warn 'stop using this method'
			totalCharactersFromStart = 0
			# element ?= DOMUtil.getOboElementFromChild targetTextNode.parentElement, 'chunk'

			for textNode in DOMUtil.getTextNodesInOrder(element)
				break if textNode is targetTextNode
				totalCharactersFromStart += textNode.nodeValue.length

			totalCharactersFromStart + offset

		getDomPosition: (offset, element) ->
			totalCharactersFromStart = 0

			for textNode in DOMUtil.getTextNodesInOrder(element)
				if totalCharactersFromStart + textNode.nodeValue.length >= offset
					return { textNode:textNode, offset:offset - totalCharactersFromStart }
				totalCharactersFromStart += textNode.nodeValue.length

			# Should never get here
			return { textNode:textNode, offset:totalCharactersFromStart }

		createElement: (styleableText, chunk, index, attrs = {}) ->
			attrs['text'] = styleableText
			attrs['key'] = 't-' + chunk.cid + '-' + index
			attrs['textIndex'] = index

			React.createElement(Text, attrs)

	appendText: (text) ->
		@state.styleableText.appendText text
		@setState { styleableText: @state.styleableText }

	insertText: (atIndex, text) ->
		@state.styleableText.insertText atIndex, text
		@setState { styleableText: @state.styleableText }

	deleteText: (from, to) ->
		@state.styleableText.deleteText from, to
		@setState { styleableText: @state.styleableText }

	mergeText: (otherComponent, atIndex) ->
		@state.styleableText.merge otherComponent.getStyleableText(), atIndex
		@setState { styleableText: @state.styleableText }

	getStyleableText: ->
		@state.styleableText #@TODO

	getInitialState: ->
		@props.text ?= new StyleableText('Insert Text Here') #@TODO

		return (
			id: @props.id
			text: @props.text
		)

	componentWillReceiveProps: (nextProps) ->
		@setState { text:nextProps.text }

	# componentDidUpdate: ->
	# 	startDomPos = @getDomPosition @lastCommandEvent.sel.start.index, React.findDOMNode(@)
	# 	endDomPos   = @getDomPosition @lastCommandEvent.sel.end.index, React.findDOMNode(@)

	# 	s = window.getSelection()
	# 	r = new Range
	# 	r.setStart startDomPos.textNode, startDomPos.offset
	# 	r.setEnd endDomPos.textNode, endDomPos.offset

	# 	s.removeAllRanges()
	# 	s.addRange r

	# 	console.timeEnd 'kp'


	render: ->
		mockElement = StyleableTextRenderer @state.text
		# React.createElement('span', { 'data-obo-type':'text' },
		# 	React.createElement(TextElement, { descriptor:mockElement })
		# )
		React.createElement(TextElement, { descriptor:mockElement, id:@state.id, index:@props.index, textIndex:@props.textIndex, ownerId:@props.ownerId })


module.exports = Text