class DOMCursor
	constructor: (@node, @offset) ->


Object.defineProperties DOMCursor.prototype,
	"valid":
		get: -> @node? and @offset?


module.exports = DOMCursor