# @TODO - dynamically/batch include these
commandHandlers =
	'insertText': require './inserttext'
	'deleteText': require './deletetext'
	'splitText': require './splittext'
	'toggleStyleText': require './togglestyletext'

module.exports =
	handleCommand: (text, commandEvent, range) ->
		return if not commandHandlers[commandEvent.command]?

		commandHandlers[commandEvent.command] commandEvent, range, text