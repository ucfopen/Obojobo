React = require 'react'

Util = require('./util')
Screen = require '../../../dom/screen'
ListDetector = require '../../../obochunk/list/listdetector'
Keyboard = require '../../../util/keyboard'
StyleType = require '../../../text/styletype'
HTMLToOboNodes = require '../../import/html'
Chunk = require '../../../models/chunk'
DOMUtil = require '../../../dom/domutil'


EditorPage = React.createClass

	send: (fn, chunkOrChunks, data) ->
		Util.send fn, chunkOrChunks, @state.selection, data

	onEvent: (event) ->
		# console.log event.type

		return if not @state.inTextMode

		switch event.type
			when 'keydown'     then @onKeyDown event
			when 'keypress'    then @onKeyPress event
			when 'keyup'       then @onKeyUp event
			when 'paste'       then @onPaste event
			when 'cut'         then @onCut event
			when 'mousedown'   then @onMouseDown event
			when 'mouseup'     then @onMouseUp event
			when 'contextmenu' then @onContextMenu event
			when 'click'       then @onClick event

	onKeyDown: (event) ->
		@props.updateSelectionFn()

		metaOrCtrlKeyHeld = event.metaKey or event.ctrlKey

		switch event.keyCode
			# DELETE
			when Keyboard.BACKSPACE, Keyboard.DELETE
				event.preventDefault()
				if @state.selection.text.type is 'caret'
					caretEdge = @send 'getCaretEdge', @state.selection.text.start.chunk
					deleteForwards = event.keyCode is Keyboard.DELETE
					chunk = @state.selection.text.start.chunk
					prev = chunk.prevSibling()
					next = chunk.nextSibling()

					deleteSuccessful = @send 'deleteText', chunk, [deleteForwards]

					if not deleteSuccessful
						switch
							# If cursor is at the start and this is a backspace
							when (caretEdge is 'start' or caretEdge is 'startAndEnd') and not deleteForwards and prev?
								# If both chunks agree to be merged with each other
								if @send('canMergeWith', chunk, [prev]) and @send('canMergeWith', prev, [chunk])
									#... then previousSibling will merge with this chunk
									@send 'merge', prev, [chunk]
								else if @send('canRemoveSibling', chunk, [prev])
									#... else previousSibling simply gets deleted
									prev.remove()

							# If cursor is at the end and this is a foward delete
							when (caretEdge is 'end' or caretEdge is 'startAndEnd') and deleteForwards and next?
								# If both chunks agree to be merged with each other
								if @send('canMergeWith', chunk, [next]) and @send('canMergeWith', next, [chunk])
									#... then this chunk will merge with nextSibling
									@send 'merge', chunk, [next]
								else if @send('canRemoveSibling', chunk, [next])
									#... else nextSibling simply gets deleted
									next.remove()
				else
					Util.deleteSelection @state.selection

				@props.updateFn()

			# INDENT
			when Keyboard.TAB
				event.preventDefault()

				# If more than one chunk is selected...
				if @state.selection.text.type is 'nodeSpan'
					# ...indent all of them
					@send 'indent', @state.selection.text.all, [event.shiftKey]
					@props.updateFn()
					return

				# If tabbing at the start of the text...
				caretEdge = @send 'getCaretEdge', @state.selection.text.start.chunk
				if caretEdge is 'start' or caretEdge is 'startAndEnd'
					# ...indent
					@send 'indent', @state.selection.text.start.chunk, [event.shiftKey]
					@props.updateFn()
					return

				# Otherwise, let the chunk figure out what to do
				@send 'onTab', @state.selection.text.start.chunk, [event.shiftKey]
				@props.updateFn()

				# Util.deleteSelection @state.selection
				# @send 'insertText', @state.selection.text.start.chunk, ["\t"]
				# @props.updateFn()


			# NEW LINE
			when Keyboard.ENTER
				event.preventDefault()
				Util.deleteSelection @state.selection
				@send 'splitText', @state.selection.text.start.chunk, [event.shiftKey]
				@props.updateFn()

			#@TODO - are these the only ways to change the cursor with the keyboard?
			when Keyboard.LEFT_ARROW, Keyboard.RIGHT_ARROW, Keyboard.UP_ARROW, Keyboard.DOWN_ARROW
				# @history.add null, @state.selection.getSelectionDescriptor()

				if not @state.styleBrush.isClean
					@state.styleBrush.clean()
					@props.updateFn()

		if metaOrCtrlKeyHeld
			switch event.keyCode
				# We want to capture ctrl/cmd+b and other such events
				# to stop the browsers default execCommand behavior.
				when 66 #b
					event.preventDefault()

					Util.activateStyle StyleType.BOLD, @state.selection, @state.styleBrush

					@props.updateSelectionFn()
					@props.updateFn()

				when 73 #i
					event.preventDefault()

					Util.activateStyle StyleType.ITALIC, @state.selection, @state.styleBrush

					@props.updateSelectionFn()
					@props.updateFn()


				when 65 #a
					if @state.selection.text.type isnt 'nodeSpan'
						if @send 'selectAll', @state.selection.text.start.chunk
							event.preventDefault()
							# @props.updateSelectionFn()
							@props.updateFn()

	onKeyPress: (event) ->
		@props.updateSelectionFn()
		# console.time 'kpCycle'

		event.preventDefault()

		char = String.fromCharCode event.charCode

		@sendText char

	onKeyUp: (event) ->
		@props.updateSelectionFn()

	onPaste: (event) ->
		console.log 'ON PASTE!'

		event.preventDefault()

		html = event.clipboardData.getData 'text/html'
		text = event.clipboardData.getData 'text/plain'

		# if html.length > 0
			# @sendHTML html
		# else
			# @sendText text
		@sendText text

	onMouseDown: (event) ->
		@state.selection.clear()
		@state.styleBrush.clean()
		true

	onMouseUp: (event) ->
		setTimeout @props.updateSelectionFn.bind(@), 0
		true

	onClick: (event) ->
		console.log 'onClick', @state.activeChunk
		if @state.activeChunk?
			clickedChunkIndex = parseInt DOMUtil.findParentAttr(event.target, 'data-component-index'), 10
			clickedChunk = @state.module.chunks.at clickedChunkIndex

			console.log clickedChunkIndex, clickedChunk

			if not clickedChunk? or @state.activeChunk isnt clickedChunk
				@setState { activeChunk:null }

	sendHTML: (html) ->
		chunks = HTMLToOboNodes(html)

		Util.deleteSelection @state.selection
		@send 'splitText', @state.selection.text.start.chunk
		splitNode = @state.selection.text.start.chunk.nextSibling()
		for chunk in chunks
			splitNode.addBefore chunk

		@send 'selectEnd', chunks[chunks.length - 1]

		@props.updateFn()

	sendText: (char) ->
		if @createChunkFromChar(char) then return

		styleBrush = @state.styleBrush

		Util.deleteSelection @state.selection
		@send 'insertText', @state.selection.text.start.chunk, [char, styleBrush.stylesToApply, styleBrush.stylesToRemove]
		@props.updateFn()

	createChunkFromChar: (char) ->
		if char is ' '
			if @state.selection.text.type is 'caret' and @state.selection.text.start.chunk.get('type') is 'OboChunk.SingleText' and @send('getCaretEdge', @state.selection.text.start.chunk) is 'end'
				group = @state.selection.text.start.chunk.componentContent.textGroup
				listDetails = ListDetector group.last.text.value + ' '
				if listDetails isnt false
					group.last.text.init()
					newChunk = Chunk.create 'OboChunk.List'
					listStyles = newChunk.componentContent.listStyles
					listStyles.type = listDetails.type
					listStyles.set 0, { start:listDetails.symbolIndex, bulletStyle:listDetails.symbolStyle }
					@send 'transformSelection', newChunk
					@props.updateFn()
					return true

		if char is '-'
			if @state.selection.text.type is 'caret' and @state.selection.text.start.chunk.get('type') is 'OboChunk.SingleText' and @send('getCaretEdge', @state.selection.text.start.chunk) is 'end'
				group = @state.selection.text.start.chunk.componentContent.textGroup
				if group.last.text.value is '--'
					newChunk = Chunk.create 'OboChunk.Break'
					@state.selection.text.start.chunk.replaceWith newChunk
					newChunk2 = Chunk.create 'OboChunk.SingleText'
					newChunk.addAfter newChunk2
					@send 'selectStart', newChunk2
					@props.updateFn()
					return true

		false

	activateChunk: (chunk) ->
		console.log 'ACTIVATE', chunk

		@setState {
			activeChunk: chunk
		}

	getInitialState: ->
		@screen = new Screen

		module: @props.module
		selection: @props.selection
		styleBrush: @props.styleBrush
		activeChunk: null
		inTextMode: true

	componentWillReceiveProps: (nextProps) ->
		@setState {
			module: nextProps.module
			selection: nextProps.selection
			styleBrush: nextProps.styleBrush
		}

	componentDidMount: ->
		# Disable table resizing in FF
		document.execCommand "enableObjectResizing", false, "false"
		document.execCommand "enableInlineTableEditing", false, "false"

		#DEBUG:
		document.addEventListener "keydown", ( (event) ->
			if event.keyCode is 49
				event.preventDefault()
				# @setState { inTextMode:!@state.inTextMode }
				chunks = HTMLToOboNodes React.findDOMNode(@).innerHTML
				console.log chunks
				@state.module.chunks.reset chunks
				@props.updateFn()


				return
		).bind(@)

	componentDidUpdate: ->
		console.timeEnd 'renderPage'

		futureDesc = @state.selection.getFutureDescriptor()

		if futureDesc
			@state.selection.selectFromDescriptor @state.module, futureDesc
			@state.selection.clearFuture()

			@screen.tweenSelectionIntoViewIfNeeded()
			@props.updateSelectionFn()

			# Sometimes the editor may not be focused (i.e. after a click), so
			# we need to reselect in that case.
			sel = @state.selection
			thisEl = React.findDOMNode(@)
			setTimeout ->
				if not thisEl.contains(document.activeElement)
					sel.text.select()

	render: ->
		console.time 'renderPage'

		saveHistoryFn = @saveHistory
		activateFn = @activateChunk
		window.__activateFn = @activateChunk
		showModalFn = @showModal
		selection = @state.selection
		updateFn = @update

		activeChunk = @state.activeChunk

		React.createElement 'div', {
			id: 'editor',
			className: 'content'
			onKeyDown: @onEvent,
			onKeyPress: @onEvent,
			onKeyUp: @onEvent,
			onPaste: @onEvent,
			onCut: @onEvent,
			onMouseDown: @onEvent,
			onMouseUp: @onEvent,
			onContextMenu: @onEvent,
			onClick: @onEvent
			contentEditable: true
		},
			@state.module.chunks.models.map (chunk, index) ->
				component = chunk.getComponent()

				React.createElement 'div', {
					className: 'component'
					'data-component-type': chunk.get 'type'
					'data-component-index': index
					'data-oboid': chunk.cid
					'data-server-index': chunk.get 'index'
					'data-server-id': chunk.get 'id'
					'data-server-derived-from': chunk.get 'derivedFrom'
					'data-changed': chunk.dirty
					# 'data-encoded': if history?.current?.lo?.chunks?[index]? then JSON.stringify(history.current.lo.chunks[index]) else ''
					key: index
					style: {
						opacity: if not activeChunk? or chunk is activeChunk then '1' else '0.2'
					}
				},
					React.createElement component, {
						chunk: chunk
						updateFn: updateFn
						activateFn: activateFn
						showModalFn: showModalFn
						isActive: activeChunk is chunk
						selection: selection
					}



module.exports = EditorPage