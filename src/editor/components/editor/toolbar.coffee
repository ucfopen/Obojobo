React = require 'react'

toolbarClasses =
	separator: require './toolbar/separator'
	button: require './toolbar/button'
	toggle: require './toolbar/toggle'
	listButton: require './toolbar/listbutton'
	gridButton: require './toolbar/gridbutton'
	select: require './toolbar/select'


Toolbar = React.createClass
	getInitialState: ->
		selection: @props.selection
		# commands: ['REDRAW', 'SAVE', 'createUl', 'createOl', 'indent', 'unindent', 'P', 'H1', 'H2']
		commands: @props.commands

	componentWillReceiveProps: (nextProps) ->
		@setState {
			selection: nextProps.selection
			commands: nextProps.commands
		}

	render: ->
		commandHandler = @props.commandHandler

		React.createElement 'div', { className:'toolbar' },
			@state.commands.map (command, index) ->
				React.createElement toolbarClasses[command.type], { command:command, commandHandler:commandHandler, key:index }


module.exports = Toolbar