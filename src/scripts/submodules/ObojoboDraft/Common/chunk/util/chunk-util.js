import Chunk from 'ObojoboDraft/Common/models/obo-model';

// Utility methods for dealing with chunks

let send = function(fn, chunkOrChunks, selection, data) {
	if (data == null) { data = []; }
	if (!(chunkOrChunks instanceof Array)) {
		return chunkOrChunks.callCommandFn(fn, data);
	}

	let chunks = chunkOrChunks;
	let results = [];
	for (let chunk of Array.from(chunks)) {
		results.push(chunk.callCommandFn(fn, data));
	}

	return results;
};


let deleteSelection = function(selection) {
	// vs = selection.virtual
	// type = vs.type


	// console.clear()
	// console.log 'deleteSelection'
	// console.log type

	if (selection.virtual.type === 'caret') { return; }
	// console.log JSON.stringify(selection.getSelectionDescriptor(), null, 2);
	// console.log 'con', vs.inbetween

	for (let node of Array.from(selection.virtual.inbetween)) {
		node.remove();
	}

	selection.saveVirtualSelection();

	selection.startChunk.deleteSelection();
	selection.restoreVirtualSelection();

	if (selection.virtual.type === 'chunkSpan') {
		selection.endChunk.deleteSelection();
		if (selection.endChunk.canMergeWith(selection.startChunk)) {
			selection.startChunk.merge(selection.endChunk);
		}
	}

	return selection.virtual.collapse();
};





let replaceTextsWithinSelection = function(selection, newChunk, expandSelection) {
	if (expandSelection == null) { expandSelection = true; }
	selection.virtual.start.chunk.addChildBefore(newChunk);

	if (expandSelection) {
		selection.virtual.start.data.offset = 0;
		let { end } = selection.virtual;
		end.data.offset = end.chunk.modelState.textGroup.get(end.data.groupIndex).text.length;
	}

	return newChunk.replaceSelection();
};


let activateStyle = function(style, selection, styleBrush, data) {
	if (data == null) { data = null; }
	if (selection.virtual.type === 'caret') {
		return styleBrush.add(style, (selection.styles[style] != null));
	} else {
		if (selection.styles[style] != null) {
			return send('unstyleSelection', selection.virtual.all, selection, [style, data]);
		} else {
			return send('styleSelection', selection.virtual.all, selection, [style, data]);
		}
	}
};


export { send, deleteSelection, activateStyle, replaceTextsWithinSelection };