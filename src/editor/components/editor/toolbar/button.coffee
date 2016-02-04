React = require 'react'


Button = React.createClass
	render: ->
		React.createElement 'a', {
			className: 'button'
			onMouseDown: @props.commandHandler.bind(@, @props.command)
			alt: @props.command.label
			style: {
				backgroundImage:"url('#{@props.command.img}')"
			}
		}, @props.command.label


module.exports = Button