# merge = require './merge'
Command = require './command'

module.exports = (commandEvent, range, text) ->
	console.log 'deleteText', range

	sel = commandEvent.sel

	console.log sel, sel.toDescriptor()

	if sel.type is 'caret'
		console.log 'caret'
		switch commandEvent.data[0]
			when Command.DELETE_BACKWARD
				if range.start is 0 and not range.oboNode.isFirstChild
					id = range.oboNode.prevSibling.id
					pos = range.oboNode.prevSibling.data.text.length
					range.oboNode.prevSibling.merge range.oboNode
					sel.setCaret 't-' + id, pos
				else
					text.deleteText range.start - 1, range.end
					sel.start.textIndex--
			when Command.DELETE_FORWARD
				if range.end is range.oboNode.data.text.length # and not range.oboNode.isLastChild
					console.log 'LETS MERGE', range.oboNode, range.oboNode.nextSibling
					pos = range.oboNode.data.text.length
					range.oboNode.merge range.oboNode.nextSibling
					sel.setCaret 't-' + range.oboNode.id, pos
				else
					text.deleteText sel.start.textIndex, sel.start.textIndex + 1

		sel.collapse()
		return

	if range.type is 'inside'
		console.log 'inside'
		range.oboNode.remove()
	else
		console.log 'a selection'
		text.deleteText range.start, range.end

		if range.type is 'end'
			console.log 'end'
			console.log 'merge', sel.start.styleableText.value, 'with', text.value
			sel.start.styleableText.merge text
			range.oboNode.remove()
			sel.collapse()

		if range.type is 'only'
			sel.collapse()