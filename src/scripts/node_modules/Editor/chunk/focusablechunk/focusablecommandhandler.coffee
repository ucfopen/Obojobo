BaseCommandHandler = require 'Editor/chunk/basecommandhandler'

module.exports = class FocusableCommandHandler extends BaseCommandHandler

	deleteText: (selection, chunk, deleteForwards) ->
		chunk.revert()
		chunk.selectAll()