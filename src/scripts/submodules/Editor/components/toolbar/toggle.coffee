Toggle = React.createClass
	onMouseDown: (event) ->
		event.preventDefault()
		@props.commandHandler @props.command

	render: ->
		React.createElement 'a', {
			className: 'toggle ' + (if @props.command.state? then " #{@props.command.state}" else "")
			onMouseDown: @onMouseDown
			alt: @props.command.label
			style: {
				backgroundImage:'url("' + @props.command.icon + '")'
			}
		}, @props.command.label


module.exports = Toggle