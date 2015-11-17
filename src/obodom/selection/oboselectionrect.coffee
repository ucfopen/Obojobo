class OboSelectionRect
	constructor: ->
		@type   = OboSelectionRect.TYPE_NODE
		@top    = 0
		@right  = 0
		@bottom = 0
		@left   = 0
		@width  = 0
		@height = 0


Object.defineProperties OboSelectionRect.prototype,
	"valid":
		get: -> @type isnt OboSelectionRect.TYPE_NONE


OboSelectionRect.TYPE_NONE = 'none'
OboSelectionRect.TYPE_TEXT = 'text'
OboSelectionRect.TYPE_CHUNKS = 'chunks'

OboSelectionRect.createFromSelection = ->
	rect = new OboSelectionRect()
	sel = window.getSelection()

	return rect if sel.type.toLowerCase() is "none"

	range = sel.getRangeAt 0
	clientRect = range.getClientRects()[0]
	clientRect = range.getBoundingClientRect() if not clientRect

	rect.type = OboSelectionRect.TYPE_TEXT
	rect.top = clientRect.top
	rect.right = clientRect.right
	rect.bottom = clientRect.bottom
	rect.left = clientRect.left
	rect.width = clientRect.width
	rect.height = clientRect.height

	rect

OboSelectionRect.createFromChunks = (chunks) ->
	rect = new OboSelectionRect()
	rect.type = OboSelectionRect.TYPE_CHUNKS
	rect.top = Infinity
	rect.right = -Infinity
	rect.bottom = -Infinity
	rect.left = Infinity

	for chunk in chunks
		chunkRect = chunk.element.getBoundingClientRect()

		rect.top    = Math.min rect.top, chunkRect.top
		rect.right  = Math.max rect.right, chunkRect.right
		rect.bottom = Math.max rect.bottom, chunkRect.bottom
		rect.left   = Math.min rect.left, chunkRect.left

	rect.width  = rect.right - rect.left
	rect.height = rect.bottom - rect.top

	rect


window.exports = OboSelectionRect