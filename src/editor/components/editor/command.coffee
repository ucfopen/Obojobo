class Command
	constructor: ->

	callComponentFn: (fn, sel, chunk, data) ->
		chunk.callComponentFn fn, sel, data

	deleteSelection: (sel) ->
		return if sel.type is 'caret'

		for node in sel.inbetween
			node.remove()

		@callComponentFn 'deleteSelection', sel, sel.start.chunk

		if sel.type is 'nodeSpan'
			@callComponentFn 'deleteSelection', sel, sel.end.chunk
			if @callComponentFn('acceptMerge', sel, sel.end.chunk, [sel.start.chunk])
				@callComponentFn 'merge', sel, sel.start.chunk, [sel.end.chunk]

		sel.collapse()

	deleteKey: (sel) ->
		if sel.type is 'caret'
			caretEdge = @callComponentFn 'getCaretEdge', sel.start.chunk
			deleteForwards = event.keyCode is Keyboard.DELETE
			switch
				when caretEdge is 'start' and not deleteForwards
					if @callComponentFn('acceptMerge', sel.start.chunk, [sel.start.chunk.prevSibling()])
						@send 'merge', sel.start.chunk.prevSibling(), [sel.start.chunk]

				when caretEdge is 'end' and deleteForwards
					if @callComponentFn('acceptMerge', sel.start.chunk.nextSibling(), [sel.start.chunk])
						@send 'merge', sel.start.chunk, [sel.start.chunk.nextSibling()]

				else
					@send 'deleteText', sel.start.chunk, [event.keyCode is Keyboard.DELETE]
		else
			@deleteSelection sel