const { Editor } = window
import Common from 'Common'

const { TextGroupCommandHandler } = Editor.chunk.textChunk
const { TextGroupSelection } = Common.textGroup
const { Chunk } = Common.models

export default class CommandHandler extends TextGroupCommandHandler {
	recalculateStartValues(refTextGroup, listStyles) {
		let indentLevel
		const indents = {}

		for (const item of Array.from(refTextGroup.items)) {
			indentLevel = item.data.indent
			if (indents[indentLevel] === null || typeof indents[indentLevel] === 'undefined') {
				indents[indentLevel] = 1
			} else {
				indents[indentLevel]++
			}
		}

		return (() => {
			const result = []
			for (indentLevel in indents) {
				const startAddition = indents[indentLevel]
				let item1
				const style = listStyles.getSetStyles(indentLevel)
				if (style.start !== null) {
					item1 = style.start += startAddition
				}
				result.push(item1)
			}
			return result
		})()
	}

	onEnter(selection, chunk) {
		let afterNode
		chunk.markDirty()

		const tgs = new TextGroupSelection(chunk, selection.virtual)
		const data = chunk.modelState

		const item = data.textGroup.get(tgs.start.groupIndex)

		if (item.text.length !== 0) {
			return chunk.splitText()
		}

		if (item.data.indent > 0) {
			item.data.indent--

			tgs.setCaretToTextStart(tgs.start.groupIndex)

			return
		}

		const caretInLastItem = tgs.start.text === data.textGroup.last.text

		if (!caretInLastItem) {
			afterNode = chunk.clone()
			afterNode.modelState.textGroup = data.textGroup.splitBefore(tgs.start.groupIndex + 1)
		}

		const inbetweenNode = Chunk.create()

		data.textGroup.remove(tgs.start.groupIndex)

		chunk.addChildAfter(inbetweenNode)

		if (!caretInLastItem) {
			this.recalculateStartValues(data.textGroup, afterNode.modelState.listStyles)
			inbetweenNode.addChildAfter(afterNode)
		}

		if (chunk.modelState.textGroup.isEmpty) {
			chunk.remove()
		}

		return inbetweenNode.selectStart()
	}

	deleteSelection(selection, chunk) {
		const selType = selection.virtual.type
		const { textGroup } = chunk.modelState

		super.deleteSelection(selection, chunk)

		// if more than one chunk was selected and the whole list was deleted then assume
		// we want to revert this list to a Text.
		if (textGroup.length === 1 && textGroup.first.text.length === 0 && selType === 'chunkSpan') {
			return chunk.revert()
		}
	}

	deleteText(selection, chunk, deleteForwards) {
		chunk.markDirty()

		const tgs = new TextGroupSelection(chunk, selection.virtual)
		const data = chunk.modelState

		const s = tgs.start

		// If backspacing at the start of one of the list items (that isn't the first)
		if (!deleteForwards && !s.isFirstText && s.isTextStart && s.textGroupItem.data.indent > 0) {
			//...then unindent
			s.textGroupItem.data.indent--
			return true
		}

		// if backspacing at the start of an item that is at minimum indent (and we're not attempting to un-indent the whole list)
		if (
			!deleteForwards &&
			s.isTextStart &&
			s.textGroupItem.data.indent === 0 &&
			(s.groupIndex > 0 || data.indent === 0)
		) {
			let bottom, top
			const newChunk = Chunk.create()
			newChunk.modelState.textGroup.first.text = s.textGroupItem.text

			if (s.isFirstText) {
				top = chunk
				bottom = chunk.clone()

				bottom.modelState.textGroup.toSlice(1)
				this.recalculateStartValues(bottom.modelState.textGroup, top.modelState.listStyles)

				top.replaceWith(newChunk)
				newChunk.addChildAfter(bottom)
			} else if (s.isLastText) {
				top = chunk

				top.modelState.textGroup.toSlice(0, data.textGroup.length - 1)

				top.addChildAfter(newChunk)
			} else {
				top = chunk
				const middle = newChunk
				bottom = chunk.clone()

				top.modelState.textGroup.toSlice(0, s.groupIndex)
				bottom.modelState.textGroup.toSlice(s.groupIndex + 2)
				this.recalculateStartValues(top.modelState.textGroup, bottom.modelState.listStyles)

				top.addChildAfter(middle)
				middle.addChildAfter(bottom)
			}

			newChunk.selectStart()

			return true
		}

		return super.deleteText(selection, chunk, deleteForwards)
	}
}
