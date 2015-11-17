React = require 'react'

MutationPainter = require '../../debug/mutationpainter'
MutationPainter.observe()

Keyboard = require '../../util/keyboard'
Command = require '../commands/command'
CommandEvent = require '../commands/commandevent'
StyleType = require '../../text/styletype'

ComponentMap = require '../../util/componentmap'
ComponentClassMap = require '../../util/componentclassmap'

History = require '../history/history'

OboNode = require '../../obodom/obonode'
OboNodeUtil = require '../../obodom/obonodeutil'
descriptorToNode = require '../../obodom/descriptortonode'

OboReact = require '../../oboreact/oboreact'

OboSelection = require '../../obodom/selection/oboselection'
OboSelectionRange = require '../../obodom/selection/oboselectionrange'

# @TODO - Dynamically or batch load all components
components =
	editabletext: require './editabletext'
	paragraph:    require './paragraph'
	figure:       require './figure'
	list:         require './list'
	listItem:     require './listitem'

Test = require './test'


getIndex = (node) ->
	while node?
		if node.getAttribute('data-obo-index')?
			return node.getAttribute('data-obo-index')
		node = node.parentElement

getSelectedNodes = (root) ->
	r = window.getSelection().getRangeAt(0)

	start = getIndex r.startContainer.parentElement
	end   = getIndex r.endContainer.parentElement

	start = start.split('.')[1]
	end   = end.split('.')[1]

	start = root.children[start]
	end   = root.children[end]

	inbetween = []

	n = start
	while n isnt end
		if n isnt start
			inbetween.push n
		n = n.nextSibling

	start: start
	inbetween: inbetween
	end: end



callTree = (path, commandEvent, range) ->
	for selNode in path
		component = selNode.component
		# console.log 'callTree', selNode, component

		if component and component.handleCommand?
			# console.log '_', component.handleCommand
			component.handleCommand commandEvent, range
			break if commandEvent.propagationStopped

	#@TODO - this crappy (use promises???)
	for cb in commandEvent.callbacks
		cb commandEvent

	commandEvent.callbacks = []


EditorApp = React.createClass

	getInitialState: ->
		loDescriptor = require('../../debug/fakelo')

		ComponentClassMap.register 'paragraph',    components.paragraph
		ComponentClassMap.register 'list',         components.list
		ComponentClassMap.register 'listItem',     components.listItem
		ComponentClassMap.register 'editabletext', components.editabletext
		ComponentClassMap.register 'figure',       components.figure
		ComponentClassMap.register 'question',     require './question'

		root = descriptorToNode loDescriptor

		console.log 'lo be all lke', loDescriptor
		window.__lo = root
		console.log 'root be all like', root

		@loDescriptor = loDescriptor
		@history = new History();

		return (
			root: root
		)

	onKeyDown: (event) ->
		# return
		console.log 'keydown', event.repeat
		metaOrCtrlKeyHeld = event.metaKey or event.ctrlKey

		switch event.keyCode
			# When the user attempts to delete text we have to
			# prevent keyDown, otherwise the browser will delete
			# the characters against our wishes
			when Keyboard.BACKSPACE
				event.preventDefault()
				@send Command.DELETE_TEXT, [Command.DELETE_BACKWARD]

			when Keyboard.DELETE
				event.preventDefault()
				@send Command.DELETE_TEXT, [Command.DELETE_FORWARD]

			when Keyboard.TAB
				event.preventDefault()
				@send Command.INSERT_TAB, [event.shiftKey]

			when Keyboard.ENTER
				event.preventDefault()
				@send Command.SPLIT_TEXT

			# when Keyboard.LEFT_ARROW, Keyboard.RIGHT_ARROW, Keyboard.UP_ARROW, Keyboard.DOWN_ARROW
			# 	@storedSelectionObj = OboSelection.get().getExportedObject()
			# 	@send Command.MOVE, [event.keyCode]

			# We want to capture ctrl/cmd+b and other such events
			# to stop the browsers default execCommand behavior.
			when 66 #b
				if metaOrCtrlKeyHeld
					event.preventDefault()
					if window.getSelection().type is 'Range'
						@send Command.TOGGLE_STYLE_TEXT, [StyleType.BOLD]
					else
						@send Command.SET_STYLE, [StyleType.BOLD]

			when 73 #i
				if metaOrCtrlKeyHeld
					event.preventDefault()
					if window.getSelection().type is 'Range'
						@send Command.TOGGLE_STYLE_TEXT, [StyleType.ITALIC]
					else
						@send Command.SET_STYLE, [StyleType.ITALIC]

			when 65 #a
				if metaOrCtrlKeyHeld
					event.preventDefault()
					@send Command.SELECT_ALL

			when 90 #z
				if metaOrCtrlKeyHeld
					event.preventDefault()
					if event.shiftKey then @redo() else @undo()

			when 89 #y
				if metaOrCtrlKeyHeld
					event.preventDefault()
					@redo()

	onKeyPress: (event) ->
		# return
		console.time 'kp'

		event.preventDefault()

		char = String.fromCharCode event.charCode
		@handleKey char, event

	handleKey: (char, event) ->
		switch event.keyCode
			when Keyboard.ENTER
				if event.shiftKey
					@send Command.INSERT_TEXT, ["\n"]
				else
					@send Command.SPLIT_TEXT, null
			else @send Command.INSERT_TEXT, [char]

	send: (command, data = []) ->
		# return
		@sel = new OboSelection()

		s = getSelectedNodes(@state.root)
		console.log 'sssssssssssssssssssssssssss'
		console.log s

		startComponent = @sel.start.path.last.component
		endComponent   = @sel.end.path.last.component

		return if not startComponent or not endComponent

		#prime the pumps
		if @history.length is 0
			@history.add @loDescriptor, @sel.toDescriptor()

		commandEvent = new CommandEvent command, @sel, data
		@selectionPending = @sel

		if @sel.type isnt 'nodeRange'
			callTree @sel.start.path.all, commandEvent, new OboSelectionRange('only', @sel.start.textIndex, @sel.end.textIndex, @sel.start.oboNode)
		else
			callTree @sel.start.path.all, commandEvent, new OboSelectionRange('start', @sel.start.textIndex, Infinity, @sel.start.oboNode)

			nodePath = @sel.path
			console.log 'node path be all', nodePath
			for oboNode in nodePath.slice(1, -1)
				component = ComponentMap.getComponentById oboNode.id
				if component?
					component.handleCommand commandEvent, new OboSelectionRange('inside', 0, Infinity, oboNode)

			callTree @sel.end.path.all, commandEvent, new OboSelectionRange('end', 0, @sel.end.textIndex, @sel.end.oboNode)

		console.time 'toDescriptor'
		@loDescriptor = @state.root.toDescriptor true
		console.timeEnd 'toDescriptor'

		@onChildUpdate commandEvent

	undo: ->
		history = @history.undo()
		@setState({ root:descriptorToNode(history.lo) })
		if history.selection
			@selectionPending = new OboSelection(history.selection)

	redo: () ->
		history = @history.redo()
		@setState({ root:descriptorToNode(history.lo) })
		if history.selection
			@selectionPending = new OboSelection(history.selection)

	onChildUpdate: (commandResult) ->
		@setState { root:@state.root }

	componentDidUpdate: ->
		# if we didn't do an undo/redo, push to history
		if @sel
			console.log 'sel is', @sel
			@history.add @loDescriptor, @sel.toDescriptor()

		if @selectionPending
			console.log 'selection was pending'
			console.log @selectionPending
			console.log JSON.stringify(@selectionPending.toDescriptor(), null, 2)
			@selectionPending.select()
			@selectionPending = null

		@sel = null

		console.log @history

		console.timeEnd 'kp'

	saveHistory: ->
		@loDescriptor = @state.root.toDescriptor true
		@history.add @loDescriptor, null

	# renderTEST: ->
	# 	React.createElement 'div', null,
	# 		React.createElement Test
	# 		OboReact.createElement 'div', @state.root, '0',
	# 			{
	# 				onClick: @onClick,
	# 				onKeyDown: @onKeyDown,
	# 				onKeyPress: @onKeyPress,
	# 				contentEditable: true,
	# 			},
	# 			# OboReact.createChildren @state.root, '0',
	# 			React.createElement Test

	render: ->
		OboReact.createElement 'div', @state.root, '0',
			{
				onClick: @onClick,
				onKeyDown: @onKeyDown,
				onKeyPress: @onKeyPress,
				contentEditable: true,
			},
			OboReact.createChildren @state.root, '0'

	# renderOLD: ->
	# 	oboNode = @state.root

	# 	children = []
	# 	for childNode, i in oboNode.children
	# 		continue if not childNode.componentClass

	# 		children.push React.createElement childNode.componentClass, {
	# 			ref: oboNode.type + i,
	# 			oboNode: childNode,
	# 			key: childNode.id,
	# 			index: i,
	# 			saveHistory: @saveHistory,
	# 			parentIndex: '0'
	# 		}

	# 	React.createElement 'div', {
	# 		'data-oboid': oboNode.id,
	# 		'data-obo-type': oboNode.type,
	# 		'data-obo-index': 0,
	# 		'data-new-obo-id': '0',
	# 		contentEditable: true,
	# 		onClick: @onClick
	# 		onKeyDown: @onKeyDown
	# 		onKeyPress: @onKeyPress
	# 		onKeyUp: @onKeyUp
	# 	}, children



module.exports = EditorApp