// Describes a selection in the context of TextGroups for a single chunk

import TextGroupCursor from './text-group-cursor';

import VirtualCursor from 'ObojoboDraft/Common/selection/virtual-cursor';
import DOMUtil from 'ObojoboDraft/Common/page/dom-util';
import { EMPTY_CHAR as emptyChar } from 'ObojoboDraft/Common/text/text-constants';


let getCursors = function(chunk, virtualSelection) {
	if (!virtualSelection) {
		return {
			start: null,
			end: null
		};
	}

	let chunkStart = TextGroupSelection.getGroupStartCursor(chunk);
	let chunkEnd = TextGroupSelection.getGroupEndCursor(chunk);
	let position = virtualSelection.getPosition(chunk);

	switch (position) {
		case 'start':
			return {
				start: new TextGroupCursor(virtualSelection.start),
				end:   chunkEnd
			};

		case 'end':
			return {
				start: chunkStart,
				end:   new TextGroupCursor(virtualSelection.end)
			};

		case 'contains':
			return {
				start: new TextGroupCursor(virtualSelection.start),
				end:   new TextGroupCursor(virtualSelection.end)
			};

		case 'inside':
			return {
				start: chunkStart,
				end:   chunkEnd
			};

		default:
			return {
				start: null,
				end: null
			};
	}
};


class TextGroupSelection {
	constructor(chunk, virtualSelection) {
		this.chunk = chunk;
		this.virtualSelection = virtualSelection;
	}

	// getFrozenSelection: ->
	// 	new TextGroupSelection(chunk, virtualSelection.clone());

	includes(item) {
		if (this.type === 'none') { return false; }

		let groupIndex = item.index;
		return (this.start.groupIndex === groupIndex) || (this.end.groupIndex === groupIndex);
	}

	selectGroup() {
		return TextGroupSelection.selectGroup(this.chunk, this.virtualSelection);
	}

	selectText(groupIndex) {
		return TextGroupSelection.selectText(this.chunk, groupIndex, this.virtualSelection);
	}

	setCaretToGroupStart() {
		return TextGroupSelection.setCaretToGroupStart(this.chunk, this.virtualSelection);
	}

	setCaretToTextStart(groupIndex) {
		return TextGroupSelection.setCaretToTextStart(this.chunk, groupIndex, this.virtualSelection);
	}

	setCaretToGroupEnd() {
		return TextGroupSelection.setCaretToGroupEnd(this.chunk, this.virtualSelection);
	}

	setCaretToTextEnd(groupIndex) {
		return TextGroupSelection.setCaretToTextEnd(this.chunk, groupIndex, this.virtualSelection);
	}

	setCaret(groupIndex, offset) {
		return this.virtualSelection.setCaret(this.chunk, { groupIndex, offset });
	}

	setStart(groupIndex, offset) {
		return this.virtualSelection.setStart(this.chunk, { groupIndex, offset });
	}

	setEnd(groupIndex, offset) {
		return this.virtualSelection.setEnd(this.chunk, { groupIndex, offset });
	}

	getAllSelectedTexts() {
		if (((this.start != null ? this.start.text : undefined) == null) || ((this.end != null ? this.end.text : undefined) == null)) { return []; }

		let all = [];
		for (let i = this.start.groupIndex, end = this.end.groupIndex, asc = this.start.groupIndex <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
			all.push(this.chunk.modelState.textGroup.get(i));
		}

		return all;
	}
}


Object.defineProperties(TextGroupSelection.prototype, {
	type: {
		get() {
			let cursors = getCursors(this.chunk, this.virtualSelection);
			let { position } = this;

			switch (false) {
				case (cursors.start !== null) && (cursors.end !== null): return 'none';
				case (position !== 'contains') || (cursors.start.groupIndex !== cursors.end.groupIndex) || (cursors.start.offset !== cursors.end.offset): return 'caret';
				case cursors.start.groupIndex !== cursors.end.groupIndex: return 'TextSpan';
				default: return 'multipleTextSpan';
			}
		}
	},

	start: { get() { return getCursors(this.chunk, this.virtualSelection).start; }
},
	end: { get() { return getCursors(this.chunk, this.virtualSelection).end; }
},
	position: { get() { return this.virtualSelection.getPosition(this.chunk); }
}
});


TextGroupSelection.getGroupStartCursor = chunk => TextGroupSelection.getTextStartCursor(chunk, 0);

TextGroupSelection.getGroupEndCursor = chunk => TextGroupSelection.getTextEndCursor(chunk, chunk.modelState.textGroup.length - 1);

TextGroupSelection.getTextStartCursor = function(chunk, groupIndex) {
	let virtCur = new VirtualCursor(chunk, { groupIndex, offset:0 });
	return new TextGroupCursor(virtCur);
};

TextGroupSelection.getTextEndCursor = function(chunk, groupIndex) {
	let virtCur = new VirtualCursor(chunk, { groupIndex, offset:chunk.modelState.textGroup.get(groupIndex).text.length });
	return new TextGroupCursor(virtCur);
};

TextGroupSelection.selectGroup = function(chunk, virtualSelection) {
	let start = TextGroupSelection.getGroupStartCursor(chunk);
	let end = TextGroupSelection.getGroupEndCursor(chunk);

	virtualSelection.setStart(start.virtualCursor.chunk, start.virtualCursor.data);
	return virtualSelection.setEnd(end.virtualCursor.chunk, end.virtualCursor.data);
};

TextGroupSelection.selectText = function(chunk, groupIndex, virtualSelection) {
	let start = TextGroupSelection.getTextStartCursor(chunk, groupIndex);
	let end = TextGroupSelection.getTextEndCursor(chunk, groupIndex);

	virtualSelection.setStart(start.virtualCursor.chunk, start.virtualCursor.data);
	return virtualSelection.setEnd(end.virtualCursor.chunk, end.virtualCursor.data);
};

TextGroupSelection.setCaretToGroupStart = function(chunk, virtualSelection) {
	TextGroupSelection.selectGroup(chunk, virtualSelection);
	return virtualSelection.collapse();
};

TextGroupSelection.setCaretToTextStart = function(chunk, groupIndex, virtualSelection) {
	TextGroupSelection.selectText(chunk, groupIndex, virtualSelection);
	return virtualSelection.collapse();
};

TextGroupSelection.setCaretToGroupEnd = function(chunk, virtualSelection) {
	TextGroupSelection.selectGroup(chunk, virtualSelection);
	return virtualSelection.collapseToEnd();
};

TextGroupSelection.setCaretToTextEnd = function(chunk, groupIndex, virtualSelection) {
	TextGroupSelection.selectText(chunk, groupIndex, virtualSelection);
	return virtualSelection.collapseToEnd();
};

TextGroupSelection.getCursorDataFromDOM = function(targetTextNode, offset) {
	// console.log 'getOboTextInfo', targetTextNode, offset

	let groupIndex, groupIndexAttr;
	let totalCharactersFromStart = 0;
	// element ?= DOMUtil.getOboElementFromChild targetTextNode.parentElement, 'chunk'

	let oboTextNode = DOMUtil.findParentWithAttr(targetTextNode, 'data-group-index');


	if (oboTextNode) {
		groupIndexAttr = oboTextNode.getAttribute('data-group-index');
		groupIndex = parseInt(groupIndexAttr, 10);
		if (isNaN(groupIndex)) { groupIndex = groupIndexAttr; }
	}

	if ((oboTextNode == null) || (oboTextNode.textContent === emptyChar)) {
		return {
			offset: 0,
			groupIndex
		};
	}

	for (let textNode of Array.from(DOMUtil.getTextNodesInOrder(oboTextNode))) {
		if (textNode === targetTextNode) { break; }
		totalCharactersFromStart += textNode.nodeValue.length;
	}

	let anchor = false;
	if (groupIndexAttr.indexOf('anchor:') === 0) {
		anchor = groupIndexAttr.substr(groupIndexAttr.indexOf(':') + 1);
	}

	offset += totalCharactersFromStart;
	if (anchor) { offset = 0; }

	return {
		offset,
		groupIndex
	};
};


export default TextGroupSelection;