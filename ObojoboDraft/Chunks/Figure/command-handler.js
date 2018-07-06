let CommandHandler
const { Editor } = window
import Common from 'Common'

const { TextGroupCommandHandler } = Editor.chunk.textChunk
const { FocusableCommandHandler } = Editor.chunk.focusableChunk

const { TextGroupSelection } = Common.textGroup
const { Chunk } = Common.models

// deleteSelection

// _revert = (chunk) ->
// 	console.log 'revert'
// 	newChunk = Chunk.create()
// 	chunk.addChildAfter newChunk
// 	newChunk.absorb chunk
// 	newChunk
// 	# chunk.replaceWith newChunk

const _selectionInAnchor = function(selection, chunk) {
	const tgs = new TextGroupSelection(chunk, selection.virtual)
	return (
		(tgs.start != null ? tgs.start.groupIndex : undefined) === 'anchor:main' ||
		(tgs.end != null ? tgs.end.groupIndex : undefined) === 'anchor:main'
	)
}

export default (CommandHandler = class CommandHandler extends TextGroupCommandHandler {
	_revert(chunk) {
		console.log('revert')
		const newChunk = Chunk.create()
		chunk.addChildAfter(newChunk)
		newChunk.absorb(chunk)
		return newChunk
	}

	getCaretEdge(selection, chunk) {
		if (_selectionInAnchor(selection, chunk)) {
			return 'start'
		}
		return super.getCaretEdge(selection, chunk)
	}

	deleteText(selection, chunk, deleteForwards) {
		const tgs = new TextGroupSelection(chunk, selection.virtual)
		const s = tgs.start

		if (s.groupIndex === 'anchor:main') {
			chunk = this._revert(chunk)
			chunk.selectStart()

			if (chunk.prevSibling() && !deleteForwards) {
				chunk.prevSibling().selectEnd()
			}

			return true
		}

		if (!deleteForwards && s.isGroupStart) {
			chunk = this._revert(chunk)
			chunk.selectStart()
			return true
		}

		if (deleteForwards && s.isGroupEnd) {
			return false
		}

		return super.deleteText(selection, chunk, deleteForwards)
	}

	styleSelection(selection, chunk, styleType, styleData) {
		if (_selectionInAnchor(selection, chunk)) {
			return
		}
		return super.styleSelection(selection, chunk, styleType, styleData)
	}

	unstyleSelection(selection, chunk, styleType, styleData) {
		if (_selectionInAnchor(selection, chunk)) {
			return
		}
		return super.unstyleSelection(selection, chunk, styleType, styleData)
	}

	getSelectionStyles(selection, chunk) {
		if (_selectionInAnchor(selection, chunk)) {
			return
		}
		return super.getSelectionStyles(selection, chunk)
	}

	onEnter(selection, chunk, shiftKey) {
		if (_selectionInAnchor(selection, chunk)) {
			TextGroupSelection.setCaretToTextStart(chunk, 0, selection.virtual)
			chunk.splitText()
			chunk.selectEnd()
			return
		}

		return super.onEnter(selection, chunk, shiftKey)
	}

	split(selection, chunk) {
		if (_selectionInAnchor(selection, chunk)) {
			TextGroupSelection.setCaretToTextStart(chunk, 0, selection.virtual)
			chunk.splitText()
			chunk.selectAll()
			return
		}

		return super.split(selection, chunk, shiftKey)
	}

	splitText(selection, chunk, shiftKey) {
		if (_selectionInAnchor(selection, chunk)) {
			return
		}

		chunk.markDirty()

		const tgs = new TextGroupSelection(chunk, selection.virtual)

		const newText = tgs.start.text.split(tgs.start.offset)

		const newNode = Chunk.create()
		newNode.modelState.textGroup.first.text = newText
		chunk.addChildAfter(newNode)

		// selection.setFutureCaret newNode, { offset: 0, groupIndex: 0 }
		// TextGroupSelection.setCaretToGroupStart newNode, selection.virtual
		return newNode.selectStart()
	}

	paste(selection, chunk, text, html, chunks) {
		if (_selectionInAnchor(selection, chunk)) {
			chunk = this._revert(chunk)
			const pasteIntoChunk = Chunk.create()
			chunk.addChildBefore(pasteIntoChunk)
			pasteIntoChunk.selectAll()

			return pasteIntoChunk.paste(text, html, chunks)
		}

		return this.insertText(selection, chunk, text)
	}

	canMergeWith(selection, chunk, otherChunk) {
		return super.canMergeWith(selection, chunk, otherChunk) && chunk.nextSibling() === otherChunk
	}

	canRemoveSibling(selection, sibling) {
		return false
	}

	onSelectAll(selection, chunk) {
		TextGroupSelection.selectText(chunk, 0, selection.virtual)
		return true
	}
})
