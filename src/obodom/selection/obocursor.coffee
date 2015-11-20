class OboCursor
	constructor: (@chunk = null, @node = null, @offset = null) ->

	clone: ->
		new OboCursor @chunk, @node, @offset


module.exports = OboCursor