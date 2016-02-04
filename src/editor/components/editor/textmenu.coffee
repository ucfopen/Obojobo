React = require 'react'


HEIGHT = 30
MARGIN = 20

TextMenu = React.createClass
	getInitialState: ->
		selectionRect: @props.selection.rect

	componentWillReceiveProps: (nextProps) ->
		@setState {
			selectionRect: nextProps.selection.rect
			commands: nextProps.selection.textCommands
		}

	renderImg: (command) ->
		if not command.image? then return React.createElement 'span', null, command.label

		React.createElement 'img', { src:command.image }

	render: ->
		rect = @state.selectionRect
		renderImg = @renderImg

		if not rect or not @state.commands or @state.commands.length is 0 then return null

		React.createElement('div', { className:'text-menu', style: {
			position: 'absolute'
			left: rect.left + (rect.width / 2) + 'px'
			top: (rect.top + window.scrollY - HEIGHT - MARGIN) + 'px'
			height: HEIGHT + 'px'
			zIndex: 9999
		}},
			@state.commands.map ((command, index) ->
				React.createElement('a', {
					onClick: @props.commandHandler.bind(@, command.label)
				}, renderImg(command))
			).bind(@)
		)


module.exports = TextMenu