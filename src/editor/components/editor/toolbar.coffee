React = require 'react'


MARGIN = 10
WIDTH = 30
HEIGHT = 30

Toolbar = React.createClass
	getInitialState: ->
		selection: @props.selection
		commands: ['createUl', 'createOl', 'indent', 'unindent', 'P', 'H1', 'H2']

	componentWillReceiveProps: (nextProps) ->
		@setState {
			selection: nextProps.selection
		}

	onMouseDown: (command) ->
		@props.commandHandler command

	render: ->
		onMouseDown = @onMouseDown

		React.createElement 'div', { style: { position:'fixed', right:0, top:0 }},
			@state.commands.map (command) ->
				React.createElement 'button', { onMouseDown:onMouseDown.bind(@, command) }, command


module.exports = Toolbar