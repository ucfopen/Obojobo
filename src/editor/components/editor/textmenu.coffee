React = require 'react'


HEIGHT = 30
MARGIN = 10

TextMenu = React.createClass
	getInitialState: ->
		selectionRect: @props.selection.rect

	componentWillReceiveProps: (nextProps) ->
		@setState {
			selectionRect: nextProps.selection.rect
			commands: nextProps.selection.labels
		}

	render: ->
		rect = @state.selectionRect

		if not rect or not @state.commands or @state.commands.length is 0 then return null

		React.createElement('div', { style: {
			position: 'absolute'
			left: rect.left + 'px'
			top: (rect.top + window.scrollY - HEIGHT - MARGIN) + 'px'
			height: HEIGHT + 'px'
			background: 'white'
			border: '1px solid black'
		}},
			@state.commands.map ((command, index) ->
				React.createElement('button', {
					onClick: @props.commandHandler.bind(@, command)
				}, command)
			).bind(@)
		)


module.exports = TextMenu