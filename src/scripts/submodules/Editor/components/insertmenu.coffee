MARGIN = 10
WIDTH = 30
HEIGHT = 30

InsertMenu = React.createClass
	getInitialState: ->
		selection: @props.selection
		inserts: @props.inserts

		# commands: @props.commands

	componentWillReceiveProps: (nextProps) ->
		@setState {
			selection: nextProps.selection
		}

	onMouseDown: (componentClass) ->
		@props.commandHandler componentClass

	render: ->
		onMouseDown = @onMouseDown

		children = []
		@props.inserts.forEach (componentClass, label) ->
			children.push React.createElement('li', null, React.createElement('button', { onMouseDown:onMouseDown.bind(@, componentClass) }, label))

		React.createElement 'div', { style: { position:'fixed', right:0, top:29 }},
			React.createElement 'ul', null, children


module.exports = InsertMenu