Common = window.ObojoboDraft.Common

ChunkUtil = Common.chunk.util.ChunkUtil
Keyboard = Common.page.Keyboard

module.exports = class InputHandler
	constructor: ->

	send: (fn, chunkOrChunks, data) ->
		ChunkUtil.send fn, chunkOrChunks, @props.selection, data

	onKeyDown: (event, selection, styleBrush) ->
		metaOrCtrlKeyHeld = event.metaKey or event.ctrlKey

		switch event.keyCode
			# DELETE
			when Keyboard.BACKSPACE, Keyboard.DELETE
				event.preventDefault()
				if selection.virtual.type is 'caret'
					caretEdge = ChunkUtil.send 'getCaretEdge', selection.startChunk, selection
					deleteForwards = event.keyCode is Keyboard.DELETE
					chunk = selection.startChunk
					prev = chunk.prevSibling()
					next = chunk.nextSibling()

					deleteSuccessful = ChunkUtil.send 'deleteText', chunk, selection, [deleteForwards]

					if not deleteSuccessful
						switch
							# If cursor is at the start and this is a backspace
							when (caretEdge is 'start' or caretEdge is 'startAndEnd') and not deleteForwards and prev?
								if prev.isEmpty()
									prev.replaceWith chunk
									return true
								# If both chunks agree to be merged with each other
								if ChunkUtil.send('canMergeWith', chunk, selection, [prev]) and ChunkUtil.send('canMergeWith', prev, selection, [chunk])
									#... then previousSibling will merge with this chunk
									ChunkUtil.send 'merge', prev, selection, [chunk]
								else if ChunkUtil.send('canRemoveSibling', chunk, selection, [prev])
									#... else previousSibling simply gets deleted
									prev.remove()

							# If cursor is at the end and this is a foward delete
							when (caretEdge is 'end' or caretEdge is 'startAndEnd') and deleteForwards and next?
								# If both chunks agree to be merged with each other
								if ChunkUtil.send('canMergeWith', chunk, selection, [next]) and ChunkUtil.send('canMergeWith', next, selection, [chunk])
									#... then this chunk will merge with nextSibling
									ChunkUtil.send 'merge', chunk, selection, [next]
								else if ChunkUtil.send('canRemoveSibling', chunk, selection, [next])
									#... else nextSibling simply gets deleted
									next.remove()
				else
					ChunkUtil.deleteSelection selection

				return true

			# INDENT
			when Keyboard.TAB
				# saveAndRenderModuleFn()
				# return true true
				event.preventDefault()

				# ChunkUtil.deleteSelection selection
				ChunkUtil.send 'onTab', selection.virtual.all, selection, [event.shiftKey]
				return true

			# NEW LINE
			when Keyboard.ENTER
				event.preventDefault()
				ChunkUtil.deleteSelection selection
				# ChunkUtil.send 'splitText', selection.startChunk, selection, [event.shiftKey]
				selection.startChunk.onEnter event.shiftKey
				return true

			#@TODO - are these the only ways to change the cursor with the keyboard?
			when Keyboard.LEFT_ARROW, Keyboard.RIGHT_ARROW, Keyboard.UP_ARROW, Keyboard.DOWN_ARROW
				# @history.add null, selection.getSelectionDescriptor()

				if not styleBrush.isClean
					styleBrush.clean()
					return true

				# @prevSel = selection.getSelectionDescriptor()

		if metaOrCtrlKeyHeld
			switch event.keyCode
				# We want to capture ctrl/cmd+b and other such events
				# to stop the browsers default execCommand behavior.
				when 66 #b
					event.preventDefault()

					ChunkUtil.activateStyle 'b', selection, styleBrush

					return true

				when 73 #i
					event.preventDefault()

					ChunkUtil.activateStyle 'i', selection, styleBrush

					return true

				when 65 #a
					if selection.virtual.type isnt 'chunkSpan'
						selectAllWasHandled = ChunkUtil.send 'onSelectAll', selection.startChunk, selection
						event.preventDefault()
						if not selectAllWasHandled
							page = selection.startChunk.page
							page.chunks.first().selectStart true
							page.chunks.last().selectEnd true

						return true

		false