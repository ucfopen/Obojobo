import DOMSelection from '../../common/selection/dom-selection'

class OboSelectionRect {
	constructor() {
		this.type = OboSelectionRect.TYPE_NONE
		this.top = 0
		this.right = 0
		this.bottom = 0
		this.left = 0
		this.width = 0
		this.height = 0
	}
}

Object.defineProperties(OboSelectionRect.prototype, {
	valid: {
		get() {
			return this.type !== OboSelectionRect.TYPE_NONE
		}
	}
})

OboSelectionRect.TYPE_NONE = 'none'
OboSelectionRect.TYPE_CARET = 'caret'
OboSelectionRect.TYPE_SELECTION = 'selection'
OboSelectionRect.TYPE_CHUNKS = 'chunks'

OboSelectionRect.createFromSelection = function() {
	const rect = new OboSelectionRect()
	const sel = new DOMSelection()

	const selType = sel.getType()

	if (selType === 'none') {
		return rect
	}

	const clientRects = sel.getClientRects()

	rect.type = selType === 'caret' ? OboSelectionRect.TYPE_CARET : OboSelectionRect.TYPE_SELECTION
	rect.top = Infinity
	rect.right = -Infinity
	rect.bottom = -Infinity
	rect.left = Infinity

	for (const clientRect of Array.from(clientRects)) {
		rect.top = Math.min(rect.top, clientRect.top)
		rect.right = Math.max(rect.right, clientRect.right)
		rect.bottom = Math.max(rect.bottom, clientRect.bottom)
		rect.left = Math.min(rect.left, clientRect.left)
	}

	rect.width = rect.right - rect.left
	rect.height = rect.bottom - rect.top

	rect.selection = sel
	rect.chunks = null

	return rect
}

OboSelectionRect.createFromChunks = function(chunks = []) {
	const rect = new OboSelectionRect()
	rect.type = OboSelectionRect.TYPE_CHUNKS
	rect.top = Infinity
	rect.right = -Infinity
	rect.bottom = -Infinity
	rect.left = Infinity

	for (const chunk of chunks) {
		if (chunk === null) {
			continue
		}

		const chunkRect = chunk.getDomEl().getBoundingClientRect()

		rect.top = Math.min(rect.top, chunkRect.top)
		rect.right = Math.max(rect.right, chunkRect.right)
		rect.bottom = Math.max(rect.bottom, chunkRect.bottom)
		rect.left = Math.min(rect.left, chunkRect.left)
	}

	rect.width = rect.right - rect.left
	rect.height = rect.bottom - rect.top

	rect.chunks = chunks
	rect.selection = null

	return rect
}

export default OboSelectionRect
