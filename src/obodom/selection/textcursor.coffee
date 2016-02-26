class TextCursor
	constructor: (@chunk = null, @node = null, @offset = null) ->

	clone: ->
		new TextCursor @chunk, @node, @offset


module.exports = TextCursor