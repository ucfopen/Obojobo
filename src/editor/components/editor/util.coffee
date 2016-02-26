# Utility methods for dealing with chunks

send = (fn, chunkOrChunks, selection, data = []) ->
	if not (chunkOrChunks instanceof Array)
		return chunkOrChunks.callComponentFn fn, selection, data

	chunks = chunkOrChunks
	results = []
	for chunk in chunks
		results.push chunk.callComponentFn fn, selection, data

	results


deleteSelection = (selection) ->
	return if selection.text.type is 'caret'

	for node in selection.text.inbetween
		node.remove()

	send 'deleteSelection', selection.text.start.chunk, selection

	if selection.text.type is 'nodeSpan'
		send 'deleteSelection', selection.text.end.chunk, selection
		if send('canMergeWith', selection.text.end.chunk, selection, [selection.text.start.chunk])
			send 'merge', selection.text.start.chunk, selection, [selection.text.end.chunk]

	selection.text.collapse()


activateStyle = (style, selection, styleBrush) ->
	if selection.text.type is 'caret'
		styleBrush.add style, selection.styles[style]?
	else
		if selection.styles[style]?
			send 'unstyleSelection', selection.text.all, selection, [style]
		else
			send 'styleSelection', selection.text.all, selection, [style]


module.exports = {
	send: send
	deleteSelection: deleteSelection
	activateStyle: activateStyle
}