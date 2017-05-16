# class Command
# 	constructor: ->

# 	callComponentFn: (fn, sel, chunk, data) ->
# 		chunk.callComponentFn fn, sel, data

# 	deleteSelection: (sel) ->
# 		return if text.type is 'caret'

# 		for node in text.inbetween
# 			node.remove()

# 		@callComponentFn 'deleteSelection', sel, text.start.chunk

# 		if text.type is 'chunkSpan'
# 			@callComponentFn 'deleteSelection', sel, text.end.chunk
# 			if @callComponentFn('acceptMerge', sel, text.end.chunk, [sel.start.chunk])
# 				@callComponentFn 'merge', sel, text.start.chunk, [sel.end.chunk]

# 		sel.collapse()

# 	deleteKey: (sel) ->
# 		if text.type is 'caret'
# 			caretEdge = @callComponentFn 'getCaretEdge', text.start.chunk
# 			deleteForwards = event.keyCode is Keyboard.DELETE
# 			switch
# 				when caretEdge is 'start' and not deleteForwards
# 					if @callComponentFn('acceptMerge', text.start.chunk, [sel.start.chunk.prevSibling()])
# 						@send 'merge', text.start.chunk.prevSibling(), [sel.start.chunk]

# 				when caretEdge is 'end' and deleteForwards
# 					if @callComponentFn('acceptMerge', text.start.chunk.nextSibling(), [sel.start.chunk])
# 						@send 'merge', text.start.chunk, [sel.start.chunk.nextSibling()]

# 				else
# 					@send 'deleteText', text.start.chunk, [event.keyCode is Keyboard.DELETE]
# 		else
# 			@deleteSelection sel