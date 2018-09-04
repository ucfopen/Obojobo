import Common from 'Common'

let SelectionHandler

let { TextGroupSelectionHandler } = Common.chunk.textChunk
let { TextGroupSelection } = Common.textGroup

export default (SelectionHandler = class SelectionHandler extends TextGroupSelectionHandler {
	selectAll(selection, chunk) {
		let tgs = new TextGroupSelection(chunk, selection.virtual)

		if (tgs.type !== 'multipleTextSpan') {
			return tgs.selectText(tgs.start.groupIndex)
		} else {
			return tgs.selectGroup()
		}
	}
})
