import OboSelectionRect from 'ObojoboDraft/Common/selection/obo-selection-rect';
import DOMSelection from 'ObojoboDraft/Common/selection/dom-selection';
import VirtualSelection from 'ObojoboDraft/Common/selection/virtual-selection';


class Selection {
	constructor(page) {
		this.setPage(page);
		this.saved = null;
		this.clear();
	}

	saveVirtualSelection() {
		return this.saved = this.virtual.clone();
	}

	restoreVirtualSelection() {
		return this.virtual = this.saved;
	}

	clear() {
		this.rect = null;
		this.chunkRect = null;
		return this.dom = null;
	}

	setPage(page) {
		this.page = page;
		return this.virtual = new VirtualSelection(this.page);
	}

	getSelectionDescriptor() {
		return this.virtual.toObject();
	}

	fromObject(o) {
		this.virtual.fromObject(o);
		this.selectDOM();
		return this.update();
	}

	selectDOM() {
		console.log('SELECTION selectDOM');
		if (((this.virtual.start != null ? this.virtual.start.chunk : undefined) == null) || ((this.virtual.end != null ? this.virtual.end.chunk : undefined) == null)) { return; }
		console.log('startChunk', this.startChunk.cid);
		// console.log @startChunk
		// console.log 'endChunk', @endChunk

		let s = this.startChunk.getDOMSelectionStart();
		let e = this.endChunk.getDOMSelectionEnd();

		// console.log 's', s, 'e', e
		return DOMSelection.set(s.textNode, s.offset, e.textNode, e.offset);
	}

	update() {
		// return if not document.getElementById('editor').contains(document.activeElement)
		// console.log 'UUUUUUUUUUPDATE!'

		console.time('selection.update');
		// @clear()

		console.time('new oboSelection');
		this.dom = new DOMSelection();
		// @chunk.getFromDOMSelection @dom

		this.virtual.fromDOMSelection(this.dom);
		console.timeEnd('new oboSelection');

		console.time('OboSelectionRect.createFromSelection');
		this.rect = OboSelectionRect.createFromSelection();
		this.chunkRect = OboSelectionRect.createFromChunks(this.virtual.all);
		console.timeEnd('OboSelectionRect.createFromSelection');

		return console.timeEnd('selection.update');
	}
}


Object.defineProperties(Selection.prototype, {
	startChunk: { get() {
		if (((this.virtual != null ? this.virtual.start : undefined) == null)) { return null; }
		return this.virtual.start.chunk;
	}
},

	endChunk: { get() {
		if (((this.virtual != null ? this.virtual.end : undefined) == null)) { return null; }
		return this.virtual.end.chunk;
	}
}
});


export default Selection;