React = require 'react'

emptyChar = require('../../text/textconstants').EMPTY_CHAR

TextElement = React.createClass
	# getInitialState: ->
	# 	return (
	# 		descriptor: @props.descriptor
	# 	)

	# componentWillReceiveProps: (nextProps) ->
	# 	@setState { descriptor:nextProps.descriptor }

	# getText: ->
	# 	@props.descriptor.text || '' # || emptyChar

	getText: ->
		@props.descriptor.text || emptyChar

	# componentDidUpdate: -> @hackInEmptyTextNode()
	# componentDidMount: -> @hackInEmptyTextNode()

	# Terrible hack to force our spans to have a text node in them.
	# Without this the spans have no child nodes, so selection
	# throws errors because we can't select a textNode.
	# hackInEmptyTextNode: ->
	# 	el = React.findDOMNode(@)
	# 	if el.childNodes.length is 0
	# 		el.appendChild document.createTextNode('')

	render: ->
		el = @props.descriptor

		if el.nodeType is 'text'
			text = @getText()

			if text is ''
				return React.createElement 'span', { className:'empty' }, text
			else
				return React.createElement 'span', { }, text

		attrs = @props.descriptor.attrs
		attrs['data-text-index'] = @props.textIndex

		React.createElement el.type, attrs, el.children.map( (child, index) -> React.createElement(TextElement, { descriptor:child, key:index }) )

	# renderOLD: ->
	# 	# console.log 'TE.r'
	# 	el = @props.descriptor

	# 	if el.nodeType is 'text'
	# 		return React.createElement 'span', null, el.text

	# 	React.createElement el.type, null, el.children.map( (child) -> React.createElement(TextElement, {descriptor:child}) )

	# getHTML: (node) ->
	# 	getHTML = @getHTML
	# 	if node.nodeType is 'text' then return node.text

	# 	s = ''
	# 	for attr, val of node.attrs
	# 		s += "#{attr}='#{val}' "

	# 	"<#{node.type} #{s}>#{node.children.map((child) -> getHTML(child)).join('')}</#{node.type}>"

	# render: ->
	# 	console.log 'TE.r'
	# 	console.log @getHTML(@props.descriptor)

	# 	React.createElement('span', {
	# 		dangerouslySetInnerHTML:{__html:@getHTML(@props.descriptor)}
	# 		'data-text-index': @props.textIndex
	# 		'data-obo-text': true
	# 	})

	# renderOLD: ->
	# 	console.log @props.elementKey + ' TE.r', @props.descriptor

	# 	newKey = @props.key + '.' + @props.elementKey

	# 	if @props.descriptor.nodeType is 'text'
	# 		console.log @props.elementKey + ' return span', @getText()
	# 		return React.createElement 'span', { key:@props.elementKey, 'data-key':@props.elementKey }, @getText()



	# 	options = @props.descriptor.attrs
	# 	if @props.descriptor.parent is null
	# 		options['data-obo-text'] = true
	# 		# options['id'] = @props.id
	# 		# options['data-obo-index'] = @props.index
	# 		# options['data-owner-id'] = @props.ownerId
	# 		options['data-text-index'] = @props.textIndex

	# 		# options = { 'data-obo-text', id:@props.id, 'data-obo-index':@props.index, 'data-owner-id':@props.ownerId, 'data-text-index':@props.textIndex }
	# 	options['key'] = @props.elementKey
	# 	options['elementKey'] = @props.elementKey
	# 	options['data-key'] = @props.elementKey
	# 	options['data-type'] = @props.descriptor.type

	# 	console.log @props.elementKey, ' Create react el', @props.descriptor.type, @props.descriptor

	# 	children = []
	# 	for child, index in @props.descriptor.children
	# 		# console.log @props.elementKey + ' create children', child
	# 		children.push React.createElement(TextElement, {
	# 			descriptor:child
	# 			key:@props.elementKey + '.' + index
	# 			elementKey:@props.elementKey + '.' + index
	# 			'data-key':@props.elementKey + '.' + index
	# 		})

	# 	# if @props.descriptor.type is 'i'
	# 	# 	@props.descriptor.type = 'em'

	# 	return React.createElement @props.descriptor.type, options, children


module.exports = TextElement