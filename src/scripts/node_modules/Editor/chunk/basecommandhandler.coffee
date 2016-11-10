Chunk = require 'ObojoboDraft/Common/models/obomodel'

class BaseCommandHandler
	getCaretEdge: (selection, chunk) -> 'startAndEnd'
	isEmpty: (selection, chunk) -> false
	canRemoveSibling: (selection, chunk) -> false
	insertText: (selection, chunk, textToInsert, stylesToApply = null, stylesToRemove = null) -> false
	deleteText: (selection, chunk, deleteForwards) -> false
	onEnter: (selection, chunk, shiftKey) -> false
	splitText: (selection, chunk) -> false
	deleteSelection: (selection, chunk) -> false
	styleSelection: (selection, chunk, styleType, styleData) -> false
	unstyleSelection: (selection, chunk, styleType, styleData) -> false
	getSelectionStyles: (selection, chunk) -> []
	canMergeWith: (selection, digestedChunk, consumerChunk) -> false
	merge: (selection, consumerChunk, digestedChunk, mergeText = true) ->
		digestedChunk.remove()
		consumerChunk.selectEnd()
	indent: (selection, chunk, decreaseIndent) -> false
	onTab: (selection, chunk, untab) -> false
	acceptAbsorb: (selection, chunkToBeDigested, consumerChunk) -> false
	absorb: (selection, consumerChunk, digestedChunk) -> false
	replaceSelection: (selection, newChunk) ->
		newChunk.moveToBottom()

		data = newChunk.modelState

		if selection.virtual.type isnt 'chunkSpan'
			selection.startChunk.split()

			target = selection.startChunk
			target.addChildBefore newChunk

			newChunk.absorb target
		else
			startChunk = selection.startChunk

			selection.saveVirtualSelection()

			startChunk.split()
			selection.restoreVirtualSelection()

			placeholderChunk = Chunk.create()
			startChunk.addChildBefore placeholderChunk

			selection.endChunk.split()
			selection.restoreVirtualSelection()

			# Create a Text chunk to use as the mother to all of the newly
			# created chunks. We'll merge each one into it, then absorb it
			tmpChunk = Chunk.create()
			tmpChunk.modelState.textGroup.clear()
			startChunk.addChildBefore tmpChunk

			stopChunk = selection.endChunk.nextSibling()

			chunk = startChunk
			while chunk isnt stopChunk and chunk?
				chunk.selectEnd()

				nextSibling = chunk.nextSibling()

				if tmpChunk.canMergeWith(chunk)
					tmpChunk.merge chunk, false

				chunk.remove()

				chunk = nextSibling

			newChunk.absorb tmpChunk
			placeholderChunk.replaceWith newChunk

		newChunk.selectAll()

	split: (selection, chunk) -> false
	getDOMStateBeforeInput: (selection, chunk) -> null
	getDOMModificationAfterInput: (selection, chunk, domStateBefore) -> null
	applyDOMModification: (selection, chunk, domModifications) -> null
	onSelectAll: (selection, chunk) -> false
	getTextMenuCommands: (selection, chunk) -> []
	paste: (selection, chunk, text, html, chunks) -> false


module.exports = BaseCommandHandler