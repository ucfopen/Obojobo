import VirtualCursor from './virtual-cursor'

import DOMUtil from '../../common/page/dom-util'
import DOMSelection from '../../common/selection/dom-selection'

class VirtualSelection {
	constructor(page) {
		this.page = page
		this.clear()
	}

	clear() {
		this.start = null
		return (this.end = null)
	}

	clone() {
		let virtSel = new VirtualSelection(this.page)
		virtSel.start = this.start.clone()
		virtSel.end = this.end.clone()

		return virtSel
	}

	getPosition(chunk) {
		if (
			(this.start != null ? this.start.chunk : undefined) == null ||
			(this.end != null ? this.end.chunk : undefined) == null
		) {
			return 'unknown'
		}

		let chunkIndex = chunk.get('index')
		let startIndex = this.start.chunk.get('index')
		let endIndex = this.end.chunk.get('index')

		if (chunkIndex < startIndex) {
			return 'before'
		}
		if (chunkIndex === startIndex && chunkIndex === endIndex) {
			return 'contains'
		}
		if (chunkIndex === startIndex) {
			return 'start'
		}
		if (chunkIndex < endIndex) {
			return 'inside'
		}
		if (chunkIndex === endIndex) {
			return 'end'
		}
		return 'after'
	}

	collapse() {
		return (this.end = this.start.clone())
	}

	collapseToEnd() {
		return (this.start = this.end.clone())
	}

	setStart(chunk, data) {
		return (this.start = new VirtualCursor(chunk, data))
	}

	setEnd(chunk, data) {
		return (this.end = new VirtualCursor(chunk, data))
	}

	setCaret(chunk, data) {
		this.setStart(chunk, data)
		return this.collapse()
	}

	toObject() {
		let end, start
		if (
			(this.start != null ? this.start.chunk : undefined) == null ||
			(this.start != null ? this.start.data : undefined) == null
		) {
			start = {
				index: -1,
				data: {}
			}
		} else {
			start = {
				index: this.start.chunk.get('index'),
				data: Object.assign({}, this.start.data)
			}
		}

		if (
			(this.end != null ? this.end.chunk : undefined) == null ||
			(this.end != null ? this.end.data : undefined) == null
		) {
			end = {
				index: -1,
				data: {}
			}
		} else {
			end = {
				index: this.end.chunk.get('index'),
				data: Object.assign({}, this.end.data)
			}
		}

		return {
			start,
			end
		}
	}

	fromObject(o) {
		this.setStart(this.page.chunks.at(o.start.index), o.start.data)
		return this.setEnd(this.page.chunks.at(o.end.index), o.end.data)
	}

	fromDOMSelection(domSelection) {
		// console.log 'VS.fDS', domSelection
		if (domSelection == null) {
			domSelection = null
		}
		if (domSelection == null) {
			domSelection = DOMSelection.get()
		}

		// console.log('page be all', @page)

		let startChunkIndex = DOMUtil.findParentAttr(
			domSelection.startContainer,
			'data-component-index'
		)
		let endChunkIndex = DOMUtil.findParentAttr(domSelection.endContainer, 'data-component-index')

		if (!startChunkIndex || !endChunkIndex) {
			return
		}

		// console.log 'VS page', @page

		let startChunk = this.page.chunks.at(startChunkIndex)
		let endChunk = this.page.chunks.at(endChunkIndex)

		if (!startChunk || !endChunk) {
			return
		}

		// console.log 'start', startChunk, 'end', endChunk
		// console.log startChunk.page.module.pages.models.indexOf(startChunk.page)

		this.setStart(startChunk, startChunk.getVirtualSelectionStartData())
		return this.setEnd(endChunk, endChunk.getVirtualSelectionEndData())
	}

	__debug_print() {
		return console.log(JSON.stringify(this.toObject(), null, 4))
	}
}

Object.defineProperties(VirtualSelection.prototype, {
	type: {
		get() {
			switch (false) {
				case !((this.start != null ? this.start.chunk : undefined) == null) &&
					!((this.end != null ? this.end.chunk : undefined) == null):
					return 'none'
				case this.start.chunk.cid === this.end.chunk.cid:
					return 'chunkSpan'
				case !this.start.isEquivalentTo(this.end):
					return 'caret'
				default:
					return 'textSpan'
			}
		}
	},

	all: {
		get() {
			switch (this.type) {
				case 'chunkSpan':
					let all = []
					let cur = this.start.chunk

					while (cur != null && cur !== this.end.chunk.nextSibling()) {
						all.push(cur)
						cur = cur.nextSibling()
					}

					return all

				case 'textSpan':
				case 'caret':
					return (all = [this.start.chunk])

				default:
					return []
			}
		}
	},

	inbetween: {
		get() {
			if (this.type !== 'chunkSpan') {
				return []
			}

			let result = this.all
			result.pop()
			result.shift()

			return result
		}
	}
})

VirtualSelection.fromObject = function(page, o) {
	let vs = new VirtualSelection(page)
	vs.fromObject(page, o)

	return vs
}

VirtualSelection.fromDOMSelection = function(page, domSelection) {
	let vs = new VirtualSelection(page)
	vs.fromDOMSelection(domSelection)

	return vs
}

export default VirtualSelection
