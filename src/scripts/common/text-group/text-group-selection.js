// Describes a selection in the context of TextGroups for a single chunk

import TextGroupCursor from './text-group-cursor'

import VirtualCursor from '../../common/selection/virtual-cursor'
import DOMUtil from '../../common/page/dom-util'
import { EMPTY_CHAR as emptyChar } from '../../common/text/text-constants'

const getCursors = function(chunk, virtualSelection) {
	if (!virtualSelection) {
		return {
			start: null,
			end: null
		}
	}

	const chunkStart = TextGroupSelection.getGroupStartCursor(chunk)
	const chunkEnd = TextGroupSelection.getGroupEndCursor(chunk)
	const position = virtualSelection.getPosition(chunk)

	switch (position) {
		case 'start':
			return {
				start: new TextGroupCursor(virtualSelection.start),
				end: chunkEnd
			}

		case 'end':
			return {
				start: chunkStart,
				end: new TextGroupCursor(virtualSelection.end)
			}

		case 'contains':
			return {
				start: new TextGroupCursor(virtualSelection.start),
				end: new TextGroupCursor(virtualSelection.end)
			}

		case 'inside':
			return {
				start: chunkStart,
				end: chunkEnd
			}

		default:
			return {
				start: null,
				end: null
			}
	}
}

class TextGroupSelection {
	static getGroupStartCursor(chunk) {
		TextGroupSelection.getTextStartCursor(chunk, 0)
	}

	static getGroupEndCursor(chunk) {
		TextGroupSelection.getTextEndCursor(chunk, chunk.modelState.textGroup.length - 1)
	}

	static getTextStartCursor(chunk, groupIndex) {
		const virtCur = new VirtualCursor(chunk, { groupIndex, offset: 0 })
		return new TextGroupCursor(virtCur)
	}

	static getTextEndCursor(chunk, groupIndex) {
		const virtCur = new VirtualCursor(chunk, {
			groupIndex,
			offset: chunk.modelState.textGroup.get(groupIndex).text.length
		})
		return new TextGroupCursor(virtCur)
	}

	static selectGroup(chunk, virtualSelection) {
		const start = TextGroupSelection.getGroupStartCursor(chunk)
		const end = TextGroupSelection.getGroupEndCursor(chunk)

		virtualSelection.setStart(start.virtualCursor.chunk, start.virtualCursor.data)
		return virtualSelection.setEnd(end.virtualCursor.chunk, end.virtualCursor.data)
	}

	static selectText(chunk, groupIndex, virtualSelection) {
		const start = TextGroupSelection.getTextStartCursor(chunk, groupIndex)
		const end = TextGroupSelection.getTextEndCursor(chunk, groupIndex)

		virtualSelection.setStart(start.virtualCursor.chunk, start.virtualCursor.data)
		return virtualSelection.setEnd(end.virtualCursor.chunk, end.virtualCursor.data)
	}

	static setCaretToGroupStart(chunk, virtualSelection) {
		TextGroupSelection.selectGroup(chunk, virtualSelection)
		return virtualSelection.collapse()
	}

	static setCaretToTextStart(chunk, groupIndex, virtualSelection) {
		TextGroupSelection.selectText(chunk, groupIndex, virtualSelection)
		return virtualSelection.collapse()
	}

	static setCaretToGroupEnd(chunk, virtualSelection) {
		TextGroupSelection.selectGroup(chunk, virtualSelection)
		return virtualSelection.collapseToEnd()
	}

	static setCaretToTextEnd(chunk, groupIndex, virtualSelection) {
		TextGroupSelection.selectText(chunk, groupIndex, virtualSelection)
		return virtualSelection.collapseToEnd()
	}

	static getCursorDataFromDOM(targetTextNode, offset) {
		let groupIndex, groupIndexAttr
		let totalCharactersFromStart = 0

		const oboTextNode = DOMUtil.findParentWithAttr(targetTextNode, 'data-group-index')

		if (oboTextNode) {
			groupIndexAttr = oboTextNode.getAttribute('data-group-index')
			groupIndex = parseInt(groupIndexAttr, 10)
			if (isNaN(groupIndex)) {
				groupIndex = groupIndexAttr
			}
		}

		if (oboTextNode === null || oboTextNode.textContent === emptyChar) {
			return {
				offset: 0,
				groupIndex
			}
		}

		for (const textNode of Array.from(DOMUtil.getTextNodesInOrder(oboTextNode))) {
			if (textNode === targetTextNode) {
				break
			}
			totalCharactersFromStart += textNode.nodeValue.length
		}

		let anchor = false
		if (groupIndexAttr.indexOf('anchor:') === 0) {
			anchor = groupIndexAttr.substr(groupIndexAttr.indexOf(':') + 1)
		}

		offset += totalCharactersFromStart
		if (anchor) {
			offset = 0
		}

		return {
			offset,
			groupIndex
		}
	}

	constructor(chunk, virtualSelection) {
		this.chunk = chunk
		this.virtualSelection = virtualSelection
	}

	includes(item) {
		if (this.type === 'none') {
			return false
		}

		const groupIndex = item.index
		return this.start.groupIndex === groupIndex || this.end.groupIndex === groupIndex
	}

	selectGroup() {
		return TextGroupSelection.selectGroup(this.chunk, this.virtualSelection)
	}

	selectText(groupIndex) {
		return TextGroupSelection.selectText(this.chunk, groupIndex, this.virtualSelection)
	}

	setCaretToGroupStart() {
		return TextGroupSelection.setCaretToGroupStart(this.chunk, this.virtualSelection)
	}

	setCaretToTextStart(groupIndex) {
		return TextGroupSelection.setCaretToTextStart(this.chunk, groupIndex, this.virtualSelection)
	}

	setCaretToGroupEnd() {
		return TextGroupSelection.setCaretToGroupEnd(this.chunk, this.virtualSelection)
	}

	setCaretToTextEnd(groupIndex) {
		return TextGroupSelection.setCaretToTextEnd(this.chunk, groupIndex, this.virtualSelection)
	}

	setCaret(groupIndex, offset) {
		return this.virtualSelection.setCaret(this.chunk, { groupIndex, offset })
	}

	setStart(groupIndex, offset) {
		return this.virtualSelection.setStart(this.chunk, { groupIndex, offset })
	}

	setEnd(groupIndex, offset) {
		return this.virtualSelection.setEnd(this.chunk, { groupIndex, offset })
	}

	getAllSelectedTexts() {
		if (
			this.start === null ||
			typeof this.start === 'undefined' ||
			this.end === null ||
			typeof this.end === 'undefined'
		) {
			return []
		}

		const all = []
		for (
			let i = this.start.groupIndex, end = this.end.groupIndex, asc = this.start.groupIndex <= end;
			asc ? i <= end : i >= end;
			asc ? i++ : i--
		) {
			all.push(this.chunk.modelState.textGroup.get(i))
		}

		return all
	}

	get type() {
		const cursors = getCursors(this.chunk, this.virtualSelection)
		const { position } = this

		switch (false) {
			case cursors.start !== null && cursors.end !== null:
				return 'none'
			case position !== 'contains' ||
				cursors.start.groupIndex !== cursors.end.groupIndex ||
				cursors.start.offset !== cursors.end.offset:
				return 'caret'
			case cursors.start.groupIndex !== cursors.end.groupIndex:
				return 'TextSpan'
			default:
				return 'multipleTextSpan'
		}
	}

	get start() {
		return getCursors(this.chunk, this.virtualSelection).start
	}

	get end() {
		return getCursors(this.chunk, this.virtualSelection).end
	}

	get position() {
		return this.virtualSelection.getPosition(this.chunk)
	}
}

export default TextGroupSelection
