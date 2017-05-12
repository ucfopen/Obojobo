import ObojoboDraft from 'ObojoboDraft'

let SelectionHandler;

let { TextGroupSelectionHandler } = ObojoboDraft.chunk.textChunk;
let { TextGroupSelection } = ObojoboDraft.textGroup;

export default (SelectionHandler = class SelectionHandler extends TextGroupSelectionHandler {
	selectAll(selection, chunk) {
		let tgs = new TextGroupSelection(chunk, selection.virtual);

		if (tgs.type !== 'multipleTextSpan') {
			return tgs.selectText(tgs.start.groupIndex);
		} else {
			return tgs.selectGroup();
		}
	}
});