deleteText = require './deletetext'

module.exports = (commandEvent, range, text) ->
	sel = commandEvent.sel

	if sel.type isnt 'caret'
		deleteText commandEvent, range, text

	if range.type is 'only' or range.type is 'start'
		newSibling = range.oboNode.splitText range.start

	if range.type is 'only' or range.type is 'end'
		#@TODO
		sel.setCaret 't-' + range.oboNode.nextSibling.id, 0