BaseCommandHandler = require 'Editor/chunk/basecommandhandler'

FocusableCommandHandler = require './focusablecommandhandler'

class ToggleCommandHandler extends BaseCommandHandler
	constructor: (@textCommandHandler, @focusCommandHandler = new FocusableCommandHandler()) ->

	canMergeWith:        -> @textCommandHandler.canMergeWith.apply this, arguments
	merge:               -> @textCommandHandler.merge.apply this, arguments
	acceptAbsorb:        -> @textCommandHandler.acceptAbsorb.apply this, arguments
	absorb:              -> @textCommandHandler.absorb.apply this, arguments
	getTextMenuCommands: -> @textCommandHandler.getTextMenuCommands.apply this, arguments
	styleSelection:      -> @textCommandHandler.styleSelection.apply this, arguments
	unstyleSelection:    -> @textCommandHandler.unstyleSelection.apply this, arguments
	getSelectionStyles:  -> @textCommandHandler.getSelectionStyles.apply this, arguments

	getCaretEdge: (selection, chunk) ->
		if chunk.isEditing()
			@textCommandHandler.getCaretEdge.apply this, arguments
		else
			@focusCommandHandler.getCaretEdge.apply this, arguments

	canRemoveSibling: (selection, chunk) ->
		if chunk.isEditing()
			@textCommandHandler.canRemoveSibling.apply this, arguments
		else
			@focusCommandHandler.canRemoveSibling.apply this, arguments

	insertText: (selection, chunk, textToInsert, stylesToApply = null, stylesToRemove = null) ->
		if chunk.isEditing()
			@textCommandHandler.insertText.apply this, arguments
		else
			@focusCommandHandler.insertText.apply this, arguments

	deleteText: (selection, chunk, deleteForwards) ->
		if chunk.isEditing()
			@textCommandHandler.deleteText.apply this, arguments
		else
			@focusCommandHandler.deleteText.apply this, arguments

	onEnter: (selection, chunk, shiftKey) ->
		if chunk.isEditing()
			@textCommandHandler.onEnter.apply this, arguments
		else
			@focusCommandHandler.onEnter.apply this, arguments

	splitText: (selection, chunk) ->
		if chunk.isEditing()
			@textCommandHandler.splitText.apply this, arguments
		else
			@focusCommandHandler.splitText.apply this, arguments

	deleteSelection: (selection, chunk) ->
		if chunk.isEditing()
			@textCommandHandler.deleteSelection.apply this, arguments
		else
			@focusCommandHandler.deleteSelection.apply this, arguments

	onTab: (selection, chunk, untab) ->
		if chunk.isEditing()
			@textCommandHandler.onTab.apply this, arguments
		else
			@focusCommandHandler.onTab.apply this, arguments

	split: (selection, chunk) ->
		if chunk.isEditing()
			@textCommandHandler.split.apply this, arguments
		else
			@focusCommandHandler.split.apply this, arguments

	getDOMStateBeforeInput: (selection, chunk) ->
		if chunk.isEditing()
			@textCommandHandler.getDOMStateBeforeInput.apply this, arguments
		else
			@focusCommandHandler.getDOMStateBeforeInput.apply this, arguments

	getDOMModificationAfterInput: (selection, chunk, domStateBefore) ->
		if chunk.isEditing()
			@textCommandHandler.getDOMModificationAfterInput.apply this, arguments
		else
			@focusCommandHandler.getDOMModificationAfterInput.apply this, arguments

	applyDOMModification: (selection, chunk, domModifications) ->
		if chunk.isEditing()
			@textCommandHandler.applyDOMModification.apply this, arguments
		else
			@focusCommandHandler.applyDOMModification.apply this, arguments

	onSelectAll: (selection, chunk) ->
		if chunk.isEditing()
			@textCommandHandler.onSelectAll.apply this, arguments
		else
			@focusCommandHandler.onSelectAll.apply this, arguments

	paste: (selection, chunk, text, html) ->
		if chunk.isEditing()
			@textCommandHandler.paste.apply this, arguments
		else
			@focusCommandHandler.paste.apply this, arguments


module.exports = ToggleCommandHandler