require './toolbar.scss'

defaultToolbarClasses =
	separator: require './toolbar/separator'
	button: require './toolbar/button'
	toggle: require './toolbar/toggle'
	# listButton: require './toolbar/listbutton'
	select: require './toolbar/select'


Toolbar = React.createClass
	statics:
		disabledStyles:
			opacity: 0.5
			pointerEvents: 'none'

	getInitialState: ->
		selection: @props.selection
		commands: @props.commands

	componentWillReceiveProps: (nextProps) ->
		@setState {
			selection: nextProps.selection
			commands: nextProps.commands
		}

	render: ->
		commandHandler = @props.commandHandler

		styles = {}
		if not @props.enabled then styles = Toolbar.disabledStyles

		React.createElement 'div', { className:'editor--components--toolbar', style:styles },
			React.createElement 'div', { className:'wrapper' },
				@state.commands.map (command, index) ->
					if typeof command.type is 'string'
						Component = defaultToolbarClasses[command.type]
					else
						Component = command.type

					React.createElement Component, { command:command, commandHandler:commandHandler, key:index }


module.exports = Toolbar