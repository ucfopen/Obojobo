import Common from 'Common'

const { TextGroupSelectionHandler } = Common.chunk.textChunk
const { TextGroupSelection } = Common.textGroup

export default class SelectionHandler extends TextGroupSelectionHandler {
	selectAll(selection, chunk) {
		const tgs = new TextGroupSelection(chunk, selection.virtual)

		if (tgs.type !== 'multipleTextSpan') {
			return tgs.selectText(tgs.start.groupIndex)
		} else {
			return tgs.selectGroup()
		}
	}
}
