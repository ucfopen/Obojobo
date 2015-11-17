module.exports = (commandEvent, range, text) ->
	console.log 'TGS', arguments
	text.toggleStyleText range.start, range.end, commandEvent.data[0]