let CommandHandler;
let { Editor } = window;
import ObojoboDraft from 'ObojoboDraft'

let { TextGroupCommandHandler } = Editor.chunk.textChunk;
let { TextGroupSelection } = ObojoboDraft.textGroup;

export default (CommandHandler = class CommandHandler extends TextGroupCommandHandler {
	// splitText: (sel, chunk, shiftKey) -> false

	deleteSelection(selection, chunk) {
		chunk.markDirty();

		let tgs = new TextGroupSelection(chunk, selection.virtual);

		chunk.modelState.textGroup.clearSpan(tgs.start.groupIndex, tgs.start.offset, tgs.end.groupIndex, tgs.end.offset);

		if ((tgs.position === 'start') || (tgs.position === 'contains')) {
			// selection.setFutureCaret chunk, { offset: tgs.start.offset, groupIndex: tgs.start.groupIndex }
			return selection.virtual.setCaret(chunk, { offset: tgs.start.offset, groupIndex: tgs.start.groupIndex });
		}
	}

	deleteText(selection, chunk, deleteForwards) {
		// chunk.markDirty()
		// console.clear()

		let tgs = new TextGroupSelection(chunk, selection.virtual);
		let caret = tgs.start;
		if ((caret.isTextStart && !deleteForwards) || (caret.isTextEnd && deleteForwards)) { return false; }

		return super.deleteText(selection, chunk, deleteForwards);
	}

	onSelectAll(selection, chunk) {
		chunk.selectAll();
		return true;
	}

	paste(selection, chunk, text, html) {
		return this.insertText(selection, chunk, text);
	}

	canRemoveSibling(selection, sibling) { return false; }
});