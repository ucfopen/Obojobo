React = require 'react'
SerializeSelection = require 'serialize-selection'

MutationPainter = require '../../debug/mutationpainter'
MutationPainter.observe()

Keyboard = require '../../util/keyboard'
Command = require '../commands/command'
StyleType = require '../../text/styletype'

ComponentMap = require '../../util/componentmap'
ComponentClassMap = require '../../util/componentclassmap'

History = require '../history/history'

OboSelection = require '../../obodom/selection/oboselection'

OboReact = require '../../oboreact/oboreact'

HTMLToOboNodes = require '../import/html'

Module = require '../../models/module'
Chunk = require '../../models/chunk'

Test = require './test'

window.__ss = SerializeSelection





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

		console.log 'lo be all lke', loDescriptor
		window.__lo = module
		console.log 'root be all like', module

		@loDescriptor = loDescriptor
		@history = new History();

		window.__history = @history;

		return (
			module: module
		)

	deleteSelection: (sel) ->
		return if sel.type is 'caret'

		for node in sel.inbetween
			node.remove()

		@callComponentFn 'deleteSelection', @sel.start.chunk

		if sel.type is 'nodeSpan'
			@callComponentFn 'deleteSelection', @sel.end.chunk
			if @callComponentFn('acceptMerge', @sel.end.chunk, [@sel.start.chunk])
				@callComponentFn 'merge', @sel.start.chunk, [@sel.end.chunk]
		# 	# @sel.end.oboNode.remove()

		sel.collapse()

	onKeyDown: (event) ->
		@sel = new OboSelection @state.module
		console.log 'SELBE'
		console.log @sel

		@beforeSend()

		# console.log event.keyCode
		# return
		metaOrCtrlKeyHeld = event.metaKey or event.ctrlKey

		switch event.keyCode
			# DELETE
			when Keyboard.BACKSPACE, Keyboard.DELETE
				event.preventDefault()
				if @sel.type is 'caret'
					caretEdge = @callComponentFn 'getCaretEdge', @sel.start.chunk
					deleteForwards = event.keyCode is Keyboard.DELETE
					switch
						when caretEdge is 'start' and not deleteForwards
							if @callComponentFn('acceptMerge', @sel.start.chunk, [@sel.start.chunk.prevSibling()])
								@send 'merge', @sel.start.chunk.prevSibling(), [@sel.start.chunk]

						when caretEdge is 'end' and deleteForwards
							if @callComponentFn('acceptMerge', @sel.start.chunk.nextSibling(), [@sel.start.chunk])
								@send 'merge', @sel.start.chunk, [@sel.start.chunk.nextSibling()]

						else
							@send 'deleteText', @sel.start.chunk, [event.keyCode is Keyboard.DELETE]
				else
					@deleteSelection @sel
					@afterSend()

			# INDENT
			when Keyboard.TAB
				event.preventDefault()
				@send 'indent', @sel.all, [event.shiftKey]

			# NEW LINE
			when Keyboard.ENTER
				event.preventDefault()
				@deleteSelection @sel
				@send 'splitText', @sel.start.chunk, [event.shiftKey]

		if metaOrCtrlKeyHeld
			switch event.keyCode
				# We want to capture ctrl/cmd+b and other such events
				# to stop the browsers default execCommand behavior.
				when 66 #b
					event.preventDefault()
					@send 'styleSelection', @sel.all, [StyleType.BOLD]

				when 73 #i
					event.preventDefault()
					@send 'styleSelection', @sel.all, [StyleType.ITALIC]

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
		# return
		console.time 'kpCycle'

		event.preventDefault()

		char = String.fromCharCode event.charCode
		# @handleKey char, event

		@selLater = @sel.start.chunk

		@sendText char

	onPaste: (event) ->
		@beforeSend()

		event.preventDefault()

		html = event.clipboardData.getData 'text/html'
		text = event.clipboardData.getData 'text/plain'

		if html.length > 0
			@sendHTML html
		else
			@sendText text

	sendHTML: (html) ->
		oboNodes = HTMLToOboNodes(html)
		console.log 'I woulda created'
		console.log oboNodes

		@deleteSelection @sel
		@callComponentFn 'splitText', @sel.start.oboNode
		splitNode = @sel.start.oboNode.nextSibling
		for node in oboNodes
			splitNode.addBefore node

		@afterSend()

	sendText: (char) ->
		console.log 'setText', char, @sel.start.chunk
		@deleteSelection @sel
		@send 'insertText', @sel.start.chunk, [char]

	beforeSend: ->
		console.time 'send'
		console.time 'cycle'
		# console.log '>>>>>>>>>>>>>>>>>>>SEND', fn, nodeOrNodes, data

		console.time 'ss'
		# @savedSelection = SerializeSelection.save()
		@savedSelection =
			start:
				index: @sel.start.chunk.getIndex()
				data:  @callComponentFn 'saveSelection', @sel.start.chunk, [@sel.start]
			end:
				index: @sel.end.chunk.getIndex()
				data:  @callComponentFn 'saveSelection', @sel.end.chunk, [@sel.end]

		# console.log 'ss=',@savedSelection
		console.timeEnd 'ss'

		#prime the pumps
		if @history.length is 0
			@history.add @loDescriptor, @savedSelection

	afterSend: ->
		console.time 'toDescriptor'
		@loDescriptor = @state.module.toJSON()
		console.timeEnd 'toDescriptor'

		console.timeEnd 'send'

		@onChildUpdate()

	send: (fn, nodeOrNodes, data = []) ->
		if nodeOrNodes instanceof Array
			nodes = nodeOrNodes
		else
			nodes = []
			nodes.push nodeOrNodes

		# console.log 'ok den', nodes

		for node in nodes
			@callComponentFn fn, node, data

		@afterSend()

	callComponentFn: (fn, node, data) ->
		componentClass = node.getComponent()
		if not componentClass[fn] then return null

		componentClass[fn].apply componentClass, [@sel, node].concat(data)

	undo: ->
		history = @history.undo()
		console.log 'UNDO RESTORE', history.lo
		console.log Module.createFromDescriptor(history.lo)
		@setState({ module:Module.createFromDescriptor(history.lo) })
		if history.selection
			@selectionPending = history.selection

	redo: () ->
		history = @history.redo()
		@setState({ module:Module.createFromDescriptor(history.lo) })
		if history.selection
			@selectionPending = history.selection

	onChildUpdate: (commandResult) ->
		# @sel.select()
		# @tempSel = SerializeSelection.save()

		@setState { module:@state.module }

	updateSelection: ->
		console.log 'UPDATE SELECTION'
		console.log @sel

		# @callComponentFn 'updateSelection'
		if @sel.futureStart? and @sel.futureEnd? and @sel.futureStart.chunk.cid is @sel.futureEnd.chunk.cid
			@callComponentFn 'updateSelection', @sel.futureStart.chunk, ['inside']
		else
			if @sel.futureStart?
				@callComponentFn 'updateSelection', @sel.futureStart.chunk, ['start']
			if @sel.futureEnd?
				@callComponentFn 'updateSelection', @sel.futureEnd.chunk, ['end']

		@sel.select()

	#@sel.start.oboNode.index
	componentDidUpdate: ->
		# console.log 'CDUUUUUU'

		@updateSelection()

		if @sel?.futureStart? and @sel.futureEnd?

			# @history.add @loDescriptor, @savedSelection
			s = {
				start:
					index: @sel.futureStart.chunk.getIndex()
					data:  @sel.futureStart.data
				end:
					index: @sel.futureEnd.chunk.getIndex()
					data:  @sel.futureEnd.data
			}

			@history.add @loDescriptor, s
			# delete @savedSelection

			delete @sel

		# if @tempSel
		# 	console.time 'ssr'
		# 	SerializeSelection.restore(@tempSel)
		# 	console.timeEnd 'ssr'
		# 	delete @tempSel

		# if @selLater and @selLater.componentClass? and @selLater.componentClass.updateSelection?
		# 	@selLater.componentClass.updateSelection @sel
		# 	@selLater = null
		# 	@sel.select()
		# else if @selectionPending
		# 	SerializeSelection.restore @selectionPending
		# 	@selectionPending = null

		if @selectionPending
			console.log @history
			console.log @selectionPending

			startChunk = @state.module.chunks.at @selectionPending.start.index
			endChunk   = @state.module.chunks.at @selectionPending.end.index

			start = @callComponentFn 'restoreSelection', startChunk, [@selectionPending.start.data]
			end   = @callComponentFn 'restoreSelection', endChunk, [@selectionPending.end.data]

			s = window.getSelection()
			r = new Range

			console.log 'start', start
			console.log 'end', end

			r.setStart start.textNode, start.offset
			r.setEnd   end.textNode,   end.offset

			s.removeAllRanges()
			s.addRange r

			delete @selectionPending



		console.timeEnd 'cycle'
		console.timeEnd 'kpCycle'



	# componentDidUpdateOLD: ->
	# 	# if we didn't do an undo/redo, push to history
	# 	if @sel
	# 		@history.add @loDescriptor, @sel.toDescriptor()

	# 	if @selectionPending
	# 		@selectionPending.select()
	# 		@selectionPending = null

	# 	@sel = null

	# 	console.log @history

	# 	console.timeEnd 'kp'

	saveHistory: ->
		@loDescriptor = @state.module.toJSON()
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
		saveHistoryFn = @saveHistory

		React.createElement 'div', {
			onClick: @onClick,
			onKeyDown: @onKeyDown,
			onKeyPress: @onKeyPress,
			onPaste: @onPaste,
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
						saveHistoryFn: saveHistoryFn
					}



module.exports = EditorApp