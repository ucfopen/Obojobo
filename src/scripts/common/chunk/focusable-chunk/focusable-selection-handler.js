import BaseSelectionHandler from '../../../common/chunk/base-selection-handler'

class FocusableSelectionHandler extends BaseSelectionHandler {
	getVirtualSelectionStartData(selection, chunk) {
		return {
			groupIndex: 'anchor:main',
			offset: 0
		}
	}

	getVirtualSelectionEndData(selection, chunk) {
		return {
			groupIndex: 'anchor:main',
			offset: 0
		}
	}

	getDOMSelectionStart(selection, chunk) {
		return {
			textNode: chunk.getDomEl().getElementsByClassName('anchor')[0].childNodes[0],
			offset: 0
		}
	}

	getDOMSelectionEnd(selection, chunk) {
		return {
			textNode: chunk.getDomEl().getElementsByClassName('anchor')[0].childNodes[0],
			offset: 0
		}
	}

	selectStart(selection, chunk, asRange) {
		selection.virtual.setStart(chunk, { groupIndex: 'anchor:main', offset: 0 })
		if (!asRange) {
			return selection.virtual.collapse()
		}
	}

	selectEnd(selection, chunk, asRange) {
		selection.virtual.setEnd(chunk, { groupIndex: 'anchor:main', offset: 0 })
		if (!asRange) {
			return selection.virtual.collapseToEnd()
		}
	}

	areCursorsEquivalent(selectionWhichIsNullTODO, chunk, thisCursorData, otherCursorData) {
		return (
			thisCursorData.offset === otherCursorData.offset &&
			thisCursorData.groupIndex === otherCursorData.groupIndex
		)
	}
}

export default FocusableSelectionHandler
