React = require 'react'

emptyChar = require('../../text/textconstants').EMPTY_CHAR


TextElement = React.createClass
	getInitialState: ->
		return (
			descriptor: @props.descriptor
		)

	componentWillReceiveProps: (nextProps) ->
		@setState { descriptor:nextProps.descriptor }

	getText: ->
		@state.descriptor.text || emptyChar

	render: ->
		if @state.descriptor.nodeType is 'element'
			children = []
			for child, index in @state.descriptor.children
				children.push React.createElement(TextElement, { descriptor:child, key:index })

			options = null
			if @state.descriptor.parent is null
				options = { 'data-obo-text', id:@props.id, 'data-obo-index':@props.index, 'data-owner-id':@props.ownerId, 'data-text-index':@props.textIndex }

			return React.createElement @state.descriptor.type, options, children

		return React.createElement 'span', {}, @getText()


module.exports = TextElement