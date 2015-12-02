React = require 'react'

TextMenu = require './editor/textmenu'
SideMenu = require './editor/sidemenu'
StylesMenu = require './editor/stylesmenu'
Selection = require './editor/selection'

Screen = require '../../dom/screen'

MutationPainter = require '../../debug/mutationpainter'
MutationPainter.observe()

Keyboard = require '../../util/keyboard'
Command = require '../commands/command'
StyleType = require '../../text/styletype'

ComponentClassMap = require '../../util/componentclassmap'

History = require '../history/history'

HTMLToOboNodes = require '../import/html'

Module = require '../../models/module'
Chunk = require '../../models/chunk'






ComponentClassMap.register 'heading',    require './heading'
ComponentClassMap.register 'singletext',    require './singletext'
ComponentClassMap.register 'list',         require './list'
ComponentClassMap.register 'figure',       require './figure'
ComponentClassMap.register 'question',     require './question'
ComponentClassMap.register 'table',     require './table'

ComponentClassMap.setDefaultComponentClass require './singletext'


EditorApp = React.createClass

	getInitialState: ->
		loDescriptor = require('../../debug/fakelo')

		module = Module.createFromDescriptor loDescriptor

		@history = new History
		@selection = new Selection
		@screen = new Screen

		window.__history = @history
		window.__lo = module

		return (
			module: module
			selection: @selection #@TODO
			styleBrush: {}
		)

	deleteSelection: (sel) ->
		return if sel.type is 'caret'

		for node in sel.inbetween
			node.remove()

		@callComponentFn 'deleteSelection', sel.start.chunk

		if sel.type is 'nodeSpan'
			@callComponentFn 'deleteSelection', sel.end.chunk
			if @callComponentFn('acceptMerge', sel.end.chunk, [sel.start.chunk])
				@callComponentFn 'merge', sel.start.chunk, [sel.end.chunk]

		sel.collapse()


	# EVENTS

	onKeyDown: (event) ->
		@updateSelection()

		metaOrCtrlKeyHeld = event.metaKey or event.ctrlKey

		switch event.keyCode
			# DELETE
			when Keyboard.BACKSPACE, Keyboard.DELETE
				event.preventDefault()
				if @selection.sel.type is 'caret'
					caretEdge = @callComponentFn 'getCaretEdge', @selection.sel.start.chunk
					deleteForwards = event.keyCode is Keyboard.DELETE
					switch
						when caretEdge is 'start' and not deleteForwards
							if @callComponentFn('acceptMerge', @selection.sel.start.chunk, [@selection.sel.start.chunk.prevSibling()])
								@send 'merge', @selection.sel.start.chunk.prevSibling(), [@selection.sel.start.chunk]

						when caretEdge is 'end' and deleteForwards
							if @callComponentFn('acceptMerge', @selection.sel.start.chunk.nextSibling(), [@selection.sel.start.chunk])
								@send 'merge', @selection.sel.start.chunk, [@selection.sel.start.chunk.nextSibling()]

						else
							@send 'deleteText', @selection.sel.start.chunk, [event.keyCode is Keyboard.DELETE]
				else
					@deleteSelection @selection.sel
					@update()

			# INDENT
			when Keyboard.TAB
				event.preventDefault()
				@send 'indent', @selection.sel.all, [event.shiftKey]

			# NEW LINE
			when Keyboard.ENTER
				event.preventDefault()
				@deleteSelection @selection.sel
				@send 'splitText', @selection.sel.start.chunk, [event.shiftKey]

		if metaOrCtrlKeyHeld
			switch event.keyCode
				# We want to capture ctrl/cmd+b and other such events
				# to stop the browsers default execCommand behavior.
				when 66 #b
					event.preventDefault()
					@nextStyle = StyleType.BOLD
					@send 'styleSelection', @selection.sel.all, [StyleType.BOLD]

				when 73 #i
					event.preventDefault()
					@nextStyle = StyleType.ITALIC
					@send 'styleSelection', @selection.sel.all, [StyleType.ITALIC]

				#
				# when 65 #a
				# 	event.preventDefault()
				# 	@send Command.SELECT_ALL

				when 90 #z
					event.preventDefault()
					if event.shiftKey then @redo() else @undo()

				when 89 #y
					event.preventDefault()
					@redo()

	onKeyPress: (event) ->
		console.time 'kpCycle'

		event.preventDefault()

		char = String.fromCharCode event.charCode

		@sendText char

	onKeyUp: (event) ->
		@state.styleBrush = {}
		if @nextStyle
			@state.styleBrush[@nextStyle] = @nextStyle
			delete @nextStyle

		@updateSelection()


	onPaste: (event) ->
		# @beforeSend()

		event.preventDefault()

		html = event.clipboardData.getData 'text/html'
		text = event.clipboardData.getData 'text/plain'

		if html.length > 0
			@sendHTML html
		else
			@sendText text

	onMouseDown: (event) ->
		@selection.clear()
		@state.styleBrush = {}
		true

	onMouseUp: (event) ->
		setTimeout @updateSelection.bind(@), 0
		true





	updateSelection: ->
		# @state.styleBrush = {}
		# curSel = @selection.getSelectionDescriptor()
		@selection.update @state.module
		# nextSel = @selection.getSelectionDescriptor()



		@setState {
			selection: @selection
			# newSelection: JSON.stringify(curSel) == JSON.stringify(nextSel) #@TODO, assumes object order
			# styleBrush: @state.styleBrush
		}






	sendHTML: (html) ->
		chunks = HTMLToOboNodes(html)

		@deleteSelection @selection.sel
		@callComponentFn 'splitText', @selection.sel.start.chunk
		splitNode = @selection.sel.start.chunk.nextSibling()
		for chunk in chunks
			splitNode.addBefore chunk

		@update()

	sendText: (char) ->
		if char is 's'
			console.clear()
			@__savedSelection = s = @selection.getSelectionDescriptor()
			console.log JSON.stringify(s, null, 2)
			return

		if char is 'S'
			console.clear()
			@selection.selectFromDescriptor @state.module, @__savedSelection
			return

		if char is 'c'
			console.clear()
			return

		if char is 'g'
			styles = @callComponentFn 'getSelectionStyles', @selection.sel.start.chunk
			console.log 'STYLES:', styles
			return

		console.log 'sendText', char, @nextStyle

		@deleteSelection @selection.sel
		@send 'insertText', @selection.sel.start.chunk, [char, Object.keys(@state.styleBrush)]

	# beforeSend: ->
	# 	console.time 'send'
	# 	console.time 'cycle'

	# 	console.time 'ss'
	# 	@savedSelection = @selection.sel.getDescriptor()
	# 	console.timeEnd 'ss'

	send: (fn, chunkOrChunks, data = []) ->
		if chunkOrChunks instanceof Array
			chunks = chunkOrChunks
		else
			chunks = []
			chunks.push chunkOrChunks

		for chunk in chunks
			@callComponentFn fn, chunk, data

		@update()

	callComponentFn: (fn, chunk, data) ->
		chunk.callComponentFn fn, @selection.sel, data

	update: ->
		# console.time 'toDescriptor'
		# @loDescriptor =
		# console.timeEnd 'toDescriptor'

		# console.timeEnd 'send'

		# @historyShouldUpdate = true


		@selectionPending = @selection.getFutureDescriptor()
		@selection.sel.clearFuture()
		@history.add @state.module.toJSON(), @selectionPending
		@setState {
			module: @state.module
			selection: @state.selection
			styleBrush: @state.styleBrush
		}


	undo: ->
		history = @history.undo()
		@setState { module:Module.createFromDescriptor(history.lo) }
		if history.selection then @selectionPending = history.selection

	redo: ->
		history = @history.redo()
		@setState { module:Module.createFromDescriptor(history.lo) }
		if history.selection then @selectionPending = history.selection

	componentDidMount: ->
		#prime the pumps
		@history.add @state.module.toJSON(), null

	componentDidUpdate: ->
		console.log 'COMPONENT DID UPDATE'

		if @selectionPending
			@selection.selectFromDescriptor @state.module, @selectionPending
			delete @selectionPending
		# else
			# @selection.selectFuture @state.module

		# if @historyShouldUpdate
		# 	delete @historyShouldUpdate
		# 	@history.add @state.module.toJSON(), @selection.getSelectionDescriptor()

		# @history.__debug_print()
		# @screen.scrollSelectionIntoViewIfNeeded()
		@screen.tweenSelectionIntoViewIfNeeded()

		#Nasty hack
		if @selectionShouldUpdate
			delete @selectionShouldUpdate
			@selection.update @state.module
			@setState { selection:@selection }

		console.timeEnd 'cycle'
		console.timeEnd 'kpCycle'

	onTextMenuCommand: (commandLabel) ->
		# @beforeSend()

		for chunk in @selection.sel.all
			@selection.runCommand(commandLabel, chunk)

		@update()

	onSideMenuClick: (position) ->
		newChunk = Chunk.create()

		if position is 'before'
			@selection.sel.start.chunk.addBefore newChunk
			@callComponentFn 'selectStart', newChunk
		else
			@selection.sel.end.chunk.addAfter newChunk
			@callComponentFn 'selectEnd', newChunk, ['end']

		# console.log 'selection  is', @selection.sel, JSON.stringify(@selection.sel.futureStart)

		@selectionShouldUpdate = true
		@update()


	render: ->
		saveHistoryFn = @saveHistory

		# console.log 'new selection?', @state.newSelection
		# { style:{ background:(if @state.newSelection then 'red' else 'white') } }

		React.createElement 'div', null,
			React.createElement StylesMenu, {
				selection: @state.selection
				styleBrush: @state.styleBrush
				}
			React.createElement SideMenu, {
				selection: @state.selection
				handlerFn: @onSideMenuClick
				}
			React.createElement TextMenu, { selection:@state.selection, commandHandler:@onTextMenuCommand }
			React.createElement 'div', {
				onClick: @onClick,
				onKeyDown: @onKeyDown,
				onKeyPress: @onKeyPress,
				onKeyUp: @onKeyUp,
				onPaste: @onPaste,
				onMouseDown: @onMouseDown,
				onMouseUp: @onMouseUp,
				contentEditable: true
			},
				@state.module.chunks.models.map (chunk, index) ->
					React.createElement 'div', {
						className: 'component'
						'data-component-type': chunk.get 'type'
						'data-component-index': index
						'data-oboid': chunk.cid
						key: index
					},
						React.createElement chunk.getComponent(), {
							chunk: chunk
							updateFn: @update
						}



module.exports = EditorApp