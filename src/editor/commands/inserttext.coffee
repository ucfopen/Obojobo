deleteText = require './deletetext'

module.exports = (commandEvent, range, text) ->
	console.log 'INSERT TEXT', commandEvent, range, text

	sel = commandEvent.sel

	if sel.type isnt 'caret'
		deleteText commandEvent, range, text

	if range.type is 'only' or range.type is 'start'
		text.insertText range.start, commandEvent.data[0]
		sel.start.textIndex++

	if range.type is 'only' or range.type is 'end'
		sel.collapse()