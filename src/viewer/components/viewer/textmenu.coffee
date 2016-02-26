React = require 'react'


HEIGHT = 30
MARGIN = 10

TextMenu = React.createClass
	getInitialState: ->
		sel: @props.selection.text
		selectionRect: @props.selection.rect

	componentWillReceiveProps: (nextProps) ->
		@setState {
			sel: nextProps.selection.text
			selectionRect: nextProps.selection.rect
		}

	render: ->
		rect = @state.selectionRect

		if @state.sel?
			console.log @state.text.type

		if @state.sel?.type is 'caret' then return null
		if not rect or not @props.commands or @props.commands.length is 0 then return null

		React.createElement('div', { className:'text-menu', style: {
			position: 'absolute'
			left: rect.left + (rect.width / 2) + 'px'
			top: (rect.top + window.scrollY - HEIGHT - MARGIN) + 'px'
			height: HEIGHT + 'px'
			zIndex: 9999
		}},
			@props.commands.map ((command, index) ->
				React.createElement('button', {
					onClick: @props.commandHandler.bind(@, command)
				}, command)
			).bind(@)
		)


module.exports = TextMenu