Button = React.createClass
	onMouseDown: (event) ->
		event.preventDefault()
		@props.commandHandler @props.command

	render: ->
		`<a
			className='button'
			onMouseDown={this.onMouseDown}
			alt={this.props.command.label}
			style={{backgroundImage:'url("' + this.props.command.icon + '")' }}
		>
			{this.props.command.label}
		</a>`


module.exports = Button