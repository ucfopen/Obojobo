React = require 'react'


Toggle = React.createClass
	render: ->
		React.createElement 'a', {
			className: 'toggle ' + (if @props.command.state? then " #{@props.command.state}" else "")
			onMouseDown: @props.commandHandler.bind(@, @props.command)
			alt: @props.command.label
			style: {
				backgroundImage:"url('#{@props.command.img}')"
			}
		}, @props.command.label


module.exports = Toggle