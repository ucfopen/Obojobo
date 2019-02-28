// Utility methods for dealing with chunks

const send = function(fn, chunkOrChunks, selection, data = []) {
	if (!(chunkOrChunks instanceof Array)) {
		return chunkOrChunks.callCommandFn(fn, data)
	}

	const chunks = chunkOrChunks
	const results = []
	for (const chunk of Array.from(chunks)) {
		results.push(chunk.callCommandFn(fn, data))
	}

	return results
}

const deleteSelection = function(selection) {
	if (selection.virtual.type === 'caret') {
		return
	}

	for (const node of Array.from(selection.virtual.inbetween)) {
		node.remove()
	}

	selection.saveVirtualSelection()
	selection.startChunk.deleteSelection()
	selection.restoreVirtualSelection()

	if (selection.virtual.type === 'chunkSpan') {
		selection.endChunk.deleteSelection()
		if (selection.endChunk.canMergeWith(selection.startChunk)) {
			selection.startChunk.merge(selection.endChunk)
		}
	}

	return selection.virtual.collapse()
}

const replaceTextsWithinSelection = function(selection, newChunk, expandSelection = true) {
	selection.virtual.start.chunk.addChildBefore(newChunk)

	if (expandSelection) {
		selection.virtual.start.data.offset = 0
		const { end } = selection.virtual
		end.data.offset = end.chunk.modelState.textGroup.get(end.data.groupIndex).text.length
	}

	return newChunk.replaceSelection()
}

const activateStyle = function(style, selection, styleBrush, data = null) {
	if (selection.virtual.type === 'caret') {
		return styleBrush.add(style, selection.styles[style])
	} else if (selection.styles[style] !== null && typeof selection.styles[style] !== 'undefined') {
		return send('unstyleSelection', selection.virtual.all, selection, [style, data])
	} else {
		return send('styleSelection', selection.virtual.all, selection, [style, data])
	}
}

export { send, deleteSelection, activateStyle, replaceTextsWithinSelection }
