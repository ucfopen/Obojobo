let CommandHandler;
let { Editor } = window;
import ObojoboDraft from 'ObojoboDraft'

let { TextGroupCommandHandler } = Editor.chunk.textChunk;
let { TextGroupSelection } = ObojoboDraft.textGroup;
let { Chunk } = ObojoboDraft.models;


export default (CommandHandler = class CommandHandler extends TextGroupCommandHandler {
	splitText(selection, chunk, shiftKey) {
		chunk.markDirty();

		let tgs = new TextGroupSelection(chunk, selection.virtual);

		if (tgs.start.isGroupStart) {
			// super selection, chunk, shiftKey
			let newChunk = Chunk.create();
			chunk.addChildBefore(newChunk);
			return;
		}


		let newText = tgs.start.text.split(tgs.start.offset);

		let newNode = Chunk.create(); //@TODO - assumes it has a textGroup
		newNode.modelState.textGroup.first.text = newText;
		chunk.addChildAfter(newNode);

		// selection.setFutureCaret newNode, { offset: 0, groupIndex: 0 }
		// TextGroupSelection.setCaretToGroupStart newNode, selection.virtual
		return newNode.selectStart();
	}
});