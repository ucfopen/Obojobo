import BaseSelectionHandler from '../../../common/chunk/base-selection-handler'
import TextGroupSelection from '../../../common/text-group/text-group-selection'
import { getDomPosition } from './text-group-el-util'

export default class TextGroupSelectionHandler extends BaseSelectionHandler {
	selectStart(selection, chunk, asRange = false) {
		selection.virtual.start = TextGroupSelection.getGroupStartCursor(chunk).virtualCursor
		if (!asRange) {
			return selection.virtual.collapse()
		}
	}

	selectEnd(selection, chunk, asRange = false) {
		selection.virtual.end = TextGroupSelection.getGroupEndCursor(chunk).virtualCursor
		if (!asRange) {
			return selection.virtual.collapseToEnd()
		}
	}

	selectAll(selection, chunk) {
		return TextGroupSelection.selectGroup(chunk, selection.virtual)
	}

	getCopyOfSelection(selection, chunk, cloneId = false) {
		const clone = chunk.clone(cloneId)

		const position = selection.virtual.getPosition(chunk)
		if (position === 'contains' || position === 'start' || position === 'end') {
			const sel = new TextGroupSelection(chunk, selection.virtual)

			const chunkStart = TextGroupSelection.getGroupStartCursor(chunk)
			const chunkEnd = TextGroupSelection.getGroupEndCursor(chunk)

			clone.modelState.textGroup.deleteSpan(
				sel.end.groupIndex,
				sel.end.offset,
				chunkEnd.groupIndex,
				chunkEnd.offset,
				true,
				this.mergeTextGroups
			)
			clone.modelState.textGroup.deleteSpan(
				chunkStart.groupIndex,
				chunkStart.offset,
				sel.start.groupIndex,
				sel.start.offset,
				true,
				this.mergeTextGroups
			)
		}

		return clone
	}

	getVirtualSelectionStartData(selection) {
		if (!selection.dom || !selection.dom.startText) return null

		return TextGroupSelection.getCursorDataFromDOM(
			selection.dom.startText,
			selection.dom.startOffset
		)
	}

	getVirtualSelectionEndData(selection) {
		if (!selection.dom || !selection.dom.startText) return null

		return TextGroupSelection.getCursorDataFromDOM(selection.dom.endText, selection.dom.endOffset)
	}

	getDOMSelectionStart(selection) {
		return getDomPosition(selection.virtual.start)
	}

	getDOMSelectionEnd(selection) {
		return getDomPosition(selection.virtual.end)
	}

	areCursorsEquivalent(selectionWhichIsNullTODO, chunk, thisCursor, otherCursor) {
		return (
			thisCursor.chunk === otherCursor.chunk &&
			thisCursor.data.offset === otherCursor.data.offset &&
			thisCursor.data.groupIndex === otherCursor.data.groupIndex
		)
	}

	highlightSelection(selection, chunk) {
		chunk.markDirty()

		const sel = new TextGroupSelection(chunk, selection.virtual)

		return chunk.modelState.textGroup.styleText(
			sel.start.groupIndex,
			sel.start.offset,
			sel.end.groupIndex,
			sel.end.offset,
			'_comment',
			{}
		)
	}
}
