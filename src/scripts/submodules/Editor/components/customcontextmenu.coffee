	# onContextMenuCommand: (event) ->
	# 	# console.log 'ocmc', arguments

	# 	switch event.type
	# 		when 'spelling'
	# 			@sendText event.data
	# 		when 'command'
	# 			switch event.data
	# 				when 'Cut', 'Delete'
	# 					@deleteSelection @selection.chunk

	# 	@update()

WIDTH = 30
MARGIN = 10

ContextMenu = React.createClass
	getInitialState: ->
		selectionRect: @props.selection.rect
		spellingSuggestions: @props.spellingSuggestions
		defaultCommands: ['Cut', 'Copy', 'Delete']
		active: false

	componentWillReceiveProps: (nextProps) ->
		@setState {
			selectionRect: nextProps.selection.rect
			spellingSuggestions: nextProps.spellingSuggestions
			active: nextProps.active
		}

	onDefaultCommand: (command) ->
		if command is 'cut' or command is 'copy'
			document.execCommand 'copy'

		@props.commandHandler { type:'command', data:command }

	render: ->
		if not rect or not @state.commands or @state.commands.length is 0 then return null
		# if not rect then return null

		React.createElement('ul', { style: {
			position: 'absolute'
			left: rect.left + 'px'
			top: (rect.top - MARGIN) + 'px'
			width: WIDTH + 'px'
			background: 'white'
			border: '1px solid black'
		}},
			(
				@state.spellingSuggestions.map ((command, index) ->
					React.createElement('li', {
						onClick: @props.commandHandler.bind(@, { type:'spelling', data:command })
					}, command)
				).bind(@)
			)
			.concat(React.createElement('li', null, React.createElement('hr')))
			.concat(
				#
				@state.defaultCommands.map ((command, index) ->
					React.createElement('li', {
						onClick: @onDefaultCommand.bind(@, command)
					}, command)
				).bind(@)
			)

		)


module.exports = ContextMenu