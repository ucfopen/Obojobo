class Command
	constructor: (@type, @data = null) ->

Command.INSERT = 'insert' #insertText
Command.NEW_LINE = 'newLine' #split?
Command.DELETE = 'delete' #remove
Command.CUT = 'cut' #getHTML
Command.STYLE = 'style' #setStyle
Command.INDENT = 'indent' #indent

# Command.DELETE_BACKWARD = 'backward'
# Command.DELETE_FORWARD = 'forward'

Command.SET_STYLE = 'setStyle'
Command.TOGGLE_STYLE = 'toggleStyle'

module.exports = Command