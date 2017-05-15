let CommandHandler;
let { Editor } = window;
import ObojoboDraft from 'ObojoboDraft'

let { TextGroupCommandHandler } = Editor.chunk.textChunk;
let { TextGroupSelection } = ObojoboDraft.textGroup;
let { Chunk } = ObojoboDraft.models;

export default (CommandHandler = class CommandHandler extends TextGroupCommandHandler {
	recalculateStartValues(refTextGroup, listStyles) {
		let indentLevel;
		let indents = {};

		for (let item of Array.from(refTextGroup.items)) {
			indentLevel = item.data.indent;
			if ((indents[indentLevel] == null)) {
				indents[indentLevel] = 1;
			} else {
				indents[indentLevel]++;
			}
		}

		return (() => {
			let result = [];
			for (indentLevel in indents) {
				let startAddition = indents[indentLevel];
				let item1;
				let style = listStyles.getSetStyles(indentLevel);
				if (style.start !== null) {
					item1 = style.start += startAddition;
				}
				result.push(item1);
			}
			return result;
		})();
	}

	onEnter(selection, chunk, shiftKey) {
		let afterNode;
		chunk.markDirty();

		let tgs = new TextGroupSelection(chunk, selection.virtual);
		let data = chunk.modelState;

		let item = data.textGroup.get(tgs.start.groupIndex);

		if (item.text.length !== 0) {
			return chunk.splitText();
		}


		// if item.text.length is 0
		if (item.data.indent > 0) {
			item.data.indent--;

			tgs.setCaretToTextStart(tgs.start.groupIndex);

			return;
		}

		let caretInLastItem = tgs.start.text === data.textGroup.last.text;

		if (!caretInLastItem) {
			afterNode = chunk.clone();
			afterNode.modelState.textGroup = data.textGroup.splitBefore(tgs.start.groupIndex + 1);
		}

		let inbetweenNode = Chunk.create();

		data.textGroup.remove(tgs.start.groupIndex);

		chunk.addChildAfter(inbetweenNode);

		if (!caretInLastItem) {
			this.recalculateStartValues(data.textGroup, afterNode.modelState.listStyles);
			inbetweenNode.addChildAfter(afterNode);
		}

		if (chunk.modelState.textGroup.isEmpty) {
			chunk.remove();
		}

		return inbetweenNode.selectStart();
	}
		// return

		// data.textGroup.splitText tgs.start.groupIndex, tgs.start.offset

		// tgs.setCaretToTextStart tgs.start.groupIndex + 1

	// getTextMenuCommands: (selection, chunk) ->
	// 	commands = super selection, chunk
	// 	commands.push {
	// 		label: 'Unindent'
	// 		fn: (selection, chunk) ->
	// 			chunk.indent true
	// 	}
	// 	commands.push {
	// 		label: 'Indent'
	// 		fn: (selection, chunk) ->
	// 			chunk.indent false
	// 	}

	// 	commands

	deleteSelection(selection, chunk) {
		let selType = selection.virtual.type;
		let { textGroup } = chunk.modelState;

		super.deleteSelection(selection, chunk);

		// if more than one chunk was selected and the whole list was deleted then assume
		// we want to revert this list to a Text.
		if ((textGroup.length === 1) && (textGroup.first.text.length === 0) && (selType === 'chunkSpan')) {
			return chunk.revert();
		}
	}

	deleteText(selection, chunk, deleteForwards) {
		chunk.markDirty();

		console.log('deleteText', this, this.recalculateStartValues);

		let tgs = new TextGroupSelection(chunk, selection.virtual);
		let data = chunk.modelState;

		let s = tgs.start;

		// If backspacing at the start of one of the list items (that isn't the first)
		if (!deleteForwards && !s.isFirstText && s.isTextStart && (s.textGroupItem.data.indent > 0)) {
			//...then unindent
			s.textGroupItem.data.indent--;
			return true;
		}

		// if backspacing at the start of an item that is at minimum indent (and we're not attempting to un-indent the whole list)
		if (!deleteForwards && s.isTextStart && (s.textGroupItem.data.indent === 0) && ((s.groupIndex > 0) || (data.indent === 0))) {
			let bottom, top;
			let newChunk = Chunk.create();
			//@TODO - this assumes too much, should use 'absorb'
			newChunk.modelState.textGroup.first.text = s.textGroupItem.text;

			if (s.isFirstText) {
				top    = chunk;
				bottom = chunk.clone();

				bottom.modelState.textGroup.toSlice(1);
				this.recalculateStartValues(bottom.modelState.textGroup, top.modelState.listStyles);

				top.replaceWith(newChunk);
				newChunk.addChildAfter(bottom);

			} else if (s.isLastText) {
				top = chunk;

				top.modelState.textGroup.toSlice(0, data.textGroup.length - 1);

				top.addChildAfter(newChunk);
			} else {
				top    = chunk;
				let middle = newChunk;
				bottom = chunk.clone();

				top.modelState.textGroup.toSlice(0, s.groupIndex);
				bottom.modelState.textGroup.toSlice(s.groupIndex + 2);
				this.recalculateStartValues(top.modelState.textGroup, bottom.modelState.listStyles);

				top.addChildAfter(middle);
				middle.addChildAfter(bottom);
			}

			newChunk.selectStart();

			return true;
		}

		return super.deleteText(selection, chunk, deleteForwards);
	}
});